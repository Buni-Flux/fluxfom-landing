import { Link } from "react-router-dom";

const profiles = [
  {
    title: "Car Service App",
    tag: "Brand identity / App design",
    status: "Draft",
  },
  {
    title: "Car Rental App Design",
    tag: "Visual system / UI",
    status: "Live",
  },
  {
    title: "Real Estate Mobile App",
    tag: "Campaign / Landing page",
    status: "Draft",
  },
  {
    title: "Event Management Dashboard",
    tag: "Product suite / Analytics",
    status: "Review",
  },
];

export default function AdminPublicProfiles() {
  return (
    <div className="min-h-screen bg-[#f6f7f8] text-[#111827]">
      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6b7280]">Admin / Public profiles</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-[#111827]">Public profiles</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#4b5563]">
              Manage public profile shots and upload new work for the team to publish.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/public-profiles/upload"
              className="rounded-full bg-[#111827] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1f2937]"
            >
              Upload shot
            </Link>
            <button className="rounded-full border border-[#e5e7ef] bg-white px-6 py-3 text-sm font-semibold text-[#111827] transition hover:bg-[#f8fafc]">
              Filter
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {profiles.map((profile) => (
            <div key={profile.title} className="rounded-[2rem] border border-[#e5e7ef] bg-white p-6 shadow-sm">
              <div className="mb-4 h-40 rounded-[1.5rem] bg-[#f8fafc]" />
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-[#111827]">{profile.title}</p>
                  <p className="text-sm text-[#6b7280]">{profile.tag}</p>
                </div>
                <div className="flex items-center justify-between text-sm font-semibold text-[#374151]">
                  <span>{profile.status}</span>
                  <Link to="/admin/public-profiles/upload" className="text-[#111827] underline">
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
