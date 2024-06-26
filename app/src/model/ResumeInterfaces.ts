// src/model/ResumeInterfaces.ts
export interface ResumeSection {
  title: string;
  content: string[];
  description?: string;
  company?: string;
  institution?: string;
  date?: string;
  technologies?: string[];
}

export interface ParsedResume {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  summary: string;
  experience: ResumeSection[];
  education: ResumeSection[];
  skills: string[];
  projects: ResumeSection[];
  certifications: string[];
  languages: string[];
  additionalSections: ResumeSection[];
}