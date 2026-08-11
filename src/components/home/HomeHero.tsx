import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, Zap, Globe2, Layers, Package, Star } from "lucide-react";
import { fadeInView } from "./homeMotion";

const COMPANY_LOGOS = [
  { name: "Lumina", icon: Sparkles },
  { name: "Vortex", icon: Zap },
  { name: "Velocity", icon: Globe2 },
  { name: "Synergy", icon: Layers },
  { name: "Enigma", icon: Package },
  { name: "Spectrum", icon: Star },
];

export function HomeHero() {
  return (
    <section id="hero" aria-labelledby="home-hero-heading" className="bg-[#C9FF6B] text-flux-void">
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
              <span className="block text-[#0B2B12]">Got an idea? <br/>Let's make it make sense.</span>
              {/* <span className="block"><span>position </span> <br/> to win</span> */}
              {/* <span className="block">
                To <span className="heading-accent">Win</span>
              </span> */}
            </motion.h1>
          </motion.div>

          <motion.div
            className="flex flex-col space-y-6 items-start"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="text-sm font-bold w-full uppercase tracking-[0.24em] text-flux-editorial/70">Design | Video | Websites | Marketing</span>
            
            {/* <svg width="500" className="my-6" height="11" viewBox="0 0 636 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.6658 5.33398C10.6658 2.38847 8.27802 0.000650883 5.33252 0.000650883C2.38702 0.000650883 -0.000793457 2.38847 -0.000793457 5.33398C-0.000793457 8.2795 2.38702 10.6673 5.33252 10.6673C8.27802 10.6673 10.6658 8.2795 10.6658 5.33398ZM710.344 5.33398V4.33398L5.33252 4.33398V5.33398V6.33398L710.344 6.33398V5.33398Z" fill="#0B2B12" />
            </svg> */}

            <motion.p
              variants={fadeInView}
              className="max-w-xl text-base leading-relaxed text-flux-editorial/90 md:text-lg"
            >Whatever you're building, FluxFom helps turn the idea into something people can see, feel and remember.
            </motion.p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
              <Link to="/start" className="btn-neon-solid px-9 py-4 text-base">
              Start a project →
              </Link>
              <Link to="/contact" className="btn-neon-outline px-9 py-4 text-base">
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="mt-14">
          <div className="relative border-t border-flux-sand/50 overflow-hidden rounded-[2rem] border border-flux-sand bg-flux-sand/10 shadow-[0_40px_120px_-55px_rgba(5,16,5,0.18)]">
            <img
              src="/assets/images/hero-bg.png"
              alt="fluxfom-hero-bg"
              fetchPriority="high"
              decoding="async"
              className="h-[420px] w-full object-fit sm:h-[520px]"
            />
            <img
              src="/assets/images/hero-bg-face.png"
              alt="fluxfom-hero-face"
              fetchPriority="high"
              decoding="async"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain sm:h-[520px]"
            />
          </div>

          {/* <div className="my-4 space-y-4 border-t border-b border-flux-sand/50 py-4 text-sm text-flux-editorial/70">
            <div className="flex flex-col gap-3 mb-6 items-start justify-between">
              <p className="font-semibold uppercase tracking-[0.24em] text-flux-editorial/85">
                Companies we've worked with
              </p>
              <p className="max-w-xl text-xs uppercase text-flux-editorial/60 sm:text-right">
                Trusted partnerships with brand-led teams and fast-moving startups.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {COMPANY_LOGOS.map((company) => {
                const Icon = company.icon;
                return (
                  <div
                    key={company.name}
                    className="flex items-center gap-3 text-sm"
                  >
                    <div className="flex h-11 w-11 items-center justify-center text-flux-editorial/80">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <div>
                      <p className="font-semibold uppercase tracking-[0.18em] text-flux-editorial/90">{company.name}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}
