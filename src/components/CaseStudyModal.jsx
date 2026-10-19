import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, X, Check, Code, Settings, Server, Users, UserCheck } from "lucide-react";

/**
 * CaseStudyModal
 * Reusable modal for displaying project architecture and case study details.
 * Rendered directly to document.body via createPortal to guarantee top-level
 * stacking context across all mobile and desktop viewports.
 */
export default function CaseStudyModal({ project, onClose }) {
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.stop();
      }
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        if (typeof window !== "undefined" && window.__lenis) {
          window.__lenis.start();
        }
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "unset";
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.start();
      }
    }
  }, [project, onClose]);

  const modalContent = (
    <AnimatePresence>
      {project && (
        <div
          data-lenis-prevent
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          onWheel={(e) => e.stopPropagation()}
          className="fixed inset-0 z-[999] flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto"
        >
          {/* Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#030508]/90 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            data-lenis-prevent
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", damping: 25, stiffness: 240 }}
            onWheel={(e) => e.stopPropagation()}
            className="relative bg-[#080d12] border border-white/[0.14] rounded-2xl w-full max-w-4xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl z-10 select-text"
          >
            {/* Header Cover Banner */}
            <div className="relative h-44 sm:h-64 bg-[#05080c]">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover opacity-60"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080d12] via-[#080d12]/60 to-transparent" />

              {/* Close button (min 44px touch target) */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 p-2.5 sm:p-3 bg-[#030508]/90 hover:bg-[#121a22] text-[#eaeef1] hover:text-white rounded-full border border-white/20 transition-all focus:outline-none cursor-pointer shadow-xl flex items-center justify-center min-w-[44px] min-h-[44px]"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Banner Titles & Role Badges */}
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-8 right-16 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 text-zinc-300 font-semibold">
                    {project.category || "Featured Production"}
                  </span>
                  {project.role && (
                    <span className="text-[10px] sm:text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#c59b7b]/15 border border-[#c59b7b]/30 text-[#c59b7b] font-medium flex items-center gap-1.5">
                      <Users className="w-3 h-3" />
                      <span>{project.role}</span>
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-3xl font-extrabold font-display text-[#eaeef1] leading-tight">
                  {project.title}
                </h3>
                <p className="text-[11px] sm:text-sm text-[#c59b7b] font-mono">
                  {project.tagline}
                </p>
              </div>
            </div>

            {/* Case Study Content Body */}
            <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
              {/* Features List */}
              <div className="space-y-2.5">
                <h4 className="text-[#eaeef1] font-bold text-sm sm:text-base font-display flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#c59b7b]" />
                  Core Capabilities &amp; Features
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-[#94a3b8]">
                  {project.features?.map((feature, i) => (
                    <li key={i} className="flex gap-2 items-start bg-[#05080c]/60 p-2 sm:p-2.5 rounded-xl border border-white/[0.04]">
                      <Check className="w-4 h-4 text-[#c59b7b] shrink-0 mt-0.5" />
                      <span className="text-[#eaeef1]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Problem & Solution Cards */}
              {project.caseStudy && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-[#05080c] border border-white/[0.06] p-4 sm:p-5 rounded-xl space-y-1.5 sm:space-y-2">
                      <h5 className="font-bold text-xs sm:text-sm font-display text-[#eaeef1] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-400" />
                        The Problem
                      </h5>
                      <p className="text-[#94a3b8] text-xs sm:text-sm leading-relaxed">
                        {project.caseStudy.problem}
                      </p>
                    </div>

                    <div className="bg-[#05080c] border border-white/[0.06] p-4 sm:p-5 rounded-xl space-y-1.5 sm:space-y-2">
                      <h5 className="font-bold text-xs sm:text-sm font-display text-[#eaeef1] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        The Solution
                      </h5>
                      <p className="text-[#94a3b8] text-xs sm:text-sm leading-relaxed">
                        {project.caseStudy.solution}
                      </p>
                    </div>
                  </div>

                  {/* My Contribution (Explicit for Team projects like Loopers) */}
                  {project.caseStudy.myContribution && (
                    <div className="bg-[#05080c] border border-[#c59b7b]/20 p-4 sm:p-5 rounded-xl space-y-2">
                      <h5 className="font-bold text-xs sm:text-sm font-display text-[#eaeef1] flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-[#c59b7b]" />
                        Individual Role &amp; Contribution
                      </h5>
                      <p className="text-[#94a3b8] text-xs sm:text-sm leading-relaxed">
                        {project.caseStudy.myContribution}
                      </p>
                    </div>
                  )}

                  {/* Technical Architecture */}
                  <div className="space-y-2">
                    <h4 className="text-[#eaeef1] font-bold text-sm sm:text-base font-display flex items-center gap-2">
                      <Server className="w-4 h-4 text-[#94a3b8]" />
                      System Architecture
                    </h4>
                    <p className="text-[#94a3b8] text-xs sm:text-sm leading-relaxed bg-[#05080c] p-3.5 sm:p-4 rounded-xl border border-white/[0.06]">
                      {project.caseStudy.architecture}
                    </p>
                  </div>

                  {/* Technical Challenges */}
                  <div className="space-y-2.5">
                    <h4 className="text-[#eaeef1] font-bold text-sm sm:text-base font-display flex items-center gap-2">
                      <Settings className="w-4 h-4 text-[#c59b7b]" />
                      Engineering Challenges Resolved
                    </h4>
                    <ul className="space-y-2">
                      {project.caseStudy.challenges?.map((challenge, i) => (
                        <li
                          key={i}
                          className="text-[#94a3b8] text-xs sm:text-sm leading-relaxed bg-[#05080c] p-3 rounded-xl border-l-2 border-[#c59b7b] pl-3.5 sm:pl-4 border border-white/[0.04]"
                        >
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {/* Full Tech Stack utilized */}
              <div className="space-y-2 border-t border-white/[0.06] pt-4 sm:pt-6">
                <span className="text-[10px] sm:text-[11px] font-mono text-zinc-500 uppercase tracking-wider block">
                  Technological Stack
                </span>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {(project.technologies || project.tech)?.map((t, idx) => (
                    <span
                      key={idx}
                      className="bg-[#121a22] border border-white/[0.07] text-[#94a3b8] font-mono text-[11px] sm:text-xs px-2.5 py-1 rounded-lg"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Link row */}
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-4 border-t border-white/[0.06]">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#05080c] hover:bg-[#121a22] text-[#eaeef1] font-semibold text-xs tracking-wide border border-white/10 flex items-center justify-center gap-2 transition-all min-h-[44px]"
                  >
                    <Github className="w-4 h-4" />
                    <span>Explore Repository Code</span>
                  </a>
                )}
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#eaeef1] hover:bg-white text-[#030508] font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition-all shadow-md min-h-[44px]"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Launch Application Demo</span>
                  </a>
                ) : (
                  <span className="text-xs font-mono text-zinc-500 flex items-center gap-1.5 px-3 py-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                    Deployment: Internal / On-prem
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modalContent, document.body);
}
