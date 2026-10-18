import { useState } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, BookOpen } from "lucide-react";
import { projectsData } from "../data/projects";
import CaseStudyModal from "./CaseStudyModal";

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section id="projects" className="py-20 relative bg-zinc-950/20 md:sr-only">
      <div className="absolute top-1/2 left-0 sm:left-1/3 w-64 sm:w-[500px] h-64 sm:h-[500px] rounded-full bg-violet-600/5 blur-3xl pointer-events-none max-w-[100vw]" />
      <div className="absolute bottom-0 right-0 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

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
            Featured Productions
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-[3px] w-20 bg-gradient-to-r from-violet-600 to-cyan-500 mx-auto mt-4 rounded-full"
          />
          <p className="text-zinc-500 text-xs sm:text-sm mt-4 max-w-xl mx-auto font-medium">
            Real-world AI products and intelligent full-stack applications. Click &quot;View Case Study&quot; to check the design architecture.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="glass-panel rounded-2xl overflow-hidden border border-white/5 flex flex-col h-full group hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300"
            >
              {/* Cover Image */}
              <div className="relative h-48 overflow-hidden bg-zinc-900 border-b border-white/5">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 to-transparent" />
                <span className="absolute top-4 right-4 bg-zinc-950/85 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-semibold font-mono text-cyan-400 tracking-wider">
                  {project.tech[0]} // {project.tech[1]}
                </span>
              </div>

              {/* Info content */}
              <div className="p-6 flex flex-col flex-grow space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white font-display leading-snug group-hover:text-violet-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono mt-1 italic">
                    {project.tagline}
                  </p>
                </div>

                <p className="text-zinc-400 text-sm leading-relaxed flex-grow">
                  {project.description}
                </p>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.tech.slice(0, 4).map((t, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-zinc-900 border border-white/5 text-zinc-400 px-2 py-0.5 rounded-md font-mono"
                    >
                      {t}
                    </span>
                  ))}
                  {project.tech.length > 4 && (
                    <span className="text-[11px] bg-zinc-900 border border-white/5 text-zinc-500 px-2 py-0.5 rounded-md font-mono">
                      +{project.tech.length - 4} more
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col min-[400px]:grid min-[400px]:grid-cols-3 gap-2 pt-4 border-t border-white/5">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/5 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Github className="w-3.5 h-3.5" />
                    Code
                  </a>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-violet-600/10 hover:bg-violet-600 hover:text-white border border-violet-500/20 text-violet-400 hover:border-violet-500 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Live
                  </a>
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-dashed border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-zinc-200 text-xs font-semibold transition-all cursor-pointer focus:outline-none"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    Case
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
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
