export interface CVItem {
  id: string;
  content: string;
}

export interface CVEducation {
  id: string;
  university: string;
  degree: string;
  city: string;
  state: string;
  graduationDate: string;
}

export interface CVExperience {
  id: string;
  company: string;
  jobTitle: string;
  city: string;
  state: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface CVProject {
  id: string;
  organization: string;
  title: string;
  city: string;
  state: string;
  startDate: string;
  endDate: string;
  experiences: string[];
}

export interface CVLeadership {
  id: string;
  organization: string;
  title: string;
  city: string;
  state: string;
  startDate: string;
  endDate: string;
  experiences: string[];
}

export interface CVSkillCategory {
  id: string;
  label: string;
  value: string;
}

export interface CVSkillsSection {
  id: string;
  categories: CVSkillCategory[];
}

export interface CVCustomField {
  id: string;
  content: string;
}

export interface CVCustomSection {
  id: string;
  title: string;
  fields: CVCustomField[];
}

export type SectionType = 
  | 'education' 
  | 'work-experience' 
  | 'project-experience' 
  | 'leadership' 
  | 'skills'
  | 'custom';

export interface CVSection {
  id: string;
  type: SectionType;
  title: string;
  order: number;
}

export interface CVStyles {
  fontFamily: string;
  fontSize: number;
  nameFontSize: number;
  sectionTitleFontSize: number;
  lineHeight: number;
  primaryColor: string;
  textColor: string;
}

export const defaultCVStyles: CVStyles = {
  fontFamily: 'Times New Roman',
  fontSize: 11,
  nameFontSize: 24,
  sectionTitleFontSize: 11,
  lineHeight: 1.4,
  primaryColor: '#2a5c8a',
  textColor: '#333333',
};

export const fontOptions = [
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Garamond', label: 'Garamond' },
  { value: 'Palatino Linotype', label: 'Palatino' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Calibri', label: 'Calibri' },
  { value: 'Cambria', label: 'Cambria' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Tahoma', label: 'Tahoma' },
];

export interface CVData {
  personalInfo: {
    fullName: string;
    contactLine: string;
  };
  sections: CVSection[];
  education: CVEducation[];
  workExperience: CVExperience[];
  projectExperience: CVProject[];
  leadership: CVLeadership[];
  skillsSections: CVSkillsSection[];
  customSections: CVCustomSection[];
  styles: CVStyles;
}

export const defaultCVData: CVData = {
  personalInfo: {
    fullName: 'Your Name',
    contactLine: 'City, Country | Phone # | email@example.com | LinkedIn Link',
  },
  sections: [
    { id: 'sec-education', type: 'education', title: 'EDUCATION', order: 0 },
    { id: 'sec-work', type: 'work-experience', title: 'WORK EXPERIENCE', order: 1 },
    { id: 'sec-project', type: 'project-experience', title: 'PROJECT EXPERIENCE', order: 2 },
    { id: 'sec-leadership', type: 'leadership', title: 'LEADERSHIP EXPERIENCE', order: 3 },
  ],
  education: [
    {
      id: 'edu-1',
      university: 'University',
      degree: 'Degree',
      city: 'City',
      state: 'State',
      graduationDate: 'Graduation Date',
    },
  ],
  workExperience: [
    {
      id: 'work-1',
      company: 'Company',
      jobTitle: 'Job title',
      city: 'City',
      state: 'State',
      startDate: 'Start Date',
      endDate: 'Finish Date',
      bullets: ['Bullet point 1', 'Bullet point 2', 'Bullet point 3'],
    },
  ],
  projectExperience: [
    {
      id: 'proj-1',
      organization: 'Organization',
      title: 'Title',
      city: 'City',
      state: 'State',
      startDate: 'Start Date',
      endDate: 'Finish Date',
      experiences: ['Experience 1', 'Experience 2', 'Experience 3'],
    },
  ],
  leadership: [
    {
      id: 'lead-1',
      organization: 'Organization',
      title: 'Title',
      city: 'City',
      state: 'State',
      startDate: 'Start Date',
      endDate: 'Finish Date',
      experiences: ['Experience 1', 'Experience 2', 'Experience 3'],
    },
  ],
  skillsSections: [],
  customSections: [],
  styles: defaultCVStyles,
};
