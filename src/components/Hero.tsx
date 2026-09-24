import { Badge, Button } from "@/components/ui";
import {
  ArrowRightIcon,
  BoltIcon,
  CheckIcon,
  InvoiceIcon,
  ShieldIcon,
  TruckIcon,
} from "@/components/icons";

const KPIS = [
  { value: "31%", label: "Average volume saving vs. list" },
  { value: "14 days", label: "Median lead time, stocked SKUs" },
  { value: "2,400+", label: "Plants & distributors supplied" },
  { value: "98.6%", label: "On-time freight delivery" },
];

const BUYERS = [
  "NORTHRIDGE STEEL",
  "MERIDIAN AUTOWORKS",
  "PACIFIC FOODS GROUP",
  "VOLTARC ENERGY",
  "KESTREL AEROSPACE",
  "HELIOS PACKAGING",
  "BRIGHTON TOOLING",
];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-ink-950 text-white">
      {/* Background layers */}
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute inset-0 grid-blueprint-dark opacity-70" />
        <div className="absolute -top-40 -left-32 h-[36rem] w-[36rem] rounded-full bg-brand-600/25 blur-[140px]" />
        <div className="absolute top-24 -right-24 h-[30rem] w-[30rem] rounded-full bg-signal-500/15 blur-[130px]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-950" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-14 pb-20 sm:px-6 lg:pt-20 lg:pb-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          {/* Copy */}
          <div className="animate-rise">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="signal" className="bg-signal-400/15 text-signal-300 ring-signal-400/30">
                <span className="h-1.5 w-1.5 rounded-full bg-signal-400" /> Q3 fleet pricing live
              </Badge>
              <span className="font-mono text-[11px] tracking-[0.2em] text-ink-400 uppercase">
                ISO 9001 · UL · CE certified
              </span>
            </div>

            <h1 className="mt-6 text-4xl leading-[1.05] font-extrabold sm:text-5xl lg:text-[3.6rem]">
              Wholesale industrial machinery,
              <span className="relative mx-2 inline-block">
                <span className="relative z-10 text-brand-300">priced for volume.</span>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-1.5 z-0 h-3 rounded-sm bg-brand-500/25"
                />
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-300">
              Source CNC centers, robotics, conveyors and fabrication equipment direct from vetted
              OEMs. Transparent tier pricing, Net-30 terms, and freight quoted at checkout — no
              five-email RFQ loops.
            </p>

            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                { icon: InvoiceIcon, text: "Net-30 / Net-60 terms on approval" },
                { icon: TruckIcon, text: "Freight & rigging quoted instantly" },
                { icon: ShieldIcon, text: "24-month parts & labour warranty" },
                { icon: BoltIcon, text: "Punch-out to SAP, Coupa & Ariba" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2.5 text-sm text-ink-200">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/8 ring-1 ring-white/10">
                    <Icon className="h-4 w-4 text-brand-300" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                variant="signal"
                onClick={() => document.getElementById("catalog")?.scrollIntoView()}
              >
                Browse wholesale catalog
                <ArrowRightIcon className="h-4.5 w-4.5" />
              </Button>
              <Button
                size="lg"
                variant="outline-light"
                onClick={() => document.getElementById("pricing")?.scrollIntoView()}
              >
                See bulk price breaks
              </Button>
            </div>

            <p className="mt-5 flex items-center gap-2 text-xs text-ink-400">
              <CheckIcon className="h-4 w-4 text-emerald-400" />
              No card required · Quotes valid 30 days · Dedicated account engineer within 1 hour
            </p>
          </div>

          {/* Visual */}
          <div className="relative animate-rise [animation-delay:120ms]">
            <div className="relative overflow-hidden rounded-3xl ring-1 ring-white/15 shadow-2xl shadow-ink-950/60">
              <img
                src="https://images.pexels.com/photos/38804515/pexels-photo-38804515.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200"
                alt="Modern factory floor with CNC machining equipment ready for shipment"
                className="h-[22rem] w-full object-cover sm:h-[27rem]"
                loading="eager"
                width={1200}
                height={900}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/25 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/8 p-3.5 backdrop-blur-md ring-1 ring-white/15">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.18em] text-ink-300 uppercase">
                      Live inventory
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      976 machines ready to ship
                    </p>
                  </div>
                  <span className="flex items-center gap-2 rounded-full bg-emerald-400/15 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
                    In stock
                  </span>
                </div>
              </div>
            </div>

            {/* Floating tier card */}
            <div className="absolute -top-6 -left-4 hidden w-56 rounded-2xl bg-white p-4 text-ink-900 shadow-2xl shadow-ink-950/40 ring-1 ring-ink-900/5 animate-float sm:block lg:-left-10">
              <p className="font-mono text-[10px] tracking-[0.18em] text-ink-500 uppercase">
                Tier price · 25 units
              </p>
              <p className="mt-1.5 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold tracking-tight">$31,746</span>
                <span className="text-xs font-medium text-ink-400 line-through">$42,900</span>
              </p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                <div className="h-full w-[74%] rounded-full bg-gradient-to-r from-brand-500 to-brand-700" />
              </div>
              <p className="mt-2 text-xs font-semibold text-emerald-600">You save 26% per unit</p>
            </div>

            {/* Floating PO card */}
            <div className="absolute -right-3 -bottom-7 hidden w-60 rounded-2xl bg-white p-4 text-ink-900 shadow-2xl shadow-ink-950/40 ring-1 ring-ink-900/5 animate-float [animation-delay:1.4s] sm:block lg:-right-8">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                  <CheckIcon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[13px] font-semibold">PO #48-2291 approved</p>
                  <p className="font-mono text-[10px] text-ink-500">Net-30 · credit line $2.4M</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-ink-100 pt-3 text-xs">
                <span className="text-ink-500">Est. delivery</span>
                <span className="font-semibold text-ink-900">14 business days</span>
              </div>
            </div>
          </div>
        </div>

        {/* KPI strip */}
        <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/10 lg:grid-cols-4">
          {KPIS.map((kpi) => (
            <div key={kpi.label} className="bg-ink-950/80 px-5 py-6 backdrop-blur">
              <dt className="sr-only">{kpi.label}</dt>
              <dd>
                <span className="block font-display text-3xl font-extrabold tracking-tight text-white">
                  {kpi.value}
                </span>
                <span className="mt-1.5 block text-xs leading-snug text-ink-400">{kpi.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Buyer marquee */}
      <div className="relative border-t border-white/10 bg-ink-950 py-5">
        <p className="mx-auto mb-4 max-w-7xl px-6 text-center font-mono text-[10px] tracking-[0.24em] text-ink-500 uppercase">
          Procurement teams that buy on Axlon
        </p>
        <div className="mask-fade-x overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-12 pr-12">
            {[...BUYERS, ...BUYERS].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="font-display text-sm font-bold tracking-[0.12em] whitespace-nowrap text-ink-500 transition hover:text-ink-300"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
