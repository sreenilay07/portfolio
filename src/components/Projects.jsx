import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, BookOpen, X, Check, Code, Settings, Server } from "lucide-react";
import { projectsData } from "../data/projects";

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);

  // Block body scroll when modal is active
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedProject]);

  return (
    <section id="projects" className="py-20 relative bg-zinc-950/20">
      <div className="absolute top-1/2 left-0 sm:left-1/3 w-64 sm:w-[500px] h-64 sm:h-[500px] rounded-full bg-violet-600/5 blur-3xl pointer-events-none max-w-[100vw]" />
      <div className="absolute bottom-0 right-0 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-20">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold font-display text-white"
          >
            Featured Productions
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-[3px] w-20 bg-gradient-to-r from-violet-600 to-cyan-500 mx-auto mt-4 rounded-full"
          />
          <p className="text-zinc-500 text-xs sm:text-sm mt-4 max-w-xl mx-auto font-medium">
            Real-world AI products and intelligent full-stack applications. Click "View Case Study" to check the design architecture.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="glass-panel rounded-2xl overflow-hidden border border-white/5 flex flex-col h-full group hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300"
            >
              {/* Cover Image */}
              <div className="relative h-48 overflow-hidden bg-zinc-900 border-b border-white/5">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800"; // fallback code design image
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 to-transparent" />
                <span className="absolute top-4 right-4 bg-zinc-950/85 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-semibold font-mono text-cyan-400 tracking-wider">
                  {project.tech[0]} // {project.tech[1]}
                </span>
              </div>

              {/* Info content */}
              <div className="p-6 flex flex-col flex-grow space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white font-display leading-snug group-hover:text-violet-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono mt-1 italic">
                    {project.tagline}
                  </p>
                </div>

                <p className="text-zinc-400 text-sm leading-relaxed flex-grow">
                  {project.description}
                </p>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.tech.slice(0, 4).map((t, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-zinc-900 border border-white/5 text-zinc-400 px-2 py-0.5 rounded-md font-mono"
                    >
                      {t}
                    </span>
                  ))}
                  {project.tech.length > 4 && (
                    <span className="text-[11px] bg-zinc-900 border border-white/5 text-zinc-500 px-2 py-0.5 rounded-md font-mono">
                      +{project.tech.length - 4} more
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col min-[400px]:grid min-[400px]:grid-cols-3 gap-2 pt-4 border-t border-white/5">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/5 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Github className="w-3.5 h-3.5" />
                    Code
                  </a>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-violet-600/10 hover:bg-violet-600 hover:text-white border border-violet-500/20 text-violet-400 hover:border-violet-500 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Live
                  </a>
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-dashed border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-zinc-200 text-xs font-semibold transition-all cursor-pointer focus:outline-none"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    Case
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Case Study Modal Overlays */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              
              {/* Overlay Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProject(null)}
                className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="relative bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl z-10 select-text"
              >
                
                {/* Header Cover Banner */}
                <div className="relative h-48 sm:h-64 bg-zinc-950">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover opacity-60"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                  
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-4 right-4 p-2 bg-zinc-950/80 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full border border-white/10 transition-colors focus:outline-none cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Banner Titles */}
                  <div className="absolute bottom-6 left-6 sm:left-8">
                    <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                      {selectedProject.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-cyan-400 font-mono mt-1">
                      {selectedProject.tagline}
                    </p>
                  </div>
                </div>

                {/* Case Study Content Body */}
                <div className="p-6 sm:p-8 space-y-8">
                  
                  {/* Features List */}
                  <div className="space-y-3">
                    <h4 className="text-white font-bold text-lg font-display flex items-center gap-2">
                      <Code className="w-5 h-5 text-violet-400" />
                      Core Features
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-zinc-400">
                      {selectedProject.features.map((feature, i) => (
                        <li key={i} className="flex gap-2 items-start">
                          <Check className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Problem & Solution Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-zinc-950/50 border border-white/5 p-5 rounded-xl space-y-2">
                      <h5 className="text-zinc-200 font-bold text-base font-display text-rose-400">The Problem</h5>
                      <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                        {selectedProject.caseStudy.problem}
                      </p>
                    </div>

                    <div className="bg-zinc-950/50 border border-white/5 p-5 rounded-xl space-y-2">
                      <h5 className="text-zinc-200 font-bold text-base font-display text-emerald-400">The Solution</h5>
                      <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                        {selectedProject.caseStudy.solution}
                      </p>
                    </div>
                  </div>

                  {/* Technical Architecture */}
                  <div className="space-y-3">
                    <h4 className="text-white font-bold text-lg font-display flex items-center gap-2">
                      <Server className="w-5 h-5 text-cyan-400" />
                      System Architecture
                    </h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      {selectedProject.caseStudy.architecture}
                    </p>
                  </div>

                  {/* Technical Challenges */}
                  <div className="space-y-3">
                    <h4 className="text-white font-bold text-lg font-display flex items-center gap-2">
                      <Settings className="w-5 h-5 text-rose-400" />
                      Engineering Challenges Resolved
                    </h4>
                    <ul className="space-y-2.5">
                      {selectedProject.caseStudy.challenges.map((challenge, i) => (
                        <li key={i} className="text-zinc-400 text-sm leading-relaxed bg-zinc-950/30 p-3 rounded-lg border-l-2 border-violet-500 pl-4">
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Full Tech Stack utilized */}
                  <div className="space-y-2 border-t border-white/5 pt-6">
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block">Technological Stack</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tech.map((t, idx) => (
                        <span key={idx} className="bg-zinc-950 border border-white/10 text-zinc-300 font-mono text-xs px-3 py-1 rounded-lg">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Link row */}
                  <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-sm border border-white/5 flex items-center gap-2 shadow cursor-pointer transition-all"
                    >
                      <Github className="w-4 h-4" />
                      Explore Repository Code
                    </a>
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-violet-500/10 cursor-pointer transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Launch Application Demo
                    </a>
                  </div>

                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
