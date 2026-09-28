import { useEffect } from "react";
import { useGsapLandingSections } from "../hooks/useGsapLandingSections";
import { HomeHero } from "../components/home/HomeHero";
import { HomeMission } from "../components/home/HomeService";
import { HomeProcess } from "../components/home/HomeProcess";
import { HomeFinalCta } from "../components/home/HomeFinalCta";
import { updateSeoMeta } from "@/lib/seo";

const Home = () => {
  useGsapLandingSections();

  useEffect(() => {
    updateSeoMeta({
      title: "FluxFom (FluxFomKE) | Got an idea? Let's make it make sense.",
      description:
        "FluxFom, also known as FluxFomKE, is a Nairobi brand strategy and growth studio helping brands build clear positioning, memorable identity, and real momentum.",
      pathname: "/",
    });
  }, []);

  return (
    <main className="bg-white">
      <HomeHero />
      <HomeMission />
      <HomeProcess />
      <HomeFinalCta />
    </main>
  );
};

export default Home;
