CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  summary TEXT,
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(filename, '') || ' ' || coalesce(summary, ''))
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Read patterns: list by user (newest first), full-text search per user.
CREATE INDEX documents_user_created_idx ON documents (user_id, created_at DESC);
CREATE INDEX documents_search_idx ON documents USING gin (search_vector);

CREATE TABLE summary_cache (
  content_hash TEXT PRIMARY KEY,
  summary TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
