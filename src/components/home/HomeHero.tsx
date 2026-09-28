import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Palette, ShieldCheck, FingerprintIcon, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { fadeInView } from "./homeMotion";

const HERO_STATS = [
  {
    label: "For Personal Brands",
    description: "Build your personal brand or promote your services with a strong online presence that connects you to the right audience.",
    to: "/personal",
    icon: FingerprintIcon,
  },
  {
    label: "For Creatives",
    description: "Are you planning an Album Launch, Event, or a Tour? We help you plan and execute successful campaigns that engage your audience and drive results based on your current market position.",
    to: "/creatives",
    icon: Palette,
  },
  {
    label: "For Businesses",
    description: "Websites and Digital presence are both crucial towards meeting your goals. Build your product, we'll think about your brand long term",
    to: "/corporate",
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
          "linear-gradient(180deg, rgba(3, 18, 30, 0.55) 0%, rgba(3, 18, 30, 0.55) 25%, rgba(3, 18, 30, 0.55) 30%), url('/assets/images/hero-bg.jpg')",
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
              className="text-[clamp(3rem,5vw,5.25rem)] font-monument font-black leading-[0.92] tracking-tight md:mt-32 text-flux-void"
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

        <div className="mt-14 w-full">
          <div className="mx-auto flex flex-col items-center justify-between gap-6 rounded-[1.5rem] text-white sm:px-8 lg:ml-0 lg:mr-auto lg:flex-row">
            <div className="grid w-full gap-2 sm:grid-cols-3 lg:w-auto lg:grid-cols-3">
              {HERO_STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <a
                    key={stat.label}
                    href={stat.to} 
                    title={stat.description}
                    className="group relative rounded-lg p-2 -m-2 focus-visible:outline-none lg:h-[72px] lg:w-[176px]"
                  >
                  <div className="flex h-full items-start gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-2 shadow-xl backdrop-blur-md">
                    <Icon className="mt-1 h-6 w-6 shrink-0 text-[#C9FF6B]" aria-hidden />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                        {stat.label}
                      </p>
                      <p className="pointer-events-none absolute left-2 top-full z-20 mt-2 w-64 rounded-md border border-white/20 bg-[#15232b] px-3 py-2 text-left text-[11px] leading-relaxed text-white/90 opacity-0 shadow-xl transition-opacity duration-200 group-focus-visible:opacity-100 group-hover:opacity-100">
                        {stat.description}
                      </p>
                    </div>
                  </div>
              </a>
                );
              })}
            </div>
            <div className="flex shrink-0 items-center gap-2 border-t border-white/20 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0" aria-label="Social links">
              <a href="https://instagram.com/fluxfom" aria-label="Instagram" className="rounded-full border border-white/20 bg-white/10 p-2 transition hover:bg-white/20"><Instagram className="h-3.5 w-3.5" aria-hidden /></a>
              <a href="https://x.com/fluxfomke" aria-label="Twitter" className="rounded-full border border-white/20 bg-white/10 p-2 transition hover:bg-white/20"><Twitter className="h-3.5 w-3.5" aria-hidden /></a>
              <a href="https://linkedin.com/company/fluxfom" aria-label="LinkedIn" className="rounded-full border border-white/20 bg-white/10 p-2 transition hover:bg-white/20"><Linkedin className="h-3.5 w-3.5" aria-hidden /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
