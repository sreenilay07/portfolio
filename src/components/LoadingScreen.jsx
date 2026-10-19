import { useEffect, useState } from "react";
import { motion } from "framer-motion";
// Preload enhanced video asset immediately on module evaluation
if (typeof window !== "undefined") {
  try {
    const v = document.createElement("video");
    v.preload = "auto";
    v.muted = true;
    v.playsInline = true;
    v.src = "/portfolio-enhanced.mp4";
    v.onerror = () => {
      v.src = "/portfolio.mp4";
      v.load();
    };
    v.load();
  } catch (err) {
    console.warn("Preloading video:", err);
  }
}

/**
 * LoadingScreen
 * Drives loading progress with Drei's useProgress and architectural terminal logs.
 * Styled in the video-derived quiet luxury palette.
 */
export default function LoadingScreen({ onComplete }) {
  const [percent, setPercent] = useState(0);
  const [logIndex, setLogIndex] = useState(0);

  const logs = [
    "Initializing studio environment...",
    "Buffering cinematic video stream...",
    "Querying portfolio dataset...",
    "Configuring scroll-scrubbed controller...",
    "Preparing case study architectures...",
    "Syncing product repositories...",
    "Establishing system protocol...",
    "Status: READY.",
  ];

  useEffect(() => {
    // If debug parameter is present, fast-track loader for immediate visual inspection
    const isDebug =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("debug");
    if (isDebug) {
      const quickTimer = setTimeout(() => {
        onComplete();
      }, 300);
      return () => clearTimeout(quickTimer);
    }

    let minTimeElapsed = false;
    const minTimer = setTimeout(() => {
      minTimeElapsed = true;
    }, 1100);

    const timer = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 350);
          return 100;
        }

        const step = Math.floor(Math.random() * 8) + 6;
        const next = prev + step;

        if (next >= 92 && !minTimeElapsed) {
          return 92;
        }

        return Math.min(next, 100);
      });
    }, 70);

    return () => {
      clearInterval(timer);
      clearTimeout(minTimer);
    };
  }, [onComplete]);

  useEffect(() => {
    const logTimer = setInterval(() => {
      setLogIndex((prev) => (prev < logs.length - 1 ? prev + 1 : prev));
    }, 280);
    return () => clearInterval(logTimer);
  }, [logs.length]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 bg-[#030508] z-[9999] flex flex-col items-center justify-center p-6 select-none"
    >
      <div className="w-full max-w-md arch-card p-6 rounded-2xl relative overflow-hidden shadow-2xl border border-white/[0.08]">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-white/[0.06]">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
          <span className="text-[11px] font-mono text-zinc-500 ml-2 tracking-wider">
            environment_boot.sh
          </span>
        </div>

        {/* Terminal Logs */}
        <div className="h-28 font-mono text-[13px] text-zinc-400 overflow-hidden mb-6 flex flex-col justify-end gap-1.5">
          {logs.slice(0, logIndex + 1).map((log, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2"
            >
              <span className="text-[#c59b7b] font-bold">&gt;&gt;</span>
              <span
                className={
                  idx === logs.length - 1 ? "text-[#eaeef1] font-medium" : "text-zinc-400"
                }
              >
                {log}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-zinc-400">
            <span className="tracking-wider">SYSTEM INITIALIZATION</span>
            <span className="text-[#eaeef1] font-semibold">
              {Math.min(percent, 100)}%
            </span>
          </div>
          <div className="h-1 bg-[#121a22] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#94a3b8] to-[#eaeef1] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(percent, 100)}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-[11px] font-mono text-zinc-500 tracking-widest text-center"
      >
        MINUMULA SREE NILAY REDDY // PORTFOLIO
      </motion.div>
    </motion.div>
  );
}
