'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { 
  ArrowLeft, 
  Share2, 
  Plus,
  RotateCcw,
  FileText,
  X,
  Briefcase,
  FolderKanban,
  Users,
  GraduationCap,
  Lightbulb,
  LayoutList
} from 'lucide-react';
import { useCVStore } from '@/store/cv-store';
import { EditableText } from '@/components/cv/EditableText';
import { SectionWrapper } from '@/components/cv/SectionWrapper';
import { EducationSection } from '@/components/cv/EducationSection';
import { WorkExperienceSection } from '@/components/cv/WorkExperienceSection';
import { ProjectSection } from '@/components/cv/ProjectSection';
import { LeadershipSection } from '@/components/cv/LeadershipSection';
import { CustomSectionContent } from '@/components/cv/CustomSection';
import { SkillsSection } from '@/components/cv/SkillsSection';
import { FormattingToolbar } from '@/components/cv/FormattingToolbar';
import { DndWrapper } from '@/components/cv/DndWrapper';
import { PdfDownloadButton } from '@/components/cv/PdfDownloadButton';
import { SectionType } from '@/data/cv-types';

const sectionOptions: { type: SectionType; label: string; icon: React.ReactNode }[] = [
  { type: 'work-experience', label: 'Work Experience', icon: <Briefcase className="w-4 h-4" /> },
  { type: 'project-experience', label: 'Project Experience', icon: <FolderKanban className="w-4 h-4" /> },
  { type: 'leadership', label: 'Leadership Experience', icon: <Users className="w-4 h-4" /> },
  { type: 'education', label: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
  { type: 'skills', label: 'Skills', icon: <Lightbulb className="w-4 h-4" /> },
  { type: 'custom', label: 'Custom', icon: <LayoutList className="w-4 h-4" /> },
];

export default function CVBuilder() {
  const [showAddModal, setShowAddModal] = useState(false);
  
  const {
    cvData,
    updatePersonalInfo,
    addSection,
    removeSection,
    updateSectionTitle,
    reorderSections,
    addEducation,
    updateEducation,
    removeEducation,
    addWorkExperience,
    updateWorkExperience,
    removeWorkExperience,
    addWorkBullet,
    updateWorkBullet,
    removeWorkBullet,
    addProject,
    updateProject,
    removeProject,
    addProjectExperience,
    updateProjectExperience,
    removeProjectExperience,
    addLeadership,
    updateLeadership,
    removeLeadership,
    addLeadershipExperience,
    updateLeadershipExperience,
    removeLeadershipExperience,
    addCustomField,
    updateCustomField,
    removeCustomField,
    addSkillCategory,
    updateSkillCategory,
    removeSkillCategory,
    resetCV,
  } = useCVStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = cvData.sections.findIndex((s) => s.id === active.id);
      const newIndex = cvData.sections.findIndex((s) => s.id === over.id);
      reorderSections(arrayMove(cvData.sections, oldIndex, newIndex));
    }
  };

  const handleAddSection = (type: SectionType) => {
    const titles: Record<SectionType, string> = {
      'education': 'EDUCATION',
      'work-experience': 'WORK EXPERIENCE',
      'project-experience': 'PROJECT EXPERIENCE',
      'leadership': 'LEADERSHIP EXPERIENCE',
      'skills': 'SKILLS & INTERESTS',
      'custom': 'CUSTOM SECTION',
    };
    addSection(type, titles[type]);
    setShowAddModal(false);
  };

  const renderSectionContent = (sectionId: string, sectionType: string) => {
    switch (sectionType) {
      case 'education':
        return (
          <EducationSection
            items={cvData.education}
            onUpdate={updateEducation}
            onAdd={addEducation}
            onRemove={removeEducation}
          />
        );
      case 'work-experience':
        return (
          <WorkExperienceSection
            items={cvData.workExperience}
            onUpdate={updateWorkExperience}
            onAdd={addWorkExperience}
            onRemove={removeWorkExperience}
            onAddBullet={addWorkBullet}
            onUpdateBullet={updateWorkBullet}
            onRemoveBullet={removeWorkBullet}
          />
        );
      case 'project-experience':
        return (
          <ProjectSection
            items={cvData.projectExperience}
            onUpdate={updateProject}
            onAdd={addProject}
            onRemove={removeProject}
            onAddExperience={addProjectExperience}
            onUpdateExperience={updateProjectExperience}
            onRemoveExperience={removeProjectExperience}
          />
        );
      case 'leadership':
        return (
          <LeadershipSection
            items={cvData.leadership}
            onUpdate={updateLeadership}
            onAdd={addLeadership}
            onRemove={removeLeadership}
            onAddExperience={addLeadershipExperience}
            onUpdateExperience={updateLeadershipExperience}
            onRemoveExperience={removeLeadershipExperience}
          />
        );
      case 'skills':
        const skillsSection = cvData.skillsSections?.find((s) => s.id === sectionId);
        if (!skillsSection) return null;
        return (
          <SkillsSection
            section={skillsSection}
            onAddCategory={() => addSkillCategory(sectionId)}
            onUpdateCategory={(categoryId, field, value) => updateSkillCategory(sectionId, categoryId, field, value)}
            onRemoveCategory={(categoryId) => removeSkillCategory(sectionId, categoryId)}
          />
        );
      case 'custom':
        const customSection = cvData.customSections.find((s) => s.id === sectionId);
        if (!customSection) return null;
        return (
          <CustomSectionContent
            section={customSection}
            onAddField={() => addCustomField(sectionId)}
            onUpdateField={(fieldId, value) => updateCustomField(sectionId, fieldId, value)}
            onRemoveField={(fieldId) => removeCustomField(sectionId, fieldId)}
          />
        );
      default:
        return null;
    }
  };

  const getAddHandler = (sectionType: string) => {
    switch (sectionType) {
      case 'education':
        return addEducation;
      case 'work-experience':
        return addWorkExperience;
      case 'project-experience':
        return addProject;
      case 'leadership':
        return addLeadership;
      default:
        return undefined;
    }
  };

  return (
    <div className="min-h-screen cv-builder-page">
      {/* Toolbar */}
      <motion.header 
        className="cv-toolbar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="cv-toolbar-left">
          <Link href="/" className="cv-back-btn">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
          <div className="cv-title-input">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">CV Builder</span>
          </div>
        </div>
        
        <div className="cv-toolbar-right">
          <button onClick={resetCV} className="cv-toolbar-btn" title="Reset CV">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button className="cv-toolbar-btn" title="Share">
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <PdfDownloadButton cvData={cvData} className="cv-toolbar-btn cv-download-btn" />
        </div>
      </motion.header>

      {/* Formatting Toolbar */}
      <FormattingToolbar />

      {/* CV Editor */}
      <main className="cv-editor-container">
        <motion.div 
          className="cv-paper"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            fontFamily: `'${cvData.styles.fontFamily}', serif`,
            fontSize: `${cvData.styles.fontSize}pt`,
            lineHeight: cvData.styles.lineHeight,
            color: cvData.styles.textColor,
            ['--cv-primary-color' as string]: cvData.styles.primaryColor,
            ['--cv-name-size' as string]: `${cvData.styles.nameFontSize}pt`,
          }}
        >
          {/* Personal Info Header */}
          <header className="cv-header">
            <h1 className="cv-name">
              <EditableText
                value={cvData.personalInfo.fullName}
                onChange={(v) => updatePersonalInfo('fullName', v)}
                className="cv-name-text"
              />
            </h1>
            <div className="cv-contact">
              <EditableText
                value={cvData.personalInfo.contactLine}
                onChange={(v) => updatePersonalInfo('contactLine', v)}
                className="cv-contact-line"
              />
            </div>
          </header>

          {/* Draggable Sections */}
          <DndWrapper
            items={cvData.sections.map((s) => s.id)}
            onDragEnd={handleDragEnd}
          >
            {cvData.sections
              .sort((a, b) => a.order - b.order)
              .map((section) => (
                <SectionWrapper
                  key={section.id}
                  id={section.id}
                  title={section.title}
                  onTitleChange={(title) => updateSectionTitle(section.id, title)}
                  onAdd={getAddHandler(section.type)}
                  onDelete={() => removeSection(section.id)}
                  showDelete={true}
                >
                  {renderSectionContent(section.id, section.type)}
                </SectionWrapper>
              ))}
          </DndWrapper>

          {/* Add Section Button */}
          <div className="cv-add-section-wrapper">
            <button
              onClick={() => setShowAddModal(true)}
              className="cv-add-section-btn"
            >
              <Plus className="w-4 h-4" />
              <span>ADD SECTION</span>
            </button>
          </div>
        </motion.div>
      </main>

      {/* Add Section Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              className="cv-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              className="cv-modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <div className="cv-modal-header">
                <div>
                  <h2 className="cv-modal-title">Add Section</h2>
                  <p className="cv-modal-subtitle">What type of section would you like to add?</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="cv-modal-close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="cv-modal-content">
                {sectionOptions.map((option) => (
                  <button
                    key={option.type}
                    onClick={() => handleAddSection(option.type)}
                    className="cv-modal-option"
                  >
                    {option.icon}
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
