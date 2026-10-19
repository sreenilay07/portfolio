import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Cpu, Database, LayoutTemplate, Settings, Terminal, Award } from "lucide-react";
import { skillsData } from "../data/skills";

export default function Skills() {
  const [activeTab, setActiveTab] = useState("all");

  const categories = [
    { id: "all", label: "All Skills", icon: <Award className="w-4 h-4" /> },
    { id: "programming", label: "Languages", icon: <Terminal className="w-4 h-4" /> },
    { id: "ai", label: "AI & Machine Learning", icon: <Cpu className="w-4 h-4" /> },
    { id: "backend", label: "Backend & Databases", icon: <Database className="w-4 h-4" /> },
    { id: "frontend", label: "Frontend", icon: <LayoutTemplate className="w-4 h-4" /> },
    { id: "tools", label: "Tools & APIs", icon: <Settings className="w-4 h-4" /> }
  ];

  const getSkillsByTab = () => {
    switch (activeTab) {
      case "programming":
        return { type: "bars", data: skillsData.programming };
      case "ai":
        const aiCat = skillsData.categories.find(c => c.title.includes("AI"));
        return { type: "tags", data: aiCat ? aiCat.skills : [] };
      case "backend":
        const backCat = skillsData.categories.find(c => c.title.includes("Backend"));
        const dbCat = skillsData.categories.find(c => c.title.includes("Database"));
        return { type: "tags", data: [...(backCat ? backCat.skills : []), ...(dbCat ? dbCat.skills : [])] };
      case "frontend":
        const frontCat = skillsData.categories.find(c => c.title.includes("Frontend"));
        return { type: "tags", data: frontCat ? frontCat.skills : [] };
      case "tools":
        const toolsCat = skillsData.categories.find(c => c.title.includes("Tools"));
        return { type: "tags", data: toolsCat ? toolsCat.skills : [] };
      default:
        return { type: "all", data: skillsData };
    }
  };

  const currentDisplay = getSkillsByTab();

  return (
    <section id="skills" className="py-24 relative bg-[#030508]">
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
            Technical Arsenal
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-[1.5px] w-12 bg-[#c59b7b] mx-auto mt-4 rounded-full"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-10 sm:mb-12 max-w-4xl mx-auto">
          {categories.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs uppercase tracking-wider font-medium transition-all duration-200 flex items-center gap-1.5 sm:gap-2 cursor-pointer focus:outline-none select-none min-h-[38px] ${
                activeTab === tab.id
                  ? "bg-[#eaeef1] text-[#030508] shadow-md font-semibold"
                  : "bg-[#080d12] text-[#94a3b8] hover:text-[#eaeef1] border border-white/[0.08] hover:border-white/20"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Display Area */}
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {/* Programming Bars */}
              {currentDisplay.type === "bars" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 arch-card p-4 sm:p-8 rounded-2xl border border-white/[0.08]">
                  {currentDisplay.data.map((lang, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-[#eaeef1]">{lang.name}</span>
                        <span className="font-mono text-xs text-[#94a3b8]">{lang.level}%</span>
                      </div>
                      <div className="h-1.5 bg-[#121a22] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[#eaeef1] rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${lang.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Categorized Tags */}
              {currentDisplay.type === "tags" && (
                <div className="flex flex-wrap gap-3 justify-center items-center py-6">
                  {currentDisplay.data.map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.25, delay: index * 0.03 }}
                      className="px-5 py-3 rounded-xl arch-card text-[#eaeef1] text-sm font-medium border border-white/[0.08] hover:border-white/20 flex items-center gap-2.5 cursor-default select-none"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#c59b7b]" />
                      <span>{skill}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Default "all" view */}
              {currentDisplay.type === "all" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Progress Bars */}
                  <div className="lg:col-span-5 space-y-6 arch-card p-4 sm:p-6 rounded-2xl border border-white/[0.08]">
                    <h3 className="text-base font-bold text-[#eaeef1] font-display border-b border-white/[0.06] pb-3 flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-[#c59b7b]" />
                      Core Languages
                    </h3>
                    <div className="space-y-4">
                      {skillsData.programming.map((lang, index) => (
                        <div key={index} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs sm:text-sm">
                            <span className="font-medium text-[#eaeef1]">{lang.name}</span>
                            <span className="font-mono text-xs text-[#94a3b8]">{lang.level}%</span>
                          </div>
                          <div className="h-1.5 bg-[#121a22] rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-[#94a3b8] to-[#eaeef1] rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${lang.level}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Other Skill Badges by Category */}
                  <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                    {skillsData.categories.map((cat, catIdx) => (
                      <div
                        key={catIdx}
                        className="arch-card p-4 sm:p-5 rounded-2xl border border-white/[0.08] space-y-3"
                      >
                        <h4 className="text-xs font-bold font-mono text-[#94a3b8] tracking-wider uppercase flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-[#c59b7b] rounded-full" />
                          {cat.title}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {cat.skills.map((skill, skillIdx) => (
                            <span
                              key={skillIdx}
                              className="px-3 py-1.5 rounded-lg bg-[#121a22] border border-white/[0.06] text-[#94a3b8] hover:text-[#eaeef1] hover:border-white/15 transition-all duration-200 text-xs font-mono cursor-default select-none"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
