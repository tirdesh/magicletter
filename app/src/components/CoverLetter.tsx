// src/components/CoverLetter/CoverLetter.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useCoverLetterWriter } from "@/hooks/useCoverLetterWriter";
import {
  CandidateInfo,
  CompanyInfo,
  CoverLetterOptions,
  GeneratedCoverLetter,
  JobSummary,
  RelevantExperience,
} from "@/model";
import { motion } from "framer-motion";
import { Copy, Download, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

interface CoverLetterProps {
  jobSummary: JobSummary;
  companyInfo: CompanyInfo;
  relevantExperience: RelevantExperience;
  candidateInfo: CandidateInfo;
  initialGeneratedLetter: GeneratedCoverLetter | null;
  onGenerate: (content: string) => void;
  onUpdate: (content: string) => void;
}

const defaultTemplate = `
[Candidate's Full Name]
[City], [State]
[Phone Number]
[Email]

[Current Date]

[Company Name]
[Company City], [Company State]

Dear Hiring Manager,

[Cover Letter Content]

Sincerely,
[Candidate's Full Name]
`;

const CoverLetter: React.FC<CoverLetterProps> = ({
  jobSummary,
  companyInfo,
  relevantExperience,
  candidateInfo,
  initialGeneratedLetter,
  onGenerate,
  onUpdate,
}) => {
  const [options, setOptions] = useState<CoverLetterOptions>({
    tone: "professional",
    focusAreas: [],
    paragraphs: 3,
    customInstructions: "",
    includeCallToAction: true,
    emphasizeUniqueness: false,
    template: defaultTemplate,
  });
  const [generatedLetter, setGeneratedLetter] =
    useState<GeneratedCoverLetter | null>(initialGeneratedLetter);

  const { generateCoverLetter, isGenerating, error } = useCoverLetterWriter();
  const { toast } = useToast();

  useEffect(() => {
    if (initialGeneratedLetter) {
      setGeneratedLetter(initialGeneratedLetter);
    }
  }, [initialGeneratedLetter]);

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
    setGeneratedLetter(null);
    try {
      const result = await generateCoverLetter(
        jobSummary,
        companyInfo,
        relevantExperience,
        candidateInfo,
        options
      );
      setGeneratedLetter(result);
      onGenerate(result.content);
    } catch (error) {
      console.error("Error generating cover letter:", error);
      toast({
        title: "Error",
        description: `Failed to generate cover letter. Please try again. Error: ${error}`,
        variant: "destructive",
      });
    }
  };

  const handleCopy = () => {
    if (generatedLetter) {
      navigator.clipboard.writeText(generatedLetter.content);
      toast({
        title: "Copied",
        description: "Cover letter copied to clipboard.",
      });
    }
  };

  const handleDownload = () => {
    if (generatedLetter) {
      const blob = new Blob([generatedLetter.content], {
        type: "application/msword",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "cover_letter.doc";
      link.click();
    }
  };

  const handleLetterContentChange = (newContent: string) => {
    setGeneratedLetter({ content: newContent });
    onUpdate(newContent);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cover Letter Generator</CardTitle>
        <CardDescription>
          Customize and generate your cover letter
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="options">
            <AccordionTrigger>Cover Letter Options</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
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
                      <SelectItem value="conversational">
                        Conversational
                      </SelectItem>
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
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="call-to-action"
                      checked={options.includeCallToAction}
                      onCheckedChange={(checked) =>
                        handleOptionChange("includeCallToAction", checked)
                      }
                    />
                    <Label htmlFor="call-to-action">
                      Include Call to Action
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="emphasize-uniqueness"
                      checked={options.emphasizeUniqueness}
                      onCheckedChange={(checked) =>
                        handleOptionChange("emphasizeUniqueness", checked)
                      }
                    />
                    <Label htmlFor="emphasize-uniqueness">
                      Emphasize Uniqueness
                    </Label>
                  </div>
                </div>
                <div>
                  <Label htmlFor="custom-instructions">
                    Custom Instructions
                  </Label>
                  <Textarea
                    id="custom-instructions"
                    value={options.customInstructions}
                    onChange={(e) =>
                      handleOptionChange("customInstructions", e.target.value)
                    }
                    placeholder="Enter any custom instructions for the cover letter"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="template">
            <AccordionTrigger>Cover Letter Template</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <Textarea
                  value={options.template}
                  onChange={(e) =>
                    handleOptionChange("template", e.target.value)
                  }
                  rows={15}
                  className="font-mono"
                />
                <p className="text-sm text-gray-500">
                  Use placeholders like [Candidate's Full Name], [Company Name],
                  etc. The content will replace [Cover Letter Content].
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-4">
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isGenerating
              ? "Generating..."
              : generatedLetter
              ? "Regenerate"
              : "Generate Cover Letter"}
          </Button>
        </div>

        {isGenerating ? (
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : generatedLetter ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-4 space-y-4"
          >
            <Textarea
              value={generatedLetter.content}
              onChange={(e) => handleLetterContentChange(e.target.value)}
              rows={20}
              className="font-mono whitespace-pre-wrap"
            />
            <div className="space-x-2">
              <Button onClick={handleCopy}>
                <Copy className="mr-2 h-4 w-4" /> Copy to Clipboard
              </Button>
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" /> Download as DOC
              </Button>
            </div>
          </motion.div>
        ) : null}

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </CardContent>
    </Card>
  );
};

export default CoverLetter;
