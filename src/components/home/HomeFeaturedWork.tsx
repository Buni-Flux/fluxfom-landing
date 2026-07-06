import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Image as ImageIcon } from "lucide-react";
import { ProjectGridPreview } from "@/components/ProjectGridPreview";
import { clientCardSubtitle } from "@/lib/clientProfile";
import type { HomeProject } from "./types";
import { fadeInView, fadeItem, staggerContainer } from "./homeMotion";
import { ScrollNudge } from "@/components/marketing/ScrollNudge";

type Props = {
  projects: HomeProject[];
};

const stripHtml = (value: string | null) =>
  (value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export function HomeFeaturedWork({ projects }: Props) {
  return (
    <section id="home-featured-work" className="public-section border-t border-flux-sand bg-flux-ivory" aria-labelledby="work-heading">
      <div className="container mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeInView} className="max-w-xl">
            <p className="public-kicker">Featured clients</p>
            <h2 id="work-heading" className="heading-editorial mt-4 text-4xl font-semibold leading-tight text-flux-editorial sm:text-5xl">
              One profile per brand — from brief to launch.
            </h2>
            <p className="mt-5 text-flux-editorial/78">
              Explore full client brand books with strategy, creative direction, identity, applications, and launch
              templates in a single view.
            </p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInView} className="lg:pb-1">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-flux-clay/25 bg-white/45 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-flux-editorial transition hover:-translate-y-0.5 hover:border-flux-green/50 hover:bg-white/80"
            >
              View all clients
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </motion.div>
        </div>

        {projects.length === 0 ? (
          <p className="mt-16 text-center text-flux-cool-gray">Published client profiles will appear here.</p>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={staggerContainer}
            className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-12"
          >
            {projects.map((project, i) => {
              const hasMedia = !!(
                project.preview_image_url?.trim() ||
                project.preview_gif_url?.trim() ||
                project.image_url?.trim()
              );
              const subtitle = clientCardSubtitle({
                ...project,
                client_tagline: null,
              });
              const summary = stripHtml(project.description);
              const span = i % 5 === 0 ? "lg:col-span-7" : i % 5 === 1 ? "lg:col-span-5" : "lg:col-span-4";
              const frame = i % 5 === 0 ? "h-[min(64vh,500px)]" : "h-72 md:h-80";

              return (
                <motion.article key={project.id} variants={fadeItem} className={`group relative ${span}`}>
                  <Link
                    to={`/projects/${project.id}`}
                    className="block h-full overflow-hidden rounded-[1.6rem] border border-flux-sand bg-white/55 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-flux-green/35 hover:bg-white/85 hover:shadow-[0_24px_70px_-45px_rgba(27,43,34,0.42)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flux-green/40"
                  >
                    <div className="relative overflow-hidden">
                      {hasMedia ? (
                        <ProjectGridPreview
                          title={project.title}
                          previewImageUrl={project.preview_image_url}
                          previewGifUrl={project.preview_gif_url}
                          imageUrl={project.image_url}
                          frameClassName={`w-full ${frame}`}
                        />
                      ) : (
                        <div className={`flex w-full items-center justify-center bg-flux-sand/75 ${frame}`}>
                          <ImageIcon className="h-10 w-10 text-flux-clay/60" strokeWidth={1} aria-hidden />
                        </div>
                      )}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-flux-forest/74 via-flux-forest/8 to-transparent opacity-90 transition duration-500 group-hover:opacity-75" />
                      <div className="absolute left-5 top-5 rounded-full border border-white/50 bg-flux-ivory/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-flux-clay backdrop-blur">
                        Client profile
                      </div>
                    </div>
                    <div className="p-6 md:p-7">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="heading-editorial text-2xl font-semibold leading-tight text-flux-editorial md:text-3xl">
                            {project.title}
                          </h3>
                          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-flux-clay">
                            {subtitle}
                          </p>
                        </div>
                        <span className="mt-1 rounded-full border border-flux-sand bg-flux-ivory p-2 text-flux-clay transition group-hover:bg-flux-forest group-hover:text-flux-ivory">
                          <ArrowUpRight className="h-4 w-4" aria-hidden />
                        </span>
                      </div>
                      <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-flux-editorial/78">
                        {summary ||
                          "Brand brief, strategy, creative direction, logo suite, colors & fonts, applications, and launch templates."}
                      </p>
                      <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-flux-editorial/50">
                        7 sections · Open brand book
                      </p>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </motion.div>
        )}

        {projects.length > 0 ? (
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInView} className="mt-10 flex justify-center">
            <Link
              to="/projects"
              className="rounded-full bg-flux-green px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5 hover:bg-[#24932E]"
            >
              Browse all client profiles
            </Link>
          </motion.div>
        ) : null}
        <ScrollNudge targetId="home-services" />
      </div>
    </section>
  );
}
