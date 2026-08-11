import { useEffect } from "react";
import { useGsapLandingSections } from "../hooks/useGsapLandingSections";
import { HomeHero } from "../components/home/HomeHero";
import { HomeMission } from "../components/home/HomeService";
import { HomeProcess } from "../components/home/HomeProcess";
import { HomeFinalCta } from "../components/home/HomeFinalCta";

const Home = () => {
  useGsapLandingSections();

  useEffect(() => {
    document.title = "FluxFom — Discover your Brand Position to Win";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "FluxFom helps brands discover their position, define their journey, and deliver real marketing and conversion results.",
      );
    }
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
