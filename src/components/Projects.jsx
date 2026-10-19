import { useState } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, BookOpen, Users } from "lucide-react";
import { projectsData } from "../data/projects";
import CaseStudyModal from "./CaseStudyModal";

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section id="projects" className="py-24 relative bg-[#030508]">
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
            Featured Productions
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-[1.5px] w-12 bg-[#c59b7b] mx-auto mt-4 rounded-full"
          />
          <p className="text-[#94a3b8] text-xs sm:text-sm mt-4 max-w-xl mx-auto font-normal">
            Real-world AI products and intelligent full-stack applications. Click &quot;Case Study&quot; to review engineering architecture and individual contributions.
          </p>
        </div>

        {/* Projects Grid - Accessible on Both Desktop & Mobile with 5 Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project, idx) => {
            const techList = project.technologies || project.tech || [];
            const hasLiveUrl = Boolean(project.liveUrl);

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="arch-card rounded-2xl overflow-hidden border border-white/[0.08] hover:border-white/20 flex flex-col h-full group transition-all duration-300 shadow-xl"
              >
                {/* Cover Image */}
                <div className="relative h-48 overflow-hidden bg-[#05080c] border-b border-white/[0.06]">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 opacity-85"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080d12] via-transparent to-transparent pointer-events-none" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-3.5 left-3.5 bg-[#030508]/90 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-md text-[10px] font-mono text-[#c59b7b] tracking-wider uppercase font-semibold">
                    0{project.heroOrder || idx + 1} // {project.category || "AI Project"}
                  </span>

                  {/* Primary Tech Badge */}
                  <span className="absolute top-3.5 right-3.5 bg-[#030508]/90 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-md text-[11px] font-mono text-[#94a3b8] tracking-wider">
                    {techList[0]} {techList[1] ? `// ${techList[1]}` : ""}
                  </span>
                </div>

                {/* Info content */}
                <div className="p-4 sm:p-6 flex flex-col flex-grow space-y-3 sm:space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg sm:text-xl font-bold text-[#eaeef1] font-display leading-snug group-hover:text-white transition-colors">
                        {project.title}
                      </h3>
                      {project.role && project.role.includes("Team") && (
                        <span className="text-[10px] font-mono bg-[#c59b7b]/10 text-[#c59b7b] border border-[#c59b7b]/20 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                          <Users className="w-2.5 h-2.5" />
                          Team
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#94a3b8] font-mono mt-0.5 sm:mt-1">
                      {project.tagline}
                    </p>
                  </div>

                  <p className="text-[#94a3b8] text-xs sm:text-sm leading-relaxed flex-grow">
                    {project.description}
                  </p>

                  {/* Tech Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {techList.slice(0, 4).map((t, i) => (
                      <span
                        key={i}
                        className="text-[10px] sm:text-[11px] bg-[#121a22] border border-white/[0.06] text-[#94a3b8] px-2 py-0.5 rounded font-mono"
                      >
                        {t}
                      </span>
                    ))}
                    {techList.length > 4 && (
                      <span className="text-[10px] sm:text-[11px] bg-[#121a22] border border-white/[0.06] text-zinc-500 px-2 py-0.5 rounded font-mono">
                        +{techList.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons with 44px min touch target */}
                  <div className={`grid ${hasLiveUrl ? "grid-cols-3" : "grid-cols-2"} gap-2 pt-3 border-t border-white/[0.06]`}>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#080d12] hover:bg-[#121a22] text-[#eaeef1] hover:text-white border border-white/10 text-xs font-semibold transition-all cursor-pointer shadow-sm min-h-[44px]"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>
                    
                    {hasLiveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#eaeef1] hover:bg-white text-[#030508] text-xs font-bold transition-all cursor-pointer shadow-sm min-h-[44px]"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedProject(project)}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#121a22] hover:bg-[#1a2530] text-[#eaeef1] border border-white/10 text-xs font-semibold transition-all cursor-pointer focus:outline-none shadow-sm min-h-[44px]"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#c59b7b]" />
                      <span>Case Study</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Shared Case Study Modal */}
        <CaseStudyModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </section>
  );
}
