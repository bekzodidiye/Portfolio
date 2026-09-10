import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { PortfolioDataProvider, usePortfolioData } from './context/PortfolioDataContext';
import { ModernBackground, Navbar, Footer, ScrollProgressBar } from './components/layout';
import {
  HeroSection,
  TerminalAbout,
  SkillsSection,
  ProjectsSection,
  TimelineSection,
  ContactSection,
} from './components/sections';
import { SystemArchitectureVisualizer } from './components/architecture/SystemArchitectureVisualizer';
import { BackendApiPlayground } from './components/sandbox/BackendApiPlayground';
import { ResumeModal, VisitorWelcomeModal } from './components/modals';
import { PortfolioAiAssistant } from './components/ai/PortfolioAiAssistant';
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { collectVisitorTelemetry } from './services/visitorTelemetry';
import { sendVisitorNotification } from './services/telegramService';
import { saveRealVisitorRecord } from './services/realVisitorStorage';

function PortfolioApp() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState<boolean | undefined>(undefined);
  const { isAdminOpen, isAdminAuthenticated } = usePortfolioData();

  // 100% Silent Background Visitor Telemetry on initial page mount (No popups, zero suspicion)
  useEffect(() => {
    try {
      const SILENT_LOG_KEY = 'portfolio_silent_visit_logged';
      if (!sessionStorage.getItem(SILENT_LOG_KEY)) {
        sessionStorage.setItem(SILENT_LOG_KEY, 'true');
        const timer = setTimeout(async () => {
          try {
            const telemetry = await collectVisitorTelemetry();
            // Automatically persist into real visitor telemetry store
            saveRealVisitorRecord(telemetry);
            sendVisitorNotification(telemetry).catch((err) =>
              console.warn('Silent visitor telemetry dispatch error:', err)
            );
          } catch (e) {
            // ignore
          }
        }, 1000);
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
          <SystemArchitectureVisualizer />
          <BackendApiPlayground />
          <TimelineSection />
          <ContactSection />
        </main>
        <Footer />
      </div>

      {/* 24/7 Interactive AI Hiring & Architecture Assistant */}
      <PortfolioAiAssistant />

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

      {/* Admin Panel Authentication Modal & Full CMS Control Hub */}
      <AdminAuthModal />
      <AdminDashboard />
    </div>
  );
}

export default function App() {
  return (
    <PortfolioDataProvider>
      <LanguageProvider>
        <PortfolioApp />
      </LanguageProvider>
    </PortfolioDataProvider>
  );
}
