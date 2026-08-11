import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useGsapLandingSections() {
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>("section[data-gsap-section]");

      const firstSection = sections[0];
      const remainingSections = sections.slice(1);

      if (firstSection) {
        gsap.set(firstSection, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          transformOrigin: "center center",
        });
      }

      gsap.set(remainingSections, {
        autoAlpha: 0,
        y: 80,
        scale: 0.96,
        transformOrigin: "center center",
      });

      sections.forEach((section, index) => {
        gsap.set(section, {
          position: "relative",
          overflow: "visible",
          zIndex: 10 + index,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: index === 0 ? "top top" : "top 90%",
            end: "bottom top",
            scrub: 1,
            markers: false,
            invalidateOnRefresh: true,
          },
        });

        if (index > 0) {
          tl.fromTo(
            section,
            { autoAlpha: 0, y: 80, scale: 0.96 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" },
            0,
          );
        }

        tl.to(
          section,
          { autoAlpha: 0, y: -80, duration: 1, ease: "power3.in" },
          0.7,
        );
      });

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, []);
}
