// recaply — summarise your documents with AI.
require('dotenv').config();
const crypto = require('crypto');
const express = require('express');
const Sentry = require('@sentry/node');
const { clerkMiddleware, requireAuth, getAuth } = require('@clerk/express');
const { Pool } = require('pg');
const OpenAI = require('openai');
const Stripe = require('stripe');
const { inngest, sendSummaryEmail } = require('./jobs/email');

Sentry.init({ dsn: process.env.SENTRY_DSN });

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe webhooks need the raw body for signature verification — mounted
// before the JSON parser.
app.post('/billing/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({ error: 'invalid signature' });
  }
  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      await pool.query(
        `INSERT INTO subscriptions (user_id, stripe_customer_id, stripe_subscription_id, status)
         VALUES ($1, $2, $3, 'active')
         ON CONFLICT (user_id) DO UPDATE SET
           stripe_customer_id = EXCLUDED.stripe_customer_id,
           stripe_subscription_id = EXCLUDED.stripe_subscription_id,
           status = 'active', updated_at = now()`,
        [session.client_reference_id, session.customer, session.subscription]
      );
    } else if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const sub = event.data.object;
      await pool.query(
        'UPDATE subscriptions SET status = $1, updated_at = now() WHERE stripe_subscription_id = $2',
        [sub.status, sub.id]
      );
    }
    res.json({ received: true });
  } catch (err) {
    Sentry.captureException(err);
    res.status(500).json({ error: 'webhook handling failed' });
  }
});

app.use(express.json());
app.use(clerkMiddleware());

// Paid features are gated on a live subscription, kept current by the webhook.
async function requireActiveSubscription(req, res, next) {
  try {
    const { userId } = getAuth(req);
    const result = await pool.query(
      "SELECT 1 FROM subscriptions WHERE user_id = $1 AND status IN ('active', 'trialing')",
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(402).json({ error: 'subscription required', checkout: '/billing/checkout' });
    }
    next();
  } catch (err) {
    next(err);
  }
}

app.get('/healthz', (req, res) => res.json({ ok: true }));

// Summaries are cached by content hash — re-uploading the same document
// never pays for inference twice.
app.post('/summarise', requireAuth(), requireActiveSubscription, async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const body = req.body.text;
    const hash = crypto.createHash('sha256').update(body).digest('hex');

    const cached = await pool.query(
      'SELECT summary FROM summary_cache WHERE content_hash = $1',
      [hash]
    );
    let summary;
    if (cached.rows.length > 0) {
      summary = cached.rows[0].summary;
    } else {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Summarise the document in 5 bullet points.' },
          { role: 'user', content: body },
        ],
      });
      summary = completion.choices[0].message.content;
      await pool.query(
        'INSERT INTO summary_cache (content_hash, summary) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [hash, summary]
      );
    }

    const doc = await pool.query(
      'INSERT INTO documents (user_id, filename, summary) VALUES ($1, $2, $3) RETURNING id',
      [userId, req.body.filename, summary]
    );
    // Email goes through the queue — never in the request path.
    await inngest.send({ name: 'summary/created', data: { userId, documentId: doc.rows[0].id } });
    res.json({ summary });
  } catch (err) {
    next(err);
  }
});

app.get('/documents', requireAuth(), async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const limit = Math.min(parseInt(req.query.limit || '25', 10), 100);
    const offset = parseInt(req.query.offset || '0', 10);
    const result = await pool.query(
      `SELECT id, filename, summary, created_at FROM documents
       WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    res.json({ documents: result.rows, limit, offset });
  } catch (err) {
    next(err);
  }
});

app.get('/search', requireAuth(), async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const result = await pool.query(
      `SELECT id, filename, summary FROM documents
       WHERE user_id = $1 AND search_vector @@ plainto_tsquery('english', $2)
       ORDER BY created_at DESC LIMIT 25`,
      [userId, req.query.q || '']
    );
    res.json({ documents: result.rows });
  } catch (err) {
    next(err);
  }
});

// Checkout: card data never touches this app — Stripe hosts the payment page;
// entitlements flow back through the webhook above.
app.post('/billing/checkout', requireAuth(), async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      client_reference_id: userId,
      success_url: 'https://recaply.example/billing/success',
      cancel_url: 'https://recaply.example/billing',
    });
    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
});

Sentry.setupExpressErrorHandler(app);

app.listen(3000, () => console.log('recaply listening on 3000'));
