import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { updateSeoMeta } from "@/lib/seo";
import { fadeInView } from "@/components/home/homeMotion";

const AUDIENCES = {
  creatives: {
    eyebrow: "FOR CREATIVES",
    title: "Make your next release impossible to miss.",
    description:
      "From album launches and live events to a growing creative practice, we build campaigns that turn your work into a following and your following into momentum.",
    seoTitle: "Creative Campaigns & Artist Branding | FluxFom",
    seoDescription:
      "Build a stronger audience for your music, events, and creative work with brand strategy and campaigns made for creatives.",
    services: ["Release and event campaigns", "Artist brand identity", "Audience growth strategy"],
  },
  corporate: {
    eyebrow: "FOR BUSINESSES",
    title: "Build a business people choose and remember.",
    description:
      "Give your business the strategy, identity, and digital presence to stand apart, earn trust, and keep growing long after launch.",
    seoTitle: "Brand Strategy & Digital Growth for Business | FluxFom",
    seoDescription:
      "FluxFom helps businesses build a distinctive brand, strengthen their digital presence, and create long-term growth.",
    services: ["Brand positioning and identity", "Websites and digital presence", "Long-term growth campaigns"],
  },
  personal: {
    eyebrow: "PERSONAL BRANDING",
    title: "Turn what you know into a brand of your own.",
    description:
      "Build a personal brand that makes your expertise clear, brings your services to the right people, and gives your next move a strong foundation.",
    seoTitle: "Personal Branding for Independent Professionals | FluxFom",
    seoDescription:
      "Create a clear personal brand and online presence that helps independent professionals connect with the right audience.",
    services: ["Personal brand strategy", "Professional online presence", "Content and audience growth"],
  },
} as const;

type AudienceKey = keyof typeof AUDIENCES;

const customerTypeByAudience: Record<AudienceKey, "creative" | "business" | "personal"> = {
  creatives: "creative",
  corporate: "business",
  personal: "personal",
};

function getAudienceHeroBackground(audience: AudienceKey) {
  const imageByAudience: Record<AudienceKey, string> = {
    creatives: "/assets/images/creative-hero-bg.png",
    corporate: "/assets/images/corporate-hero-bg.png",
    personal: "/assets/images/personal-hero-bg.jpg",
  };

  return `linear-gradient(180deg, rgba(3, 18, 30, 0.62) 0%, rgba(3, 18, 30, 0.56) 48%, rgba(3, 18, 30, 0.82) 100%), url('${imageByAudience[audience]}')`;
}

export default function AudiencePage({ audience }: { audience: AudienceKey }) {
  const { pathname } = useLocation();
  const content = AUDIENCES[audience];

  useEffect(() => {
    updateSeoMeta({
      title: content.seoTitle,
      description: content.seoDescription,
      pathname,
    });
  }, [content, pathname]);

  return (
    <div>
      <section
        id="hero"
        data-gsap-section
        aria-labelledby="audience-hero-heading"
        className="relative overflow-hidden text-flux-void"
        style={{
          backgroundImage: getAudienceHeroBackground(audience),
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="mx-auto flex min-h-[620px] max-w-[1400px] flex-col justify-center px-5 pb-16 pt-20 sm:px-8 lg:min-h-[700px] lg:px-12 lg:pb-20">
          <div className="max-w-4xl">
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeInView}
              className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-[#C9FF6B]"
            >
              {content.eyebrow}
            </motion.p>
            <motion.h1
              id="audience-hero-heading"
              initial="hidden"
              animate="visible"
              variants={fadeInView}
              className="max-w-4xl font-monument text-5xl font-black leading-[0.98] text-white sm:text-6xl lg:text-7xl"
            >
              {content.title}
            </motion.h1>
            <motion.p
              initial="hidden"
              animate="visible"
              variants={{ ...fadeInView, visible: { ...fadeInView.visible, transition: { ...fadeInView.visible.transition, delay: 0.12 } } }}
              className="mt-7 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg"
            >
              {content.description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.24 }}
              className="mt-9 flex flex-col items-start gap-4 sm:flex-row"
            >
              <Link to={`/start?type=${customerTypeByAudience[audience]}`} className="btn-neon-solid inline-flex items-center gap-2 px-7 py-4 text-sm">
                Start a project <ArrowUpRight size={17} aria-hidden />
              </Link>
              <Link to="/contact" className="btn-neon-outline px-7 py-4 text-sm">
                Talk to a human
              </Link>
            </motion.div>
          </div>
          <div className="mt-14 grid gap-4 border-t border-white/25 pt-6 sm:grid-cols-3">
            {content.services.map((service) => (
              <p key={service} className="flex items-start gap-3 text-sm leading-relaxed text-white/90">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#C9FF6B]" aria-hidden />
                {service}
              </p>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#C9FF6B] px-5 py-16 text-[#10170a] sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-2xl font-monument text-3xl font-black leading-tight sm:text-4xl">
            Your next chapter deserves a brand that can keep up.
          </h2>
          <Link to="/contact" className="inline-flex w-fit items-center gap-2 border-b border-[#10170a] pb-2 text-sm font-semibold">
            Let’s talk about it <ArrowUpRight size={17} aria-hidden />
          </Link>
        </div>
      </section>
    </div>
  );
}