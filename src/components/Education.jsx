import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Calendar, Award, Star, CheckCircle2 } from "lucide-react";
import { educationData } from "../data/education";

export default function Education() {
  const milestones = [
    { year: "2024", title: "Entered B.Tech in AI & ML", desc: "Started foundations in C, Python, Data Structures, and Mathematics at Anurag University." },
    { year: "2025", title: "MERN Stack & Web Core", desc: "Developed full-stack web applications and learned database integrations, system designs, and prompt engineering." },
    { year: "2026", title: "AI & ML Custom Engines (Current)", desc: "Currently in 3rd Year. Built TRINETRA (TensorFlow.js) and SREE AI (NLP analyzer). Focusing on deep learning & LLMs." },
    { year: "2027-2028", title: "Advanced Research & Graduation", desc: "Upcoming focus on large-scale distributed AI products, capstone research, and industry internships." }
  ];

  return (
    <section id="education" className="py-24 relative bg-[#030508]">
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
            Academic Journey
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-[1.5px] w-12 bg-[#c59b7b] mx-auto mt-4 rounded-full"
          />
        </div>

        {/* Timeline Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Education Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            {educationData.map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="arch-card p-5 sm:p-7 rounded-2xl border border-white/[0.08] relative overflow-hidden group shadow-lg"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-[#121a22] border border-white/[0.08] rounded-xl text-[#c59b7b]">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 tracking-wider uppercase bg-[#121a22] border border-white/[0.06] px-2 py-0.5 rounded">
                      {edu.status}
                    </span>
                    <h3 className="text-xl font-bold text-[#eaeef1] font-display mt-1">{edu.degree}</h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-semibold text-[#eaeef1]">{edu.institution}</h4>
                    <p className="text-[#94a3b8] text-sm">{edu.branch}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 py-2 border-t border-b border-white/[0.06] text-sm text-[#94a3b8]">
                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      <Calendar className="w-3.5 h-3.5 text-[#94a3b8]" />
                      <span>{edu.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      <Award className="w-3.5 h-3.5 text-[#c59b7b]" />
                      <span>CGPA: <strong className="text-[#eaeef1] font-semibold">{edu.cgpa}</strong></span>
                    </div>
                  </div>

                  <p className="text-[#94a3b8] text-sm leading-relaxed pt-1">
                    {edu.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column: Timeline Milestones (Track) */}
          <div className="lg:col-span-7 relative pl-8 border-l border-white/[0.08] space-y-10">
            {milestones.map((milestone, idx) => {
              const isCurrent = milestone.title.includes("(Current)");
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.1 }}
                  className="relative group"
                >
                  {/* Bullet indicator on the line */}
                  <div
                    className={`absolute -left-[41px] top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isCurrent
                        ? "bg-[#c59b7b] border-[#eaeef1] shadow-md scale-110"
                        : "bg-[#080d12] border-white/20 group-hover:border-[#c59b7b]"
                    }`}
                  >
                    {isCurrent ? (
                      <Star className="w-2.5 h-2.5 text-[#030508] fill-[#030508]" />
                    ) : (
                      <CheckCircle2 className="w-2.5 h-2.5 text-zinc-500 group-hover:text-[#c59b7b]" />
                    )}
                  </div>

                  <div className="arch-card p-6 rounded-2xl border border-white/[0.08] hover:border-white/20 transition-all duration-200">
                    <span
                      className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
                        isCurrent
                          ? "bg-[#c59b7b]/15 text-[#c59b7b] border border-[#c59b7b]/30"
                          : "bg-[#121a22] text-[#94a3b8] border border-white/[0.06]"
                      }`}
                    >
                      {milestone.year}
                    </span>
                    <h4 className="text-[#eaeef1] font-bold text-base mt-2 mb-1 font-display">
                      {milestone.title}
                    </h4>
                    <p className="text-[#94a3b8] text-xs sm:text-sm leading-relaxed">
                      {milestone.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
