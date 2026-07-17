import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ProjectGridPreview } from "@/components/ProjectGridPreview";
import { MarketingStoryImage } from "@/components/marketing/MarketingStoryImage";
import { ScrollNudge } from "@/components/marketing/ScrollNudge";
import { PAGE_CREATIVE_WORKSPACE, PAGE_CREATIVE_WORKSPACE_ALT } from "@/lib/marketingImagery";
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
    <div className="min-h-full bg-flux-void text-white">
      <section className="landing-page-shell relative overflow-hidden border-b border-white/10 pb-14 pt-12 md:pb-20 md:pt-16">
        <div className="absolute -right-32 top-10 h-80 w-80 rounded-full bg-flux-neon/10 blur-3xl" aria-hidden />
        <div className="container relative mx-auto max-w-6xl px-5 sm:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <motion.div
              className="lg:col-span-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <p className="landing-page-kicker">Client work</p>
              <h1 className="heading-editorial mt-4 text-5xl font-semibold leading-[1.02] text-white sm:text-6xl md:text-7xl">
                Brands we have built end to end.
              </h1>
              <p className="landing-page-copy mt-6 max-w-xl">
                Each client opens a single profile — brand brief through launch templates — organized like a living brand
                book.
              </p>
            </motion.div>
            <motion.div
              className="lg:col-span-6"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.06 }}
            >
              <MarketingStoryImage
                src={PAGE_CREATIVE_WORKSPACE}
                alt={PAGE_CREATIVE_WORKSPACE_ALT}
                aspectClassName="aspect-[16/10] max-lg:aspect-[16/11]"
                treatment="portrait"
              />
            </motion.div>
          </div>
          <ScrollNudge targetId="clients-index" tone="dark" />
        </div>
      </section>

      <section id="clients-index" className="bg-flux-void py-16 md:py-24">
        <div className="container mx-auto max-w-6xl px-5 sm:px-6">
          {loading ? (
            <div className="py-16 text-center text-sm font-medium text-white/70">Loading clients...</div>
          ) : (
            <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
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
                      className={`group relative mb-5 overflow-hidden rounded-[1.45rem] border border-white/10 bg-white/[0.04] break-inside-avoid outline-none ring-flux-neon/40 transition duration-300 hover:-translate-y-1 hover:border-flux-neon/35 hover:bg-white/[0.06] hover:shadow-[0_24px_70px_-48px_rgba(0,0,0,0.75)] focus-visible:ring-2 ${
                        isDemo ? "opacity-80" : "cursor-pointer"
                      }`}
                    >
                      <div className="relative overflow-hidden">
                        {hasCardMedia ? (
                          <ProjectGridPreview
                            title={client.title}
                            previewImageUrl={client.preview_image_url}
                            imageUrl={client.image_url}
                            frameClassName={h}
                          />
                        ) : (
                          <div className={`flex w-full items-center justify-center bg-white/[0.06] ${h}`}>
                            <ImageIcon className="h-9 w-9 text-white/50" strokeWidth={1} aria-hidden />
                          </div>
                        )}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-flux-forest/70 via-transparent to-transparent" />
                        <div className="absolute left-4 top-4 rounded-full border border-white/30 bg-black/30 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-flux-neon backdrop-blur">
                          Client profile
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h2 className="heading-editorial text-2xl font-semibold leading-tight text-white">
                              {client.title}
                            </h2>
                            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-flux-neon/90">
                              {subtitle}
                            </p>
                          </div>
                          {!isDemo ? (
                            <span className="mt-1 rounded-full border border-white/10 bg-white/[0.06] p-2 text-flux-neon transition group-hover:bg-flux-neon/10 group-hover:text-flux-neon">
                              <ArrowUpRight className="h-4 w-4" aria-hidden />
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-white/70">
                          {summary || "Open the full brand book — brief, strategy, creative direction, identity, and launch templates."}
                        </p>
                        <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
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
