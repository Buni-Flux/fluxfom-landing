import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { fadeInView } from "./homeMotion";
import { NeonPlayFrame } from "@/components/marketing/NeonPlayFrame";
import { useState } from "react";

const SERVICES = [
  {
    id: 1,
    name:"Marketing Campaigns",
    src: "/assets/images/hero-bg-face.png",
  },
  {
    id: 2,
    name:"Brand Positioning",
    src: "/assets/images/hero-bg-face.png",
  },
  {
    id: 3,
    name:"Digital Products",
    src: "/assets/images/hero-bg-face.png",
  },
  {
    id: 4,
    name:"User Generated Content",
    src: "/assets/images/hero-bg-face.png",
  },
  {
    id: 5,
    name:"Marketing Results",
    src: "/assets/images/hero-bg-face.png",
  },
  {
    id: 6,
    name:"Brand ID's",
    src: "/assets/images/hero-bg-face.png",
  },
  {
    id: 7,
    name: "Music Videos",
    src:"/assets/images/hero-bg-face.png",
  }
];

export function HomeHero() {
const [isVideoVisible, setIsVideoVisible] = useState(false);
//what the player will play in usestate
//fuction to handle click video switching
function handleVideoClick(id: number) {
  setIsVideoVisible(true);
}


  return (
    <section
      id="hero"
      aria-labelledby="home-hero-heading"
      className="relative min-h-[calc(100dvh-72px)] overflow-hidden bg-flux-void"
    >
      {/* Background image */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <img
          src="/assets/images/hero-bg.png"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute left-1/2 top-1/2 h-[min(105vh,1020px)] w-auto max-w-none -translate-x-1/2 -translate-y-[48%] object-cover"
        />
      </div>
        <img
          src="/assets/images/hero-bg-face.png"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute left-1/2 top-1/2 h-[min(85vh,820px)] w-auto max-w-none -translate-x-1/2 -translate-y-[48%] object-contain"
        />

      {/* Overlays — keep text readable while image shows through center */}
      {/* <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-flux-void via-flux-void/55 to-flux-void/90"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,transparent_20%,rgba(5,16,5,0.55)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(162,255,0,0.1),transparent_65%)]"
        aria-hidden
      />
      <div className="flux-grain pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay" aria-hidden />

      <div className="relative z-10 mx-auto grid min-h-[calc(100dvh-72px)] max-w-[1400px] grid-cols-1 items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:gap-6 lg:px-12 lg:py-20"> */}
      <div className="relative z-10 mx-auto grid min-h-[calc(100dvh-72px)] max-w-[1400px] grid-cols-1 items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:gap-6 lg:px-12 lg:py-20">
        {/* Left — headline & CTAs */}
        <motion.div
          className="lg:col-span-5"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.h1
            id="home-hero-heading"
            variants={fadeInView}
            className="text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02] text-[#0B2B12]"
          >
            <span className="font-monument text-[1.02em] font-black normal-case">Discover Your</span>
            <span className="heading-accent text-[1.08em] text-[#0B2B12]">Brand </span>
            <span className="font-monument text-[1.02em] font-black normal-case">Position </span>
            <br />
            {/* <span className="font-monument font-normal normal-case">to</span> */}
            <span className="font-monument text-[1.02em] font-black normal-case">To</span>
            <span className="heading-accent text-[1.08em] text-[#0B2B12]">Win</span>
          </motion.h1>

          <motion.p
            variants={fadeInView}
            className="mt-6 max-w-sm text-sm leading-relaxed text-[#0B2B12] md:text-[15px]"
          >
            Communicate clearly with your audience without losing focus of your business focus.
          </motion.p>

          <motion.div variants={fadeInView} className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/start" className="btn-neon-outline gap-1">
              Get Started
              <ChevronRight size={16} strokeWidth={2} aria-hidden />
            </Link>
            <Link to="/how-it-works" className="btn-neon-solid">
              Find Out More
            </Link>
          </motion.div>
        </motion.div>

        {/* Right — services & video */}
        <motion.div
          className="hidden lg:flex h-full flex-col justify-between text-right lg:col-span-3 lg:col-start-10"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <ul className="space-y-3 lg:space-y-4">
            {SERVICES.map((service) => (
              <li key={service.id} className="flex items-center justify-end gap-2">
              <button
                key={service.id}
                onClick={() => handleVideoClick(service.id)}
                className="text-[10px] font-bold uppercase tracking-[0.22em] text-flux-neon sm:text-[11px]"
              >
                {service.name}
              </button>
              </li>
            ))}
          </ul>
          {/* video */}
          {isVideoVisible &&
           <div className="fixed bottom-6 right-6 z-50 w-full max-w-[320px] shadow-2xl transition-all duration-300">
            <NeonPlayFrame visible={false} size="lg" />
          </div>
          }
        </motion.div>
      </div>
    </section>
  );
}
