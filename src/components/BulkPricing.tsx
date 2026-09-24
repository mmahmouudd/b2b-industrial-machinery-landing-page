import { useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import { PRODUCTS, currency, tierFor, unitPriceFor } from "@/data/catalog";
import { useQuote } from "@/context/QuoteContext";
import { Badge, Button, SectionHeading } from "@/components/ui";
import { ArrowRightIcon, CheckIcon, ChartIcon, InvoiceIcon, WrenchIcon } from "@/components/icons";

const FEATURED_IDS = ["titan18", "profeed", "cobot12", "vx620"];

const INCLUSIONS = [
  "Freight to dock (contiguous US) on orders over $25k",
  "Commissioning & operator training, 2 days on-site",
  "24-month parts + labour warranty, 4-hour remote SLA",
  "Spare-parts kit priced at 18% below list",
];

export default function BulkPricing() {
  const { addLine, setDrawerOpen } = useQuote();
  const [activeId, setActiveId] = useState(FEATURED_IDS[0]);
  const product = PRODUCTS.find((p) => p.id === activeId)!;
  const tiers = useMemo(() => [...product.tiers].sort((a, b) => a.min - b.min), [product]);
  const maxQty = 120;
  const [qty, setQty] = useState(12);

  const unit = unitPriceFor(product, qty);
  const activeTier = tierFor(product, qty);
  const total = unit * qty;
  const listTotal = product.listPrice * qty;
  const saved = listTotal - total;
  const nextTier = tiers.find((t) => t.min > qty);

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="relative scroll-mt-24 overflow-hidden bg-ink-950 py-20 text-white lg:py-24"
    >
      <div aria-hidden="true" className="absolute inset-0 grid-blueprint-dark opacity-60" />
      <div
        aria-hidden="true"
        className="absolute -top-24 right-0 h-[28rem] w-[28rem] rounded-full bg-brand-600/20 blur-[130px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="pricing-title"
          dark
          eyebrow="Volume pricing"
          title="Price breaks published up front — no gatekeeping"
          description="Every SKU carries a public tier schedule. Move the slider to model your annual build-out, then push the configuration straight into a quote or PO."
        />

        {/* Product tabs */}
        <div
          className="mt-10 flex gap-2 overflow-x-auto pb-2 scrollbar-slim"
          role="group"
          aria-label="Select a machine to price"
        >
          {FEATURED_IDS.map((id) => {
            const p = PRODUCTS.find((x) => x.id === id)!;
            const active = id === activeId;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setActiveId(id);
                  setQty(Math.max(p.moq, Math.min(qty, maxQty)));
                }}
                className={cn(
                  "shrink-0 rounded-xl px-4 py-3 text-left text-sm transition ring-1",
                  active
                    ? "bg-white text-ink-950 ring-white"
                    : "bg-white/5 text-ink-300 ring-white/10 hover:bg-white/10 hover:text-white",
                )}
              >
                <span className="block font-semibold">{p.name.split(" ").slice(0, 3).join(" ")}</span>
                <span className={cn("font-mono text-[10px]", active ? "text-ink-500" : "text-ink-400")}>
                  {p.sku}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Tier table */}
          <div className="overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/12 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
              <div>
                <h3 className="font-display text-lg font-bold text-white">{product.name}</h3>
                <p className="mt-0.5 font-mono text-[11px] text-ink-400">
                  {product.sku} · MOQ {product.moq} · {product.leadTimeDays}-day lead
                </p>
              </div>
              <Badge tone="signal" className="bg-signal-400/15 text-signal-300 ring-signal-400/30">
                List {currency(product.listPrice)}
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[34rem] text-left text-sm">
                <caption className="sr-only">
                  Volume discount schedule for {product.name}
                </caption>
                <thead>
                  <tr className="border-b border-white/10 font-mono text-[10px] tracking-[0.14em] text-ink-400 uppercase">
                    <th scope="col" className="px-5 py-3 font-medium">
                      Quantity band
                    </th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">
                      Unit price
                    </th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">
                      Discount
                    </th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">
                      Est. extended
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tiers.map((tier) => {
                    const isActive = tier.min === activeTier.min;
                    const tierUnit = Math.round(product.listPrice * (1 - tier.discount));
                    return (
                      <tr
                        key={tier.min}
                        className={cn(
                          "border-b border-white/5 transition last:border-0",
                          isActive ? "bg-brand-500/15" : "hover:bg-white/5",
                        )}
                      >
                        <th scope="row" className="px-5 py-3.5 font-medium text-white">
                          <span className="flex items-center gap-2.5">
                            {isActive && (
                              <span className="h-1.5 w-1.5 rounded-full bg-brand-300" aria-hidden="true" />
                            )}
                            <span className={cn(!isActive && "pl-4")}>
                              {tier.min}
                              {tier.max ? `–${tier.max}` : "+"} units
                            </span>
                            {isActive && (
                              <span className="rounded-full bg-brand-400/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-brand-200 uppercase">
                                Your tier
                              </span>
                            )}
                          </span>
                        </th>
                        <td className="px-5 py-3.5 text-right font-mono text-white">
                          {currency(tierUnit)}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <span
                            className={cn(
                              "font-semibold",
                              tier.discount > 0 ? "text-emerald-400" : "text-ink-400",
                            )}
                          >
                            {tier.discount > 0 ? `−${Math.round(tier.discount * 100)}%` : "List"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono text-ink-300">
                          {currency(tierUnit * tier.min)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="border-t border-white/10 px-5 py-4">
              <p className="font-mono text-[10px] tracking-[0.16em] text-ink-400 uppercase">
                Every tier includes
              </p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {INCLUSIONS.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[13px] text-ink-300">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Calculator */}
          <div className="flex flex-col gap-5">
            <div className="rounded-2xl bg-white p-6 text-ink-950 shadow-2xl shadow-ink-950/40">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  <ChartIcon className="h-4.5 w-4.5" />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold">Volume estimator</h3>
                  <p className="text-xs text-ink-500">Live tier pricing, updated as you scale</p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-baseline justify-between">
                  <label htmlFor="qty-slider" className="text-sm font-medium text-ink-700">
                    Order quantity
                  </label>
                  <span className="font-mono text-2xl font-bold text-ink-950">{qty}</span>
                </div>
                <input
                  id="qty-slider"
                  type="range"
                  min={product.moq}
                  max={maxQty}
                  step={1}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  aria-valuetext={`${qty} units at ${currency(unit)} each`}
                  className="mt-3"
                />
                <div className="mt-2 flex justify-between font-mono text-[10px] text-ink-400">
                  <span>{product.moq}</span>
                  {tiers.slice(1).map((t) => (
                    <button
                      key={t.min}
                      type="button"
                      onClick={() => setQty(t.min)}
                      className="rounded px-1 transition hover:text-brand-700"
                    >
                      {t.min}
                    </button>
                  ))}
                  <span>{maxQty}</span>
                </div>
              </div>

              <dl className="mt-6 space-y-3 rounded-xl bg-ink-50 p-4 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-ink-600">Unit price</dt>
                  <dd className="font-mono font-semibold text-ink-950">{currency(unit)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-ink-600">Tier discount</dt>
                  <dd className="font-semibold text-emerald-600">
                    −{Math.round(activeTier.discount * 100)}%
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-ink-200 pt-3">
                  <dt className="font-semibold text-ink-900">Extended total</dt>
                  <dd className="font-display text-xl font-extrabold text-ink-950">
                    {currency(total)}
                  </dd>
                </div>
                {saved > 0 && (
                  <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2">
                    <dt className="text-xs font-semibold text-emerald-700">You save vs. list</dt>
                    <dd className="font-mono text-sm font-bold text-emerald-700">
                      {currency(saved)}
                    </dd>
                  </div>
                )}
              </dl>

              {nextTier && (
                <p className="mt-3 rounded-lg bg-signal-50 px-3 py-2.5 text-xs leading-relaxed text-signal-700 ring-1 ring-signal-200">
                  <span className="font-semibold">Almost there:</span> add{" "}
                  {nextTier.min - qty} unit{nextTier.min - qty === 1 ? "" : "s"} to reach{" "}
                  {Math.round(nextTier.discount * 100)}% off — that unlocks{" "}
                  {currency((unit - unitPriceFor(product, nextTier.min)) * nextTier.min)} in extra
                  savings.
                </p>
              )}

              <div className="mt-5 flex flex-col gap-2.5">
                <Button
                  size="lg"
                  onClick={() => {
                    addLine(product.id, qty);
                    setDrawerOpen(true);
                  }}
                >
                  Add {qty} units to quote <ArrowRightIcon className="h-4.5 w-4.5" />
                </Button>
                <Button variant="secondary" onClick={() => document.getElementById("checkout")?.scrollIntoView()}>
                  Request contract pricing
                </Button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {[
                {
                  icon: InvoiceIcon,
                  title: "Net-30 / Net-60 terms",
                  body: "Credit lines to $5M issued in 24h with a D&B check — no personal guarantee.",
                },
                {
                  icon: WrenchIcon,
                  title: "Trade-in credit",
                  body: "Offset up to 22% by trading legacy assets. Appraisal via photo upload.",
                },
              ].map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/12 backdrop-blur transition hover:bg-white/8"
                >
                  <Icon className="h-5 w-5 text-brand-300" />
                  <h4 className="mt-3 font-display text-sm font-bold text-white">{title}</h4>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-300">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
