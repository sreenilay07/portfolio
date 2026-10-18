import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BrainCircuit,
  ArrowRight,
  Eye,
  Download,
  Github,
  Linkedin,
  Mail,
  Terminal,
} from "lucide-react";
import Hero from "./Hero";
import HeroScene from "../three/HeroScene";
import CaseStudyModal from "./CaseStudyModal";
import { AVATAR_CONFIG } from "../three/avatarConfig";
import { scrollStore } from "../three/scrollStore";
import { personalInfo } from "../data/personalInfo";

gsap.registerPlugin(ScrollTrigger);

/**
 * HeroStage
 * High-immersion 3D Virtual Character Stage.
 * Replaces <Hero/> in App.jsx.
 * Scrubbed via GSAP ScrollTrigger & Lenis across 1000vh track.
 */
export default function HeroStage({ onOpenResume }) {
  const containerRef = useRef(null);
  const heroOverlayRef = useRef(null);
  const scrollHintRef = useRef(null);
  const progressBarRef = useRef(null);
  const lenisRef = useRef(null);

  // Fallback states: Mobile (<768px), No WebGL, or prefers-reduced-motion
  const [isFallback, setIsFallback] = useState(false);
  const [selectedCaseProject, setSelectedCaseProject] = useState(null);

  // Debug HUD state (enabled if ?debug=1 in URL)
  const [isDebug] = useState(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("debug") === "1";
  });
  const [debugData, setDebugData] = useState({
    progress: 0,
    smoothed: 0,
    stage: "sitIdle",
    fps: 60,
    bones: [],
    clips: [],
  });

  // Typewriter effect state for Hero copy
  const [titleIndex, setTitleIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(150);

  // 1. Check Fallback Requirements on mount & resize
  useEffect(() => {
    const checkFallback = () => {
      const isSmallScreen = window.innerWidth < 768;
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let hasWebGL;
      try {
        const canvas = document.createElement("canvas");
        hasWebGL = !!(
          window.WebGLRenderingContext &&
          (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
        );
      } catch {
        hasWebGL = false;
      }

      setIsFallback(isSmallScreen || !hasWebGL || prefersReduced);
    };

    checkFallback();
    window.addEventListener("resize", checkFallback);

    return () => window.removeEventListener("resize", checkFallback);
  }, []);

  // 2. Typewriter Effect for Hero Title
  useEffect(() => {
    if (isFallback) return;
    const fullText = personalInfo.titles[titleIndex];
    const timer = setTimeout(() => {
      if (!isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length + 1));
        if (currentText === fullText) {
          setIsDeleting(true);
          setSpeed(2000);
        } else {
          setSpeed(80 + Math.random() * 40);
        }
      } else {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        if (currentText === "") {
          setIsDeleting(false);
          setTitleIndex((prev) => (prev + 1) % personalInfo.titles.length);
          setSpeed(500);
        } else {
          setSpeed(45);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, titleIndex, speed, isFallback]);

  // 3. Lenis & GSAP ScrollTrigger Scrubbing
  useEffect(() => {
    if (isFallback) return;

    // Direct scroll sync function
    const updateScrollMetrics = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalTrack = containerRef.current.offsetHeight - window.innerHeight;
      if (totalTrack > 0) {
        const p = Math.min(Math.max(-rect.top / totalTrack, 0), 1);
        scrollStore.progress = p;

        // Update DOM overlay opacity directly without triggering React re-renders
        if (heroOverlayRef.current) {
          const fadeProgress = p / 0.12;
          const overlayAlpha = Math.max(0, 1 - fadeProgress);
          heroOverlayRef.current.style.opacity = overlayAlpha.toFixed(3);
          heroOverlayRef.current.style.transform = `translateY(${(fadeProgress * -25).toFixed(1)}px)`;
          heroOverlayRef.current.style.pointerEvents = overlayAlpha > 0.05 ? "auto" : "none";
        }

        // Scroll Hint fade
        if (scrollHintRef.current) {
          const hintAlpha = Math.max(0, 1 - p / 0.05);
          scrollHintRef.current.style.opacity = hintAlpha.toFixed(3);
        }

        // Vertical Stage Progress Bar
        if (progressBarRef.current) {
          progressBarRef.current.style.height = `${(p * 100).toFixed(1)}%`;
        }
      }
    };

    // Initialize smooth scrolling with Lenis
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      autoRaf: false,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", () => {
      ScrollTrigger.update();
      updateScrollMetrics();
    });

    const tickerFn = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    // Native scroll event fallback for maximum reliability
    window.addEventListener("scroll", updateScrollMetrics, { passive: true });

    // GSAP ScrollTrigger tied to the tall stage container
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.2,
      onUpdate: () => {
        updateScrollMetrics();
      },
    });

    // Refresh triggers to ensure exact dimensions
    setTimeout(() => {
      ScrollTrigger.refresh();
      updateScrollMetrics();
    }, 100);

    // Mouse movement parallax tracking
    const handleMouseMove = (e) => {
      scrollStore.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      scrollStore.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // IntersectionObserver to pause rendering when stage is scrolled out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        scrollStore.isCanvasVisible = entry.isIntersecting;
      },
      { threshold: 0.02 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("scroll", updateScrollMetrics);
      window.removeEventListener("mousemove", handleMouseMove);
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
      trigger.kill();
      observer.disconnect();
    };
  }, [isFallback]);

  // 4. Debug HUD poller (only active when ?debug=1)
  useEffect(() => {
    if (!isDebug) return;
    const interval = setInterval(() => {
      setDebugData({
        progress: scrollStore.progress,
        smoothed: scrollStore.smoothedProgress,
        stage: scrollStore.currentStage,
        fps: Math.round(1000 / (performance.now() % 30 + 16)),
        bones: scrollStore.bones || [],
        clips: scrollStore.clips || [],
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isDebug]);

  // Helper to scroll to stage positions
  const scrollToStageProgress = (progressFraction) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const stageTop = rect.top + scrollTop;
    const totalScrollableHeight = containerRef.current.offsetHeight - window.innerHeight;
    const targetY = stageTop + progressFraction * totalScrollableHeight;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetY, { duration: 1.2 });
    } else {
      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });
    }
  };

  // If fallback is triggered (mobile, no webgl, reduced motion), render original Hero
  if (isFallback) {
    return <Hero onOpenResume={onOpenResume} />;
  }

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-full"
      style={{ height: AVATAR_CONFIG.scrollTrackHeight }}
      aria-label="Interactive 3D Virtual Character Stage"
    >
      {/* Sticky 100vh Fullscreen Stage Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden select-none">
        
        {/* R3F High-Performance Canvas */}
        <div className="absolute inset-0 z-10 pointer-events-auto">
          <Canvas
            shadows
            dpr={[1, 1.75]}
            camera={{ fov: AVATAR_CONFIG.camera.fov, position: [0, 1.25, 2.75] }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
          >
            <HeroScene onSelectProject={(p) => setSelectedCaseProject(p)} />
          </Canvas>
        </div>

        {/* ---------------------------------------------------------- */}
        {/* DOM HERO OVERLAY (0.00 to 0.12) - Fades out smoothly on scrub */}
        {/* ---------------------------------------------------------- */}
        <div
          ref={heroOverlayRef}
          className="absolute inset-0 z-20 pointer-events-auto flex items-center transition-opacity duration-150"
          style={{ willChange: "transform, opacity" }}
        >
          <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left bg-zinc-950/40 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none p-6 lg:p-0 rounded-3xl border border-white/5 lg:border-none shadow-2xl lg:shadow-none">
              
              {/* AI Badge */}
              <div className="inline-flex items-center gap-2 self-center lg:self-start px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/5 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-6">
                <BrainCircuit className="w-3.5 h-3.5 animate-pulse text-violet-400" />
                <span>AI Engineer &amp; Full-Stack Developer</span>
              </div>

              {/* Name Heading */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-display leading-[1.1] tracking-tight mb-4 text-white">
                Hi, I&apos;m{" "}
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                  {personalInfo.name}
                </span>
              </h1>

              {/* Typewriter Rotating Roles */}
              <div className="h-10 sm:h-12 flex items-center justify-center lg:justify-start mb-6">
                <span className="text-xl sm:text-2xl font-mono text-zinc-300">
                  I build as a{" "}
                  <span className="text-cyan-400 font-bold typewriter-cursor pb-1 border-b border-cyan-400/30">
                    {currentText}
                  </span>
                </span>
              </div>

              {/* Hero Descriptions */}
              <p className="text-lg font-medium text-violet-200/80 mb-2 max-w-2xl leading-relaxed font-sans">
                {personalInfo.heroTagline}
              </p>
              <p className="text-sm sm:text-base text-zinc-400 mb-8 max-w-2xl leading-relaxed">
                {personalInfo.heroDescription}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => scrollToStageProgress(0.62)}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold shadow-lg hover:shadow-violet-500/20 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer focus:outline-none"
                >
                  Explore Projects
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={onOpenResume}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl glass-panel text-white hover:text-cyan-400 hover:border-cyan-500/50 font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
                >
                  <Eye className="w-4 h-4 text-cyan-400" />
                  View Resume
                </button>

                <a
                  href={personalInfo.resumeUrl}
                  download="Minumula_Sree_Nilay_Reddy_Resume.pdf"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-zinc-900 border border-white/5 hover:border-violet-500/30 text-zinc-300 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
                >
                  <Download className="w-4 h-4 text-violet-400" />
                  Download Resume
                </a>
              </div>

              {/* Social Quick Links */}
              <div className="flex items-center justify-center lg:justify-start gap-4 mt-8">
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 hover:text-white transition-all shadow-md hover:scale-110"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 hover:text-sky-400 transition-all shadow-md hover:scale-110"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=sreenilayreddy@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 hover:text-emerald-400 transition-all shadow-md hover:scale-110"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------- */}
        {/* Animated Bottom "Scroll" Hint                              */}
        {/* ---------------------------------------------------------- */}
        <div
          ref={scrollHintRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-zinc-400 pointer-events-none transition-opacity duration-200"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
            Scroll to Explore
          </span>
          <div className="w-5 h-9 rounded-full border-2 border-zinc-600/60 p-1 flex justify-center">
            <div className="w-1.5 h-2 bg-gradient-to-b from-violet-400 to-cyan-400 rounded-full animate-bounce" />
          </div>
        </div>

        {/* ---------------------------------------------------------- */}
        {/* Thin Vertical Stage Progress Indicator (Right Side)        */}
        {/* ---------------------------------------------------------- */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-end gap-5 pointer-events-auto">
          {/* Track Line */}
          <div className="relative w-[3px] h-48 bg-white/10 rounded-full overflow-hidden">
            <div
              ref={progressBarRef}
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-violet-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-75"
              style={{ height: "0%" }}
            />
          </div>

          {/* Stage Quick Jump Ticks */}
          <div className="flex flex-col gap-3 font-mono text-[11px] text-zinc-500">
            {[
              { label: "Sit", p: 0.0 },
              { label: "Stand", p: 0.18 },
              { label: "Walk", p: 0.40 },
              { label: "Projects", p: 0.62 },
            ].map((stage, sIdx) => (
              <button
                key={sIdx}
                onClick={() => scrollToStageProgress(stage.p)}
                className="hover:text-cyan-400 transition-colors cursor-pointer text-right flex items-center gap-1.5 focus:outline-none"
              >
                <span>{stage.label}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20 hover:bg-cyan-400" />
              </button>
            ))}
          </div>
        </div>

        {/* ---------------------------------------------------------- */}
        {/* Debug Overlay (?debug=1 in URL)                            */}
        {/* ---------------------------------------------------------- */}
        {isDebug && (
          <div className="absolute top-24 left-6 z-50 p-4 rounded-xl glass-panel border border-cyan-500/30 bg-zinc-950/90 text-xs font-mono text-zinc-300 max-w-sm max-h-[80vh] overflow-y-auto pointer-events-auto shadow-2xl">
            <div className="flex items-center gap-2 pb-2 mb-2 border-b border-white/10 font-bold text-cyan-400">
              <Terminal className="w-4 h-4" />
              <span>3D AVATAR DEBUG HUD</span>
            </div>
            <div className="space-y-1">
              <div>
                Progress:{" "}
                <span className="text-white font-bold">
                  {(debugData.progress * 100).toFixed(1)}%
                </span>{" "}
                (raw: {debugData.progress.toFixed(3)})
              </div>
              <div>
                Smoothed:{" "}
                <span className="text-violet-400 font-bold">
                  {(debugData.smoothed * 100).toFixed(1)}%
                </span>
              </div>
              <div>
                Stage:{" "}
                <span className="text-emerald-400 font-bold uppercase">
                  {debugData.stage}
                </span>
              </div>
              <div>
                Clips:{" "}
                <span className="text-zinc-400">
                  {debugData.clips.join(", ") || "loading..."}
                </span>
              </div>
            </div>

            <details className="mt-3 pt-2 border-t border-white/10">
              <summary className="cursor-pointer text-cyan-400 hover:text-white">
                Discovered Bones ({debugData.bones.length})
              </summary>
              <ul className="mt-2 space-y-0.5 text-[10px] text-zinc-400 max-h-40 overflow-y-auto">
                {debugData.bones.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </details>
          </div>
        )}

        {/* Shared Case Study Modal for 3D Holographic Card clicks */}
        <CaseStudyModal
          project={selectedCaseProject}
          onClose={() => setSelectedCaseProject(null)}
        />
      </div>
    </section>
  );
}
