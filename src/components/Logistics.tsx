import { SectionHeading, Badge } from "@/components/ui";
import {
  BoltIcon,
  ChartIcon,
  FactoryIcon,
  GlobeIcon,
  InvoiceIcon,
  ShieldIcon,
  TruckIcon,
  WrenchIcon,
} from "@/components/icons";

const STEPS = [
  {
    n: "01",
    title: "Spec & filter",
    body: "Narrow 9,400 SKUs by tolerance, throughput, voltage and certification. Compare up to four machines side by side.",
    icon: FactoryIcon,
  },
  {
    n: "02",
    title: "Model your volume",
    body: "Public tier pricing shows exactly where the next break lands. Export the model as a PDF for internal approval.",
    icon: ChartIcon,
  },
  {
    n: "03",
    title: "Buy on terms",
    body: "Submit the PO with Net-30, lease or prepay. Freight, rigging and commissioning are priced in the same basket.",
    icon: InvoiceIcon,
  },
];

const FEATURES = [
  {
    icon: TruckIcon,
    title: "Freight desk on staff",
    body: "In-house logistics team books oversize, flat-rack and bonded shipments — 98.6% on-time across 41 countries.",
  },
  {
    icon: ShieldIcon,
    title: "Vetted OEM network",
    body: "Every supplier passes a 62-point audit covering QMS, traceability and spare-part availability for 10 years.",
  },
  {
    icon: WrenchIcon,
    title: "Uptime guarantee",
    body: "4-hour remote response, 48-hour field dispatch, and a consignment spares programme at your plant.",
  },
  {
    icon: BoltIcon,
    title: "Procurement integrations",
    body: "cXML punch-out for SAP Ariba, Coupa and Jaggaer. Line-level invoices flow straight into your ERP.",
  },
];

export default function Logistics() {
  return (
    <section
      id="logistics"
      aria-labelledby="logistics-title"
      className="scroll-mt-24 border-t border-ink-200/70 bg-gradient-to-b from-white to-ink-50 py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="logistics-title"
          eyebrow="How wholesale works"
          title="Procurement infrastructure, not just a product catalog"
          description="Axlon sits between 180 vetted OEMs and your plant floor — consolidating sourcing, freight, financing and after-sales into a single contract."
        />

        {/* Steps */}
        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {STEPS.map(({ n, title, body, icon: Icon }) => (
            <li
              key={n}
              className="group relative overflow-hidden rounded-2xl bg-ink-50 p-6 ring-1 ring-ink-200 transition hover:bg-white hover:shadow-[0_24px_50px_-30px_rgb(11_26_43/0.45)]"
            >
              <span
                aria-hidden="true"
                className="absolute -top-4 right-3 font-display text-7xl font-extrabold text-ink-200/70 transition group-hover:text-brand-100"
              >
                {n}
              </span>
              <span className="relative grid h-11 w-11 place-items-center rounded-xl bg-ink-950 text-white">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="relative mt-5 font-display text-lg font-bold text-ink-950">{title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-ink-600">{body}</p>
            </li>
          ))}
        </ol>

        {/* Feature grid + visual */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative overflow-hidden rounded-3xl bg-ink-950 ring-1 ring-ink-900">
            <img
              src="https://images.pexels.com/photos/34718930/pexels-photo-34718930.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200"
              alt="Wide view of an automated factory interior with conveyor systems and machinery"
              loading="lazy"
              className="h-full min-h-[22rem] w-full object-cover opacity-80"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <Badge tone="signal" className="bg-signal-400/15 text-signal-300 ring-signal-400/30">
                <GlobeIcon className="h-3 w-3" /> 6 regional hubs
              </Badge>
              <h3 className="mt-3 font-display text-xl font-bold text-white">
                Stock positioned near your plant
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-300">
                Columbus, Monterrey, Rotterdam, Katowice, Johor and Busan hubs hold $148M of
                inventory, cutting average lead time from 96 to 14 days.
              </p>
              <dl className="mt-5 grid grid-cols-3 gap-4 border-t border-white/15 pt-4">
                {[
                  { k: "$148M", v: "Inventory on hand" },
                  { k: "41", v: "Countries served" },
                  { k: "14d", v: "Median lead time" },
                ].map((s) => (
                  <div key={s.v}>
                    <dt className="sr-only">{s.v}</dt>
                    <dd>
                      <span className="block font-display text-xl font-extrabold text-white">
                        {s.k}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-ink-400">{s.v}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-ink-200 bg-white p-6 transition hover:border-brand-200 hover:bg-brand-50/40"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-ink-950">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
