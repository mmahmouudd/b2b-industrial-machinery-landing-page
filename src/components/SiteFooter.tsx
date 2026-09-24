import { useState } from "react";
import { Logo } from "@/components/SiteHeader";
import { Button } from "@/components/ui";
import { ArrowRightIcon, CheckIcon, GlobeIcon, ShieldIcon } from "@/components/icons";

const COLUMNS = [
  {
    title: "Catalog",
    links: ["CNC machining", "Robotics & automation", "Material handling", "Metal fabrication", "Packaging lines"],
  },
  {
    title: "Buy on Axlon",
    links: ["Volume pricing", "Net terms & credit", "Leasing & finance", "Punch-out integrations", "Trade-in programme"],
  },
  {
    title: "Support",
    links: ["Freight & rigging", "Commissioning", "Spare parts", "Warranty claims", "Compliance library"],
  },
  {
    title: "Company",
    links: ["About Axlon", "OEM partners", "Careers", "Press", "Contact"],
  },
];

export default function SiteFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="bg-ink-950 text-ink-300">
      {/* CTA band */}
      <div className="relative overflow-hidden border-b border-white/10">
        <div aria-hidden="true" className="absolute inset-0 grid-blueprint-dark opacity-60" />
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/3 h-96 w-96 -translate-y-1/2 rounded-full bg-brand-600/25 blur-[120px]"
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-20">
          <div>
            <h2 className="font-display text-3xl leading-tight font-extrabold text-white sm:text-4xl">
              Get your 2026 capex plan priced in an afternoon
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-300">
              Upload a line-item list or an existing quote. We'll return a tier-priced, freight-inclusive
              proposal with lead times and finance options — usually within four business hours.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                variant="signal"
                onClick={() => document.getElementById("checkout")?.scrollIntoView()}
              >
                Start a quote <ArrowRightIcon className="h-4.5 w-4.5" />
              </Button>
              <Button
                size="lg"
                variant="outline-light"
                onClick={() => document.getElementById("catalog")?.scrollIntoView()}
              >
                Browse the catalog
              </Button>
            </div>
            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs text-ink-400">
              {["No obligation", "Quotes valid 30 days", "Dedicated account engineer", "NDA on request"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>

          <form
            className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/12 backdrop-blur"
            onSubmit={(e) => {
              e.preventDefault();
              if (email.includes("@")) setSubscribed(true);
            }}
          >
            <p className="font-display text-base font-bold text-white">Quarterly price-break bulletin</p>
            <p className="mt-1.5 text-sm text-ink-300">
              Tier changes, hub stock levels and lead-time forecasts. 4 emails a year, no sales spam.
            </p>
            <div className="mt-4 space-y-2">
              <label htmlFor="newsletter-email" className="sr-only">
                Work email
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="h-12 w-full rounded-xl border border-white/15 bg-ink-950/60 px-4 text-sm text-white transition placeholder:text-ink-500 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20 focus:outline-none"
              />
              <Button type="submit" className="h-12 w-full">
                {subscribed ? "Subscribed ✓" : "Get the bulletin"}
              </Button>
            </div>
            <p className="mt-3 text-[11px] text-ink-500" aria-live="polite">
              {subscribed
                ? "Thanks — confirmation sent. Check your inbox."
                : "By subscribing you agree to our privacy policy."}
            </p>
          </form>
        </div>
      </div>

      {/* Link columns */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2.8fr]">
          <div>
            <Logo dark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">
              Wholesale industrial machinery marketplace. 180 audited OEMs, six regional hubs, one
              contract.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["ISO 9001", "UL listed", "CE marked", "SOC 2"].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-[11px] font-medium text-ink-300 ring-1 ring-white/10"
                >
                  <ShieldIcon className="h-3 w-3 text-brand-300" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="font-display text-xs font-bold tracking-[0.14em] text-white uppercase">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#catalog"
                        className="text-sm text-ink-400 transition hover:text-white"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 Axlon Industrial Supply Co. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-5">
            <a href="#faq" className="transition hover:text-white">
              Terms of sale
            </a>
            <a href="#faq" className="transition hover:text-white">
              Privacy
            </a>
            <a href="#faq" className="transition hover:text-white">
              Accessibility
            </a>
            <span className="inline-flex items-center gap-1.5">
              <GlobeIcon className="h-3.5 w-3.5" /> United States · USD
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
