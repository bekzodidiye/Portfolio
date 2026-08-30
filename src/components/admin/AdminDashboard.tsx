import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  LayoutDashboard,
  User,
  FolderGit2,
  Cpu,
  GraduationCap,
  Activity,
  Settings,
  LogOut,
  Eye,
} from 'lucide-react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { ProjectItem, SkillItem, WorkExperienceItem, EducationItem } from '../../types/portfolio';
import { getRealVisitorRecords, getRealAnalyticsSummary, clearRealVisitorRecords, RealVisitorRecord, RealAnalyticsSummary } from '../../services/realVisitorStorage';

import { ProjectEditModal } from './ProjectEditModal';
import { SkillEditModal } from './SkillEditModal';
import { ExperienceEditModal } from './ExperienceEditModal';

import { AdminOverviewTab } from './tabs/AdminOverviewTab';
import { AdminProfileTab } from './tabs/AdminProfileTab';
import { AdminProjectsTab } from './tabs/AdminProjectsTab';
import { AdminSkillsTab } from './tabs/AdminSkillsTab';
import { AdminTimelineTab } from './tabs/AdminTimelineTab';
import { AdminAnalyticsTab } from './tabs/AdminAnalyticsTab';
import { AdminSettingsTab } from './tabs/AdminSettingsTab';

type AdminTab = 'overview' | 'profile' | 'projects' | 'skills' | 'timeline' | 'analytics' | 'settings';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminOpen,
    isAdminAuthenticated,
    setIsAdminOpen,
    logoutAdmin,
    candidateProfile,
    updateProfile,
    featuredProjects,
    addProject,
    updateProject,
    skillCategories,
    addSkill,
    updateSkill,
    addWorkExperience,
    updateWorkExperience,
    addEducation,
    updateEducation,
    changeAdminPin,
    exportDataJson,
    importDataJson,
    resetToDefaults,
  } = usePortfolioData();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Profile Form State
  const [profileForm, setProfileForm] = useState(candidateProfile);
  useEffect(() => {
    setProfileForm(candidateProfile);
  }, [candidateProfile]);

  // Modals state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<{ categoryIndex: number; skillIndex?: number; skill?: SkillItem } | null>(null);

  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [expModalType, setExpModalType] = useState<'work' | 'edu'>('work');
  const [editingExpItem, setEditingExpItem] = useState<WorkExperienceItem | EducationItem | null>(null);

  // PIN & Settings state
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [importJsonText, setImportJsonText] = useState('');

  // Analytics Real Logs
  const [realLogs, setRealLogs] = useState<RealVisitorRecord[]>([]);
  const [realSummary, setRealSummary] = useState<RealAnalyticsSummary>({
    totalVisitors: 0,
    todayVisitors: 0,
    mobilePercent: 0,
    desktopPercent: 0,
    topLocations: [],
  });

  const refreshAnalyticsData = () => {
    setRealLogs(getRealVisitorRecords());
    setRealSummary(getRealAnalyticsSummary());
  };

  useEffect(() => {
    if (isAdminOpen && isAdminAuthenticated) {
      refreshAnalyticsData();
    }
  }, [isAdminOpen, isAdminAuthenticated]);

  if (!isAdminOpen || !isAdminAuthenticated) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm);
    showToast("✅ Profil ma'lumotlari muvaffaqiyatli saqlandi!");
  };

  const handlePinChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = changeAdminPin(oldPin, newPin);
    if (res.success) {
      showToast('✅ Admin PIN-kodi muvaffaqiyatli yangilandi!');
      setOldPin('');
      setNewPin('');
      setPinError('');
    } else {
      setPinError(res.error || 'Xatolik yuz berdi');
    }
  };

  const handleExport = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bekzod_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📥 Zaxira fayli (JSON) muvaffaqiyatli yuklab olindi!');
  };

  const handleImport = () => {
    if (!importJsonText.trim()) return;
    const res = importDataJson(importJsonText);
    if (res.success) {
      showToast('📤 Barcha ma\'lumotlar muvaffaqiyatli tiklandi!');
      setImportJsonText('');
    } else {
      showToast(`⚠️ Xatolik: ${res.error}`);
    }
  };

  const handleReset = () => {
    if (window.confirm("Haqiqatan ham barcha ma'lumotlarni dastlabki holatga qaytarmoqchimisiz?")) {
      resetToDefaults();
      showToast("🔄 Barcha ma'lumotlar standart holatga qaytarildi!");
    }
  };

  const navItems: Array<{ id: AdminTab; label: string; icon: any }> = [
    { id: 'overview', label: 'Boshqaruv & Metrika', icon: LayoutDashboard },
    { id: 'profile', label: 'Profil & Bio', icon: User },
    { id: 'projects', label: `Loyihalar (${featuredProjects.length})`, icon: FolderGit2 },
    { id: 'skills', label: 'Ko\'nikmalar (Skills)', icon: Cpu },
    { id: 'timeline', label: 'Tajriba & Ta\'lim', icon: GraduationCap },
    { id: 'analytics', label: 'Jonli Telemetriya', icon: Activity },
    { id: 'settings', label: 'Sozlamalar & Backup', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Top Navbar */}
      <header className="h-16 px-4 sm:px-6 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between flex-shrink-0 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">
                Bekzod Idiyev — Admin Panel
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-800/60 text-[10px] font-mono text-emerald-400 font-medium">
                CMS v2.0 Live
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Barcha bo'limlar 100% dinamik boshqaruvda
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              setIsAdminOpen(false);
              window.location.hash = '';
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Portfolioni Ko'rish</span>
          </button>

          <button
            onClick={() => {
              logoutAdmin();
              showToast('🔒 Chiqildi');
            }}
            className="px-3 py-1.5 rounded-xl bg-rose-600/10 border border-rose-500/30 hover:bg-rose-600/20 text-rose-400 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Chiqish</span>
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-slate-900/60 border-b md:border-b-0 md:border-r border-slate-800/80 p-3 sm:p-4 flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto flex-shrink-0 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto relative bg-slate-950/80">
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white text-xs font-medium shadow-2xl shadow-emerald-500/30 flex items-center gap-2"
              >
                <span>{toastMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {activeTab === 'overview' && (
            <AdminOverviewTab
              onOpenNewProject={() => {
                setEditingProject(null);
                setIsProjectModalOpen(true);
              }}
              onGoToProfile={() => setActiveTab('profile')}
              onExport={handleExport}
            />
          )}

          {activeTab === 'profile' && (
            <AdminProfileTab
              profileForm={profileForm}
              setProfileForm={setProfileForm}
              onSave={handleProfileSave}
            />
          )}

          {activeTab === 'projects' && (
            <AdminProjectsTab
              onNewProject={() => {
                setEditingProject(null);
                setIsProjectModalOpen(true);
              }}
              onEditProject={(p) => {
                setEditingProject(p);
                setIsProjectModalOpen(true);
              }}
              showToast={showToast}
            />
          )}

          {activeTab === 'skills' && (
            <AdminSkillsTab
              onAddSkill={(catIdx) => {
                setEditingSkill({ categoryIndex: catIdx });
                setIsSkillModalOpen(true);
              }}
              onEditSkill={(catIdx, sIdx, skill) => {
                setEditingSkill({ categoryIndex: catIdx, skillIndex: sIdx, skill });
                setIsSkillModalOpen(true);
              }}
              showToast={showToast}
            />
          )}

          {activeTab === 'timeline' && (
            <AdminTimelineTab
              onAddWork={() => {
                setExpModalType('work');
                setEditingExpItem(null);
                setIsExpModalOpen(true);
              }}
              onEditWork={(work) => {
                setExpModalType('work');
                setEditingExpItem(work);
                setIsExpModalOpen(true);
              }}
              onAddEdu={() => {
                setExpModalType('edu');
                setEditingExpItem(null);
                setIsExpModalOpen(true);
              }}
              onEditEdu={(edu) => {
                setExpModalType('edu');
                setEditingExpItem(edu);
                setIsExpModalOpen(true);
              }}
              showToast={showToast}
            />
          )}

          {activeTab === 'analytics' && (
            <AdminAnalyticsTab
              realLogs={realLogs}
              realSummary={realSummary}
              onRefreshLogs={refreshAnalyticsData}
              onClearLogs={() => {
                clearRealVisitorRecords();
                refreshAnalyticsData();
                showToast('🧹 Real loglar tozalandi.');
              }}
            />
          )}

          {activeTab === 'settings' && (
            <AdminSettingsTab
              oldPin={oldPin}
              setOldPin={setOldPin}
              newPin={newPin}
              setNewPin={setNewPin}
              pinError={pinError}
              onPinChange={handlePinChangeSubmit}
              onExport={handleExport}
              importJsonText={importJsonText}
              setImportJsonText={setImportJsonText}
              onImport={handleImport}
              onReset={handleReset}
            />
          )}
        </main>
      </div>

      {/* CRUD Modals */}
      <ProjectEditModal
        isOpen={isProjectModalOpen}
        project={editingProject}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={(data, id) => {
          if (id) {
            updateProject(id, data);
            showToast("✅ Loyiha yangilandi!");
          } else {
            addProject(data);
            showToast("✅ Yangi loyiha qo'shildi!");
          }
        }}
      />

      <SkillEditModal
        isOpen={isSkillModalOpen}
        categoryTitle={editingSkill ? skillCategories[editingSkill.categoryIndex]?.title : ''}
        skill={editingSkill?.skill}
        onClose={() => setIsSkillModalOpen(false)}
        onSave={(skill) => {
          if (editingSkill) {
            if (typeof editingSkill.skillIndex === 'number') {
              updateSkill(editingSkill.categoryIndex, editingSkill.skillIndex, skill);
              showToast("✅ Ko'nikma yangilandi!");
            } else {
              addSkill(editingSkill.categoryIndex, skill);
              showToast("✅ Yangi ko'nikma qo'shildi!");
            }
          }
        }}
      />

      <ExperienceEditModal
        isOpen={isExpModalOpen}
        type={expModalType}
        item={editingExpItem}
        onClose={() => setIsExpModalOpen(false)}
        onSaveWork={(work, id) => {
          if (id) {
            updateWorkExperience(id, work);
            showToast("✅ Ish tajribasi yangilandi!");
          } else {
            addWorkExperience(work);
            showToast("✅ Yangi ish tajribasi qo'shildi!");
          }
        }}
        onSaveEdu={(edu, id) => {
          if (id) {
            updateEducation(id, edu);
            showToast("✅ Ta'lim ma'lumoti yangilandi!");
          } else {
            addEducation(edu);
            showToast("✅ Yangi ta'lim qo'shildi!");
          }
        }}
      />
    </div>
  );
};
