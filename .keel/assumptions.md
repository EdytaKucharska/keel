# Assumption Ledger

> The "this works if…" list. Every Keel recommendation is conditional; this file is where the conditions live.
> Skills scan the OPEN entries on every invocation — when reality contradicts an assumption, Keel says so.

<!-- Entry format:

## A-N — [the assumption as a sentence] — [date]
- **Backs decision:** #N (from decisions.md)
- **Revisit trigger:** [the observable signal that this assumption broke — a number, an event, a date]
- **Status:** open | held (confirmed still true on [date]) | fired (revisited on [date] → see decision #M)
-->

## A-1 — Four lenses in one deep-review pass stay coherent and no single lens needs standalone depth — 2026-07-04
- **Backs decision:** #1
- **Revisit trigger:** real usage shows users repeatedly re-invoking deep-review for one lens only (the ROADMAP already earmarks the cost lens → revive `infra-cost-assessment`), OR eval runs show the four-lens report degrading into four mini-reports (`deep-review-prelaunch-gaps.md` rubric dimension 1 failing)
- **Status:** open

## A-2 — `/security-review` remains free, first-party, and good enough to prescribe — 2026-07-04
- **Backs decision:** #2
- **Revisit trigger:** `/security-review` is deprecated, paywalled, or its findings stop being consumable by a non-technical user even with Keel's translation layer
- **Status:** open

## A-3 — Skills can reliably parse and append plain-Markdown ledger files across model updates — 2026-07-04
- **Backs decision:** #3
- **Revisit trigger:** `ledger-contract-fired-trigger.md` drops below pass^5 = 0.8 after a model update, OR user reports of corrupted/rewritten ledger entries
- **Status:** open

## A-4 — Keel's primary users work in a repo where `.keel/` can live — 2026-07-04
- **Backs decision:** #3
- **Revisit trigger:** meaningful demand for memory on the conversational surface (Claude.ai, no filesystem), where the ledger protocol currently skips silently
- **Status:** open
