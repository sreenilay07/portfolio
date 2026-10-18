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

  // Helper to check what to display in each category
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
        // "all" returns a mixed view of both bars and category tags
        return { type: "all", data: skillsData };
    }
  };

  const currentDisplay = getSkillsByTab();

  return (
    <section id="skills" className="py-20 relative bg-zinc-950/40">
      <div className="absolute top-1/4 right-0 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-violet-600/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 sm:left-10 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

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
            Technical Arsenal
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-[3px] w-20 bg-gradient-to-r from-violet-600 to-cyan-500 mx-auto mt-4 rounded-full"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 max-w-4xl mx-auto">
          {categories.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer focus:outline-none select-none ${
                activeTab === tab.id
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                  : "bg-white/5 text-zinc-400 hover:text-zinc-200 border border-white/5"
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
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {/* If "programming" is active (render animated progress bars) */}
              {currentDisplay.type === "bars" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 glass-panel p-8 rounded-2xl border border-white/5 shadow-xl">
                  {currentDisplay.data.map((lang, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-zinc-200">{lang.name}</span>
                        <span className="font-mono text-cyan-400">{lang.level}%</span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden p-[1px]">
                        <motion.div
                          className="h-full bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${lang.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* If categorized tags are active */}
              {currentDisplay.type === "tags" && (
                <div className="flex flex-wrap gap-4 justify-center items-center py-6">
                  {currentDisplay.data.map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="px-6 py-3.5 rounded-2xl glass-panel text-white font-medium hover:border-violet-500/40 hover:shadow-md hover:shadow-violet-600/5 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 cursor-default select-none border border-white/5"
                    >
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span>{skill}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Default "all" view - Display both side-by-side */}
              {currentDisplay.type === "all" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Progress Bars */}
                  <div className="lg:col-span-5 space-y-6 glass-panel p-6 rounded-2xl border border-white/5 shadow-md">
                    <h3 className="text-lg font-bold text-white font-display border-b border-white/5 pb-3 flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-violet-400" />
                      Core Languages
                    </h3>
                    <div className="space-y-5">
                      {skillsData.programming.map((lang, index) => (
                        <div key={index} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs sm:text-sm">
                            <span className="font-semibold text-zinc-300">{lang.name}</span>
                            <span className="font-mono text-cyan-400">{lang.level}%</span>
                          </div>
                          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${lang.level}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Other Skill Badges by Category */}
                  <div className="lg:col-span-7 space-y-6">
                    {skillsData.categories.map((cat, catIdx) => (
                      <div
                        key={catIdx}
                        className="glass-panel p-6 rounded-2xl border border-white/5 shadow-sm space-y-3.5"
                      >
                        <h4 className="text-sm font-bold font-mono text-zinc-400 tracking-wider flex items-center gap-2">
                          <div className="w-1.5 h-3 bg-cyan-400 rounded-full" />
                          {cat.title.toUpperCase()}
                        </h4>
                        <div className="flex flex-wrap gap-2.5">
                          {cat.skills.map((skill, skillIdx) => (
                            <span
                              key={skillIdx}
                              className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/5 text-zinc-300 hover:text-white hover:border-violet-500/25 hover:bg-zinc-900/50 hover:shadow-inner transition-all duration-300 text-sm cursor-default select-none"
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
