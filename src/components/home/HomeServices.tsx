import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { fadeInView, fadeItem, staggerContainer } from "./homeMotion";
import { ScrollNudge } from "@/components/marketing/ScrollNudge";
import { MarketingStoryImage } from "@/components/marketing/MarketingStoryImage";
import { PAGE_CREATIVE_WORKSPACE, PAGE_CREATIVE_WORKSPACE_ALT } from "@/lib/marketingImagery";

const SERVICES = [
  {
    title: "End-to-End Marketing Management",
    description: "Strategy, production, launch, campaign management, and growth follow-through under one Flux profile.",
  },
  {
    title: "Brand Identity & Positioning",
    description: "Naming, narrative, visual identity, differentiation, proof, and the story your market should remember.",
  },
  {
    title: "Creative Direction & Production",
    description: "Visual worlds, content systems, shoots, design direction, and campaign-ready creative output.",
  },
  {
    title: "Motion & Digital Assets",
    description: "Motion graphics, social content, web assets, launch visuals, product explainers, and digital collateral.",
  },
  {
    title: "Campaign Strategy & Execution",
    description: "Launch architecture, messaging arcs, media/channel logic, rollout calendars, and campaign management.",
  },
  {
    title: "Market Penetration",
    description: "Audience entry, offer positioning, activation ideas, customer journeys, and repeatable market traction.",
  },
  {
    title: "Branding & Physical Touchpoints",
    description: "Print, packaging, merch, signage, and collateral as supporting touchpoints inside the marketing system.",
  },
] as const;

export function HomeServices() {
  return (
    <section id="home-services" className="public-section bg-flux-sand/25" aria-labelledby="services-heading">
      <div className="container mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1 lg:col-span-5 lg:sticky lg:top-28"
          >
            <MarketingStoryImage
              src={PAGE_CREATIVE_WORKSPACE}
              alt={PAGE_CREATIVE_WORKSPACE_ALT}
              aspectClassName="aspect-[4/5] max-lg:aspect-[16/11]"
              className="border-white/60 bg-flux-sand lg:translate-x-2 lg:rotate-[1deg]"
              imgClassName="object-cover object-[center_35%]"
            />
          </motion.div>

          <div className="order-1 lg:order-2 lg:col-span-7">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeInView}
              className="flex flex-col justify-between gap-8 md:flex-row md:items-end"
            >
              <div className="max-w-xl">
                <p className="public-kicker">Service pillars</p>
                <h2 id="services-heading" className="heading-editorial mt-4 text-4xl font-semibold leading-tight text-flux-editorial sm:text-5xl">
                  Everything brand-related, managed from identity to market penetration.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-flux-editorial/78 md:text-right">
                Branding enables the work, but the core offer is full marketing management: what to say, what to make,
                where to launch, and how to keep improving.
              </p>
            </motion.div>

            <motion.ul
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={staggerContainer}
              className="mt-12 grid gap-4 sm:grid-cols-2"
            >
              {SERVICES.map((s) => (
                <motion.li key={s.title} variants={fadeItem}>
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-flux-sand bg-flux-ivory/75 p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-flux-green/35 hover:bg-white/85">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="heading-editorial text-xl font-semibold text-flux-editorial">{s.title}</h3>
                      <span className="rounded-full border border-flux-sand bg-white/50 p-1.5 text-flux-clay transition group-hover:border-flux-green/45 group-hover:bg-flux-forest group-hover:text-flux-ivory">
                        <ArrowUpRight className="h-4 w-4" aria-hidden />
                      </span>
                    </div>
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-flux-editorial/78">{s.description}</p>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-flux-green/50 to-transparent transition group-hover:scale-x-100" />
                  </article>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
        <ScrollNudge targetId="home-insights" />
      </div>
    </section>
  );
}
