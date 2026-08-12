import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppProviders } from "@/apps/shared/AppProviders";
import { LandingLayout } from "./LandingLayout";
import { LandingNotFound } from "./LandingNotFound";

const Home = lazy(() => import("@/pages/Home"));
const Services = lazy(() => import("@/pages/Services"));
const HowItWorks = lazy(() => import("@/pages/HowItWorks"));
const Projects = lazy(() => import("@/pages/Projects"));
const ClientProfile = lazy(() => import("@/pages/ClientProfile"));
const AdminPublicProfiles = lazy(() => import("@/pages/AdminPublicProfiles"));
const AdminPublicProfileUpload = lazy(() => import("@/pages/AdminPublicProfileUpload2"));
const AdminPublicProfileEditor = lazy(() => import("@/pages/AdminPublicProfileEditor"));
const ProjectDraft = lazy(() => import("@/pages/landing/portfolio/projectDraft/ProjectDraft"));
const About = lazy(() => import("@/pages/About"));
const Terms = lazy(() => import("@/pages/Terms"));
const Contact = lazy(() => import("@/pages/Contact"));
const StartYourBrand = lazy(() => import("@/pages/StartYourBrand"));
const ProfileStatus = lazy(() => import("@/pages/ProfileStatus"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const VerifyEmail = lazy(() => import("@/pages/VerifyEmail"));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-flux-void text-flux-void">
    <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-center text-sm text-white/90 shadow-xl shadow-black/20">
      Loading page…
    </div>
  </div>
);

const LandingApp = () => (
  <AppProviders>
    <BrowserRouter>
      <LandingLayout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
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
            <Route path="/contact" element={<Contact />} />
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
        </Suspense>
      </LandingLayout>
    </BrowserRouter>
  </AppProviders>
);

export default LandingApp;
