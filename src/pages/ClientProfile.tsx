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
      <div className="flex min-h-[50vh] items-center justify-center bg-[#FAF7F2]">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-[#A66A3F]/45 border-t-transparent"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center bg-[#FAF7F2] px-6 text-center">
        <h1 className="heading-editorial text-3xl font-semibold text-[#1B2B22]">Client not found</h1>
        <p className="mt-2 text-sm text-[#1B2B22]/70">This profile is not published or does not exist.</p>
        <Link
          to="/projects"
          className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7A4A2F] transition hover:text-[#1B2B22]"
        >
          <ArrowLeft size={14} aria-hidden /> Back to clients
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#E8DCC6]/35">
      <div className="container mx-auto max-w-6xl px-5 pb-20 pt-8 sm:px-6 md:pb-28">
        <Link
          to="/projects"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#D9C9AE] bg-[#FAF7F2]/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1B2B22]/76 transition hover:border-[#A66A3F]/45 hover:text-[#1B2B22]"
        >
          <ArrowLeft size={14} aria-hidden /> All clients
        </Link>

        <header className="mb-10 max-w-3xl">
          <p className="public-kicker">Client profile</p>
          <h1 className="heading-editorial mt-3 text-4xl font-semibold leading-tight text-[#1B2B22] sm:text-5xl md:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-4 text-sm font-medium uppercase tracking-[0.14em] text-[#1B2B22]/72">
            {profile.tagline} · {profile.location}
          </p>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#7A4A2F]">
            Timeline · {profile.timeline}
          </p>
        </header>

        <ClientProfileFolder profile={profile} />
      </div>
    </div>
  );
};

export default ClientProfile;
