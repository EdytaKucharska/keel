# Lessons

> Corrections captured so they aren't repeated. When the user corrects a Keel recommendation — or reality does —
> the pattern is recorded here, and skills read it before advising in the same territory again.

<!-- Entry format:

## L-N — [the lesson as a rule] — [date]
- **What happened:** [one line]
- **The rule:** [what to do differently, phrased so a future session can apply it]
-->

## L-3 — The costume carries no weight; evidence does — 2026-07-13
- **What happened:** First public feedback round (r/claudeskills). The substantive critique, from an engineer who builds AI tooling for a team: (a) persona-based prompting is shown in studies to degrade rather than improve accuracy; (b) nonspecific advisory prompts are "verbose versions of 'make no mistakes'" that waste context; (c) LLMs reliably solve only concrete failure modes with defined success criteria — analysing real APM traces for N+1s worked where "the code must scale" never did; (d) an LLM will always claim it met your criteria, so unclear criteria produce false confidence.
- **The rule:** Every skill step must be checkable in the output (the costume test — delete the identity sentence, behaviour unchanged; persona §3.1, authoring rule §15.9). Repo-aware claims carry cited evidence (`file:line`, command output, verified source) or are labelled hypotheses with the cheap verification named (§15.10, deep-review evidence rule). Where instruments exist — logs, `EXPLAIN`, traces, the real bill — measure before claiming. Points (b)–(d) were partially defended already (checklists name concrete artifacts; self-critique lists what wasn't verified); point (a) was a genuine gap in the docs and is now codified.

## L-2 — Description tuning cannot beat session-level injection; the user's CLAUDE.md is the sanctioned override — 2026-07-05
- **What happened:** After the v0.6.1 description tuning, superpowers still won Keel's build-question prompts. Analysis of its repo showed why: a SessionStart hook injects "'Let's build X' requires brainstorming first… if a skill applies you do not have a choice" into every session — a layer above skill descriptions entirely.
- **The rule:** When a competitor claims a moment via injected session context, stop iterating descriptions — it's structural. The fix is a routing rule in the user's `~/.claude/CLAUDE.md` (user instructions outrank plugin skills, by the competitor's own authority hierarchy) plus explicit `/keel:` invocation. Keel does not inject its own mandate (a standing product decision: taste says no); document the CLAUDE.md pattern instead (README "Living with other plugins").

## L-1 — Don't fight a brainstorming skill for the exploratory moment; own the technical-approach moment — 2026-07-04
- **What happened:** In the first dogfooding round, a feature prompt routed to a competing `brainstorming` skill and no CTO skill fired at all.
- **The rule:** When a trigger loses to an intent-exploration skill, the fix is a handoff chain (phase-targeted triggers + an intake check that skips re-asking clarified intent), not a broader trigger. Codified in persona §12; guarded by the brainstorm-handoff rows in `tests/triggering-matrix.md`.
