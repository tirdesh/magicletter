// src/types/wizard.ts

import {
  CandidateInfo,
  CompanyInfo,
  GeneratedCoverLetter,
  JobSummary,
  RelevantExperience,
} from "@/model";

export interface WizardState {
  currentStep: number;
  jobSummary: JobSummary | null;
  companyInfo: CompanyInfo | null;
  relevantExperience: RelevantExperience | null;
  candidateInfo: CandidateInfo | null;
  generatedLetter: GeneratedCoverLetter | null;
}
