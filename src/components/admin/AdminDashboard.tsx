import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  LayoutDashboard,
  User,
  FolderGit2,
  Cpu,
  GraduationCap,
  Activity,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  Check,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  LogOut,
  Save,
  KeyRound,
  Eye,
  Send,
  MapPin,
  Bot,
  FileJson,
  Sparkles,
} from 'lucide-react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { ProjectEditModal } from './ProjectEditModal';
import { SkillEditModal } from './SkillEditModal';
import { ExperienceEditModal } from './ExperienceEditModal';
import { GlobalVisitorGlobe } from './GlobalVisitorGlobe';
import { ProjectItem, WorkExperienceItem, EducationItem, SkillItem } from '../../types/portfolio';

type AdminTab = 'overview' | 'profile' | 'projects' | 'skills' | 'timeline' | 'analytics' | 'settings';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    isAdminAuthenticated,
    logoutAdmin,
    candidateProfile,
    featuredProjects,
    workExperience,
    educationList,
    skillCategories,
    updateProfile,
    addProject,
    updateProject,
    deleteProject,
    addSkill,
    updateSkill,
    deleteSkill,
    addWorkExperience,
    updateWorkExperience,
    deleteWorkExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    exportDataJson,
    importDataJson,
    resetToDefaults,
    changeAdminPin,
  } = usePortfolioData();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Profile Form state
  const [profileForm, setProfileForm] = useState(candidateProfile);

  // Modal states
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<{ categoryIndex: number; skillIndex?: number; skill?: SkillItem } | null>(null);

  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [expModalType, setExpModalType] = useState<'work' | 'edu'>('work');
  const [editingExpItem, setEditingExpItem] = useState<WorkExperienceItem | EducationItem | null>(null);

  // PIN change state
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinError, setPinError] = useState('');

  // JSON Import state
  const [importJsonText, setImportJsonText] = useState('');

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
            className="px-3 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Portfolioni Ko'rish</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-rose-950/40 border border-rose-900/50 hover:bg-rose-900/60 text-xs font-medium text-rose-300 flex items-center gap-1.5 transition-colors"
            title="Chiqish"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chiqish</span>
          </button>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-16 sm:w-64 bg-slate-900/50 border-r border-slate-800/80 flex flex-col justify-between p-2 sm:p-3 overflow-y-auto">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  title={item.label}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="hidden sm:block p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Tezkor Tugmalar:</span>
            </div>
            <p>• <code className="bg-slate-800 px-1 py-0.5 rounded text-[10px]">Ctrl+Shift+A</code> — Panel</p>
            <p>• <code className="bg-slate-800 px-1 py-0.5 rounded text-[10px]">/#admin</code> — URL kirish</p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-slate-950 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Toast Notification */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-20 right-6 z-50 px-4 py-3 bg-blue-600 text-white text-xs font-semibold rounded-2xl shadow-xl shadow-blue-600/30 flex items-center gap-2 border border-blue-400/30"
              >
                <span>{toastMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-5xl">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Xush kelibsiz, {candidateProfile.name}! 👋
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Portfolio boshqaruv markazining umumiy holati va tezkor ko'rsatkichlari
                </p>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80">
                  <span className="text-xs text-slate-400">Jami Loyihalar</span>
                  <div className="text-2xl font-bold text-white mt-1">{featuredProjects.length} ta</div>
                  <span className="text-[10px] text-blue-400">aiogram, FastAPI, AI</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80">
                  <span className="text-xs text-slate-400">Ko'nikmalar</span>
                  <div className="text-2xl font-bold text-white mt-1">
                    {skillCategories.reduce((acc, c) => acc + c.skills.length, 0)} ta
                  </div>
                  <span className="text-[10px] text-indigo-400">{skillCategories.length} ta kategoriya</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80">
                  <span className="text-xs text-slate-400">Ish Tajribalari</span>
                  <div className="text-2xl font-bold text-white mt-1">{workExperience.length} ta</div>
                  <span className="text-[10px] text-emerald-400">{candidateProfile.freelanceCount}+ frilans</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80">
                  <span className="text-xs text-slate-400">Ta'lim & Kurslar</span>
                  <div className="text-2xl font-bold text-white mt-1">{educationList.length} ta</div>
                  <span className="text-[10px] text-amber-400">School 21, Mohirdev</span>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white">Tezkor Amallar:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      setEditingProject(null);
                      setIsProjectModalOpen(true);
                    }}
                    className="p-3 rounded-2xl bg-blue-600/10 border border-blue-500/30 hover:bg-blue-600/20 text-blue-400 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Yangi Loyiha Qo'shish</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('profile')}
                    className="p-3 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 hover:bg-indigo-600/20 text-indigo-400 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <User className="w-4 h-4" />
                    <span>Profilni Tahrirlash</span>
                  </button>

                  <button
                    onClick={handleExport}
                    className="p-3 rounded-2xl bg-emerald-600/10 border border-emerald-500/30 hover:bg-emerald-600/20 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Zaxira Nusxasini Olish</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE */}
          {activeTab === 'profile' && (
            <div className="max-w-4xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Profil va Shaxsiy Ma'lumotlar
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ism, kasbiy unvonlar, aloqa ma'lumotlari va bio tavsifini o'zgartiring
                </p>
              </div>

              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">To'liq Ism *</label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Asosiy Kasbiy Unvon *</label>
                    <input
                      type="text"
                      required
                      value={profileForm.primaryTitle}
                      onChange={(e) => setProfileForm({ ...profileForm, primaryTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Ikkilamchi Unvon / Ta'lim</label>
                    <input
                      type="text"
                      value={profileForm.subTitle}
                      onChange={(e) => setProfileForm({ ...profileForm, subTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Joylashuv (Location)</label>
                    <input
                      type="text"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Telefon Raqami</label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Manzili</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Frilans Loyihalar Soni</label>
                    <input
                      type="number"
                      value={profileForm.freelanceCount}
                      onChange={(e) => setProfileForm({ ...profileForm, freelanceCount: parseInt(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Telegram Username</label>
                    <input
                      type="text"
                      value={profileForm.telegramHandle}
                      onChange={(e) => setProfileForm({ ...profileForm, telegramHandle: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Telegram Bot Username</label>
                    <input
                      type="text"
                      value={profileForm.botUsername || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, botUsername: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">GitHub URL</label>
                    <input
                      type="text"
                      value={profileForm.github}
                      onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Bio / Kasbiy Summary *</label>
                  <textarea
                    rows={4}
                    required
                    value={profileForm.summary}
                    onChange={(e) => setProfileForm({ ...profileForm, summary: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Profil O'zgarishlarini Saqlash</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Loyihalar Boshqaruvi ({featuredProjects.length})
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Portfoliodagi barcha loyihalarni tahrirlang, yangi qo'shing yoki o'chiring
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingProject(null);
                    setIsProjectModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yangi Loyiha</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {featuredProjects.map((project, idx) => (
                  <div
                    key={project.id}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-400 text-xs font-mono flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h3 className="text-sm font-bold text-white">{project.name}</h3>
                        <span className="px-2 py-0.5 rounded bg-blue-950/70 border border-blue-800/60 text-blue-300 text-[10px] font-mono">
                          {project.badge}
                        </span>
                        <span className="text-xs text-slate-500">({project.timeline})</span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2">{project.summary}</p>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded bg-slate-950 text-[10px] text-slate-400 border border-slate-800 font-mono"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setEditingProject(project);
                          setIsProjectModalOpen(true);
                        }}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Tahrirlash"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`"${project.name}" loyihasini o'chirishni tasdiqlaysizmi?`)) {
                            deleteProject(project.id);
                            showToast("🗑️ Loyiha o'chirildi.");
                          }
                        }}
                        className="p-2 rounded-xl bg-rose-950/30 border border-rose-900/40 hover:bg-rose-900/60 text-rose-400 transition-colors"
                        title="O'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-6 max-w-5xl">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Ko'nikmalar va Texnologik Steklar
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Har bir kategoriya bo'yicha texnologiyalar va tajriba darajalarini boshqaring
                </p>
              </div>

              <div className="space-y-6">
                {skillCategories.map((category, catIdx) => (
                  <div key={category.title} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <span>{category.title}</span>
                          <span className="text-xs font-normal text-slate-400">({category.skills.length} ta ko'nikma)</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">{category.description}</p>
                      </div>

                      <button
                        onClick={() => {
                          setEditingSkill({ categoryIndex: catIdx });
                          setIsSkillModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-blue-600/10 border border-blue-500/30 hover:bg-blue-600/20 text-blue-400 text-xs font-semibold flex items-center gap-1.5 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Ko'nikma Qo'shish</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {category.skills.map((skill, sIdx) => (
                        <div
                          key={skill.name}
                          className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
                        >
                          <div>
                            <div className="text-xs font-bold text-white">{skill.name}</div>
                            <div className="text-[10px] text-blue-400 font-mono">
                              {skill.level} • {skill.tag}
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingSkill({ categoryIndex: catIdx, skillIndex: sIdx, skill });
                                setIsSkillModalOpen(true);
                              }}
                              className="p-1 text-slate-400 hover:text-white"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                deleteSkill(catIdx, sIdx);
                                showToast("🗑️ Ko'nikma o'chirildi.");
                              }}
                              className="p-1 text-slate-500 hover:text-rose-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: TIMELINE (Work & Education) */}
          {activeTab === 'timeline' && (
            <div className="space-y-6 max-w-5xl">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Ish Tajribasi va Ta'lim
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Kompaniyalar, platformalar, universitet va kurslar ro'yxatini boshqaring
                </p>
              </div>

              {/* Work Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                    💼 Ish Tajribasi ({workExperience.length})
                  </h3>
                  <button
                    onClick={() => {
                      setExpModalType('work');
                      setEditingExpItem(null);
                      setIsExpModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ish Joyi Qo'shish</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {workExperience.map((work) => (
                    <div key={work.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{work.role}</span>
                          <span className="text-xs text-slate-400">@ {work.companyOrPlatform}</span>
                          <span className="text-xs text-slate-500 font-mono">({work.period})</span>
                        </div>
                        <ul className="text-xs text-slate-400 space-y-0.5 list-disc list-inside">
                          {work.responsibilities.slice(0, 2).map((r, i) => (
                            <li key={i} className="truncate">{r}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setExpModalType('work');
                            setEditingExpItem(work);
                            setIsExpModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("O'chirishni tasdiqlaysizmi?")) {
                              deleteWorkExperience(work.id);
                              showToast("🗑️ Ish tajribasi o'chirildi.");
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-950/30 text-rose-400 hover:bg-rose-900/60"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education Section */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">
                    🎓 Ta'lim & Muassasalar ({educationList.length})
                  </h3>
                  <button
                    onClick={() => {
                      setExpModalType('edu');
                      setEditingExpItem(null);
                      setIsExpModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ta'lim Qo'shish</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {educationList.map((edu) => (
                    <div key={edu.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{edu.institution}</span>
                          <span className="text-xs text-blue-400 font-mono">({edu.period})</span>
                          <span className="px-2 py-0.5 rounded bg-blue-950 text-[10px] text-blue-300">{edu.status}</span>
                        </div>
                        <p className="text-xs text-slate-300 font-medium">{edu.field}</p>
                        <p className="text-xs text-slate-400">{edu.description}</p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setExpModalType('edu');
                            setEditingExpItem(edu);
                            setIsExpModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("O'chirishni tasdiqlaysizmi?")) {
                              deleteEducation(edu.id);
                              showToast("🗑️ Ta'lim o'chirildi.");
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-950/30 text-rose-400 hover:bg-rose-900/60"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ANALYTICS & TELEMETRY */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 max-w-5xl">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Jonli Telemetriya va Mehmonlar Monitoringi
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Portfolio saytiga tashrif buyuruvchilarning real-vaqtdagi tahlili
                </p>
              </div>

              {/* 3D Global Visitor Earth */}
              <GlobalVisitorGlobe />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400">Jami Tashriflar</div>
                  <div className="text-3xl font-bold text-white mt-1">142+ ta</div>
                  <p className="text-[11px] text-emerald-400 mt-1">🟢 Serverless Gateway Faol</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400">Bugungi Tashriflar</div>
                  <div className="text-3xl font-bold text-blue-400 mt-1">24 ta</div>
                  <p className="text-[11px] text-slate-500 mt-1">Samarqand, Toshkent, Buxoro</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400">Qurilmalar</div>
                  <div className="text-lg font-bold text-white mt-1">68% Mobile | 32% PC</div>
                  <p className="text-[11px] text-indigo-400 mt-1">Apple iOS, Android, macOS</p>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white">So'nggi Tashrif Buyuruvchilar Logi:</h3>
                <div className="space-y-2">
                  {[
                    { name: 'HR Recruiter / Manager', loc: 'Samarqand, O\'zbekiston', dev: 'Apple iPhone 15 Pro, iOS', time: 'Bugun, Jonli', pin: '66.9652,39.6507' },
                    { name: 'Tech Lead / Architect', loc: 'Toshkent, O\'zbekiston', dev: 'macOS, Google Chrome', time: 'Bugun, 18:42', pin: '69.2401,41.2995' },
                    { name: 'Mehmon', loc: 'Buxoro, O\'zbekiston', dev: 'Android Mobile, 4G', time: 'Bugun, 17:15', pin: '64.4215,39.7675' },
                    { name: 'Mehmon', loc: 'Berlin, Germaniya', dev: 'Windows PC, Wi-Fi', time: 'Bugun, 15:30', pin: '13.4050,52.5200' },
                  ].map((v, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{v.name}</div>
                        <div className="text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3 h-3 text-blue-400" />
                          <span>{v.loc}</span>
                          <span>•</span>
                          <span className="font-mono text-[11px]">{v.dev}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-slate-500 font-mono">{v.time}</span>
                        <a
                          href={`https://yandex.uz/maps/?pt=${v.pin},pm2rdm&z=16`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-1 rounded bg-blue-950 text-blue-300 text-[10px] font-medium hover:bg-blue-900 transition-colors"
                        >
                          Xaritada ko'rish
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SETTINGS & BACKUP */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Sozlamalar, Zaxiralash va Xavfsizlik
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Parolni yangilash, ma'lumotlarni JSON formatda yuklab olish va qayta tiklash
                </p>
              </div>

              {/* PIN Code Change */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-blue-400" />
                  <span>Admin PIN-kodini O'zgartirish</span>
                </h3>

                <form onSubmit={handlePinChangeSubmit} className="space-y-3 max-w-md">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Hozirgi PIN-kod</label>
                    <input
                      type="password"
                      required
                      value={oldPin}
                      onChange={(e) => setOldPin(e.target.value)}
                      placeholder="Hozirgi PIN (Standart: bekzod2026)"
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Yangi PIN-kod</label>
                    <input
                      type="password"
                      required
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="Kamida 4 ta belgi"
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono"
                    />
                  </div>

                  {pinError && (
                    <p className="text-xs text-rose-400 font-medium">{pinError}</p>
                  )}

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
                  >
                    PIN-kodni Yangilash
                  </button>
                </form>
              </div>

              {/* Backup & Restore */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>To'liq Zaxira (JSON Backup & Restore)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                    <h4 className="text-xs font-bold text-white">Eksport Qilish:</h4>
                    <p className="text-xs text-slate-400">
                      Barcha loyihalar, ko'nikmalar va profil ma'lumotlarini bitta .json faylga saqlab oling.
                    </p>
                    <button
                      onClick={handleExport}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Faylni Yuklab Olish (JSON)</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                    <h4 className="text-xs font-bold text-white">Import / Tiklash:</h4>
                    <textarea
                      rows={2}
                      value={importJsonText}
                      onChange={(e) => setImportJsonText(e.target.value)}
                      placeholder="JSON matnini shu yerga qo'ying..."
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-mono"
                    />
                    <button
                      onClick={handleImport}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>JSON dan Tiklash</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="p-5 rounded-3xl bg-rose-950/20 border border-rose-900/50 space-y-3">
                <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Xavfli Hudud (Reset to Defaults)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Barcha o'zgartirilgan ma'lumotlarni o'chirib, saytni dastlabki holatga qaytaradi.
                </p>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Standart Holatga Qaytarish</span>
                </button>
              </div>
            </div>
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
