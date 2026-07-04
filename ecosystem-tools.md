# Ecosystem Tool Map

> **The principle: prescribe, don't rebuild.** A real CTO doesn't build what already exists — they know the tooling landscape and route you to it. Keel deliberately does not duplicate capabilities that first-party or best-in-class tools already do well. Instead, Keel skills consult this map, tell the user the tool exists (most of Keel's users don't know), tell them *when* to run it, and — the part only Keel does — **interpret the results for the user's stage, segment, and commercial model.**

This file is loaded on demand by skills, the same progressive-disclosure pattern as `frameworks/INDEX.md`. When a skill recommends a tool from this map, it must say **why this tool, at this moment, for this user** — never a bare "you should use X."

## The map

| Need | Don't build in Keel — prescribe | When a Keel skill recommends it |
|---|---|---|
| **Security scanning of code changes** | Claude Code's built-in **`/security-review`** (free, first-party; also available as a [GitHub Action](https://github.com/anthropics/claude-code-security-review)) | `deep-review` and `enterprise-ready` tell the user to run it, then translate the findings into stage-aware priorities: needed-yesterday vs. defer-with-trigger. Most non-technical builders have never run it and don't know it ships with the tool they already use. |
| **Episodic session memory** ("what did I do last week") | **claude-mem** or Claude Code's built-in auto memory / CLAUDE.md | Keel's ledger (`.keel/`) records *decisions, assumptions, and revisit-triggers* — a different layer. If a user asks for general session memory, point them at claude-mem; the two coexist. |
| **PR-by-PR code review** | **CodeRabbit**, **Greptile**, Claude Code's own review flows | Keel reviews *decisions*, not diffs. When a user asks "review my PR," route them to a PR-review tool; offer `architecture-review` only if the PR embodies a structural decision. |
| **Per-vendor infrastructure setup** | The vendor's own agent skills: **Railway** (`railway setup agent`), **Supabase** (`npx skills add supabase/agent-skills`), Vercel's tooling | Keel advises *which* vendor fits the user's stage and commercial model (`tech-evaluation`); the vendor's skill does the setup. Never hand-roll setup steps a vendor skill maintains better. |
| **Coding standards enforcement** (naming, API conventions, lint-grade rules) | Linters, formatters, and standards plugins (e.g. fractional-cto's standards packs) | Out of scope for Keel entirely. If a user asks for coding standards, say so and point at the category. Keel owns decision moments, not style. |
| **Compliance automation** (SOC 2 evidence collection, policies) | **Vanta**, **Drata**, **Secureframe** and similar | `enterprise-ready` tells the user when their stage justifies paying for one (trigger: an enterprise deal that requires a SOC 2 report), and what to do in the months before that trigger fires. |
| **Uptime / error monitoring** | **Sentry**, **BetterStack**, **UptimeRobot**, platform-native logs | Hygiene checks in `deep-review` name the specific tool and free tier; Keel never builds monitoring advice beyond "install this, here's why, here's the 30 minutes it takes." |

## Rules for skills using this map

1. **Name the tool, the moment, and the reason.** "Run `/security-review` now, before your launch, because it's free, it's already installed, and its findings feed the readiness verdict" — not "consider security tooling."
2. **Interpretation is Keel's job.** Raw scanner output is engineer-speak. The skill's value-add is translating findings into the persona's register: what's needed yesterday, what's deferred with a trigger, what it costs.
3. **Verify before prescribing.** Tool capabilities, pricing, and free tiers change. Web-search verify any claim the recommendation rests on (persona §4.2).
4. **Never disparage the alternative of doing nothing.** Stage-appropriateness applies to tooling too — SOC 2 automation at pre-revenue is a six-month distraction, not diligence.

## Maintenance note

When a new category of "don't build — prescribe" is identified (usually when someone proposes a Keel feature that an existing tool already does), add a row here and reference it from the skill that would have been built instead.
