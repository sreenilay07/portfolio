import React from "react";
import { motion } from "framer-motion";
import { Award, Calendar, ShieldCheck, Tag, ExternalLink } from "lucide-react";
import { certificationsData } from "../data/certifications";

export default function Certifications() {
  return (
    <section id="certifications" className="py-24 relative bg-[#030508]">
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
            Certifications
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-[1.5px] w-12 bg-[#c59b7b] mx-auto mt-4 rounded-full"
          />
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {certificationsData.map((cert, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              className="arch-card p-4 sm:p-6 rounded-2xl border border-white/[0.08] relative overflow-hidden group flex flex-col justify-between hover:border-white/20 transition-all duration-300 shadow-lg"
            >
              {/* Top Row: Icon + Date */}
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-[#121a22] border border-white/[0.08] text-[#c59b7b] rounded-xl">
                  <Award className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{cert.date}</span>
                </div>
              </div>

              {/* Title & Issuer */}
              <div className="mb-6">
                <h3 className="text-[#eaeef1] font-bold text-lg font-display leading-snug group-hover:text-white transition-colors">
                  {cert.title}
                </h3>
                <p className="text-[#94a3b8] text-sm mt-1">{cert.issuer}</p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-mono bg-[#121a22] border border-white/[0.06] px-2 py-0.5 rounded w-max">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#94a3b8]" />
                    <span>Cred: {cert.credentialId}</span>
                  </div>
                  {cert.fileUrl && (
                    <a
                      href={cert.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] font-mono font-medium text-[#c59b7b] hover:text-white bg-[#c59b7b]/10 hover:bg-[#c59b7b]/20 border border-[#c59b7b]/30 px-2 py-0.5 rounded transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View PDF</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Skills mapping */}
              <div className="space-y-2 border-t border-white/[0.06] pt-4">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Acquired Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {cert.skillsLearned.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[11px] bg-[#121a22] text-[#94a3b8] border border-white/[0.06] px-2 py-0.5 rounded-md flex items-center gap-1 font-mono"
                    >
                      <Tag className="w-2.5 h-2.5 text-[#c59b7b]/70" />
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
