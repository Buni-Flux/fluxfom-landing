import { useEffect } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeInView, fadeItem, staggerContainer } from "@/components/home/homeMotion";
import { SectionDivider } from "@/components/marketing/SectionDivider";
import { updateSeoMeta } from "@/lib/seo";

const POSITIONING_OUTCOMES = [
  {
    number: "01",
    title: "Be easier to choose.",
    description:
      "People quickly understand what you do, who it is for, and why your offer belongs on their shortlist.",
  },
  {
    number: "02",
    title: "Earn trust sooner.",
    description:
      "A consistent promise across your brand and customer experience makes the decision feel less uncertain.",
  },
  {
    number: "03",
    title: "Focus your effort.",
    description:
      "Your team can make clearer calls about what to say, what to build, and where marketing should show up.",
  },
];

const BRAND_SEQUENCE = [
  {
    number: "01",
    title: "Positioning",
    description: "Choose the space you want to own in your customer's mind.",
  },
  {
    number: "02",
    title: "Identity",
    description: "Give that choice a distinctive, recognizable expression.",
  },
  {
    number: "03",
    title: "Messaging",
    description: "Tell a clear, consistent story wherever people meet you.",
  },
  {
    number: "04",
    title: "Marketing & growth",
    description: "Turn that clarity into relevant campaigns and lasting momentum.",
  },
];

const BrandPositioning = () => {
  useEffect(() => {
    updateSeoMeta({
      title: "Brand Positioning | FluxFom",
      description:
        "See how clear brand positioning helps customers choose you, builds trust, and gives your business a sharper direction for identity, messaging, and growth.",
      pathname: "/brand-positioning",
    });
  }, []);

  return (
    <div className="bg-white text-flux-void">
      <section
        id="hero"
        aria-labelledby="positioning-hero-heading"
        className="relative flex min-h-[calc(100svh-72px)] items-center overflow-hidden text-center"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(3, 18, 30, 0.62), rgba(3, 18, 30, 0.74)), url('/assets/images/hero-bg.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="mx-auto w-full max-w-[1400px] px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto flex max-w-5xl flex-col items-center">
            <motion.p
              className="eyebrow-label"
            >
              The decision behind every brand decision
            </motion.p>
            <motion.h1
              id="positioning-hero-heading"
              className="mt-6 text-[clamp(2.75rem,6vw,6rem)] font-monument font-black leading-[0.92] tracking-tight text-white"
            >
              Be clear before
              <span className="block text-[#AAED36]">you get louder.</span>
            </motion.h1>
            <motion.p
              className="mt-7 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg"
            >
              Positioning gives people a reason to choose your brand, and gives your business a direction worth building around.
            </motion.p>
            <motion.div
              className="mt-9 flex flex-col items-center gap-4 sm:flex-row"
            >
              <Link to="/start" className="btn-neon-solid gap-3 px-6 py-3.5">
                Find your position
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-flux-void text-white">
                  <ArrowUpRight size={14} strokeWidth={2.5} aria-hidden="true" />
                </span>
              </Link>
              <a href="#why-positioning" className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-white/85 transition hover:text-flux-neon">
                Why it comes first
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="why-positioning" aria-labelledby="positioning-outcomes-heading" className="landing-section bg-white">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <motion.div
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInView}
          >
            <p className="eyebrow-label text-flux-void">Why positioning matters</p>
            <h2 id="positioning-outcomes-heading" className="heading-monument mt-5 text-[clamp(2.1rem,4vw,4.2rem)] text-flux-void">
              Clarity changes how people choose you.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-flux-void/70">
              In a crowded market, being good is not always enough. Customers need to recognize that you are right for them, understand why, and feel confident taking the next step.
            </p>
          </motion.div>

          <motion.ol
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
            className="divide-y divide-flux-void/15 border-y border-flux-void/15"
          >
            {POSITIONING_OUTCOMES.map((outcome) => (
              <motion.li key={outcome.number} variants={fadeItem} className="grid gap-3 py-6 sm:grid-cols-[3.5rem_1fr] sm:gap-5 md:py-7">
                <span className="font-monument text-sm font-bold text-flux-growth">{outcome.number}</span>
                <div>
                  <h3 className="heading-monument text-lg text-flux-void md:text-xl">{outcome.title}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-flux-void/70 md:text-[15px]">{outcome.description}</p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>

      <section aria-labelledby="positioning-contrast-heading" className="landing-section bg-flux-neon text-flux-void">
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInView}
          >
            <p className="eyebrow-label text-flux-void">The cost of skipping the first question</p>
            <h2 id="positioning-contrast-heading" className="heading-monument mt-5 max-w-4xl text-[clamp(2.1rem,4vw,4.2rem)] text-flux-void">
              A beautiful brand can still be hard to choose.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-flux-void/75">
              Design can earn attention. Positioning makes that attention mean something to the right people.
            </p>
          </motion.div>

          <div className="mt-12 grid border-y border-flux-void/25 md:grid-cols-2">
            <motion.div
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeInView}
              className="py-7 md:py-9 md:pr-12"
            >
              <h3 className="heading-monument text-xl text-flux-void">Without clear positioning</h3>
              <ul className="mt-6 space-y-4 text-sm leading-relaxed text-flux-void/75 md:text-base">
                <li>Every campaign has to explain the business from scratch.</li>
                <li>Your message shifts to follow competitors or trends.</li>
                <li>Customers struggle to see why you are the right fit.</li>
              </ul>
            </motion.div>
            <motion.div
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeInView}
              className="border-t border-flux-void/25 py-7 md:border-l md:border-t-0 md:py-9 md:pl-12"
            >
              <h3 className="heading-monument text-xl text-flux-void">With a clear position</h3>
              <ul className="mt-6 space-y-4 text-sm leading-relaxed text-flux-void/85 md:text-base">
                <li>Your value is recognizable across every touchpoint.</li>
                <li>Your team has a shared filter for what to make and say.</li>
                <li>Marketing speaks to the people most likely to care.</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section aria-labelledby="positioning-sequence-heading" className="landing-section bg-flux-void text-white">
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInView}
            className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20"
          >
            <div>
              <p className="eyebrow-label">Why we put it at the forefront</p>
              <h2 id="positioning-sequence-heading" className="heading-monument mt-5 text-[clamp(2.1rem,4vw,4rem)] text-white">
                The foundation sets the direction.
              </h2>
            </div>
            <div>
              <p className="max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
                A logo, website, or campaign can look polished and still pull in the wrong direction. We start with positioning so every layer that follows is expressing the same meaningful choice.
              </p>
              <SectionDivider className="my-8" />
              <ol className="grid gap-0 sm:grid-cols-2">
                {BRAND_SEQUENCE.map((step, index) => (
                  <li key={step.number} className={`border-t border-white/15 py-5 sm:pr-6 ${index % 2 === 1 ? "sm:border-l sm:pl-6 sm:pr-0" : ""}`}>
                    <span className="font-monument text-xs font-bold text-flux-neon">{step.number}</span>
                    <h3 className="heading-monument mt-3 text-lg text-white">{step.title}</h3>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        </div>
      </section>

      <section aria-labelledby="positioning-cta-heading" className="landing-section border-t border-white/10 bg-[#07130b]">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <motion.div
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInView}
            className="max-w-3xl"
          >
            <p className="eyebrow-label">Start with the right question</p>
            <h2 id="positioning-cta-heading" className="heading-monument mt-5 text-[clamp(2.2rem,4.5vw,4.5rem)] text-white">
              What should your brand be known for?
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65">
              We help you find the answer, make it clear, and build the brand and marketing around it.
            </p>
          </motion.div>
          <Link to="/start" className="btn-neon-solid shrink-0 gap-3 px-6 py-3.5">
            Start your brand
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BrandPositioning;