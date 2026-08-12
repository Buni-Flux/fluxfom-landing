import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronRight } from "lucide-react";
import { SERVICES } from "@/lib/services";
import { updateSeoMeta } from "@/lib/seo";

const serviceBackgrounds = [
  "bg-[#ffe8d2]",
  "bg-[#e9dbff]",
  "bg-[#fbffcd]",
  "bg-[#d9efff]",
  "bg-[#ffd7ff]",
  "bg-[#d3f9d8]",
  "bg-[#f6f4ff]",
];

const filterServices = (query: string) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return SERVICES;

  return SERVICES.filter((service) =>
    [service.title, service.description].some((value) => value.toLowerCase().includes(normalized)),
  );
};

const Services = () => {
  const [query, setQuery] = useState("");
  const filteredServices = useMemo(() => filterServices(query), [query]);

  useEffect(() => {
    updateSeoMeta({
      title: "Services | FluxFom - Brand Strategy, Creative & Growth",
      description:
        "Explore FluxFom services for brand strategy, creative production, campaign planning, digital growth, and market positioning for ambitious businesses.",
      pathname: "/services",
    });
  }, []);

  return (
    <section className="landing-section bg-white text-flux-void">
      <div className="mx-auto max-w-[1400px] px-5 py-0 sm:px-6 lg:px-8">
        <div className="grid gap-12 xl:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)] xl:items-start">
          <div className="space-y-8">
            <div className="max-w-3xl">
              <h1 className="text-[clamp(3rem,5vw,5.25rem)] font-monument font-black leading-[0.92] tracking-tight text-flux-void">
                Services we offer.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-flux-editorial/90 md:text-lg">
                Search by capability, outcome, or market need to see the full service path from identity to launch, creative, and growth.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-flux-editorial/70">/Are you looking for something specific?/</p>
            <p className="mt-6 text-sm leading-relaxed text-flux-editorial/90">
              Don't know where to specifically start? Let our AI assistanth help keep the full marketing journey connected so your next move is decisive and memorable.
            </p>
            <Link
              to="/start"
              className="mt-8 inline-flex items-center justify-center rounded-full btn-neon-solid px-8 py-4 text-sm font-semibold text-white shadow-[0_20px_60px_-30px_rgba(47,103,255,0.55)] transition hover:brightness-110"
            >
              Custom Marketing Plan
            </Link>
          </div>
        </div>

        <div className="mt-2 max-w-3xl">
          <label htmlFor="service-search" className="sr-only">
            Search services
          </label>
          <div className="relative rounded-full border border-flux-green/60 bg-white px-4 py-3 shadow-sm focus-within:border-flux-green focus-within:ring-2 focus-within:ring-flux-green/15">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-flux-editorial/50" aria-hidden="true" />
            <input
              id="service-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Type to search services..."
              className="w-full border-none bg-transparent pl-11 text-base text-flux-editorial outline-none placeholder:text-flux-editorial/50"
            />
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {filteredServices.map((service, index) => (
            <article
              key={service.title}
              className={`${serviceBackgrounds[index % serviceBackgrounds.length]} cursor-crosshair group relative flex flex-col justify-between overflow-hidden rounded-[2rem] p-8 shadow-[0_25px_65px_-35px_rgba(15,23,16,0.25)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_35px_95px_-45px_rgba(15,23,16,0.28)]`}
            >
              <div className="text-sm uppercase tracking-[0.28em] text-flux-editorial/60">(0{index + 1})</div>
              <div>
                <h2 className="mt-8 text-2xl font-semibold leading-tight text-flux-void">
                  {service.title}
                </h2>
                <p className="mt-5 text-sm leading-relaxed text-flux-editorial/85">
                  {service.description}
                </p>
              </div>
              <div className="mt-8 inline-flex h-12 w-12 items-center justify-center rounded-full bg-flux-void text-white transition group-hover:scale-105">
                <ChevronRight size={18} strokeWidth={3} aria-hidden="true" />
              </div>
            </article>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="mt-8 rounded-[1.6rem] border border-flux-sand bg-flux-ivory/90 p-8 text-center text-sm text-flux-editorial/75">
            No services match your search. Try keywords like “brand”, “campaign”, or “market”.
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
