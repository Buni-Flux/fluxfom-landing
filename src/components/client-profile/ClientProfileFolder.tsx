import { useState } from "react";
import { BookOpen, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CLIENT_PROFILE_TABS,
  type ClientProfileTabId,
  type ResolvedClientProfile,
} from "@/types/clientProfile";

export type ClientProfileViewMode = "tab" | "read";

type Props = {
  profile: ResolvedClientProfile;
};

function ImageGrid({
  images,
  columns = 3,
  dark = false,
}: {
  images: string[];
  columns?: 2 | 3;
  dark?: boolean;
}) {
  const slots = images.length > 0 ? images : Array.from({ length: columns * columns }, () => null);

  return (
    <div
      className={cn(
        "grid gap-3 sm:gap-4",
        columns === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2",
      )}
    >
      {slots.slice(0, columns * columns).map((src, i) => (
        <div
          key={`${src ?? "empty"}-${i}`}
          className={cn(
            "aspect-square overflow-hidden rounded-xl sm:rounded-2xl",
            dark ? "bg-[#2A1F17]" : "bg-white/50",
            !src && (dark ? "border border-[#E8DCC6]/10" : "border border-[#1B2B22]/8"),
          )}
        >
          {src ? (
            <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
          ) : (
            <div
              className={cn(
                "flex h-full w-full items-center justify-center text-[10px] font-bold uppercase tracking-[0.2em]",
                dark ? "text-[#E8DCC6]/35" : "text-[#1B2B22]/25",
              )}
            >
              Asset
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function BrandBriefPanel({ profile }: { profile: ResolvedClientProfile }) {
  const brief = profile.data.brandBrief;

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-[#1B2B22]/8 bg-[#FAF7F2]/90 p-6 sm:p-10 md:p-12">
      <header className="border-b border-[#1B2B22]/12 pb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#6F5137]">Client</p>
        <h2 className="heading-editorial mt-2 text-3xl font-semibold text-[#1B2B22] sm:text-4xl">{profile.name}</h2>
        <p className="mt-2 text-sm font-medium uppercase tracking-[0.16em] text-[#1B2B22]/70">
          {profile.tagline} · {profile.location}
        </p>
        <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.22em] text-[#7A4A2F]">
          Timeline · {profile.timeline}
        </p>
      </header>
      {brief?.html ? (
        <div
          className="prose prose-sm mt-8 max-w-none text-[#1B2B22]/82 prose-headings:font-editorial prose-headings:text-[#1B2B22] prose-a:text-[#7A4A2F]"
          dangerouslySetInnerHTML={{ __html: brief.html }}
        />
      ) : (
        <p className="mt-8 text-sm leading-relaxed text-[#1B2B22]/80 md:text-base">{brief?.summary}</p>
      )}
    </div>
  );
}

function BrandStrategyPanel({ profile }: { profile: ResolvedClientProfile }) {
  const strategy = profile.data.brandStrategy;
  const left = strategy?.left ?? [];
  const right = strategy?.right ?? [];

  return (
    <div className="mx-auto max-w-4xl rounded-2xl border border-[#1B2B22]/8 bg-[#FAF7F2]/95 p-6 sm:p-10">
      <header className="flex flex-col gap-4 border-b border-[#1B2B22]/12 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#6F5137]">
            Client: {profile.name}
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#1B2B22]/72">
            {profile.tagline}, {profile.location}
          </p>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#7A4A2F]">
          Timeline: {profile.timeline}
        </p>
      </header>
      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <ul className="space-y-4">
          {left.map((item) => (
            <li key={item} className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1B2B22]/88">
              {item}
            </li>
          ))}
        </ul>
        <ul className="space-y-4 md:text-right">
          {right.map((item) => (
            <li key={item} className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1B2B22]/88">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CreativeDirectionPanel({ profile }: { profile: ResolvedClientProfile }) {
  const cd = profile.data.creativeDirection;
  const images = cd?.moodImages?.length ? cd.moodImages : profile.coverImage ? [profile.coverImage] : [];

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/15 bg-[#FAF7F2] p-4 sm:p-6">
        {cd?.palette && cd.palette.length > 0 ? (
          <div className="mb-6 flex flex-wrap gap-2">
            {cd.palette.map((swatch) => (
              <div
                key={swatch.name}
                className="h-10 min-w-[4.5rem] flex-1 rounded-lg px-2 py-1"
                style={{ backgroundColor: swatch.hex }}
                title={swatch.name}
              >
                <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#1B2B22]/70">
                  {swatch.name}
                </span>
              </div>
            ))}
          </div>
        ) : null}
        <ImageGrid images={images.length >= 4 ? images : images.concat(images).slice(0, 9)} columns={3} />
      </div>
      <ol className="grid gap-4 sm:grid-cols-2">
        {(cd?.notes ?? []).map((note, i) => (
          <li key={note.title} className="text-xs leading-relaxed text-[#FAF7F2]/88">
            <span className="font-mono text-[#E8DCC6]/55">{i + 1}.</span>{" "}
            <span className="font-semibold uppercase tracking-[0.14em] text-[#FAF7F2]">{note.title}</span>
            <span className="mt-1 block text-[#FAF7F2]/75">{note.body}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function LogoSuitePanel({ profile }: { profile: ResolvedClientProfile }) {
  const rows = profile.data.logoSuite?.rows ?? [];

  return (
    <div className="mx-auto max-w-3xl divide-y divide-[#1B2B22]/10 rounded-2xl border border-[#1B2B22]/8 bg-[#FAF7F2]/95">
      {rows.map((row) => (
        <div key={row.label} className="grid gap-4 px-6 py-8 sm:grid-cols-[1fr_1.2fr] sm:items-center sm:px-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6F5137]">{row.label}</p>
          <div className="flex min-h-[4.5rem] items-center justify-center rounded-xl bg-white/70 px-6 py-4">
            {row.imageUrl ? (
              <img src={row.imageUrl} alt={row.label} className="max-h-20 max-w-full object-contain" />
            ) : (
              <span className="heading-editorial text-3xl font-semibold text-[#1B2B22] sm:text-4xl">
                {row.text ?? profile.name.toLowerCase()}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ColorsFontsPanel({ profile }: { profile: ResolvedClientProfile }) {
  const cf = profile.data.colorsAndFonts;
  const colors = cf?.colors ?? [];
  const fonts = cf?.fonts ?? [];

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-[#1B2B22]/8 bg-white/90 p-6 sm:p-10">
      <p className="text-right text-[10px] font-bold uppercase tracking-[0.22em] text-[#6F5137]">Colour palette</p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {colors.map((color) => (
          <div
            key={color.name}
            className="flex min-h-[5.5rem] flex-col justify-end rounded-xl p-3"
            style={{ backgroundColor: color.hex }}
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#1B2B22]/75">{color.name}</span>
          </div>
        ))}
      </div>
      <p className="mt-10 text-right text-[10px] font-bold uppercase tracking-[0.22em] text-[#6F5137]">Font suite</p>
      <div className="mt-6 space-y-8">
        {fonts.map((font) => (
          <div key={font.role} className="border-t border-[#1B2B22]/10 pt-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6F5137]">{font.label}</p>
            <p
              className={cn(
                "mt-3 text-[#1B2B22]",
                font.role === "heading" && "heading-editorial text-4xl font-semibold text-[#A66A3F] sm:text-5xl",
                font.role === "subtitle" && "text-xs font-semibold uppercase tracking-[0.28em]",
                font.role === "body" && "max-w-xl text-sm leading-relaxed text-[#1B2B22]/78",
              )}
            >
              {font.sample}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionPanel({ tabId, profile }: { tabId: ClientProfileTabId; profile: ResolvedClientProfile }) {
  switch (tabId) {
    case "brand-brief":
      return <BrandBriefPanel profile={profile} />;
    case "brand-strategy":
      return <BrandStrategyPanel profile={profile} />;
    case "creative-direction":
      return <CreativeDirectionPanel profile={profile} />;
    case "logo-suite":
      return <LogoSuitePanel profile={profile} />;
    case "colors-fonts":
      return <ColorsFontsPanel profile={profile} />;
    case "applications":
      return (
        <ImageGrid
          images={profile.data.applications?.images ?? (profile.coverImage ? [profile.coverImage] : [])}
          columns={3}
        />
      );
    case "launch-templates":
      return (
        <ImageGrid
          images={profile.data.launchTemplates?.images ?? (profile.coverImage ? [profile.coverImage] : [])}
          columns={3}
          dark
        />
      );
    default:
      return null;
  }
}

function isDarkSection(tabId: ClientProfileTabId) {
  return tabId === "creative-direction" || tabId === "launch-templates";
}

function ViewModeToggle({
  mode,
  onChange,
}: {
  mode: ClientProfileViewMode;
  onChange: (mode: ClientProfileViewMode) => void;
}) {
  const options: { value: ClientProfileViewMode; label: string; icon: typeof LayoutGrid }[] = [
    { value: "tab", label: "Tab mode", icon: LayoutGrid },
    { value: "read", label: "Read mode", icon: BookOpen },
  ];

  return (
    <div
      className="inline-flex rounded-full border border-[#D9C9AE] bg-[#FAF7F2]/90 p-1"
      role="group"
      aria-label="Profile viewing mode"
    >
      {options.map(({ value, label, icon: Icon }) => {
        const active = mode === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            aria-pressed={active}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] transition",
              active
                ? "bg-[#1B2B22] text-[#FAF7F2] shadow-sm"
                : "text-[#1B2B22]/65 hover:text-[#1B2B22]",
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
            {label}
          </button>
        );
      })}
    </div>
  );
}

function ClientProfileTabMode({ profile }: { profile: ResolvedClientProfile }) {
  const [activeTab, setActiveTab] = useState<ClientProfileTabId>("brand-brief");
  const active = CLIENT_PROFILE_TABS.find((t) => t.id === activeTab) ?? CLIENT_PROFILE_TABS[0];
  const isDarkPanel = isDarkSection(activeTab);

  return (
    <div className="w-full">
      <div
        className="overflow-x-auto pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Client profile sections"
      >
        <div className="flex min-w-max items-end gap-0.5 px-1">
          {CLIENT_PROFILE_TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative shrink-0 rounded-t-xl px-3 py-2.5 text-[9px] font-bold uppercase tracking-[0.14em] transition sm:px-4 sm:text-[10px] sm:tracking-[0.18em]",
                  isActive ? "z-10 shadow-[0_-2px_0_0_currentColor]" : "z-0 opacity-90 hover:opacity-100",
                )}
                style={{
                  backgroundColor: tab.tabBg,
                  color: isActive ? tab.activeTabText : tab.tabText,
                }}
              >
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        id={`panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className="rounded-b-2xl rounded-tr-2xl px-4 py-8 sm:px-8 sm:py-12 md:px-12 md:py-14"
        style={{ backgroundColor: active.panelBg }}
      >
        <div className={cn("mx-auto max-w-5xl", isDarkPanel && "text-[#FAF7F2]")}>
          <SectionPanel tabId={activeTab} profile={profile} />
        </div>
      </div>
    </div>
  );
}

function ClientProfileReadMode({ profile }: { profile: ResolvedClientProfile }) {
  return (
    <article className="w-full overflow-hidden rounded-2xl border border-[#D9C9AE]/60 shadow-[0_24px_80px_-48px_rgba(27,43,34,0.35)]">
      <nav
        className="sticky top-[4.5rem] z-20 border-b border-[#E7DCC6] bg-[#FAF7F2]/95 px-4 py-3 backdrop-blur-md sm:px-6"
        aria-label="Jump to section"
      >
        <ul className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CLIENT_PROFILE_TABS.map((tab, i) => (
            <li key={tab.id} className="shrink-0">
              <a
                href={`#section-${tab.id}`}
                className="inline-block rounded-full border border-[#D9C9AE] bg-white/50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#1B2B22]/72 transition hover:border-[#A66A3F]/40 hover:text-[#1B2B22] sm:text-[10px]"
              >
                <span className="text-[#7A4A2F]/80">{i + 1}.</span> {tab.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="divide-y divide-[#1B2B22]/6">
        {CLIENT_PROFILE_TABS.map((tab, index) => {
          const dark = isDarkSection(tab.id);
          return (
            <section
              key={tab.id}
              id={`section-${tab.id}`}
              className="scroll-mt-36 px-4 py-10 sm:px-8 sm:py-14 md:px-12 md:py-16"
              style={{ backgroundColor: tab.panelBg }}
              aria-labelledby={`read-heading-${tab.id}`}
            >
              <header className="mx-auto mb-8 max-w-5xl border-b border-current/10 pb-6 sm:mb-10">
                <p
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-[0.28em]",
                    dark ? "text-[#E8DCC6]/55" : "text-[#7A4A2F]",
                  )}
                >
                  Section {index + 1} of {CLIENT_PROFILE_TABS.length}
                </p>
                <h2
                  id={`read-heading-${tab.id}`}
                  className={cn(
                    "heading-editorial mt-2 text-2xl font-semibold sm:text-3xl md:text-4xl",
                    dark ? "text-[#FAF7F2]" : "text-[#1B2B22]",
                  )}
                >
                  {tab.label}
                </h2>
              </header>
              <div className={cn("mx-auto max-w-5xl", dark && "text-[#FAF7F2]")}>
                <SectionPanel tabId={tab.id} profile={profile} />
              </div>
            </section>
          );
        })}
      </div>
    </article>
  );
}

export function ClientProfileFolder({ profile }: Props) {
  const [viewMode, setViewMode] = useState<ClientProfileViewMode>("tab");

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#1B2B22]/60">
          {viewMode === "tab"
            ? "Browse one section at a time"
            : "Scroll through the full brand book"}
        </p>
        <ViewModeToggle mode={viewMode} onChange={setViewMode} />
      </div>

      {viewMode === "tab" ? (
        <ClientProfileTabMode profile={profile} />
      ) : (
        <ClientProfileReadMode profile={profile} />
      )}
    </div>
  );
}
