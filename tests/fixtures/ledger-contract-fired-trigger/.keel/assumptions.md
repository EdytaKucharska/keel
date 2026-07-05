# Assumption Ledger

> The "this works if…" list. Every Keel recommendation is conditional; this file is where the conditions live.
> Skills scan the OPEN entries on every invocation — when reality contradicts an assumption, Keel says so.

<!-- Entry format:

## A-N — [the assumption as a sentence] — [date]
- **Backs decision:** #N (from decisions.md)
- **Revisit trigger:** [the observable signal that this assumption broke — a number, an event, a date]
- **Status:** open | held (confirmed still true on [date]) | fired (revisited on [date] → see decision #M)
-->

## A-1 — Postgres full-text search stays adequate for in-app search — 2026-05-02
- **Backs decision:** #1
- **Revisit trigger:** user count passes ~5,000, OR search p95 latency exceeds ~1s, OR search-quality complaints appear
- **Status:** open
