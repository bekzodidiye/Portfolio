import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { PortfolioDataProvider, usePortfolioData } from './context/PortfolioDataContext';
import { UIProvider } from './context/UIContext';
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
import { useVisitorTelemetry } from './hooks/useVisitorTelemetry';

function PortfolioApp() {
  const { isAdminOpen, isAdminAuthenticated } = usePortfolioData();

  // 100% Silent Background Visitor Telemetry on initial page mount (No popups, zero suspicion)
  useVisitorTelemetry();

  return (
    <div className="relative min-h-screen bg-[#FAFCFF] text-slate-900 selection:bg-blue-600/15 selection:text-blue-700">
      {/* Top Laser Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Clean Modern Engineering Ambient Background */}
      <ModernBackground />

      {/* Foreground Content Stack */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
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
      <ResumeModal />

      {/* Visitor Identification & Welcome Protocol Modal */}
      <VisitorWelcomeModal />

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
        <UIProvider>
          <PortfolioApp />
        </UIProvider>
      </LanguageProvider>
    </PortfolioDataProvider>
  );
}
