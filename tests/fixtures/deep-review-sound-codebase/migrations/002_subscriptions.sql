CREATE TABLE subscriptions (
  user_id TEXT PRIMARY KEY,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT NOT NULL,
  status TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Webhook updates look up by subscription id.
CREATE INDEX subscriptions_stripe_sub_idx ON subscriptions (stripe_subscription_id);
