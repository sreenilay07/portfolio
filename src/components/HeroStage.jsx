import { useState, useEffect, useRef, useCallback } from "react";
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
  ExternalLink,
  BookOpen,
  Sparkles,
  Terminal,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Hero from "./Hero";
import CaseStudyModal from "./CaseStudyModal";
import { projectsData } from "../data/projects";
import { personalInfo } from "../data/personalInfo";

gsap.registerPlugin(ScrollTrigger);

// Video assets: 60 FPS ultra-low-latency desktop & mobile renditions with fallback cascade
const VIDEO_DESKTOP_60FPS = "/portfolio-60fps.mp4";
const VIDEO_MOBILE_60FPS = "/portfolio-mobile.mp4";
const VIDEO_ENHANCED_FALLBACK = "/portfolio-enhanced.mp4";
const VIDEO_ORIGINAL_FALLBACK = "/portfolio.mp4";
const DEFAULT_VIDEO_DURATION = 7.62; // 457 frames @ 60fps

// Orbital layout configuration for 5 projects in 3D elliptical perspective
// 0: FRONT ACTIVE (Featured Foreground Console)
// 1: FRONT-RIGHT (Below Avatar Right Hand)
// 2: BACK-RIGHT (Framing Avatar Right Shoulder)
// 3: BACK-LEFT (Framing Avatar Left Shoulder)
// 4: FRONT-LEFT (Below Avatar Left Hand)
const ORBIT_SLOTS = [
  { x: 0, y: 130, z: 100, scale: 1.0, opacity: 1.0, zIndex: 40, isFront: true },
  { x: 420, y: 40, z: 30, scale: 0.80, opacity: 0.85, zIndex: 28, isFront: false },
  { x: 260, y: -105, z: -80, scale: 0.66, opacity: 0.60, zIndex: 18, isFront: false },
  { x: -260, y: -105, z: -80, scale: 0.66, opacity: 0.60, zIndex: 18, isFront: false },
  { x: -420, y: 40, z: 30, scale: 0.80, opacity: 0.85, zIndex: 28, isFront: false },
];

// Mobile 3D Elliptical Orbit slots (scaled for phone viewport width 360-430px)
const MOBILE_ORBIT_SLOTS = [
  { x: 0, y: 135, z: 60, scale: 1.0, opacity: 1.0, zIndex: 40, isFront: true },
  { x: 120, y: -10, z: 20, scale: 0.62, opacity: 0.80, zIndex: 28, isFront: false },
  { x: 78, y: -110, z: -50, scale: 0.48, opacity: 0.55, zIndex: 18, isFront: false },
  { x: -78, y: -110, z: -50, scale: 0.48, opacity: 0.55, zIndex: 18, isFront: false },
  { x: -120, y: -10, z: 20, scale: 0.62, opacity: 0.80, zIndex: 28, isFront: false },
];

/**
 * HeroStage
 * High-Performance 60 FPS Interactive Circular Orbit Project Showcase with Avatar Video Scrubbing.
 * 0.00 - 0.08: Seated hero intro (video t = 0.0s)
 * 0.08 - 0.28: Stand-up motion (video t = 0.0s -> ~4.48s)
 * 0.28 - 0.44: Spreading arms wide (video t = ~4.48s -> 7.62s)
 * 0.44 - 0.88: Wide-arms presentation hold (video t = 7.62s)
 *   CIRCULAR 3D ORBIT SHOWCASE:
 *   - Avatar is the central focal point with arms spread wide.
 *   - 5 project holograms float in an elliptical orbit around the avatar.
 *   - Selected project moves to the front with detailed information.
 *   - Other 4 projects remain visible as smaller holograms in orbit.
 *   - Scroll, arrows, pagination dots, or direct card clicks rotate the showcase.
 * 0.88 - 1.00: Smooth dissolve into standard portfolio
 */
export default function HeroStage({ onOpenResume }) {
  const containerRef = useRef(null);
  const stickyStageRef = useRef(null);
  const videoRef = useRef(null);
  const videoWrapperRef = useRef(null);
  const heroOverlayRef = useRef(null);
  const cardsOverlayRef = useRef(null);
  const progressBarRef = useRef(null);
  const lenisRef = useRef(null);

  // Fallback state: prefers-reduced-motion
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [selectedCaseProject, setSelectedCaseProject] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Dynamic video source: desktop 60fps vs mobile 60fps
  const [videoSrc] = useState(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return VIDEO_MOBILE_60FPS;
    }
    return VIDEO_DESKTOP_60FPS;
  });

  // Synchronized active index ref to avoid stale closures in event listeners
  const activeIndexRef = useRef(0);
  const isUserInteractingRef = useRef(false);
  const interactionTimeoutRef = useRef(null);
  const touchStartXRef = useRef(0);

  // Debug HUD state (?debug=1) and frozen progress (?debug=1&p=0.xx)
  const [debugState] = useState(() => {
    if (typeof window === "undefined") {
      return { isDebug: false, frozenP: null };
    }
    const params = new URLSearchParams(window.location.search);
    const isDebug = params.get("debug") === "1";
    let frozenP = null;
    if (isDebug && params.has("p")) {
      const parsed = parseFloat(params.get("p"));
      if (!isNaN(parsed)) {
        frozenP = Math.min(Math.max(parsed, 0), 1);
      }
    }
    return { isDebug, frozenP };
  });

  const isDebug = debugState.isDebug;
  const frozenP = debugState.frozenP;

  const [debugData, setDebugData] = useState({
    progress: frozenP !== null ? frozenP : 0,
    videoTime: 0,
    seeking: false,
    stage: "seated",
  });

  // Typewriter effect state for Hero copy
  const [titleIndex, setTitleIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(150);

  // References for ultra-responsive low-latency seek scheduler
  const targetTimeRef = useRef(0);
  const isSeekingRef = useRef(false);
  const seekWatchdogRef = useRef(null);
  const rafPendingRef = useRef(null);
  const progressRef = useRef(0);
  const durationRef = useRef(DEFAULT_VIDEO_DURATION);

  // 1. Accessibility: Check reduced-motion
  useEffect(() => {
    const checkMotion = () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setIsReducedMotion(prefersReduced);
    };
    checkMotion();
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    mediaQuery.addEventListener("change", checkMotion);
    return () => mediaQuery.removeEventListener("change", checkMotion);
  }, []);

  // 2. Typewriter Effect for Hero Title
  useEffect(() => {
    if (isReducedMotion) return;
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
  }, [currentText, isDeleting, titleIndex, speed, isReducedMotion]);

  // 3. Ultra-Low-Latency Seek Scheduler
  // Prevents decoder thrashing, coalesces rapid updates, and avoids redundant currentTime assignments
  const scheduleSeek = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;

    // If decoder is currently seeking, do not queue a competing seek;
    // the seeked event will automatically trigger the latest targetTimeRef.current
    if (isSeekingRef.current || video.seeking) return;

    const target = targetTimeRef.current;
    const current = video.currentTime;
    const diff = target - current;

    // Minimum delta threshold (0.015s ~ 1 frame at 60fps) to eliminate sub-frame seek jitter
    if (Math.abs(diff) >= 0.015) {
      isSeekingRef.current = true;
      video.currentTime = target;

      // Watchdog timeout to prevent lockup if browser drops a seeked event
      if (seekWatchdogRef.current) clearTimeout(seekWatchdogRef.current);
      seekWatchdogRef.current = setTimeout(() => {
        isSeekingRef.current = false;
        const v = videoRef.current;
        if (v && Math.abs(targetTimeRef.current - v.currentTime) >= 0.015) {
          scheduleSeek();
        }
      }, 70);
    }
  }, []);

  const handleSeeked = useCallback(() => {
    isSeekingRef.current = false;
    if (seekWatchdogRef.current) clearTimeout(seekWatchdogRef.current);

    const video = videoRef.current;
    if (video && video.readyState >= 2) {
      const diff = targetTimeRef.current - video.currentTime;
      if (Math.abs(diff) >= 0.015) {
        if (!rafPendingRef.current) {
          rafPendingRef.current = requestAnimationFrame(() => {
            rafPendingRef.current = null;
            scheduleSeek();
          });
        }
      }
    }
  }, [scheduleSeek]);

  // Attach video seek listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onSeeked = () => handleSeeked();
    const onSeeking = () => {
      isSeekingRef.current = true;
    };

    video.addEventListener("seeked", onSeeked);
    video.addEventListener("seeking", onSeeking);

    return () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("seeking", onSeeking);
      if (seekWatchdogRef.current) clearTimeout(seekWatchdogRef.current);
      if (rafPendingRef.current) cancelAnimationFrame(rafPendingRef.current);
    };
  }, [handleSeeked]);

  // 4. GSAP ScrollTrigger & Lenis Synchronized Single Ticker
  useEffect(() => {
    if (isReducedMotion) return;

    // Apply styles directly to DOM nodes without triggering React re-renders
    const applyProgress = (p) => {
      progressRef.current = p;

      const dur = durationRef.current;
      const standT = dur * 0.587; // Stand up motion completion point (~4.48s)

      // Map scroll progress to video timeline:
      // p in [0.00, 0.08]: Seated hero intro (video held at 0.0s)
      // p in [0.08, 0.28]: Stand up motion (video 0.0s -> ~4.48s)
      // p in [0.28, 0.44]: Arms spread wide (video ~4.48s -> dur)
      // p in [0.44, 0.88]: Wide-arms presentation hold (video held at dur)
      // p in [0.88, 1.00]: Smooth dissolve to standard portfolio
      const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
      let videoT;

      if (isMobile) {
        // MOBILE TIMELINE:
        // 1. p in [0.00, 0.12]: Hero copy at the top scrolls out, video below glides up to top
        const enterFraction = Math.min(1, Math.max(0, p / 0.12));

        if (heroOverlayRef.current) {
          const heroAlpha = Math.max(0, 1 - enterFraction);
          heroOverlayRef.current.style.opacity = heroAlpha.toFixed(3);
          heroOverlayRef.current.style.transform = `translateY(${-enterFraction * 80}px)`;
          heroOverlayRef.current.style.pointerEvents = heroAlpha > 0.1 ? "auto" : "none";
          heroOverlayRef.current.style.visibility = heroAlpha > 0.01 ? "visible" : "hidden";
        }

        if (videoWrapperRef.current) {
          // Slide up from +24vh to 0vh as enterFraction goes 0 -> 1
          const slideOffsetVh = (1 - enterFraction) * 24;
          videoWrapperRef.current.style.transform = `translateY(${slideOffsetVh.toFixed(2)}vh)`;
        }

        // 2. Video Scrubbing on Mobile:
        // Avatar remains seated while sliding up (videoT = 0).
        // Once video reaches top (p >= 0.12), the scroll animation happens:
        // p in [0.12, 0.30]: Avatar stands up
        // p in [0.30, 0.46]: Avatar spreads arms wide
        // p in [0.46, 0.88]: Wide arms hold with 5-project circular orbit
        if (p <= 0.12) {
          videoT = 0;
        } else if (p >= 0.46) {
          videoT = dur;
        } else if (p <= 0.30) {
          const fraction = (p - 0.12) / (0.30 - 0.12);
          videoT = fraction * standT;
        } else {
          const fraction = (p - 0.30) / (0.46 - 0.30);
          videoT = standT + fraction * (dur - standT);
        }
      } else {
        // DESKTOP TIMELINE: 100% UNTOUCHED ORIGINAL LOGIC
        if (videoWrapperRef.current) {
          videoWrapperRef.current.style.transform = "translateY(0px)";
        }

        if (p <= 0.08) {
          videoT = 0;
        } else if (p >= 0.44) {
          videoT = dur;
        } else if (p <= 0.28) {
          const fraction = (p - 0.08) / (0.28 - 0.08);
          videoT = fraction * standT;
        } else {
          const fraction = (p - 0.28) / (0.44 - 0.28);
          videoT = standT + fraction * (dur - standT);
        }

        // A. Hero Copy Overlay on Desktop: Fades out and slides up (0.06 -> 0.20)
        if (heroOverlayRef.current) {
          if (p < 0.06) {
            heroOverlayRef.current.style.opacity = "1";
            heroOverlayRef.current.style.transform = "translateY(0px)";
            heroOverlayRef.current.style.pointerEvents = "auto";
            heroOverlayRef.current.style.visibility = "visible";
          } else if (p > 0.20) {
            heroOverlayRef.current.style.opacity = "0";
            heroOverlayRef.current.style.transform = "translateY(-30px)";
            heroOverlayRef.current.style.pointerEvents = "none";
            heroOverlayRef.current.style.visibility = "hidden";
          } else {
            const fadeP = (p - 0.06) / (0.20 - 0.06);
            const alpha = 1 - fadeP;
            heroOverlayRef.current.style.opacity = alpha.toFixed(3);
            heroOverlayRef.current.style.transform = `translateY(${-fadeP * 30}px)`;
            heroOverlayRef.current.style.pointerEvents = alpha > 0.05 ? "auto" : "none";
            heroOverlayRef.current.style.visibility = alpha > 0.01 ? "visible" : "hidden";
          }
        }
      }

      targetTimeRef.current = Math.min(Math.max(videoT, 0), dur);

      // Trigger coalesced seek
      scheduleSeek();

      // C. Interactive Circular Showcase Overlay (0.40 to 0.88)
      if (cardsOverlayRef.current) {
        const revealStart = isMobile ? 0.40 : 0.35;
        if (p < revealStart) {
          cardsOverlayRef.current.style.opacity = "0";
          cardsOverlayRef.current.style.pointerEvents = "none";
          cardsOverlayRef.current.style.visibility = "hidden";
        } else if (p >= revealStart && p <= 0.88) {
          cardsOverlayRef.current.style.visibility = "visible";
          const revealP = Math.min(1, Math.max(0, (p - revealStart) / 0.08));
          cardsOverlayRef.current.style.opacity = revealP.toFixed(3);
          cardsOverlayRef.current.style.pointerEvents = revealP > 0.4 ? "auto" : "none";

          // Drive project selection from scroll if not actively clicking and modal is not open
          if (!isUserInteractingRef.current && !selectedCaseProject && p >= 0.46) {
            const numP = projectsData.length;
            const stageFraction = Math.min(1, Math.max(0, (p - 0.46) / (0.88 - 0.46)));
            const derivedIdx = Math.min(numP - 1, Math.max(0, Math.round(stageFraction * (numP - 1))));
            if (derivedIdx !== activeIndexRef.current) {
              activeIndexRef.current = derivedIdx;
              setActiveIndex(derivedIdx);
            }
          }
        } else {
          // Transition out over [0.88, 1.00]
          const fadeOut = Math.max(0, 1 - (p - 0.88) / 0.12);
          cardsOverlayRef.current.style.opacity = fadeOut.toFixed(3);
          cardsOverlayRef.current.style.pointerEvents = fadeOut > 0.1 ? "auto" : "none";
          cardsOverlayRef.current.style.visibility = fadeOut > 0.01 ? "visible" : "hidden";
        }
      }

      // D. Vertical Stage Progress Bar
      if (progressBarRef.current) {
        progressBarRef.current.style.height = `${(p * 100).toFixed(1)}%`;
      }

      // E. Stage Dissolve into About Section (0.88 -> 1.00)
      if (stickyStageRef.current) {
        if (p > 0.88) {
          const dissolveAlpha = Math.max(0, 1 - (p - 0.88) / 0.12);
          stickyStageRef.current.style.opacity = dissolveAlpha.toFixed(3);
        } else {
          stickyStageRef.current.style.opacity = "1";
        }
      }
    };

    if (frozenP !== null) {
      applyProgress(frozenP);
      return;
    }

    // Initialize smooth scrolling with Lenis (smooth inertia)
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      autoRaf: false,
    });
    lenisRef.current = lenis;
    if (typeof window !== "undefined") {
      window.__lenis = lenis;
    }

    // Unified animation frame ticker: GSAP ticker drives Lenis at display refresh rate
    const tickerFn = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    // Keep ScrollTrigger synchronized with Lenis
    lenis.on("scroll", ScrollTrigger.update);

    // GSAP ScrollTrigger tied directly to stage container (1:1 scrub in lockstep with Lenis)
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        applyProgress(self.progress);
      },
    });

    // Refresh after DOM layout settles
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
      if (trigger) applyProgress(trigger.progress);
    }, 100);

    return () => {
      clearTimeout(refreshTimer);
      if (typeof window !== "undefined") {
        window.__lenis = null;
      }
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
      trigger.kill();
    };
  }, [isReducedMotion, frozenP, scheduleSeek, selectedCaseProject]);

  // Lock Lenis whenever project case study modal is open
  useEffect(() => {
    if (selectedCaseProject) {
      if (lenisRef.current) lenisRef.current.stop();
    } else {
      if (lenisRef.current) lenisRef.current.start();
    }
  }, [selectedCaseProject]);

  // 5. Debug HUD poller (only active when ?debug=1)
  useEffect(() => {
    if (!isDebug) return;
    const interval = setInterval(() => {
      const p = progressRef.current;
      let stageName = "seated";
      if (p > 0.08 && p < 0.28) stageName = "standing-up";
      else if (p >= 0.28 && p < 0.50) stageName = "arms-spreading";
      else if (p >= 0.50 && p <= 0.90) stageName = "all-5-projects-hold";
      else if (p > 0.90) stageName = "portfolio-transition";

      setDebugData({
        progress: p,
        videoTime: videoRef.current ? videoRef.current.currentTime : 0,
        seeking: isSeekingRef.current,
        stage: stageName,
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isDebug]);

  // Jump to specific scroll progress
  const scrollToStageProgress = useCallback((progressFraction) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const stageTop = rect.top + scrollTop;
    const totalScrollableHeight = containerRef.current.offsetHeight - window.innerHeight;
    const targetY = stageTop + progressFraction * totalScrollableHeight;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetY, { duration: 1.1 });
    } else {
      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });
    }
  }, []);

  // Jump smoothly to a specific project in the circular orbit
  const scrollToProject = useCallback(
    (targetIdx) => {
      const numProjects = projectsData.length;
      const clampedIdx = (targetIdx + numProjects) % numProjects;
      activeIndexRef.current = clampedIdx;
      setActiveIndex(clampedIdx);

      // Temporary flag so scroll listener doesn't immediately overwrite activeIndex
      isUserInteractingRef.current = true;
      if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
      interactionTimeoutRef.current = setTimeout(() => {
        isUserInteractingRef.current = false;
      }, 850);

      const targetP = 0.46 + (clampedIdx / (numProjects - 1)) * (0.88 - 0.46);
      scrollToStageProgress(targetP);
    },
    [scrollToStageProgress]
  );

  const handlePrev = useCallback(() => {
    scrollToProject(activeIndexRef.current - 1);
  }, [scrollToProject]);

  const handleNext = useCallback(() => {
    scrollToProject(activeIndexRef.current + 1);
  }, [scrollToProject]);

  // Keyboard navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    if (isReducedMotion) return;
    const handleKeyDown = (e) => {
      if (selectedCaseProject) return;
      const p = progressRef.current;
      if (p < 0.35 || p > 0.95) return;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, selectedCaseProject, isReducedMotion]);

  // Touch swipe gestures for mobile devices
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(diffX) > 40) {
      if (diffX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  // Accessible fallback for users with reduced motion preferences
  if (isReducedMotion) {
    return <Hero onOpenResume={onOpenResume} />;
  }

  const activeProject = projectsData[activeIndex] || projectsData[0];

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-full bg-[#030508]"
      style={{ height: "400vh" }}
      aria-label="Minumula Sree Nilay Reddy Cinematic Portfolio"
    >
      {/* Sticky 100vh Fullscreen Cinematic Viewport */}
      <div
        ref={stickyStageRef}
        className="sticky top-0 h-screen w-full overflow-hidden select-none bg-[#030508]"
      >
        {/* ---------------------------------------------------------- */}
        {/* VIDEO LAYER: Integrated Seamlessly Into Background         */}
        {/* ---------------------------------------------------------- */}
        <div
          ref={videoWrapperRef}
          className="absolute inset-x-0 h-screen lg:inset-0 z-0 flex items-center justify-center overflow-hidden bg-[#030508] lg:pt-20 lg:pb-6"
          style={{ willChange: "transform" }}
        >
          <video
            ref={videoRef}
            src={videoSrc}
            muted
            playsInline
            preload="auto"
            autoPlay={false}
            loop={false}
            controls={false}
            disablePictureInPicture
            onLoadedMetadata={(e) => {
              const d = e.currentTarget.duration;
              if (d && !isNaN(d) && d > 0) {
                durationRef.current = d;
              }
            }}
            onError={(e) => {
              const currentSrc = e.currentTarget.currentSrc || e.currentTarget.src || "";
              if (!currentSrc.includes("portfolio-enhanced.mp4") && !currentSrc.includes("portfolio.mp4")) {
                console.warn("Primary 60fps video failed, falling back to enhanced master");
                e.currentTarget.src = VIDEO_ENHANCED_FALLBACK;
                e.currentTarget.load();
              } else if (!currentSrc.includes("portfolio.mp4")) {
                console.warn("Enhanced master video failed, falling back to original");
                e.currentTarget.src = VIDEO_ORIGINAL_FALLBACK;
                e.currentTarget.load();
              }
            }}
            onLoadedData={() => {
              setIsVideoLoaded(true);
              if (videoRef.current && videoRef.current.currentTime === 0) {
                videoRef.current.currentTime = 0.001;
              }
            }}
            className="w-full h-full object-contain pointer-events-none select-none transition-opacity duration-300"
            style={{
              // Seamless radial edge blending: outer boundaries dissolve softly into #030508 void
              maskImage:
                "radial-gradient(ellipse 98% 95% at 50% 50%, black 80%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 98% 95% at 50% 50%, black 80%, transparent 100%)",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
              opacity: isVideoLoaded ? 1 : 0.85,
            }}
          />

          {/* Minimal perimeter blending: zero visible rectangular edges while preserving face & head clarity */}
          <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-[#030508]/80 via-[#030508]/20 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#030508] via-[#030508]/50 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#030508] via-[#030508]/40 to-transparent pointer-events-none hidden lg:block" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#030508] via-[#030508]/40 to-transparent pointer-events-none hidden lg:block" />
        </div>

        {/* ---------------------------------------------------------- */}
        {/* DOM HERO OVERLAY (0.00 to 0.20): Polished Intro Copy       */}
        {/* ---------------------------------------------------------- */}
        <div
          ref={heroOverlayRef}
          className="absolute inset-x-0 top-16 sm:top-20 lg:inset-0 lg:top-0 z-35 pointer-events-auto flex flex-col lg:flex-row items-center justify-start lg:justify-start transition-opacity duration-150 overflow-hidden"
          style={{ willChange: "transform, opacity" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex items-center h-auto lg:h-full">
            <div className="w-full lg:max-w-[38vw] xl:max-w-[480px] flex flex-col justify-center text-center lg:text-left bg-zinc-950/60 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none p-4 sm:p-6 lg:p-0 rounded-2xl sm:rounded-3xl border border-white/5 lg:border-none shadow-2xl lg:shadow-none">
              {/* Role Badge */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 self-center lg:self-start px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-white/[0.08] bg-[#080d12] text-[#c59b7b] text-[10px] sm:text-xs font-mono font-medium tracking-wider uppercase mb-2 sm:mb-4">
                <BrainCircuit className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#c59b7b]" />
                <span>AI Engineer &amp; Full-Stack Developer</span>
              </div>

              {/* Name Heading */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-display leading-[1.15] tracking-tight mb-2 sm:mb-4 text-[#eaeef1]">
                Hi, I&apos;m <span className="text-white">{personalInfo.name}</span>
              </h1>

              {/* Typewriter Rotating Roles */}
              <div className="h-6 sm:h-9 flex items-center justify-center lg:justify-start mb-2 sm:mb-4">
                <span className="text-xs sm:text-lg lg:text-xl font-mono text-[#94a3b8]">
                  I build as a{" "}
                  <span className="text-[#eaeef1] font-semibold border-b border-[#c59b7b]/50 pb-0.5">
                    {currentText}
                  </span>
                </span>
              </div>

              {/* Taglines / Descriptions */}
              <p className="text-xs sm:text-base lg:text-lg font-normal text-[#eaeef1] mb-1 sm:mb-2 max-w-md leading-relaxed line-clamp-2 lg:line-clamp-none">
                {personalInfo.heroTagline}
              </p>
              <p className="hidden sm:block text-xs sm:text-sm text-[#94a3b8] mb-4 sm:mb-7 max-w-md leading-relaxed">
                {personalInfo.heroDescription}
              </p>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 sm:flex sm:flex-row sm:items-center sm:justify-center lg:justify-start gap-2 sm:gap-3.5">
                <button
                  onClick={() => scrollToStageProgress(0.70)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#eaeef1] hover:bg-white text-[#030508] font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 group cursor-pointer focus:outline-none shadow-md min-h-[44px]"
                >
                  Explore Work
                  <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={onOpenResume}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#080d12] hover:bg-[#121a22] text-[#eaeef1] hover:text-white border border-white/10 hover:border-white/20 font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer focus:outline-none min-h-[44px]"
                >
                  <Eye className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#c59b7b]" />
                  Resume
                </button>

                <a
                  href={personalInfo.resumeUrl}
                  download="Minumula_Sree_Nilay_Reddy_Resume.pdf"
                  className="hidden sm:flex col-span-2 sm:w-auto px-5 py-3 rounded-xl bg-[#080d12] hover:bg-[#121a22] text-[#94a3b8] hover:text-[#eaeef1] border border-white/[0.08] text-xs sm:text-sm transition-all duration-200 items-center justify-center gap-2 cursor-pointer focus:outline-none min-h-[44px]"
                >
                  <Download className="w-4 h-4" />
                  Download CV
                </a>
              </div>

              {/* Social Quick Links */}
              <div className="flex items-center justify-center lg:justify-start gap-2.5 sm:gap-3 mt-3 sm:mt-7">
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="p-2 sm:p-2.5 rounded-lg bg-[#080d12] hover:bg-[#121a22] border border-white/[0.08] text-[#94a3b8] hover:text-[#eaeef1] transition-all min-w-[36px] min-h-[36px] flex items-center justify-center"
                >
                  <Github className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                </a>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="p-2 sm:p-2.5 rounded-lg bg-[#080d12] hover:bg-[#121a22] border border-white/[0.08] text-[#94a3b8] hover:text-[#eaeef1] transition-all min-w-[36px] min-h-[36px] flex items-center justify-center"
                >
                  <Linkedin className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                </a>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=sreenilayreddy@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Email Minumula Sree Nilay Reddy"
                  className="p-2 sm:p-2.5 rounded-lg bg-[#080d12] hover:bg-[#121a22] border border-white/[0.08] text-[#94a3b8] hover:text-[#eaeef1] transition-all min-w-[36px] min-h-[36px] flex items-center justify-center"
                >
                  <Mail className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------- */}
        {/* INTERACTIVE CIRCULAR ORBIT PROJECT SHOWCASE (0.40 to 0.88)  */}
        {/* Avatar in center, 5 project holograms orbiting in 3D       */}
        {/* ---------------------------------------------------------- */}
        <div
          ref={cardsOverlayRef}
          className="absolute inset-0 z-30 pointer-events-none opacity-0 transition-opacity duration-200"
          style={{ willChange: "transform, opacity" }}
        >
          {/* Concentric Floor Hologram Pedestal Rings under Avatar's Feet */}
          <div
            className="absolute left-1/2 bottom-[8%] sm:bottom-[10%] lg:bottom-[8%] -translate-x-1/2 pointer-events-none select-none z-10"
            style={{ transform: "rotateX(72deg)" }}
          >
            <svg
              className="w-[500px] h-[500px] sm:w-[650px] sm:h-[650px] animate-spin-slow opacity-80"
              viewBox="0 0 600 600"
            >
              <circle
                cx="300"
                cy="300"
                r="285"
                fill="none"
                stroke="rgba(0, 210, 255, 0.28)"
                strokeWidth="1.5"
                strokeDasharray="8 14"
              />
              <circle
                cx="300"
                cy="300"
                r="235"
                fill="none"
                stroke="rgba(129, 140, 248, 0.35)"
                strokeWidth="1"
                strokeDasharray="4 8"
              />
              <circle
                cx="300"
                cy="300"
                r="185"
                fill="none"
                stroke="rgba(0, 210, 255, 0.45)"
                strokeWidth="2"
              />
              <circle
                cx="300"
                cy="300"
                r="125"
                fill="none"
                stroke="rgba(197, 155, 123, 0.4)"
                strokeWidth="1"
                strokeDasharray="6 6"
              />
            </svg>
          </div>

          {/* 3D Tilted Elliptical Orbit Track around Avatar's Waist/Torso */}
          <div
            className="hidden lg:block absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-10 w-[94vw] max-w-[1060px] h-[340px]"
            style={{ transform: "rotateX(68deg) rotateZ(-3deg)" }}
          >
            <svg className="w-full h-full" viewBox="0 0 1000 340">
              <defs>
                <linearGradient id="orbitGlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.75" />
                  <stop offset="25%" stopColor="#818cf8" stopOpacity="0.5" />
                  <stop offset="50%" stopColor="#10b981" stopOpacity="0.65" />
                  <stop offset="75%" stopColor="#f97316" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#c084fc" stopOpacity="0.75" />
                </linearGradient>
              </defs>
              <ellipse
                cx="500"
                cy="170"
                rx="460"
                ry="140"
                fill="none"
                stroke="url(#orbitGlowGradient)"
                strokeWidth="1.5"
                strokeDasharray="5 9"
                opacity="0.65"
              />
              <ellipse
                cx="500"
                cy="170"
                rx="464"
                ry="144"
                fill="none"
                stroke="rgba(0, 210, 255, 0.25)"
                strokeWidth="0.8"
                opacity="0.4"
              />
            </svg>
          </div>

          {/* DESKTOP 3D CIRCULAR ORBIT CAROUSEL (>= 1024px) */}
          <div className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none">
            <div className="relative w-full h-full flex items-center justify-center">
              {projectsData.map((project, idx) => {
                const offset = (idx - activeIndex + projectsData.length) % projectsData.length;
                const slot = ORBIT_SLOTS[offset] || ORBIT_SLOTS[0];
                const isFront = slot.isFront;
                const hasLiveUrl = Boolean(project.liveUrl);
                const techList = project.technologies || project.tech || [];

                if (isFront) {
                  // ----------------------------------------------------
                  // FRONT ACTIVE PROJECT CONSOLE
                  // ----------------------------------------------------
                  return (
                    <div
                      key={project.id}
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "48%",
                        transform: `translate3d(calc(-50% + ${slot.x}px), calc(-50% + ${slot.y}px), ${slot.z}px) scale(${slot.scale})`,
                        opacity: slot.opacity,
                        zIndex: slot.zIndex,
                        transition: "transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease",
                        boxShadow: `0 0 35px -5px ${project.glowColor}, 0 25px 50px -12px rgba(0,0,0,0.92)`,
                        borderColor: `${project.accentColor}90`,
                      }}
                      className="w-[560px] xl:w-[630px] h-[255px] xl:h-[270px] arch-card rounded-2xl overflow-hidden border bg-[#080d12]/95 backdrop-blur-xl pointer-events-auto flex group"
                    >
                      {/* Left Thumbnail (42%) */}
                      <div className="w-[42%] relative overflow-hidden bg-[#05080c] border-r border-white/[0.08] shrink-0">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#080d12] via-transparent to-transparent pointer-events-none" />

                        {/* Project Index & Category Badge */}
                        <div
                          className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase border backdrop-blur-md flex items-center gap-1.5 shadow-sm"
                          style={{
                            backgroundColor: "rgba(3, 5, 8, 0.9)",
                            borderColor: `${project.accentColor}50`,
                            color: project.accentColor,
                          }}
                        >
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>0{project.heroOrder} // {project.category}</span>
                        </div>

                        {/* Role Badge if Team Project */}
                        {project.role && project.role.includes("Team") && (
                          <span
                            className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-mono font-semibold border backdrop-blur-md flex items-center gap-1"
                            style={{
                              backgroundColor: "rgba(249, 115, 22, 0.2)",
                              borderColor: "rgba(249, 115, 22, 0.4)",
                              color: "#fb923c",
                            }}
                          >
                            <Users className="w-2.5 h-2.5" />
                            Team of 4
                          </span>
                        )}
                      </div>

                      {/* Right Project Details (58%) */}
                      <div className="w-[58%] p-3.5 xl:p-4 flex flex-col justify-between text-left">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2 h-2 rounded-full animate-pulse"
                              style={{ backgroundColor: project.accentColor }}
                            />
                            <h3 className="text-base xl:text-lg font-bold text-white font-display leading-tight">
                              {project.title}
                            </h3>
                          </div>
                          <p className="text-[11px] text-[#94a3b8] font-mono mt-0.5 line-clamp-1">
                            {project.tagline}
                          </p>
                          <p className="text-xs text-[#cbd5e1] leading-relaxed line-clamp-2 mt-2">
                            {project.description}
                          </p>
                        </div>

                        <div>
                          {/* Tech Pills */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {techList.slice(0, 4).map((tech, i) => (
                              <span
                                key={i}
                                className="text-[10px] bg-[#121a22] border border-white/[0.08] text-[#94a3b8] px-2 py-0.5 rounded font-mono"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>

                          {/* Action Buttons */}
                          <div
                            className={`grid ${
                              hasLiveUrl ? "grid-cols-3" : "grid-cols-2"
                            } gap-1.5 pt-2 border-t border-white/[0.08]`}
                          >
                            <button
                              type="button"
                              onClick={() => setSelectedCaseProject(project)}
                              className="flex items-center justify-center gap-1 py-1.5 rounded-xl bg-[#eaeef1] hover:bg-white text-[#030508] text-xs font-bold transition-all cursor-pointer shadow-sm min-h-[36px]"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-[#c59b7b]" />
                              <span>View Project</span>
                            </button>

                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-1 py-1.5 rounded-xl bg-[#080d12] hover:bg-[#121a22] text-[#eaeef1] hover:text-white border border-white/10 text-xs font-semibold transition-all cursor-pointer shadow-sm min-h-[36px]"
                            >
                              <Github className="w-3.5 h-3.5" />
                              <span>Code</span>
                            </a>

                            {hasLiveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-1 py-1.5 rounded-xl bg-[#121a22] hover:bg-[#1a2530] text-[#eaeef1] hover:text-white border border-white/15 text-xs font-semibold transition-all cursor-pointer shadow-sm min-h-[36px]"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Live</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                // --------------------------------------------------------
                // INACTIVE SURROUNDING ORBIT HOLOGRAMS (Other 4 Projects)
                // --------------------------------------------------------
                return (
                  <div
                    key={project.id}
                    onClick={() => scrollToProject(idx)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        scrollToProject(idx);
                      }
                    }}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "48%",
                      transform: `translate3d(calc(-50% + ${slot.x}px), calc(-50% + ${slot.y}px), ${slot.z}px) scale(${slot.scale})`,
                      opacity: slot.opacity,
                      zIndex: slot.zIndex,
                      transition: "transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                      boxShadow: `0 0 20px -5px ${project.glowColor}, 0 10px 25px -8px rgba(0,0,0,0.8)`,
                      borderColor: "rgba(255, 255, 255, 0.12)",
                    }}
                    className="w-[230px] xl:w-[260px] h-[135px] xl:h-[150px] arch-card rounded-xl overflow-hidden border bg-[#080d12]/90 backdrop-blur-md pointer-events-auto cursor-pointer hover:scale-105 hover:border-white/30 transition-all duration-300 group flex flex-col justify-between p-3"
                    title={`Select ${project.title}`}
                  >
                    {/* Background Thumbnail with Dark Gradient */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover opacity-30 group-hover:opacity-45 transition-opacity duration-300"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080d12] via-[#080d12]/70 to-transparent pointer-events-none" />
                    </div>

                    {/* Top Badge: 01, 02, etc. */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider border backdrop-blur-md"
                        style={{
                          backgroundColor: "rgba(3, 5, 8, 0.85)",
                          borderColor: `${project.accentColor}60`,
                          color: project.accentColor,
                        }}
                      >
                        0{project.heroOrder}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 truncate max-w-[120px]">
                        {project.category}
                      </span>
                    </div>

                    {/* Title & Click hint */}
                    <div className="relative z-10">
                      <h4 className="text-sm xl:text-base font-bold text-white font-display group-hover:text-[#eaeef1] transition-colors leading-tight truncate">
                        {project.title}
                      </h4>
                      <div className="flex items-center justify-between mt-1 pt-1 border-t border-white/10 text-[10px] font-mono text-[#c59b7b]">
                        <span>Click to focus</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ---------------------------------------------------------- */}
          {/* MOBILE 3D CIRCULAR ORBIT SHOWCASE (< 1024px)              */}
          {/* Avatar in center, 5 project holograms orbiting in 3D       */}
          {/* ---------------------------------------------------------- */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="lg:hidden absolute inset-0 w-full h-full pointer-events-none select-none"
          >
            {/* Mobile 3D Tilted Elliptical Orbit Track around Avatar's Waist */}
            <div
              className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-10 w-[96vw] max-w-[390px] h-[220px]"
              style={{ transform: "rotateX(64deg) rotateZ(-3deg)" }}
            >
              <svg className="w-full h-full" viewBox="0 0 400 220">
                <defs>
                  <linearGradient id="orbitMobileGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.8" />
                    <stop offset="25%" stopColor="#818cf8" stopOpacity="0.5" />
                    <stop offset="50%" stopColor="#10b981" stopOpacity="0.7" />
                    <stop offset="75%" stopColor="#f97316" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#c084fc" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                <ellipse
                  cx="200"
                  cy="110"
                  rx="182"
                  ry="92"
                  fill="none"
                  stroke="url(#orbitMobileGradient)"
                  strokeWidth="1.5"
                  strokeDasharray="4 6"
                  opacity="0.65"
                />
              </svg>
            </div>

            {/* Orbiting 3D Cards Container on Mobile */}
            <div className="relative w-full h-full flex items-center justify-center">
              {projectsData.map((project, idx) => {
                const offset = (idx - activeIndex + projectsData.length) % projectsData.length;
                const slot = MOBILE_ORBIT_SLOTS[offset] || MOBILE_ORBIT_SLOTS[0];
                const isFront = slot.isFront;
                const hasLiveUrl = Boolean(project.liveUrl);
                const techList = project.technologies || project.tech || [];

                if (isFront) {
                  // ----------------------------------------------------
                  // MOBILE FRONT ACTIVE PROJECT CONSOLE
                  // ----------------------------------------------------
                  return (
                    <div
                      key={`mob-front-${project.id}`}
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "46%",
                        transform: `translate3d(calc(-50% + ${slot.x}px), calc(-50% + ${slot.y}px), ${slot.z}px) scale(${slot.scale})`,
                        opacity: slot.opacity,
                        zIndex: slot.zIndex,
                        transition: "transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease",
                        boxShadow: `0 0 25px -4px ${project.glowColor}, 0 20px 40px -10px rgba(0,0,0,0.92)`,
                        borderColor: `${project.accentColor}90`,
                      }}
                      className="w-[92vw] max-w-[350px] arch-card rounded-2xl overflow-hidden border bg-[#080d12]/95 backdrop-blur-xl pointer-events-auto p-3.5 flex flex-col justify-between"
                    >
                      <div>
                        {/* Header: Pulsing dot + Title + Category */}
                        <div className="flex items-center justify-between gap-1.5 mb-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span
                              className="w-2 h-2 rounded-full animate-pulse shrink-0"
                              style={{ backgroundColor: project.accentColor }}
                            />
                            <h3 className="text-base font-bold text-white font-display truncate">
                              {project.title}
                            </h3>
                          </div>
                          <span
                            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border shrink-0"
                            style={{
                              borderColor: `${project.accentColor}50`,
                              color: project.accentColor,
                              backgroundColor: project.badgeColor,
                            }}
                          >
                            0{project.heroOrder} // {project.category}
                          </span>
                        </div>

                        {/* Tagline */}
                        <p className="text-[11px] text-[#94a3b8] font-mono truncate">
                          {project.tagline}
                        </p>

                        {/* Description */}
                        <p className="text-[11px] text-[#cbd5e1] leading-relaxed line-clamp-2 mt-1.5 mb-2">
                          {project.description}
                        </p>

                        {/* Tech tags */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {techList.slice(0, 3).map((tech, i) => (
                            <span
                              key={i}
                              className="text-[9px] bg-[#121a22] border border-white/[0.08] text-[#94a3b8] px-2 py-0.5 rounded font-mono"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div
                        className={`grid ${
                          hasLiveUrl ? "grid-cols-3" : "grid-cols-2"
                        } gap-1.5 pt-2 border-t border-white/[0.08]`}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedCaseProject(project)}
                          className="flex items-center justify-center gap-1 py-1.5 rounded-xl bg-[#eaeef1] hover:bg-white text-[#030508] text-xs font-bold transition-all cursor-pointer shadow-sm min-h-[38px]"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-[#c59b7b]" />
                          <span>View</span>
                        </button>

                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1 py-1.5 rounded-xl bg-[#080d12] hover:bg-[#121a22] text-[#eaeef1] hover:text-white border border-white/10 text-xs font-semibold transition-all cursor-pointer shadow-sm min-h-[38px]"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Code</span>
                        </a>

                        {hasLiveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1 py-1.5 rounded-xl bg-[#121a22] hover:bg-[#1a2530] text-[#eaeef1] hover:text-white border border-white/15 text-xs font-semibold transition-all cursor-pointer shadow-sm min-h-[38px]"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Live</span>
                          </a>
                        )}
                      </div>
                    </div>
                  );
                }

                // --------------------------------------------------------
                // INACTIVE SURROUNDING MOBILE ORBIT HOLOGRAMS
                // --------------------------------------------------------
                return (
                  <div
                    key={`mob-orbit-${project.id}`}
                    onClick={() => scrollToProject(idx)}
                    role="button"
                    tabIndex={0}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "46%",
                      transform: `translate3d(calc(-50% + ${slot.x}px), calc(-50% + ${slot.y}px), ${slot.z}px) scale(${slot.scale})`,
                      opacity: slot.opacity,
                      zIndex: slot.zIndex,
                      transition: "transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                      boxShadow: `0 0 15px -3px ${project.glowColor}, 0 8px 18px -4px rgba(0,0,0,0.85)`,
                      borderColor: "rgba(255, 255, 255, 0.15)",
                    }}
                    className="w-[125px] sm:w-[140px] h-[78px] sm:h-[84px] arch-card rounded-xl overflow-hidden border bg-[#080d12]/90 backdrop-blur-md pointer-events-auto cursor-pointer p-2 flex flex-col justify-between group active:scale-95 transition-all"
                    title={`Select ${project.title}`}
                  >
                    {/* Background image preview with dark gradient */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover opacity-25"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080d12] via-[#080d12]/60 to-transparent pointer-events-none" />
                    </div>

                    <div className="relative z-10 flex items-center justify-between">
                      <span
                        className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border"
                        style={{
                          backgroundColor: "rgba(3, 5, 8, 0.9)",
                          borderColor: `${project.accentColor}60`,
                          color: project.accentColor,
                        }}
                      >
                        0{project.heroOrder}
                      </span>
                      <span className="text-[9px] font-mono text-zinc-400 truncate max-w-[70px]">
                        {project.category}
                      </span>
                    </div>

                    <div className="relative z-10">
                      <h4 className="text-xs font-bold text-white font-display truncate">
                        {project.title}
                      </h4>
                      <div className="flex items-center justify-between text-[9px] font-mono text-[#c59b7b] mt-0.5">
                        <span>Tap focus</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Floating Left & Right Navigation Arrows */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Project"
              className="absolute left-1.5 top-[54%] -translate-y-1/2 z-40 p-2 rounded-full border border-white/15 bg-[#080d12]/85 backdrop-blur-md text-[#eaeef1] active:scale-90 transition-all cursor-pointer shadow-xl min-w-[38px] min-h-[38px] flex items-center justify-center pointer-events-auto"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Project"
              className="absolute right-1.5 top-[54%] -translate-y-1/2 z-40 p-2 rounded-full border border-white/15 bg-[#080d12]/85 backdrop-blur-md text-[#eaeef1] active:scale-90 transition-all cursor-pointer shadow-xl min-w-[38px] min-h-[38px] flex items-center justify-center pointer-events-auto"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Mobile 5 Pagination Dots with Expanding Active Pill */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 bg-[#080d12]/95 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-xl pointer-events-auto">
              {projectsData.map((project, idx) => {
                const isCurrent = idx === activeIndex;
                return (
                  <button
                    key={`mob-dot-${project.id}`}
                    type="button"
                    onClick={() => scrollToProject(idx)}
                    aria-label={`Select project ${project.title}`}
                    className="transition-all duration-300 flex items-center gap-1 focus:outline-none cursor-pointer"
                  >
                    {isCurrent ? (
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border transition-all flex items-center gap-1 shadow-sm"
                        style={{
                          borderColor: project.accentColor,
                          backgroundColor: project.badgeColor,
                          color: "#eaeef1",
                          boxShadow: `0 0 10px -2px ${project.glowColor}`,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full animate-pulse"
                          style={{ backgroundColor: project.accentColor }}
                        />
                        <span>0{project.heroOrder} {project.title}</span>
                      </span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-white/25 hover:bg-white/60 transition-colors" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* DESKTOP NAVIGATION ARROWS (Left & Right) */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Project"
            className="hidden lg:flex absolute left-4 xl:left-8 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full border border-white/15 hover:border-white/40 bg-[#080d12]/85 hover:bg-[#121a22] backdrop-blur-md text-[#eaeef1] hover:text-white transition-all duration-200 cursor-pointer shadow-xl group focus:outline-none"
          >
            <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Project"
            className="hidden lg:flex absolute right-4 xl:right-8 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full border border-white/15 hover:border-white/40 bg-[#080d12]/85 hover:bg-[#121a22] backdrop-blur-md text-[#eaeef1] hover:text-white transition-all duration-200 cursor-pointer shadow-xl group focus:outline-none"
          >
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* DESKTOP 5 PAGINATION DOTS WITH EXPANDING ACTIVE PILL */}
          <div className="hidden lg:flex absolute bottom-3 xl:bottom-5 left-1/2 -translate-x-1/2 z-40 items-center gap-2 bg-[#080d12]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-xl">
            {projectsData.map((project, idx) => {
              const isCurrent = idx === activeIndex;
              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => scrollToProject(idx)}
                  aria-label={`Select project ${project.title}`}
                  className="transition-all duration-300 flex items-center gap-1.5 focus:outline-none cursor-pointer"
                >
                  {isCurrent ? (
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border transition-all flex items-center gap-1.5 shadow-sm"
                      style={{
                        borderColor: project.accentColor,
                        backgroundColor: project.badgeColor,
                        color: "#eaeef1",
                        boxShadow: `0 0 15px -3px ${project.glowColor}`,
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ backgroundColor: project.accentColor }}
                      />
                      <span>0{project.heroOrder} {project.title}</span>
                    </span>
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-white/25 hover:bg-white/60 transition-colors" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ---------------------------------------------------------- */}
        {/* Thin Vertical Stage Progress Indicator (Right Side)        */}
        {/* ---------------------------------------------------------- */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-end gap-5 pointer-events-none">
          {/* Track Line */}
          <div className="relative w-[2px] h-44 bg-white/10 rounded-full overflow-hidden">
            <div
              ref={progressBarRef}
              className="absolute top-0 left-0 w-full bg-[#c59b7b] rounded-full transition-all duration-75"
              style={{ height: "0%" }}
            />
          </div>
        </div>

        {/* ---------------------------------------------------------- */}
        {/* Debug Overlay (?debug=1 in URL)                            */}
        {/* ---------------------------------------------------------- */}
        {isDebug && (
          <div className="absolute top-20 left-4 z-50 p-3 rounded-xl arch-card border border-white/20 bg-[#080d12]/95 text-[11px] font-mono text-zinc-300 max-w-xs pointer-events-auto shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2 pb-1.5 mb-1.5 border-b border-white/10 font-bold text-[#c59b7b]">
              <Terminal className="w-3.5 h-3.5" />
              <span>COMMAND DECK DEBUG</span>
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
                Video Time:{" "}
                <span className="text-[#eaeef1] font-bold">
                  {debugData.videoTime.toFixed(2)}s / {durationRef.current.toFixed(2)}s
                </span>
              </div>
              <div>
                Decoder Seeking:{" "}
                <span
                  className={
                    debugData.seeking ? "text-amber-400 font-bold" : "text-emerald-400"
                  }
                >
                  {debugData.seeking ? "TRUE" : "IDLE"}
                </span>
              </div>
              <div>
                Stage:{" "}
                <span className="text-[#c59b7b] font-bold uppercase">
                  {debugData.stage}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Shared Case Study Modal for Card clicks */}
        <CaseStudyModal
          project={selectedCaseProject}
          onClose={() => setSelectedCaseProject(null)}
        />
      </div>
    </section>
  );
}
