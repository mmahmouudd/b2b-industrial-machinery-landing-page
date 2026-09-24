import { useState, type ReactNode } from "react";
import { cn } from "@/utils/cn";
import {
  CATEGORIES,
  CERTIFICATIONS,
  LEAD_TIME_OPTIONS,
  PRODUCTS,
  VOLTAGES,
  compactCurrency,
  type Category,
  type Certification,
} from "@/data/catalog";
import { Switch } from "@/components/ui";
import { ChevronDownIcon } from "@/components/icons";

export type Filters = {
  query: string;
  categories: Category[];
  certifications: Certification[];
  voltages: string[];
  maxPrice: number;
  leadTime: string;
  inStockOnly: boolean;
  financingOnly: boolean;
};

export const PRICE_MAX = 220000;

export const DEFAULT_FILTERS: Filters = {
  query: "",
  categories: [],
  certifications: [],
  voltages: [],
  maxPrice: PRICE_MAX,
  leadTime: "any",
  inStockOnly: false,
  financingOnly: false,
};

function FilterGroup({
  title,
  children,
  defaultOpen = true,
  count,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  count?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = `filter-${title.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className="border-t border-ink-100 py-4 first:border-t-0 first:pt-0">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={id}
          className="flex w-full items-center justify-between gap-2 text-left"
        >
          <span className="font-display text-[13px] font-bold tracking-wide text-ink-900 uppercase">
            {title}
            {count ? (
              <span className="ml-2 rounded-full bg-brand-50 px-1.5 py-0.5 font-mono text-[10px] text-brand-700">
                {count}
              </span>
            ) : null}
          </span>
          <ChevronDownIcon
            className={cn("h-4 w-4 shrink-0 text-ink-400 transition-transform", open && "rotate-180")}
          />
        </button>
      </h3>
      <div id={id} hidden={!open} className="mt-3.5 space-y-2.5">
        {children}
      </div>
    </div>
  );
}

function CheckRow({
  label,
  checked,
  onChange,
  meta,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  meta?: string;
}) {
  return (
    <label
      className={cn(
        "group flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 -mx-2 transition",
        "hover:bg-ink-50",
      )}
    >
      <span className="relative grid h-[18px] w-[18px] shrink-0 place-items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer h-[18px] w-[18px] cursor-pointer appearance-none rounded-[5px] border border-ink-300 bg-white transition checked:border-brand-600 checked:bg-brand-600"
        />
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="pointer-events-none absolute h-3 w-3 scale-75 text-white opacity-0 transition peer-checked:scale-100 peer-checked:opacity-100"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m5 12.5 4.5 4.5L19 7" />
        </svg>
      </span>
      <span className="flex-1 text-sm text-ink-700 group-hover:text-ink-950">{label}</span>
      {meta && <span className="font-mono text-[11px] text-ink-400">{meta}</span>}
    </label>
  );
}

export default function FilterPanel({
  filters,
  setFilters,
  onReset,
  resultCount,
}: {
  filters: Filters;
  setFilters: (updater: (prev: Filters) => Filters) => void;
  onReset: () => void;
  resultCount: number;
}) {
  const toggle = <T extends string>(list: T[], value: T) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between pb-4">
        <p className="font-display text-sm font-bold text-ink-950">
          Filters
          <span className="ml-2 font-mono text-xs font-medium text-ink-500">
            {resultCount} result{resultCount === 1 ? "" : "s"}
          </span>
        </p>
        <button
          type="button"
          onClick={onReset}
          className="rounded-md text-xs font-semibold text-brand-700 underline-offset-4 transition hover:underline"
        >
          Clear all
        </button>
      </div>

      <FilterGroup title="Equipment category" count={filters.categories.length || undefined}>
        {CATEGORIES.map((cat) => (
          <CheckRow
            key={cat}
            label={cat}
            meta={String(PRODUCTS.filter((p) => p.category === cat).length)}
            checked={filters.categories.includes(cat)}
            onChange={() =>
              setFilters((prev) => ({ ...prev, categories: toggle(prev.categories, cat) }))
            }
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Unit budget">
        <label htmlFor="price-range" className="flex items-baseline justify-between text-sm">
          <span className="text-ink-600">Max unit price</span>
          <span className="font-mono text-sm font-semibold text-ink-950">
            {filters.maxPrice >= PRICE_MAX ? "Any" : compactCurrency(filters.maxPrice)}
          </span>
        </label>
        <input
          id="price-range"
          type="range"
          min={8000}
          max={PRICE_MAX}
          step={4000}
          value={filters.maxPrice}
          onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
          aria-valuetext={
            filters.maxPrice >= PRICE_MAX
              ? "Any price"
              : `Up to ${compactCurrency(filters.maxPrice)} per unit`
          }
          className="mt-1"
        />
        <div className="flex justify-between font-mono text-[10px] text-ink-400">
          <span>$8k</span>
          <span>$220k+</span>
        </div>
      </FilterGroup>

      <FilterGroup title="Lead time">
        <div role="radiogroup" aria-label="Lead time" className="space-y-1.5">
          {LEAD_TIME_OPTIONS.map((opt) => {
            const active = filters.leadTime === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setFilters((prev) => ({ ...prev, leadTime: opt.id }))}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition",
                  active
                    ? "border-brand-600 bg-brand-50 font-semibold text-brand-800"
                    : "border-ink-200 text-ink-700 hover:border-ink-300 hover:bg-ink-50",
                )}
              >
                <span
                  className={cn(
                    "grid h-4 w-4 shrink-0 place-items-center rounded-full border",
                    active ? "border-brand-600" : "border-ink-300",
                  )}
                >
                  {active && <span className="h-2 w-2 rounded-full bg-brand-600" />}
                </span>
                {opt.label}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Certifications" count={filters.certifications.length || undefined}>
        <div className="flex flex-wrap gap-2">
          {CERTIFICATIONS.map((cert) => {
            const active = filters.certifications.includes(cert);
            return (
              <button
                key={cert}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    certifications: toggle(prev.certifications, cert),
                  }))
                }
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                  active
                    ? "border-ink-950 bg-ink-950 text-white"
                    : "border-ink-200 bg-white text-ink-600 hover:border-ink-400 hover:text-ink-900",
                )}
              >
                {cert}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Power supply" defaultOpen={false}>
        {VOLTAGES.map((v) => (
          <CheckRow
            key={v}
            label={`${v} three-phase`}
            checked={filters.voltages.includes(v)}
            onChange={() => setFilters((prev) => ({ ...prev, voltages: toggle(prev.voltages, v) }))}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Availability">
        <Switch
          label="In-stock only"
          hint="Ready for dispatch from regional hubs"
          checked={filters.inStockOnly}
          onChange={(next) => setFilters((prev) => ({ ...prev, inStockOnly: next }))}
        />
        <Switch
          label="Leasing available"
          hint="0% for 12 months on approved credit"
          checked={filters.financingOnly}
          onChange={(next) => setFilters((prev) => ({ ...prev, financingOnly: next }))}
        />
      </FilterGroup>

      <div className="mt-4 rounded-2xl bg-ink-950 p-4 text-white">
        <p className="font-display text-sm font-bold">Can't find the spec?</p>
        <p className="mt-1 text-xs leading-relaxed text-ink-300">
          Send a line-item RFQ — an account engineer replies with a sourced quote in under 4
          business hours.
        </p>
        <a
          href="#checkout"
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
        >
          Submit custom RFQ
        </a>
      </div>
    </div>
  );
}
