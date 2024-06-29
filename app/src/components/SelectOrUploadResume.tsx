// src/components/SelectOrUploadResume.tsx
import ResumeUpload, { ResumeFormValues } from "@/components/ResumeUpload";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { Resume } from "../model";

interface SelectOrUploadResumeProps {
  selectedResume: string;
  setSelectedResume: (value: string) => void;
  resumes: Resume[];
  accordionValue: string;
  setAccordionValue: (value: string) => void;
  handleUpload: (values: ResumeFormValues) => Promise<void>;
  isUploading: boolean;
}

const SelctOrUploadResume: React.FC<SelectOrUploadResumeProps> = ({
  selectedResume,
  setSelectedResume,
  resumes,
  accordionValue,
  setAccordionValue,
  handleUpload,
  isUploading,
}) => {
  return (
    <>
      <div>
        <Label htmlFor="resume-select">Select Resume</Label>
        <Select
          value={selectedResume}
          onValueChange={setSelectedResume}
          disabled={accordionValue !== ""}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a resume" />
          </SelectTrigger>
          <SelectContent>
            {resumes.map((resume) => (
              <SelectItem key={resume.id} value={resume.id}>
                {resume.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Accordion
        type="single"
        collapsible
        value={accordionValue}
        onValueChange={setAccordionValue}
      >
        <AccordionItem value="upload-resume">
          <AccordionTrigger>Upload a New Resume</AccordionTrigger>
          <AccordionContent>
            <ResumeUpload onSubmit={handleUpload} isLoading={isUploading} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default SelctOrUploadResume;
