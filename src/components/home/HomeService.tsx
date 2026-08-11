import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { fadeInView, fadeItem, staggerContainer } from "./homeMotion";

const SERVICE_CARDS = [
  {
    id: 1,
    label: "(01)",
    title: "Social & \nContent Strategy.",
    bg: "bg-[#ffe8d2]",
  },
  {
    id: 2,
    label: "(02)",
    title: "Web & Digital",
    bg: "bg-[#e9dbff]",
  },
  {
    id: 3,
    label: "(03)",
    title: "Video, Animation\n& Motion Design.",
    bg: "bg-[#fbffcd]",
  },
  {
    id: 4,
    label: "(04)",
    title: "Brand Marketing\n& Growth.",
    bg: "bg-[#d9efff]",
  }
];

export function HomeMission() {
  return (
    <section id="what-is-fluxfom" data-gsap-section aria-labelledby="mission-heading" className="landing-section bg-white text-flux-void">
      <div className="gsap-section-inner mx-auto max-w-[1400px] px-0 sm:px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <div className="grid gap-10 xl:grid-cols-[minmax(0,0.57fr)_minmax(0,0.43fr)] xl:items-start">
            <motion.div variants={fadeInView}>
              <h3
                id="mission-heading"
                className="text-[clamp(2rem,3vw,3.5rem)] font-monument font-black leading-[0.92] tracking-tight text-flux-void"
              >What we can already handle for you:</h3>
            </motion.div>

            <motion.div
            className="flex flex-col items-start"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
              <div>
                {/* <p className="text-xs font-semibold uppercase tracking-[0.32em] text-flux-editorial/70">/About us/</p> */}
                <div className="mt-6 h-[1px] w-14 rounded-full bg-flux-editorial/20" />
                <p className="mt-6 text-sm leading-relaxed text-flux-editorial/90 md:text-base">
                  From branding to digital strategy, we help creators, startups and businesses alike to stand out in their niche competitive markets.
                </p>
              </div>

              <Link
                to="/services"
                className="mt-8 inline-flex items-center justify-center rounded-full btn-neon-solid px-8 py-4 text-sm font-semibold text-white shadow-[0_20px_60px_-30px_rgba(47,103,255,0.55)] transition hover:brightness-110"
              >
                Full Service List →
              </Link>
            </motion.div>
          </div>

          <motion.div variants={fadeInView} className="mt-14">
            <div className="service-carousel mt-6 rounded-[2rem] bg-white/0">
              <div className="service-carousel-track flex gap-6 py-6 px-4">
                {[...SERVICE_CARDS, ...SERVICE_CARDS].map((card, idx) => (
                  <motion.div
                    key={`${card.id}-${idx}`}
                    variants={fadeItem}
                    className={`${card.bg} cursor-crosshair group relative flex flex-col justify-between overflow-hidden rounded-[2rem] p-8 shadow-[0_20px_50px_-30px_rgba(15,24,29,0.20)] min-w-[280px] sm:min-w-[320px] lg:min-w-[340px] min-h-[360px]`}
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.28em] text-flux-editorial/60">
                      {card.label}
                    </span>
                    <div className="flex flex-row items-center justify-between">
                      <h3 className="mt-8 whitespace-pre-line text-xl font-semibold leading-tight text-flux-void w-11/12">
                        {card.title}
                      </h3>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-flux-void text-white transition group-hover:scale-105">
                        <ChevronRight size={18} strokeWidth={3} aria-hidden />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
