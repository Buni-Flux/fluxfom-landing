import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Search, GitCompare, Rocket, ArrowRight, CheckCircle2, type LucideIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { MarketingStoryImage } from "@/components/marketing/MarketingStoryImage";
import {
  HOME_FINAL_CTA_IMAGE,
  PAGE_APPROACH_HERO,
  PAGE_APPROACH_HERO_ALT,
  PAGE_CREATIVE_WORKSPACE,
  PAGE_CREATIVE_WORKSPACE_ALT,
  PAGE_DEEP_WORK_STILL,
  PAGE_DEEP_WORK_STILL_ALT,
} from "@/lib/marketingImagery";
import { BrandTagline } from "@/components/marketing/BrandTagline";
import { ScrollNudge } from "@/components/marketing/ScrollNudge";

type Step = {
  step_number: number;
  title: string;
  description: string;
  icon: string | null;
  details: Json | null;
};

const iconMap: Record<string, LucideIcon> = { Search, GitCompare, Rocket };

const fallbackSteps: Step[] = [
  {
    step_number: 1,
    icon: "Search",
    title: "Brand diagnosis",
    description:
      "We map identity, audience, channels, content, perception, category dynamics, and real constraints so strategy starts from evidence.",
    details: [
      "Brand and marketing audit",
      "Market and competitor framing",
      "Audience signals and customer journeys",
      "Opportunity spaces worth owning",
    ],
  },
  {
    step_number: 2,
    icon: "GitCompare",
    title: "Positioning and marketing system",
    description:
      "We define how the brand should be recognized, remembered, and trusted, then translate that direction into content, motion, digital, campaign, and supporting branded assets.",
    details: [
      "Value proposition architecture",
      "Messaging hierarchy",
      "Content and asset recommendations",
      "Visual consistency rules",
    ],
  },
  {
    step_number: 3,
    icon: "Rocket",
    title: "Launch and growth intelligence",
    description:
      "We connect craft to campaigns, customer movement, and practical recommendations the business can keep using.",
    details: [
      "Campaign and channel assets",
      "Website and UX direction",
      "Flux profile and marketing overview",
      "Growth-insight cadence",
    ],
  },
];

const HowItWorks = () => {
  const [steps, setSteps] = useState<Step[]>(fallbackSteps);

  useEffect(() => {
    document.title = "Approach — FluxFom";
    const meta = document.querySelector('meta[name="description"]');
    meta?.setAttribute(
      "content",
      "See how FluxFom connects brand diagnosis, positioning, creative production, campaign execution, market penetration, and growth intelligence.",
    );

    supabase
      .from("cms_how_it_works")
      .select("*")
      .order("step_number")
      .then(({ data }) => {
        if (data && data.length > 0) setSteps(data);
      });
  }, []);

  return (
    <div className="min-h-full bg-flux-void text-white">
      <section className="landing-page-shell relative overflow-hidden border-b border-white/10 pb-16 pt-12 md:pb-24 md:pt-16">
        <div className="absolute -right-28 top-20 h-96 w-96 rounded-full bg-flux-neon/10 blur-3xl" aria-hidden />
        <div className="absolute -left-20 top-32 h-64 w-64 rounded-full bg-flux-gold/10 blur-3xl" aria-hidden />
        <div className="container relative mx-auto max-w-6xl px-5 sm:px-6">
          <div className="grid items-center gap-10 md:gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <BrandTagline className="mb-3" tone="on-dark" />
              <p className="landing-page-kicker">Approach</p>
              <h1 className="heading-editorial mt-4 max-w-4xl text-5xl font-semibold leading-[1.02] text-white sm:text-6xl md:text-7xl">
                A practical path from brand identity to market penetration.
              </h1>
              <p className="landing-page-copy mt-6 max-w-2xl sm:text-lg">
                We diagnose what exists, sharpen how the brand should be understood, then build the marketing overview,
                creative assets, campaigns, and customer-growth path needed to keep momentum moving.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <MarketingStoryImage
                src={PAGE_APPROACH_HERO}
                alt={PAGE_APPROACH_HERO_ALT}
                aspectClassName="aspect-[3/4] max-md:aspect-[16/11]"
                treatment="portrait"
                imgClassName="object-[center_35%]"
              />
            </motion.div>
          </div>
          <ScrollNudge targetId="how-inside-work" tone="dark" />
        </div>
      </section>

      <section id="how-inside-work" className="scroll-mt-24 border-b border-white/10 bg-[#07140b] py-16 md:py-24">
        <div className="container mx-auto max-w-6xl px-5 sm:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <MarketingStoryImage
              src={PAGE_CREATIVE_WORKSPACE}
              alt={PAGE_CREATIVE_WORKSPACE_ALT}
              aspectClassName="aspect-[5/4] sm:aspect-[16/10]"
              treatment="portrait"
            />
            <div>
              <p className="landing-page-kicker">Inside the work</p>
              <p className="heading-editorial mt-4 text-3xl font-semibold leading-snug text-white sm:text-4xl">
                Strategy stays close to the craft, so what we recommend is what your team can actually ship.
              </p>
              <p className="landing-page-copy mt-5">
                From identity systems to content, motion, digital experiences, and campaign journeys, we keep judgment,
                narrative, and execution in one conversation.
              </p>
            </div>
          </div>
          <ScrollNudge targetId="how-steps" tone="dark" />
        </div>
      </section>

      <section id="how-steps" className="scroll-mt-24 bg-flux-void py-20 md:py-28">
        <div className="container mx-auto max-w-6xl px-5 sm:px-6">
          <div className="space-y-20 md:space-y-28">
            {steps.map((step, i) => {
              const num = String(step.step_number).padStart(2, "0");
              const Icon = iconMap[step.icon ?? ""] ?? Search;
              const details = Array.isArray(step.details) ? (step.details as string[]) : [];
              return (
                <motion.div
                  key={num}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="grid items-start gap-10 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_90px_-48px_rgba(0,0,0,0.8)] backdrop-blur-xl md:grid-cols-2 md:gap-14 md:p-9"
                >
                  <div className={i % 2 === 1 ? "md:order-2" : ""}>
                    <div className="flex items-center gap-4">
                      <span className="font-condensed text-6xl font-bold text-flux-neon md:text-7xl">{num}</span>
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-flux-neon text-flux-void">
                        <Icon size={20} aria-hidden />
                      </span>
                    </div>
                    <h2 className="heading-editorial mt-6 text-3xl font-semibold text-white md:text-4xl">{step.title}</h2>
                    <p className="mt-4 leading-relaxed text-white/72">{step.description}</p>
                  </div>
                  <div className={i % 2 === 1 ? "md:order-1" : ""}>
                    <h3 className="mb-6 text-[11px] font-bold uppercase tracking-[0.22em] text-flux-neon">Deliverables</h3>
                    <ul className="space-y-3">
                      {details.map((d) => (
                        <li key={d} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-flux-neon" aria-hidden />
                          <span className="text-sm font-medium text-white">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <ScrollNudge targetId="how-cta" tone="dark" />
        </div>
      </section>

      <section id="how-cta" className="scroll-mt-24 relative overflow-hidden border-t border-white/10 bg-gradient-to-br from-flux-forest to-flux-void py-20 text-white md:py-28">
        <img
          src={HOME_FINAL_CTA_IMAGE}
          alt=""
          width={2400}
          height={900}
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[center_60%] opacity-[0.18]"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-flux-forest/80 via-flux-forest/90 to-flux-void/80" aria-hidden />
        <div className="container relative mx-auto max-w-6xl px-5 sm:px-6">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <MarketingStoryImage
                src={PAGE_DEEP_WORK_STILL}
                alt={PAGE_DEEP_WORK_STILL_ALT}
                aspectClassName="aspect-[4/5]"
                treatment="cinema"
                imgClassName="object-[center_30%]"
              />
            </motion.div>
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="heading-editorial text-4xl font-semibold leading-tight sm:text-5xl"
              >
                Ready to turn your brand touchpoints into a system?
              </motion.h2>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }}>
                <p className="mt-5 leading-relaxed text-white/72">
                  Share where you are, where you want the brand to go, and what must change for customers to choose you.
                </p>
                <Link
                  to="/start"
                  className="group mt-8 inline-flex items-center gap-2 rounded-full bg-flux-neon px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-flux-void transition hover:bg-[#b8ff33]"
                >
                  Start profile
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
