import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { fadeInView } from "./homeMotion";
import {
  HOME_HERO_IMAGE,
  HOME_HERO_IMAGE_ALT,
  HOME_HERO_OPERATOR_CARD_ALT,
  HOME_HERO_OPERATOR_CARD_SRC,
  PAGE_CREATIVE_WORKSPACE,
  PAGE_CREATIVE_WORKSPACE_ALT,
} from "@/lib/marketingImagery";
import { ScrollNudge } from "@/components/marketing/ScrollNudge";

const SYSTEM_TAGS = ["Identity", "Content", "Motion", "Digital", "Campaigns", "Growth"];

function MarketingSystemCard() {
  return (
    <div className="public-card relative overflow-hidden rounded-[1.35rem] bg-flux-ivory/95 p-4 text-left backdrop-blur">
      <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-flux-clay">Marketing system</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {SYSTEM_TAGS.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-flux-sand/90 bg-white/80 px-3 py-2 text-[10px] font-semibold text-flux-editorial/90"
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="heading-editorial mt-5 border-t border-flux-sand pt-4 text-lg leading-tight text-flux-editorial">
        From identity to market penetration.
      </p>
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-flux-growth/10 blur-2xl" aria-hidden />
    </div>
  );
}

export function HomeHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <section ref={ref} aria-labelledby="home-hero-heading" className="relative min-h-[100dvh] overflow-hidden bg-flux-ivory">
      <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-0 will-change-transform">
        <img
          src={HOME_HERO_IMAGE}
          alt={HOME_HERO_IMAGE_ALT}
          width={2400}
          height={1600}
          fetchPriority="high"
          decoding="async"
          className="h-[118%] w-full object-cover object-[center_30%] opacity-[0.18] saturate-[0.86] sm:object-[center_25%]"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-flux-ivory via-flux-ivory/96 to-flux-ivory/72" />
      <div className="absolute inset-0 bg-gradient-to-br from-flux-ivory/94 via-flux-ivory/86 to-flux-sand/74" />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(43,170,54,0.08),transparent_34%),radial-gradient(circle_at_12%_78%,rgba(166,106,63,0.1),transparent_34%),radial-gradient(circle_at_70%_88%,rgba(244,180,0,0.09),transparent_28%)]"
        aria-hidden
      />
      <div className="flux-grain absolute inset-0 opacity-[0.18] mix-blend-multiply" aria-hidden />

      <div className="relative z-10 flex min-h-[100dvh] flex-col justify-end pb-32 pt-28 md:justify-center md:pb-28 md:pt-24">
        <div className="container mx-auto max-w-6xl px-5 sm:px-6">
          <div className="grid items-end gap-12 lg:grid-cols-12 lg:items-center lg:gap-12">
            <motion.div className="lg:col-span-7" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.14 } } }}>
              <motion.h1
                id="home-hero-heading"
                variants={fadeInView}
                className="heading-editorial max-w-5xl text-5xl font-semibold leading-[0.98] text-flux-editorial sm:text-6xl md:text-7xl lg:text-[5.7rem]"
              >
                Make your brand Standout{" "}
                <span className="text-flux-gold">in Motion</span>.
              </motion.h1>
              <motion.p
                variants={fadeInView}
                className="mt-7 max-w-2xl rounded-[1.25rem] border border-flux-sand/90 bg-flux-ivory/92 px-5 py-4 text-base font-medium leading-relaxed text-flux-editorial shadow-[0_18px_60px_-42px_rgba(16,59,27,0.18)] backdrop-blur sm:text-lg"
              >
                Your brand deserves strategy, creative systems, and digital marketing that actually converts to sales.
                Start your profile and begin communicating clearly, launching better & always growing with intention.
              </motion.p>
              <motion.div variants={fadeInView} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <Link to="/start" className="public-button-primary">
                  Start Profile
                </Link>
                {/* <Link to="/projects" className="public-button-secondary">
                  View Our Work
                </Link> */}
              </motion.div>
              <motion.div variants={fadeInView} className="mt-12 grid max-w-xl grid-cols-3 gap-3 border-y border-flux-sand py-5 text-flux-editorial">
                {[
                  ["Brand", "Identity"],
                  ["Campaign", "Engine"],
                  ["Market", "Penetration"],
                ].map(([top, bottom]) => (
                  <div key={top}>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-flux-clay">{top}</p>
                    <p className="heading-editorial mt-1 text-xl font-semibold">{bottom}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              className="relative mx-auto w-full max-w-md lg:col-span-5 lg:mx-0 lg:max-w-none"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative aspect-[4/5] max-h-[min(52vh,440px)] w-full sm:aspect-[5/6] lg:ml-auto lg:max-h-[min(58vh,520px)] lg:w-[min(100%,420px)]">
                <motion.div
                  className="absolute left-0 top-[8%] z-20 w-[58%] max-w-[220px] overflow-hidden rounded-[1.4rem] border border-white/45 shadow-[0_28px_70px_-32px_rgba(27,43,34,0.6)] sm:w-[55%] sm:max-w-[235px]"
                  initial={{ opacity: 0, x: -20, rotate: -3 }}
                  animate={{ opacity: 1, x: 0, rotate: -2.5 }}
                  transition={{ delay: 0.55, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="relative aspect-[3/4] w-full">
                    <img
                      src={HOME_HERO_OPERATOR_CARD_SRC}
                      alt={HOME_HERO_OPERATOR_CARD_ALT}
                      width={900}
                      height={1200}
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover object-[center_12%] saturate-[0.9]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-flux-forest/42 via-transparent to-transparent" aria-hidden />
                    <div className="flux-grain absolute inset-0 opacity-30 mix-blend-overlay" aria-hidden />
                  </div>
                </motion.div>

                <motion.div
                  className="absolute right-0 top-0 z-10 w-[66%] overflow-hidden rounded-[1.6rem] border border-white/50 shadow-[0_30px_80px_-34px_rgba(27,43,34,0.6)] sm:w-[62%]"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="relative aspect-[4/5]">
                    <img
                      src={PAGE_CREATIVE_WORKSPACE}
                      alt={PAGE_CREATIVE_WORKSPACE_ALT}
                      width={900}
                      height={1125}
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover object-center saturate-[0.92]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-flux-forest/45 via-transparent to-transparent" aria-hidden />
                  </div>
                </motion.div>

                <motion.div
                  className="absolute bottom-[6%] right-[2%] z-30 w-[62%] max-w-[260px] sm:max-w-[280px]"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.72, duration: 0.55 }}
                >
                  <MarketingSystemCard />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* <ScrollNudge targetId="home-after-hero" variant="hero" /> */}
    </section>
  );
}
