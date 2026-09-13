import React, { lazy, Suspense } from 'react';
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
import { useVisitorTelemetry } from './hooks/useVisitorTelemetry';

const SystemArchitectureVisualizer = lazy(() => import('./components/architecture/SystemArchitectureVisualizer').then(module => ({ default: module.SystemArchitectureVisualizer })));
const BackendApiPlayground = lazy(() => import('./components/sandbox/BackendApiPlayground').then(module => ({ default: module.BackendApiPlayground })));
const ResumeModal = lazy(() => import('./components/modals').then(module => ({ default: module.ResumeModal })));
const VisitorWelcomeModal = lazy(() => import('./components/modals').then(module => ({ default: module.VisitorWelcomeModal })));
const PortfolioAiAssistant = lazy(() => import('./components/ai/PortfolioAiAssistant').then(module => ({ default: module.PortfolioAiAssistant })));
const AdminAuthModal = lazy(() => import('./components/admin/AdminAuthModal').then(module => ({ default: module.AdminAuthModal })));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })));

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
          
          <Suspense fallback={<div className="h-20 flex items-center justify-center text-slate-500">Kutilmoqda...</div>}>
            <SystemArchitectureVisualizer />
            <BackendApiPlayground />
          </Suspense>

          <TimelineSection />
          <ContactSection />
        </main>
        <Footer />
      </div>

      <Suspense fallback={null}>
        {/* 24/7 Interactive AI Hiring & Architecture Assistant */}
        <PortfolioAiAssistant />

        {/* Resume / CV Modal */}
        <ResumeModal />

        {/* Visitor Identification & Welcome Protocol Modal */}
        <VisitorWelcomeModal />

        {/* Admin Panel Authentication Modal & Full CMS Control Hub */}
        <AdminAuthModal />
        <AdminDashboard />
      </Suspense>
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
