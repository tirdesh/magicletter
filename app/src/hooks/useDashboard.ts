// src/hooks/useDashboard.ts
import { ResumeFormValues } from "@/components/ResumeUpload";
import { toast } from "@/components/ui/use-toast";
import fetchJobContent from "@/services/fetchJobContent";
import CoverLetterGenerator from "@/utils/coverLetterUtils";
import { getResumeText } from "@/utils/resumeUtils/resumeText";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { Resume } from "../model";
import { addResume, getResumes } from "../utils/firebaseFunctions";

export type AIModel = "openai" | "claude";

export const useDashboard = () => {
  const navigate = useNavigate();
  const [jobLink, setJobLink] = useState("");
  const [selectedResume, setSelectedResume] = useState("");
  const [instructions, setInstructions] = useState("");
  const [aiModel, setAiModel] = useState<AIModel>("openai");
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [accordionValue, setAccordionValue] = useState<string>("");

  useEffect(() => {
    fetchResumes();
  }, []);

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
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out.",
        variant: "destructive",
      });
    }
  };

  const handleAIModelChange = (value: string) => {
    if (value === "openai" || value === "claude") {
      setAiModel(value);
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

  const generateCoverLetter = async () => {
    try {
      const jobContent = await fetchJobContent(jobLink);
      const resumeText = await getResumeText(selectedResume);
      const generator = new CoverLetterGenerator(aiModel);
      const result = await generator.generateCoverLetter(
        resumeText,
        jobContent,
        instructions
      );
      setGeneratedLetter(result.coverLetter);
      toast({
        title: "Success",
        description: "Cover letter generated successfully.",
      });
    } catch (error) {
      console.error("Error generating cover letter:", error);
      toast({
        title: "Error",
        description: "Failed to generate cover letter.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
    toast({
      title: "Copied",
      description: "Cover letter copied to clipboard.",
    });
  };

  const downloadAsDoc = () => {
    // Implement download as .doc logic here
    toast({
      title: "Download",
      description: "Downloading cover letter as .doc file.",
    });
  };

  return {
    jobLink,
    setJobLink,
    selectedResume,
    setSelectedResume,
    instructions,
    setInstructions,
    aiModel,
    handleAIModelChange,
    resumes,
    generatedLetter,
    isUploading,
    accordionValue,
    setAccordionValue,
    handleSignOut,
    handleUpload,
    generateCoverLetter,
    copyToClipboard,
    downloadAsDoc,
  };
};
