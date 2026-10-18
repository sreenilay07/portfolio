import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, Github, Linkedin, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { socialLinks } from "../data/socialLinks";
import { personalInfo } from "../data/personalInfo";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // "idle" | "submitting" | "success"
  const [toastMessage, setToastMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Full Name is required";
    if (!formData.subject.trim()) tempErrors.subject = "Subject is required";
    if (!formData.message.trim()) tempErrors.message = "Message body is required";
    setErrors(tempErrors);
    
    if (Object.keys(tempErrors).length > 0) {
      setToastMessage("Please fill in all required fields.");
      setTimeout(() => setToastMessage(""), 3000);
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitting");

    // Construct the email body
    const emailBody = `Hi Sree Nilay,\n\nMy Name: ${formData.name}\n\nMessage:\n${formData.message}\n\nRegards,\n${formData.name}`;
    
    // Construct the Gmail URL to directly open the Gmail web composer
    const gmailUrl = 
      `https://mail.google.com/mail/?view=cm&fs=1&to=sreenilayreddy@gmail.com` +
      `&su=${encodeURIComponent(formData.subject)}` +
      `&body=${encodeURIComponent(emailBody)}`;
    
    // Open Gmail in a new tab
    window.open(gmailUrl, '_blank');

    // Trigger visual success states after redirect
    setTimeout(() => {
      setStatus("success");
      
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#8b5cf6", "#06b6d4", "#10b981"]
      });

      setFormData({ name: "", subject: "", message: "" });
      
      setTimeout(() => {
        setStatus("idle");
      }, 5000);
    }, 500);
  };

  const getIcon = (name) => {
    switch (name.toLowerCase()) {
      case "email":
        return <Mail className="w-5 h-5 text-emerald-400" />;
      case "phone":
        return <Phone className="w-5 h-5 text-cyan-400" />;
      case "location":
        return <MapPin className="w-5 h-5 text-rose-400" />;
      case "linkedin":
        return <Linkedin className="w-5 h-5 text-sky-400" />;
      default:
        return <Github className="w-5 h-5 text-zinc-300" />;
    }
  };

  return (
    <section id="contact" className="py-20 relative bg-zinc-950/40">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-10 left-1/2 z-50 px-6 py-3.5 rounded-2xl glass-panel border border-rose-500/30 bg-zinc-950/90 text-rose-400 text-sm font-medium shadow-2xl shadow-rose-500/10 flex items-center gap-3 backdrop-blur-xl"
          >
            <AlertCircle className="w-5 h-5 text-rose-500" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-1/2 left-0 sm:left-1/4 w-64 sm:w-[400px] h-64 sm:h-[400px] bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 sm:right-1/4 w-64 sm:w-[400px] h-64 sm:h-[400px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

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
            Get In Touch
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-[3px] w-20 bg-gradient-to-r from-violet-600 to-cyan-500 mx-auto mt-4 rounded-full"
          />
          <p className="text-zinc-500 text-xs sm:text-sm mt-4 max-w-xl mx-auto font-medium">
            Have a project query, collaboration idea, or career opportunity? Shoot a message!
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch max-w-6xl mx-auto">
          
          {/* Left Column: Direct info lists */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <div className="space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                Let's discuss something great
              </h3>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                I am responsive to emails, messages, and calls. Reach out directly or complete the contact form to initiate discussion.
              </p>
            </div>

            <div className="space-y-4 my-6">
              {socialLinks.map((link, idx) => (
                <motion.a
                  key={idx}
                  href={link.url}
                  target={link.name !== "Phone" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl glass-panel border border-white/5 hover:border-violet-500/20 hover:bg-zinc-900/30 transition-all group"
                >
                  <div className="p-3 bg-zinc-900 border border-white/5 rounded-xl group-hover:scale-110 transition-transform">
                    {getIcon(link.name)}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                      {link.name}
                    </span>
                    <span className="text-zinc-200 text-sm sm:text-base font-semibold font-display group-hover:text-violet-400 transition-colors">
                      {link.username}
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>

            <div className="text-xs text-zinc-500 font-mono">
              IP Location: {personalInfo.location}
            </div>
          </div>

          {/* Right Column: Form Panel */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 shadow-xl flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12 space-y-4"
                >
                  <div className="inline-flex p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full animate-bounce">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h4 className="text-2xl font-bold font-display text-white">Message Transmitted!</h4>
                  <p className="text-zinc-400 text-sm max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out. Your communication has been dispatched. Nilay will get back to you shortly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 select-text">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl bg-zinc-950/60 border ${
                          errors.name ? "border-rose-500/50 focus:border-rose-500" : "border-white/5 focus:border-violet-500"
                        } text-white text-sm outline-none transition-colors`}
                        placeholder="Elon Musk"
                      />
                      {errors.name && <span className="text-[11px] text-rose-500 font-mono block">{errors.name}</span>}
                    </div>

                    {/* Subject */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl bg-zinc-950/60 border ${
                          errors.subject ? "border-rose-500/50 focus:border-rose-500" : "border-white/5 focus:border-violet-500"
                        } text-white text-sm outline-none transition-colors`}
                        placeholder="Co-founder opportunities at xAI"
                      />
                      {errors.subject && <span className="text-[11px] text-rose-500 font-mono block">{errors.subject}</span>}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Message Description</label>
                    <textarea
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl bg-zinc-950/60 border ${
                        errors.message ? "border-rose-500/50 focus:border-rose-500" : "border-white/5 focus:border-violet-500"
                      } text-white text-sm outline-none transition-colors resize-none`}
                      placeholder="Hey Nilay, saw your proctoring app. Let's discuss an internship deal..."
                    />
                    {errors.message && <span className="text-[11px] text-rose-500 font-mono block">{errors.message}</span>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 disabled:opacity-50 text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-violet-500/10 focus:outline-none"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Transmitting Packets...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Transmit Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
