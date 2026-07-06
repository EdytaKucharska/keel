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

app.use(express.json());
app.use(clerkMiddleware());

app.get('/healthz', (req, res) => res.json({ ok: true }));

// Summaries are cached by content hash — re-uploading the same document
// never pays for inference twice.
app.post('/summarise', requireAuth(), async (req, res, next) => {
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

// Stripe checkout + webhook: payments never touch this app beyond session ids.
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
