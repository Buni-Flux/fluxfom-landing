import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLocation } from "react-router-dom";

export const LandingLayout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";

  return (
    <div className="flux-landing-world flex min-h-screen flex-col">
      <Navbar />
      <main className={isHomePage ? "flex-1" : "flex-1 pt-[72px]"}>{children}</main>
      <Footer />
    </div>
  );
};
