import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppProviders } from "@/apps/shared/AppProviders";
import Home from "@/pages/Home";
import HowItWorks from "@/pages/HowItWorks";
import Projects from "@/pages/Projects";
import About from "@/pages/About";
import Terms from "@/pages/Terms";
import StartYourBrand from "@/pages/StartYourBrand";
import ClientProfile from "@/pages/ClientProfile";
import ResetPassword from "@/pages/ResetPassword";
import { LandingLayout } from "./LandingLayout";
import { LandingNotFound } from "./LandingNotFound";

const LandingApp = () => (
  <AppProviders>
    <BrowserRouter>
      <LandingLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ClientProfile />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/start" element={<StartYourBrand />} />
          <Route path="/work/:token" element={<Navigate to="/projects" replace />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/fom-core/*" element={<Navigate to="/" replace />} />
          <Route path="/flux-core/*" element={<Navigate to="/" replace />} />
          <Route path="*" element={<LandingNotFound />} />
        </Routes>
      </LandingLayout>
    </BrowserRouter>
  </AppProviders>
);

export default LandingApp;
