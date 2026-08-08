import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ProjectGridPreview } from "@/components/ProjectGridPreview";
import { clientCardSubtitle } from "@/lib/clientProfile";
import type { ClientWorkRow } from "@/types/clientProfile";

const fallbackClients: ClientWorkRow[] = [
  {
    id: "demo-1",
    title: "Meridian",
    category: "Fintech",
    client_tagline: "Digital banking for growth markets",
    description: "A full identity system built to earn trust at first touch and scale across product surfaces.",
    image_url: null,
  },
  {
    id: "demo-2",
    title: "Solace",
    category: "Wellness",
    client_tagline: "Holistic wellness studio",
    description: "Campaign-ready brand language and visual rhythm for a premium wellness experience.",
    image_url: null,
  },
  {
    id: "demo-3",
    title: "Nova",
    category: "Consumer electronics",
    client_tagline: "Product launch ecosystem",
    description: "Launch identity, motion, and templates designed for a high-velocity product drop.",
    image_url: null,
  },
  {
    id: "demo-4",
    title: "Aethon",
    category: "Enterprise SaaS",
    client_tagline: "Strategic rebrand",
    description: "Enterprise rebrand translating complex capability into a clear, memorable market position.",
    image_url: null,
  },
];

const heights = ["h-[28rem]", "h-80", "h-96", "h-72", "h-[30rem]", "h-80"];
const projectCardBackgrounds = [
  "bg-[#ffe8d2]",
  "bg-[#e9dbff]",
  "bg-[#fbffcd]",
  "bg-[#d9efff]",
  "bg-[#ffd7ff]",
  "bg-[#d3f9d8]",
];

const stripHtml = (value: string | null) =>
  (value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const Projects = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<ClientWorkRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Work — FluxFom";
    const meta = document.querySelector('meta[name="description"]');
    meta?.setAttribute(
      "content",
      "Explore FluxFom client brand profiles — strategy, creative direction, identity systems, and launch templates.",
    );

    supabase
      .from("cms_projects")
      .select("*")
      .eq("published", true)
      .order("display_order")
      .then(({ data }) => {
        setClients(data && data.length > 0 ? (data as ClientWorkRow[]) : fallbackClients);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-full bg-white text-flux-void">
      <section className="relative overflow-hidden border-b border-flux-sand/70 bg-white pb-14 pt-12 md:pb-20 md:pt-16">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-8">
          <div className="grid gap-12 xl:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)] xl:items-start">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <div className="max-w-3xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-flux-clay">/Portfolio/</p>
                <h1 className="mt-4 text-[clamp(3rem,5vw,5.25rem)] font-monument font-black leading-[0.92] tracking-tight text-flux-void">
                  Work that connects strategy to launch.
                </h1>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-flux-editorial/90 md:text-lg">
                  Explore a collection of brand systems, launch experiences, and growth narratives shaped for ambitious teams.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.06 }}
            >
              <div className="rounded-[2rem] border border-flux-sand/70 bg-flux-ivory/90 p-10 shadow-[0_30px_80px_-50px_rgba(15,23,16,0.18)]">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-flux-editorial/70">/Featured case study/</p>
                <h2 className="mt-6 text-2xl font-semibold leading-tight text-flux-void">
                  Finova Banking Platform
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-flux-editorial/90">
                  A modern fintech platform designed to simplify digital banking with intuitive user experiences.
                </p>
                <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-flux-green/20 bg-white/70 px-4 py-2 text-sm font-semibold text-flux-green">
                  <span className="h-2.5 w-2.5 rounded-full bg-flux-green" />
                  Brand strategy · Identity · Launch system
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="clients-index" className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-8">
          {loading ? (
            <div className="py-16 text-center text-sm font-medium text-flux-editorial/70">Loading clients...</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {clients.map((client, i) => {
                  const h = heights[i % heights.length];
                  const hasCardMedia = !!(client.preview_image_url?.trim() || client.image_url?.trim());
                  const subtitle = clientCardSubtitle(client);
                  const summary = stripHtml(client.description);
                  const isDemo = client.id.startsWith("demo-");

                  return (
                    <motion.article
                      key={client.id}
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.28 }}
                      onClick={() => {
                        if (!isDemo) navigate(`/projects/${client.id}`);
                      }}
                      onKeyDown={(e) => {
                        if (isDemo) return;
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          navigate(`/projects/${client.id}`);
                        }
                      }}
                      role={isDemo ? undefined : "button"}
                      tabIndex={isDemo ? undefined : 0}
                      className={`${projectCardBackgrounds[i % projectCardBackgrounds.length]} group relative flex flex-col overflow-hidden rounded-[2rem] border border-flux-sand/70 outline-none shadow-[0_25px_65px_-35px_rgba(15,23,16,0.25)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_35px_95px_-45px_rgba(15,23,16,0.28)] focus-visible:ring-2 focus-visible:ring-flux-green/20 ${
                        isDemo ? "opacity-80" : "cursor-pointer"
                      }`}
                    >
                      <div className="relative overflow-hidden rounded-t-[2rem]">
                        {hasCardMedia ? (
                          <ProjectGridPreview
                            title={client.title}
                            previewImageUrl={client.preview_image_url}
                            imageUrl={client.image_url}
                            frameClassName={h}
                          />
                        ) : (
                          <div className={`flex w-full items-center justify-center bg-white/[0.55] ${h}`}>
                            <ImageIcon className="h-9 w-9 text-flux-editorial/45" strokeWidth={1} aria-hidden />
                          </div>
                        )}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                        <div className="absolute left-4 top-4 rounded-full border border-flux-void/10 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-flux-editorial/80 backdrop-blur">
                          Client profile
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h2 className="text-2xl font-semibold leading-tight text-flux-void">
                              {client.title}
                            </h2>
                            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-flux-editorial/65">
                              {subtitle}
                            </p>
                          </div>
                          {!isDemo ? (
                            <span className="mt-1 rounded-full border border-flux-void/10 bg-white/70 p-2 text-flux-void transition group-hover:bg-white/90">
                              <ArrowUpRight className="h-4 w-4" aria-hidden />
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-flux-editorial/85">
                          {summary || "Open the full brand book — brief, strategy, creative direction, identity, and launch templates."}
                        </p>
                        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-flux-editorial/50">
                          7 sections · Brand brief to launch
                        </p>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects;
