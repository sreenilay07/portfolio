import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, Github, Linkedin, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { socialLinks } from "../data/socialLinks";
import { personalInfo } from "../data/personalInfo";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [toastMessage, setToastMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    const emailBody = `Hi Sree Nilay,\n\nMy Name: ${formData.name}\n\nMessage:\n${formData.message}\n\nRegards,\n${formData.name}`;
    
    const gmailUrl = 
      `https://mail.google.com/mail/?view=cm&fs=1&to=sreenilayreddy@gmail.com` +
      `&su=${encodeURIComponent(formData.subject)}` +
      `&body=${encodeURIComponent(emailBody)}`;
    
    window.open(gmailUrl, '_blank');

    setTimeout(() => {
      setStatus("success");
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#c59b7b", "#eaeef1", "#94a3b8", "#121a22"]
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
        return <Mail className="w-5 h-5 text-[#c59b7b]" />;
      case "phone":
        return <Phone className="w-5 h-5 text-[#94a3b8]" />;
      case "location":
        return <MapPin className="w-5 h-5 text-[#eaeef1]" />;
      case "linkedin":
        return <Linkedin className="w-5 h-5 text-[#94a3b8]" />;
      default:
        return <Github className="w-5 h-5 text-[#eaeef1]" />;
    }
  };

  return (
    <section id="contact" className="py-24 relative bg-[#030508]">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 30, x: "-50%" }}
            className="fixed bottom-10 left-1/2 z-50 px-5 py-3 rounded-xl bg-[#080d12] border border-rose-500/30 text-rose-400 text-xs font-medium shadow-2xl flex items-center gap-2.5 backdrop-blur-xl"
          >
            <AlertCircle className="w-4 h-4 text-rose-500" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

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
            Get In Touch
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-[1.5px] w-12 bg-[#c59b7b] mx-auto mt-4 rounded-full"
          />
          <p className="text-[#94a3b8] text-xs sm:text-sm mt-4 max-w-xl mx-auto font-normal">
            Have a project query, collaboration idea, or career opportunity? Shoot a message!
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch max-w-6xl mx-auto">
          
          {/* Left Column: Direct info lists */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-[#eaeef1] font-display">
                Let&apos;s build something exceptional
              </h3>
              <p className="text-[#94a3b8] text-sm sm:text-base leading-relaxed">
                I am responsive to emails, messages, and calls. Reach out directly or complete the contact form to initiate discussion.
              </p>
            </div>

            <div className="space-y-3 my-4">
              {socialLinks.map((link, idx) => (
                <motion.a
                  key={idx}
                  href={link.url}
                  target={link.name !== "Phone" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.08 }}
                  className="flex items-center gap-4 p-4 rounded-xl arch-card border border-white/[0.08] hover:border-white/20 transition-all group"
                >
                  <div className="p-2.5 bg-[#121a22] border border-white/[0.08] rounded-xl group-hover:scale-105 transition-transform">
                    {getIcon(link.name)}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                      {link.name}
                    </span>
                    <span className="text-[#eaeef1] text-sm font-semibold font-display group-hover:text-white transition-colors">
                      {link.username}
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>

            <div className="text-xs text-zinc-500 font-mono">
              Location: {personalInfo.location}
            </div>
          </div>

          {/* Right Column: Form Panel */}
          <div className="lg:col-span-7 arch-card p-4 sm:p-8 rounded-2xl border border-white/[0.08] shadow-xl flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12 space-y-4"
                >
                  <div className="inline-flex p-3 bg-[#c59b7b]/15 border border-[#c59b7b]/30 text-[#c59b7b] rounded-full">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-bold font-display text-[#eaeef1]">Message Sent</h4>
                  <p className="text-[#94a3b8] text-sm max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out. Nilay will get back to you shortly.
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
                        className={`w-full px-4 py-3 rounded-xl bg-[#05080c] border ${
                          errors.name ? "border-rose-500/50 focus:border-rose-500" : "border-white/[0.08] focus:border-[#c59b7b]"
                        } text-[#eaeef1] text-base sm:text-sm outline-none transition-colors placeholder:text-zinc-600`}
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
                        className={`w-full px-4 py-3 rounded-xl bg-[#05080c] border ${
                          errors.subject ? "border-rose-500/50 focus:border-rose-500" : "border-white/[0.08] focus:border-[#c59b7b]"
                        } text-[#eaeef1] text-base sm:text-sm outline-none transition-colors placeholder:text-zinc-600`}
                        placeholder="Project Collaboration"
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
                      className={`w-full px-4 py-3 rounded-xl bg-[#05080c] border ${
                        errors.message ? "border-rose-500/50 focus:border-rose-500" : "border-white/[0.08] focus:border-[#c59b7b]"
                      } text-[#eaeef1] text-base sm:text-sm outline-none transition-colors resize-none placeholder:text-zinc-600`}
                      placeholder="Hi Nilay, I saw your proctoring system and would like to discuss..."
                    />
                    {errors.message && <span className="text-[11px] text-rose-500 font-mono block">{errors.message}</span>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full mt-2 py-3.5 rounded-xl bg-[#eaeef1] hover:bg-white text-[#030508] font-semibold text-xs tracking-wider uppercase disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md focus:outline-none"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#030508]" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
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
