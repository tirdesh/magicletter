// src/pages/CoverLetterWizard.tsx
import CoverLetter from "@/components/CoverLetter";
import JobAnalysis from "@/components/JobAnalysis";
import ResumeAnalysis from "@/components/ResumeAnalysis";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  CandidateInfo,
  CompanyInfo,
  GeneratedCoverLetter,
  JobSummary,
  RelevantExperience,
} from "@/model";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";

const steps = ["Job Analysis", "Resume Analysis", "Cover Letter Generation"];

const CoverLetterWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [jobSummary, setJobSummary] = useState<JobSummary | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [relevantExperience, setRelevantExperience] =
    useState<RelevantExperience | null>(null);
  const [candidateInfo, setCandidateInfo] = useState<CandidateInfo | null>(
    null
  );
  const [generatedLetter, setGeneratedLetter] =
    useState<GeneratedCoverLetter | null>(null);

  const handleJobAnalysisComplete = (
    newJobSummary: JobSummary,
    newCompanyInfo: CompanyInfo
  ) => {
    setJobSummary(newJobSummary);
    setCompanyInfo(newCompanyInfo);
  };

  const handleJobAnalysisUpdate = (
    updatedJobSummary: JobSummary,
    updatedCompanyInfo: CompanyInfo
  ) => {
    setJobSummary(updatedJobSummary);
    setCompanyInfo(updatedCompanyInfo);
  };

  const handleResumeAnalysisComplete = (
    newRelevantExperience: RelevantExperience,
    newCandidateInfo: CandidateInfo
  ) => {
    setRelevantExperience(newRelevantExperience);
    setCandidateInfo(newCandidateInfo);
  };

  const handleResumeAnalysisUpdate = (
    updatedRelevantExperience: RelevantExperience,
    updatedCandidateInfo: CandidateInfo
  ) => {
    setRelevantExperience(updatedRelevantExperience);
    setCandidateInfo(updatedCandidateInfo);
  };

  const handleCoverLetterGenerated = (content: string) => {
    setGeneratedLetter({ content });
  };

  const handleCoverLetterUpdate = (updatedContent: string) => {
    setGeneratedLetter({ content: updatedContent });
  };

  const canProceed = () => {
    if (currentStep === 0) return jobSummary && companyInfo;
    if (currentStep === 1) return relevantExperience && candidateInfo;
    return false;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 max-w-4xl"
    >
      <Card className="shadow-lg">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-2xl">Cover Letter Wizard</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-8">
            <Progress
              value={(currentStep + 1) * (100 / steps.length)}
              className="h-2"
            />
            <div className="flex justify-between mt-2">
              {steps.map((step, index) => (
                <span
                  key={step}
                  className={`text-sm ${
                    index === currentStep
                      ? "font-bold text-primary"
                      : index < currentStep
                      ? "text-gray-600"
                      : "text-gray-400"
                  }`}
                >
                  {step}
                </span>
              ))}
            </div>
          </div>

          <div className="min-h-[400px]">
            {currentStep === 0 && (
              <JobAnalysis
                initialJobSummary={jobSummary}
                initialCompanyInfo={companyInfo}
                onAnalysisComplete={handleJobAnalysisComplete}
                onUpdate={handleJobAnalysisUpdate}
              />
            )}

            {currentStep === 1 && jobSummary && companyInfo && (
              <ResumeAnalysis
                jobSummary={jobSummary}
                companyInfo={companyInfo}
                initialRelevantExperience={relevantExperience}
                initialCandidateInfo={candidateInfo}
                onAnalysisComplete={handleResumeAnalysisComplete}
                onUpdate={handleResumeAnalysisUpdate}
              />
            )}

            {currentStep === 2 &&
              jobSummary &&
              companyInfo &&
              relevantExperience &&
              candidateInfo && (
                <CoverLetter
                  jobSummary={jobSummary}
                  companyInfo={companyInfo}
                  relevantExperience={relevantExperience}
                  candidateInfo={candidateInfo}
                  initialGeneratedLetter={generatedLetter}
                  onGenerate={handleCoverLetterGenerated}
                  onUpdate={handleCoverLetterUpdate}
                />
              )}
          </div>

          <div className="mt-8 flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 0}
              className="flex items-center"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <div className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </div>
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
                className="flex items-center"
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button className="flex items-center">
                Finish <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CoverLetterWizard;
