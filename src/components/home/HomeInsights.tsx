import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeInView, fadeItem, staggerContainer } from "./homeMotion";
import { ScrollNudge } from "@/components/marketing/ScrollNudge";
import { MarketingStoryImage } from "@/components/marketing/MarketingStoryImage";
import { HOME_INSIGHTS_EDGE_ALT, HOME_INSIGHTS_EDGE_IMAGE } from "@/lib/marketingImagery";

const INSIGHTS = [
  {
    tag: "African branding",
    title: "The new premium is culturally specific",
    dek: "Why Nairobi-rooted brands win when they stop borrowing generic global signals.",
    to: "/how-it-works",
  },
  {
    tag: "Perception psychology",
    title: "People remember what your brand repeats with discipline",
    dek: "Consistency across identity, content, motion, web, and campaign touchpoints builds market memory.",
    to: "/about",
  },
  {
    tag: "Growth systems",
    title: "Move beyond output into guided customer movement",
    dek: "The strongest brands connect identity, offers, audiences, content, and campaigns into one managed loop.",
    to: "/how-it-works",
  },
] as const;

export function HomeInsights() {
  return (
    <section id="home-insights" className="public-section border-t border-flux-sand bg-flux-sand/35" aria-labelledby="insights-heading">
      <div className="container mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block lg:col-span-4"
          >
            <MarketingStoryImage
              src={HOME_INSIGHTS_EDGE_IMAGE}
              alt={HOME_INSIGHTS_EDGE_ALT}
              aspectClassName="aspect-[3/4]"
              treatment="portrait"
              className="-rotate-1 translate-y-4"
              imgClassName="object-cover object-[center_15%]"
            />
            <p className="mt-4 text-xs leading-relaxed text-flux-editorial/74">
              Strategy notes for founders, marketers, and operators building African brands with global standards.
            </p>
          </motion.div>

          <div className="lg:col-span-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeInView}
              className="flex flex-col justify-between gap-8 md:flex-row md:items-end"
            >
              <div className="max-w-xl">
                <p className="public-kicker">Editorial insights</p>
                <h2 id="insights-heading" className="heading-editorial mt-4 text-4xl font-semibold leading-tight text-flux-editorial sm:text-5xl">
                  A premium magazine for better brand decisions.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-flux-editorial/78">
                Short perspectives on African branding, perception, startup positioning, growth systems, and modern marketing.
              </p>
            </motion.div>

            <div className="mt-10 lg:hidden">
              <MarketingStoryImage
                src={HOME_INSIGHTS_EDGE_IMAGE}
                alt={HOME_INSIGHTS_EDGE_ALT}
                aspectClassName="aspect-[16/11]"
                treatment="portrait"
                imgClassName="object-cover object-[center_18%]"
              />
            </div>

            <motion.ul
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={staggerContainer}
              className="mt-12 grid gap-6 md:grid-cols-3 lg:mt-14"
            >
              {INSIGHTS.map((item) => (
                <motion.li key={item.title} variants={fadeItem}>
                  <article className="group flex h-full flex-col rounded-[1.35rem] border border-flux-sand/90 bg-flux-ivory/60 p-6 transition duration-300 hover:-translate-y-1 hover:border-flux-green/35 hover:bg-flux-ivory">
                    <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-flux-clay">{item.tag}</p>
                    <h3 className="heading-editorial mt-5 text-2xl font-semibold leading-snug text-flux-editorial">{item.title}</h3>
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-flux-editorial/78">{item.dek}</p>
                    <Link
                      to={item.to}
                      className="mt-8 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-flux-editorial transition group-hover:text-flux-growth"
                    >
                      Read perspective
                      <span aria-hidden>→</span>
                    </Link>
                  </article>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
        <ScrollNudge targetId="home-final-cta" />
      </div>
    </section>
  );
}
