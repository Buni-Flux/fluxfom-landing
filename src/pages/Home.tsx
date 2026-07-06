import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { HomeHero } from "../components/home/HomeHero";
import { HomeTrust } from "../components/home/HomeTrust";
import { HomeServices } from "../components/home/HomeServices";
import { HomeTransformation } from "../components/home/HomeTransformation";
import { HomeFeaturedWork } from "../components/home/HomeFeaturedWork";
import { HomeProcess } from "../components/home/HomeProcess";
import { HomeInsights } from "../components/home/HomeInsights";
import { HomeFinalCta } from "../components/home/HomeFinalCta";
import type { HomeProject } from "../components/home/types";

const Home = () => {
  const [projects, setProjects] = useState<HomeProject[]>([]);

  useEffect(() => {
    document.title = "FluxFom — End-to-end brand marketing management | Nairobi";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "FluxFom manages brand marketing from identity and creative production to campaigns, market penetration, and a living marketing overview through your Flux profile.",
      );
    }
  }, []);

  useEffect(() => {
    supabase
      .from("cms_projects")
      .select("id, title, category, description, image_url, video_url, preview_image_url, preview_gif_url")
      .eq("published", true)
      .order("display_order")
      .then(({ data }) => {
        if (data) setProjects(data);
      });
  }, []);

  return (
    <>
      <HomeHero />
      <HomeTrust />
      <HomeTransformation />
      <HomeProcess />
      <HomeFeaturedWork projects={projects} />
      <HomeServices />
      <HomeInsights />
      <HomeFinalCta />
    </>
  );
};

export default Home;
