import { useEffect } from "react";
import { HomeHero } from "../components/home/HomeHero";
import { HomeMission } from "../components/home/HomeMission";
import { HomeProcess } from "../components/home/HomeProcess";
import { HomeFinalCta } from "../components/home/HomeFinalCta";

const Home = () => {
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
    <>
      <HomeHero />
      <HomeMission />
      <HomeProcess />
      <HomeFinalCta />
    </>
  );
};

export default Home;
