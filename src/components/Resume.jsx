import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileText } from "lucide-react";
import { personalInfo } from "../data/personalInfo";

export default function Resume({ isOpen, onClose }) {
  // Block background scrolling when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", stiffness: 220, damping: 25 }}
            className="relative bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl z-10 overflow-hidden"
          >
            {/* Modal Header Panel */}
            <div className="p-4 sm:p-6 border-b border-white/5 bg-zinc-900/50 backdrop-blur-md flex flex-wrap gap-4 items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-600/10 border border-violet-500/20 text-violet-400 rounded-xl">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base sm:text-lg font-display">
                    {personalInfo.firstName}'s Resume
                  </h3>
                  <p className="text-[11px] sm:text-xs text-zinc-500 font-mono">
                    PRO PORTFOLIO v2.0
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2.5">
                <a
                  href={personalInfo.resumeUrl}
                  download="Minumula_Sree_Nilay_Reddy_Resume.pdf"
                  className="p-2.5 rounded-xl bg-zinc-950 border border-white/5 text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer focus:outline-none flex items-center gap-2 text-xs font-semibold"
                  title="Download PDF"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </a>
                <button
                  onClick={onClose}
                  className="p-2.5 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl border border-white/5 transition-colors focus:outline-none cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: PDF Viewer */}
            <div className="flex-grow overflow-y-auto p-4 sm:p-8 bg-zinc-950/40">
              <div className="w-full h-[75vh] min-h-[600px] bg-zinc-900 rounded-xl overflow-hidden border border-white/5 relative">
                <iframe
                  src={`${personalInfo.resumeUrl}#view=FitH`}
                  className="w-full h-full border-none"
                  title="Resume PDF Embedded Viewer"
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-zinc-950/90 border border-white/10 px-4 py-2 rounded-xl text-center shadow-lg text-[11px] sm:text-xs text-zinc-400 pointer-events-none">
                  PDF not loading? Click <span className="text-violet-400 font-bold">Download</span> above to view locally.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
