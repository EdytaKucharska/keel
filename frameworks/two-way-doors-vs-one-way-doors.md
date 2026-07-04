# Two-Way Doors vs. One-Way Doors

**Altitude:** Architectural.

## What it is

Decisions divide into two classes. A **two-way door** is reversible: if you walk through and don't like what you see, you can walk back, and the cost of the round trip is small. A **one-way door** is irreversible, or reversible only at a cost so large it functions as irreversible. The two classes deserve completely different treatment. Two-way doors should be made quickly, by small groups or individuals, with a bias toward experimentation — the cost of a wrong call is the cost of switching back. One-way doors deserve slow, deliberate, heavily-pressure-tested decisions, because a wrong call is paid for in months or years.

The failure mode the framework targets is treating every decision like a one-way door: committee review, consensus-seeking, exhaustive analysis, and a velocity hit on choices that didn't warrant any of it.

## Source

Jeff Bezos, *2015 Letter to Amazon Shareholders* (filed April 2016). Canonical PDF: [2015 Letter to Shareholders](https://s2.q4cdn.com/299287126/files/doc_financials/annual/2015-Letter-to-Shareholders.PDF). The relevant passage distinguishes "Type 1" decisions (consequential, irreversible — one-way doors) from "Type 2" decisions (changeable, reversible — two-way doors), and warns that large organisations tend to apply Type 1 process to Type 2 decisions, which is "slow, unthoughtful risk aversion."

## When it applies

Load this card when the user is:

- Stuck on a decision that feels heavy but is in fact cheap to reverse (framework choice in a greenfield app, internal tool UI, naming, file layout, choice of CI provider before there's anything to run).
- Treating a small experiment as if it were a strategic commitment ("but what if we pick the wrong analytics tool…").
- About to make a decision that *looks* small but locks the company in once data, customers, or external integrations accumulate (data model, primary database, public API shape, auth provider for paying customers).
- Choosing for an external surface — public API, customer-facing pricing, on-disk file format, anything a third party will write code or contracts against.
- Asking for permission, alignment, or process on something they could just try this afternoon.

## The three categories

This is where the framework earns its keep. Sort the decision before you do anything else.

**1. Cleanly two-way.** Reversible in days or a sprint, with no external dependencies. Examples: which web framework for a side project, which test runner, which linter config, which deploy provider before there's load, which IDE. Treatment: decide in minutes, by the person closest to the work. Re-decide if it's wrong.

**2. Genuinely one-way.** Irreversible, or reversible only at a cost that would dominate the next year of work. Examples: the choice of language for the core service (a Python-to-Go rewrite is a year-plus); the customer-facing data model once paying customers depend on it; the public API contract once external consumers exist; choice of payment processor once you have a year of subscriptions in flight; legal entity structure; brand name. Treatment: slow down, write it down, get a second opinion, pressure-test the worst-case.

**3. Appears two-way but isn't.** The trickiest case, and the one the framework is really for. Technically reversible at any moment, but practically becomes one-way as state accumulates — usage, data, integrations, customers, mental models inside the team. Examples: primary database choice, ORM, auth model, multi-tenancy approach, event schema, billing model. On day one, switching is a weekend. At month six, switching is a quarter. At year two, switching is a rewrite. Treatment: decide as if it's one-way *if you expect the system to survive long enough for accumulation to bite*.

## When it doesn't apply (and how it gets misused)

The framework can be weaponised in both directions. Watch for:

- **Manufactured urgency.** "This is one-way, decide now" used to force a decision before pressure-testing — exactly the opposite of how Bezos uses the term. One-way doors deserve *more* deliberation, not less. If someone labels a decision one-way and uses that label to compress the timeline, the framework is being used backwards.
- **"Everything is two-way if you throw engineers at it."** Technically true at scale — Amazon can rewrite anything. Irrelevant for a five-person team. Reversibility is a function of *the cost relative to the team's runway and capacity*, not a property of the technology in the abstract.
- **"Everything is one-way if you fear change."** The conservative weaponisation. Used to refuse to try things by treating every choice as load-bearing. The fix is to be honest about category — if the choice is genuinely cheap to reverse, refusing to decide is the failure mode the framework was written against.
- **The decision is genuinely small in both directions.** Don't spend the framework on whether to name a function `getUser` or `fetchUser`. The cost of categorising can exceed the cost of just choosing.
- **The reversibility window is short and known.** Sometimes a decision is one-way *for the next six weeks* (e.g., during a launch) and two-way after. Note the window; don't pretend the category is fixed.

## Worked example

A solo founder building a B2B SaaS for user-generated content (notes, comments, attachments) is choosing between Postgres and MongoDB. She frames it as a two-way door: "I'll pick one, see how it goes, and switch in a few months if I don't like it."

The CTO's read: *technically* two-way, *practically* not, and this is exactly the category Bezos's framework misses if you only check it on day one.

"On day one this is a two-way door — neither database has any data in it, and the migration is an afternoon. But your system isn't going to *stay* on day one. Run the clock forward. At 100k user records, you've got production data with foreign-key shaped relationships, full-text search indexes, customer-visible IDs, and probably a backup story you've started to rely on. The switch is no longer an afternoon; it's a multi-week migration with a data-integrity risk surface. By the time you'd actually want to switch — because something hurt — switching has become the most expensive thing on your roadmap.

So treat this as a one-way door *now*, while it's still cheap to decide carefully. The question isn't 'which do I prefer this week' — it's 'which one am I willing to be married to in eighteen months when switching costs a quarter of engineering time.' Pressure-test the worst case for each: what does Postgres look like at your year-two scale, and what does Mongo look like? My read: for relational, user-generated content with the access patterns you described, Postgres is the conservative choice and pgvector keeps your AI options open. But the point isn't my answer — the point is to make this decision the way you'd make a one-way decision, not the way you'd pick a CI provider."

The framework's contribution here is *re-categorising* the decision. The founder was about to apply two-way-door process (decide fast, switch later) to a decision that would silently become one-way under her feet.

## Common misuse

- **Used to manufacture urgency.** "This is one-way, we have to decide today." One-way doors are the *one* category that deserves slowing down. If "one-way" is being used as a deadline, the framework is upside down.
- **Used as cover for committee process on two-way decisions.** "We need three meetings to pick the CI provider." If it's reversible in a sprint, three meetings cost more than getting it wrong.
- **Category assumed to be fixed.** Many decisions are two-way *for now* and become one-way as state accumulates. The category needs to be re-checked at the moment of decision, not assumed.
- **Treating "two-way" as "consequence-free."** Two-way doesn't mean no cost; it means the cost is bounded. A weekend of rewriting is still a weekend.

## How to cite it in a skill's output

When the skill invokes the framework, the persona phrases it something like:

- "This is a two-way door — try it, switch in a month if needed. Don't burn a week deciding."
- "This is a one-way door. Before you commit, let's pressure-test it. What does the worst case look like in eighteen months?"
- "Looks two-way today, but it won't stay that way. Once you have real customer data behind it, switching becomes a rewrite. Decide it now the way you'd decide a one-way door."
- "You're applying one-way-door process to a two-way-door decision. Just pick one and move — if it's wrong, you'll know in two weeks and you can switch."
