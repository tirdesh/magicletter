// CoverLetterInterfaces.ts
export interface GeneratedCoverLetter {
  content: string;
}

export interface JobSummary {
  summary: string;
  highlights: string[];
  keywords: string[];
  requiredSkills: string[];
  preferredSkills: string[];
}

export interface CompanyInfo {
  name: string;
  city: string;
  state: string;
  missionValues: string;
  recentNews: string;
  culture: string;
  industry: string;
}

export interface RelevantExperience {
  experiences: string[];
  skills: string[];
  achievements: string[];
}

export interface CoverLetterOptions {
  tone: "professional" | "enthusiastic" | "formal" | "conversational";
  focusAreas: (
    | "technical skills"
    | "soft skills"
    | "achievements"
    | "cultural fit"
  )[];
  paragraphs: number;
  customInstructions: string;
  includeCallToAction: boolean;
  emphasizeUniqueness: boolean;
}

export interface CandidateInfo {
  fullName: string;
  city: string;
  state: string;
  phoneNumber: string;
  email: string;
}
