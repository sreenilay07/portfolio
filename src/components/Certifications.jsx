import React from "react";
import { motion } from "framer-motion";
import { Award, Calendar, ShieldCheck, Tag } from "lucide-react";
import { certificationsData } from "../data/certifications";

export default function Certifications() {
  return (
    <section id="certifications" className="py-20 relative bg-zinc-950/40">
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

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
            Certifications
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-[3px] w-20 bg-gradient-to-r from-violet-600 to-cyan-500 mx-auto mt-4 rounded-full"
          />
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {certificationsData.map((cert, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group flex flex-col justify-between hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300"
            >
              {/* Top Row: Icon + Date */}
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-violet-600/10 border border-violet-500/20 text-violet-400 rounded-xl group-hover:scale-110 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-zinc-500 text-xs font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{cert.date}</span>
                </div>
              </div>

              {/* Title & Issuer */}
              <div className="mb-6">
                <h3 className="text-white font-bold text-lg font-display leading-snug group-hover:text-violet-400 transition-colors">
                  {cert.title}
                </h3>
                <p className="text-zinc-400 text-sm mt-1">{cert.issuer}</p>
                <div className="flex items-center gap-1.5 mt-3 text-zinc-500 text-[11px] font-mono bg-zinc-900 border border-white/5 px-2 py-0.5 rounded w-max">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Cred: {cert.credentialId}</span>
                </div>
              </div>

              {/* Skills mapping */}
              <div className="space-y-2 border-t border-white/5 pt-4">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Acquired Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {cert.skillsLearned.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[11px] bg-zinc-900/50 text-zinc-400 border border-white/5 px-2 py-0.5 rounded-md flex items-center gap-1"
                    >
                      <Tag className="w-2.5 h-2.5 text-cyan-400/70" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
