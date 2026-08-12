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
      title: "FluxFom | Got an idea? Let's make it make sense.",
      description:
        "FluxFom helps brands turn ideas into clear positioning, memorable identity, and real growth momentum — got an idea? Let's make it make sense.",
      pathname: "/",
    });
  }, []);

  return (
    <main className="bg-[#C9FF6B]">
      <HomeHero />
      <HomeMission />
      <HomeProcess />
      <HomeFinalCta />
    </main>
  );
};

export default Home;
