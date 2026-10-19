import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Terminal } from "lucide-react";
import { personalInfo } from "../data/personalInfo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const progressBarRef = useRef(null);
  const scrolledRef = useRef(false);
  const activeSectionRef = useRef("home");

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
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const isOver20 = scrollY > 20;
          if (isOver20 !== scrolledRef.current) {
            scrolledRef.current = isOver20;
            setScrolled(isOver20);
          }

          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrolledPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${scrolledPercent}%`;
          }

          const scrollPosition = scrollY + 140;
          for (let i = 0; i < navItems.length; i++) {
            const section = document.getElementById(navItems[i].id);
            if (section) {
              const offsetTop = section.offsetTop;
              const offsetHeight = section.offsetHeight;
              if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                if (navItems[i].id !== activeSectionRef.current) {
                  activeSectionRef.current = navItems[i].id;
                  setActiveSection(navItems[i].id);
                }
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navItems]);

  const scrollTo = (id) => {
    setIsOpen(false);

    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
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
        scrolled
          ? "bg-[#030508]/85 backdrop-blur-xl border-b border-white/[0.07] shadow-xl shadow-black/40"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* Precision Scroll Progress Indicator */}
      <div
        ref={progressBarRef}
        className="absolute bottom-0 left-0 h-[1.5px] bg-[#c59b7b] transition-[width] duration-75"
        style={{ width: "0%" }}
      />

      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Architectural Logo */}
        <button
          onClick={() => scrollTo("home")}
          className="flex items-center gap-2.5 cursor-pointer font-display text-base font-semibold tracking-tight text-[#eaeef1] hover:text-white transition-colors focus:outline-none"
        >
          <div className="p-1.5 rounded-lg bg-[#080d12] border border-white/10 text-[#eaeef1] shadow-sm">
            <Terminal className="w-4 h-4 text-[#c59b7b]" />
          </div>
          <span>
            {personalInfo.firstName}
            <span className="text-[#c59b7b] font-bold ml-1">.</span>
          </span>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs uppercase tracking-wider font-medium transition-all duration-200 cursor-pointer select-none focus:outline-none relative ${
                activeSection === item.id
                  ? "text-[#eaeef1] font-semibold"
                  : "text-[#94a3b8] hover:text-[#eaeef1]"
              }`}
            >
              {activeSection === item.id && (
                <motion.span
                  layoutId="activeNavBackground"
                  className="absolute inset-0 bg-white/[0.07] rounded-lg border border-white/[0.09]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:block">
          <button
            onClick={() => scrollTo("contact")}
            className="px-4 py-2 rounded-lg bg-[#121a22] hover:bg-[#1a2530] text-[#eaeef1] hover:text-white border border-white/10 hover:border-white/20 text-xs font-medium tracking-wide uppercase transition-all duration-200 cursor-pointer focus:outline-none"
          >
            Get In Touch
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2.5 rounded-xl text-[#94a3b8] hover:text-[#eaeef1] hover:bg-white/5 focus:outline-none min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
          aria-label="Toggle Navigation"
        >
          {isOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-[#05080c]/98 backdrop-blur-2xl border-t border-white/[0.08] shadow-2xl overflow-y-auto max-h-[calc(100dvh-5rem)]"
          >
            <div className="px-5 py-5 flex flex-col gap-1.5">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`w-full py-3 px-4 rounded-xl text-left text-sm font-medium transition-all duration-150 cursor-pointer flex items-center justify-between min-h-[44px] ${
                    activeSection === item.id
                      ? "bg-white/[0.08] border border-white/10 text-white font-semibold"
                      : "text-[#94a3b8] hover:text-[#eaeef1] hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <span>{item.label}</span>
                  {activeSection === item.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c59b7b]" />
                  )}
                </button>
              ))}
              <button
                onClick={() => scrollTo("contact")}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-[#c59b7b] hover:bg-[#d6ad8d] text-[#030508] text-center font-bold text-xs tracking-wider uppercase shadow-md cursor-pointer transition-colors min-h-[44px]"
              >
                Get In Touch
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
