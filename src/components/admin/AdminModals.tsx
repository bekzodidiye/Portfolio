import React from 'react';
import { ProjectItem, SkillItem, WorkExperienceItem, EducationItem } from '../../types/portfolio';
import { ProjectEditModal } from './ProjectEditModal';
import { SkillEditModal } from './SkillEditModal';
import { ExperienceEditModal } from './ExperienceEditModal';

interface AdminModalsProps {
  isProjectModalOpen: boolean;
  setIsProjectModalOpen: (open: boolean) => void;
  editingProject: ProjectItem | null;
  onSaveProject: (data: Omit<ProjectItem, 'id'>, id?: string) => void;
  isSkillModalOpen: boolean;
  setIsSkillModalOpen: (open: boolean) => void;
  editingSkill: { categoryIndex: number; skillIndex?: number; skill?: SkillItem } | null;
  skillCategoryTitle: string;
  onSaveSkill: (skill: SkillItem) => void;
  isExpModalOpen: boolean;
  setIsExpModalOpen: (open: boolean) => void;
  expModalType: 'work' | 'edu';
  editingExpItem: WorkExperienceItem | EducationItem | null;
  onSaveWork: (work: Omit<WorkExperienceItem, 'id'>, id?: string) => void;
  onSaveEdu: (edu: Omit<EducationItem, 'id'>, id?: string) => void;
}

export const AdminModals: React.FC<AdminModalsProps> = ({
  isProjectModalOpen,
  setIsProjectModalOpen,
  editingProject,
  onSaveProject,
  isSkillModalOpen,
  setIsSkillModalOpen,
  editingSkill,
  skillCategoryTitle,
  onSaveSkill,
  isExpModalOpen,
  setIsExpModalOpen,
  expModalType,
  editingExpItem,
  onSaveWork,
  onSaveEdu,
}) => {
  return (
    <>
      <ProjectEditModal
        isOpen={isProjectModalOpen}
        project={editingProject}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={onSaveProject}
      />

      <SkillEditModal
        isOpen={isSkillModalOpen}
        categoryTitle={skillCategoryTitle}
        skill={editingSkill?.skill}
        onClose={() => setIsSkillModalOpen(false)}
        onSave={onSaveSkill}
      />

      <ExperienceEditModal
        isOpen={isExpModalOpen}
        type={expModalType}
        item={editingExpItem}
        onClose={() => setIsExpModalOpen(false)}
        onSaveWork={onSaveWork}
        onSaveEdu={onSaveEdu}
      />
    </>
  );
};
