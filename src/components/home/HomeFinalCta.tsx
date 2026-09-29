import { motion } from "framer-motion";
import { fadeInView } from "./homeMotion";
import { SectionDivider } from "@/components/marketing/SectionDivider";
import FEATURED_VIDEO_URL from "@/assets/flux-abstract.mp4";

export function HomeFinalCta() {
  return (
    <section id="contact" data-gsap-section aria-labelledby="final-cta-heading" className="landing-section bg-flux-void">
      <div className="gsap-section-inner mx-auto max-w-[1400px]">
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
              <span className="heading-accent">Focus on the Business, <br/> look right doing it</span>
              <span className="heading-monument normal-case"> </span>
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
              <div className="group relative">
                <video
                  src={FEATURED_VIDEO_URL}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="h-full min-h-[320px] w-full object-cover md:min-h-[420px] [&::-webkit-media-controls-panel]:opacity-0 [&::-webkit-media-controls]:opacity-0 [&::-webkit-media-controls-play-button]:opacity-0 [&::-webkit-media-controls-current-time-display]:opacity-0 [&::-webkit-media-controls-time-remaining-display]:opacity-0 [&::-webkit-media-controls-timeline]:opacity-0 [&::-webkit-media-controls-volume-slider]:opacity-0 [&::-webkit-media-controls-mute-button]:opacity-0 [&::-webkit-media-controls-fullscreen-button]:opacity-0 group-hover:[&::-webkit-media-controls-panel]:opacity-100 group-hover:[&::-webkit-media-controls]:opacity-100 group-hover:[&::-webkit-media-controls-play-button]:opacity-100 group-hover:[&::-webkit-media-controls-current-time-display]:opacity-100 group-hover:[&::-webkit-media-controls-time-remaining-display]:opacity-100 group-hover:[&::-webkit-media-controls-timeline]:opacity-100 group-hover:[&::-webkit-media-controls-volume-slider]:opacity-100 group-hover:[&::-webkit-media-controls-mute-button]:opacity-100 group-hover:[&::-webkit-media-controls-fullscreen-button]:opacity-100"
                >
                  <source src={FEATURED_VIDEO_URL} type="video/mp4" />
                </video>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
