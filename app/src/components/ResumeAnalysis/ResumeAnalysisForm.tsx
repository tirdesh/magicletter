// src/components/ResumeAnalysis/ResumeAnalysisForm.tsx
import SelectOrUploadResume from "@/components/SelectOrUploadResume";
import { useToast } from "@/components/ui/use-toast";
import { useResumeAnalyzer } from "@/hooks/useResumeAnalyzer";
import {
  CandidateInfo,
  CompanyInfo,
  JobSummary,
  RelevantExperience,
  Resume,
} from "@/model";
import { addResume, getResumes } from "@/utils/firebaseFunctions";
import { getResumeText } from "@/utils/resumeUtils/resumeText";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { ResumeFormValues } from "../ResumeUpload";
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
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [accordionValue, setAccordionValue] = useState("");
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { analyzeResume, isAnalyzing, error } = useResumeAnalyzer();

  useEffect(() => {
    fetchResumes();
  });

  const fetchResumes = async () => {
    try {
      const fetchedResumes = await getResumes();
      setResumes(fetchedResumes);
    } catch (error) {
      console.error("Error fetching resumes:", error);
      toast({
        title: "Error",
        description: "Failed to fetch resumes.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingResumes(false);
    }
  };

  const handleUpload = async (values: ResumeFormValues) => {
    setIsUploading(true);
    try {
      const newResumeId = await addResume(values.file, values.label);
      toast({
        title: "Success",
        description: "Resume uploaded successfully.",
      });
      await fetchResumes();
      setSelectedResume(newResumeId);
      setAccordionValue("");
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast({
        title: "Error",
        description: "Failed to upload resume.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

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
      {isLoadingResumes ? (
        <p>Loading resumes...</p>
      ) : (
        <SelectOrUploadResume
          selectedResume={selectedResume}
          setSelectedResume={setSelectedResume}
          resumes={resumes}
          accordionValue={accordionValue}
          setAccordionValue={setAccordionValue}
          handleUpload={handleUpload}
          isUploading={isUploading}
        />
      )}
      <Button
        onClick={handleAnalyze}
        disabled={isAnalyzing || !selectedResume || isUploading}
      >
        {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
      </Button>

      {error && <p className="text-red-500">{error}</p>}
    </motion.div>
  );
};

export default ResumeAnalysisForm;
