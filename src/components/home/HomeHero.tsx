import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeInView } from "./homeMotion";

export function HomeHero() {
  return (
    <section id="hero" aria-labelledby="home-hero-heading" className="bg-white text-flux-void">
      <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="grid gap-10 items-top lg:grid-cols-[minmax(0,0.6fr)_minmax(0,0.4fr)]">
          <motion.div
            className="lg:pr-8"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.h1
              id="home-hero-heading"
              variants={fadeInView}
              className="text-[clamp(3rem,5vw,5.25rem)] font-monument font-black leading-[0.92] tracking-tight text-flux-void"
            >
              <span className="block"><span className="text-flux-accent">Discover<br/></span>your brand,</span>
              <span className="block"><span>position </span> <br/> to win</span>
              {/* <span className="block">
                To <span className="heading-accent">Win</span>
              </span> */}
            </motion.h1>
          </motion.div>

          <motion.div
            className="flex flex-col items-start"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <motion.p
              variants={fadeInView}
              className="max-w-xl text-base leading-relaxed text-flux-editorial/90 md:text-lg"
            >
              Marketing tools that help you communicate clearly & effectively with your audience without losing focus of your business.
            </motion.p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
              <Link to="/start" className="btn-neon-solid px-9 py-4 text-base">
                Get Started
              </Link>
              <Link to="/how-it-works" className="btn-neon-outline px-9 py-4 text-base">
                Find Out More
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="mt-14">
          <div className="relative overflow-hidden rounded-[2rem] border border-flux-sand bg-flux-sand/10 shadow-[0_40px_120px_-55px_rgba(5,16,5,0.18)]">
            <img
              src="/assets/images/hero-bg.png"
              alt="Creative team collaborating on a laptop"
              fetchPriority="high"
              decoding="async"
              className="h-[420px] w-full object-cover sm:h-[520px]"
            />
            <img
              src="/assets/images/hero-bg-face.png"
              alt="Creative team collaborating on a laptop"
              fetchPriority="high"
              decoding="async"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain sm:h-[520px]"
            />
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-flux-sand/50 pt-8 text-center text-sm text-flux-editorial/70 sm:flex-row sm:text-left">
            <p className="font-semibold uppercase tracking-[0.24em] text-flux-editorial/85">
              Companies we've helped
            </p>
            <div className="flex flex-wrap items-center justify-center gap-5 text-xs uppercase tracking-[0.24em] text-flux-editorial/70 sm:justify-end">
              <span>Lumina</span>
              <span>Vortex</span>
              <span>Velocity</span>
              <span>Synergy</span>
              <span>Enigma</span>
              <span>Spectrum</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
