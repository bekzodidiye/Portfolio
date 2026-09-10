import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { AdminModals } from './AdminModals';
import { AdminTabRouter } from './AdminTabRouter';
import { useAdminDashboard } from './useAdminDashboard';

export const AdminDashboard: React.FC = () => {
  const { isAdminOpen, isAdminAuthenticated, setIsAdminOpen, logoutAdmin, featuredProjects } =
    usePortfolioData();

  const adminProps = useAdminDashboard();
  const {
    activeTab,
    setActiveTab,
    toastMessage,
    showToast,
    isProjectModalOpen,
    setIsProjectModalOpen,
    editingProject,
    isSkillModalOpen,
    setIsSkillModalOpen,
    editingSkill,
    isExpModalOpen,
    setIsExpModalOpen,
    expModalType,
    editingExpItem,
    handleSaveProject,
    handleSaveSkill,
    handleSaveWork,
    handleSaveEdu,
    skillCategoryTitle,
  } = adminProps;

  if (!isAdminOpen || !isAdminAuthenticated) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden">
      <AdminHeader
        onCloseAdmin={() => {
          setIsAdminOpen(false);
          window.location.hash = '';
        }}
        onLogout={() => {
          logoutAdmin();
          showToast('🔒 Chiqildi');
        }}
      />

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          projectsCount={featuredProjects.length}
        />

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

          <AdminTabRouter {...adminProps} />
        </main>
      </div>

      <AdminModals
        isProjectModalOpen={isProjectModalOpen}
        setIsProjectModalOpen={setIsProjectModalOpen}
        editingProject={editingProject}
        onSaveProject={handleSaveProject}
        isSkillModalOpen={isSkillModalOpen}
        setIsSkillModalOpen={setIsSkillModalOpen}
        editingSkill={editingSkill}
        skillCategoryTitle={skillCategoryTitle}
        onSaveSkill={handleSaveSkill}
        isExpModalOpen={isExpModalOpen}
        setIsExpModalOpen={setIsExpModalOpen}
        expModalType={expModalType}
        editingExpItem={editingExpItem}
        onSaveWork={handleSaveWork}
        onSaveEdu={handleSaveEdu}
      />
    </div>
  );
};
