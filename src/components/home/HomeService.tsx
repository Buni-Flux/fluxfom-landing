import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BarChart3, Clapperboard, Film, Globe2, Megaphone, Monitor, Palette, Rocket, Search, Sparkles, TrendingUp } from "lucide-react";
import { ThreeDLayeredServiceCard } from "./ThreeDLayeredServiceCard";
import { fadeInView } from "./homeMotion";

const SERVICE_CARDS = [
  {
    id: 1,
    label: "(01)",
    title: "Social & \nContent Strategy.",
    category: "CONTENT & STRATEGY",
    description: "Build a voice people remember.",
    icon: Megaphone,
    visualIcon: Palette,
    glow: "rgba(255, 153, 40, 0.5)",
    glowGradient: "#ffd164",
  },
  {
    id: 2,
    label: "(02)",
    title: "Web & Digital",
    category: "WEB & DIGITAL",
    description: "Turn digital experiences into momentum.",
    icon: Globe2,
    visualIcon: Monitor,
    glow: "rgba(68, 148, 247, 0.48)",
    glowGradient: "#9ad4ff",
  },
  {
    id: 3,
    label: "(03)",
    title: "Video, Animation\n& Motion Design.",
    category: "VIDEO & MOTION",
    description: "Make the story impossible to scroll past.",
    icon: Clapperboard,
    visualIcon: Film,
    glow: "rgba(245, 69, 106, 0.48)",
    glowGradient: "#ff9ba8",
  },
  {
    id: 4,
    label: "(04)",
    title: "Brand Marketing\n& Growth.",
    category: "BRAND & GROWTH",
    description: "Build a brand that keeps moving forward.",
    icon: BarChart3,
    visualIcon: TrendingUp,
    glow: "rgba(53, 189, 223, 0.48)",
    glowGradient: "#93edff",
  },
  {
    id: 5,
    label: "(05)",
    title: "Market Research\n& Intelligence.",
    category: "RESEARCH & INTELLIGENCE",
    description: "Find the signal in a crowded market.",
    icon: Search,
    visualIcon: Sparkles,
    glow: "rgba(60, 204, 119, 0.46)",
    glowGradient: "#9df5bb",
  },
  {
    id: 6,
    label: "(06)",
    title: "Launches &\nCustom Projects.",
    category: "LAUNCHES & SPECIAL PROJECTS",
    description: "Make the next big move with confidence.",
    icon: Rocket,
    visualIcon: Sparkles,
    glow: "rgba(140, 174, 205, 0.45)",
    glowGradient: "#c4e2ff",
  },
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
            <div className="grid justify-items-stretch gap-[2px] px-1 py-4 sm:grid-cols-2 md:grid-cols-3">
              {SERVICE_CARDS.map((card) => <ThreeDLayeredServiceCard key={card.id} service={card} />)}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
