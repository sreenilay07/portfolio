import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User, CornerDownLeft, Sparkles } from "lucide-react";
import { personalInfo } from "../data/personalInfo";
import { projectsData } from "../data/projects";
import { skillsData } from "../data/skills";

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: `Hello! I am Nilay's AI Assistant. How can I help you explore his portfolio today?`
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const suggestions = [
    { label: "Who is Nilay?", query: "who is nilay" },
    { label: "What projects has he built?", query: "projects" },
    { label: "What technologies does he know?", query: "skills" },
    { label: "How can I contact him?", query: "contact" }
  ];

  const handleQuery = (query) => {
    if (!query.trim()) return;

    // Add user message
    const userMessage = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot thinking
    setTimeout(() => {
      const botResponseText = generateBotResponse(query);
      setMessages((prev) => [...prev, { sender: "bot", text: botResponseText }]);
      setIsTyping(false);
    }, 1000);
  };

  const generateBotResponse = (input) => {
    const query = input.toLowerCase();

    // 1. Who is Nilay?
    if (query.includes("who") || query.includes("nilay") || query.includes("about") || query.includes("bio") || query.includes("sree")) {
      return `Minumula Sree Nilay Reddy is a B.Tech Artificial Intelligence and Machine Learning student at Anurag University (currently in his 3rd year, maintaining an 8.6 CGPA). He is an aspiring AI Engineer and Full Stack Developer specializing in the MERN Stack, Generative AI, computer vision proctoring systems, and automated financial analyzers.`;
    }

    // 2. Projects
    if (query.includes("project") || query.includes("build") || query.includes("create") || query.includes("develop") || query.includes("work")) {
      const projectsList = projectsData
        .map((p, idx) => `${idx + 1}. **${p.title}**: ${p.tagline} (${p.tech.slice(0, 3).join(", ")})`)
        .join("\n\n");
      return `Nilay has engineered several high-end AI products:\n\n${projectsList}\n\nClick the "Case Study" buttons on his project cards to review detailed architectures!`;
    }

    // 3. Skills
    if (query.includes("skill") || query.includes("technology") || query.includes("stack") || query.includes("know") || query.includes("language") || query.includes("tool")) {
      const languages = skillsData.programming.map((p) => p.name).join(", ");
      const categories = skillsData.categories.map((c) => `\n- **${c.title}**: ${c.skills.join(", ")}`).join("");
      return `Nilay's technical arsenal includes:\n- **Programming Languages**: ${languages}${categories}`;
    }

    // 4. Contact
    if (query.includes("contact") || query.includes("email") || query.includes("phone") || query.includes("reach") || query.includes("hire") || query.includes("linkedin")) {
      return `You can connect with Nilay through the following channels:\n\n- **Email**: ${personalInfo.email}\n- **Phone**: ${personalInfo.phone}\n- **LinkedIn**: [LinkedIn Profile](${personalInfo.linkedin})\n- **GitHub**: [GitHub Profile](${personalInfo.github})\n\nFeel free to complete the form in the "Contact" section to send an instant message!`;
    }

    // 5. Resume
    if (query.includes("resume") || query.includes("cv") || query.includes("pdf")) {
      return `You can view Nilay's interactive resume and download the official PDF directly from the hero section or navbar by clicking "View Resume" or "Download Resume".`;
    }

    // Default Fallback
    return `I parsed your query but couldn't find a exact match. Here is what you can ask me:\n- Who is Nilay?\n- What projects has he built?\n- What technologies does he know?\n- How can I contact him?\n\nOr click one of the quick suggestions below!`;
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40 select-none">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="p-4 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer border border-white/10 glow-btn focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50, x: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="fixed bottom-24 right-6 z-40 w-[350px] sm:w-[400px] h-[500px] rounded-2xl glass-panel border border-white/10 shadow-2xl overflow-hidden flex flex-col select-text"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-violet-600/20 to-cyan-500/20 border-b border-white/10 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-violet-600/20 border border-violet-500/30 text-violet-400 rounded-lg">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm sm:text-base font-display flex items-center gap-1.5">
                    Ask Nilay's Assistant
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  </h4>
                  <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online // Mapped data
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer focus:outline-none"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Chat Transcript Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-zinc-950/20">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 max-w-[85%] ${
                    msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 h-max flex items-center justify-center select-none ${
                      msg.sender === "user"
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        : "bg-violet-600/10 text-violet-400 border border-violet-500/20"
                    }`}
                  >
                    {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div
                    className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed border ${
                      msg.sender === "user"
                        ? "bg-zinc-900 border-white/5 text-zinc-200 rounded-tr-none"
                        : "bg-zinc-900/50 border-white/5 text-zinc-300 rounded-tl-none"
                    }`}
                  >
                    {/* Render breaklines or bold text matches */}
                    {msg.text.split("\n").map((line, lIdx) => {
                      // simple markdown bold mapping **text**
                      const parts = line.split(/(\*\*.*?\*\*)/g);
                      return (
                        <p key={lIdx} className={lIdx > 0 ? "mt-2" : ""}>
                          {parts.map((part, pIdx) => {
                            if (part.startsWith("**") && part.endsWith("**")) {
                              return <strong key={pIdx} className="text-white font-bold">{part.slice(2, -2)}</strong>;
                            }
                            // check if link markdown
                            const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
                            if (linkMatch) {
                              return (
                                <a key={pIdx} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-violet-400 underline font-semibold">
                                  {linkMatch[1]}
                                </a>
                              );
                            }
                            return part;
                          })}
                        </p>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Bot typing simulator */}
              {isTyping && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="p-2 rounded-lg bg-violet-600/10 text-violet-400 border border-violet-500/20 shrink-0 h-max flex items-center justify-center">
                    <Bot className="w-4 h-4 animate-bounce" />
                  </div>
                  <div className="p-3 bg-zinc-900/50 border border-white/5 text-zinc-400 rounded-2xl rounded-tl-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="p-3 border-t border-white/5 bg-zinc-950/40 flex flex-wrap gap-1.5 shrink-0 select-none">
              {suggestions.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuery(chip.query)}
                  className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-[11px] font-medium text-zinc-400 hover:text-white rounded-lg border border-white/5 cursor-pointer transition-colors focus:outline-none"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Form Input Bar */}
            <div className="p-3 border-t border-white/10 bg-zinc-900/50 shrink-0 select-none">
              <div className="flex gap-2 items-center bg-zinc-950 px-3 py-1.5 rounded-xl border border-white/5">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleQuery(inputValue)}
                  placeholder="Ask a question..."
                  className="flex-grow bg-transparent text-xs sm:text-sm text-white outline-none"
                />
                <button
                  onClick={() => handleQuery(inputValue)}
                  className="p-1.5 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition-colors cursor-pointer focus:outline-none"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="text-[9px] text-zinc-500 text-center mt-2 flex items-center justify-center gap-1">
                Press enter
                <CornerDownLeft className="w-2.5 h-2.5" />
                to submit query
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
