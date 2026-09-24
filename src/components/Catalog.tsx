import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import {
  CATEGORIES,
  LEAD_TIME_OPTIONS,
  PRODUCTS,
  SORT_OPTIONS,
  compactCurrency,
  type SortId,
} from "@/data/catalog";
import FilterPanel, { DEFAULT_FILTERS, PRICE_MAX, type Filters } from "@/components/FilterPanel";
import ProductCard from "@/components/ProductCard";
import { Button, SectionHeading } from "@/components/ui";
import { CloseIcon, GridIcon, ListIcon, SearchIcon, SlidersIcon } from "@/components/icons";

const QUICK_SEARCHES = ["5-axis", "cobot", "conveyor", "laser", "electric loader"];

export default function Catalog() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortId>("recommended");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!mobileFiltersOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileFiltersOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileFiltersOpen]);

  const results = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    const leadMax = LEAD_TIME_OPTIONS.find((o) => o.id === filters.leadTime)?.max ?? Infinity;

    const filtered = PRODUCTS.filter((p) => {
      if (q) {
        const haystack = [
          p.name,
          p.sku,
          p.category,
          p.blurb,
          ...p.specs.map((s) => `${s.label} ${s.value}`),
          ...p.certifications,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (filters.categories.length && !filters.categories.includes(p.category)) return false;
      if (
        filters.certifications.length &&
        !filters.certifications.every((c) => p.certifications.includes(c))
      )
        return false;
      if (filters.voltages.length && !filters.voltages.includes(p.voltage)) return false;
      if (p.listPrice > filters.maxPrice && filters.maxPrice < PRICE_MAX) return false;
      if (p.leadTimeDays > leadMax) return false;
      if (filters.inStockOnly && p.stock < 20) return false;
      if (filters.financingOnly && !p.financing) return false;
      return true;
    });

    const sorted = [...filtered];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.listPrice - b.listPrice);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.listPrice - a.listPrice);
        break;
      case "lead":
        sorted.sort((a, b) => a.leadTimeDays - b.leadTimeDays);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        sorted.sort((a, b) => b.popularity - a.popularity);
    }
    return sorted;
  }, [filters, sort]);

  const activeChips = [
    ...filters.categories.map((c) => ({ label: c, clear: () => setFilters((p) => ({ ...p, categories: p.categories.filter((x) => x !== c) })) })),
    ...filters.certifications.map((c) => ({ label: c, clear: () => setFilters((p) => ({ ...p, certifications: p.certifications.filter((x) => x !== c) })) })),
    ...filters.voltages.map((v) => ({ label: v, clear: () => setFilters((p) => ({ ...p, voltages: p.voltages.filter((x) => x !== v) })) })),
    ...(filters.maxPrice < PRICE_MAX
      ? [{ label: `≤ ${compactCurrency(filters.maxPrice)}/unit`, clear: () => setFilters((p) => ({ ...p, maxPrice: PRICE_MAX })) }]
      : []),
    ...(filters.leadTime !== "any"
      ? [{ label: LEAD_TIME_OPTIONS.find((o) => o.id === filters.leadTime)!.label, clear: () => setFilters((p) => ({ ...p, leadTime: "any" })) }]
      : []),
    ...(filters.inStockOnly ? [{ label: "In stock only", clear: () => setFilters((p) => ({ ...p, inStockOnly: false })) }] : []),
    ...(filters.financingOnly ? [{ label: "Leasing available", clear: () => setFilters((p) => ({ ...p, financingOnly: false })) }] : []),
  ];

  const reset = () => setFilters(DEFAULT_FILTERS);

  return (
    <section
      id="catalog"
      aria-labelledby="catalog-title"
      className="relative scroll-mt-24 bg-ink-50 py-20 lg:py-24"
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-64 grid-blueprint opacity-60" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="catalog-title"
          eyebrow="Wholesale catalog"
          title="Filter 9,400 SKUs down to the exact machine spec"
          description="Every listing shows live tier pricing, certified lead times and regional stock. Filter by category, budget, certification or power supply — then add straight to a quote."
          action={
            <div className="hidden shrink-0 items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-ink-200 md:flex">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse-dot" />
              </span>
              <span className="text-xs leading-tight text-ink-600">
                <span className="block font-semibold text-ink-950">Prices updated 6 min ago</span>
                Live OEM feed · USD ex-works
              </span>
            </div>
          }
        />

        {/* Search bar */}
        <div className="mt-10 rounded-2xl bg-white p-4 shadow-[0_18px_40px_-28px_rgb(11_26_43/0.45)] ring-1 ring-ink-200 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-ink-400" />
              <label htmlFor="catalog-search" className="sr-only">
                Search machinery by name, SKU or specification
              </label>
              <input
                id="catalog-search"
                ref={searchRef}
                type="search"
                value={filters.query}
                onChange={(e) => setFilters((p) => ({ ...p, query: e.target.value }))}
                placeholder="Search by machine, SKU or spec — e.g. “5-axis”, “AX-TTN-R18”, “IP67”"
                className="h-13 w-full rounded-xl border border-ink-200 bg-ink-50/60 pr-4 pl-12 text-[15px] text-ink-950 transition placeholder:text-ink-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/12 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-xl bg-ink-950 px-5 text-sm font-semibold text-white transition hover:bg-ink-900 lg:hidden"
                aria-haspopup="dialog"
              >
                <SlidersIcon className="h-4.5 w-4.5" /> Filters
                {activeChips.length > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-signal-400 px-1 font-mono text-[11px] text-ink-950">
                    {activeChips.length}
                  </span>
                )}
              </button>
              <Button size="lg" className="h-13 hidden lg:inline-flex" onClick={() => searchRef.current?.focus()}>
                Search catalog
              </Button>
            </div>
          </div>

          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] tracking-[0.16em] text-ink-500 uppercase">
              Popular:
            </span>
            {QUICK_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setFilters((p) => ({ ...p, query: term }))}
                className="rounded-full bg-ink-100 px-3 py-1 text-xs font-medium text-ink-700 transition hover:bg-brand-50 hover:text-brand-800"
              >
                {term}
              </button>
            ))}
            <span aria-hidden="true" className="mx-1 hidden h-4 w-px bg-ink-200 sm:block" />
            {CATEGORIES.slice(0, 3).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() =>
                  setFilters((p) => ({
                    ...p,
                    categories: p.categories.includes(cat)
                      ? p.categories.filter((c) => c !== cat)
                      : [...p.categories, cat],
                  }))
                }
                aria-pressed={filters.categories.includes(cat)}
                className={cn(
                  "hidden rounded-full px-3 py-1 text-xs font-medium transition sm:block",
                  filters.categories.includes(cat)
                    ? "bg-brand-600 text-white"
                    : "bg-ink-100 text-ink-700 hover:bg-ink-200",
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Layout */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Desktop filters */}
          <aside className="hidden lg:block" aria-label="Catalog filters">
            <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-slim rounded-2xl bg-white p-5 ring-1 ring-ink-200">
              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                onReset={reset}
                resultCount={results.length}
              />
            </div>
          </aside>

          {/* Results */}
          <div>
            <div className="flex flex-col gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-ink-200 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-ink-600" role="status" aria-live="polite">
                Showing <span className="font-semibold text-ink-950">{results.length}</span> of{" "}
                {PRODUCTS.length} machines
                {filters.query && (
                  <>
                    {" "}
                    for <span className="font-semibold text-ink-950">“{filters.query}”</span>
                  </>
                )}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-xs font-medium text-ink-500">
                    Sort
                  </label>
                  <div className="relative">
                    <select
                      id="sort"
                      value={sort}
                      onChange={(e) => setSort(e.target.value as SortId)}
                      className="h-9 appearance-none rounded-lg border border-ink-200 bg-white pr-8 pl-3 text-[13px] font-medium text-ink-900 transition hover:border-ink-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/12 focus:outline-none"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-ink-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
                <div
                  className="hidden items-center rounded-lg bg-ink-100 p-1 sm:flex"
                  role="group"
                  aria-label="Result layout"
                >
                  {(
                    [
                      { id: "grid", icon: GridIcon, label: "Grid view" },
                      { id: "list", icon: ListIcon, label: "List view" },
                    ] as const
                  ).map(({ id, icon: Icon, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setView(id)}
                      aria-pressed={view === id}
                      aria-label={label}
                      className={cn(
                        "grid h-7 w-8 place-items-center rounded-md transition",
                        view === id
                          ? "bg-white text-ink-950 shadow-sm"
                          : "text-ink-500 hover:text-ink-800",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {activeChips.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {activeChips.map((chip) => (
                  <span
                    key={chip.label}
                    className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 py-1 pr-1.5 pl-3 text-xs font-semibold text-brand-800 ring-1 ring-brand-100"
                  >
                    {chip.label}
                    <button
                      type="button"
                      onClick={chip.clear}
                      aria-label={`Remove filter ${chip.label}`}
                      className="grid h-5 w-5 place-items-center rounded-full text-brand-700 transition hover:bg-brand-200/70"
                    >
                      <CloseIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-md px-1 text-xs font-semibold text-ink-500 underline-offset-4 hover:text-ink-900 hover:underline"
                >
                  Reset all
                </button>
              </div>
            )}

            {results.length > 0 ? (
              <div
                className={cn(
                  "mt-5 grid gap-5",
                  view === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
                )}
              >
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} view={view} />
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-ink-300 bg-white px-6 py-16 text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-ink-100 text-ink-500">
                  <SearchIcon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-ink-950">No machines match those filters</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-ink-600">
                  Try widening the budget range or clearing certifications. Our sourcing desk can
                  also quote off-catalog equipment within 4 hours.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <Button onClick={reset}>Clear all filters</Button>
                  <Button variant="secondary" onClick={() => document.getElementById("checkout")?.scrollIntoView()}>
                    Talk to sourcing desk
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-60 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Catalog filters"
            className="absolute inset-y-0 left-0 flex w-[min(22rem,92vw)] flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
              <h2 className="font-display text-base font-bold text-ink-950">Filters</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-lg text-ink-500 transition hover:bg-ink-100"
                aria-label="Close filters"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-slim px-5 py-4">
              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                onReset={reset}
                resultCount={results.length}
              />
            </div>
            <div className="border-t border-ink-100 p-4">
              <Button className="w-full" size="lg" onClick={() => setMobileFiltersOpen(false)}>
                Show {results.length} machines
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
