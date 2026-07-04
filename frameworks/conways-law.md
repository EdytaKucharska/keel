# Conway's Law

**Altitude:** Architectural.

## What it is

The system you build will mirror the communication structure of the team that builds it. That's the core claim. The corollary that the AI CTO actually uses when reviewing proposals is the **reverse direction**: if you want a particular architecture, you'll need an org structure that can support it. Architecture without matching ownership is architecture that the org will fight until one of them gives.

Conway's Law is **gravitational, not deterministic.** It describes a force, not an outcome. Teams can push against it — for a while — but the cost of doing so accumulates: services without clear owners drift, coordination overhead grows, and either the architecture collapses back toward the team shape or the team reshapes to fit the architecture. Usually the first, in startups.

## Source

**Melvin E. Conway, "How Do Committees Invent?" — submitted to *Harvard Business Review* in 1967 (rejected), published in *Datamation*, April 1968.** The exact quote from the paper is more nuanced than the popular paraphrase. The original thesis statement:

> *"Any organization that designs a system (defined more broadly here than just information systems) will inevitably produce a design whose structure is a copy of the organization's communication structure."*

The term "Conway's Law" came later — Fred Brooks cited the paper in *The Mythical Man-Month* (1975), and the name stuck. The original paper is freely available — [canonical page](https://www.melconway.com/research/committees.html), [PDF](https://www.melconway.com/Home/pdf/committees.pdf).

Two things to note about the original phrasing that the popular version drops:

1. It's about **communication structure**, not org-chart structure. Two teams that talk constantly are one team for Conway purposes; one team split across timezones with no overlap is two.
2. It's broader than software — Conway was writing about systems in general, with software as one example.

## When it applies

Load this card when the user is:

- **Proposing microservices.** Especially a small team proposing a service-per-feature split. The check: who owns each service? If the answer is "all of us," the split is fiction.
- **Splitting an existing service.** Same check. A split with no ownership change is a rename.
- **Adding a new team boundary** — a "platform team," an "infrastructure team," an "AI team" — and trying to figure out what it owns. The architecture should follow the boundary, not lead it.
- **Asking whether to break up a monolith.** Conway gives a useful trigger: split when the team can no longer coordinate on shared changes, *not* when the codebase feels big. Size is not the signal; coordination cost is.
- **Considering an architecture that requires distinct ownership** — multi-region, multi-tenant isolation, separate paid/free product surfaces — without a plan for who owns the distinction.

The reverse direction is what gets used most often. The user proposes an architecture; the AI CTO checks whether the org has the structure to own it. If not, the proposal needs to either change the architecture, change the org, or accept the cost of fighting Conway.

## When it doesn't apply

This is the framework most often misapplied. Common cases where Conway is the wrong lens:

- **The team has the capacity to span the proposed boundaries.** A single senior engineer can own three small, stable services without Conway forcing them to merge — services don't *have* to map 1:1 to teams. The Conway force kicks in when coordination across the boundary is frequent and costly. A boundary nobody crosses doesn't generate friction.
- **The architecture is genuinely temporary.** A one-off migration tool, a throwaway data backfill service, a scratch script that runs for a quarter — these don't need org-aligned ownership because they don't need long-term ownership at all. Conway is about systems that survive; it doesn't apply to systems that don't.
- **The granularity is wrong.** Conway is about system boundaries — services, modules, products, deployable units. It is **not** about whether to extract a helper function, name a file, or split a class. Using Conway to win a code-style argument is a category error.
- **The user has already made the structural change and the architecture is catching up.** If the team genuinely split last quarter and the codebase is being reshaped to match, you're not predicting Conway — you're observing it. Conway is a diagnostic and a forecasting tool, not a stop sign for in-flight work.
- **The proposed structure is at the wrong altitude for the team.** Two-engineer startups don't need Conway to tell them their architecture maps to their team — there is no architecture and no team yet. The framework starts being useful around the point where coordination *costs* something, which is usually 4–8 engineers and up.

## Worked example

A founder with three engineers proposes splitting their working monolith into microservices: an auth service, a payments service, and a notifications service. The pitch: *"We want to be ready to scale."*

The CTO's read: this is exactly the proposal Conway is for. Run it through the framework.

> "Two things to name before we commit. The first is scale: microservices solve a *coordination* problem more than a scale problem. At your team size and traffic, you don't have the coordination problem yet — your three engineers all read the same code and can change it together. Splitting introduces coordination cost where there wasn't any.
>
> The second is Conway's Law: services need teams to own them. You don't have three teams. You have three engineers, which is one team. If you split into three services, all three engineers will own all three services — which is what they're doing now, except now there are three deploy pipelines, three observability surfaces, three failure modes, three rollback stories, and three schema-version conversations every time something changes across them.
>
> Conway runs in both directions. The popular version is 'architecture mirrors the org.' The version I'd use here is the reverse: 'if you want this architecture, you need an org that can support it.' You don't have it. Three engineers running three services is going to fight you on every coordinated change, and one of two things will happen — either the architecture collapses back toward the monolith under pressure (the more likely outcome), or the engineers stop coordinating and the services drift apart in subtle ways (the worse outcome).
>
> The honest version of the operational question is: **who maintains this on the Tuesday after your expert leaves?** Whoever you'd name for the payments service today — that's the person carrying its on-call, its CVE response, its schema migrations. If the answer is 'whoever is around,' the service has no owner, and unowned services drift.
>
> Recommendation: stay monolithic. Trigger to revisit: when you can't merge a PR for one subsystem without coordinating with the engineer who owns another — i.e., when coordination cost is what's slowing you down. Until then, this is a clear 'don't do this yet.' If one subsystem does need an independent release cycle later (usually payments), split that one. Don't split everything."

The framework's contribution: surfacing that the proposed architecture requires an org the founder doesn't have, and renaming the question from "should we adopt microservices" to "do we have the org for microservices."

## Common misuse

- **"We need microservices because Conway's Law says so."** Conway doesn't say that. Conway says *architecture mirrors org structure*. It does not say architecture should aspire to anything in particular. Citing Conway to justify microservices is reading the law as a prescription when it's a description.
- **Used to justify a reorg the user already wanted.** The framework should sharpen the decision, not laminate it. If the user wanted to split the team anyway, "Conway's Law" is a fig leaf, not an analysis. Push for the underlying reason.
- **Treated as deterministic.** "Once we have a platform team, we'll have a platform architecture." Conway is gravitational — it pulls in that direction, but the team can spend effort to resist (well-defined contracts, strong interfaces, intentional cross-team rotations). The framework predicts the cost of resistance, not the inevitability of compliance.
- **Used at the wrong altitude.** Conway is about system boundaries that survive. It's not about whether to factor out a helper function or whether two classes should be one. "Conway's Law says we should extract this function" — no, it doesn't.
- **Used to refuse splitting indefinitely.** The conservative weaponisation. "Conway says we'll fight the architecture, so we should never split." Sometimes the org *is* the thing that needs to change, and Conway is telling you the architecture is the trigger to start hiring against. Don't read it as a veto.

## How to cite it in a skill's output

When the skill invokes the framework, the persona phrases it something like:

- "Conway's Law: services need teams to own them. Who owns this one? If the answer is 'whoever is around,' it doesn't have an owner — and unowned services drift."
- "**Who maintains this on the Tuesday after your expert leaves?** That's the operational form of the question. If there's no name for the person doing it next year, the architecture isn't ready."
- "You can have this architecture, or you can have your current team. You can't have both yet. The framework isn't telling you no — it's telling you what hiring you'd need to do first."
- "The popular version of Conway is 'architecture mirrors the org.' The version I'd use here is the reverse: 'if you want this architecture, you need an org structure to support it.' You don't have it yet — let's name what would change."
