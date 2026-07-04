# Wardley Mapping

**Altitude:** Strategic.

## What it is

A way of seeing the components a product depends on along an **evolution axis** — from *Genesis* (newly invented, novel, uncertain) → *Custom Built* (handcrafted, bespoke to one organisation) → *Product* (a category exists, multiple vendors compete, well-understood practice) → *Commodity / Utility* (you don't think about it; you consume it like electricity).

The strategic move is to **anchor at the user need** — what does the customer actually need? — and ask, for each component the product depends on to deliver that need: *where on the evolution axis is this component, and what does that imply about how we should source it?*

The operating rule the AI CTO uses:

- **Genesis / emerging components:** experiment, but cautiously. The thing is novel; the failure modes aren't catalogued yet.
- **Custom-built components:** invest here. This is where engineering effort buys differentiation — the work you do is uniquely yours.
- **Product-tier components:** evaluate vendors, buy the right one. The category exists; your job is selection, not invention.
- **Utility / commodity components:** consume, don't build. Build effort here is engineering tax with no return.

The strategic failure the framework catches: **spending custom-build effort on utility-tier components.** A founder reinventing auth, email, observability, or payment-processing infrastructure is taking engineering effort that would have differentiated the product and spending it on plumbing that's already a commodity. Wardley mapping makes this visible.

This card introduces only the evolution axis and the anchor-at-user-need idea. The full Wardley technique — value chains, climatic patterns, doctrine, gameplay — is broader, and the AI CTO doesn't reach for it casually. **This framework has a higher learning curve than the others; only invoke it when the strategic stakes justify the activation energy.**

## Source

**Simon Wardley.** The technique originated at Fotango in 2005 (after Wardley developed the evolutionary framing the year before) and was developed further at Canonical UK between 2008 and 2010.

The canonical references:

- **The book, *Wardley Maps***, published under Creative Commons Attribution-ShareAlike 4.0 — readable online at [medium.com/wardleymaps](https://medium.com/wardleymaps) and the [wardleymaps.com](https://www.wardleymaps.com) site. The book is a serialised collection across ~19 chapters.
- **Wardley's Medium archive**, where most of the strategic-mapping writing has appeared since 2014.
- For an accessible entry point: [learnwardleymapping.com](https://learnwardleymapping.com/) curates the canonical chapters and adds tutorials.

Cite the book (Creative Commons, freely readable) as the primary reference and Wardley's Medium as the working corpus.

## When it applies

Load this card when the user is making a **strategic** decision, not a tactical one:

- **"What should we build vs. what should we consume?"** Wardley mapping is the higher-altitude version of [build-vs-buy-test.md](build-vs-buy-test.md). Build-vs-buy answers component-by-component; Wardley puts the whole stack on a map and asks which slices of it are worth your engineering effort.
- **"Where should we invest engineering effort for the most leverage?"** Mapping reveals which components are differentiating (custom / genesis territory) and which are not (product / utility). Invest in the former.
- **"What's our differentiation?" / "What's our moat?"** Mapping forces the answer to be a *named component*, not a brand value. If everything on the map is product or utility, the product has no moat — and the map will show that.
- **Competitive landscape questions.** "Why is this incumbent slow to compete with us?" Often answered by mapping their stack and noticing they're treating something as custom that has commoditised — they're paying for engineering effort the world has already moved past.
- **Replatforming or strategic pivot conversations.** Mapping is useful when the question is *"is our architecture aligned with where the world is going?"* — components evolve rightward over time, and a stack anchored on yesterday's custom-built thing becomes tomorrow's commodity-not-consumed.

## When it doesn't apply

Wardley mapping is expensive activation energy. Don't pull it out for:

- **Tactical decisions.** Don't run a Wardley map to decide Postgres vs. MySQL. That's a [choose-boring-technology.md](choose-boring-technology.md) question, not a strategy question. The map will give you the same answer the boring-tech card would have, at 20x the effort.
- **Pre-product / pre-customer situations.** Mapping anchors at user need. If the user need isn't yet known — the founder is still figuring out who the customer is — there is nothing to anchor at, and the map will be a guess pretending to be a map.
- **As procrastination.** The most common misuse. A founder who is afraid to decide can spend a week refining a map and feel productive without choosing anything. If the map is sharpening the question, keep going; if the map is keeping you from answering it, stop and answer it.
- **Decisions the team won't act on.** A map that lives in one person's notebook and never gets shared is a private journal, not a strategy artifact. If the map won't change behaviour, don't draw it.
- **Mapping that ends with the same answer the user wanted at the start.** That's a smell — either the map is decorative (drawn to justify a prior decision) or the original instinct was right and the map was unnecessary. Either way, the activation energy didn't earn its keep.

## Worked example

A B2B SaaS founder serving sales teams comes in with a strategic question: *"Our customers want us to integrate with their CRMs. Should we build a deep custom integration with each major CRM, or partner with one CRM and become their best-in-class app?"*

This is genuinely strategic — the answer reshapes the product roadmap for the next year — so the activation energy is justified. Map it.

> "Let's put this on the evolution axis. Anchor: what your customer needs is *their sales workflow on top of their existing CRM data*.
>
> Components your product depends on to deliver that:
>
> - **CRM itself** (Salesforce, HubSpot, Pipedrive). Mature category, hundreds of vendors, your customer already has one. → **Utility.** You don't build a CRM; you consume one.
> - **CRM integration plumbing** (auth into their CRM, data sync, schema mapping, rate-limit handling). Mature practice — there are integration platforms (Merge, Nango, Paragon) whose entire business is exactly this. → **Product** edging toward utility. You buy or partner; you don't build.
> - **The workflow logic on top of the data** — how your product turns CRM data into the specific value your sales-team customers pay for. → **Custom built.** This is your differentiation. It doesn't exist anywhere else; you're inventing it.
> - **The fit between your workflow and the customer's specific sales process** — the parts that adapt to how *their* team works. → **Genesis / Custom.** Newest, most uncertain, most specific to your customer relationship.
>
> The map shows: CRM is utility (you consume it), integration is product (you buy or partner), workflow is custom (you invest), and customer-specific fit is genesis (you experiment cautiously).
>
> Recommendation: don't build 'a deep custom integration with each major CRM.' That's custom-effort spent on product-tier components — engineering tax with no differentiation, and it scales linearly with every new CRM you support. Use an integration platform for the plumbing, partner with whichever CRM has the strongest mid-market traction in your customer segment for go-to-market leverage, and spend the engineer-quarters you save on the workflow layer — the only part of this map that's actually yours.
>
> The map didn't tell you something you couldn't have figured out without it. It told you *where on the stack the differentiating work is*, so you can stop spending custom-build effort on the parts that aren't."

The framework's contribution: making it visually obvious that CRM-and-integration is utility-or-product territory, and that the engineering investment belongs one layer up.

## Common misuse

- **Wardley mapping as procrastination.** A week of map-refining instead of a day of deciding. If the map isn't sharpening the question, stop drawing.
- **Mapping that confirms the founder's prior.** When the map ends with the answer the user came in with, check whether the map drove the decision or whether the decision drove the map. The latter is decoration; treat it as such.
- **Maps that don't get shared.** A map that nobody else on the team uses is a personal artifact, not a strategic one. The point is *shared* situational awareness — solo mapping has limited value beyond the mapper's own clarity.
- **Treating the evolution axis as a moral hierarchy.** Genesis isn't "better" than utility; utility isn't "worse" than custom. The axis describes *where the world is*, not where things should be. Reading it as a hierarchy ("we should aspire to be on the left") inverts the framework — *you don't want to be on the left*, you want your *differentiation* to be on the left and everything else to be on the right.
- **Reaching for it for tactical decisions.** Stack-of-cards costing a tactical decision under Wardley mapping is overengineering the question. Reserve it for genuinely strategic moments.

## How to cite it in a skill's output

When the skill invokes the framework, the persona phrases it something like:

- "Let's put this on Wardley's evolution axis: genesis, custom-built, product, utility. Where on that axis is each component you're depending on?"
- "Anchor at the user need. What does the customer actually need? Now: of the components you'd use to deliver that, which are *yours* (custom), and which are everyone else's (utility)?"
- "You're spending custom-build effort on utility-tier components. That's engineering tax — Wardley calls this 'doing battle on the wrong terrain.' Push the utility consumption out and put the engineering where the map says it'll matter."
- "I'd reach for this framework only because the stakes are strategic. For tactical decisions there are cheaper lenses — but this one's worth the activation energy."
