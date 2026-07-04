# The Accelerate Four (DORA Metrics)

**Altitude:** Tactical.

## What it is

Four metrics that, together, describe an engineering organisation's ability to deliver software:

1. **Deployment Frequency** — how often the organisation successfully releases to production.
2. **Lead Time for Changes** — the time from a commit landing in version control to that change running in production.
3. **Change Failure Rate** — the percentage of deployments that cause a production failure requiring a rollback, a hotfix, or other immediate intervention.
4. **Failed Deployment Recovery Time** (originally "Mean Time to Restore Service" / MTTR) — how long it takes to recover service after a deployment-related production failure.

The first two are **throughput** metrics: how much, how fast. The second two are **stability** metrics: how often it breaks, how quickly it recovers. Treating throughput without stability is reckless; treating stability without throughput is paralysis. The metrics are designed to be read **together** — improvement on one at the expense of another is not improvement.

This framework is **measurement-shaped, not decision-shaped.** It doesn't tell the user what to do. It tells them where the engineering organisation actually is, in numbers the user can hold against a benchmark and against itself over time. When the user asks "how do we move faster?" or "is our engineering healthy?", these are the four numbers that turn the question from opinion into diagnosis.

## Source

**Nicole Forsgren, Jez Humble, and Gene Kim — *Accelerate: The Science of Lean Software and DevOps* (IT Revolution Press, 2018).** The metrics emerged from the DORA (DevOps Research and Assessment) research programme; *Accelerate* synthesises the findings.

DORA continues to publish the *State of DevOps* report annually, and the canonical metric definitions live at [dora.dev](https://dora.dev/guides/dora-metrics-four-keys/). The definitions evolve slightly each year — notably, "Mean Time to Restore" has been refined to "Failed Deployment Recovery Time" to make clear that the metric measures deployment-related recovery specifically, not all production incidents. When citing, prefer the current dora.dev phrasing; treat older articulations as historical.

DORA also publishes performance benchmarks — Elite, High, Medium, Low — derived from the annual survey. These are useful for orienting a team relative to industry, but the more important comparison is **the team against itself over time**.

## When it applies

Load this card when the user is:

- **Asking "how do we ship faster?"** The four metrics turn the question from a vibes-based answer ("hire more engineers," "use AI," "be agile") into a specific one ("your lead time is two weeks, here's where the time goes").
- **Evaluating an engineering organisation's health.** A founder or board member asking "is engineering working?" gets a defensible answer in four numbers, not an opinion.
- **Comparing teams or benchmarking against industry.** The DORA buckets (Elite / High / Medium / Low) give a defensible external comparison — though see misuses below.
- **Justifying investment in CI/CD, observability, test infrastructure, or platform work.** The metrics give the business case its denominator: *"deploys take 40 minutes, and we deploy 200x a quarter; halving deploy time pays back the platform work in two quarters."*
- **Deciding whether engineering velocity is actually a problem.** Sometimes the user *feels* slow but the metrics show the team is shipping well; the problem is elsewhere (product clarity, customer feedback loop). The metrics let you tell the difference.

## When it doesn't apply

The Accelerate four are not universal. They go wrong when used outside their range.

- **Pre-product / pre-shipping cadence.** A team that hasn't shipped anything has no deployment frequency to measure. Trying to measure DORA on a 3-week-old prototype is measurement theatre. Wait until there's a shipping cadence to characterise.
- **Teams too small for the metrics to be statistically meaningful.** For a one-person team, deployment frequency is "whatever I decided to do today." For a two-person team, change failure rate is two data points wide and a single bad week destroys the average. The metrics start being useful around 5+ engineers shipping at a regular cadence.
- **Measurement without intent to change.** "We have a DORA dashboard" is not improvement. Tracking the metrics is cheap; *changing behaviour based on them* is the work. A dashboard that never moves anyone's decision-making is theatre.
- **One-number summarisation.** The metrics do not reduce to a single score, and any tool that compresses them into one ("Engineering Health Score: 8.4") loses what they're for. Throughput at the expense of stability is bad performance dressed as good.
- **Performance management of individuals.** These are *team* metrics, measuring a system. Using deployment frequency to evaluate an individual engineer's productivity is a category error — and a fast way to incentivise gaming the metric.
- **Comparison against organisations with radically different stakes.** Comparing a startup's change failure rate against a hyperscaler's, or a regulated financial-services team's against a consumer-app team's, is comparing different sports. Use the benchmarks for orientation, not judgement.

## Worked example

A non-technical founder comes in worried that engineering is slow. Their lead engineer's defence: *"We're shipping as fast as we can."*

The CTO's read: "as fast as we can" isn't a measurement. Run the four numbers.

> "Let's get the four numbers and see whether 'as fast as we can' holds up.
>
> - **Deployment frequency:** we deploy roughly twice a week. Fine for the stage.
> - **Lead time for changes:** the median commit takes about two weeks to reach production. That's the number to look at first.
> - **Change failure rate:** about 30% of deploys need a hotfix or rollback.
> - **Recovery time:** when a deploy fails, it takes ~4 hours to recover on average.
>
> 'As fast as we can' isn't what these numbers say. They say something more specific: the team is shipping, but each individual change waits two weeks in a queue, fails almost a third of the time, and takes half a workday to recover from when it does. None of those are 'fast.' They're each symptoms of specific bottlenecks, and each one has a different fix.
>
> - **Two-week lead time** usually means PRs are sitting in code review, or CI is slow, or staging environment access is a bottleneck. Walk the steps. Where does a commit spend the two weeks?
> - **30% change failure rate** is high. The usual cause is deploys being too large, so each one carries more risk. Smaller, more frequent deploys mean smaller blast radius per failure. (Notice: this also improves lead time. The two failures are connected.)
> - **4-hour recovery time** means there's no fast rollback. Either there's no automated rollback, or deploys are coupled across services in ways that make rolling back one thing hard. This is usually the cheapest of the four to fix and the most visible improvement.
>
> The conversation just changed shape. 'We're shipping as fast as we can' was an opinion; the four numbers are a diagnosis. The right next conversation with your lead engineer is: *which of these three do we attack first, and what's the trigger to know it worked?*"

The framework's contribution: turning a defensive-sounding statement into a productive next conversation, with measurable improvement criteria.

## Common misuse

- **"We have a dashboard."** Measuring isn't improving. The dashboard pays for itself only when someone's decisions change because of what it shows. A static dashboard is decoration.
- **Benchmarking against FAANG / hyperscalers.** Different team sizes, different stakes, different blast radii. The DORA buckets are a coarse industry comparison; the more useful comparison is the team against itself last quarter.
- **Evaluating individuals on team metrics.** Using deployment frequency to grade an engineer creates strong incentives to merge faster (often: smaller, less-reviewed) and to externalise failure (it was the deploy, not me). Don't do this. The metrics describe a system, not a person.
- **Chasing one metric in isolation.** "Higher deploy frequency is better!" — true only if change failure rate doesn't blow up alongside. Throughput without stability is just shipping bugs faster. Always read all four together.
- **Treating the metrics as targets rather than indicators.** [Goodhart's law](https://en.wikipedia.org/wiki/Goodhart%27s_law) applies — the moment a metric becomes a target, it becomes a gameable proxy. If "increase deploys per week" becomes a quarterly goal, teams will deploy more empty commits. The metrics are diagnostics; use them to find the bottleneck, not to drive the team.
- **Using DORA to mask deeper questions.** "Our DORA numbers are fine" doesn't mean the product is shipping the right things — these metrics measure the *engineering pipeline*, not whether the work going through it is the right work. Pair with product-level signals before declaring health.

## How to cite it in a skill's output

When the skill invokes the framework, the persona phrases it something like:

- "**Improvement on these four metrics is the answer to 'how do we move faster' — speeches about culture are not.** Let's get the four numbers."
- "Deploy frequency, lead time for changes, change failure rate, recovery time. Each one has a different fix. 'We're slow' isn't a diagnosis — these four are."
- "Read all four together. Throughput at the cost of stability isn't progress; it's shipping bugs faster."
- "The useful comparison is your team this quarter vs. your team last quarter, not your team vs. the latest DORA Elite benchmark."
- "I want to be honest: these measure the engineering *pipeline*. They don't tell you whether you're shipping the *right* work. That's a different conversation, and it's the next one we should have."
