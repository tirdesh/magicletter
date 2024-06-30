// src/hooks/useResumeAnalyzer.ts
import store from "@/redux/store";
import { useState } from "react";
import { CompanyInfo, JobSummary } from "../model";
import { ResumeAnalyzer } from "./../utils/resumeAnalyzer";

export const useResumeAnalyzer = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentProvider = store.getState().aiProvider.currentProvider;

  const analyzeResume = async (
    resumeText: string,
    jobSummary: JobSummary,
    companyInfo: CompanyInfo
  ) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const generator = new ResumeAnalyzer(currentProvider);
      const relevantExperience = await generator.fetchRelevantExperience(
        resumeText,
        jobSummary,
        companyInfo
      );
      const candidateInfo = await generator.extractCandidateInfo(resumeText);
      return { relevantExperience, candidateInfo };
    } catch (err) {
      setError(`Failed to analyze resume ${err}`);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { analyzeResume, isAnalyzing, error };
};
