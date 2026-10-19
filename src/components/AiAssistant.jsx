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

    const userMessage = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponseText = generateBotResponse(query);
      setMessages((prev) => [...prev, { sender: "bot", text: botResponseText }]);
      setIsTyping(false);
    }, 700);
  };

  const generateBotResponse = (input) => {
    const query = input.toLowerCase();

    if (query.includes("who") || query.includes("nilay") || query.includes("about") || query.includes("bio") || query.includes("sree")) {
      return `Minumula Sree Nilay Reddy is a B.Tech Artificial Intelligence and Machine Learning student at Anurag University (maintaining an 8.6 CGPA). He is an AI Engineer and Full Stack Developer specializing in the MERN Stack, Generative AI, computer vision proctoring systems, and automated financial analyzers.`;
    }

    if (query.includes("project") || query.includes("build") || query.includes("create") || query.includes("develop") || query.includes("work")) {
      const projectsList = projectsData
        .map((p, idx) => `${idx + 1}. **${p.title}**: ${p.tagline} (${p.tech.slice(0, 3).join(", ")})`)
        .join("\n\n");
      return `Nilay has engineered several high-performance products:\n\n${projectsList}\n\nClick the "Case Study" buttons on his project cards to review detailed system architectures!`;
    }

    if (query.includes("skill") || query.includes("technology") || query.includes("stack") || query.includes("know") || query.includes("language") || query.includes("tool")) {
      const languages = skillsData.programming.map((p) => p.name).join(", ");
      const categories = skillsData.categories.map((c) => `\n- **${c.title}**: ${c.skills.join(", ")}`).join("");
      return `Nilay's technical stack includes:\n- **Languages**: ${languages}${categories}`;
    }

    if (query.includes("contact") || query.includes("email") || query.includes("phone") || query.includes("reach") || query.includes("hire") || query.includes("linkedin")) {
      return `You can connect with Nilay directly:\n\n- **Email**: ${personalInfo.email}\n- **Phone**: ${personalInfo.phone}\n- **LinkedIn**: [LinkedIn Profile](${personalInfo.linkedin})\n- **GitHub**: [GitHub Profile](${personalInfo.github})\n\nYou can also use the contact form to dispatch an instant message!`;
    }

    if (query.includes("resume") || query.includes("cv") || query.includes("pdf")) {
      return `You can view Nilay's verified resume and download the official PDF directly from the hero section or navbar by clicking "View Resume" or "Download Resume".`;
    }

    return `I parsed your query. Here is what you can ask me:\n- Who is Nilay?\n- What projects has he built?\n- What technologies does he know?\n- How can I contact him?\n\nOr click one of the quick suggestions below!`;
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 select-none">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open AI Assistant"
          className="p-3 sm:p-3.5 bg-[#080d12] hover:bg-[#121a22] text-[#eaeef1] rounded-full shadow-2xl flex items-center justify-center cursor-pointer border border-white/10 focus:outline-none min-w-[44px] min-h-[44px]"
        >
          {isOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-[#c59b7b]" />}
        </motion.button>
      </div>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30, x: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30, x: -10 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="fixed bottom-16 sm:bottom-20 left-3 right-3 sm:left-6 sm:right-auto w-auto sm:w-[380px] h-[480px] max-h-[75vh] rounded-2xl bg-[#080d12] border border-white/[0.12] shadow-2xl overflow-hidden flex flex-col select-text z-50"
          >
            {/* Header */}
            <div className="p-4 bg-[#05080c] border-b border-white/[0.08] flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-[#121a22] border border-white/[0.08] text-[#c59b7b] rounded-lg">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[#eaeef1] font-bold text-sm font-display flex items-center gap-1.5">
                    Portfolio Assistant
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Online // Real-time Assistant
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer focus:outline-none"
                aria-label="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Transcript Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3.5 bg-[#030508]">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-2.5 max-w-[88%] ${
                    msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg shrink-0 h-max flex items-center justify-center select-none ${
                      msg.sender === "user"
                        ? "bg-[#121a22] text-[#eaeef1] border border-white/10"
                        : "bg-[#080d12] text-[#c59b7b] border border-white/10"
                    }`}
                  >
                    {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>
                  <div
                    className={`p-3 rounded-xl text-xs leading-relaxed border ${
                      msg.sender === "user"
                        ? "bg-[#121a22] border-white/10 text-[#eaeef1] rounded-tr-none"
                        : "bg-[#080d12] border-white/[0.08] text-[#94a3b8] rounded-tl-none"
                    }`}
                  >
                    {msg.text.split("\n").map((line, lIdx) => {
                      const parts = line.split(/(\*\*.*?\*\*)/g);
                      return (
                        <p key={lIdx} className={lIdx > 0 ? "mt-1.5" : ""}>
                          {parts.map((part, pIdx) => {
                            if (part.startsWith("**") && part.endsWith("**")) {
                              return <strong key={pIdx} className="text-[#eaeef1] font-semibold">{part.slice(2, -2)}</strong>;
                            }
                            const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
                            if (linkMatch) {
                              return (
                                <a key={pIdx} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-[#c59b7b] underline font-semibold">
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

              {isTyping && (
                <div className="flex gap-2.5 max-w-[85%]">
                  <div className="p-1.5 rounded-lg bg-[#080d12] text-[#c59b7b] border border-white/10 shrink-0 h-max flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-2.5 bg-[#080d12] border border-white/[0.08] text-zinc-500 rounded-xl rounded-tl-none flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1 h-1 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1 h-1 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="p-2.5 border-t border-white/[0.06] bg-[#05080c] flex flex-wrap gap-1.5 shrink-0 select-none">
              {suggestions.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuery(chip.query)}
                  className="px-2.5 py-1 bg-[#080d12] hover:bg-[#121a22] text-[11px] font-medium text-[#94a3b8] hover:text-[#eaeef1] rounded-lg border border-white/[0.06] cursor-pointer transition-colors focus:outline-none"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Form Input Bar */}
            <div className="p-3 border-t border-white/[0.08] bg-[#080d12] shrink-0 select-none">
              <div className="flex gap-2 items-center bg-[#030508] px-3 py-1.5 rounded-xl border border-white/[0.08]">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleQuery(inputValue)}
                  placeholder="Ask a question..."
                  className="flex-grow bg-transparent text-xs text-[#eaeef1] outline-none placeholder:text-zinc-600"
                />
                <button
                  onClick={() => handleQuery(inputValue)}
                  className="p-1.5 bg-[#eaeef1] text-[#030508] rounded-lg hover:bg-white transition-colors cursor-pointer focus:outline-none"
                  aria-label="Submit message"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
              <div className="text-[9px] text-zinc-500 text-center mt-1.5 flex items-center justify-center gap-1 font-mono">
                Press enter
                <CornerDownLeft className="w-2.5 h-2.5" />
                to submit
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
