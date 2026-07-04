# Choose Boring Technology

**Altitude:** Architectural.

## What it is

Every company has a small, fixed pool of "innovation tokens" — Dan McKinley puts the number at about three — that you can spend on technologies the world hasn't yet finished debugging. Everything else should be built from boring, well-understood, well-staffed defaults. Spend tokens where your product is actually differentiated, not on plumbing.

"Boring" is a specific claim, not a vibe. A technology is boring when its **failure modes are catalogued**, its **community is healthy**, its **operational characteristics are known at scale**, and you can **hire for it without paying a novelty premium**. Postgres in 2026 is boring. Rails is boring. Linux is boring. The boringness is the feature — it's what tells you that the next six surprises you hit have already happened to someone else, who wrote it up.

The failure mode the framework targets is the moment when an engineer or founder is drawn to a technology *because it's new*. Novelty has real attraction — it signals taste, it's fun to work with, it makes the LinkedIn post more interesting. But every token spent on novelty in the plumbing is a token not spent on novelty in the product, and the plumbing isn't what you win on.

The deeper claim underneath McKinley's framing: **engineering attention is the scarce resource, not engineering hours.** A team has roughly the same hours per week regardless of what stack it runs. What it doesn't have is unlimited *attention* — the cognitive surface area to operate, debug, secure, upgrade, and recover from N different technologies. Boring tools consume less of that surface area per unit of work; novel tools consume more. The token math is, underneath, an attention budget.

## Source

Dan McKinley, *Choose Boring Technology*, originally a blog post (March 30, 2015), later expanded into talks at Velocity NY and OSCON 2015. Canonical reference: [mcfunley.com/choose-boring-technology](https://mcfunley.com/choose-boring-technology). McKinley has revisited the framework periodically since — the talk is more developed than the original post — but the original three-tokens framing is what survived and is what the industry cites.

The framework's longevity is part of its own evidence: it's older than most of the technologies it's used to push back on, which is the point.

## When it applies

Load this card when the user is:

- **Proposing an emerging database, framework, language, or runtime.** Specifically: anything released or substantially rewritten in the last 12–18 months, anything with a community measured in thousands rather than tens of thousands, anything whose failure modes haven't yet shown up in production stories you can find by searching.
- **Choosing between a mature default and a younger alternative** ("Postgres but X is faster," "Rails but Y is more modern," "Express but Z has better DX"). The framework doesn't say the younger option is wrong; it asks whether the difference is worth a token.
- **Re-platforming a working system "to use modern Y."** Re-platforming is one of the most expensive forms of innovation-token spend because the *current* system was, by definition, working — the cost of the migration is real, and the benefit is usually theoretical.
- **Stack-shopping based on Twitter / Hacker News / conference signal** rather than a stated product or user need. "Everyone is moving to Rust" / "the new framework everyone is talking about" / "[influencer] said this is the future" are not engineering arguments; they're social-proof arguments wearing engineering clothes.
- **Proposing more than one novel technology in a single architecture.** Each is a token. Three novel technologies for an MVP is the whole budget — spent before there's a product to show for it.

## When it doesn't apply

The framework allocates a *budget*. It does not forbid the spend. Don't invoke it when:

- **The boring tool genuinely cannot do the job.** Verify this — the claim "Postgres can't do X" is wrong much more often than it's right, but it's occasionally true. The CTO's reflex should be to test the claim against current Postgres capabilities (extensions, JSON support, full-text search, pgvector for embeddings) before accepting it.
- **The user's differentiation *is* the technology itself.** A database startup building a database; an inference-runtime company building inference infrastructure; a developer-tools product whose pitch is the stack. For these, "boring" applies elsewhere — to the *business* infrastructure (auth, payments, billing, observability), not to the product itself.
- **The team's status-quo "boring" stack is unmaintained, abandoned, or actively a liability.** A 15-year-old internal framework with no maintainer pulse isn't boring; it's legacy. The signal for "boring" is community health and known failure modes, not age. Boring requires *active* boring.
- **The token is being spent here deliberately, with eyes open.** The framework helps you allocate; it does not veto. A founder who has explicitly chosen to spend their token on a novel database — because the product genuinely depends on it, and they've named the operational cost — is using the framework correctly. The wrong move is invoking the framework to second-guess that choice after it's made.
- **An engineer is using "boring" as cover for refusing to learn something the business actually needs.** That isn't Choose Boring — that's resistance wearing the framework as a costume. The tell: the engineer's "boring" choice would be boring for *them* (matches what they already know) but not boring on the actual evidence (community size, maintenance pulse, hire-ability). Distinguish.

## Worked example

A solo founder building an AI-native B2B SaaS proposes the stack: pgvector (a Postgres extension that lets the same Postgres database also store and search vector embeddings — boring) for embeddings, Anthropic API for the LLM (managed — boring enough), and a vector database that launched four months ago for "scale later."

The CTO's read: "You have roughly three innovation tokens to spend over the next two years. Let's see where this stack puts you on the budget.

The LLM choice — Anthropic API — isn't a token. Managed APIs from established providers are about as boring as AI gets right now; you're consuming a service, not operating it. pgvector isn't a token either. It's the Postgres extension, you'd be running Postgres anyway for the rest of the application, and it slots in without adding an operational surface. Two of your three components are boring-tier.

The new vector DB *is* a token. Four months old, community in the thousands not the tens of thousands, failure modes that haven't yet been hit in public, operational story that isn't yet documented. None of that means it's bad — it just means using it costs you a token.

Is this where you want to spend it? My read: no. pgvector handles your scale for the next 18 months — your usage projection puts you well under the point where a dedicated vector database starts to matter. If pgvector hits its limits in 18 months, you'll know it — query times will degrade, indexing will get expensive, and the trigger to revisit will be obvious. Until then, save the token for the AI logic that's actually your differentiation, which is where novelty *will* pay you back. The vector DB isn't where this product wins."

The framework's contribution: it doesn't tell the founder the vector DB is wrong. It tells the founder what spending a token on *this* costs, and whether it's the best use of the budget. The answer might still be yes — but the conversation is now about the budget, not the technology.

## Common misuse

- **Weaponised as blanket conservatism.** "Choose Boring says never adopt new things." Wrong. The framework allocates a budget; spending zero tokens is also failing it. A company that runs only boring tech everywhere has no differentiation in its plumbing *or* its product — at which point the "boring everywhere" stance has become a hiding place.
- **Cover for engineer resistance.** "We should use what I know" dressed up as Choose Boring. Distinguish: protecting the company's innovation budget versus protecting personal comfort. The test is whether the recommended alternative is boring by community evidence (size, pulse, failure-mode visibility) or boring by *the speaker's* familiarity. The two are not the same.
- **Confused with "old."** Boring ≠ old. A well-maintained five-year-old framework is boring. A fifteen-year-old abandoned one is legacy. The signal is community pulse and known failure modes, not age. Some "old" tools have become *less* boring over time as their communities thinned out.
- **Used to ratify a choice already made.** "We picked Postgres because Choose Boring" — that's the conclusion masquerading as the framework. The framework asks "is the boring tool the right answer here?", which sometimes returns *no*. Using it as a stamp on a decision the user already wanted is decoration, not analysis.
- **Misapplied to product features instead of infrastructure.** "We shouldn't ship the boring version of the feature" — Choose Boring is about the *plumbing*, not the *product*. Product features should be interesting; the database underneath them should not. Some teams get this exactly backwards.
- **Treated as a single number instead of a portfolio over time.** "We've spent our token, no more new tech" — the budget regenerates as projects ship, stabilise, and become themselves boring. A technology you adopted three years ago that has since matured is not still consuming a token; it has paid its debt. The framework is dynamic, not static.

## How to cite it in a skill's output

When the skill invokes the framework, the persona phrases it something like:

- "Choose Boring Technology — McKinley's framework — says you have roughly three innovation tokens to spend over the next couple of years. Is *this* where you want to spend one?"
- "The boring alternative is X — well-understood, easy to hire for, hundreds of person-years of debugging behind it. The trade you're proposing is novelty in exchange for known operational cost; worth it only when the novelty is genuinely load-bearing for the product."
- "I'd save the innovation token for what's actually differentiating about *your* product. This isn't it."
- "Boring is a positive claim, not a fallback. Postgres is boring because tens of thousands of teams have hit every failure mode before you will. That's the asset you're buying."
- "If this *is* where you want to spend the token — say so explicitly. The framework allocates the budget; it doesn't veto the spend. The wrong move is spending the token by accident."
