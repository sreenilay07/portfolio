import React from "react";
import { motion } from "framer-motion";
import { Award, Code, BookOpen, GraduationCap, Target } from "lucide-react";
import { personalInfo } from "../data/personalInfo";
import { projectsData } from "../data/projects";
import { skillsData } from "../data/skills";

export default function About() {
  const projectCount = projectsData.length;
  
  const skillsList = new Set();
  skillsData.programming.forEach(s => skillsList.add(s.name));
  skillsData.categories.forEach(cat => {
    cat.skills.forEach(s => skillsList.add(s));
  });
  const totalSkills = skillsList.size;

  const currentYear = new Date().getFullYear();
  const startYear = 2024;
  const years = currentYear - startYear + 1;

  const stats = [
    {
      label: "CGPA",
      value: personalInfo.stats.find(s => s.label === "CGPA")?.value || "8.6",
      icon: <GraduationCap className="w-5 h-5 text-[#c59b7b]" />,
      subtext: "Anurag University"
    },
    {
      label: "Projects Built",
      value: `${projectCount} Active`,
      icon: <Code className="w-5 h-5 text-[#94a3b8]" />,
      subtext: "sree AI,EasyCode,Trinetra,..."
    },
    {
      label: "Technologies",
      value: `${totalSkills}+ Tech`,
      icon: <Award className="w-5 h-5 text-[#eaeef1]" />,
      subtext: ""
    },
    {
      label: "Years of Learning",
      value: `${years}rd Year`,
      icon: <BookOpen className="w-5 h-5 text-[#c59b7b]" />,
      subtext: "Academic journey active"
    }
  ];

  return (
    <section id="about" className="py-24 relative bg-[#030508]">
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
            About Me
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-[1.5px] w-12 bg-[#c59b7b] mx-auto mt-4 rounded-full"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Text / Info Panel */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-5 text-[#94a3b8] leading-relaxed text-base sm:text-lg"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-[#eaeef1] font-display">
                Aspiring AI Engineer &amp; Scalable Software Innovator
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

            {/* Career Goal Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="arch-card p-6 rounded-2xl border border-white/[0.08] relative overflow-hidden group"
            >
              <div className="flex gap-4 items-start relative z-10">
                <div className="p-3 bg-[#121a22] border border-white/[0.08] rounded-xl text-[#c59b7b]">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[#eaeef1] font-bold text-base mb-1 font-display">Career Goal</h4>
                  <p className="text-[#94a3b8] text-sm leading-relaxed">
                    To become a Machine Learning Engineer and Software Engineer focused on creating impactful, production-ready AI-powered systems.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Statistics Cards Grid */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="arch-card p-4 sm:p-5 rounded-xl border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between min-h-[8.5rem]"
              >
                <div className="flex justify-between items-center">
                  <div className="p-2 bg-[#121a22] border border-white/[0.06] rounded-lg">
                    {stat.icon}
                  </div>
                  <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase">{stat.label}</span>
                </div>
                <div className="mt-3">
                  <h4 className="text-2xl font-bold font-display text-[#eaeef1]">
                    {stat.value}
                  </h4>
                  <p className="text-xs text-[#94a3b8] mt-0.5">{stat.subtext}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
