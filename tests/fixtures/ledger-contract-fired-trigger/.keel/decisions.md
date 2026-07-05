# Decision Log

> ADR-lite. Append-only: new decisions get new entries; changed decisions mark the old one `superseded by #N`.
> Written by Keel skills after each substantive recommendation. Yours to read and edit — it's your record.

<!-- Entry format:

## #N — [decision in one line] — [date]
- **Skill:** [which Keel skill produced this]
- **Decision:** [what was chosen]
- **Rejected:** [1–2 alternatives and the one-line reason each lost]
- **Reasoning:** [one paragraph — the trade-off that decided it]
- **Status:** active | superseded by #M
-->

## #1 — Use Postgres full-text search for in-app search — 2026-05-02
- **Skill:** tech-evaluation
- **Decision:** Postgres tsvector full-text search for project/file search
- **Rejected:** Algolia (cost + premature vendor adoption at ~1k users); self-hosted Typesense (operational burden for a solo builder)
- **Reasoning:** Search is plumbing, not differentiation, at this stage. Full-text in the database we already run is boring tech with zero new moving parts. Two-way door — the search layer is thin; revisit thresholds recorded as A-1.
- **Status:** active
