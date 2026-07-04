# The Unit-Economics Decomposition

**Altitude:** Tactical.

## What it is

Any infrastructure-cost question — "our AWS bill is too high," "should we switch from vendor X to vendor Y?", "is this architecture affordable at scale?" — gets the same first move: **decompose the bill into per-request, per-user, and per-feature line items, then identify the top three.**

The core empirical claim: **most cost-optimisation wins are concentrated in two or three line items, not spread evenly.** A bill that looks like a wall of charges almost always reduces to a small number of dominant items and a long tail of rounding error. Finding the top three is finding 80% of the bill — and 80% of the achievable savings.

The framework targets two failure modes:

1. **Monolithic bills.** "We need to reduce AWS spend" is not actionable. It's a wish. Decomposition turns it into a list of specific levers, each with a specific owner and a specific change.
2. **Vendor-switching as the default answer.** When a bill is high, the instinct is "let's find a cheaper vendor." Decomposition almost always reveals that the current vendor used differently is cheaper than a new vendor used the same way — and switching vendors has its own cost (migration, retraining, integration rework) that the cheaper-vendor pitch ignores.

The output of the framework is not "switch this thing for that thing." It's *"the top three line items are X, Y, Z; the cheapest material change is to reduce X by half by doing Q."*

## Source

This is a synthesised framework, not a citable single original. Be honest about that. The influences:

- **Brendan Gregg's performance engineering work** — the discipline of measuring before optimising, decomposing aggregate metrics into per-call or per-resource numbers, and resisting the urge to fix the loudest thing before identifying the most expensive thing. *Systems Performance* (2nd ed., 2020) and the [USE Method](https://www.brendangregg.com/usemethod.html) are the canonical references.
- **AWS Well-Architected Framework, Cost Optimization pillar.** AWS's articulation of cost optimisation as a continuous discipline of attribution (who paid for what), expenditure awareness (where the money goes), and right-sizing (using what you need, not what you provisioned). [aws.amazon.com/architecture/well-architected](https://aws.amazon.com/architecture/well-architected/) is the entry point.
- **Charity Majors' writing on observability costs** — particularly the recurring observation that observability bills explode because of *what gets sent*, not because of vendor pricing, and that the right intervention is upstream (cardinality, sampling, retention) rather than downstream (switching vendors). See [charity.wtf](https://charity.wtf/) and the Honeycomb blog.

The synthesis is operational, not theoretical: it's the move that experienced engineers make in front of any infrastructure-cost question. Cite the influences without overclaiming a single origin.

## When it applies

Load this card when the user is:

- **Asking any cost question.** "Our AWS bill is too high," "we spend $X on Y, is that normal?", "the board asked us to reduce infrastructure spend by 30%."
- **Evaluating a proposed architecture for cost.** "If we go with this stack, what does it cost at 10k users vs. 100k?" The decomposition forces the question into per-unit terms instead of vague totals.
- **Justifying a cost-reduction investment.** Whether to the board, a co-founder, or to themselves: "we're going to spend two engineer-weeks on this and save $X/month" is defensible only if the X is real and concentrated.
- **Comparing managed vs. self-hosted options.** "Should we move off Datadog and self-host?" — usually a misframing. The right framing is *what specific charges are driving the bill, and what would each of them cost in either configuration?*
- **Considering a vendor switch.** Decomposition is the gate that decides whether the switch is the right move or a distraction.

## When it doesn't apply

Cost decomposition has limits.

- **The cost isn't material.** A $200/month bill on a pre-revenue product isn't worth a half-day of analysis. The framework has a fixed activation cost; below a certain bill size, that cost dominates the savings.
- **The user is fishing for justification, not analysis.** Sometimes the user has already decided to cut something — a vendor they don't like, a service they don't understand — and they're asking for the framework to ratify the decision. The framework is neutral. If it ratifies, fine; if it doesn't, the user should hear that.
- **Pre-product / pre-traffic situations.** Per-user cost is a real number only if there are users. For a product with five test accounts, decomposition produces a useful *architecture-cost forecast* but not a useful *current-bill diagnosis*. Be clear which question you're answering.
- **The cost is dominated by fixed commitments.** If 70% of the bill is a multi-year contract or a reserved-instance commitment, optimising the 30% you control is a smaller lever than the framing suggests. Note the constraint before the analysis, not after.
- **Used to litigate every minor charge.** The framework targets *concentration* — the top three. A meeting spent debating the $40/month logging bill while the $6,000/month compute bill goes unexamined has the framework upside down.

## Worked example

A founder comes in with a familiar complaint: *"Our Datadog bill is $8,000 a month. Can we cut it? Should we switch to Grafana Cloud or self-host Prometheus?"*

The CTO's read: don't pick a destination before mapping where the money goes. Run the decomposition.

> "Before we talk about switching, let's decompose the $8,000. Datadog itemises by product line — pull the last invoice and let's read it.
>
> Walking through the bill:
>
> - **Logs ingest and retention: $6,400 (80%).** That's the dominant line item. Of that, ~90% is from a single service — your data-pipeline workers — which logs every record processed. Roughly 50 million log lines per day, most of them duplicates of a successful-processing message.
> - **APM hosts: $1,200 (15%).** APM enabled across all services, including the three workers that are batch jobs and don't have user-facing latency to trace.
> - **Synthetics, RUM, infra metrics, everything else: $400 (5%).** Rounding error.
>
> Top three line items: log volume from one service, APM on services that don't need it, and everything-else-combined. The 'everything else' isn't where the money is. The first two are.
>
> Now the levers:
>
> - **The data-pipeline logs.** Either downgrade the successful-processing log from INFO to DEBUG (so it isn't ingested in production), or batch the log into a per-minute counter ('processed 4,521 records'). Either change drops log volume by ~90% — call it $4,000/month saved.
> - **APM on the batch workers.** Just turn it off. They aren't user-facing; the trace data isn't being read. $400–600/month saved.
> - **The 5%.** Leave it alone. Optimising it doesn't matter.
>
> Total achievable from these two changes: ~$4,500/month, or about 55% of the bill. Engineering effort: a few hours, probably less than a day.
>
> Compare that to the alternative the question opened with — switching to Grafana Cloud or self-hosting Prometheus. Even if the new vendor were *free*, the migration cost is engineer-weeks: re-instrumenting services, recreating dashboards, training the team on new tooling, dealing with the period where you're paying for both. And once you're there, the *same misconfiguration* — the data-pipeline service logging every record — will produce a different but proportional bill.
>
> Recommendation: don't switch. Reduce log volume from the one service. Turn APM off where it isn't being used. Same vendor, ~55% cost reduction, day of engineering work. Revisit the vendor question only if the bill is still painful after the cleanup — by which point you'll know it's vendor pricing, not vendor usage."

The framework's contribution: surfacing that the question wasn't "Datadog vs. alternative," it was "what specifically are we paying for, and which of those things do we want to keep paying for." The decomposition reveals that the cheapest fix is the same vendor used differently.

## Common misuse

- **Jumping to vendor-switching as the answer.** Switching costs are usually larger than the price delta justifies, and the same misconfiguration follows you to the new vendor. Decompose first; switch only if the line-item analysis says the *vendor* is the line item.
- **Treating the bill as monolithic.** "We need to reduce AWS costs" is not actionable. "Reduce the NAT gateway charges in us-east-1 by routing internal traffic through a VPC endpoint" is. The framework only earns its keep when the conclusion is specific.
- **Decomposing without then identifying the top three.** Some teams produce beautifully detailed cost dashboards and stop there. The dashboard is the means; identifying the dominant items and a specific change to each is the end. A dashboard nobody acts on is more expensive than no dashboard, because it confers the *appearance* of cost management.
- **Per-user numbers that aren't per-user.** "We spend $X per user" computed by dividing total bill by total registered users — including dead accounts, free-tier users, internal accounts — produces a number that means nothing. Per-user is per-*active*-user, and "active" needs a definition.
- **Decomposing for a bill that isn't material.** A pre-revenue product spending $300/month doesn't need the framework; it needs revenue. Match the analytical effort to the size of the bill.
- **Using the framework to validate a decision already made.** "We've decided to leave AWS; please run the decomposition to support it." The framework is neutral — if it doesn't support the decision, the user needs to hear that.

## How to cite it in a skill's output

When the skill invokes the framework, the persona phrases it something like:

- "**Let's decompose this. What does this cost per request, per user, per feature? Then we'll know what to actually optimise.**"
- "**The top three line items are usually 80% of the bill; the rest is rounding error.** Pull the last invoice and let's find the three."
- "Before we talk about switching vendors, let's see where the money goes inside the current one. The same vendor used differently is almost always cheaper than a new vendor used the same way."
- "I want to be careful here — this looks like a usage question dressed as a vendor question. The expensive line item probably follows you to whatever you switch to. Let's check before we commit to a migration."
- "Match the analytical effort to the size of the bill. We don't run this framework on a $200/month line."

This framework pairs naturally with [choose-boring-technology.md](choose-boring-technology.md) (engineering attention is the scarce resource — don't spend it on a vendor migration when a usage change is cheaper) and [build-vs-buy-test.md](build-vs-buy-test.md) (decomposition often reveals that 'self-host to save money' would cost more in engineering time than the SaaS bill it replaces).
