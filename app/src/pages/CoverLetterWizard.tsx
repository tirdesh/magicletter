// src/pages/CoverLetterWizard.tsx

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import CoverLetter from "@/components/CoverLetter";
import JobAnalysis from "@/components/JobAnalysis";
import ResumeAnalysis from "@/components/ResumeAnalysis";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  CandidateInfo,
  CompanyInfo,
  JobSummary,
  RelevantExperience,
} from "@/model";
import {
  setCandidateInfo,
  setCompanyInfo,
  setCurrentStep,
  setGeneratedLetter,
  setJobSummary,
  setRelevantExperience,
} from "@/redux/slices/wizardSlice";
import { RootState } from "@/redux/store";

const steps = ["Job Analysis", "Resume Analysis", "Cover Letter Generation"];

const CoverLetterWizard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    currentStep,
    jobSummary,
    companyInfo,
    relevantExperience,
    candidateInfo,
    generatedLetter,
  } = useSelector((state: RootState) => state.wizard);

  const handleJobAnalysisComplete = (
    newJobSummary: JobSummary,
    newCompanyInfo: CompanyInfo
  ) => {
    dispatch(setJobSummary(newJobSummary));
    dispatch(setCompanyInfo(newCompanyInfo));
  };

  const handleResumeAnalysisComplete = (
    newRelevantExperience: RelevantExperience,
    newCandidateInfo: CandidateInfo
  ) => {
    dispatch(setRelevantExperience(newRelevantExperience));
    dispatch(setCandidateInfo(newCandidateInfo));
  };

  const handleCoverLetterGenerated = (content: string) => {
    dispatch(setGeneratedLetter({ content }));
  };

  const canProceed = () => {
    if (currentStep === 0) return jobSummary && companyInfo;
    if (currentStep === 1) return relevantExperience && candidateInfo;
    return false;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      dispatch(setCurrentStep(currentStep + 1));
    } else {
      // Redirect to dashboard on finish
      navigate("/app/dashboard");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      dispatch(setCurrentStep(currentStep - 1));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-background min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-4xl mx-auto shadow-md">
          <CardHeader className="bg-primary/10 dark:bg-primary/20">
            <CardTitle className="text-2xl font-bold text-primary">
              Cover Letter Wizard
            </CardTitle>
            <CardDescription>Create your perfect cover letter</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-4">
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

            <ScrollArea className="h-[calc(100vh-24rem)] pr-4">
              {currentStep === 0 && (
                <JobAnalysis
                  initialJobSummary={jobSummary}
                  initialCompanyInfo={companyInfo}
                  onAnalysisComplete={handleJobAnalysisComplete}
                  onUpdate={handleJobAnalysisComplete}
                />
              )}
              {currentStep === 1 && jobSummary && companyInfo && (
                <ResumeAnalysis
                  jobSummary={jobSummary}
                  companyInfo={companyInfo}
                  initialRelevantExperience={relevantExperience}
                  initialCandidateInfo={candidateInfo}
                  onAnalysisComplete={handleResumeAnalysisComplete}
                  onUpdate={handleResumeAnalysisComplete}
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
                    onUpdate={handleCoverLetterGenerated}
                  />
                )}
            </ScrollArea>

            <div className="mt-4 flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <div className="text-sm text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </div>
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center"
              >
                {currentStep < steps.length - 1 ? (
                  <>
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Finish <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CoverLetterWizard;
