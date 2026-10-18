import React from "react";
import { motion } from "framer-motion";
import { Award, Code, BookOpen, GraduationCap, Target } from "lucide-react";
import { personalInfo } from "../data/personalInfo";
import { projectsData } from "../data/projects";
import { skillsData } from "../data/skills";

export default function About() {
  // Auto Count logic for stats card
  const projectCount = projectsData.length;
  
  // Count unique skills
  const skillsList = new Set();
  skillsData.programming.forEach(s => skillsList.add(s.name));
  skillsData.categories.forEach(cat => {
    cat.skills.forEach(s => skillsList.add(s));
  });
  const totalSkills = skillsList.size;

  // Dynamic years of learning calculation (started 2024)
  const currentYear = new Date().getFullYear();
  const startYear = 2024;
  const years = currentYear - startYear + 1; // 2024 -> 1st yr, 2025 -> 2nd yr, 2026 -> 3rd yr

  const stats = [
    {
      label: "CGPA",
      value: personalInfo.stats.find(s => s.label === "CGPA")?.value || "8.6",
      icon: <GraduationCap className="w-5 h-5 text-violet-400" />,
      subtext: "Anurag University"
    },
    {
      label: "Projects Built",
      value: `${projectCount} Active`,
      icon: <Code className="w-5 h-5 text-cyan-400" />,
      subtext: "Auto-calculated from projects"
    },
    {
      label: "Technologies",
      value: `${totalSkills}+ Tech`,
      icon: <Award className="w-5 h-5 text-emerald-400" />,
      subtext: "Auto-aggregated from skills"
    },
    {
      label: "Years of Learning",
      value: `${years}rd Year`,
      icon: <BookOpen className="w-5 h-5 text-rose-400" />,
      subtext: "Academic journey active"
    }
  ];

  return (
    <section id="about" className="py-20 relative bg-zinc-950/20">
      <div className="absolute top-10 left-0 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 rounded-full bg-violet-600/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 sm:right-10 w-48 sm:w-72 h-48 sm:h-72 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

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
            About Me
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-[3px] w-20 bg-gradient-to-r from-violet-600 to-cyan-500 mx-auto mt-4 rounded-full"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Text / Info Panel */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6 text-zinc-300 leading-relaxed text-base sm:text-lg"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                Aspiring AI Engineer & Scalable Software Innovator
              </h3>
              <p>
                I am a B.Tech Artificial Intelligence and Machine Learning student at Anurag University with a strong passion for building intelligent applications and scalable software systems.
              </p>
              <p>
                My expertise spans MERN Stack development, Machine Learning, Generative AI, Prompt Engineering, REST APIs, Backend Development, and Database Design.
              </p>
              <p>
                I enjoy transforming innovative ideas into practical products that solve real-world challenges using modern technologies and AI-driven solutions.
              </p>
            </motion.div>

            {/* Career Goal Glass-Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-panel p-6 rounded-2xl border border-violet-500/20 relative overflow-hidden group shadow-md"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-15 transition-opacity">
                <Target className="w-24 h-24 text-violet-400" />
              </div>
              <div className="flex gap-4 items-start relative z-10">
                <div className="p-3 bg-violet-600/10 border border-violet-500/30 rounded-xl text-violet-400">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-1 font-display">Career Goal</h4>
                  <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                    To become a Machine Learning Engineer and Software Engineer focused on creating impactful, production-ready AI-powered systems.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Statistics Cards Grid */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-panel p-6 rounded-2xl hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-600/5 group transition-all duration-300 flex flex-col justify-between h-40 border border-white/5"
              >
                <div className="flex justify-between items-center">
                  <div className="p-2.5 bg-zinc-900 border border-white/5 rounded-xl group-hover:border-violet-500/20 transition-all">
                    {stat.icon}
                  </div>
                  <span className="text-xs font-mono text-zinc-500">{stat.label.toUpperCase()}</span>
                </div>
                <div className="mt-4">
                  <h4 className="text-2xl sm:text-3xl font-extrabold font-display bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent group-hover:text-violet-400 transition-colors">
                    {stat.value}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1">{stat.subtext}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
