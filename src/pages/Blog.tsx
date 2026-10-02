import { useEffect } from "react";
import { ArrowRight, Calendar, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { BLOG_POSTS } from "@/lib/blog";
import { updateSeoMeta } from "@/lib/seo";

const Blog = () => {
  const featuredPost = BLOG_POSTS[0];
  const sidebarPosts = BLOG_POSTS.slice(1, 4);

  useEffect(() => {
    updateSeoMeta({
      title: "Blog | FluxFom - Brand Strategy & Growth Studio",
      description:
        "Read practical insights on brand strategy, positioning, marketing systems, and growth for ambitious African businesses.",
      pathname: "/blog",
    });
  }, []);

  return (
    <section className="bg-[#efefed] text-flux-void">
      <div className="mx-auto max-w-[1380px] px-5 pb-20 pt-8 sm:px-6 lg:px-8 lg:pt-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-flux-editorial/80">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#1a1a1a]/10 bg-white text-[10px] font-bold uppercase tracking-[0.2em] text-flux-editorial">
              F
            </div>
            <span className="text-[11px] font-medium uppercase tracking-[0.2em]">FluxFom Journal</span>
          </div>

          <Link
            to="/start"
            className="rounded-full bg-[#161a18] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-black"
          >
            Start for free
          </Link>
        </div>

        <div className="grid gap-7 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,0.9fr)]">
          <Link to={`/blog/${featuredPost.slug}`} className="group block overflow-hidden rounded-[2rem] border border-[#e8e1dc] bg-white shadow-[0_16px_40px_-30px_rgba(10,12,12,0.7)] transition hover:-translate-y-0.5">
            <div className="overflow-hidden">
              <img src={featuredPost.image} alt={featuredPost.title} className="h-[340px] w-full object-cover transition duration-500 group-hover:scale-[1.02] sm:h-[420px]" />
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.24em] text-flux-clay">
                <span>{featuredPost.category}</span>
                <span className="rounded-full border border-flux-sand bg-flux-ivory px-2 py-1">{featuredPost.readTime}</span>
              </div>

              <h1 className="mt-5 text-3xl font-semibold leading-[0.96] tracking-[-0.05em] text-flux-editorial sm:text-5xl">
                {featuredPost.title}
              </h1>

              <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-flux-editorial/75">{featuredPost.summary}</p>

              <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-flux-editorial/70">
                <span className="inline-flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-flux-sand text-[11px] font-semibold text-flux-editorial">
                    {featuredPost.author.charAt(0)}
                  </span>
                  {featuredPost.author}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  {featuredPost.date}
                </span>
              </div>
            </div>
          </Link>

          <aside className="space-y-4">
            <div className="rounded-[1.8rem] bg-[#2f2440] p-5 text-white shadow-[0_18px_45px_-35px_rgba(25,15,30,0.9)] sm:p-6">
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-white/65">Trending</p>
              <h2 className="mt-3 text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-white">
                Trending<br />on FluxFom
              </h2>
            </div>

            {sidebarPosts.map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="group flex gap-4 rounded-[1.3rem] border border-[#e6dfdb] bg-white p-3 text-left shadow-[0_12px_35px_-35px_rgba(15,18,18,0.8)] transition hover:-translate-y-0.5 hover:border-flux-green/30">
                <img src={post.image} alt={post.title} className="h-24 w-28 rounded-[1rem] object-cover" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-[1.05rem] font-semibold leading-[1.15] tracking-[-0.04em] text-flux-editorial transition group-hover:text-flux-growth">
                    {post.title}
                  </h3>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-flux-editorial/60">
                    <span>{post.date}</span>
                    <span className="rounded-full bg-[#ece6f3] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-flux-editorial/80">
                      {post.category}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Blog;
