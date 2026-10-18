import React from "react";
import { motion } from "framer-motion";
import { Zap, Sparkles, BrainCircuit, Blocks, ShieldCheck, Star } from "lucide-react";
import { achievementsData } from "../data/achievements";

export default function Achievements() {
  const getIcon = (category) => {
    switch (category.toLowerCase()) {
      case "ai projects":
        return <BrainCircuit className="w-6 h-6 text-violet-400" />;
      case "full stack":
        return <Blocks className="w-6 h-6 text-cyan-400" />;
      case "integrations":
        return <Zap className="w-6 h-6 text-amber-400" />;
      default:
        return <Star className="w-6 h-6 text-rose-400" />;
    }
  };

  return (
    <section id="achievements" className="py-20 relative bg-gradient-grid">
      <div className="absolute top-1/2 left-1/4 w-[450px] h-[450px] bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

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
            Milestone Achievements
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-[3px] w-20 bg-gradient-to-r from-violet-600 to-cyan-500 mx-auto mt-4 rounded-full"
          />
        </div>

        {/* Achievement Wall */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievementsData.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group flex flex-col justify-between hover:border-violet-500/30 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              {/* Background ambient glowing shapes */}
              <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-violet-600/5 rounded-full blur-xl group-hover:bg-violet-600/10 transition-colors" />

              {/* Upper Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-zinc-900 border border-white/5 rounded-xl group-hover:border-violet-500/20 transition-all shadow-inner">
                    {getIcon(item.category)}
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-900 border border-white/5 text-zinc-500 group-hover:text-violet-400 uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-2xl font-extrabold font-display bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent group-hover:text-cyan-400 transition-colors">
                    {item.metric}
                  </span>
                  <h3 className="text-white font-bold text-base font-display">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mt-4 pt-4 border-t border-white/5 flex-grow">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
