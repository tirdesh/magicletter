// src/pages/Dashboard.tsx
import CoverLetterSection from "@/components/CoverLetterSection";
import SelectOrUploadResume from "@/components/SelectOrUploadResume";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import React from "react";
import { auth } from "../firebase";
import { useDashboard } from "../hooks/useDashboard";

const Dashboard: React.FC = () => {
  const currentUser = auth.currentUser;
  const {
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
  } = useDashboard();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4"
    >
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Your Dashboard</CardTitle>
          <CardDescription>Hello, {currentUser?.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="job-link">Job Posting Link</Label>
            <Input
              id="job-link"
              value={jobLink}
              onChange={(e) => setJobLink(e.target.value)}
              placeholder="Enter job posting URL"
            />
          </div>
          <SelectOrUploadResume
            selectedResume={selectedResume}
            setSelectedResume={setSelectedResume}
            resumes={resumes}
            accordionValue={accordionValue}
            setAccordionValue={setAccordionValue}
            handleUpload={handleUpload}
            isUploading={isUploading}
          />
          <div>
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Enter any specific instructions"
            />
          </div>
          <div>
            <Label htmlFor="ai-model">AI Model</Label>
            <Select value={aiModel} onValueChange={handleAIModelChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select AI model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="claude">Claude</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={generateCoverLetter}>Generate Cover Letter</Button>
        </CardContent>
        <CoverLetterSection
          generatedLetter={generatedLetter}
          copyToClipboard={copyToClipboard}
          downloadAsDoc={downloadAsDoc}
        />
        <CardFooter>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default Dashboard;
