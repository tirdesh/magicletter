// src/components/CoverLetter/CoverLetterForm.tsx
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useCoverLetterWriter } from "@/hooks/useCoverLetterWriter";
import {
  CandidateInfo,
  CompanyInfo,
  CoverLetterOptions,
  JobSummary,
  RelevantExperience,
} from "@/model";
import { motion } from "framer-motion";
import React, { useState } from "react";

interface CoverLetterFormProps {
  jobSummary: JobSummary;
  companyInfo: CompanyInfo;
  relevantExperience: RelevantExperience;
  candidateInfo: CandidateInfo;
  onGenerateComplete: (content: string) => void;
}

export const CoverLetterForm: React.FC<CoverLetterFormProps> = ({
  jobSummary,
  companyInfo,
  relevantExperience,
  candidateInfo,
  onGenerateComplete,
}) => {
  const [options, setOptions] = useState<CoverLetterOptions>({
    tone: "professional",
    focusAreas: [],
    paragraphs: 3,
    customInstructions: "",
    includeCallToAction: true,
    emphasizeUniqueness: false,
  });

  const { generateCoverLetter, isGenerating, error } = useCoverLetterWriter();
  const { toast } = useToast();

  const handleOptionChange = (
    field: keyof CoverLetterOptions,
    value: unknown
  ) => {
    setOptions({ ...options, [field]: value });
  };

  const handleFocusAreaChange = (
    area: "technical skills" | "soft skills" | "achievements" | "cultural fit",
    checked: boolean
  ) => {
    if (checked) {
      setOptions({ ...options, focusAreas: [...options.focusAreas, area] });
    } else {
      setOptions({
        ...options,
        focusAreas: options.focusAreas.filter((a) => a !== area),
      });
    }
  };

  const handleGenerate = async () => {
    try {
      const result = await generateCoverLetter(
        jobSummary,
        companyInfo,
        relevantExperience,
        candidateInfo,
        options
      );
      onGenerateComplete(result.content);
    } catch (error) {
      console.error("Error generating cover letter:", error);
      toast({
        title: "Error",
        description: "Failed to generate cover letter. Please try again.",
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
      <div>
        <Label htmlFor="tone">Tone</Label>
        <Select
          value={options.tone}
          onValueChange={(value) => handleOptionChange("tone", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
            <SelectItem value="formal">Formal</SelectItem>
            <SelectItem value="conversational">Conversational</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Focus Areas</Label>
        <div className="flex flex-wrap gap-2">
          {[
            "technical skills",
            "soft skills",
            "achievements",
            "cultural fit",
          ].map((area) => (
            <div key={area} className="flex items-center space-x-2">
              <Checkbox
                id={area}
                checked={options.focusAreas.includes(
                  area as
                    | "technical skills"
                    | "soft skills"
                    | "achievements"
                    | "cultural fit"
                )}
                onCheckedChange={(checked) =>
                  handleFocusAreaChange(
                    area as
                      | "technical skills"
                      | "soft skills"
                      | "achievements"
                      | "cultural fit",
                    checked as boolean
                  )
                }
              />
              <Label htmlFor={area}>{area}</Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="paragraphs">Number of Paragraphs</Label>
        <Input
          type="number"
          id="paragraphs"
          value={options.paragraphs}
          onChange={(e) =>
            handleOptionChange("paragraphs", parseInt(e.target.value))
          }
          min={2}
          max={5}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="call-to-action"
          checked={options.includeCallToAction}
          onCheckedChange={(checked) =>
            handleOptionChange("includeCallToAction", checked)
          }
        />
        <Label htmlFor="call-to-action">Include Call to Action</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="emphasize-uniqueness"
          checked={options.emphasizeUniqueness}
          onCheckedChange={(checked) =>
            handleOptionChange("emphasizeUniqueness", checked)
          }
        />
        <Label htmlFor="emphasize-uniqueness">Emphasize Uniqueness</Label>
      </div>
      <div>
        <Label htmlFor="custom-instructions">Custom Instructions</Label>
        <Textarea
          id="custom-instructions"
          value={options.customInstructions}
          onChange={(e) =>
            handleOptionChange("customInstructions", e.target.value)
          }
          placeholder="Enter any custom instructions for the cover letter"
        />
      </div>
      <Button onClick={handleGenerate} disabled={isGenerating}>
        {isGenerating ? "Generating..." : "Generate Cover Letter"}
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </motion.div>
  );
};
