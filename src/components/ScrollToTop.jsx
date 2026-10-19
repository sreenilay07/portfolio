import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(scrollPercent);

      if (scrollTop > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 30 }}
          onClick={scrollToTop}
          aria-label="Scroll to top of page"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 p-2 sm:p-2.5 bg-[#080d12]/90 border border-white/10 rounded-full flex items-center justify-center cursor-pointer hover:border-[#c59b7b] hover:text-[#c59b7b] text-[#94a3b8] shadow-2xl transition-colors select-none focus:outline-none min-w-[44px] min-h-[44px]"
        >
          {/* Circular progress SVG */}
          <svg className="absolute w-[46px] h-[46px] -rotate-90 pointer-events-none">
            <circle
              cx="23"
              cy="23"
              r={radius}
              className="stroke-white/10"
              strokeWidth="2"
              fill="transparent"
            />
            <circle
              cx="23"
              cy="23"
              r={radius}
              className="stroke-[#c59b7b] transition-all duration-75"
              strokeWidth="2"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <ArrowUp className="w-4 h-4 relative z-10" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
