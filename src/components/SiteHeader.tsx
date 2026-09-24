import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { useQuote } from "@/context/QuoteContext";
import { Button } from "@/components/ui";
import {
  BoltIcon,
  CartIcon,
  CloseIcon,
  GlobeIcon,
  MenuIcon,
  PhoneIcon,
  UserIcon,
} from "@/components/icons";

const NAV = [
  { label: "Catalog", href: "#catalog" },
  { label: "Volume pricing", href: "#pricing" },
  { label: "Checkout demo", href: "#checkout" },
  { label: "Logistics", href: "#logistics" },
  { label: "FAQ", href: "#faq" },
];

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <a
      href="#top"
      className="group inline-flex items-center gap-2.5"
      aria-label="AXLON Industrial — home"
    >
      <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-600/25">
        <svg viewBox="0 0 24 24" className="h-5.5 w-5.5 text-white" aria-hidden="true">
          <path
            d="M12 2.6 3.4 7.3v9.4L12 21.4l8.6-4.7V7.3z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M12 7.4 8 16.2h2.1l.8-1.9h2.2l.8 1.9H16z" fill="currentColor" />
        </svg>
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      </span>
      <span className="leading-none">
        <span
          className={cn(
            "block font-display text-[17px] font-extrabold tracking-tight",
            dark ? "text-white" : "text-ink-950",
          )}
        >
          AXLON
        </span>
        <span
          className={cn(
            "block font-mono text-[10px] tracking-[0.28em] uppercase",
            dark ? "text-ink-400" : "text-ink-500",
          )}
        >
          Industrial
        </span>
      </span>
    </a>
  );
}

export default function SiteHeader() {
  const { unitCount, setDrawerOpen } = useQuote();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Utility bar */}
      <div className="hidden bg-ink-950 text-ink-300 lg:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-6 text-xs">
          <p className="flex items-center gap-2">
            <BoltIcon className="h-3.5 w-3.5 text-signal-400" />
            <span>
              <span className="font-semibold text-white">Free freight</span> on wholesale orders over
              $25,000 · Net-30 terms for approved accounts
            </span>
          </p>
          <div className="flex items-center gap-6">
            <a className="inline-flex items-center gap-1.5 transition hover:text-white" href="#faq">
              <PhoneIcon className="h-3.5 w-3.5" /> +1 (888) 555-0182
            </a>
            <a
              className="inline-flex items-center gap-1.5 transition hover:text-white"
              href="#logistics"
            >
              <GlobeIcon className="h-3.5 w-3.5" /> Ships to 41 countries
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div
        className={cn(
          "border-b transition-all duration-300",
          scrolled
            ? "border-ink-200/70 bg-white/85 shadow-[0_8px_30px_-16px_rgb(11_26_43/0.35)] backdrop-blur-xl"
            : "border-transparent bg-white",
        )}
      >
        <nav
          className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:h-[72px]"
          aria-label="Primary"
        >
          <Logo />

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-lg px-3.5 py-2 text-sm font-medium text-ink-700 transition hover:bg-ink-100 hover:text-ink-950"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#checkout"
              className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink-700 transition hover:bg-ink-100 hover:text-ink-950 md:inline-flex"
            >
              <UserIcon className="h-4 w-4" /> Distributor login
            </a>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="relative inline-flex h-10 items-center gap-2 rounded-xl bg-ink-100 px-3.5 text-sm font-semibold text-ink-900 transition hover:bg-ink-200"
              aria-label={`Open quote cart, ${unitCount} units`}
            >
              <CartIcon className="h-4.5 w-4.5" />
              <span className="hidden sm:inline">Quote</span>
              <span
                className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1 font-mono text-[11px] font-semibold text-white"
                aria-hidden="true"
              >
                {unitCount}
              </span>
            </button>

            <Button
              size="md"
              className="hidden sm:inline-flex"
              onClick={() => document.getElementById("catalog")?.scrollIntoView()}
            >
              Request bulk quote
            </Button>

            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-xl text-ink-800 transition hover:bg-ink-100 lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          hidden={!menuOpen}
          className="border-t border-ink-100 bg-white px-4 py-4 lg:hidden"
        >
          <ul className="space-y-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-medium text-ink-800 transition hover:bg-ink-100"
                >
                  {item.label}
                  <CloseIcon className="h-4 w-4 rotate-45 text-ink-400" />
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => setMenuOpen(false)}>
              Distributor login
            </Button>
            <Button
              onClick={() => {
                setMenuOpen(false);
                document.getElementById("catalog")?.scrollIntoView();
              }}
            >
              Bulk quote
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
