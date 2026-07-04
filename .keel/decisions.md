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

## #1 — One deep-review skill instead of four review skills — 2026-07-04
- **Skill:** none (design decision from v0.5, recorded retrospectively at ledger creation)
- **Decision:** Ship the repo-aware review as ONE explicitly-invoked skill (`deep-review`) running four lenses — hygiene, security posture, load-shape, cost — with the ranking doing the prioritisation.
- **Rejected:** Four standalone lens skills (four competing triggers worsen routing, and the user doesn't know which lens they need — that's the point); reviving `tech-hygiene-audit` as-is (its spine is absorbed as the hygiene lens instead).
- **Reasoning:** Routing degradation is this project's most persistent failure mode (`tests/triggering-matrix.md`). Every added trigger competes with every existing one, and the target user cannot pre-diagnose which review they need. One explicit invocation plus blast-radius ranking sidesteps both. See A-1 for the split-out condition.
- **Status:** active

## #2 — Prescribe, don't rebuild: route to first-party/best-in-class tools — 2026-07-04
- **Skill:** none (design decision from v0.3, recorded retrospectively at ledger creation)
- **Decision:** Keel never duplicates existing tooling (security scanning → `/security-review`, PR review → CodeRabbit-class tools, episodic memory → claude-mem); it prescribes those tools and owns the stage-aware interpretation layer. Codified in `ecosystem-tools.md`.
- **Rejected:** Building a Keel security scanner (worse than the free first-party one, and a permanent maintenance bill); staying silent on adjacent tools (leaves the non-technical user without the routing a real CTO would give).
- **Reasoning:** An advisory plugin's differentiation is judgment, not scanners. First-party tools are free, maintained, and better at code-level findings; the layer they lack — what a finding means for *this* user's stage and commercial model — is exactly the persona's job. Building scanners would spend the project's entire innovation budget on plumbing.
- **Status:** active

## #3 — Per-project decision memory as plain-Markdown `.keel/` in the user's repo — 2026-07-04
- **Skill:** none (design decision from v0.4, recorded retrospectively at ledger creation)
- **Decision:** Project memory is a `.keel/` directory of four plain-Markdown files (profile, decisions, assumptions, lessons) living in the user's repo, written and read by skills, surfaced by a SessionStart digest hook.
- **Rejected:** Episodic session memory (claude-mem does it well; decisions ≠ events); a structured store (JSON/SQLite) with tooling (breaks the "user can open and understand their own record" rule and adds a runtime dependency to a Markdown-only plugin).
- **Reasoning:** The persona's §4.4 "bookmark" framing needs persistence to mean anything — assumptions with revisit-triggers are worthless if they evaporate at session end. Plain Markdown keeps the record human-owned, diffable, and committable, at the cost of relying on the model to parse and append correctly — which is what `tests/eval-cases/ledger-contract-fired-trigger.md` now guards.
- **Status:** active
