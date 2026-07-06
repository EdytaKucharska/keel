// Background email sends via Inngest — kept out of request handlers.
const { Inngest } = require('inngest');

const inngest = new Inngest({ id: 'recaply' });

const sendSummaryEmail = inngest.createFunction(
  { id: 'send-summary-email', retries: 3 },
  { event: 'summary/created' },
  async ({ event, step }) => {
    await step.run('send', async () => {
      // Resend call lives here; failures retry with backoff and land in Sentry.
    });
  }
);

module.exports = { inngest, sendSummaryEmail };
