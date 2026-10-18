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
    <section id="education" className="py-20 relative overflow-hidden bg-gradient-grid">
      <div className="absolute top-1/2 left-1/4 w-80 h-80 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-violet-600/5 blur-3xl pointer-events-none" />

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
            Academic Journey
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-[3px] w-20 bg-gradient-to-r from-violet-600 to-cyan-500 mx-auto mt-4 rounded-full"
          />
        </div>

        {/* Timeline Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Education Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            {educationData.map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="glass-panel p-8 rounded-2xl border border-white/5 relative overflow-hidden group shadow-lg"
              >
                <div className="absolute -top-10 -right-10 w-36 h-36 bg-violet-600/10 rounded-full blur-2xl group-hover:bg-violet-600/15 transition-all" />

                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-violet-600/10 border border-violet-500/20 rounded-xl text-violet-400">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-zinc-500 tracking-wider uppercase bg-zinc-900 border border-white/5 px-2 py-0.5 rounded">
                      {edu.status}
                    </span>
                    <h3 className="text-xl font-bold text-white font-display mt-1">{edu.degree}</h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-zinc-200">{edu.institution}</h4>
                    <p className="text-zinc-400 text-sm">{edu.branch}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 py-2 border-t border-b border-white/5 text-sm text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      <span>{edu.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-400" />
                      <span>CGPA: <strong className="text-white font-semibold">{edu.cgpa}</strong></span>
                    </div>
                  </div>

                  <p className="text-zinc-400 text-sm leading-relaxed pt-2">
                    {edu.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column: Timeline Milestones (Track) */}
          <div className="lg:col-span-7 relative pl-8 border-l border-zinc-800 space-y-12">
            {milestones.map((milestone, idx) => {
              const isCurrent = milestone.title.includes("(Current)");
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="relative group"
                >
                  {/* Bullet indicator on the line */}
                  <div
                    className={`absolute -left-[41px] top-1.5 w-6 h-6 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                      isCurrent
                        ? "bg-violet-600 border-violet-500 shadow-md shadow-violet-500/40 scale-125"
                        : "bg-zinc-950 border-zinc-700 group-hover:border-violet-500/50"
                    }`}
                  >
                    {isCurrent ? (
                      <Star className="w-2.5 h-2.5 text-white fill-white" />
                    ) : (
                      <CheckCircle2 className="w-2.5 h-2.5 text-zinc-500 group-hover:text-violet-400" />
                    )}
                  </div>

                  <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/10 shadow-md group-hover:shadow-lg transition-all duration-300">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        isCurrent
                          ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                          : "bg-zinc-900 text-zinc-400 border border-white/5"
                      }`}
                    >
                      {milestone.year}
                    </span>
                    <h4 className="text-white font-bold text-base sm:text-lg mt-2 mb-1 font-display">
                      {milestone.title}
                    </h4>
                    <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
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
