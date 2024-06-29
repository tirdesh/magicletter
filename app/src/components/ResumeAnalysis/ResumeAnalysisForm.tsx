// src/components/ResumeAnalysis/ResumeAnalysisForm.tsx
import SelectOrUploadResume from "@/components/SelectOrUploadResume";
import { useToast } from "@/components/ui/use-toast";
import { useResumeAnalyzer } from "@/hooks/useResumeAnalyzer";
import {
  CandidateInfo,
  CompanyInfo,
  JobSummary,
  RelevantExperience,
} from "@/model";
import { getResumeText } from "@/utils/resumeUtils/resumeText";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { Button } from "../ui/button";

interface ResumeAnalysisFormProps {
  jobSummary: JobSummary;
  companyInfo: CompanyInfo;
  onAnalysisComplete: (
    relevantExperience: RelevantExperience,
    candidateInfo: CandidateInfo
  ) => void;
}

const ResumeAnalysisForm: React.FC<ResumeAnalysisFormProps> = ({
  jobSummary,
  companyInfo,
  onAnalysisComplete,
}) => {
  const [selectedResume, setSelectedResume] = useState("");
  const { toast } = useToast();
  const { analyzeResume, isAnalyzing, error } = useResumeAnalyzer();

  const handleAnalyze = async () => {
    if (!selectedResume) {
      toast({
        title: "Error",
        description: "Please select a resume to analyze.",
        variant: "destructive",
      });
      return;
    }

    try {
      const resumeText = await getResumeText(selectedResume);
      const { relevantExperience, candidateInfo } = await analyzeResume(
        resumeText,
        jobSummary,
        companyInfo
      );
      onAnalysisComplete(relevantExperience, candidateInfo);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast({
        title: "Error",
        description: "Failed to analyze resume.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <SelectOrUploadResume onResumeSelect={setSelectedResume} />
      <Button onClick={handleAnalyze} disabled={isAnalyzing || !selectedResume}>
        {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
      </Button>

      {error && <p className="text-red-500">{error}</p>}
    </motion.div>
  );
};

export default ResumeAnalysisForm;
