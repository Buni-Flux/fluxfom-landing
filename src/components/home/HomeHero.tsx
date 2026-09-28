import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock3, CarFront, ShieldCheck, Facebook, Instagram, Twitter } from "lucide-react";
import { fadeInView } from "./homeMotion";

const HERO_STATS = [
  {
    label: "Two decades",
    description: "Family-run since 2004, with the same service team behind every sale.",
    icon: Clock3,
  },
  {
    label: "15,000 vehicles",
    description: "Sold and serviced — first cars through to full fleet replacement.",
    icon: CarFront,
  },
  {
    label: "172-point check",
    description: "Every certified vehicle inspected before it reaches the floor.",
    icon: ShieldCheck,
  },
];

export function HomeHero() {
  return (
    <section
      id="hero"
      data-gsap-section
      aria-labelledby="home-hero-heading"
      className="relative overflow-hidden text-flux-void"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(3, 18, 30, 0.55) 0%, rgba(3, 18, 30, 0.55) 25%, rgba(3, 18, 30, 0.35) 30%), url('/assets/images/hero-bg.jpg')",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="gsap-section-inner mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="flex flex-col gap-10 items-center text-center">
          <motion.div
            className="flex flex-col gap-6 items-center"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.h1
              id="home-hero-heading"
              variants={fadeInView}
              className="text-[clamp(3rem,5vw,5.25rem)] font-monument font-black leading-[0.92] tracking-tight md:mt-16 text-flux-void"
            >
              <span className="block text-white">Make your business impossible to ignore.</span>
            </motion.h1>
          </motion.div>

          <motion.div
            className="flex flex-col space-y-6 items-start"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <motion.p
              variants={fadeInView}
              className="max-w-xl text-base leading-relaxed text-white/90 md:text-lg"
            >
              Every brand needs a growth partner, that's why we help turn ideas into something people can see, feel and remember long after their purchase.
            </motion.p>

            <div className="mt-16 self-center flex flex-col gap-4 md:flex-row items-center justify-center">
              <Link to="/start" className="btn-neon-solid px-9 py-4 text-base">
                Try Fluxfom for 14 days
              </Link>
              <Link to="/contact" className="btn-neon-outline px-9 py-4 text-base">
                Talk to a Human →
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="mt-14">
          <div className="mx-auto flex max-w-[1100px] flex-col items-center justify-between gap-6 rounded-[1.5rem] text-white sm:px-8 lg:flex-row">
            <div className="grid w-full gap-5 px-6 py-4 bg-white/10 border border-white/20 shadow-xl backdrop-blur-md sm:grid-cols-3 lg:flex-1">
              {HERO_STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-start gap-3">
                    <Icon className="mt-1 h-4 w-4 shrink-0 text-[#C9FF6B]" aria-hidden />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                        {stat.label}
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-white/80">
                        {stat.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex shrink-0 items-center gap-2 border-t border-white/20 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0" aria-label="Social links">
              <a href="#facebook" aria-label="Facebook" className="rounded-full border border-white/20 bg-white/10 p-2 transition hover:bg-white/20"><Facebook className="h-3.5 w-3.5" aria-hidden /></a>
              <a href="#instagram" aria-label="Instagram" className="rounded-full border border-white/20 bg-white/10 p-2 transition hover:bg-white/20"><Instagram className="h-3.5 w-3.5" aria-hidden /></a>
              <a href="#twitter" aria-label="Twitter" className="rounded-full border border-white/20 bg-white/10 p-2 transition hover:bg-white/20"><Twitter className="h-3.5 w-3.5" aria-hidden /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
