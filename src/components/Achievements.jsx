import React from "react";
import { motion } from "framer-motion";
import { Zap, BrainCircuit, Blocks, Star } from "lucide-react";
import { achievementsData } from "../data/achievements";

export default function Achievements() {
  const getIcon = (category) => {
    switch (category.toLowerCase()) {
      case "ai projects":
        return <BrainCircuit className="w-5 h-5 text-[#c59b7b]" />;
      case "full stack":
        return <Blocks className="w-5 h-5 text-[#94a3b8]" />;
      case "integrations":
        return <Zap className="w-5 h-5 text-[#eaeef1]" />;
      default:
        return <Star className="w-5 h-5 text-[#c59b7b]" />;
    }
  };

  return (
    <section id="achievements" className="py-24 relative bg-[#030508]">
      <div className="max-w-7xl mx-auto px-6 relative z-20">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold font-display text-[#eaeef1] tracking-tight"
          >
            Engineering Milestones
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-[1.5px] w-12 bg-[#c59b7b] mx-auto mt-4 rounded-full"
          />
          <p className="text-[#94a3b8] text-xs sm:text-sm mt-4 max-w-xl mx-auto font-normal">
            Key technical highlights across machine learning deployments, full-stack systems, and real-time infrastructure.
          </p>
        </div>

        {/* Milestone Cards Wall */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {achievementsData.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.98, y: 18 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="arch-card p-4 sm:p-6 rounded-2xl border border-white/[0.08] relative overflow-hidden group flex flex-col justify-between hover:border-white/20 transition-all duration-300 shadow-md"
            >
              {/* Upper Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 bg-[#121a22] border border-white/[0.08] rounded-xl">
                    {getIcon(item.category)}
                  </div>
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[#121a22] border border-white/[0.06] text-zinc-500 uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-2xl font-bold font-display text-[#eaeef1]">
                    {item.metric}
                  </span>
                  <h3 className="text-[#eaeef1] font-semibold text-sm font-display">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-[#94a3b8] text-xs sm:text-sm leading-relaxed mt-4 pt-4 border-t border-white/[0.06] flex-grow">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
