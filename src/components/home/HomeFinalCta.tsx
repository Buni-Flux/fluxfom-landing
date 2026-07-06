import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { fadeInView } from "./homeMotion";
import { HOME_FINAL_CTA_IMAGE, HOME_FINAL_CTA_IMAGE_ALT } from "@/lib/marketingImagery";

export function HomeFinalCta() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section id="home-final-cta" ref={ref} className="relative min-h-[76vh] overflow-hidden bg-flux-forest" aria-labelledby="final-cta-heading">
      <motion.div style={{ y }} className="absolute inset-0 scale-110 will-change-transform">
        <img
          src={HOME_FINAL_CTA_IMAGE}
          alt={HOME_FINAL_CTA_IMAGE_ALT}
          width={2400}
          height={1600}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-[center_35%] opacity-70 saturate-[0.88]"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-flux-forest via-flux-forest/78 to-flux-green/20" />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(100,216,58,0.12),transparent_28%),radial-gradient(circle_at_78%_72%,rgba(244,180,0,0.14),transparent_32%)]"
        aria-hidden
      />
      <div className="flux-grain absolute inset-0 opacity-35 mix-blend-overlay" aria-hidden />

      <div className="relative z-10 flex min-h-[76vh] items-center">
        <div className="container mx-auto max-w-4xl px-5 py-24 text-center sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
          >
            <motion.p variants={fadeInView} className="public-kicker-accent mx-auto max-w-xs text-center [&::before]:mx-auto">
              Nairobi ambition, built with memory
            </motion.p>
            <motion.h2
              id="final-cta-heading"
              variants={fadeInView}
              className="heading-editorial mt-5 text-5xl font-semibold leading-[1.02] text-flux-ivory sm:text-6xl md:text-7xl"
            >
              Your Brand Deserves Strategic Gravity.
            </motion.h2>
            <motion.p variants={fadeInView} className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-flux-ivory/88">
              Move beyond scattered marketing. Start a Flux profile and get a clearer overview of what your brand needs next.
            </motion.p>
            <motion.div variants={fadeInView} className="mt-10 flex justify-center">
              <Link
                to="/start"
                className="inline-flex items-center justify-center rounded-full bg-flux-green px-10 py-4 text-sm font-semibold text-white shadow-[0_24px_60px_-30px_rgba(43,170,54,0.45)] transition hover:-translate-y-0.5 hover:bg-[#24932E]"
              >
                Start Profile
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
