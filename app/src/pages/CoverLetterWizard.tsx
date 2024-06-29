// src/pages/CoverLetterWizard.tsx
import { CoverLetterForm } from "@/components/CoverLetter/CoverLetterForm";
import CoverLetterResult from "@/components/CoverLetter/CoverLetterResult";
import JobAnalysis from "@/components/JobAnalysis";
import ResumeAnalysisForm from "@/components/ResumeAnalysis/ResumeAnalysisForm";
import ResumeAnalysisResult from "@/components/ResumeAnalysis/ResumeAnalysisResult";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CandidateInfo,
  CompanyInfo,
  GeneratedCoverLetter,
  JobSummary,
  RelevantExperience,
} from "@/model";
import { motion } from "framer-motion";
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4"
    >
      <Card>
        <CardHeader>
          <CardTitle>Cover Letter Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            {steps.map((step, index) => (
              <span
                key={step}
                className={`${
                  index === currentStep ? "font-bold" : "text-gray-400"
                } ${index < steps.length - 1 ? "mr-4" : ""}`}
              >
                {step} {index < steps.length - 1 && "→"}
              </span>
            ))}
          </div>

          {currentStep === 0 && (
            <JobAnalysis
              initialJobSummary={jobSummary}
              initialCompanyInfo={companyInfo}
              onAnalysisComplete={handleJobAnalysisComplete}
              onUpdate={handleJobAnalysisUpdate}
            />
          )}

          {currentStep === 1 && jobSummary && companyInfo && (
            <>
              <ResumeAnalysisForm
                jobSummary={jobSummary}
                companyInfo={companyInfo}
                onAnalysisComplete={handleResumeAnalysisComplete}
              />
              {relevantExperience && candidateInfo && (
                <ResumeAnalysisResult
                  initialRelevantExperience={relevantExperience}
                  initialCandidateInfo={candidateInfo}
                  onUpdate={handleResumeAnalysisUpdate}
                />
              )}
            </>
          )}

          {currentStep === 2 &&
            jobSummary &&
            companyInfo &&
            relevantExperience &&
            candidateInfo && (
              <>
                <CoverLetterForm
                  jobSummary={jobSummary}
                  companyInfo={companyInfo}
                  relevantExperience={relevantExperience}
                  candidateInfo={candidateInfo}
                  onGenerateComplete={handleCoverLetterGenerated}
                />
                {generatedLetter && (
                  <CoverLetterResult generatedLetter={generatedLetter} />
                )}
              </>
            )}

          <div className="mt-4 flex justify-between">
            {currentStep > 0 && (
              <Button onClick={() => setCurrentStep(currentStep - 1)}>
                Previous
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={
                  (currentStep === 0 && (!jobSummary || !companyInfo)) ||
                  (currentStep === 1 && (!relevantExperience || !candidateInfo))
                }
              >
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CoverLetterWizard;
