import { motion } from "framer-motion";
import { fadeInView, fadeItem, staggerContainer } from "./homeMotion";
import { SectionDivider } from "@/components/marketing/SectionDivider";

const STEPS = [
  {
    number: "1",
    title: "Discover Your Brand.",
    body: "We uncover your positioning, audience, and competitive edge — so every message lands with clarity and purpose.",
  },
  {
    number: "2",
    title: "Define Your Journey",
    body: "From living brand profiles to campaign roadmaps, we map the path from where you are to where you want to be.",
  },
  {
    number: "3",
    title: "Real Marketing & Conversion Results",
    body: "Sales-driven campaigns, digital products, and content that convert — measured, refined, and scaled.",
  },
] as const;

export function HomeProcess() {
  return (
    <section id="what-to-expect" aria-labelledby="process-heading" className="landing-section bg-flux-neon text-flux-void">
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeInView}
        >
          <h2
            id="process-heading"
            className="max-w-4xl text-[clamp(1.75rem,4vw,3rem)] leading-[1.1] text-flux-void"
          >
            <span className="heading-accent text-flux-void">from </span>
            <span className="heading-monument normal-case">living brand profiles </span>
            <span className="heading-monument normal-case">to sales-driven </span>
            <span className="heading-accent text-flux-void">marketing results</span>
          </h2>

          <p className="mt-6 max-w-2xl text-sm font-medium leading-relaxed text-flux-void/75 md:text-base">
            A three-step system that takes you from brand discovery to measurable growth.
          </p>

          <SectionDivider className="my-12 md:my-16" variant="light" />
        </motion.div>

        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid gap-10 md:grid-cols-3 md:gap-0"
        >
          {STEPS.map((step, index) => (
            <motion.li
              key={step.number}
              variants={fadeItem}
              className={`px-0 md:px-8 ${index > 0 ? "md:border-l md:border-flux-void/20" : ""} ${index === 0 ? "md:pl-0" : ""}`}
            >
              <span className="heading-monument text-6xl text-flux-void/90 md:text-7xl">{step.number}</span>
              <h3 className="heading-monument mt-4 text-lg normal-case leading-tight md:text-xl">{step.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-flux-void/70 md:text-[15px]">{step.body}</p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
