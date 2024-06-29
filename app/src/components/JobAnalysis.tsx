// src/components/JobAnalysis/JobAnalysis.tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useJobAnalyzer } from "@/hooks/useJobAnalyzer";
import { CompanyInfo, JobSummary } from "@/model";
import fetchJobContent from "@/services/fetchJobContent";
import { Edit2, Loader2, Minus, Plus, Save, X } from "lucide-react";
import React, { useState } from "react";

interface JobAnalysisProps {
  initialJobSummary?: JobSummary | null;
  initialCompanyInfo?: CompanyInfo | null;
  onAnalysisComplete: (
    jobSummary: JobSummary,
    companyInfo: CompanyInfo
  ) => void;
  onUpdate: (jobSummary: JobSummary, companyInfo: CompanyInfo) => void;
}

const JobAnalysis: React.FC<JobAnalysisProps> = ({
  initialJobSummary,
  initialCompanyInfo,
  onAnalysisComplete,
  onUpdate,
}) => {
  const [jobLink, setJobLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("job-summary");
  const { analyzeJob, isAnalyzing, error } = useJobAnalyzer();
  const [jobSummary, setJobSummary] = useState<JobSummary | null>(
    initialJobSummary || null
  );
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(
    initialCompanyInfo || null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await analyzeJobLink();
  };

  const analyzeJobLink = async () => {
    setIsLoading(true);
    try {
      const jobContent = await fetchJobContent(jobLink);
      const { jobSummary: newJobSummary, companyInfo: newCompanyInfo } =
        await analyzeJob(jobContent);
      setJobSummary(newJobSummary);
      setCompanyInfo(newCompanyInfo);
      onAnalysisComplete(newJobSummary, newCompanyInfo);
    } catch (err) {
      console.error("Error analyzing job:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (section: string) => {
    setIsEditing(section);
  };

  const handleSave = () => {
    setIsEditing(null);
    if (jobSummary && companyInfo) {
      onUpdate(jobSummary, companyInfo);
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
    setJobSummary(initialJobSummary || null);
    setCompanyInfo(initialCompanyInfo || null);
  };

  const renderEditableList = (
    items: string[],
    onChange: (newItems: string[]) => void
  ) => (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-center">
          <Input
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
            onClick={() => {
              const newItems = items.filter((_, i) => i !== index);
              onChange(newItems);
            }}
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
  );

  const renderSection = (title: string, content: React.ReactNode) => (
    <div className="mb-6 p-4 border rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        {isEditing === title ? (
          <div>
            <Button size="sm" onClick={handleSave} className="mr-2">
              <Save className="h-4 w-4 mr-2" /> Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="outline" onClick={() => handleEdit(title)}>
            <Edit2 className="h-4 w-4 mr-2" /> Edit
          </Button>
        )}
      </div>
      {content}
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Job Analysis</CardTitle>
        <CardDescription>Analyze a job posting to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="job-link">Job Posting Link</Label>
            <div className="flex space-x-2">
              <Input
                id="job-link"
                value={jobLink}
                onChange={(e) => setJobLink(e.target.value)}
                placeholder="Enter job posting URL"
                className="flex-grow"
              />
              <Button type="submit" disabled={isLoading || isAnalyzing}>
                {isLoading || isAnalyzing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Analyze"
                )}
              </Button>
            </div>
          </div>
        </form>

        {isLoading || isAnalyzing ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : jobSummary && companyInfo ? (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="job-summary">Job Summary</TabsTrigger>
              <TabsTrigger value="company-info">Company Info</TabsTrigger>
            </TabsList>
            <TabsContent value="job-summary">
              {renderSection(
                "Summary",
                isEditing === "Summary" ? (
                  <Textarea
                    value={jobSummary.summary}
                    onChange={(e) =>
                      setJobSummary({ ...jobSummary, summary: e.target.value })
                    }
                    className="mt-1 h-40"
                  />
                ) : (
                  <p>{jobSummary.summary}</p>
                )
              )}
              {renderSection(
                "Key Highlights",
                isEditing === "Key Highlights" ? (
                  renderEditableList(jobSummary.highlights, (newHighlights) =>
                    setJobSummary({ ...jobSummary, highlights: newHighlights })
                  )
                ) : (
                  <ul className="list-disc pl-5">
                    {jobSummary.highlights.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )
              )}
              {renderSection(
                "Required Skills",
                isEditing === "Required Skills" ? (
                  renderEditableList(jobSummary.requiredSkills, (newSkills) =>
                    setJobSummary({ ...jobSummary, requiredSkills: newSkills })
                  )
                ) : (
                  <ul className="list-disc pl-5">
                    {jobSummary.requiredSkills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                )
              )}
              {renderSection(
                "Preferred Skills",
                isEditing === "Preferred Skills" ? (
                  renderEditableList(jobSummary.preferredSkills, (newSkills) =>
                    setJobSummary({ ...jobSummary, preferredSkills: newSkills })
                  )
                ) : (
                  <ul className="list-disc pl-5">
                    {jobSummary.preferredSkills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                )
              )}
            </TabsContent>
            <TabsContent value="company-info">
              {Object.entries(companyInfo).map(([key, value]) =>
                renderSection(
                  key.charAt(0).toUpperCase() + key.slice(1),
                  isEditing === key ? (
                    <Input
                      value={value}
                      onChange={(e) =>
                        setCompanyInfo({
                          ...companyInfo,
                          [key]: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  ) : (
                    <p>{value}</p>
                  )
                )
              )}
            </TabsContent>
          </Tabs>
        ) : null}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </CardContent>
    </Card>
  );
};

export default JobAnalysis;
