import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { ModernBackground } from './components/ModernBackground';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TerminalAbout } from './components/TerminalAbout';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { TimelineSection } from './components/TimelineSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ResumeModal } from './components/ResumeModal';
import { ScrollProgressBar } from './components/ScrollProgressBar';

function PortfolioApp() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#FAFCFF] text-slate-900 selection:bg-blue-600/15 selection:text-blue-700">
      {/* Top Laser Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Clean Modern Engineering Ambient Background */}
      <ModernBackground />

      {/* Foreground Content Stack */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar onOpenResume={() => setIsResumeOpen(true)} />
        <main className="flex-1">
          <HeroSection />
          <TerminalAbout />
          <SkillsSection />
          <ProjectsSection />
          <TimelineSection />
          <ContactSection />
        </main>
        <Footer />
      </div>

      {/* Resume / CV Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <PortfolioApp />
    </LanguageProvider>
  );
}
