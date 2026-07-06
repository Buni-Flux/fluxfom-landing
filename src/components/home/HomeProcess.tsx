import { motion } from "framer-motion";
import { BarChart3, Compass, Eye, Megaphone, PackagePlus, UsersRound } from "lucide-react";
import { fadeInView, fadeItem, staggerContainer } from "./homeMotion";
import { ScrollNudge } from "@/components/marketing/ScrollNudge";
import { MarketingStoryImage } from "@/components/marketing/MarketingStoryImage";
import { HOME_PROCESS_MID_ALT, HOME_PROCESS_MID_IMAGE } from "@/lib/marketingImagery";

const PROFILE_FEATURES = [
  {
    title: "Marketing overview",
    detail: "A practical view of where the brand stands, what it needs, and where growth can come from.",
    icon: BarChart3,
  },
  {
    title: "Identity and positioning health",
    detail: "How clearly the brand is named, framed, differentiated, and understood before the market sees it.",
    icon: Eye,
  },
  {
    title: "Content and motion readiness",
    detail: "What social, motion, digital, website, and launch assets are needed to show up with confidence.",
    icon: Compass,
  },
  {
    title: "Audience and channel alignment",
    detail: "Guidance on who the brand must reach, where they are, and what message should move them.",
    icon: UsersRound,
  },
  {
    title: "Campaign opportunity map",
    detail: "The offers, stories, activations, and launches that can help the brand penetrate its market.",
    icon: PackagePlus,
  },
  {
    title: "Managed next moves",
    detail: "Clear priorities for what Flux should plan, produce, launch, measure, and improve next.",
    icon: Megaphone,
  },
] as const;

export function HomeProcess() {
  return (
    <section id="home-process" className="public-section bg-flux-ivory" aria-labelledby="process-heading">
      <div className="container mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-14">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInView}
            className="lg:col-span-5 lg:sticky lg:top-28"
          >
            <p className="public-kicker">Flux Profile</p>
            <h2 id="process-heading" className="heading-editorial mt-4 text-4xl font-semibold leading-tight text-flux-editorial sm:text-5xl">
              Flux Profiles become living marketing overview pages.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-flux-editorial/80">
              Start Profile gives FluxFom the context to create a marketing overview: identity state, audience, channels,
              content needs, campaign opportunities, and the next managed steps.
            </p>
            <div className="mt-8 rounded-[1.5rem] border border-flux-sand bg-white/60 p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-flux-clay">Framed as</p>
              <p className="heading-editorial mt-2 text-2xl font-semibold text-flux-editorial">Brand Insights</p>
              <p className="mt-3 text-sm leading-relaxed text-flux-editorial/78">
              Practical recommendations from the FluxFom ecosystem, presented in human language for founders, marketers,
              and operators who need a clear path from brand setup to market traction.
              </p>
            </div>
          </motion.div>

          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="-mx-1 sm:mx-0"
            >
              <MarketingStoryImage
                src={HOME_PROCESS_MID_IMAGE}
                alt={HOME_PROCESS_MID_ALT}
                aspectClassName="aspect-[16/11]"
                className="border-white/60 bg-flux-sand"
                imgClassName="object-cover object-center"
              />
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={staggerContainer}
              className="mt-6 grid gap-4 sm:grid-cols-2"
            >
              {PROFILE_FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <motion.article
                    key={feature.title}
                    variants={fadeItem}
                    className="group rounded-[1.35rem] border border-flux-sand bg-white/55 p-6 transition duration-300 hover:-translate-y-1 hover:border-flux-green/35 hover:bg-white/85"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-flux-sand text-flux-clay transition group-hover:bg-flux-forest group-hover:text-flux-ivory">
                      <Icon className="h-5 w-5" strokeWidth={1.7} aria-hidden />
                    </span>
                    <h3 className="heading-editorial mt-5 text-xl font-semibold text-flux-editorial">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-flux-editorial/78">{feature.detail}</p>
                  </motion.article>
                );
              })}
            </motion.div>
          </div>
        </div>
        <ScrollNudge targetId="home-featured-work" />
      </div>
    </section>
  );
}
