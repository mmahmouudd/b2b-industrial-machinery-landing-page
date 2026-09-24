import { useEffect, useRef } from "react";
import { currency } from "@/data/catalog";
import { useQuote } from "@/context/QuoteContext";
import { Badge, Button, QtyStepper } from "@/components/ui";
import { ArrowRightIcon, CloseIcon, ShieldIcon, TrashIcon, TruckIcon } from "@/components/icons";

export default function QuoteDrawer() {
  const {
    drawerOpen,
    setDrawerOpen,
    detailedLines,
    subtotal,
    savings,
    unitCount,
    setQty,
    removeLine,
    clear,
  } = useQuote();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen, setDrawerOpen]);

  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-70">
      <div
        className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-drawer-title"
        className="absolute inset-y-0 right-0 flex w-[min(30rem,100vw)] flex-col bg-ink-50 shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-ink-200 bg-white px-5 py-4">
          <div>
            <h2 id="quote-drawer-title" className="font-display text-lg font-bold text-ink-950">
              Your quote request
            </h2>
            <p className="font-mono text-[11px] text-ink-500">
              RFQ-2026-0481 · {unitCount} unit{unitCount === 1 ? "" : "s"}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="grid h-9 w-9 place-items-center rounded-lg text-ink-500 transition hover:bg-ink-100 hover:text-ink-900"
            aria-label="Close quote drawer"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-slim px-5 py-4">
          {detailedLines.length === 0 ? (
            <div className="mt-16 text-center">
              <p className="font-display text-base font-bold text-ink-900">Your quote is empty</p>
              <p className="mx-auto mt-2 max-w-xs text-sm text-ink-600">
                Add machines from the catalog to model tier pricing and freight.
              </p>
              <Button
                className="mt-5"
                onClick={() => {
                  setDrawerOpen(false);
                  document.getElementById("catalog")?.scrollIntoView();
                }}
              >
                Browse catalog
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {detailedLines.map((line) => (
                <li
                  key={line.product.id}
                  className="rounded-2xl bg-white p-3.5 ring-1 ring-ink-200"
                >
                  <div className="flex gap-3.5">
                    <img
                      src={line.product.image}
                      alt=""
                      className="h-20 w-20 shrink-0 rounded-xl object-cover"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-950">
                        {line.product.name}
                      </p>
                      <p className="font-mono text-[10px] text-ink-500">{line.product.sku}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-ink-900">
                          {currency(line.unitPrice)}
                        </span>
                        {line.discount > 0 && (
                          <Badge tone="success">−{Math.round(line.discount * 100)}%</Badge>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLine(line.product.id)}
                      className="h-8 w-8 shrink-0 rounded-lg text-ink-400 transition hover:bg-red-50 hover:text-red-600"
                      aria-label={`Remove ${line.product.name} from quote`}
                    >
                      <TrashIcon className="mx-auto h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-ink-100 pt-3">
                    <QtyStepper
                      size="sm"
                      value={line.qty}
                      min={line.product.moq}
                      onChange={(next) => setQty(line.product.id, next)}
                      label={line.product.name}
                    />
                    <span className="font-mono text-sm font-bold text-ink-950">
                      {currency(line.lineTotal)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {detailedLines.length > 0 && (
            <button
              type="button"
              onClick={clear}
              className="mt-4 rounded-md text-xs font-semibold text-ink-500 underline-offset-4 transition hover:text-red-600 hover:underline"
            >
              Clear all lines
            </button>
          )}
        </div>

        {detailedLines.length > 0 && (
          <footer className="border-t border-ink-200 bg-white px-5 py-4">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-600">Subtotal (ex-works)</dt>
                <dd className="font-mono font-semibold text-ink-950">{currency(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-emerald-700">Volume savings applied</dt>
                <dd className="font-mono font-semibold text-emerald-700">−{currency(savings)}</dd>
              </div>
            </dl>
            <div className="mt-3 flex items-center gap-4 rounded-xl bg-ink-50 px-3 py-2.5 text-[11px] text-ink-600">
              <span className="inline-flex items-center gap-1.5">
                <TruckIcon className="h-3.5 w-3.5 text-brand-600" /> Freight quoted at checkout
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldIcon className="h-3.5 w-3.5 text-brand-600" /> Locked 30 days
              </span>
            </div>
            <Button
              size="lg"
              className="mt-4 w-full"
              onClick={() => {
                setDrawerOpen(false);
                document.getElementById("checkout")?.scrollIntoView();
              }}
            >
              Continue to B2B checkout <ArrowRightIcon className="h-4.5 w-4.5" />
            </Button>
          </footer>
        )}
      </div>
    </div>
  );
}
