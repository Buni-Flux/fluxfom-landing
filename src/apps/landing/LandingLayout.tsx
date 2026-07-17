import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const LandingLayout = ({ children }: { children: ReactNode }) => (
  <div className="flux-landing-world flex min-h-screen flex-col">
    <Navbar />
    <main className="flex-1 pt-[72px]">{children}</main>
    <Footer />
  </div>
);
