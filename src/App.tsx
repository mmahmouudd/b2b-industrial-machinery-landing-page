import { QuoteProvider, useQuote } from "@/context/QuoteContext";
import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import Catalog from "@/components/Catalog";
import BulkPricing from "@/components/BulkPricing";
import CheckoutFlow from "@/components/CheckoutFlow";
import Logistics from "@/components/Logistics";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import SiteFooter from "@/components/SiteFooter";
import QuoteDrawer from "@/components/QuoteDrawer";
import { currency } from "@/data/catalog";
import { CartIcon } from "@/components/icons";

function StickyQuoteBar() {
  const { unitCount, subtotal, setDrawerOpen, lastAdded } = useQuote();

  if (unitCount === 0) return null;

  return (
    <>
      <p className="sr-only" role="status" aria-live="polite">
        {lastAdded ? `${lastAdded} added to your quote. ` : ""}
        Quote now contains {unitCount} units totalling {currency(subtotal)}.
      </p>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-200 bg-white/95 px-4 py-3 backdrop-blur-lg shadow-[0_-8px_30px_-18px_rgb(11_26_43/0.5)] sm:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] tracking-[0.14em] text-ink-500 uppercase">
              Quote subtotal
            </p>
            <p className="font-display text-lg font-extrabold text-ink-950">{currency(subtotal)}</p>
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700"
          >
            <CartIcon className="h-4.5 w-4.5" />
            View quote ({unitCount})
          </button>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <QuoteProvider>
      <a
        href="#catalog"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-lg focus:bg-ink-950 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to catalog
      </a>

      <div className="min-h-screen bg-ink-50 pb-16 sm:pb-0">
        <SiteHeader />
        <main id="main">
          <Hero />
          <Catalog />
          <BulkPricing />
          <CheckoutFlow />
          <Logistics />
          <Testimonials />
          <FAQ />
        </main>
        <SiteFooter />
        <QuoteDrawer />
        <StickyQuoteBar />
      </div>
    </QuoteProvider>
  );
}
