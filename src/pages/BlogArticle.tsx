import { useEffect } from "react";
import { ArrowLeft, Calendar, Clock3 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getBlogPostBySlug } from "@/lib/blog";
import { updateSeoMeta } from "@/lib/seo";

const BlogArticle = () => {
  const { slug } = useParams();
  const post = slug ? getBlogPostBySlug(slug) : undefined;

  useEffect(() => {
    if (!post) return;

    updateSeoMeta({
      title: `${post.title} | FluxFom Blog`,
      description: post.summary,
      pathname: `/blog/${post.slug}`,
    });
  }, [post]);

  if (!post) {
    return (
      <section className="bg-white px-5 py-16 text-flux-void">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-flux-sand bg-flux-ivory/80 p-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-flux-editorial/70">Article not found</p>
          <h1 className="mt-6 text-4xl font-semibold text-flux-editorial">This story is not available.</h1>
          <Link
            to="/blog"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-flux-neon px-6 py-3 text-sm font-semibold text-[#10170a] transition hover:bg-[#d5ff35]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to blog
          </Link>
        </div>
      </section>
    );
  }

  return (
    <article className="bg-white text-flux-void">
      <div className="mx-auto max-w-[1260px] px-5 pb-20 pt-8 sm:px-6 lg:px-8 lg:pt-10">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-flux-editorial/75 transition hover:text-flux-editorial"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to blog
        </Link>

        <div className="mt-8 overflow-hidden rounded-[2rem] border border-flux-sand bg-white shadow-[0_30px_75px_-50px_rgba(15,18,18,0.5)]">
          <img src={post.image} alt={post.title} className="h-[300px] w-full object-cover sm:h-[420px] lg:h-[560px]" />
        </div>

        <div className="mx-auto mt-8 max-w-4xl">
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-flux-clay">
            <span>{post.category}</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-flux-sand bg-flux-ivory px-2.5 py-1 text-[10px]">
              <Clock3 className="h-3 w-3" aria-hidden="true" />
              {post.readTime}
            </span>
          </div>

          <h1 className="mt-6 text-[clamp(2.5rem,4vw,5rem)] font-monument font-black leading-[0.94] tracking-tight text-flux-void">
            {post.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-flux-editorial/70">
            <span className="inline-flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-flux-sand text-xs font-semibold text-flux-editorial">
                {post.author.charAt(0)}
              </span>
              {post.author}
            </span>
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              {post.date}
            </span>
          </div>

          <p className="mt-8 text-lg leading-relaxed text-flux-editorial/80">{post.excerpt}</p>

          <div className="mt-10 space-y-7 text-[1.05rem] leading-8 text-flux-editorial/85">
            {post.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-12 rounded-[1.5rem] border border-flux-sand bg-flux-ivory/80 p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-flux-clay">Key takeaway</p>
            <p className="mt-4 text-xl font-medium leading-relaxed text-flux-editorial">
              {post.tag}: a small, repeatable system is often what turns a good idea into a reliable brand experience.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogArticle;
