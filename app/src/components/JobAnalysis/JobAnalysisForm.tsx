// src/components/JobAnalysis/JobAnalysisForm.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useJobAnalyzer } from "@/hooks/useJobAnalyzer";
import { CompanyInfo, JobSummary } from "@/model";
import fetchJobContent from "@/services/fetchJobContent";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";

interface JobAnalysisFormProps {
  onAnalysisComplete: (
    jobSummary: JobSummary,
    companyInfo: CompanyInfo
  ) => void;
}

const JobAnalysisForm: React.FC<JobAnalysisFormProps> = ({
  onAnalysisComplete,
}) => {
  const [jobLink, setJobLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { analyzeJob, isAnalyzing, error } = useJobAnalyzer();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const jobContent = await fetchJobContent(jobLink);
      const { jobSummary, companyInfo } = await analyzeJob(jobContent);
      onAnalysisComplete(jobSummary, companyInfo);
    } catch (err) {
      console.error("Error analyzing job:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="job-link">Job Posting Link</Label>
        <Input
          id="job-link"
          value={jobLink}
          onChange={(e) => setJobLink(e.target.value)}
          placeholder="Enter job posting URL"
        />
      </div>
      <Button type="submit" disabled={isLoading || isAnalyzing}>
        {isLoading || isAnalyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          "Analyze Job"
        )}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </motion.form>
  );
};

export default JobAnalysisForm;
