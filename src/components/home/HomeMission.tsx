import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { fadeInView } from "./homeMotion";
import { NeonPlayFrame } from "@/components/marketing/NeonPlayFrame";

export function HomeMission() {
  return (
    <section id="what-is-fluxfom" aria-labelledby="mission-heading" className="landing-section bg-flux-void">
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-16">
            <motion.div variants={fadeInView} className="lg:col-span-7">
              <h2
                id="mission-heading"
                className="text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.08] text-white"
              >
                <span className="heading-accent block sm:inline">We help your brand get to </span>
                <span className="heading-monument normal-case text-flux-neon">where it would like to be.</span>
              </h2>
            </motion.div>

            <motion.div variants={fadeInView} className="flex lg:col-span-5 lg:justify-end">
              <Link to="/about" className="btn-gold gap-1">
                About Us
                <ChevronRight size={14} strokeWidth={2.5} aria-hidden />
              </Link>
            </motion.div>
          </div>

          <motion.p
            variants={fadeInView}
            className="mt-10 max-w-3xl text-sm leading-relaxed text-white/65 md:text-base md:leading-7"
          >
            FluxFom was born from working with startups that had strong products but weak brand clarity. We saw teams
            spending on campaigns before they had a clear position — and losing focus along the way. Today we help brands
            discover who they are, define the journey, and turn that into real marketing and conversion results.
          </motion.p>

          <motion.div variants={fadeInView} className="mt-16 md:mt-20">
            <NeonPlayFrame size="lg" className="mx-auto max-w-4xl animate-neon-pulse" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
