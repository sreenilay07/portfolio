import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight, Download, Eye, FileText, Code2, Database, BrainCircuit, Github, Linkedin, Mail } from "lucide-react";
import { personalInfo } from "../data/personalInfo";

export default function Hero({ onOpenResume }) {
  // Custom Typewriter Hook Logic
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
          setSpeed(2000); // pause at peak
        } else {
          setSpeed(80 + Math.random() * 40); // typing speed
        }
      } else {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        if (currentText === "") {
          setIsDeleting(false);
          setTitleIndex((prev) => (prev + 1) % personalInfo.titles.length);
          setSpeed(500); // pause before next word
        } else {
          setSpeed(45); // deletion speed
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, titleIndex, speed]);

  // Mouse Parallax Effect for the Avatar / Hero Section
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

  // Card rotational transforms based on mouse coordinates
  const rotateX = useTransform(mouseY, [-200, 200], [10, -10]);
  const rotateY = useTransform(mouseX, [-200, 200], [-10, 10]);

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
      className="relative min-h-[95vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-gradient-grid"
    >
      {/* Decorative ambient glowing backdrops */}
      <div className="absolute top-1/4 left-0 sm:left-1/3 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-violet-600/10 blur-3xl opacity-40 pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-0 sm:right-1/4 w-64 sm:w-[450px] h-64 sm:h-[450px] rounded-full bg-cyan-500/10 blur-3xl opacity-30 pointer-events-none animate-pulse-glow" style={{ animationDelay: "2s" }} />
      <div className="absolute top-10 right-0 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-rose-500/5 blur-3xl opacity-20 pointer-events-none animate-pulse-glow" style={{ animationDelay: "1s" }} />

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-20">
        
        {/* Left Side Column: Copy & Actions */}
        <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 self-center lg:self-start px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/5 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-6"
          >
            <BrainCircuit className="w-3.5 h-3.5 animate-pulse text-violet-400" />
            <span>AI Engineer & Full-Stack Developer</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-display leading-[1.1] tracking-tight mb-4"
          >
            Hi, I'm <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">{personalInfo.name}</span>
          </motion.h1>

          {/* Typewriter Rotating Roles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-10 sm:h-12 flex items-center justify-center lg:justify-start mb-6"
          >
            <span className="text-xl sm:text-2xl font-mono text-zinc-300">
              I build as a{" "}
              <span className="text-cyan-400 font-bold typewriter-cursor pb-1 border-b border-cyan-400/30">
                {currentText}
              </span>
            </span>
          </motion.div>

          {/* Taglines / Descriptions */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg font-medium text-violet-200/80 mb-2 max-w-2xl leading-relaxed font-sans"
          >
            {personalInfo.heroTagline}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm sm:text-base text-zinc-400 mb-8 max-w-2xl leading-relaxed"
          >
            {personalInfo.heroDescription}
          </motion.p>

          {/* Buttons Block */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4"
          >
            {/* Primary Action */}
            <button
              onClick={() => scrollIntoSection("projects")}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold shadow-lg hover:shadow-violet-500/20 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer focus:outline-none"
            >
              Explore Projects
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Resume Viewer */}
            <button
              onClick={onOpenResume}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl glass-panel text-white hover:text-cyan-400 hover:border-cyan-500/50 font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
            >
              <Eye className="w-4 h-4 text-cyan-400" />
              View Resume
            </button>

            {/* Resume Download */}
            <a
              href={personalInfo.resumeUrl}
              download="Minumula_Sree_Nilay_Reddy_Resume.pdf"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-zinc-900 border border-white/5 hover:border-violet-500/30 text-zinc-300 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
            >
              <Download className="w-4 h-4 text-violet-400" />
              Download Resume
            </a>

            {/* Contact scroll */}
            <button
              onClick={() => scrollIntoSection("contact")}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-dashed border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-zinc-200 transition-all duration-300 flex items-center justify-center cursor-pointer focus:outline-none"
            >
              Contact Me
            </button>
          </motion.div>

          {/* Socials quick links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center lg:justify-start gap-4 mt-8"
          >
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 hover:text-white transition-all shadow-md hover:scale-115"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 hover:text-sky-400 transition-all shadow-md hover:scale-115"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=sreenilayreddy@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 hover:text-emerald-400 transition-all shadow-md hover:scale-115"
            >
              <Mail className="w-5 h-5" />
            </a>
          </motion.div>
        </div>

        {/* Right Side Column: Image Frame with Parallax and Hover Ornaments */}
        <div className="lg:col-span-5 flex justify-center items-center mt-12 lg:mt-0">
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative w-64 sm:w-80 h-80 sm:h-[420px] select-none group max-w-[85vw]"
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          >
            {/* Background glowing rings */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-violet-600 to-cyan-500 opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500" />
            <div className="absolute inset-0 rounded-3xl border border-white/10 bg-zinc-950/60 p-4 shadow-2xl glass-panel">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-zinc-900 border border-white/5">
                <img
                  src={personalInfo.avatarUrl}
                  alt={personalInfo.name}
                  className="w-full h-full object-cover object-top grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"; // fallback profile image
                  }}
                />
                
                {/* Image Glass overlay grid */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/0 to-zinc-950/10 pointer-events-none" />
              </div>
            </div>

            {/* Floating Ornaments */}
            <motion.div
              style={{ translateZ: 50 }}
              className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 p-2 sm:p-3 rounded-2xl glass-panel border border-violet-500/30 text-violet-400 shadow-lg animate-float z-10"
            >
              <BrainCircuit className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.div>

            <motion.div
              style={{ translateZ: 60 }}
              className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 p-2 sm:p-3 rounded-2xl glass-panel border border-cyan-500/30 text-cyan-400 shadow-lg animate-float-delayed z-10"
            >
              <Code2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.div>

            <motion.div
              style={{ translateZ: 40 }}
              className="absolute bottom-1/2 -right-4 sm:-right-8 p-2 rounded-xl glass-panel border border-rose-500/20 text-rose-400 shadow-md hidden sm:block z-10"
            >
              <Database className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
