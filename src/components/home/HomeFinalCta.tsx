import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeInView } from "./homeMotion";
import { SectionDivider } from "@/components/marketing/SectionDivider";

export function HomeFinalCta() {
  return (
    <section id="contact" aria-labelledby="final-cta-heading" className="landing-section bg-flux-void">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.h2
              id="final-cta-heading"
              variants={fadeInView}
              className="text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.08] text-white"
            >
              <span className="heading-accent">Focus </span>
              <span className="heading-monument normal-case">on the Business, look & </span>
              <span className="heading-accent">Sound </span>
              <span className="heading-monument normal-case">right doing it</span>
            </motion.h2>

            <motion.div variants={fadeInView}>
              <SectionDivider className="my-8 max-w-md" />
            </motion.div>

            <motion.p variants={fadeInView} className="max-w-md text-sm leading-relaxed text-white/65 md:text-[15px]">
              Your brand should sound as good as it looks. We align identity, messaging, and marketing so every touchpoint
              reinforces who you are — and moves your audience to act.
            </motion.p>

            <motion.p
              variants={fadeInView}
              className="mt-5 max-w-md text-sm leading-relaxed text-white/65 md:text-[15px]"
            >
              From campaigns and digital products to user-generated content and music videos — we handle the full stack
              so you can focus on the business.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65 }}
            className="mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="relative overflow-hidden rounded-2xl border-[5px] border-flux-neon neon-glow-strong">
              <div className="liquid-green aspect-[3/4] w-full" aria-hidden />
              <div className="flux-grain absolute inset-0 opacity-30 mix-blend-overlay" aria-hidden />

              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
                <div className="rounded-lg bg-black/60 px-8 py-4 backdrop-blur-sm">
                  <span className="heading-monument text-lg tracking-widest text-white md:text-xl">[PLACEHOLDER]</span>
                </div>
                <Link to="/start" className="btn-neon-solid px-10 py-3.5 text-base">
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
