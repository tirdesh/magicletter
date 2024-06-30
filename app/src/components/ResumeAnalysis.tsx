// src/components/ResumeAnalysis.tsx
import SelectOrUploadResume from "@/components/SelectOrUploadResume";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useResumeAnalyzer } from "@/hooks/useResumeAnalyzer";
import {
  CandidateInfo,
  CompanyInfo,
  JobSummary,
  RelevantExperience,
} from "@/model";
import { getResumeText } from "@/utils/resumeUtils/resumeText";
import { Edit2, Loader2, Minus, Plus, Save, X } from "lucide-react";
import React, { useState } from "react";

interface ResumeAnalysisProps {
  jobSummary: JobSummary;
  companyInfo: CompanyInfo;
  initialRelevantExperience?: RelevantExperience | null;
  initialCandidateInfo?: CandidateInfo | null;
  onAnalysisComplete: (
    relevantExperience: RelevantExperience,
    candidateInfo: CandidateInfo
  ) => void;
  onUpdate: (
    relevantExperience: RelevantExperience,
    candidateInfo: CandidateInfo
  ) => void;
}

const ResumeAnalysis: React.FC<ResumeAnalysisProps> = ({
  jobSummary,
  companyInfo,
  initialRelevantExperience,
  initialCandidateInfo,
  onAnalysisComplete,
  onUpdate,
}) => {
  const [selectedResume, setSelectedResume] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("relevant-experience");
  const { toast } = useToast();
  const { analyzeResume, isAnalyzing, error } = useResumeAnalyzer();
  const [relevantExperience, setRelevantExperience] =
    useState<RelevantExperience | null>(initialRelevantExperience || null);
  const [candidateInfo, setCandidateInfo] = useState<CandidateInfo | null>(
    initialCandidateInfo || null
  );

  const handleAnalyze = async () => {
    if (!selectedResume) {
      toast({
        title: "Error",
        description: "Please select a resume to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const resumeText = await getResumeText(selectedResume);
      const {
        relevantExperience: newRelevantExperience,
        candidateInfo: newCandidateInfo,
      } = await analyzeResume(resumeText, jobSummary, companyInfo);
      setRelevantExperience(newRelevantExperience);
      setCandidateInfo(newCandidateInfo);
      onAnalysisComplete(newRelevantExperience, newCandidateInfo);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast({
        title: "Error",
        description: "Failed to analyze resume.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (section: string) => setEditingSection(section);

  const handleSave = () => {
    setEditingSection(null);
    if (relevantExperience && candidateInfo) {
      onUpdate(relevantExperience, candidateInfo);
    }
  };

  const handleCancel = () => {
    setEditingSection(null);
    setRelevantExperience(initialRelevantExperience || null);
    setCandidateInfo(initialCandidateInfo || null);
  };

  const renderEditableList = (
    items: string[],
    onChange: (newItems: string[]) => void
  ) => (
    <ScrollArea className="h-[200px] w-full">
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <Textarea
              value={item}
              onChange={(e) => {
                const newItems = [...items];
                newItems[index] = e.target.value;
                onChange(newItems);
              }}
              className="flex-grow"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              <Minus className="h-4 w-4" />
            </Button>
          </li>
        ))}
        <li>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChange([...items, ""])}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Item
          </Button>
        </li>
      </ul>
    </ScrollArea>
  );

  const renderSection = (title: string, content: React.ReactNode) => (
    <div className="mb-6 p-4 border rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex space-x-2">
          {editingSection === title ? (
            <>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" /> Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" /> Cancel
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEdit(title)}
            >
              <Edit2 className="h-4 w-4 mr-2" /> Edit
            </Button>
          )}
        </div>
      </div>
      {content}
    </div>
  );

  const renderTabContent = (
    data: RelevantExperience | CandidateInfo,
    isRelevantExperience: boolean
  ) => (
    <>
      {Object.entries(data).map(([key, value]) => {
        const title = key.charAt(0).toUpperCase() + key.slice(1);
        let content;
        if (Array.isArray(value)) {
          content =
            editingSection === title ? (
              renderEditableList(value, (newItems) =>
                isRelevantExperience
                  ? setRelevantExperience({
                      ...relevantExperience!,
                      [key]: newItems,
                    } as RelevantExperience)
                  : setCandidateInfo({
                      ...candidateInfo!,
                      [key]: newItems,
                    } as CandidateInfo)
              )
            ) : (
              <ul className="list-disc pl-5">
                {value.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            );
        } else {
          content =
            editingSection === title ? (
              <Textarea
                value={value}
                onChange={(e) =>
                  isRelevantExperience
                    ? setRelevantExperience({
                        ...relevantExperience!,
                        [key]: e.target.value,
                      } as RelevantExperience)
                    : setCandidateInfo({
                        ...candidateInfo!,
                        [key]: e.target.value,
                      } as CandidateInfo)
                }
                className="mt-1 min-h-[100px]"
              />
            ) : (
              <p className="whitespace-pre-wrap">{value}</p>
            );
        }
        return renderSection(title, content);
      })}
    </>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Resume Analysis</CardTitle>
        <CardDescription>Analyze your resume for the job</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          <SelectOrUploadResume onResumeSelect={setSelectedResume} />
          <Button
            onClick={handleAnalyze}
            disabled={isLoading || isAnalyzing || !selectedResume}
          >
            {isLoading || isAnalyzing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {isLoading || isAnalyzing ? "Analyzing..." : "Analyze Resume"}
          </Button>
        </div>

        {isLoading || isAnalyzing ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : relevantExperience && candidateInfo ? (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="relevant-experience">
                Relevant Experience
              </TabsTrigger>
              <TabsTrigger value="candidate-info">Candidate Info</TabsTrigger>
            </TabsList>
            <TabsContent value="relevant-experience">
              {renderTabContent(relevantExperience, true)}
            </TabsContent>
            <TabsContent value="candidate-info">
              {renderTabContent(candidateInfo, false)}
            </TabsContent>
          </Tabs>
        ) : null}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </CardContent>
    </Card>
  );
};

export default ResumeAnalysis;
