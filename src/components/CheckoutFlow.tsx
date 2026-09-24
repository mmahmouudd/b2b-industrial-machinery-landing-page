import { useMemo, useState, type ReactNode } from "react";
import { cn } from "@/utils/cn";
import { currency } from "@/data/catalog";
import { useQuote } from "@/context/QuoteContext";
import { Badge, Button, SectionHeading, Switch } from "@/components/ui";
import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  InvoiceIcon,
  ShieldIcon,
  TruckIcon,
  UserIcon,
} from "@/components/icons";

const STEPS = [
  { id: 0, label: "Review order", icon: InvoiceIcon },
  { id: 1, label: "Company & tax", icon: UserIcon },
  { id: 2, label: "Freight & delivery", icon: TruckIcon },
  { id: 3, label: "Terms & approval", icon: ShieldIcon },
];

const FREE_FREIGHT_THRESHOLD = 25000;

const FREIGHT = [
  {
    id: "ltl",
    title: "Standard LTL freight",
    eta: "10–14 business days",
    note: "Curbside delivery, liftgate included",
    base: 1850,
    freeOver: FREE_FREIGHT_THRESHOLD,
  },
  {
    id: "expedited",
    title: "Expedited dedicated truck",
    eta: "4–6 business days",
    note: "Team drivers, GPS tracked, appointment set",
    base: 4200,
    freeOver: Infinity,
  },
  {
    id: "whiteglove",
    title: "White-glove rigging crew",
    eta: "7–10 business days",
    note: "Unload, set, level and anchor to your floor plan",
    base: 9800,
    freeOver: Infinity,
  },
] as const;

const TERMS = [
  {
    id: "net30",
    title: "Net 30",
    detail: "Invoice on dispatch · standard for approved accounts",
    adjust: 0,
    tag: "Most used",
  },
  {
    id: "net60",
    title: "Net 60",
    detail: "Extended terms · 1.2% financing fee applied",
    adjust: 0.012,
    tag: null,
  },
  {
    id: "ach",
    title: "ACH prepay",
    detail: "Wire before dispatch · 2% early-settlement discount",
    adjust: -0.02,
    tag: "Save 2%",
  },
  {
    id: "lease",
    title: "36-month lease",
    detail: "Capital-preserving · $0 down, buyout at $1",
    adjust: 0,
    tag: null,
  },
] as const;

type FormState = {
  poNumber: string;
  legalName: string;
  taxId: string;
  buyerName: string;
  email: string;
  phone: string;
  industry: string;
  address: string;
  city: string;
  region: string;
  postal: string;
  dock: string;
  targetDate: string;
};

const INITIAL: FormState = {
  poNumber: "PO-48-2291",
  legalName: "",
  taxId: "",
  buyerName: "",
  email: "",
  phone: "",
  industry: "Automotive & mobility",
  address: "",
  city: "",
  region: "",
  postal: "",
  dock: "dock-level",
  targetDate: "",
};

/* ----------------------------------------------------------------- Fields */

function Field({
  label,
  id,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="block text-[13px] font-semibold text-ink-800">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-xs font-medium text-red-600">
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-ink-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

const inputClass = (invalid?: boolean) =>
  cn(
    "h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-ink-950 transition placeholder:text-ink-400",
    "focus:ring-4 focus:outline-none",
    invalid
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/12"
      : "border-ink-200 hover:border-ink-300 focus:border-brand-500 focus:ring-brand-500/12",
  );

function RadioCard({
  checked,
  onChange,
  title,
  detail,
  right,
  tag,
  name,
}: {
  checked: boolean;
  onChange: () => void;
  title: string;
  detail: string;
  right?: ReactNode;
  tag?: string | null;
  name: string;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition",
        checked
          ? "border-brand-600 bg-brand-50/70 ring-1 ring-brand-600"
          : "border-ink-200 bg-white hover:border-ink-300 hover:bg-ink-50",
      )}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          "mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border-2 transition",
          checked ? "border-brand-600" : "border-ink-300",
        )}
      >
        {checked && <span className="h-2 w-2 rounded-full bg-brand-600" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-ink-950">{title}</span>
          {tag && <Badge tone={tag === "Save 2%" ? "success" : "brand"}>{tag}</Badge>}
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-ink-600">{detail}</span>
      </span>
      {right && <span className="shrink-0 text-right text-sm font-semibold text-ink-950">{right}</span>}
    </label>
  );
}

/* --------------------------------------------------------------- Checkout */

export default function CheckoutFlow() {
  const { detailedLines, subtotal, savings, unitCount, setQty } = useQuote();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [freight, setFreight] = useState<string>("ltl");
  const [terms, setTerms] = useState<string>("net30");
  const [installation, setInstallation] = useState(true);
  const [taxExempt, setTaxExempt] = useState(false);
  const [placed, setPlaced] = useState(false);

  const set = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const totals = useMemo(() => {
    const selectedFreight = FREIGHT.find((f) => f.id === freight)!;
    const freightCost = subtotal >= selectedFreight.freeOver ? 0 : selectedFreight.base;
    const installCost = installation ? 3500 + Math.round(unitCount * 120) : 0;
    const termAdjustRate = TERMS.find((t) => t.id === terms)!.adjust;
    const termAdjust = Math.round(subtotal * termAdjustRate);
    const taxable = subtotal + freightCost + installCost + termAdjust;
    const tax = taxExempt ? 0 : Math.round(taxable * 0.065);
    return {
      freightCost,
      installCost,
      termAdjust,
      tax,
      total: taxable + tax,
      freeFreight: subtotal >= selectedFreight.freeOver,
    };
  }, [freight, installation, subtotal, terms, taxExempt, unitCount]);

  const validate = (current: number) => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (current === 1) {
      if (!form.legalName.trim()) next.legalName = "Enter the registered legal entity name";
      if (!form.taxId.trim()) next.taxId = "Tax ID / VAT number is required for invoicing";
      if (!form.buyerName.trim()) next.buyerName = "Who should we address the PO to?";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid work email";
      if (form.phone.replace(/\D/g, "").length < 7) next.phone = "Enter a reachable phone number";
    }
    if (current === 2) {
      if (!form.address.trim()) next.address = "Delivery street address is required";
      if (!form.city.trim()) next.city = "City is required";
      if (!form.region.trim()) next.region = "State / province is required";
      if (!/^[A-Za-z0-9 -]{4,10}$/.test(form.postal)) next.postal = "Enter a valid postal code";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    if (!validate(step)) {
      requestAnimationFrame(() => {
        document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      });
      return;
    }
    if (step === 3) {
      setPlaced(true);
      requestAnimationFrame(() => document.getElementById("checkout")?.scrollIntoView());
      return;
    }
    setStep((s) => Math.min(3, s + 1));
    document.getElementById("checkout")?.scrollIntoView();
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <section
      id="checkout"
      aria-labelledby="checkout-title"
      className="relative scroll-mt-24 bg-white py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="checkout-title"
          eyebrow="B2B checkout"
          title="From quote to approved PO in four screens"
          description="A purchasing workflow built for procurement: PO references, tax exemption, freight selection and payment terms — no credit card wall, no sales call required."
          action={
            <div className="hidden shrink-0 items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100 md:flex">
              <ClockIcon className="h-4 w-4" /> Median completion time: 3 min 40 s
            </div>
          }
        />

        <div className="mt-10 overflow-hidden rounded-3xl bg-ink-50 ring-1 ring-ink-200">
          {placed ? (
            <ConfirmationScreen
              form={form}
              total={totals.total}
              onReset={() => {
                setPlaced(false);
                setStep(0);
              }}
            />
          ) : (
            <div className="grid lg:grid-cols-[1fr_23rem]">
              {/* Main column */}
              <div className="p-5 sm:p-8">
                {/* Stepper */}
                <ol className="flex flex-wrap items-center gap-x-2 gap-y-3" aria-label="Checkout progress">
                  {STEPS.map((s, i) => {
                    const state = i < step ? "done" : i === step ? "current" : "upcoming";
                    return (
                      <li key={s.id} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => i <= step && setStep(i)}
                          disabled={i > step}
                          aria-current={state === "current" ? "step" : undefined}
                          className={cn(
                            "flex items-center gap-2 rounded-full py-1.5 pr-3.5 pl-1.5 text-[13px] font-semibold transition",
                            state === "done" && "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
                            state === "current" && "bg-ink-950 text-white",
                            state === "upcoming" && "text-ink-400",
                          )}
                        >
                          <span
                            className={cn(
                              "grid h-6 w-6 place-items-center rounded-full text-[11px]",
                              state === "done" && "bg-emerald-600 text-white",
                              state === "current" && "bg-white/15 text-white",
                              state === "upcoming" && "bg-ink-200 text-ink-500",
                            )}
                          >
                            {state === "done" ? <CheckIcon className="h-3.5 w-3.5" /> : i + 1}
                          </span>
                          <span className="hidden sm:inline">{s.label}</span>
                        </button>
                        {i < STEPS.length - 1 && (
                          <span aria-hidden="true" className="h-px w-4 bg-ink-200 sm:w-6" />
                        )}
                      </li>
                    );
                  })}
                </ol>

                <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-ink-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="mt-8">
                  {/* STEP 0 — review */}
                  {step === 0 && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="font-display text-xl font-bold text-ink-950">
                          Review your line items
                        </h3>
                        <p className="mt-1 text-sm text-ink-600">
                          Quantities snap to volume tiers automatically. Edits here update pricing in
                          real time.
                        </p>
                      </div>

                      {detailedLines.length === 0 ? (
                        <p className="rounded-xl border border-dashed border-ink-300 bg-white px-5 py-10 text-center text-sm text-ink-600">
                          No lines yet — add machines from the catalog to continue.
                        </p>
                      ) : (
                        <ul className="space-y-3">
                          {detailedLines.map((line) => (
                            <li
                              key={line.product.id}
                              className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-ink-200"
                            >
                              <img
                                src={line.product.image}
                                alt=""
                                loading="lazy"
                                className="h-16 w-20 shrink-0 rounded-lg object-cover"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-ink-950">
                                  {line.product.name}
                                </p>
                                <p className="font-mono text-[11px] text-ink-500">
                                  {line.product.sku} · {line.product.leadTimeDays}-day lead ·{" "}
                                  {currency(line.unitPrice)}/unit
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <label className="sr-only" htmlFor={`co-qty-${line.product.id}`}>
                                  Quantity for {line.product.name}
                                </label>
                                <input
                                  id={`co-qty-${line.product.id}`}
                                  type="number"
                                  min={line.product.moq}
                                  value={line.qty}
                                  onChange={(e) => setQty(line.product.id, Number(e.target.value))}
                                  className="h-10 w-20 rounded-lg border border-ink-200 px-3 text-center font-mono text-sm focus:border-brand-500 focus:ring-4 focus:ring-brand-500/12 focus:outline-none"
                                />
                                <span className="w-24 text-right font-mono text-sm font-bold text-ink-950">
                                  {currency(line.lineTotal)}
                                </span>
                              </div>
                              {line.discount > 0 && (
                                <Badge tone="success">
                                  −{Math.round(line.discount * 100)}% volume tier applied
                                </Badge>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                          label="Purchase order reference"
                          id="poNumber"
                          hint="Printed on the invoice and packing list"
                        >
                          <input
                            id="poNumber"
                            className={inputClass()}
                            value={form.poNumber}
                            onChange={(e) => set("poNumber", e.target.value)}
                            placeholder="PO-00000"
                          />
                        </Field>
                        <Field
                          label="Cost centre / project code"
                          id="costCentre"
                          hint="Optional — helps your AP team reconcile"
                        >
                          <input
                            id="costCentre"
                            className={inputClass()}
                            placeholder="CC-2026-OPS"
                          />
                        </Field>
                      </div>
                    </div>
                  )}

                  {/* STEP 1 — company */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="font-display text-xl font-bold text-ink-950">
                          Company &amp; tax details
                        </h3>
                        <p className="mt-1 text-sm text-ink-600">
                          Used for credit review and invoicing. We never run a hard credit pull.
                        </p>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Registered legal name" id="legalName" error={errors.legalName}>
                          <input
                            id="legalName"
                            className={inputClass(!!errors.legalName)}
                            value={form.legalName}
                            onChange={(e) => set("legalName", e.target.value)}
                            aria-invalid={!!errors.legalName}
                            aria-describedby={errors.legalName ? "legalName-error" : undefined}
                            placeholder="Northridge Steel Fabrication LLC"
                            autoComplete="organization"
                          />
                        </Field>
                        <Field label="Tax ID / VAT number" id="taxId" error={errors.taxId}>
                          <input
                            id="taxId"
                            className={inputClass(!!errors.taxId)}
                            value={form.taxId}
                            onChange={(e) => set("taxId", e.target.value)}
                            aria-invalid={!!errors.taxId}
                            aria-describedby={errors.taxId ? "taxId-error" : undefined}
                            placeholder="84-2910477"
                          />
                        </Field>
                        <Field label="Buyer / approver name" id="buyerName" error={errors.buyerName}>
                          <input
                            id="buyerName"
                            className={inputClass(!!errors.buyerName)}
                            value={form.buyerName}
                            onChange={(e) => set("buyerName", e.target.value)}
                            aria-invalid={!!errors.buyerName}
                            aria-describedby={errors.buyerName ? "buyerName-error" : undefined}
                            placeholder="Dana Whitfield"
                            autoComplete="name"
                          />
                        </Field>
                        <Field label="Work email" id="email" error={errors.email}>
                          <input
                            id="email"
                            type="email"
                            className={inputClass(!!errors.email)}
                            value={form.email}
                            onChange={(e) => set("email", e.target.value)}
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? "email-error" : undefined}
                            placeholder="procurement@company.com"
                            autoComplete="email"
                          />
                        </Field>
                        <Field label="Direct phone" id="phone" error={errors.phone}>
                          <input
                            id="phone"
                            type="tel"
                            className={inputClass(!!errors.phone)}
                            value={form.phone}
                            onChange={(e) => set("phone", e.target.value)}
                            aria-invalid={!!errors.phone}
                            aria-describedby={errors.phone ? "phone-error" : undefined}
                            placeholder="+1 (555) 014-8823"
                            autoComplete="tel"
                          />
                        </Field>
                        <Field label="Industry" id="industry">
                          <select
                            id="industry"
                            className={inputClass()}
                            value={form.industry}
                            onChange={(e) => set("industry", e.target.value)}
                          >
                            {[
                              "Automotive & mobility",
                              "Aerospace & defence",
                              "Food & beverage",
                              "Metal fabrication",
                              "Energy & utilities",
                              "Contract manufacturing",
                            ].map((option) => (
                              <option key={option}>{option}</option>
                            ))}
                          </select>
                        </Field>
                      </div>
                      <div className="rounded-xl bg-white p-4 ring-1 ring-ink-200">
                        <Switch
                          label="Tax-exempt — resale certificate on file"
                          hint="Removes estimated sales tax from this order"
                          checked={taxExempt}
                          onChange={setTaxExempt}
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 2 — freight */}
                  {step === 2 && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="font-display text-xl font-bold text-ink-950">
                          Freight &amp; delivery
                        </h3>
                        <p className="mt-1 text-sm text-ink-600">
                          Rates are live from our contracted carriers — no post-order surprises.
                        </p>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Delivery address" id="address" error={errors.address} className="sm:col-span-2">
                          <input
                            id="address"
                            className={inputClass(!!errors.address)}
                            value={form.address}
                            onChange={(e) => set("address", e.target.value)}
                            aria-invalid={!!errors.address}
                            aria-describedby={errors.address ? "address-error" : undefined}
                            placeholder="1420 Foundry Parkway, Building C"
                            autoComplete="street-address"
                          />
                        </Field>
                        <Field label="City" id="city" error={errors.city}>
                          <input
                            id="city"
                            className={inputClass(!!errors.city)}
                            value={form.city}
                            onChange={(e) => set("city", e.target.value)}
                            aria-invalid={!!errors.city}
                            aria-describedby={errors.city ? "city-error" : undefined}
                            placeholder="Toledo"
                            autoComplete="address-level2"
                          />
                        </Field>
                        <Field label="State / province" id="region" error={errors.region}>
                          <input
                            id="region"
                            className={inputClass(!!errors.region)}
                            value={form.region}
                            onChange={(e) => set("region", e.target.value)}
                            aria-invalid={!!errors.region}
                            aria-describedby={errors.region ? "region-error" : undefined}
                            placeholder="Ohio"
                            autoComplete="address-level1"
                          />
                        </Field>
                        <Field label="Postal code" id="postal" error={errors.postal}>
                          <input
                            id="postal"
                            className={inputClass(!!errors.postal)}
                            value={form.postal}
                            onChange={(e) => set("postal", e.target.value)}
                            aria-invalid={!!errors.postal}
                            aria-describedby={errors.postal ? "postal-error" : undefined}
                            placeholder="43604"
                            autoComplete="postal-code"
                          />
                        </Field>
                        <Field label="Requested on-site date" id="targetDate" hint="We'll confirm within 1 business day">
                          <input
                            id="targetDate"
                            type="date"
                            className={inputClass()}
                            value={form.targetDate}
                            onChange={(e) => set("targetDate", e.target.value)}
                          />
                        </Field>
                      </div>

                      <fieldset>
                        <legend className="mb-2.5 text-[13px] font-semibold text-ink-800">
                          Receiving capability
                        </legend>
                        <div
                          className="grid gap-2 sm:grid-cols-3"
                          role="radiogroup"
                          aria-label="Receiving capability"
                        >
                          {[
                            { id: "dock-level", label: "Dock level" },
                            { id: "forklift", label: "Forklift on site" },
                            { id: "ground", label: "Ground level only" },
                          ].map((opt) => (
                            <button
                              key={opt.id}
                              type="button"
                              role="radio"
                              aria-checked={form.dock === opt.id}
                              onClick={() => set("dock", opt.id)}
                              className={cn(
                                "rounded-xl border px-4 py-3 text-sm font-medium transition",
                                form.dock === opt.id
                                  ? "border-brand-600 bg-brand-50 text-brand-800"
                                  : "border-ink-200 bg-white text-ink-700 hover:border-ink-300",
                              )}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </fieldset>

                      <fieldset className="space-y-2.5">
                        <legend className="mb-2.5 text-[13px] font-semibold text-ink-800">
                          Freight service
                        </legend>
                        {FREIGHT.map((option) => {
                          const free = subtotal >= option.freeOver;
                          return (
                            <RadioCard
                              key={option.id}
                              name="freight"
                              checked={freight === option.id}
                              onChange={() => setFreight(option.id)}
                              title={option.title}
                              detail={`${option.eta} · ${option.note}`}
                              tag={free ? "Included" : null}
                              right={free ? "$0" : currency(option.base)}
                            />
                          );
                        })}
                      </fieldset>

                      <div className="rounded-xl bg-white p-4 ring-1 ring-ink-200">
                        <Switch
                          label="Add commissioning & operator training"
                          hint="Certified technician on site, 2 days + acceptance testing"
                          checked={installation}
                          onChange={setInstallation}
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 3 — terms */}
                  {step === 3 && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="font-display text-xl font-bold text-ink-950">
                          Payment terms &amp; approval
                        </h3>
                        <p className="mt-1 text-sm text-ink-600">
                          Your account is pre-approved for a {currency(2400000)} credit line.
                        </p>
                      </div>

                      <fieldset className="grid gap-2.5 sm:grid-cols-2">
                        <legend className="sr-only">Payment terms</legend>
                        {TERMS.map((option) => (
                          <RadioCard
                            key={option.id}
                            name="terms"
                            checked={terms === option.id}
                            onChange={() => setTerms(option.id)}
                            title={option.title}
                            detail={option.detail}
                            tag={option.tag}
                          />
                        ))}
                      </fieldset>

                      <div className="rounded-2xl border border-dashed border-ink-300 bg-white p-5 text-center">
                        <p className="text-sm font-semibold text-ink-900">
                          Attach signed PO or approval memo
                        </p>
                        <p className="mt-1 text-xs text-ink-500">
                          PDF, DOCX or PNG up to 20 MB · optional at this stage
                        </p>
                        <Button variant="secondary" size="sm" className="mt-3" type="button">
                          Choose file
                        </Button>
                      </div>

                      <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-white p-4 ring-1 ring-ink-200">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer rounded-[5px] accent-brand-600"
                        />
                        <span className="text-[13px] leading-relaxed text-ink-700">
                          I'm authorised to purchase on behalf of this company and accept the{" "}
                          <a href="#faq" className="font-semibold text-brand-700 underline underline-offset-2">
                            master supply agreement
                          </a>{" "}
                          and freight terms.
                        </span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-ink-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    variant="ghost"
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    disabled={step === 0}
                  >
                    ← Back
                  </Button>
                  <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                    <p className="hidden text-xs text-ink-500 sm:block">
                      Step {step + 1} of {STEPS.length}
                    </p>
                    <Button size="lg" onClick={goNext}>
                      {step === 3 ? "Submit purchase order" : "Continue"}
                      <ArrowRightIcon className="h-4.5 w-4.5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Summary rail */}
              <aside
                className="border-t border-ink-200 bg-white p-5 sm:p-6 lg:border-t-0 lg:border-l"
                aria-label="Order summary"
              >
                <div className="lg:sticky lg:top-28">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-base font-bold text-ink-950">Order summary</h3>
                    <Badge tone="brand">{unitCount} units</Badge>
                  </div>

                  <dl className="mt-5 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-ink-600">Merchandise subtotal</dt>
                      <dd className="font-mono font-medium text-ink-950">{currency(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-emerald-700">Volume discounts</dt>
                      <dd className="font-mono font-medium text-emerald-700">−{currency(savings)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-ink-600">Freight</dt>
                      <dd className="font-mono font-medium text-ink-950">
                        {totals.freeFreight ? (
                          <span className="text-emerald-700">Included</span>
                        ) : (
                          currency(totals.freightCost)
                        )}
                      </dd>
                    </div>
                    {totals.installCost > 0 && (
                      <div className="flex justify-between">
                        <dt className="text-ink-600">Install & training</dt>
                        <dd className="font-mono font-medium text-ink-950">
                          {currency(totals.installCost)}
                        </dd>
                      </div>
                    )}
                    {totals.termAdjust !== 0 && (
                      <div className="flex justify-between">
                        <dt className="text-ink-600">
                          {totals.termAdjust < 0 ? "Prepay discount" : "Extended-terms fee"}
                        </dt>
                        <dd
                          className={cn(
                            "font-mono font-medium",
                            totals.termAdjust < 0 ? "text-emerald-700" : "text-ink-950",
                          )}
                        >
                          {totals.termAdjust < 0 ? "−" : ""}
                          {currency(Math.abs(totals.termAdjust))}
                        </dd>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <dt className="text-ink-600">
                        Estimated tax {taxExempt && <span className="text-xs">(exempt)</span>}
                      </dt>
                      <dd className="font-mono font-medium text-ink-950">{currency(totals.tax)}</dd>
                    </div>
                    <div className="flex items-baseline justify-between border-t border-ink-200 pt-3">
                      <dt className="font-semibold text-ink-900">Order total</dt>
                      <dd
                        className="font-display text-2xl font-extrabold text-ink-950"
                        aria-live="polite"
                      >
                        {currency(totals.total)}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-5 space-y-2.5 rounded-xl bg-ink-50 p-4">
                    {[
                      { icon: ShieldIcon, text: "24-month warranty on every unit" },
                      { icon: InvoiceIcon, text: `Terms: ${TERMS.find((t) => t.id === terms)!.title}` },
                      { icon: TruckIcon, text: FREIGHT.find((f) => f.id === freight)!.eta },
                    ].map(({ icon: Icon, text }) => (
                      <p key={text} className="flex items-center gap-2 text-xs text-ink-600">
                        <Icon className="h-4 w-4 shrink-0 text-brand-600" />
                        {text}
                      </p>
                    ))}
                  </div>

                  <p className="mt-4 text-center text-[11px] leading-relaxed text-ink-500">
                    Pricing locked for 30 days. Submitting sends the PO to your account engineer —
                    nothing is charged today.
                  </p>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- Confirmation */

function ConfirmationScreen({
  form,
  total,
  onReset,
}: {
  form: FormState;
  total: number;
  onReset: () => void;
}) {
  return (
    <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div>
        <span className="inline-grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
          <CheckIcon className="h-7 w-7" />
        </span>
        <h3 className="mt-5 font-display text-2xl font-extrabold text-ink-950 sm:text-3xl">
          Purchase order submitted
        </h3>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-600">
          {form.poNumber || "Your PO"} has been routed to your account engineer. You'll receive an
          order acknowledgement with serialised machine IDs and a freight booking window within one
          business hour.
        </p>

        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Order value", value: currency(total) },
            { label: "Order ID", value: "AX-2026-10482" },
            { label: "Ack. ETA", value: "< 60 minutes" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-white p-4 ring-1 ring-ink-200">
              <dt className="font-mono text-[10px] tracking-[0.14em] text-ink-500 uppercase">
                {item.label}
              </dt>
              <dd className="mt-1 font-display text-lg font-bold text-ink-950">{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-7 flex flex-wrap gap-3">
          <Button onClick={onReset}>Run the flow again</Button>
          <Button variant="secondary" onClick={() => document.getElementById("catalog")?.scrollIntoView()}>
            Back to catalog
          </Button>
        </div>
      </div>

      <div className="rounded-2xl bg-ink-950 p-6 text-white">
        <p className="font-mono text-[10px] tracking-[0.18em] text-ink-400 uppercase">
          What happens next
        </p>
        <ol className="mt-4 space-y-4">
          {[
            { t: "Order acknowledgement", d: "Serial numbers, build slot and invoice issued to AP." },
            { t: "Pre-shipment inspection", d: "Photo + video FAT report shared before dispatch." },
            { t: "Freight booking", d: "Carrier, appointment window and rigging crew confirmed." },
            { t: "Commissioning", d: "On-site install, training and acceptance sign-off." },
          ].map((item, i) => (
            <li key={item.t} className="flex gap-3.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 font-mono text-xs">
                {i + 1}
              </span>
              <span>
                <span className="block text-sm font-semibold">{item.t}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-ink-400">{item.d}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
