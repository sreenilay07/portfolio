import React from "react";
import { Terminal, Github, Linkedin, Mail } from "lucide-react";
import { personalInfo } from "../data/personalInfo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth"
      });
    }
  };

  const navLinks = [
    { label: "Home", id: "home" },
    { label: "About", id: "about" },
    { label: "Skills", id: "skills" },
    { label: "Projects", id: "projects" },
    { label: "Timeline", id: "education" },
    { label: "Certifications", id: "certifications" },
    { label: "Achievements", id: "achievements" },
    { label: "Contact", id: "contact" }
  ];

  return (
    <footer className="border-t border-white/5 bg-zinc-950 py-12 relative overflow-hidden select-none">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative z-20">
        
        {/* Left Column: Logo & Tagline */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
          <button
            onClick={() => handleScrollTo("home")}
            className="flex items-center gap-2 cursor-pointer font-display text-lg font-bold tracking-tight text-white focus:outline-none"
          >
            <div className="p-1 rounded bg-gradient-to-tr from-violet-600 to-cyan-500 text-white shadow-md">
              <Terminal className="w-4.5 h-4.5" />
            </div>
            <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              {personalInfo.firstName}
              <span className="text-violet-500 font-extrabold">.</span>
            </span>
          </button>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xs italic leading-relaxed">
            Building intelligent software that creates real-world impact.
          </p>
        </div>

        {/* Center Column: Quick Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 max-w-sm mx-auto">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleScrollTo(link.id)}
              className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer focus:outline-none"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right Column: Social / Copyright */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right gap-4">
          {/* Social icons */}
          <div className="flex items-center gap-3">
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all shadow-md"
            >
              <Github className="w-4.5 h-4.5" />
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-sky-400 transition-all shadow-md"
            >
              <Linkedin className="w-4.5 h-4.5" />
            </a>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=sreenilayreddy@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-emerald-400 transition-all shadow-md"
            >
              <Mail className="w-4.5 h-4.5" />
            </a>
          </div>

          <div className="text-[11px] font-mono text-zinc-500">
            &copy; {currentYear} {personalInfo.name}. All Rights Reserved.
          </div>
        </div>

      </div>
    </footer>
  );
}
