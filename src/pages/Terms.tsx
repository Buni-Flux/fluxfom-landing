import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollNudge } from "@/components/marketing/ScrollNudge";
import { PAGE_EDITORIAL_WIDE, PAGE_EDITORIAL_WIDE_ALT } from "@/lib/marketingImagery";

type Section = { section_title: string; content: string };

const fallbackSections: Section[] = [
  {
    section_title: "1. Introduction",
    content:
      "These Terms of Service govern your access to and use of FluxFom's services. By engaging FluxFom for any project, you agree to be bound by these Terms.",
  },
  {
    section_title: "2. Services Overview",
    content:
      "FluxFom provides marketing strategy, brand identity, creative production, motion and digital assets, campaign management, market penetration support, growth intelligence, and related services as described in your project agreement.",
  },
  {
    section_title: "3. Client Responsibilities",
    content:
      "Clients are responsible for providing accurate and complete information necessary for the completion of the project.",
  },
  {
    section_title: "4. Payment Terms",
    content:
      "Payment schedules are defined per project. A non-refundable deposit is required to begin work unless otherwise agreed in writing.",
  },
  {
    section_title: "5. Intellectual Property",
    content:
      "Upon receipt of full payment, the Client receives ownership of all final deliverables as specified in the project agreement.",
  },
  {
    section_title: "6. Revisions and Deliverables",
    content: "Each project includes a defined number of revision rounds as specified in the project agreement.",
  },
  {
    section_title: "7. Limitation of Liability",
    content: "FluxFom's total liability shall not exceed the total fees paid by the Client for the specific project.",
  },
  {
    section_title: "8. Termination",
    content: "Either party may terminate an engagement with 14 days' written notice unless otherwise specified.",
  },
  {
    section_title: "9. Governing Law",
    content: "These Terms shall be governed by and construed in accordance with applicable laws.",
  },
  {
    section_title: "10. Contact Information",
    content: "For questions about these Terms, please reach out through our Start Profile page.",
  },
];

const Terms = () => {
  const [sections, setSections] = useState<Section[]>(fallbackSections);

  useEffect(() => {
    document.title = "Terms — FluxFom";
    supabase
      .from("cms_terms")
      .select("*")
      .order("display_order")
      .then(({ data }) => {
        if (data && data.length > 0) setSections(data);
      });
  }, []);

  return (
    <div className="min-h-full bg-flux-void text-white">
      <section className="landing-page-shell border-b border-white/10 pb-16 pt-12 md:pb-20 md:pt-16">
        <div className="container mx-auto max-w-6xl px-5 text-center sm:px-6">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="landing-page-kicker">
            Legal
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="heading-editorial mt-4 text-4xl font-semibold text-white sm:text-5xl md:text-6xl"
          >
            Terms of Service
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mt-4 text-sm font-medium text-white/70">
            Last updated: March 2026
          </motion.p>
          <ScrollNudge targetId="terms-body" tone="dark" />
        </div>
      </section>

      <figure className="border-y border-white/10 bg-[#07140b]">
        <div className="relative mx-auto aspect-[21/9] max-h-[200px] w-full max-w-6xl overflow-hidden sm:max-h-[240px] md:max-h-[280px]">
          <img
            src={PAGE_EDITORIAL_WIDE}
            alt={PAGE_EDITORIAL_WIDE_ALT}
            width={2400}
            height={900}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-[center_55%] opacity-70 saturate-[0.9]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-flux-forest/50 via-transparent to-flux-void/30" aria-hidden />
        </div>
        <figcaption className="container mx-auto max-w-6xl px-5 py-3 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-flux-neon sm:px-6">
          Studio rooted in Nairobi
        </figcaption>
      </figure>

      <section id="terms-body" className="scroll-mt-24 bg-flux-void py-16 pb-28 md:py-20 md:pb-32">
        <div className="container mx-auto max-w-6xl px-5 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.55 }}
            className="mx-auto max-w-3xl space-y-5"
          >
            {sections.map((section) => (
              <article key={section.section_title} className="landing-page-card p-6">
                <h2 className="heading-editorial text-xl font-semibold text-white">{section.section_title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-white/72 sm:text-base">{section.content}</p>
              </article>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Terms;
