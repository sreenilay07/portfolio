import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Terminal } from "lucide-react";
import { personalInfo } from "../data/personalInfo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const navItems = useMemo(
    () => [
      { label: "Home", id: "home" },
      { label: "About", id: "about" },
      { label: "Skills", id: "skills" },
      { label: "Projects", id: "projects" },
      { label: "Timeline", id: "education" },
      { label: "Certifications", id: "certifications" },
      { label: "Achievements", id: "achievements" },
      { label: "Contact", id: "contact" },
    ],
    []
  );

  useEffect(() => {
    const handleScroll = () => {
      // Background blur trigger
      setScrolled(window.scrollY > 20);

      // Scroll progress indicator
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolledPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(scrolledPercent);

      // Active section calculation
      const sections = navItems.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 120;

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (section) {
          const offsetTop = section.offsetTop;
          const offsetHeight = section.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(navItems[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navItems]);

  const scrollTo = (id) => {
    setIsOpen(false);

    // If target is "projects" and 3D HeroStage is active on desktop, scroll to ~0.62 progress
    if (id === "projects") {
      const homeEl = document.getElementById("home");
      if (homeEl && homeEl.offsetHeight > window.innerHeight * 2) {
        const stageTop = homeEl.getBoundingClientRect().top + window.scrollY;
        const totalTrack = homeEl.offsetHeight - window.innerHeight;
        const targetY = stageTop + 0.62 * totalTrack;
        window.scrollTo({
          top: targetY,
          behavior: "smooth",
        });
        return;
      }
    }

    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of navbar
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? "glass-nav shadow-lg" : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* Scroll Progress Bar */}
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-violet-600 via-cyan-500 to-emerald-400"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => scrollTo("home")}
          className="flex items-center gap-2 cursor-pointer font-display text-lg font-bold tracking-tight text-white focus:outline-none"
        >
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-500 text-white shadow-md">
            <Terminal className="w-5 h-5" />
          </div>
          <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            {personalInfo.firstName}
            <span className="text-violet-500 font-extrabold ml-1">.</span>
          </span>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer select-none focus:outline-none relative ${
                activeSection === item.id ? "text-violet-400 font-semibold" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {activeSection === item.id && (
                <motion.span
                  layoutId="activeNavBackground"
                  className="absolute inset-0 bg-white/5 rounded-lg border border-white/5"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {item.label}
            </button>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:block">
          <button
            onClick={() => scrollTo("contact")}
            className="px-5 py-2.5 rounded-xl bg-violet-600/10 hover:bg-violet-600 hover:text-white border border-violet-500/30 hover:border-violet-500 text-violet-400 text-sm font-medium transition-all duration-300 cursor-pointer focus:outline-none"
          >
            Hire Me
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/5 focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass-nav border-t border-white/5 shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`w-full py-3 px-4 rounded-xl text-left text-base font-medium transition-all duration-200 cursor-pointer ${
                    activeSection === item.id
                      ? "bg-violet-600/10 border border-violet-500/20 text-violet-400"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => scrollTo("contact")}
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-violet-600 text-white text-center font-semibold text-base shadow-lg cursor-pointer"
              >
                Hire Me
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
