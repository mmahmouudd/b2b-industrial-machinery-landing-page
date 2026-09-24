import { useId, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/utils/cn";
import { MinusIcon, PlusIcon } from "@/components/icons";

/* ------------------------------------------------------------------ Button */

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "signal" | "outline-light";
  size?: "sm" | "md" | "lg";
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-brand-600 text-white shadow-lg shadow-brand-600/25 hover:bg-brand-700 hover:shadow-brand-700/30 active:translate-y-px",
  secondary:
    "bg-white text-ink-900 ring-1 ring-ink-200 shadow-sm hover:ring-ink-300 hover:bg-ink-50 active:translate-y-px",
  ghost: "text-ink-700 hover:bg-ink-100 hover:text-ink-950",
  signal:
    "bg-signal-400 text-ink-950 shadow-lg shadow-signal-400/30 hover:bg-signal-300 active:translate-y-px",
  "outline-light":
    "text-white ring-1 ring-white/25 hover:bg-white/10 hover:ring-white/40 active:translate-y-px",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-3.5 text-[13px] gap-1.5 rounded-lg",
  md: "h-11 px-5 text-sm gap-2 rounded-xl",
  lg: "h-13 px-6 text-[15px] gap-2.5 rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex select-none items-center justify-center font-semibold transition-all duration-200",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------- Badge */

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "brand" | "signal" | "success" | "dark" | "outline";
  className?: string;
}) {
  const tones = {
    neutral: "bg-ink-100 text-ink-700",
    brand: "bg-brand-50 text-brand-700 ring-1 ring-brand-100",
    signal: "bg-signal-50 text-signal-700 ring-1 ring-signal-200",
    success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    dark: "bg-ink-950 text-white",
    outline: "text-ink-600 ring-1 ring-ink-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* --------------------------------------------------------------- Eyebrow */

export function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p
      className={cn(
        "flex items-center gap-2.5 font-mono text-[11px] font-medium tracking-[0.22em] uppercase",
        dark ? "text-brand-200" : "text-brand-700",
      )}
    >
      <span
        aria-hidden="true"
        className={cn("h-px w-7", dark ? "bg-brand-300/60" : "bg-brand-400")}
      />
      {children}
    </p>
  );
}

/* -------------------------------------------------------------- Section */

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  dark = false,
  id,
  action,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  dark?: boolean;
  id?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" ? "items-center text-center" : "items-start",
        action && "md:flex-row md:items-end md:justify-between",
      )}
    >
      <div className={cn("max-w-2xl space-y-4", align === "center" && "flex flex-col items-center")}>
        <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
        <h2
          id={id}
          className={cn(
            "text-3xl leading-[1.1] font-bold sm:text-4xl lg:text-[2.75rem]",
            dark ? "text-white" : "text-ink-950",
          )}
        >
          {title}
        </h2>
        {description && (
          <p className={cn("text-base leading-relaxed", dark ? "text-ink-300" : "text-ink-600")}>
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

/* -------------------------------------------------------- Quantity stepper */

export function QtyStepper({
  value,
  min = 1,
  max = 999,
  onChange,
  label,
  size = "md",
}: {
  value: number;
  min?: number;
  max?: number;
  onChange: (next: number) => void;
  label: string;
  size?: "sm" | "md";
}) {
  const inputId = useId();
  const btn =
    "grid place-items-center text-ink-600 transition hover:bg-ink-100 hover:text-ink-950 disabled:opacity-35 disabled:hover:bg-transparent";
  const dim = size === "sm" ? "h-9 w-9" : "h-11 w-11";
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xl bg-white ring-1 ring-ink-200",
        size === "sm" ? "h-9" : "h-11",
      )}
    >
      <button
        type="button"
        className={cn(btn, dim, "rounded-l-xl")}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`Decrease ${label} quantity`}
      >
        <MinusIcon className="h-4 w-4" />
      </button>
      <label className="sr-only" htmlFor={inputId}>
        {label} quantity
      </label>
      <input
        id={inputId}
        type="number"
        inputMode="numeric"
        className={cn(
          "w-12 border-x border-ink-100 bg-transparent text-center font-mono text-sm font-medium text-ink-950",
          "[appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none",
          size === "sm" ? "h-9" : "h-11",
        )}
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const next = Number(e.target.value.replace(/\D/g, ""));
          onChange(Math.min(max, Math.max(min, Number.isNaN(next) ? min : next)));
        }}
      />
      <button
        type="button"
        className={cn(btn, dim, "rounded-r-xl")}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`Increase ${label} quantity`}
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------- Switch */

export function Switch({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group flex w-full cursor-pointer items-start justify-between gap-3 rounded-lg py-1.5 text-left"
    >
      <span>
        <span className="block text-sm font-medium text-ink-800 group-hover:text-ink-950">
          {label}
        </span>
        {hint && <span className="block text-xs text-ink-500">{hint}</span>}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
          checked ? "bg-brand-600" : "bg-ink-200 group-hover:bg-ink-300",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200",
            checked && "translate-x-5",
          )}
        />
      </span>
    </button>
  );
}

/* ------------------------------------------------------------- Star rating */

export function Stars({ rating, reviews }: { rating: number; reviews?: number }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-flex" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <svg
            key={i}
            viewBox="0 0 24 24"
            className={cn("h-3.5 w-3.5", i < Math.round(rating) ? "text-signal-400" : "text-ink-200")}
            fill="currentColor"
          >
            <path d="m12 3.6 2.5 5.1 5.6.8-4 3.9 1 5.6-5-2.6-5 2.6 1-5.6-4-3.9 5.6-.8z" />
          </svg>
        ))}
      </span>
      <span className="text-xs font-medium text-ink-600">
        {rating.toFixed(1)}
        {reviews !== undefined && <span className="text-ink-400"> ({reviews})</span>}
      </span>
      <span className="sr-only">
        Rated {rating} out of 5{reviews !== undefined ? ` from ${reviews} verified buyers` : ""}
      </span>
    </span>
  );
}
