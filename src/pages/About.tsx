import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MarketingStoryImage } from "@/components/marketing/MarketingStoryImage";
import {
  HOME_HERO_IMAGE,
  HOME_HERO_IMAGE_ALT,
  PAGE_CREATIVE_PERFORMANCE,
  PAGE_CREATIVE_PERFORMANCE_ALT,
} from "@/lib/marketingImagery";
import { BrandTagline } from "@/components/marketing/BrandTagline";
import { ScrollNudge } from "@/components/marketing/ScrollNudge";

type Section = { section_key: string; title: string | null; content: string };

const VALUES = [
  {
    title: "Clarity",
    desc: "Positioning and messaging that remove ambiguity for teams and customers.",
  },
  {
    title: "Craft",
    desc: "Content, motion, digital, campaign, and supporting branded assets that feel premium without losing local truth.",
  },
  {
    title: "Systems",
    desc: "Growth loops and touchpoints designed to compound beyond one launch, one channel, or one campaign.",
  },
] as const;

const About = () => {
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    document.title = "About — FluxFom";
    const meta = document.querySelector('meta[name="description"]');
    meta?.setAttribute(
      "content",
      "FluxFom is a Nairobi-rooted full-service marketing agency managing brand identity, creative production, campaigns, market penetration, and growth intelligence.",
    );

    supabase
      .from("cms_about")
      .select("*")
      .order("display_order")
      .then(({ data }) => {
        if (data && data.length > 0) setSections(data);
      });
  }, []);

  const hasCmsContent = sections.length > 0;

  return (
    <div>
      <section className="relative overflow-hidden border-b border-flux-sand bg-flux-ivory pb-16 pt-12 md:pb-24 md:pt-16">
        <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-flux-clay/12 blur-3xl" aria-hidden />
        <div className="absolute -right-24 top-8 h-72 w-72 rounded-full bg-flux-gold/10 blur-3xl" aria-hidden />
        <div className="container relative mx-auto max-w-6xl px-5 sm:px-6">
          <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-10">
            <motion.div className="lg:col-span-7" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <BrandTagline className="mb-3" />
              <p className="public-kicker">Studio</p>
              <h1 className="heading-editorial mt-4 text-5xl font-semibold leading-[1.02] text-flux-editorial sm:text-6xl md:text-7xl">
                End-to-end brand marketing management from Nairobi outward.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-flux-editorial/78">
                FluxFom helps ambitious businesses become easier to recognize, remember, and choose by connecting brand
                strategy, creative execution, and customer-growth systems.
              </p>
            </motion.div>
            <motion.div className="lg:col-span-5" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08 }}>
              <MarketingStoryImage
                src={HOME_HERO_IMAGE}
                alt={HOME_HERO_IMAGE_ALT}
                aspectClassName="aspect-[4/5] max-lg:aspect-[16/11]"
                treatment="portrait"
                imgClassName="object-[center_32%]"
              />
            </motion.div>
          </div>
          <ScrollNudge targetId="about-body" />
        </div>
      </section>

      <section id="about-body" className="public-section bg-flux-ivory">
        <div className="container mx-auto max-w-6xl px-5 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <p className="public-kicker">Why we exist</p>
              <h2 className="heading-editorial mt-4 text-3xl font-semibold leading-tight text-flux-editorial sm:text-4xl">
                Creative work should lead somewhere.
              </h2>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-7 text-base leading-relaxed text-flux-editorial/78 sm:text-lg lg:col-span-8"
            >
              {hasCmsContent ? (
                sections.map((s) => (
                  <div key={s.section_key} className="rounded-[1.4rem] border border-flux-sand bg-white/55 p-6">
                    {s.title && <h3 className="heading-editorial mb-3 text-2xl font-semibold text-flux-editorial">{s.title}</h3>}
                    <p>{s.content}</p>
                  </div>
                ))
              ) : (
                <>
                  <p>
                    FluxFom is a brand-positioning and growth studio for businesses that care how they are perceived in
                    public. We sharpen identity, produce content, motion, and digital assets, manage campaigns, modernize
                    presence, and connect customer touchpoints into systems that can scale.
                  </p>
                  <p>
                    Our work sits between creative direction and commercial reality, so strategy does not live in a slide
                    deck, and design does not float above the business model.
                  </p>
                  <p className="heading-editorial rounded-[1.4rem] border border-flux-sand/90 bg-flux-sand/25 p-6 text-2xl font-semibold leading-snug text-flux-editorial">
                    The outcome we optimize for is simple: a brand that feels authoritative, human, and ready for growth.
                  </p>
                  <p>
                    From Nairobi outward, we partner with founders, marketers, and creative leads who want global polish
                    without losing cultural truth.
                  </p>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-y border-flux-sand bg-flux-sand/35 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl px-5 sm:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <MarketingStoryImage
              src={PAGE_CREATIVE_PERFORMANCE}
              alt={PAGE_CREATIVE_PERFORMANCE_ALT}
              aspectClassName="aspect-[5/4] sm:aspect-[16/10]"
              className="lg:order-2"
              treatment="portrait"
            />
            <div className="lg:order-1">
              <p className="public-kicker">Ambition and discipline</p>
              <p className="heading-editorial mt-4 text-3xl font-semibold leading-snug text-flux-editorial sm:text-4xl">
                Brands win when they are seen clearly, consistently, and with enough conviction to be remembered.
              </p>
              <p className="mt-5 text-base leading-relaxed text-flux-editorial/78">
                We work with teams who want creative risk with strategic discipline: identities that feel clear, campaigns
                that feel intentional, and growth systems that respect the people they are built for.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="public-section bg-flux-ivory">
        <div className="container mx-auto max-w-6xl px-5 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="heading-editorial text-center text-3xl font-semibold text-flux-editorial sm:text-4xl md:text-5xl"
          >
            How we create leverage
          </motion.h2>
          <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <motion.article
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-[1.4rem] border border-flux-sand bg-white/60 p-7"
              >
                <p className="font-condensed text-4xl font-bold text-flux-growth">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="heading-editorial mt-4 text-2xl font-semibold text-flux-editorial">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-flux-cool-gray">{v.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-flux-sand bg-flux-forest py-20 text-flux-ivory md:py-28">
        <div className="container mx-auto max-w-6xl px-5 sm:px-6">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="heading-editorial text-4xl font-semibold leading-tight sm:text-5xl"
            >
              Let&apos;s build a brand people remember.
            </motion.h2>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }}>
              <p className="leading-relaxed text-flux-ivory/78">Tell us what you are building and what must change in perception.</p>
              <Link
                to="/start"
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-flux-green px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#24932E]"
              >
                Start profile
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
