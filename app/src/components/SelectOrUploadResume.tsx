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
import { toast } from "@/components/ui/use-toast";
import { Resume } from "@/model";
import { addResume, getResumes } from "@/utils/firebaseFunctions";
import React, { useEffect, useState } from "react";

interface SelectOrUploadResumeProps {
  onResumeSelect: (resumeId: string) => void;
}

const SelectOrUploadResume: React.FC<SelectOrUploadResumeProps> = ({
  onResumeSelect,
}) => {
  const [selectedResume, setSelectedResume] = useState("");
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [accordionValue, setAccordionValue] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingResumes, setIsLoadingResumes] = useState(false);

  const fetchResumes = async () => {
    setIsLoadingResumes(true);
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

  useEffect(() => {
    if (isSelectOpen && resumes.length === 0) {
      fetchResumes();
    }
  }, [isSelectOpen, resumes.length]);

  const handleSelectOpen = (open: boolean) => {
    setIsSelectOpen(open);
    if (open) {
      setAccordionValue("");
    }
  };

  const handleAccordionChange = (value: string) => {
    setAccordionValue(value);
    if (value !== "") {
      setSelectedResume("");
      onResumeSelect("");
    }
  };

  const handleResumeSelect = (value: string) => {
    setSelectedResume(value);
    onResumeSelect(value);
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
      onResumeSelect(newResumeId);
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

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="resume-select">Select Resume</Label>
        <Select
          value={selectedResume}
          onValueChange={handleResumeSelect}
          onOpenChange={handleSelectOpen}
          disabled={accordionValue !== "" || isUploading}
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
          </SelectContent>
        </Select>
      </div>
      <Accordion
        type="single"
        collapsible
        value={accordionValue}
        onValueChange={handleAccordionChange}
      >
        <AccordionItem value="upload-resume">
          <AccordionTrigger disabled={isUploading}>
            Upload a New Resume
          </AccordionTrigger>
          <AccordionContent>
            <ResumeUpload onSubmit={handleUpload} isLoading={isUploading} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default SelectOrUploadResume;
