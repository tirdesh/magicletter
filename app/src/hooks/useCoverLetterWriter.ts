// src/hooks/useCoverLetterWriter.ts
import {
  CandidateInfo,
  CompanyInfo,
  CoverLetterOptions,
  GeneratedCoverLetter,
  JobSummary,
  RelevantExperience,
} from "@/model";
import { CoverLetterWriter } from "@/utils/coverLetterWriter";
import { useState } from "react";

export const useCoverLetterWriter = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCoverLetter = async (
    jobSummary: JobSummary,
    companyInfo: CompanyInfo,
    relevantExperience: RelevantExperience,
    candidateInfo: CandidateInfo,
    options: CoverLetterOptions
  ): Promise<GeneratedCoverLetter> => {
    setIsGenerating(true);
    setError(null);
    try {
      const writer = new CoverLetterWriter("openai"); // or 'claude'
      const result = await writer.generateCoverLetter(
        jobSummary,
        companyInfo,
        relevantExperience,
        candidateInfo,
        options
      );
      return result;
    } catch (err) {
      setError("Failed to generate cover letter");
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateCoverLetter, isGenerating, error };
};
