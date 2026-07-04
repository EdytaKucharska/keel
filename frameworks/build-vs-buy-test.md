# The Build-vs-Buy Test

**Altitude:** Architectural.

## What it is

For any system component that has a mature SaaS or open-source equivalent, the default answer is **buy**. Build only if **both** of the following are true:

1. The component is **core to the product's differentiation** — losing it would erode the actual reason the product wins.
2. The team can **maintain it for the next two years** — not "stand it up," but operate it, patch it, harden it, secure it, and keep an on-call rotation around it.

Both conditions must hold. "Core but unmaintainable" is a slow-motion outage. "Maintainable but not core" is engineering effort spent on undifferentiated heavy lifting. The default is buy because buying converts a recurring engineering tax into a line item, and that line item is almost always cheaper than the tax once you price the engineer-hours honestly.

The failure mode the framework targets is **romanticism** — the founder or engineer who is excited to build the thing, and who tallies the cost only in licensing dollars while ignoring the cost in engineering attention, on-call burden, and opportunity.

## Source

This is a synthesised framework, not a single citable source. The closest references:

- **Joel Spolsky, "In Defense of Not-Invented-Here Syndrome" (Joel on Software, October 14, 2001).** The seminal essay on the build-side of the question. Spolsky's rule of thumb: *"If it's a core business function — do it yourself, no matter what."* The framework here inverts the emphasis ("default buy, build only if core") but the logic is the same.
- **Dan McKinley, *Choose Boring Technology* (2015).** The innovation-budget framing — engineering effort is a scarce resource; spend it where the product is differentiated. The build-vs-buy test is the operational form of that idea: building undifferentiated infrastructure spends innovation budget on plumbing.
- **Steve Yegge, "Choose Your Weapon" / "Tour de Babel" (2004–2007).** Influence on the tooling-choice register — the idea that platform and tool decisions are themselves strategic, not interchangeable.

Cite the framework as a synthesis; cite Spolsky and McKinley as the closest references.

## When it applies

Load this card when the user proposes building something in one of these categories — the ones non-technical founders most often want to "just build ourselves":

- **Auth.** "It's just OAuth, how hard could it be?" (Auth is in scope below — see worked example.)
- **Payments.** Stripe, Adyen, Paddle. PCI scope alone is reason to buy.
- **Email and transactional messaging.** SendGrid, Postmark, Resend. Deliverability is a years-long operational discipline; you don't want to acquire it.
- **Search.** Algolia, Typesense, Elastic. Relevance tuning is a domain.
- **Analytics.** PostHog, Mixpanel, Amplitude.
- **CRM.** HubSpot, Salesforce, Attio.
- **Observability.** Datadog, Honeycomb, Grafana Cloud, Sentry.
- **Scheduling and cron.** Temporal, Inngest, Trigger.dev, or managed cron.
- **Image and video processing.** Cloudinary, Mux, Transloadit.
- **AI / ML inference.** Anthropic, OpenAI, Replicate, Modal, Bedrock.

The pattern: any of these can be built. None of them are the reason a B2B SaaS, marketplace, or AI-native product wins.

## When it doesn't apply

The default is **buy**, but it isn't absolute. Buy is the wrong answer when:

- **The vendor's pricing model is structurally hostile to the product's shape.** Per-seat pricing for a high-volume product where the value is per-event. Per-event pricing for a high-frequency product where the per-event margin is thin. Per-MAU for a freemium product where most MAUs don't generate revenue. If the pricing model would make a successful product unviable at scale, the vendor isn't a fit even if the integration is easy today.
- **Integration cost rivals build cost.** When the vendor's API is bad enough, or the impedance mismatch with the domain is large enough, that wrapping it costs as much as building the thing. Rare, but real — especially in fast-moving categories where vendor APIs lag.
- **The vendor's data-portability story is bad.** If the data the vendor holds is the company's data, and the vendor's export story is "raise a ticket and wait," that's lock-in risk priced as a feature.
- **The user's commercial model is hostile to vendor dependencies.** Regulated industries (healthcare, financial services, government) where every vendor needs procurement and security review; on-prem deployments where every vendor is a customer's vendor too; air-gapped environments where SaaS isn't an option.
- **The component genuinely is the differentiation.** A search company doesn't buy search. An auth company doesn't buy auth. The framework still applies — the answer is just on the other side of the test.

## Worked example

A solo founder building a B2B SaaS for sales teams says: *"I want us to build our own auth. It's just OAuth, how hard could it be? Auth0 is expensive, and I don't want to be locked into them."*

The CTO's read: this is the framework's textbook case. Run the test.

> "Two questions. Is auth core to your differentiation? — i.e., is the reason your customers will pick you over the competition that your auth is better? My read: no. Your differentiation is the sales workflow on top. Auth is plumbing.
>
> Second — can your team maintain auth for the next two years? Not 'ship it' — *maintain* it. That's: a session-revocation story, MFA, SSO for the enterprise customers you'll have in eighteen months, SCIM provisioning for those same customers, password reset flows that don't leak account existence, rate-limiting on login endpoints, audit logging, key rotation, OAuth provider quirks, the security CVE that lands in your dependency at 11pm on a Friday. That's roughly 10–20% of one engineer's time, ongoing, forever.
>
> Cost of buying: Auth0 / Clerk / WorkOS, somewhere in the low three figures per month at your stage, scaling with users. Cost of building: roughly 20% of an engineer at $150k fully loaded — so ~$30k/year in engineering time, plus the opportunity cost of what that engineer isn't building, plus the operational tail.
>
> The 'expensive' read on Auth0 is comparing the licence to zero. It's not zero. It's comparing to your engineer's time, and your engineer's time is the most expensive thing you have.
>
> Recommendation: buy. Pick whichever vendor has the cleanest data-export story so you can leave if the pricing model turns. Spend the engineering time on the workflow your customers actually pay for."

The framework redirects the romantic build case without dismissing it. The founder isn't wrong that auth *can* be built. They're wrong about what it costs.

## Common misuse

- **"Build is cheaper because engineer time is free."** It isn't. Engineer time is the most expensive resource a small team has, and unlike a SaaS bill it doesn't scale down when usage drops. Always convert build cost to fully-loaded engineering-hours plus the opportunity cost of what the engineer isn't doing.
- **"Buy is expensive because the vendor's pricing is high."** Compared to what? "Expensive" without a comparable is a feeling, not a number. The comparable is build cost in engineering-time and operational burden — not zero.
- **"We'll build a quick version and replace it later."** The replacement almost never happens, because the quick version is in production, and by the time it hurts enough to replace, replacing it is a migration project. The "quick version" is the system you're committing to.
- **"It's open source so it's free."** Open source software is free to download, not free to operate. Self-hosted observability, self-hosted auth, self-hosted search — each is a buy decision where the vendor is your own platform team.
- **Used to refuse to evaluate.** "We don't build undifferentiated infrastructure" used as a thought-terminator. The framework requires you to *check* — it doesn't tell you the answer in advance.

## How to cite it in a skill's output

When the skill invokes the framework, the persona phrases it something like:

- "Default answer is buy. To override that, two things need to be true: it's core to your differentiation, *and* you can maintain it for the next two years. Walk me through both."
- "The 'expensive' read on the vendor is comparing the licence to zero. It's not zero. Compared to a fully-loaded engineer-month, what's the bill?"
- "You can build this. The question is whether you can *operate* it — on-call, security patches, the CVE that lands on a Friday night. That's the bit that gets skipped in the build-cost estimate."
- "This is romanticism. The interesting work is the workflow on top — auth is plumbing, and plumbing is what vendors are good at."
