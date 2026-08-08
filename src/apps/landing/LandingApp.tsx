import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppProviders } from "@/apps/shared/AppProviders";
import Home from "@/pages/Home";
import HowItWorks from "@/pages/HowItWorks";
import Projects from "@/pages/Projects";
import About from "@/pages/About";
import Terms from "@/pages/Terms";
import StartYourBrand from "@/pages/StartYourBrand";
import AdminPublicProfiles from "@/pages/AdminPublicProfiles";
import AdminPublicProfileUpload from "@/pages/AdminPublicProfileUpload2";
import AdminPublicProfileEditor from "@/pages/AdminPublicProfileEditor";
import ClientProfile from "@/pages/ClientProfile";
import ProfileStatus from "@/pages/ProfileStatus";
import ResetPassword from "@/pages/ResetPassword";
import VerifyEmail from "@/pages/VerifyEmail";
import ProjectDraft from "@/pages/landing/portfolio/projectDraft/ProjectDraft";
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

          <Route path="/admin" element={<Navigate to="/admin/public-profiles" replace />} />
          <Route path="/admin/public-profiles" element={<AdminPublicProfiles />} />
          <Route path="/admin/public-profiles/upload" element={<AdminPublicProfileUpload />} />
          <Route path="/admin/public-profiles/editor" element={<AdminPublicProfileEditor />} />

          <Route path="/portfolio/projectDraft/:id" element={<ProjectDraft />} />

          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/start" element={<StartYourBrand />} />
          <Route path="/portfolio" element={<Navigate to="/projects" replace />} />
          <Route path="/work/:token" element={<Navigate to="/projects" replace />} />
          <Route path="/profile-status/:userId" element={<ProfileStatus />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/fom-core/*" element={<Navigate to="/" replace />} />
          <Route path="/flux-core/*" element={<Navigate to="/" replace />} />
          <Route path="*" element={<LandingNotFound />} />
        </Routes>
      </LandingLayout>
    </BrowserRouter>
  </AppProviders>
);

export default LandingApp;
