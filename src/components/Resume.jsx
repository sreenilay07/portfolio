import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileText, ExternalLink } from "lucide-react";
import { personalInfo } from "../data/personalInfo";

export default function Resume({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.stop();
      }
      const handleKeyDown = (e) => {
        if (e.key === "Escape") onClose();
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
  }, [isOpen, onClose]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          data-lenis-prevent
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          onWheel={(e) => e.stopPropagation()}
          className="fixed inset-0 z-[999] flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto"
        >
          {/* Backdrop */}
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
            transition={{ type: "spring", stiffness: 240, damping: 25 }}
            onWheel={(e) => e.stopPropagation()}
            className="relative bg-[#080d12] border border-white/[0.14] rounded-2xl w-full max-w-5xl h-[92vh] sm:h-[88vh] flex flex-col shadow-2xl z-10 overflow-hidden"
          >
            {/* Modal Header Panel */}
            <div className="p-3.5 sm:p-5 border-b border-white/[0.08] bg-[#05080c] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="p-2 bg-[#121a22] border border-white/[0.08] text-[#c59b7b] rounded-xl shrink-0">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="text-[#eaeef1] font-bold text-sm sm:text-lg font-display leading-tight">
                    {personalInfo.firstName}&apos;s Resume
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-[#c59b7b] font-mono">
                    CURRICULUM VITAE // VERIFIED
                  </p>
                </div>
              </div>

              {/* Action buttons (min 44px touch targets) */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <a
                  href={personalInfo.resumeUrl}
                  download="Minumula_Sree_Nilay_Reddy_Resume.pdf"
                  className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#eaeef1] hover:bg-white text-[#030508] transition-colors cursor-pointer focus:outline-none flex items-center gap-1.5 text-xs font-semibold shadow-sm min-h-[40px]"
                  title="Download PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline sm:inline">Download</span>
                </a>
                <a
                  href={personalInfo.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 sm:p-2.5 bg-[#121a22] hover:bg-[#1a2530] text-[#eaeef1] rounded-xl border border-white/10 transition-colors focus:outline-none cursor-pointer flex items-center justify-center min-w-[40px] min-h-[40px]"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 sm:p-2.5 bg-[#121a22] hover:bg-[#1a2530] text-[#94a3b8] hover:text-[#eaeef1] rounded-xl border border-white/10 transition-colors focus:outline-none cursor-pointer flex items-center justify-center min-w-[40px] min-h-[40px]"
                  aria-label="Close Resume"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: PDF Viewer with mobile responsive fallback */}
            <div className="flex-grow overflow-y-auto p-3 sm:p-6 bg-[#030508] flex flex-col">
              <div className="w-full flex-grow min-h-[300px] bg-[#05080c] rounded-xl overflow-hidden border border-white/[0.08] relative">
                <iframe
                  src={`${personalInfo.resumeUrl}#view=FitH`}
                  className="w-full h-full border-none hidden sm:block"
                  title="Resume PDF Embedded Viewer"
                />
                
                {/* Mobile Direct Access View */}
                <div className="sm:hidden flex flex-col items-center justify-center text-center p-6 h-full space-y-4">
                  <div className="p-4 rounded-2xl bg-[#080d12] border border-white/10 text-[#c59b7b]">
                    <FileText className="w-10 h-10" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#eaeef1] font-display">
                      Official Curriculum Vitae
                    </h4>
                    <p className="text-xs text-[#94a3b8] mt-1 max-w-xs">
                      Minumula Sree Nilay Reddy — AI Engineer &amp; Full-Stack Developer
                    </p>
                  </div>
                  <div className="flex flex-col w-full gap-2.5 max-w-xs pt-2">
                    <a
                      href={personalInfo.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-[#eaeef1] text-[#030508] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg min-h-[44px]"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Full PDF Document
                    </a>
                    <a
                      href={personalInfo.resumeUrl}
                      download="Minumula_Sree_Nilay_Reddy_Resume.pdf"
                      className="w-full py-3 px-4 rounded-xl bg-[#121a22] text-[#eaeef1] border border-white/10 font-semibold text-xs tracking-wider flex items-center justify-center gap-2 min-h-[44px]"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </a>
                  </div>
                </div>

                <div className="hidden sm:block absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#080d12]/95 border border-white/10 px-4 py-2 rounded-xl text-center shadow-lg text-[11px] text-[#94a3b8] pointer-events-none">
                  PDF preview not loading? Click <span className="text-[#eaeef1] font-bold">Download</span> above to view locally.
                </div>
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
