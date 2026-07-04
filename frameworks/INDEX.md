# Framework Index

Progressive-disclosure entry point for the AI CTO skills' framework library. Skills do not preload these cards; they read the index, identify the card(s) the decision triggers, and load only those. More than one card may apply. Skills cite the loaded card, not paraphrase it.

## Quick-lookup table

| Framework | Altitude | Use when | Don't use when | Pairs with |
|---|---|---|---|---|
| [choose-boring-technology.md](choose-boring-technology.md) | Architectural | User proposes an emerging tech where a mature default exists. | Differentiation *is* the technology, or the boring tool can't do the job. | build-vs-buy-test, two-way-doors, wardley-mapping, conways-law, unit-economics |
| [two-way-doors-vs-one-way-doors.md](two-way-doors-vs-one-way-doors.md) | Architectural | User treats a reversible decision as heavy, or a silently-becomes-irreversible one as light. | Decision is trivially small in both directions. | choose-boring, yagni, conways-law, wardley-mapping |
| [conways-law.md](conways-law.md) | Architectural | User proposes splitting services, adding team boundaries, or architecture demanding distinct ownership. | Team is under ~4 engineers, or granularity is sub-system. | two-way-doors, choose-boring, accelerate-four |
| [build-vs-buy-test.md](build-vs-buy-test.md) | Architectural | User proposes building a component (auth, payments, search, observability) with mature SaaS/OSS equivalents. | Vendor pricing is structurally hostile, or the component *is* the differentiation. | choose-boring, unit-economics, wardley-mapping, yagni |
| [yagni-and-rule-of-three.md](yagni-and-rule-of-three.md) | Tactical | User proposes a generic abstraction or future-proof feature before concrete cases exist. | Getting the shape wrong is catastrophic (data models, public APIs), or compliance requires it. | two-way-doors, build-vs-buy |
| [wardley-mapping.md](wardley-mapping.md) | Strategic | User has a *strategic* question about where engineering effort belongs across the stack. | Tactical decisions where a cheaper framework (e.g., choose-boring) would give the same answer, pre-product, or mapping as procrastination. | build-vs-buy, choose-boring, two-way-doors |
| [accelerate-four.md](accelerate-four.md) | Tactical | User asks "how do we ship faster?" or wants engineering health diagnosed in numbers. | Pre-shipping, teams under ~5 engineers, or measurement without intent to change (a dashboard nobody acts on is theatre). | conways-law, unit-economics |
| [unit-economics-decomposition.md](unit-economics-decomposition.md) | Tactical | User asks any infrastructure-cost question. | Bill isn't material (activation cost dominates savings — we don't run this on a $200/month line), or user wants validation, not analysis. | build-vs-buy, choose-boring, accelerate-four |

**Altitude** describes the scope a framework operates at — Strategic (where engineering effort belongs across the stack), Architectural (how the system and its boundaries are shaped), Tactical (specific decisions within an existing shape). Higher-altitude conclusions can override lower-altitude ones: a Wardley conclusion that a component should be consumed as utility eats any Choose-Boring conclusion about which self-hosted option to pick.

## Trigger-to-framework lookup

**User is proposing a specific named technology.** Primary: [choose-boring-technology.md](choose-boring-technology.md). Supporting: [build-vs-buy-test.md](build-vs-buy-test.md) if a SaaS/OSS equivalent exists; [two-way-doors-vs-one-way-doors.md](two-way-doors-vs-one-way-doors.md) if the choice silently becomes irreversible (database, ORM, auth).

**User is proposing an architectural change.** Primary: [conways-law.md](conways-law.md), [two-way-doors-vs-one-way-doors.md](two-way-doors-vs-one-way-doors.md). Supporting: [choose-boring-technology.md](choose-boring-technology.md) if novel components are involved.

**User is asking whether to refactor or rewrite an existing system.** Primary: [two-way-doors-vs-one-way-doors.md](two-way-doors-vs-one-way-doors.md) (most rewrites are silently one-way once underway). Supporting: [yagni-and-rule-of-three.md](yagni-and-rule-of-three.md) (sometimes the rewrite is premature abstraction wearing a different name); [unit-economics-decomposition.md](unit-economics-decomposition.md) (what's the cost of leaving it broken vs. of fixing it?).

**User is asking a cost question.** Primary: [unit-economics-decomposition.md](unit-economics-decomposition.md). Supporting: [build-vs-buy-test.md](build-vs-buy-test.md) if "self-host to save money" is in play; [choose-boring-technology.md](choose-boring-technology.md) if vendor migration is proposed.

**User is asking how to move faster.** Primary: [accelerate-four.md](accelerate-four.md). Supporting: [conways-law.md](conways-law.md) if coordination is the bottleneck.

**User is making a strategic build-vs-consume decision.** Primary: [build-vs-buy-test.md](build-vs-buy-test.md) component-level; [wardley-mapping.md](wardley-mapping.md) stack-level. Supporting: [unit-economics-decomposition.md](unit-economics-decomposition.md) if cost is part of the argument.

**User is proposing an abstraction or future-proofing.** Primary: [yagni-and-rule-of-three.md](yagni-and-rule-of-three.md). Supporting: [two-way-doors-vs-one-way-doors.md](two-way-doors-vs-one-way-doors.md) if it shapes a data model, public API, or on-disk format.

**User is comparing options where reversibility matters.** Primary: [two-way-doors-vs-one-way-doors.md](two-way-doors-vs-one-way-doors.md). Supporting: [choose-boring-technology.md](choose-boring-technology.md) if novel vs. mature.

**User is splitting services or adding team boundaries.** Primary: [conways-law.md](conways-law.md). Supporting: [two-way-doors-vs-one-way-doors.md](two-way-doors-vs-one-way-doors.md) — splits get hard to reverse once services have state.

**User is deciding how to build a specific feature** *(skill: feature-decision)*. Primary: [two-way-doors-vs-one-way-doors.md](two-way-doors-vs-one-way-doors.md) (feature decisions that touch data models, public APIs, or customer-facing contracts are often the "appears two-way but isn't" category), [yagni-and-rule-of-three.md](yagni-and-rule-of-three.md) (feature work is the canonical YAGNI surface — settings systems before settings exist, abstractions before duplications, plugins before plugin authors). Supporting: [build-vs-buy-test.md](build-vs-buy-test.md) if the feature touches a commodity (auth, payments, search, email, AI inference); [choose-boring-technology.md](choose-boring-technology.md) if the feature proposal introduces a novel technology to the stack; [conways-law.md](conways-law.md) if the feature implies a new team boundary or service.

**User is at the idea stage and needs the option-space laid out** *(skill: first-build-scope, pre-product founder)*. Primary: [wardley-mapping.md](wardley-mapping.md) (the idea-stage version of "what's our differentiation?" — anchor at user need, sort components into commodity/product/custom), [build-vs-buy-test.md](build-vs-buy-test.md) (applied aggressively because the pre-product founder has zero engineering bandwidth to spare), [choose-boring-technology.md](choose-boring-technology.md) (innovation tokens should go to the differentiation, not the plumbing). Supporting: [yagni-and-rule-of-three.md](yagni-and-rule-of-three.md) for the founder proposing a "generic platform" before they have one customer; [two-way-doors-vs-one-way-doors.md](two-way-doors-vs-one-way-doors.md) for the few one-way decisions even at the idea stage (brand name, legal entity, business model, target geography). **Pre-product founders may load up to 3 cards** per persona §9.4, vs. the 2-card cap elsewhere.

## Multi-framework patterns

- **Small team proposing microservices** — [conways-law.md](conways-law.md) (no team to own services), [choose-boring-technology.md](choose-boring-technology.md) (distributed-system overhead is a token), [two-way-doors-vs-one-way-doors.md](two-way-doors-vs-one-way-doors.md) (hard to undo once services hold independent state).
- **Self-host vs. SaaS** — [build-vs-buy-test.md](build-vs-buy-test.md) (can the team operate it for two years?), [unit-economics-decomposition.md](unit-economics-decomposition.md) ("self-host to save money" rarely survives line-item analysis), [choose-boring-technology.md](choose-boring-technology.md) (self-hosting consumes a token).
- **Generic config / settings system** — [yagni-and-rule-of-three.md](yagni-and-rule-of-three.md) (built before cases exist), [build-vs-buy-test.md](build-vs-buy-test.md) (feature-flag/config SaaS exists), [two-way-doors-vs-one-way-doors.md](two-way-doors-vs-one-way-doors.md) (schemas calcify once consumers depend on them).
- **User shipped via AI tooling and wants to know if it's "good"** — [choose-boring-technology.md](choose-boring-technology.md) (did the AI pick boring components or trendy ones?), [build-vs-buy-test.md](build-vs-buy-test.md) (did it build things that should have been bought?), [yagni-and-rule-of-three.md](yagni-and-rule-of-three.md) (did it abstract prematurely?).
- **Founder at idea stage proposing to "build it all myself"** — [wardley-mapping.md](wardley-mapping.md) (most of the stack is utility, consume it), [build-vs-buy-test.md](build-vs-buy-test.md) (auth and payments are buy-by-default), [choose-boring-technology.md](choose-boring-technology.md) (innovation tokens go to the workflow, not the plumbing).
- **Feature proposal that adds a new service or storage at small team scale** — [conways-law.md](conways-law.md) (no team to own the new service), [two-way-doors-vs-one-way-doors.md](two-way-doors-vs-one-way-doors.md) (data-in-two-stores silently becomes one-way), [yagni-and-rule-of-three.md](yagni-and-rule-of-three.md) (a separate service for one feature when you have one of that shape is premature decomposition).
- **Feature proposal that wants a generic / configurable system before the cases exist** — [yagni-and-rule-of-three.md](yagni-and-rule-of-three.md) (built before cases exist), [build-vs-buy-test.md](build-vs-buy-test.md) (feature-flag / config SaaS exists if you genuinely need it later), [two-way-doors-vs-one-way-doors.md](two-way-doors-vs-one-way-doors.md) (schemas calcify once consumers depend on them).

## Maintenance note

When a card is added, update the index in three places: (1) add a row to the Quick-lookup table, (2) add it under each applicable Trigger heading with primary/supporting noted, (3) review Multi-framework patterns — add it to any pattern it fits, or add a new pattern.
