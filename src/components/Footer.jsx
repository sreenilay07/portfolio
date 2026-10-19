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
    <footer className="border-t border-white/[0.08] bg-[#030508] py-14 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative z-20">
        
        {/* Left Column: Logo & Tagline */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
          <button
            onClick={() => handleScrollTo("home")}
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
          <p className="text-xs text-[#94a3b8] max-w-xs leading-relaxed">
            Building intelligent software that creates real-world impact.
          </p>
        </div>

        {/* Center Column: Quick Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 max-w-sm mx-auto">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleScrollTo(link.id)}
              className="text-xs text-[#94a3b8] hover:text-[#eaeef1] transition-colors cursor-pointer focus:outline-none uppercase tracking-wider font-mono"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right Column: Social / Copyright */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right gap-3.5">
          {/* Social icons */}
          <div className="flex items-center gap-2.5">
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="p-2 rounded-lg bg-[#080d12] hover:bg-[#121a22] border border-white/[0.08] text-[#94a3b8] hover:text-[#eaeef1] transition-all"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="p-2 rounded-lg bg-[#080d12] hover:bg-[#121a22] border border-white/[0.08] text-[#94a3b8] hover:text-[#eaeef1] transition-all"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=sreenilayreddy@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Email Minumula Sree Nilay Reddy"
              className="p-2 rounded-lg bg-[#080d12] hover:bg-[#121a22] border border-white/[0.08] text-[#94a3b8] hover:text-[#eaeef1] transition-all"
            >
              <Mail className="w-4 h-4" />
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
