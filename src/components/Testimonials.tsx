import { SectionHeading, Stars } from "@/components/ui";

const QUOTES = [
  {
    quote:
      "We consolidated 14 machine suppliers into one Axlon contract. Tier pricing alone took 23% out of our 2025 capex plan, and freight finally stopped being a surprise line item.",
    name: "Dana Whitfield",
    role: "VP Procurement, Northridge Steel",
    metric: "23%",
    metricLabel: "capex reduction",
    initials: "DW",
  },
  {
    quote:
      "The punch-out into Coupa was live in nine days. Our buyers now self-serve on standard SKUs and only escalate custom lines — approval cycles dropped from three weeks to two days.",
    name: "Marcus Oyelaran",
    role: "Director of Operations, Meridian Autoworks",
    metric: "2 days",
    metricLabel: "approval cycle",
    initials: "MO",
  },
  {
    quote:
      "Twelve cobots delivered to three plants inside a month, commissioned by their crew. Uptime has held at 99.2% since, and spares ship from the Columbus hub overnight.",
    name: "Priya Raghavan",
    role: "Plant Engineering Lead, Helios Packaging",
    metric: "99.2%",
    metricLabel: "line uptime",
    initials: "PR",
  },
];

export default function Testimonials() {
  return (
    <section aria-labelledby="proof-title" className="bg-ink-50 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="proof-title"
          align="center"
          eyebrow="Verified buyers"
          title="2,400 plants run their capital purchasing here"
          description="Reviews are collected post-commissioning from verified purchase orders — no incentives, no editing."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {QUOTES.map((item) => (
            <figure
              key={item.name}
              className="flex flex-col rounded-2xl bg-white p-6 ring-1 ring-ink-200 transition hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgb(11_26_43/0.45)]"
            >
              <Stars rating={5} />
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-700">
                “{item.quote}”
              </blockquote>
              <div className="mt-5 flex items-center justify-between gap-4 border-t border-ink-100 pt-5">
                <figcaption className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink-950 font-display text-xs font-bold text-white">
                    {item.initials}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink-950">{item.name}</span>
                    <span className="block text-xs text-ink-500">{item.role}</span>
                  </span>
                </figcaption>
                <div className="text-right">
                  <span className="block font-display text-lg font-extrabold text-brand-700">
                    {item.metric}
                  </span>
                  <span className="block text-[10px] tracking-wide text-ink-500 uppercase">
                    {item.metricLabel}
                  </span>
                </div>
              </div>
            </figure>
          ))}
        </div>

        <div className="mt-6 grid gap-px overflow-hidden rounded-2xl bg-ink-200 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: "4.8 / 5", v: "Average buyer rating" },
            { k: "$1.4B", v: "Equipment transacted" },
            { k: "180", v: "Audited OEM partners" },
            { k: "24 mo", v: "Standard warranty" },
          ].map((stat) => (
            <div key={stat.v} className="bg-white px-5 py-6 text-center">
              <p className="font-display text-2xl font-extrabold text-ink-950">{stat.k}</p>
              <p className="mt-1 text-xs text-ink-500">{stat.v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
