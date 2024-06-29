// src/hooks/useCoverLetterGenerator.ts
import {
  CandidateInfo,
  CompanyInfo,
  CoverLetterOptions,
  JobSummary,
  RelevantExperience,
} from "@/model";
import { useState } from "react";
import { CoverLetterWriter } from "../utils/coverLetterWriter";

export const useCoverLetterWriter = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCoverLetter = async (
    jobSummary: JobSummary,
    companyInfo: CompanyInfo,
    relevantExperience: RelevantExperience,
    candidateInfo: CandidateInfo,
    userInstructions: string,
    options: CoverLetterOptions
  ) => {
    setIsGenerating(true);
    setError(null);
    try {
      const generator = new CoverLetterWriter("openai"); // or 'claude'
      const initialCoverLetter = await generator.generateInitialCoverLetter(
        jobSummary,
        companyInfo,
        relevantExperience,
        userInstructions,
        options
      );
      const finalCoverLetter = await generator.refineCoverLetter(
        initialCoverLetter,
        jobSummary,
        options,
        candidateInfo,
        companyInfo
      );
      return finalCoverLetter;
    } catch (err) {
      setError("Failed to generate cover letter");
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateCoverLetter, isGenerating, error };
};
