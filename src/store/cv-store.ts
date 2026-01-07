import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  CVData, 
  CVEducation, 
  CVExperience, 
  CVProject, 
  CVLeadership,
  CVCustomSection,
  CVSection,
  defaultCVData,
  SectionType,
  CVSkillCategory,
  CVStyles,
  defaultCVStyles
} from '@/data/cv-types';

interface CVStore {
  cvData: CVData;
  
  // Personal Info
  updatePersonalInfo: (field: keyof CVData['personalInfo'], value: string) => void;
  
  // Section Management
  addSection: (type: SectionType, title?: string) => void;
  removeSection: (sectionId: string) => void;
  updateSectionTitle: (sectionId: string, title: string) => void;
  reorderSections: (sections: CVSection[]) => void;
  
  // Education
  addEducation: () => void;
  updateEducation: (id: string, field: keyof CVEducation, value: string) => void;
  removeEducation: (id: string) => void;
  
  // Work Experience
  addWorkExperience: () => void;
  updateWorkExperience: (id: string, field: keyof CVExperience, value: string | string[]) => void;
  removeWorkExperience: (id: string) => void;
  addWorkBullet: (experienceId: string) => void;
  updateWorkBullet: (experienceId: string, bulletIndex: number, value: string) => void;
  removeWorkBullet: (experienceId: string, bulletIndex: number) => void;
  
  // Project Experience
  addProject: () => void;
  updateProject: (id: string, field: keyof CVProject, value: string | string[]) => void;
  removeProject: (id: string) => void;
  addProjectExperience: (projectId: string) => void;
  updateProjectExperience: (projectId: string, index: number, value: string) => void;
  removeProjectExperience: (projectId: string, index: number) => void;
  
  // Leadership
  addLeadership: () => void;
  updateLeadership: (id: string, field: keyof CVLeadership, value: string | string[]) => void;
  removeLeadership: (id: string) => void;
  addLeadershipExperience: (leadershipId: string) => void;
  updateLeadershipExperience: (leadershipId: string, index: number, value: string) => void;
  removeLeadershipExperience: (leadershipId: string, index: number) => void;
  
  // Skills Sections
  addSkillCategory: (sectionId: string) => void;
  updateSkillCategory: (sectionId: string, categoryId: string, field: keyof CVSkillCategory, value: string) => void;
  removeSkillCategory: (sectionId: string, categoryId: string) => void;
  
  // Custom Sections
  addCustomSection: () => void;
  updateCustomSectionTitle: (sectionId: string, title: string) => void;
  removeCustomSection: (sectionId: string) => void;
  addCustomField: (sectionId: string) => void;
  updateCustomField: (sectionId: string, fieldId: string, value: string) => void;
  removeCustomField: (sectionId: string, fieldId: string) => void;
  
  // Styles
  updateStyles: (field: keyof CVStyles, value: string | number) => void;
  resetStyles: () => void;
  
  // Reset
  resetCV: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useCVStore = create<CVStore>()(
  persist(
    (set) => ({
      cvData: defaultCVData,
      
      updatePersonalInfo: (field, value) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            personalInfo: { ...state.cvData.personalInfo, [field]: value },
          },
        })),
      
      // Section Management
      addSection: (type, title) =>
        set((state) => {
          const newSection: CVSection = {
            id: `sec-${generateId()}`,
            type,
            title: title || (type === 'custom' ? 'CUSTOM SECTION' : type.toUpperCase().replace('-', ' ')),
            order: state.cvData.sections.length,
          };
          
          let customSections = state.cvData.customSections;
          let skillsSections = state.cvData.skillsSections || [];
          
          // If it's a custom section, create the custom section data
          if (type === 'custom') {
            customSections = [
              ...customSections,
              {
                id: newSection.id,
                title: newSection.title,
                fields: [{ id: generateId(), content: 'Objective, Summary, Certificates etc.' }],
              },
            ];
          }
          
          // If it's a skills section, create the skills section data
          if (type === 'skills') {
            skillsSections = [
              ...skillsSections,
              {
                id: newSection.id,
                categories: [
                  { id: generateId(), label: 'Skills', value: 'Microsoft Office (Word, Excel, PowerPoint)' },
                  { id: generateId(), label: 'Interests', value: 'Untitled' },
                ],
              },
            ];
          }
          
          return {
            cvData: {
              ...state.cvData,
              sections: [...state.cvData.sections, newSection],
              customSections,
              skillsSections,
            },
          };
        }),
      
      removeSection: (sectionId) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            sections: state.cvData.sections.filter((s) => s.id !== sectionId),
            customSections: state.cvData.customSections.filter((s) => s.id !== sectionId),
            skillsSections: (state.cvData.skillsSections || []).filter((s) => s.id !== sectionId),
          },
        })),
      
      updateSectionTitle: (sectionId, title) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            sections: state.cvData.sections.map((s) =>
              s.id === sectionId ? { ...s, title } : s
            ),
            customSections: state.cvData.customSections.map((s) =>
              s.id === sectionId ? { ...s, title } : s
            ),
          },
        })),
      
      reorderSections: (sections) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            sections: sections.map((s, i) => ({ ...s, order: i })),
          },
        })),
      
      // Education
      addEducation: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            education: [
              ...state.cvData.education,
              {
                id: `edu-${generateId()}`,
                university: 'University',
                degree: 'Degree',
                city: 'City',
                state: 'State',
                graduationDate: 'Graduation Date',
              },
            ],
          },
        })),
      
      updateEducation: (id, field, value) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            education: state.cvData.education.map((edu) =>
              edu.id === id ? { ...edu, [field]: value } : edu
            ),
          },
        })),
      
      removeEducation: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            education: state.cvData.education.filter((edu) => edu.id !== id),
          },
        })),
      
      // Work Experience
      addWorkExperience: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            workExperience: [
              ...state.cvData.workExperience,
              {
                id: `work-${generateId()}`,
                company: 'Company',
                jobTitle: 'Job title',
                city: 'City',
                state: 'State',
                startDate: 'Start Date',
                endDate: 'Finish Date',
                bullets: ['Bullet point 1', 'Bullet point 2', 'Bullet point 3'],
              },
            ],
          },
        })),
      
      updateWorkExperience: (id, field, value) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            workExperience: state.cvData.workExperience.map((exp) =>
              exp.id === id ? { ...exp, [field]: value } : exp
            ),
          },
        })),
      
      removeWorkExperience: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            workExperience: state.cvData.workExperience.filter((exp) => exp.id !== id),
          },
        })),
      
      addWorkBullet: (experienceId) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            workExperience: state.cvData.workExperience.map((exp) =>
              exp.id === experienceId
                ? { ...exp, bullets: [...exp.bullets, 'New bullet point'] }
                : exp
            ),
          },
        })),
      
      updateWorkBullet: (experienceId, bulletIndex, value) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            workExperience: state.cvData.workExperience.map((exp) =>
              exp.id === experienceId
                ? {
                    ...exp,
                    bullets: exp.bullets.map((b, i) => (i === bulletIndex ? value : b)),
                  }
                : exp
            ),
          },
        })),
      
      removeWorkBullet: (experienceId, bulletIndex) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            workExperience: state.cvData.workExperience.map((exp) =>
              exp.id === experienceId
                ? { ...exp, bullets: exp.bullets.filter((_, i) => i !== bulletIndex) }
                : exp
            ),
          },
        })),
      
      // Project Experience
      addProject: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            projectExperience: [
              ...state.cvData.projectExperience,
              {
                id: `proj-${generateId()}`,
                organization: 'Organization',
                title: 'Title',
                city: 'City',
                state: 'State',
                startDate: 'Start Date',
                endDate: 'Finish Date',
                experiences: ['Experience 1', 'Experience 2', 'Experience 3'],
              },
            ],
          },
        })),
      
      updateProject: (id, field, value) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            projectExperience: state.cvData.projectExperience.map((proj) =>
              proj.id === id ? { ...proj, [field]: value } : proj
            ),
          },
        })),
      
      removeProject: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            projectExperience: state.cvData.projectExperience.filter((proj) => proj.id !== id),
          },
        })),
      
      addProjectExperience: (projectId) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            projectExperience: state.cvData.projectExperience.map((proj) =>
              proj.id === projectId
                ? { ...proj, experiences: [...proj.experiences, 'New experience'] }
                : proj
            ),
          },
        })),
      
      updateProjectExperience: (projectId, index, value) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            projectExperience: state.cvData.projectExperience.map((proj) =>
              proj.id === projectId
                ? {
                    ...proj,
                    experiences: proj.experiences.map((e, i) => (i === index ? value : e)),
                  }
                : proj
            ),
          },
        })),
      
      removeProjectExperience: (projectId, index) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            projectExperience: state.cvData.projectExperience.map((proj) =>
              proj.id === projectId
                ? { ...proj, experiences: proj.experiences.filter((_, i) => i !== index) }
                : proj
            ),
          },
        })),
      
      // Leadership
      addLeadership: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            leadership: [
              ...state.cvData.leadership,
              {
                id: `lead-${generateId()}`,
                organization: 'Organization',
                title: 'Title',
                city: 'City',
                state: 'State',
                startDate: 'Start Date',
                endDate: 'Finish Date',
                experiences: ['Experience 1', 'Experience 2', 'Experience 3'],
              },
            ],
          },
        })),
      
      updateLeadership: (id, field, value) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            leadership: state.cvData.leadership.map((lead) =>
              lead.id === id ? { ...lead, [field]: value } : lead
            ),
          },
        })),
      
      removeLeadership: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            leadership: state.cvData.leadership.filter((lead) => lead.id !== id),
          },
        })),
      
      addLeadershipExperience: (leadershipId) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            leadership: state.cvData.leadership.map((lead) =>
              lead.id === leadershipId
                ? { ...lead, experiences: [...lead.experiences, 'New experience'] }
                : lead
            ),
          },
        })),
      
      updateLeadershipExperience: (leadershipId, index, value) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            leadership: state.cvData.leadership.map((lead) =>
              lead.id === leadershipId
                ? {
                    ...lead,
                    experiences: lead.experiences.map((e, i) => (i === index ? value : e)),
                  }
                : lead
            ),
          },
        })),
      
      removeLeadershipExperience: (leadershipId, index) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            leadership: state.cvData.leadership.map((lead) =>
              lead.id === leadershipId
                ? { ...lead, experiences: lead.experiences.filter((_, i) => i !== index) }
                : lead
            ),
          },
        })),
      
      // Skills Sections
      addSkillCategory: (sectionId) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            skillsSections: (state.cvData.skillsSections || []).map((s) =>
              s.id === sectionId
                ? {
                    ...s,
                    categories: [...s.categories, { id: generateId(), label: 'Category', value: 'Value' }],
                  }
                : s
            ),
          },
        })),
      
      updateSkillCategory: (sectionId, categoryId, field, value) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            skillsSections: (state.cvData.skillsSections || []).map((s) =>
              s.id === sectionId
                ? {
                    ...s,
                    categories: s.categories.map((c) =>
                      c.id === categoryId ? { ...c, [field]: value } : c
                    ),
                  }
                : s
            ),
          },
        })),
      
      removeSkillCategory: (sectionId, categoryId) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            skillsSections: (state.cvData.skillsSections || []).map((s) =>
              s.id === sectionId
                ? { ...s, categories: s.categories.filter((c) => c.id !== categoryId) }
                : s
            ),
          },
        })),
      
      // Custom Sections
      addCustomSection: () =>
        set((state) => {
          const sectionId = `sec-${generateId()}`;
          return {
            cvData: {
              ...state.cvData,
              sections: [
                ...state.cvData.sections,
                {
                  id: sectionId,
                  type: 'custom',
                  title: 'CUSTOM SECTION',
                  order: state.cvData.sections.length,
                },
              ],
              customSections: [
                ...state.cvData.customSections,
                {
                  id: sectionId,
                  title: 'CUSTOM SECTION',
                  fields: [{ id: generateId(), content: 'Objective, Summary, Certificates etc.' }],
                },
              ],
            },
          };
        }),
      
      updateCustomSectionTitle: (sectionId, title) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            sections: state.cvData.sections.map((s) =>
              s.id === sectionId ? { ...s, title } : s
            ),
            customSections: state.cvData.customSections.map((s) =>
              s.id === sectionId ? { ...s, title } : s
            ),
          },
        })),
      
      removeCustomSection: (sectionId) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            sections: state.cvData.sections.filter((s) => s.id !== sectionId),
            customSections: state.cvData.customSections.filter((s) => s.id !== sectionId),
          },
        })),
      
      addCustomField: (sectionId) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            customSections: state.cvData.customSections.map((s) =>
              s.id === sectionId
                ? {
                    ...s,
                    fields: [...s.fields, { id: generateId(), content: 'Objective, Summary, Certificates etc.' }],
                  }
                : s
            ),
          },
        })),
      
      updateCustomField: (sectionId, fieldId, value) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            customSections: state.cvData.customSections.map((s) =>
              s.id === sectionId
                ? {
                    ...s,
                    fields: s.fields.map((f) =>
                      f.id === fieldId ? { ...f, content: value } : f
                    ),
                  }
                : s
            ),
          },
        })),
      
      removeCustomField: (sectionId, fieldId) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            customSections: state.cvData.customSections.map((s) =>
              s.id === sectionId
                ? { ...s, fields: s.fields.filter((f) => f.id !== fieldId) }
                : s
            ),
          },
        })),
      
      // Styles
      updateStyles: (field, value) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            styles: { ...state.cvData.styles, [field]: value },
          },
        })),
      
      resetStyles: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            styles: defaultCVStyles,
          },
        })),
      
      resetCV: () => set({ cvData: defaultCVData }),
    }),
    {
      name: 'cv-storage',
      merge: (persistedState, currentState) => {
        const persisted = persistedState as { cvData?: Partial<CVData> };
        
        // Migrate old custom section fields (label + value) to new format (content)
        const migratedCustomSections = persisted?.cvData?.customSections?.map((section) => ({
          ...section,
          fields: section.fields?.map((field) => {
            // Check if it's old format (has label and value but no content)
            const oldField = field as { id: string; label?: string; value?: string; content?: string };
            if (oldField.label !== undefined && oldField.value !== undefined && oldField.content === undefined) {
              return {
                id: oldField.id,
                content: oldField.value || oldField.label || 'Objective, Summary, Certificates etc.',
              };
            }
            return field;
          }) || [],
        })) || [];

        return {
          ...currentState,
          cvData: {
            ...defaultCVData,
            ...persisted?.cvData,
            customSections: migratedCustomSections.length > 0 ? migratedCustomSections : defaultCVData.customSections,
            // Ensure styles always has default values
            styles: {
              ...defaultCVStyles,
              ...(persisted?.cvData?.styles || {}),
            },
          },
        };
      },
    }
  )
);
