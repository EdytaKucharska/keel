# Lessons

> Corrections captured so they aren't repeated. When the user corrects a Keel recommendation — or reality does —
> the pattern is recorded here, and skills read it before advising in the same territory again.

<!-- Entry format:

## L-N — [the lesson as a rule] — [date]
- **What happened:** [one line]
- **The rule:** [what to do differently, phrased so a future session can apply it]
-->

## L-1 — Don't fight a brainstorming skill for the exploratory moment; own the technical-approach moment — 2026-07-04
- **What happened:** In the first dogfooding round, a feature prompt routed to a competing `brainstorming` skill and no CTO skill fired at all.
- **The rule:** When a trigger loses to an intent-exploration skill, the fix is a handoff chain (phase-targeted triggers + an intake check that skips re-asking clarified intent), not a broader trigger. Codified in persona §12; guarded by the brainstorm-handoff rows in `tests/triggering-matrix.md`.
