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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [editingSection, setEditingSection] = useState<string | null>(null);
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

  const handleEdit = (section: string) => setEditingSection(section);

  const handleSave = () => {
    setEditingSection(null);
    if (jobSummary && companyInfo) {
      onUpdate(jobSummary, companyInfo);
    }
  };

  const handleCancel = () => {
    setEditingSection(null);
    setJobSummary(initialJobSummary || null);
    setCompanyInfo(initialCompanyInfo || null);
  };

  const renderEditableList = (
    items: string[],
    onChange: (newItems: string[]) => void
  ) => (
    <ScrollArea className="h-[200px] w-full">
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
    data: JobSummary | CompanyInfo,
    isJobSummary: boolean
  ) => (
    <>
      {Object.entries(data).map(([key, value]) => {
        const title = key.charAt(0).toUpperCase() + key.slice(1);
        let content;
        if (Array.isArray(value)) {
          content =
            editingSection === title ? (
              renderEditableList(value, (newItems) =>
                isJobSummary
                  ? setJobSummary({
                      ...jobSummary!,
                      [key]: newItems,
                    } as JobSummary)
                  : setCompanyInfo({
                      ...companyInfo!,
                      [key]: newItems,
                    } as CompanyInfo)
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
              <Input
                value={value}
                onChange={(e) =>
                  isJobSummary
                    ? setJobSummary({
                        ...jobSummary!,
                        [key]: e.target.value,
                      } as JobSummary)
                    : setCompanyInfo({
                        ...companyInfo!,
                        [key]: e.target.value,
                      } as CompanyInfo)
                }
                className="mt-1"
              />
            ) : (
              <p>{value}</p>
            );
        }
        return renderSection(title, content);
      })}
    </>
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
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Input
                id="job-link"
                value={jobLink}
                onChange={(e) => setJobLink(e.target.value)}
                placeholder="Enter job posting URL"
                className="flex-grow"
              />
              <Button
                type="submit"
                disabled={isLoading || isAnalyzing}
                className="w-full sm:w-auto"
              >
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
              {renderTabContent(jobSummary, true)}
            </TabsContent>
            <TabsContent value="company-info">
              {renderTabContent(companyInfo, false)}
            </TabsContent>
          </Tabs>
        ) : null}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </CardContent>
    </Card>
  );
};

export default JobAnalysis;
