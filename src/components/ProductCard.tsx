import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import {
  bestDiscount,
  currency,
  tierFor,
  unitPriceFor,
  type Product,
} from "@/data/catalog";
import { useQuote } from "@/context/QuoteContext";
import { Badge, Button, QtyStepper, Stars } from "@/components/ui";
import { CartIcon, CheckIcon, ClockIcon, ShieldIcon } from "@/components/icons";

function StockPill({ stock }: { stock: number }) {
  if (stock > 40)
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> In stock · {stock} units
      </span>
    );
  if (stock > 0)
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-signal-700">
        <span className="h-1.5 w-1.5 rounded-full bg-signal-400" /> Low stock · {stock} left
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink-500">
      <span className="h-1.5 w-1.5 rounded-full bg-ink-300" /> Made to order
    </span>
  );
}

export default function ProductCard({
  product,
  view = "grid",
}: {
  product: Product;
  view?: "grid" | "list";
}) {
  const { addLine } = useQuote();
  const [qty, setQty] = useState(product.moq);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(t);
  }, [added]);

  const unit = unitPriceFor(product, qty);
  const tier = tierFor(product, qty);
  const nextTier = [...product.tiers].sort((a, b) => a.min - b.min).find((t) => t.min > qty);
  const savings = (product.listPrice - unit) * qty;

  const handleAdd = () => {
    addLine(product.id, qty);
    setAdded(true);
  };

  return (
    <article
      className={cn(
        "group relative flex overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200/80 transition duration-300",
        "hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgb(11_26_43/0.4)] hover:ring-ink-300",
        view === "grid" ? "flex-col" : "flex-col sm:flex-row",
      )}
      aria-labelledby={`product-${product.id}-title`}
    >
      {/* Media */}
      <div
        className={cn(
          "relative shrink-0 overflow-hidden bg-ink-100",
          view === "grid" ? "aspect-[16/10]" : "h-48 sm:h-auto sm:w-64 sm:self-stretch",
        )}
      >
        <img
          src={product.image}
          alt={product.alt}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {product.badge && <Badge tone="dark">{product.badge}</Badge>}
          {bestDiscount(product) >= 0.25 && <Badge tone="signal">Save up to 26%</Badge>}
        </div>
        <span className="absolute right-3 bottom-3 rounded-md bg-ink-950/75 px-2 py-1 font-mono text-[10px] tracking-wider text-white backdrop-blur">
          {product.sku}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] tracking-[0.16em] text-brand-700 uppercase">
              {product.category}
            </p>
            <h3
              id={`product-${product.id}-title`}
              className="mt-1.5 text-[17px] leading-snug font-bold text-ink-950"
            >
              {product.name}
            </h3>
          </div>
          <Stars rating={product.rating} reviews={product.reviews} />
        </div>

        <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-ink-600">{product.blurb}</p>

        {/* Specs */}
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 rounded-xl bg-ink-50 p-3">
          {product.specs.slice(0, 4).map((spec) => (
            <div key={spec.label} className="min-w-0">
              <dt className="truncate text-[10px] tracking-wide text-ink-500 uppercase">
                {spec.label}
              </dt>
              <dd className="truncate font-mono text-xs font-medium text-ink-900">{spec.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-ink-500">
          <StockPill stock={product.stock} />
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon className="h-3.5 w-3.5" /> {product.leadTimeDays}-day lead
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldIcon className="h-3.5 w-3.5" /> {product.certifications.join(" · ")}
          </span>
        </div>

        {/* Pricing */}
        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between gap-4 border-t border-dashed border-ink-200 pt-4">
            <div>
              <p className="font-mono text-[10px] tracking-[0.14em] text-ink-500 uppercase">
                Unit price @ {qty}
              </p>
              <p className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-2xl font-extrabold tracking-tight text-ink-950">
                  {currency(unit)}
                </span>
                {tier.discount > 0 && (
                  <span className="text-xs font-medium text-ink-400 line-through">
                    {currency(product.listPrice)}
                  </span>
                )}
              </p>
              <p className="mt-1 text-[11px] text-ink-500">
                MOQ {product.moq} · Ext. {currency(unit * qty)}
                {savings > 0 && (
                  <span className="font-semibold text-emerald-600"> · saves {currency(savings)}</span>
                )}
              </p>
            </div>
            <div className="text-right">
              {tier.discount > 0 ? (
                <Badge tone="success">−{Math.round(tier.discount * 100)}% tier</Badge>
              ) : (
                <Badge tone="outline">List tier</Badge>
              )}
            </div>
          </div>

          {nextTier && (
            <button
              type="button"
              onClick={() => setQty(nextTier.min)}
              className="mt-3 flex w-full items-center justify-between rounded-lg bg-brand-50 px-3 py-2 text-left text-[11px] font-semibold text-brand-800 transition hover:bg-brand-100"
            >
              <span>
                Add {nextTier.min - qty} more → unlock {Math.round(nextTier.discount * 100)}% off at{" "}
                {nextTier.min} units
              </span>
              <span aria-hidden="true">→</span>
            </button>
          )}

          <div className="mt-4 flex items-center gap-2.5">
            <QtyStepper
              value={qty}
              min={product.moq}
              onChange={setQty}
              label={product.name}
              size="md"
            />
            <Button
              onClick={handleAdd}
              className={cn("flex-1", added && "bg-emerald-600 shadow-emerald-600/25 hover:bg-emerald-600")}
              aria-label={`Add ${qty} units of ${product.name} to quote`}
            >
              {added ? (
                <>
                  <CheckIcon className="h-4 w-4" /> Added
                </>
              ) : (
                <>
                  <CartIcon className="h-4 w-4" /> Add to quote
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
