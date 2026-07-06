import { motion } from "framer-motion";
import { fadeInView, fadeItem, staggerContainer } from "./homeMotion";
import { ScrollNudge } from "@/components/marketing/ScrollNudge";
import { HOME_TRUST_IMAGE, HOME_TRUST_IMAGE_ALT } from "@/lib/marketingImagery";

const MARKETING_SCOPE = [
  "Brand identity",
  "Content systems",
  "Motion design",
  "Digital assets",
  "Campaign rollouts",
  "Audience growth",
  "Market entry",
  "Marketing overview",
] as const;

const PRINCIPLES = [
  { value: "01", label: "Establish a brand identity people can understand and remember." },
  { value: "02", label: "Produce the creative, motion, digital, and campaign assets the market needs to see." },
  { value: "03", label: "Manage the path from first impression to customer adoption with a living Flux profile." },
] as const;

export function HomeTrust() {
  return (
    <section id="home-after-hero" className="public-section border-y border-flux-sand bg-flux-ivory" aria-labelledby="trust-heading">
      <div className="container mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-14">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeInView} className="lg:col-span-6">
            <p className="public-kicker">Full-service marketing management</p>
            <h2 id="trust-heading" className="heading-editorial mt-4 text-4xl font-semibold leading-tight text-flux-editorial sm:text-5xl">
              Branding is one wing. Marketing growth is the full mission.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-flux-editorial/80">
              FluxFom manages the brand journey from identity and positioning to creative production, launch execution,
              customer engagement, and market penetration. Branded materials still matter, but they serve the wider
              marketing system.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65 }}
            className="lg:col-span-6"
          >
            <figure className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-flux-sand shadow-[0_30px_90px_-45px_rgba(27,43,34,0.45)]">
              <div className="relative aspect-[16/11]">
                <img
                  src={HOME_TRUST_IMAGE}
                  alt={HOME_TRUST_IMAGE_ALT}
                  width={1800}
                  height={1200}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-center saturate-[0.9]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-flux-forest/55 via-transparent to-flux-ivory/10" aria-hidden />
                <div className="flux-grain absolute inset-0 opacity-30 mix-blend-overlay" aria-hidden />
              </div>
              <figcaption className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/40 bg-flux-ivory/92 p-4 backdrop-blur">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-flux-clay">Profile to execution</p>
                <p className="mt-2 text-sm font-medium leading-relaxed text-flux-editorial">
                  Your Flux profile becomes the marketing overview we use to plan, produce, launch, and improve the brand.
                </p>
              </figcaption>
            </figure>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {MARKETING_SCOPE.map((name) => (
            <motion.div
              key={name}
              variants={fadeItem}
              className="flex min-h-24 items-end rounded-[1.35rem] border border-flux-sand bg-white/55 p-5 text-sm font-semibold text-flux-editorial shadow-sm transition duration-300 hover:-translate-y-1 hover:border-flux-green/35 hover:bg-white/80"
            >
              {name}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="mt-12 grid gap-6 border-t border-flux-sand pt-10 md:grid-cols-3"
        >
          {PRINCIPLES.map((m) => (
            <motion.div key={m.label} variants={fadeItem}>
              <p className="heading-editorial text-4xl font-semibold text-flux-gold md:text-5xl">{m.value}</p>
              <p className="mt-3 max-w-xs text-sm font-medium leading-relaxed text-flux-editorial/78">{m.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <ScrollNudge targetId="home-transformation" />
      </div>
    </section>
  );
}
