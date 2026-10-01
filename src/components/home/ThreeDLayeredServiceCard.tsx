import { useEffect, useRef, useState } from "react";
import type React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

export type ServiceCardData = {
  id: number;
  label: string;
  title: string;
  category: string;
  description: string;
  icon: LucideIcon;
  visualIcon: LucideIcon;
  glow: string;
  glowGradient: string;
};

interface ThreeDLayeredServiceCardProps {
  service: ServiceCardData;
  width?: number | string;
  height?: {
    collapsed: number;
    expanded: number;
  };
  shineIntensity?: number;
}

export function ThreeDLayeredServiceCard({
  service,
  width = "100%",
  height = { collapsed: 180, expanded: 360 },
  shineIntensity = 0.6,
}: ThreeDLayeredServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const LogoIcon = service.icon;
  const VisualIcon = service.visualIcon;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
          window.innerWidth < 768 ||
          "ontouchstart" in window,
      );
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const imageSize = 128;
  const logoSize = 52;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 30 });
  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [isMobile ? "-6deg" : "-12deg", isMobile ? "6deg" : "12deg"],
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [isMobile ? "6deg" : "12deg", isMobile ? "-6deg" : "-12deg"],
  );
  const lensOverlay = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [
      `linear-gradient(180deg, rgba(0,0,0,${shineIntensity * 0.4}) 0%, rgba(0,0,0,${shineIntensity * 0.2}) 50%, rgba(0,0,0,${shineIntensity * 0.1}) 100%)`,
      `linear-gradient(180deg, rgba(255,255,255,${shineIntensity * 0.2}) 0%, rgba(255,255,255,${shineIntensity * 0.5}) 50%, rgba(255,255,255,${shineIntensity * 0.8}) 100%)`,
    ],
  );
  const logoMovement = isMobile ? 8 : 15;
  const logoMoveX = useTransform(mouseXSpring, [-0.5, 0.5], [logoMovement, -logoMovement]);
  const logoMoveY = useTransform(mouseYSpring, [-0.5, 0.5], [logoMovement, -logoMovement]);
  const textMoveX = useTransform(mouseXSpring, [-0.5, 0.5], [isMobile ? 8 : 15, isMobile ? -8 : -15]);
  const textMoveY = useTransform(mouseYSpring, [-0.5, 0.5], [isMobile ? 8 : 15, isMobile ? -8 : -15]);
  const shouldBeExpanded = isMobile ? isExpanded : isHovered || isExpanded;

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || isMobile) return;
    const bounds = ref.current.getBoundingClientRect();
    x.set((event.clientX - bounds.left) / bounds.width - 0.5);
    y.set((event.clientY - bounds.top) / bounds.height - 0.5);
  };

  const handleMouseEnter = () => {
    if (!isMobile) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovered(false);
      x.set(0);
      y.set(0);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isMobile) return;
    if ((event.target as HTMLElement).closest("a")) return;
    setIsExpanded((expanded) => !expanded);
    x.set(0.1);
    y.set(0.1);
    window.setTimeout(() => {
      x.set(0);
      y.set(0);
    }, 300);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "Escape") {
      setIsExpanded(false);
      setIsHovered(false);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsExpanded((expanded) => !expanded);
    }
  };

  const expandedLogoTop = `${Math.max(-logoSize / 2, Math.min(15, height.expanded - logoSize + 20))}px`;
  const availableSpaceAboveTitle = 90 - 20;
  const collapsedLogoTop = `${Math.max(10, (availableSpaceAboveTitle - logoSize) / 2)}px`;
  const titleVisible = 90 + 24 <= height.collapsed;
  const widthStyle = typeof width === "number" ? `${width}px` : width;

  return (
    <motion.div
      ref={ref}
      className="relative w-full cursor-pointer touch-manipulation"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
        width: typeof width === "number" ? `${width}px` : widthStyle,
        maxWidth: "100%",
        height: `${height.collapsed}px`,
        zIndex: shouldBeExpanded ? 50 : 1,
        WebkitTapHighlightColor: "transparent",
        userSelect: "none",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`Interactive service card for ${service.title.replace("\n", " ")}`}
      aria-expanded={shouldBeExpanded}
      role="button"
      tabIndex={0}
    >
      <motion.div
        className="relative w-full rounded-md border"
        style={{
          rotateY,
          rotateX,
          transformStyle: "preserve-3d",
          overflow: "hidden",
          position: shouldBeExpanded ? "absolute" : "relative",
          top: shouldBeExpanded ? `${-(height.expanded - height.collapsed) / 2}px` : "auto",
          left: shouldBeExpanded ? "0" : "auto",
          right: shouldBeExpanded ? "0" : "auto",
          border: "1px solid rgba(255,255,255,0.72)",
          borderRadius: "0.375rem",
        }}
        animate={{
          height: shouldBeExpanded ? `${height.expanded}px` : `${height.collapsed}px`,
          boxShadow: shouldBeExpanded
            ? `0 25px 50px -12px rgba(0,0,0,0.32), 0 0 0 1px rgba(255,255,255,0.1), 0 0 24px ${service.glow}`
            : "0 18px 36px -22px rgba(5,16,5,0.32)",
        }}
        transition={{ type: "spring", stiffness: isMobile ? 300 : 400, damping: isMobile ? 30 : 25, mass: 0.8 }}
      >
        <motion.div
          className="relative w-full"
          style={{
            height: shouldBeExpanded ? `${height.expanded}px` : `${height.collapsed}px`,
            minHeight: shouldBeExpanded ? `${height.expanded}px` : `${height.collapsed}px`,
          }}
          animate={{ height: shouldBeExpanded ? `${height.expanded}px` : `${height.collapsed}px` }}
          transition={{ type: "spring", stiffness: isMobile ? 300 : 400, damping: isMobile ? 30 : 25, mass: 0.8 }}
        >
          <div className="absolute inset-0 bg-[#103b1b]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/35" />

          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{ background: lensOverlay, mixBlendMode: "overlay", zIndex: 25 }}
          />
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 25%, transparent 50%, transparent 75%, rgba(255,255,255,0.03) 100%)",
              mixBlendMode: "soft-light",
              zIndex: 24,
            }}
            animate={{ opacity: shouldBeExpanded ? 0.6 : 0.3 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />

          {isMobile && (
            <motion.div
              className="pointer-events-none absolute right-2 top-2"
              style={{ zIndex: 35, color: "white", fontSize: 12, opacity: 0.7 }}
              animate={{ opacity: shouldBeExpanded ? 0 : 0.7, rotate: shouldBeExpanded ? 45 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Plus size={16} />
            </motion.div>
          )}

          <motion.div
            className="absolute"
            style={{
              transform: "translateZ(60px)",
              transformStyle: "preserve-3d",
              left: `calc(50% - ${logoSize / 2}px)`,
              width: `${logoSize}px`,
              height: `${logoSize}px`,
              zIndex: 30,
            }}
            initial={{ top: collapsedLogoTop, opacity: 1 }}
            animate={{ top: shouldBeExpanded ? expandedLogoTop : collapsedLogoTop }}
            transition={{ type: "spring", stiffness: isMobile ? 300 : 400, damping: isMobile ? 30 : 25, mass: 0.8 }}
          >
            <motion.div
              className={`grid h-full w-full place-items-center drop-shadow-lg transition-colors duration-300 ${shouldBeExpanded ? "text-white" : "text-flux-neon"}`}
              style={{ x: shouldBeExpanded ? logoMoveX : 0, y: shouldBeExpanded ? logoMoveY : 0 }}
            >
              <LogoIcon size={logoSize} strokeWidth={1.7} aria-hidden />
            </motion.div>
          </motion.div>

          {titleVisible && (
            <motion.div
              className="absolute text-center font-display font-bold"
              style={{
                transform: "translateZ(40px)",
                transformStyle: "preserve-3d",
                width: "calc(100% - 1rem)",
                left: "0.5rem",
                right: "0.5rem",
                top: "90px",
                zIndex: 30,
                color: "white",
              }}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: shouldBeExpanded ? 0 : 1, y: shouldBeExpanded ? -20 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.7 }}
            >
              <h2 className="overflow-hidden text-ellipsis whitespace-pre-line text-sm leading-tight drop-shadow-lg">
                {service.title}
              </h2>
            </motion.div>
          )}

          <motion.div
            className="absolute text-center"
            style={{
              transform: "translateZ(40px)",
              transformStyle: "preserve-3d",
              width: "calc(100% - 2rem)",
              left: "1rem",
              top: "62%",
              zIndex: 30,
              color: "white",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: shouldBeExpanded ? 1 : 0, y: shouldBeExpanded ? 0 : 20 }}
            transition={{ type: "spring", stiffness: 450, damping: 28, mass: 0.8 }}
          >
            <motion.div
              className="flex flex-col items-center justify-center gap-1.5"
              style={{ x: shouldBeExpanded ? textMoveX : 0, y: shouldBeExpanded ? textMoveY : 0 }}
            >
              <span className="rounded-full border border-white/30 bg-black/20 px-2 py-0.5 text-[9px] font-bold tracking-[0.16em]">
                {service.category}
              </span>
              <p className="text-sm font-semibold leading-tight drop-shadow-md">{service.description}</p>
              <Link
                to="/start"
                onClick={(event) => event.stopPropagation()}
                tabIndex={shouldBeExpanded ? 0 : -1}
                className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-flux-void shadow-md transition-colors hover:bg-flux-neon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Start <ArrowUpRight size={14} aria-hidden />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute"
            style={{
              transform: "translateZ(20px)",
              transformStyle: "preserve-3d",
              left: `calc(50% - ${imageSize / 2}px)`,
              top: `calc(50% - ${imageSize / 2 + 21}px)`,
              width: `${imageSize}px`,
              height: `${imageSize}px`,
              zIndex: 20,
              color: "white",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: shouldBeExpanded ? 1 : 0, scale: shouldBeExpanded ? 1 : 0.8 }}
            transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.6 }}
          >
            <div className="grid h-full w-full place-items-center drop-shadow-xl">
              <VisualIcon size={112} strokeWidth={1.35} aria-hidden />
            </div>
            <div
              aria-hidden="true"
              className="absolute right-0 top-1 -z-10 h-32 w-32 rounded-full blur-xl"
              style={{ backgroundColor: service.glowGradient }}
            />
          </motion.div>

          <motion.div
            className="absolute inset-0 rounded-md"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.03) 100%)",
              zIndex: 5,
            }}
            animate={{ opacity: shouldBeExpanded ? 0.4 : 0.2 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute left-1/2"
        style={{
          bottom: shouldBeExpanded ? `${-20 - (height.expanded - height.collapsed)}px` : "-20px",
          width: 180,
          height: 25,
          zIndex: -1,
          x: "-50%",
        }}
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: shouldBeExpanded ? 0.25 : 0, scale: shouldBeExpanded ? 1.2 : 1 }}
        transition={{ type: "spring", stiffness: 250, damping: 30 }}
      >
        <div
          className="h-full w-full"
          style={{
            background: `radial-gradient(ellipse 100% 100% at 50% 0%, ${service.glow} 0%, rgba(255,20,147,0.03) 30%, rgba(255,165,0,0.01) 60%, transparent 100%)`,
            filter: "blur(8px)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}