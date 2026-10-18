import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, X, Check, Code, Settings, Server } from "lucide-react";

/**
 * CaseStudyModal
 * Reusable modal for displaying project architecture and case study details.
 * Shared between Projects grid and HeroStage 3D holographic cards.
 * Supports Escape key, backdrop click, and close button.
 */
export default function CaseStudyModal({ project, onClose }) {
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "unset";
    }
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          {/* Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/85 backdrop-blur-md cursor-pointer"
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
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover opacity-60"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />

              {/* Close button with high visibility */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="absolute top-4 right-4 z-20 p-2.5 bg-zinc-950/90 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-full border border-white/20 transition-all focus:outline-none cursor-pointer shadow-lg hover:scale-105"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Banner Titles */}
              <div className="absolute bottom-6 left-6 sm:left-8">
                <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                  {project.title}
                </h3>
                <p className="text-xs sm:text-sm text-cyan-400 font-mono mt-1">
                  {project.tagline}
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
                  {project.features?.map((feature, i) => (
                    <li key={i} className="flex gap-2 items-start">
                      <Check className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Problem & Solution Cards */}
              {project.caseStudy && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-zinc-950/50 border border-white/5 p-5 rounded-xl space-y-2">
                      <h5 className="font-bold text-base font-display text-rose-400">
                        The Problem
                      </h5>
                      <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                        {project.caseStudy.problem}
                      </p>
                    </div>

                    <div className="bg-zinc-950/50 border border-white/5 p-5 rounded-xl space-y-2">
                      <h5 className="font-bold text-base font-display text-emerald-400">
                        The Solution
                      </h5>
                      <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                        {project.caseStudy.solution}
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
                      {project.caseStudy.architecture}
                    </p>
                  </div>

                  {/* Technical Challenges */}
                  <div className="space-y-3">
                    <h4 className="text-white font-bold text-lg font-display flex items-center gap-2">
                      <Settings className="w-5 h-5 text-rose-400" />
                      Engineering Challenges Resolved
                    </h4>
                    <ul className="space-y-2.5">
                      {project.caseStudy.challenges?.map((challenge, i) => (
                        <li
                          key={i}
                          className="text-zinc-400 text-sm leading-relaxed bg-zinc-950/30 p-3 rounded-lg border-l-2 border-violet-500 pl-4"
                        >
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {/* Full Tech Stack utilized */}
              <div className="space-y-2 border-t border-white/5 pt-6">
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block">
                  Technological Stack
                </span>
                <div className="flex flex-wrap gap-2">
                  {project.tech?.map((t, idx) => (
                    <span
                      key={idx}
                      className="bg-zinc-950 border border-white/10 text-zinc-300 font-mono text-xs px-3 py-1 rounded-lg"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Link row */}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-sm border border-white/5 flex items-center gap-2 shadow cursor-pointer transition-all"
                >
                  <Github className="w-4 h-4" />
                  Explore Repository Code
                </a>
                <a
                  href={project.liveUrl}
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
  );
}
