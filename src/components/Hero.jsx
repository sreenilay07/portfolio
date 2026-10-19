import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight, Download, Eye, Terminal, Github, Linkedin, Mail } from "lucide-react";
import { personalInfo } from "../data/personalInfo";

export default function Hero({ onOpenResume }) {
  const [titleIndex, setTitleIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(150);

  useEffect(() => {
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
  }, [currentText, isDeleting, titleIndex, speed]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const rotateX = useTransform(mouseY, [-200, 200], [6, -6]);
  const rotateY = useTransform(mouseX, [-200, 200], [-6, 6]);

  const scrollIntoSection = (id) => {
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

  return (
    <section
      id="home"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden bg-[#030508]"
    >
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-20">
        
        {/* Left Side Column: Copy & Actions */}
        <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left">
          {/* Subtle Role Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 self-center lg:self-start px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-[#080d12] text-[#c59b7b] text-xs font-mono font-medium tracking-wider uppercase mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#c59b7b]" />
            <span>AI Engineer &amp; Full-Stack Developer</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-display leading-[1.1] tracking-tight mb-4 text-[#eaeef1]"
          >
            Hi, I&apos;m{" "}
            <span className="text-white">
              {personalInfo.name}
            </span>
          </motion.h1>

          {/* Typewriter Rotating Roles */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-10 sm:h-12 flex items-center justify-center lg:justify-start mb-6"
          >
            <span className="text-xl sm:text-2xl font-mono text-[#94a3b8]">
              I build as a{" "}
              <span className="text-[#eaeef1] font-semibold border-b border-[#c59b7b]/50 pb-0.5">
                {currentText}
              </span>
            </span>
          </motion.div>

          {/* Taglines / Descriptions */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-base sm:text-lg font-normal text-[#eaeef1] mb-2 max-w-2xl leading-relaxed"
          >
            {personalInfo.heroTagline}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-sm sm:text-base text-[#94a3b8] mb-8 max-w-2xl leading-relaxed"
          >
            {personalInfo.heroDescription}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3.5"
          >
            <button
              onClick={() => scrollIntoSection("projects")}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#eaeef1] hover:bg-white text-[#030508] font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer focus:outline-none shadow-md"
            >
              Explore Projects
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={onOpenResume}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#080d12] hover:bg-[#121a22] text-[#eaeef1] hover:text-white border border-white/10 hover:border-white/20 font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
            >
              <Eye className="w-4 h-4 text-[#c59b7b]" />
              View Resume
            </button>

            <a
              href={personalInfo.resumeUrl}
              download="Minumula_Sree_Nilay_Reddy_Resume.pdf"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#080d12] hover:bg-[#121a22] text-[#94a3b8] hover:text-[#eaeef1] border border-white/[0.08] text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
            >
              <Download className="w-4 h-4" />
              Download Resume
            </a>
          </motion.div>

          {/* Socials quick links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center lg:justify-start gap-3 mt-8"
          >
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="p-2.5 rounded-lg bg-[#080d12] hover:bg-[#121a22] border border-white/[0.08] text-[#94a3b8] hover:text-[#eaeef1] transition-all"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="p-2.5 rounded-lg bg-[#080d12] hover:bg-[#121a22] border border-white/[0.08] text-[#94a3b8] hover:text-[#eaeef1] transition-all"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=sreenilayreddy@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Email Minumula Sree Nilay Reddy"
              className="p-2.5 rounded-lg bg-[#080d12] hover:bg-[#121a22] border border-white/[0.08] text-[#94a3b8] hover:text-[#eaeef1] transition-all"
            >
              <Mail className="w-4 h-4" />
            </a>
          </motion.div>
        </div>

        {/* Right Side Column: Image Frame with Architectural Border */}
        <div className="lg:col-span-5 flex justify-center items-center mt-10 lg:mt-0">
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative w-64 sm:w-80 h-80 sm:h-[420px] select-none group max-w-[85vw]"
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          >
            <div className="absolute inset-0 rounded-2xl border border-white/[0.09] bg-[#080d12] p-3 shadow-2xl">
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#05080c] border border-white/[0.06]">
                <img
                  src={personalInfo.avatarUrl}
                  alt={personalInfo.name}
                  className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-102 transition-all duration-500"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030508]/80 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
