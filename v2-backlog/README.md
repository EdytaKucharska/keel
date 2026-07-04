# v2 backlog

Skills drafted during persona iteration but not part of the v1 cut. They are **not v1 deliverables** — they should be brought back one at a time as real usage of the v1 skills surfaces specific need.

The v1 cut (in `../skills/`) is now four skills covering the end-to-end CTO workflow: `first-build-scope` → `feature-decision` → `tech-evaluation` → `architecture-review`. See `../cto-persona.md` §12 for the rationale and the workflow framing.

## What's here

- **`feature-approach/`** ⚠️ **SUPERSEDED** by `feature-decision` in the v1 skills folder. This draft was an earlier, narrower scope (smallest viable shape + prove-first check) before user feedback during dogfooding sharpened the requirements. The replacement, `feature-decision`, retains the smallest-viable-shape and prove-first elements but adds the architectural-alignment check and the tech-debt impact assessment that were the load-bearing gaps. **Do not revive this draft.** Reference only if you need to see the pre-v0.4 thinking.

- **`infra-cost-assessment/`** — Skill for assessing cloud and SaaS infrastructure costs. Decomposes a bill, computes unit economics, surfaces top three optimisations with ROI estimates, names lock-in risk. Dual-surface (conversational on a projection, repo-aware with a real bill or cost-explorer access). High leverage for founders with junior engineers and PMs asking about unit economics. **Will need the v0.3+ template inheritance pass before revival** — framework loading via INDEX, segment detection, adversarial-framing check, antipattern cross-reference, engagement rule.

- **`tech-hygiene-audit/`** — Skill for auditing the technical hygiene of a shipped product. Maps the system, runs the "needed yesterday" checklist, applies the §9.6 three tests on AI-generated code, produces a two-week professionalisation plan. Repo-aware skill. **Highest discovery leverage for the vibe-coder segment** — likely the second v2 skill to revive (after `infra-cost-assessment`), and a strong candidate for a rename around the user's moment of need (`pre-demo-check`, `ship-ready-check`, etc.). Same template-inheritance pass required before revival.

## What was learned from drafting these and then parking them

- The persona is more sophisticated than any single skill it governs. Refactoring `tech-evaluation` as the v1 template revealed gaps (segment detection, teaching-mode operationalisation, adversarial-framing check, phrasebook references, antipattern cross-reference, framework loading via INDEX.md) that all the parked skills *also* need before they're persona-faithful. Bringing any of them back will be a partial-rewrite, not just a move.
- The "always-on, proactive" framing in early persona drafts assumed mechanics the skill model can't deliver — see persona §1 v1-mechanics note. Reviving these skills means inheriting the corrected framing ("proactive within an invocation," not background interception).
- The two-surface split (conversational vs. repo-aware) matters most for the vibe-coder segment. The hygiene-audit skill is the one where this distinction is sharpest — it's nearly useless without repo access, which is the case for distributing the AI CTO as a Claude Code plugin first.
- User feedback during the first round of dogfooding (one full run of `tech-evaluation` via explicit invocation on a YOLOv8/document-detection scenario, plus a failed-to-trigger run on the fibromyalgia app idea) was enough to identify two real gaps that justified expanding v1 from two to four skills: idea-stage feasibility (`first-build-scope`) and feature-level technical decisions (`feature-decision`). The other parked skills did *not* surface as urgent gaps — that's the right pattern for reviving them later, when usage points at them specifically.

## When to revive

Suggested triggers (not commitments):

- **Revive `infra-cost-assessment`** when real users start asking cost questions that the existing v1 skills can't fully answer — i.e., they're not making an architecture decision, they're asking about an existing bill or projecting a cost shape at scale.
- **Revive `tech-hygiene-audit`** (with a milestone-named rename like `pre-demo-check` or `ship-ready-check`) when there's a clear distribution channel for the vibe-coder segment — most likely a Claude Code plugin marketplace listing where the "first-run wow" experience is the user pointing the tool at their repo.
- **Do not revive `feature-approach`** — it's superseded. If `feature-decision` reveals gaps in real use, the fix is to refine `feature-decision`, not to bring back the older draft.
