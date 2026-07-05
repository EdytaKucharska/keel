# Lessons

> Corrections captured so they aren't repeated. When the user corrects a Keel recommendation — or reality does —
> the pattern is recorded here, and skills read it before advising in the same territory again.

<!-- Entry format:

## L-N — [the lesson as a rule] — [date]
- **What happened:** [one line]
- **The rule:** [what to do differently, phrased so a future session can apply it]
-->

## L-2 — Description tuning cannot beat session-level injection; the user's CLAUDE.md is the sanctioned override — 2026-07-05
- **What happened:** After the v0.6.1 description tuning, superpowers still won Keel's build-question prompts. Analysis of its repo showed why: a SessionStart hook injects "'Let's build X' requires brainstorming first… if a skill applies you do not have a choice" into every session — a layer above skill descriptions entirely.
- **The rule:** When a competitor claims a moment via injected session context, stop iterating descriptions — it's structural. The fix is a routing rule in the user's `~/.claude/CLAUDE.md` (user instructions outrank plugin skills, by the competitor's own authority hierarchy) plus explicit `/keel:` invocation. Keel does not inject its own mandate (ROADMAP: taste says no); document the CLAUDE.md pattern instead (README "Living with other plugins").

## L-1 — Don't fight a brainstorming skill for the exploratory moment; own the technical-approach moment — 2026-07-04
- **What happened:** In the first dogfooding round, a feature prompt routed to a competing `brainstorming` skill and no CTO skill fired at all.
- **The rule:** When a trigger loses to an intent-exploration skill, the fix is a handoff chain (phase-targeted triggers + an intake check that skips re-asking clarified intent), not a broader trigger. Codified in persona §12; guarded by the brainstorm-handoff rows in `tests/triggering-matrix.md`.
