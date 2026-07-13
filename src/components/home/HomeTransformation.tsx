import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Lightbulb, Megaphone, QrCode, Sparkles, TrendingUp } from "lucide-react";
import { fadeInView, fadeItem, staggerContainer } from "./homeMotion";
import { ScrollNudge } from "@/components/marketing/ScrollNudge";
import { MarketingStoryImage } from "@/components/marketing/MarketingStoryImage";
import { HOME_TRANSFORMATION_BEFORE_ALT, HOME_TRANSFORMATION_BEFORE_IMAGE } from "@/lib/marketingImagery";

const JOURNEY = [
  {
    title: "You are awarded a Flux profile",
    detail: "A guided intake captures the business, audience, current brand state, goals, and marketing gaps.",
    icon: QrCode,
  },
  {
    title: "You receive a marketing overview",
    detail: "We turn your profile into a clear view of positioning, content needs, channel priorities, and growth opportunities.",
    icon: BadgeCheck,
  },
  {
    title: "We build your brand foundation",
    detail: "Identity, messaging, visual direction, and brand rules become the foundation for consistent marketing.",
    icon: Lightbulb,
  },
  {
    title: "You get market-ready assets",
    detail: "Motion, digital, social, campaign, web, and supporting branded materials are produced for the strategy.",
    icon: Megaphone,
  },
  {
    title: "We strategically help you penetrate your desired market",
    detail: "We move your brand clearly from setup to launch, campaign management, customer engagement, and ultimately clear growth intelligence which we will vevrify and communicate your brand's presence eternally.",
    icon: TrendingUp,
  },
] as const;

export function HomeTransformation() {
  return (
    <section id="home-transformation" className="public-section relative overflow-hidden bg-flux-sand/35" aria-labelledby="transform-heading">
      <div className="pointer-events-none absolute -right-24 top-1/3 h-[32rem] w-[32rem] rounded-full bg-flux-growth/10 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-flux-clay/14 blur-3xl" aria-hidden />
      <div className="container relative mx-auto max-w-6xl px-5 sm:px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeInView} className="max-w-3xl">
          <p className="public-kicker">What happens after Start Profile?</p>
          <h2 id="transform-heading" className="heading-editorial mt-4 text-4xl font-semibold leading-tight text-flux-editorial sm:text-5xl">
            Your Flux profile becomes the starting point for managed marketing.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-flux-editorial/80">
            We use your profile to understand the brand, generate a marketing overview, then plan and manage the work
            needed to move from identity to market penetration.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <MarketingStoryImage
              src={HOME_TRANSFORMATION_BEFORE_IMAGE}
              alt={HOME_TRANSFORMATION_BEFORE_ALT}
              aspectClassName="aspect-[4/5] max-lg:aspect-[16/11]"
              className="border-white/60 bg-flux-sand"
              imgClassName="object-cover object-center"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="relative overflow-hidden rounded-[2rem] border border-flux-sand/90 bg-flux-ivory/88 p-5 shadow-[0_28px_90px_-48px_rgba(27,43,34,0.42)] lg:col-span-7 md:p-7"
          >
            <div className="mb-5 flex items-center justify-between gap-4 rounded-[1.25rem] border border-flux-sand/90 bg-white/72 p-4 text-flux-editorial shadow-sm">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-flux-clay">Connected profile</p>
                <p className="mt-1 text-sm font-medium text-flux-editorial">
                  Start Profile creates the foundation for your marketing overview page.
                </p>
              </div>
              <div className="hidden shrink-0 rounded-2xl border border-flux-sand bg-flux-ivory p-3 text-center sm:block">
                <QrCode className="mx-auto h-8 w-8 text-flux-clay" strokeWidth={1.5} aria-hidden />
                <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-flux-clay">Scan</p>
              </div>
            </div>
            <motion.ol initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={staggerContainer} className="relative space-y-4">
              {JOURNEY.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <motion.li
                    key={step.title}
                    variants={fadeItem}
                    className="group relative rounded-[1.35rem] border border-flux-sand/90 bg-white/78 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-flux-green/45 hover:bg-white"
                  >
                    <div className="grid gap-4 sm:grid-cols-[auto_1fr_auto] sm:items-start">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-flux-forest text-flux-ivory shadow-[0_12px_28px_-18px_rgba(27,43,34,0.85)]">
                        <Icon className="h-5 w-5" strokeWidth={1.7} aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-flux-clay">
                          Step {String(idx + 1).padStart(2, "0")}
                        </p>
                        <h3 className="heading-editorial mt-1 text-xl font-semibold text-flux-editorial">{step.title}</h3>
                        <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-flux-editorial">{step.detail}</p>
                      </div>
                      {idx < JOURNEY.length - 1 ? (
                        <ArrowRight
                          className="mt-3 hidden h-5 w-5 shrink-0 text-flux-clay opacity-80 transition group-hover:translate-x-1 group-hover:opacity-100 md:block"
                          strokeWidth={1.8}
                          aria-hidden
                        />
                      ) : (
                        <Sparkles className="mt-3 hidden h-5 w-5 shrink-0 text-flux-clay md:block" strokeWidth={1.7} aria-hidden />
                      )}
                    </div>
                  </motion.li>
                );
              })}
            </motion.ol>
          </motion.div>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65 }}
            className="relative overflow-hidden rounded-[1.5rem] border border-flux-sand/90 bg-flux-forest p-8 text-flux-ivory md:p-10"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#E7DCC6]/90">Before</p>
            <h3 className="heading-editorial mt-4 text-3xl font-semibold">Marketing feels scattered.</h3>
            <p className="mt-4 text-sm leading-relaxed text-flux-ivory/84">
              Identity, content, campaigns, channels, and customer engagement move separately with no single operating view.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="relative overflow-hidden rounded-[1.5rem] border border-flux-growth/25 bg-flux-ivory p-8 shadow-[0_24px_70px_-45px_rgba(27,43,34,0.4)] md:p-10"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-flux-clay">After</p>
            <h3 className="heading-editorial mt-4 text-3xl font-semibold text-flux-editorial">Flux manages the full path.</h3>
            <p className="mt-4 text-sm leading-relaxed text-flux-editorial/78">
              Your profile guides identity, creative production, motion, digital assets, campaign execution, and growth
              recommendations in one marketing system.
            </p>
          </motion.div>
        </div>
        <ScrollNudge targetId="home-process" className="relative z-[1]" />
      </div>
    </section>
  );
}
