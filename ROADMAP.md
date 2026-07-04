# Keel Roadmap

> Where Keel is going, and — just as deliberately — where it is not.

## Shipped

### v0.3 — Positioning & the ecosystem principle
- Rebrand from `ai-cto` to **Keel**.
- **`ecosystem-tools.md`** — the "prescribe, don't rebuild" map. Keel never duplicates first-party or best-in-class tooling (security scanning, PR review, episodic memory, vendor setup, compliance automation); it routes users to those tools and interprets the results for their stage.

### v0.4 — The ledger (project memory)
The single biggest structural addition: a per-project decision ledger at `.keel/` in the user's repo.

- **`profile.md`** — segment, commercial model, scale assumption, stack. Asked once, read by every skill — no more re-answering "do you have a team?" four times.
- **`decisions.md`** — an ADR-lite log every skill appends to: the choice, the alternatives rejected, the reasoning.
- **`assumptions.md`** — the "this works if…" ledger with explicit revisit-triggers. Skills scan it on every invocation: if something the user says fires a recorded trigger, Keel says so — *"I recommended X assuming you'd stay under 10k users; you just said 50k. That decision needs revisiting."*
- **`lessons.md`** — corrections captured so they aren't repeated.
- A **SessionStart hook** prints a five-line ledger digest so every session starts with the memory ambient — the user controls when to act on it.

This is what turns four consultations into a CTO who remembers you.

### v0.5 — `/keel:deep-review`
The repo-aware flagship: one explicitly-invoked command that runs four lenses over an existing codebase — **hygiene** (backups, secrets, observability, rollback), **security posture** (prescribes `/security-review`, then translates its findings), **load-shape** (what falls over first at your stated scale, and what it costs), **cost** (top line items, unit economics, AI-inference spend) — and returns a single ranked report with a two-week plan.

One trigger instead of four, because routing degradation is this project's most persistent failure mode (see `tests/triggering-matrix.md`).

### v0.6 — The money-moment skills
Advisory earns its keep at the moments money or fear is attached:

- **`enterprise-ready`** — the first big customer sends a 200-item security questionnaire. What you can honestly answer today, what to fix before replying, and when your stage justifies paying for compliance automation.
- **`estimate-check`** — "my engineer says six weeks." The three questions that make an estimate auditable without alienating the team.
- **`investor-dd-prep`** — technical due diligence is in three weeks. What a DD reviewer will look at, what they'll flag, and what's fixable in the time you have.

## Next

- **Eval pass on the new skills.** Triggering rows exist; behavioural eval cases (per `tests/README.md`, `pass^5` headline) need authoring before the new skills are trusted at the same level as the v1 four.
- **SKILL.md leanness refactor.** Move worked examples and output templates into per-skill `references/` loaded on demand — same progressive-disclosure pattern as `frameworks/`, cheaper on context.
- **`feasibility-spike`** — the first advisory→executing crossing: actually *run* the prove-first check that `first-build-scope` designs (call the API on 5 samples, measure, report). Explicitly invoked only.
- **Revive `infra-cost-assessment`** from `v2-backlog/` as the deep version of deep-review's cost lens, with an AI-inference cost focus (per-user-action economics, model right-sizing, prompt caching).
- **Publish eval numbers in the README** once measured — "catches the AGPL trap 5/5 runs" is credibility no other plugin offers.

## Deliberately not building

- **Security scanning** — `/security-review` is free and first-party. We prescribe and interpret it (`ecosystem-tools.md`).
- **PR-by-PR code review** — CodeRabbit/Greptile territory; commodity.
- **Coding standards packs** — a different product for a different user (engineers).
- **Episodic session memory** — claude-mem does it well; the ledger is a different layer (decisions, not events).
- **Aggressive proactive interjection** — hooks make it feasible; taste says no. The ledger digest is ambient; the user decides when to engage.
- **A `second-opinion` router skill** — deferred until the triggering matrix shows real-world routing failures; adding a competing trigger prematurely worsens the problem it solves.
