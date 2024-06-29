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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useJobAnalyzer } from "@/hooks/useJobAnalyzer";
import { CompanyInfo, JobSummary } from "@/model";
import fetchJobContent from "@/services/fetchJobContent";
import { Edit2, Loader2, Save } from "lucide-react";
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
  const [isEditing, setIsEditing] = useState(false);
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    if (jobSummary && companyInfo) {
      onUpdate(jobSummary, companyInfo);
    }
  };

  const renderEditableList = (
    items: string[],
    onChange: (newItems: string[]) => void
  ) => (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index}>
          {isEditing ? (
            <Input
              value={item}
              onChange={(e) => {
                const newItems = [...items];
                newItems[index] = e.target.value;
                onChange(newItems);
              }}
            />
          ) : (
            item
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Job Analysis</CardTitle>
        <CardDescription>Analyze a job posting to get started</CardDescription>
      </CardHeader>
      <CardContent>
        {!jobSummary && !companyInfo ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="job-link">Job Posting Link</Label>
              <Input
                id="job-link"
                value={jobLink}
                onChange={(e) => setJobLink(e.target.value)}
                placeholder="Enter job posting URL"
              />
            </div>
            <Button type="submit" disabled={isLoading || isAnalyzing}>
              {isLoading || isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Job"
              )}
            </Button>
          </form>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="job-summary">Job Summary</TabsTrigger>
                <TabsTrigger value="company-info">Company Info</TabsTrigger>
              </TabsList>
              <Button
                onClick={isEditing ? handleSave : handleEdit}
                variant="outline"
                size="sm"
              >
                {isEditing ? (
                  <Save className="h-4 w-4 mr-2" />
                ) : (
                  <Edit2 className="h-4 w-4 mr-2" />
                )}
                {isEditing ? "Save" : "Edit"}
              </Button>
            </div>
            <TabsContent value="job-summary">
              {jobSummary && (
                <div className="space-y-4">
                  <div>
                    <Label>Summary</Label>
                    {isEditing ? (
                      <Textarea
                        value={jobSummary.summary}
                        onChange={(e) =>
                          setJobSummary({
                            ...jobSummary,
                            summary: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p>{jobSummary.summary}</p>
                    )}
                  </div>
                  <div>
                    <Label>Key Highlights</Label>
                    {renderEditableList(
                      jobSummary.highlights,
                      (newHighlights) =>
                        setJobSummary({
                          ...jobSummary,
                          highlights: newHighlights,
                        })
                    )}
                  </div>
                  <div>
                    <Label>Required Skills</Label>
                    {renderEditableList(
                      jobSummary.requiredSkills,
                      (newSkills) =>
                        setJobSummary({
                          ...jobSummary,
                          requiredSkills: newSkills,
                        })
                    )}
                  </div>
                  <div>
                    <Label>Preferred Skills</Label>
                    {renderEditableList(
                      jobSummary.preferredSkills,
                      (newSkills) =>
                        setJobSummary({
                          ...jobSummary,
                          preferredSkills: newSkills,
                        })
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="company-info">
              {companyInfo && (
                <div className="space-y-4">
                  {Object.entries(companyInfo).map(([key, value]) => (
                    <div key={key}>
                      <Label>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Label>
                      {isEditing ? (
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
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </CardContent>
    </Card>
  );
};

export default JobAnalysis;
