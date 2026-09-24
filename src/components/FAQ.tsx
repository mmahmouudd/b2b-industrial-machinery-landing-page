import { useState } from "react";
import { cn } from "@/utils/cn";
import { SectionHeading, Button } from "@/components/ui";
import { ChevronDownIcon, PhoneIcon } from "@/components/icons";

const FAQS = [
  {
    q: "What are the minimum order quantities?",
    a: "MOQs are set per SKU and shown on every listing — most heavy machines start at 1 unit, while cobots, conveyor modules and grinders start at 2–4. Volume tiers begin at the next band above MOQ, and mixed-SKU orders count toward your annual contract volume.",
  },
  {
    q: "How do payment terms and credit approval work?",
    a: "New accounts submit a Tax ID and two trade references. We run a soft D&B check and issue a credit decision within 24 hours — typically Net-30 up to $500k, extendable to Net-60 or a $5M line after two settled orders. ACH prepay earns a 2% discount.",
  },
  {
    q: "Is freight, rigging and installation included?",
    a: "Standard LTL freight is included on orders above $25,000 within the contiguous US. Expedited trucks, white-glove rigging crews and international consolidations are quoted live at checkout. Commissioning and two days of operator training can be added as a line item.",
  },
  {
    q: "Can we punch out from SAP Ariba, Coupa or Jaggaer?",
    a: "Yes. We support cXML and OCI punch-out with line-level invoicing, contract-specific catalogs and buyer-level approval thresholds. Typical integration time is 5–10 business days with our solutions engineer.",
  },
  {
    q: "What warranty and service coverage applies?",
    a: "Every machine ships with a 24-month parts-and-labour warranty, 4-hour remote response and 48-hour field dispatch in covered regions. Consignment spares can be stocked at your plant, invoiced only on consumption.",
  },
  {
    q: "Do you support international shipments and duties?",
    a: "We ship DAP or DDP to 41 countries from six regional hubs. HS classification, certificates of origin, CE/UKCA documentation and customs brokerage are handled by our trade compliance team.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-24 bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionHeading
              id="faq-title"
              eyebrow="Procurement FAQ"
              title="Answers your finance team will ask"
              description="Still need specifics? An account engineer replies to spec questions in under an hour during business days."
            />
            <div className="mt-8 rounded-2xl bg-ink-950 p-6 text-white">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10">
                  <PhoneIcon className="h-5 w-5 text-brand-300" />
                </span>
                <div>
                  <p className="font-display text-base font-bold">Talk to a machine specialist</p>
                  <p className="font-mono text-xs text-ink-400">Mon–Fri · 07:00–19:00 ET</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-300">
                Share a drawing, cycle-time target or existing quote — we'll benchmark it against our
                OEM network and send a like-for-like comparison.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button variant="signal" onClick={() => document.getElementById("checkout")?.scrollIntoView()}>
                  Book a 20-min consult
                </Button>
                <Button variant="outline-light">+1 (888) 555-0182</Button>
              </div>
            </div>
          </div>

          <div className="divide-y divide-ink-200 rounded-2xl bg-ink-50 px-5 ring-1 ring-ink-200 sm:px-6">
            {FAQS.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={item.q} className="py-1">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-trigger-${i}`}
                      className="flex w-full items-center justify-between gap-6 py-5 text-left"
                    >
                      <span
                        className={cn(
                          "font-display text-[15px] font-bold transition sm:text-base",
                          isOpen ? "text-brand-800" : "text-ink-950",
                        )}
                      >
                        {item.q}
                      </span>
                      <span
                        className={cn(
                          "grid h-8 w-8 shrink-0 place-items-center rounded-full transition",
                          isOpen ? "rotate-180 bg-brand-600 text-white" : "bg-white text-ink-500 ring-1 ring-ink-200",
                        )}
                      >
                        <ChevronDownIcon className="h-4 w-4" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${i}`}
                    hidden={!isOpen}
                    className="pb-5 pr-10 text-sm leading-relaxed text-ink-600"
                  >
                    {item.a}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
