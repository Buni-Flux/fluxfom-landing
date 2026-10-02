import { useEffect } from "react";
import { ArrowRight, Calendar, Clock3, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { updateSeoMeta } from "@/lib/seo";

const POSTS = [
  {
    category: "Brand Positioning",
    title: "Why the best brands feel obvious before they ever say a word",
    summary:
      "A clear brand should reduce friction for customers. When positioning is sharp, growth feels easier across channels and offers.",
    date: "May 02, 2026",
    readTime: "6 min read",
  },
  {
    category: "Customer Experience",
    title: "How customer memory is built through small, repeated signals",
    summary:
      "The strongest experiences are rarely dramatic. They are deliberate, consistent, and emotionally aligned with the buyer's world.",
    date: "Apr 19, 2026",
    readTime: "4 min read",
  },
  {
    category: "Growth Systems",
    title: "From campaign output to repeatable revenue machinery",
    summary:
      "Marketing becomes sustainable when it links story, offer, conversion, and retention into a single operating rhythm.",
    date: "Apr 04, 2026",
    readTime: "7 min read",
  },
  {
    category: "African Markets",
    title: "What premium looks like in Nairobi and beyond",
    summary:
      "Premium is not generic. It is culturally intelligent, locally rooted, and built with enough clarity to earn trust fast.",
    date: "Mar 21, 2026",
    readTime: "5 min read",
  },
  {
    category: "Creative Strategy",
    title: "Content without positioning is noise. Positioning without content is a ghost.",
    summary:
      "Creative work gets sharper when it follows a strategy that explains who the brand is, who it serves, and why it matters now.",
    date: "Mar 09, 2026",
    readTime: "8 min read",
  },
  {
    category: "Founder Thinking",
    title: "The founder's biggest asset is not speed — it is narrative clarity",
    summary:
      "Great founders translate complexity into direction. That clarity is what helps teams, investors, and customers move together.",
    date: "Feb 28, 2026",
    readTime: "5 min read",
  },
] as const;

const Blog = () => {
  useEffect(() => {
    updateSeoMeta({
      title: "Blog | FluxFom - Brand Strategy & Growth Studio",
      description:
        "Read practical insights on brand strategy, positioning, marketing systems, and growth for ambitious African businesses.",
      pathname: "/blog",
    });
  }, []);

  return (
    <section className="landing-section bg-white text-flux-void">
      <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,0.6fr)_minmax(0,0.4fr)] xl:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-flux-editorial/70">/ FluxFom Journal /</p>
            <h1 className="mt-6 text-[clamp(3rem,5vw,5.5rem)] font-monument font-black leading-[0.9] tracking-tight text-flux-void">
              Thinking for brands in motion.
            </h1>
          </div>

          <div className="space-y-6">
            <p className="max-w-lg text-base leading-relaxed text-flux-editorial/85 md:text-lg">
              Strategy notes, creative principles, and practical marketing frameworks for teams building ambitious brands.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/start"
                className="inline-flex items-center justify-center rounded-full bg-flux-neon px-6 py-3 text-sm font-semibold text-[#10170a] transition hover:bg-[#d5ff35]"
              >
                Work with us
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center rounded-full border border-flux-editorial/20 px-6 py-3 text-sm font-semibold text-flux-editorial transition hover:border-flux-editorial/40 hover:bg-flux-sand/30"
              >
                Explore services
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 rounded-[2rem] border border-flux-sand bg-flux-ivory/80 p-6 sm:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3 text-flux-editorial/80">
              <Sparkles className="h-5 w-5 text-flux-green" aria-hidden="true" />
              <span className="text-sm font-medium uppercase tracking-[0.22em]">Featured insight</span>
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-flux-editorial/60">Popular this month</span>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,0.3fr)] lg:items-end">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-flux-clay">Brand Positioning</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-flux-editorial sm:text-4xl">
                Why the best brands feel obvious before they ever say a word
              </h2>
            </div>
            <div className="rounded-[1.5rem] border border-flux-sand bg-white p-5 shadow-[0_18px_50px_-35px_rgba(25,35,32,0.45)]">
              <p className="text-sm leading-relaxed text-flux-editorial/80">
                Great positioning reduces uncertainty. It gives customers a reason to trust, remember, and choose—without needing a long explanation.
              </p>
              <Link
                to="/start"
                className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-flux-editorial transition hover:text-flux-growth"
              >
                Read the insight
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {POSTS.map((post) => (
            <article key={post.title} className="group flex h-full flex-col rounded-[1.6rem] border border-flux-sand bg-white p-6 shadow-[0_16px_45px_-35px_rgba(10,15,12,0.35)] transition duration-300 hover:-translate-y-1 hover:border-flux-green/35 hover:shadow-[0_24px_60px_-35px_rgba(10,15,12,0.45)]">
              <div className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.24em] text-flux-clay">
                <span>{post.category}</span>
                <span className="rounded-full border border-flux-sand bg-flux-ivory px-2 py-1">{post.readTime}</span>
              </div>

              <h3 className="mt-6 text-2xl font-semibold leading-snug text-flux-editorial">
                {post.title}
              </h3>

              <p className="mt-4 flex-1 text-sm leading-relaxed text-flux-editorial/78">{post.summary}</p>

              <div className="mt-6 flex items-center justify-between border-t border-flux-sand pt-4 text-xs text-flux-editorial/60">
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                  {post.date}
                </span>
                <Link
                  to="/start"
                  className="inline-flex items-center gap-2 font-semibold uppercase tracking-[0.18em] text-flux-editorial transition group-hover:text-flux-growth"
                >
                  Read more
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-[2rem] bg-flux-void p-8 text-white md:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,0.3fr)] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/60">Need a sharper strategy?</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                Turn the ideas in our blog into a built-to-grow brand system.
              </h2>
            </div>
            <Link
              to="/start"
              className="inline-flex items-center justify-center rounded-full bg-flux-neon px-6 py-3 text-sm font-semibold text-[#10170a] transition hover:bg-[#d5ff35]"
            >
              Book a strategy call
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;
