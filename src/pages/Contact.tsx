import { useEffect, useState } from "react";
import { ArrowRight, Clock3, Mail, MapPin, MessageSquareText } from "lucide-react";
import { Link } from "react-router-dom";
import { updateSeoMeta } from "@/lib/seo";

type ContactFormState = {
  name: string;
  email: string;
  company: string;
  budget: string;
  message: string;
};

const INITIAL_FORM: ContactFormState = {
  name: "",
  email: "",
  company: "",
  budget: "",
  message: "",
};

const contactDetails = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@fluxfom.com",
    href: "mailto:hello@fluxfom.com",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Nairobi, Kenya",
    href: null,
  },
  {
    icon: Clock3,
    label: "Response time",
    value: "Within 24 HRS",
    href: null,
  },
] as const;

const servicePoints = [
  {
    title: "Brand clarity",
    text: "Positioning, messaging, and the language that helps your market understand exactly why you matter.",
  },
  {
    title: "Creative production",
    text: "Campaign assets, content systems, motion, and digital experiences designed around traction, not vanity.",
  },
  {
    title: "Growth support",
    text: "The operating rhythm that keeps your brand consistent while the sales and marketing engine compounds.",
  },
] as const;

const Contact = () => {
  const [form, setForm] = useState<ContactFormState>(INITIAL_FORM);

  useEffect(() => {
    updateSeoMeta({
      title: "Contact FluxFom | Get in touch",
      description:
        "Get in touch with FluxFom to discuss brand positioning, content systems, and growth strategy for your next phase.",
      pathname: "/contact",
    });
  }, []);

  const handleChange = (field: keyof ContactFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = encodeURIComponent(`New enquiry from ${form.name || "website visitor"}`);
    const body = encodeURIComponent(
      [
        `Name: ${form.name || "N/A"}`,
        `Email: ${form.email || "N/A"}`,
        `Company: ${form.company || "N/A"}`,
        `Budget: ${form.budget || "N/A"}`,
        "",
        "Project brief:",
        form.message || "No details provided.",
      ].join("\n")
    );

    window.location.href = `mailto:hello@fluxfom.io?subject=${subject}&body=${body}`;
  };

  return (
    <div className="bg-[#C9FF6B] text-flux-void">
      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
            <div className="pt-6">
              <span className="text-sm font-bold uppercase tracking-[0.24em] text-flux-editorial/70">Contact us</span>
              <h1 className="mt-5 max-w-xl font-monument text-[clamp(1.75rem,2.5vw,2.5rem)] leading-[0.9] tracking-tight text-[#0B2B12]">
                Let&apos;s build<br/>something<br/>that feels right.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-flux-editorial/80 md:text-lg">
                Whether you are defining a sharper brand, making your next launch feel premium, or fixing a fragmented
                marketing system, we help teams turn intention into clarity and momentum.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="mailto:hello@fluxfom.com" className="btn-neon-solid px-9 py-4 text-base">
                  hello@fluxfom.com
                </a>
                <Link to="/start" className="btn-neon-outline px-9 py-4 text-base">
                  Start a project
                </Link>
              </div>

            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-flux-editorial/10 bg-white/45 p-5 shadow-[0_40px_120px_-45px_rgba(5,16,5,0.28)] backdrop-blur-sm sm:p-6">
              <div className="absolute inset-x-8 top-0 h-16 rounded-b-full bg-[#0B2B12]/5 blur-2xl" aria-hidden />

              <div className="relative">
                <div className="mb-5 flex items-center gap-2 text-[#0B2B12]">
                  <MessageSquareText size={18} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.28em]">we will get back to you as soon as possible</span>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-flux-editorial/60">Name</span>
                      <input
                        value={form.name}
                        onChange={(event) => handleChange("name", event.target.value)}
                        className="w-full rounded-xl border border-flux-editorial/10 bg-[#F4F7F1] px-3.5 py-3 text-sm text-flux-editorial placeholder:text-flux-editorial/40 focus:border-[#0B2B12]/30 focus:outline-none"
                        placeholder="Your name"
                        required
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-flux-editorial/60">Email</span>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(event) => handleChange("email", event.target.value)}
                        className="w-full rounded-xl border border-flux-editorial/10 bg-[#F4F7F1] px-3.5 py-3 text-sm text-flux-editorial placeholder:text-flux-editorial/40 focus:border-[#0B2B12]/30 focus:outline-none"
                        placeholder="you@company.com"
                        required
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-flux-editorial/60">Company</span>
                    <input
                      value={form.company}
                      onChange={(event) => handleChange("company", event.target.value)}
                      className="w-full rounded-xl border border-flux-editorial/10 bg-[#F4F7F1] px-3.5 py-3 text-sm text-flux-editorial placeholder:text-flux-editorial/40 focus:border-[#0B2B12]/30 focus:outline-none"
                      placeholder="Your Brand or Business Name"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-flux-editorial/60">Project brief</span>
                    <textarea
                      value={form.message}
                      onChange={(event) => handleChange("message", event.target.value)}
                      rows={5}
                      className="w-full rounded-xl border border-flux-editorial/10 bg-[#F4F7F1] px-3.5 py-3 text-sm text-flux-editorial placeholder:text-flux-editorial/40 focus:border-[#0B2B12]/30 focus:outline-none"
                      placeholder="Have any questions, concerns or suggestions? Write freely."
                      required
                    />
                  </label>

                  <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0B2B12] px-6 py-3.5 text-sm font-bold text-white transition hover:brightness-110">
                    Send enquiry
                    <ArrowRight size={16} />
                  </button>
                </form>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {contactDetails.map(({ icon: Icon, label, value, href }) => (
                    <div key={label} className="rounded-[1.4rem] border border-flux-editorial/10 bg-[#dff6b7] p-4 shadow-[0_25px_50px_-30px_rgba(11,43,18,0.38)] backdrop-blur-sm">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#0B2B12]/8 text-flux-editorial">
                        <Icon size={18} />
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-flux-editorial/60">{label}</p>
                      {href ? (
                        <a href={href} className="mt-2 block text-sm text-flux-editorial hover:text-[#0B2B12]">
                          {value}
                        </a>
                      ) : (
                        <p className="mt-2 text-sm text-flux-editorial">{value}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0B2B12] py-20 text-white md:py-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="mb-10 max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#C9FF6B]">What to expect</p>
            <h2 className="mt-4 font-monument text-3xl leading-tight text-white sm:text-4xl">
              A direct conversation about the work that needs to move.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {servicePoints.map((item) => (
              <div key={item.title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_90px_-48px_rgba(0,0,0,0.8)] backdrop-blur-md">
                <h3 className="font-monument text-2xl text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/70">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
