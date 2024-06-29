// src/hooks/useJobAnalyzer.ts
import { useState } from "react";
import { JobAnalyzer } from "./../utils/jobAnalyzer";

export const useJobAnalyzer = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeJob = async (jobDescription: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const generator = new JobAnalyzer("openai"); // or 'claude'
      const jobSummary = await generator.fetchJobSummary(jobDescription);
      const companyInfo = await generator.identifyCompanyInfo(jobDescription);
      return { jobSummary, companyInfo };
    } catch (err) {
      setError("Failed to analyze job description");
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { analyzeJob, isAnalyzing, error };
};
