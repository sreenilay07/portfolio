import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "./components/LoadingScreen";
import ParticlesBg from "./components/ParticlesBg";
import Navbar from "./components/Navbar";
import HeroStage from "./components/HeroStage";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Education from "./components/Education";
import Certifications from "./components/Certifications";
import Achievements from "./components/Achievements";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import AiAssistant from "./components/AiAssistant";
import Resume from "./components/Resume";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loader" onComplete={() => setIsLoading(false)} />
        ) : (
          <div
            key="content"
            className="relative min-h-screen bg-[#09090b] text-zinc-100 overflow-x-clip selection:bg-violet-600/30 selection:text-white"
          >
            {/* Ambient Background Mesh */}
            <div className="fixed inset-0 grid-bg-lines pointer-events-none z-0 opacity-80" />
            <ParticlesBg />

            {/* Sticky Navigation Header */}
            <Navbar />

            {/* Main Content Sections */}
            <main className="relative z-20">
              {/* 3D Virtual Character Stage (replaces standalone Hero on desktop; fallback included) */}
              <HeroStage onOpenResume={() => setIsResumeOpen(true)} />
              <About />
              <Skills />
              {/* Projects: Standalone fallback on mobile, sr-only on desktop */}
              <Projects />
              <Education />
              <Certifications />
              <Achievements />
              <Contact />
            </main>

            {/* Footer Panel */}
            <Footer />

            {/* Floating Assist widgets */}
            <ScrollToTop />
            <AiAssistant />

            {/* Global Modal triggers */}
            <Resume
              isOpen={isResumeOpen}
              onClose={() => setIsResumeOpen(false)}
            />
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
