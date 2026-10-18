import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen({ onComplete }) {
  const [percent, setPercent] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const logs = [
    "Initializing neural connections...",
    "Connecting to LLM APIs...",
    "Querying portfolio JSON matrices...",
    "Rendering proctoring systems...",
    "Syncing stock market analyzers...",
    "Decrypting credentials...",
    "Establishing safe TCP handshakes...",
    "System status: READY."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 600);
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 4;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    const logTimer = setInterval(() => {
      setLogIndex((prev) => (prev < logs.length - 1 ? prev + 1 : prev));
    }, 450);
    return () => clearInterval(logTimer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 bg-[#09090b] z-[9999] flex flex-col items-center justify-center p-6 select-none"
    >
      {/* Decorative background grid */}
      <div className="absolute inset-0 grid-bg-lines opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30 animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-30 animate-pulse-glow" />

      <div className="w-full max-w-md glass-panel p-6 rounded-2xl relative overflow-hidden shadow-2xl border border-white/5">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-white/10">
          <div className="w-3.5 h-3.5 rounded-full bg-rose-500/80" />
          <div className="w-3.5 h-3.5 rounded-full bg-amber-500/80" />
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/80" />
          <span className="text-xs font-mono text-zinc-500 ml-2">sreenilay_boot_env.sh</span>
        </div>

        {/* Terminal Logs */}
        <div className="h-28 font-mono text-[13px] text-zinc-400 overflow-hidden mb-6 flex flex-col justify-end gap-1.5">
          {logs.slice(0, logIndex + 1).map((log, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <span className="text-violet-500 font-bold">&gt;&gt;</span>
              <span className={idx === logs.length - 1 ? "text-cyan-400 font-bold" : ""}>
                {log}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-zinc-400">
            <span>COMPILING PORTFOLIO</span>
            <span className="text-cyan-400 font-bold">{Math.min(percent, 100)}%</span>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden p-[1px]">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-600 via-cyan-500 to-emerald-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(percent, 100)}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-xs font-mono text-zinc-500 tracking-wider text-center"
      >
        MINUMULA SREE NILAY REDDY // PORTFOLIO v2.0
      </motion.div>
    </motion.div>
  );
}
