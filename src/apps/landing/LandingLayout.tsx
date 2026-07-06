import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const LandingLayout = ({ children }: { children: ReactNode }) => (
  <div className="public-editorial-world flex min-h-screen flex-col text-flux-editorial">
    <Navbar />
    <main className="flex-1 pt-20">{children}</main>
    <Footer />
  </div>
);
