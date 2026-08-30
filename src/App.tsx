import React, { useState, useEffect } from 'react';
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
import { VisitorWelcomeModal } from './components/VisitorWelcomeModal';
import { collectVisitorTelemetry } from './services/visitorTelemetry';
import { sendVisitorNotification } from './services/telegramService';

function PortfolioApp() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState<boolean | undefined>(undefined);

  // Automatic silent background visitor telemetry on initial page mount
  useEffect(() => {
    try {
      const SILENT_LOG_KEY = 'portfolio_silent_visit_logged';
      if (!sessionStorage.getItem(SILENT_LOG_KEY)) {
        sessionStorage.setItem(SILENT_LOG_KEY, 'true');
        const timer = setTimeout(async () => {
          try {
            const telemetry = await collectVisitorTelemetry();
            sendVisitorNotification(telemetry).catch((err) =>
              console.warn('Silent visitor telemetry dispatch error:', err)
            );
          } catch (e) {
            // ignore
          }
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[#FAFCFF] text-slate-900 selection:bg-blue-600/15 selection:text-blue-700">
      {/* Top Laser Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Clean Modern Engineering Ambient Background */}
      <ModernBackground />

      {/* Foreground Content Stack */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          onOpenResume={() => setIsResumeOpen(true)}
          onOpenVisitorModal={() => setIsVisitorModalOpen(true)}
        />
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

      {/* Visitor Identification & Welcome Protocol Modal */}
      <VisitorWelcomeModal
        isOpenOverride={isVisitorModalOpen}
        onCloseOverride={() => setIsVisitorModalOpen(false)}
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
