// src/components/SelectOrUploadResume.tsx
import ResumeUpload, { ResumeFormValues } from "@/components/ResumeUpload";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";
import { Resume } from "../model";

interface SelectOrUploadResumeProps {
  selectedResume: string;
  setSelectedResume: (value: string) => void;
  resumes: Resume[];
  handleUpload: (values: ResumeFormValues) => Promise<void>;
  isUploading: boolean;
  isLoadingResumes: boolean;
  fetchResumes: () => Promise<void>;
}

const SelectOrUploadResume: React.FC<SelectOrUploadResumeProps> = ({
  selectedResume,
  setSelectedResume,
  resumes,
  handleUpload,
  isUploading,
  isLoadingResumes,
  fetchResumes,
}) => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const handleSelectOpen = async () => {
    if (!isSelectOpen && resumes.length === 0) {
      await fetchResumes();
    }
    setIsSelectOpen(true);
    setIsUploadOpen(false);
  };

  const handleUploadOpen = () => {
    setIsUploadOpen(true);
    setIsSelectOpen(false);
  };

  const handleUploadComplete = async (values: ResumeFormValues) => {
    await handleUpload(values);
    setIsUploadOpen(false);
    setIsSelectOpen(true);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="resume-select">Select or Upload Resume</Label>
        <Select
          value={selectedResume}
          onValueChange={setSelectedResume}
          onOpenChange={handleSelectOpen}
          disabled={isUploadOpen}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a resume" />
          </SelectTrigger>
          <SelectContent>
            {isLoadingResumes ? (
              <SelectItem value="loading" disabled>
                Loading resumes...
              </SelectItem>
            ) : resumes.length === 0 ? (
              <SelectItem value="no-resumes" disabled>
                No resumes available
              </SelectItem>
            ) : (
              resumes.map((resume) => (
                <SelectItem key={resume.id} value={resume.id}>
                  {resume.label}
                </SelectItem>
              ))
            )}
            <SelectItem value="upload" onSelect={handleUploadOpen}>
              Upload a new resume
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      {isUploadOpen && (
        <ResumeUpload onSubmit={handleUploadComplete} isLoading={isUploading} />
      )}
    </div>
  );
};

export default SelectOrUploadResume;
