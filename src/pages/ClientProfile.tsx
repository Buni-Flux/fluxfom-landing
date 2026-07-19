import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ClientProfileFolder } from "@/components/client-profile/ClientProfileFolder";
import { buildClientProfile } from "@/lib/clientProfile";
import type { ClientWorkRow } from "@/types/clientProfile";

const ClientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<ReturnType<typeof buildClientProfile> | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("cms_projects")
        .select("*")
        .eq("id", id!)
        .eq("published", true)
        .maybeSingle();

      if (!data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const resolved = buildClientProfile(data as ClientWorkRow);
      setProfile(resolved);
      document.title = `${resolved.name} — FluxFom Work`;
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-flux-void">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-flux-neon/45 border-t-transparent" aria-label="Loading" />
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center bg-flux-void px-6 text-center">
        <h1 className="heading-editorial text-3xl font-semibold text-white">Client not found</h1>
        <p className="mt-2 text-sm text-white/70">This profile is not published or does not exist.</p>
        <Link
          to="/projects"
          className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-flux-neon transition hover:text-white"
        >
          <ArrowLeft size={14} aria-hidden /> Back to clients
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-flux-void text-white">
      <div className="container mx-auto max-w-6xl px-5 pb-20 pt-8 sm:px-6 md:pb-28">
        <Link
          to="/projects"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 transition hover:border-flux-neon/40 hover:text-white"
        >
          <ArrowLeft size={14} aria-hidden /> All clients
        </Link>

        <header className="mb-10 max-w-3xl">
          <p className="landing-page-kicker">Client profile</p>
          <h1 className="heading-editorial mt-3 text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-4 text-sm font-medium uppercase tracking-[0.14em] text-white/70">
            {profile.tagline} · {profile.location}
          </p>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.22em] text-flux-neon">
            Timeline · {profile.timeline}
          </p>
        </header>

        <ClientProfileFolder profile={profile} />
      </div>
    </div>
  );
};

export default ClientProfile;
