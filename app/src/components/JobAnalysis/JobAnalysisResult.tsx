// src/components/JobAnalysis/JobAnalysisResult.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CompanyInfo, JobSummary } from "@/model";
import { motion } from "framer-motion";
import React, { useState } from "react";

interface JobAnalysisResultProps {
  initialJobSummary: JobSummary;
  initialCompanyInfo: CompanyInfo;
  onUpdate: (jobSummary: JobSummary, companyInfo: CompanyInfo) => void;
}

const JobAnalysisResult: React.FC<JobAnalysisResultProps> = ({
  initialJobSummary,
  initialCompanyInfo,
  onUpdate,
}) => {
  const [jobSummary, setJobSummary] = useState(initialJobSummary);
  const [companyInfo, setCompanyInfo] = useState(initialCompanyInfo);
  const [isEditing, setIsEditing] = useState(false);

  const handleJobSummaryChange = (
    field: keyof JobSummary,
    value: string | string[]
  ) => {
    setJobSummary({ ...jobSummary, [field]: value });
  };

  const handleCompanyInfoChange = (field: keyof CompanyInfo, value: string) => {
    setCompanyInfo({ ...companyInfo, [field]: value });
  };

  const handleSave = () => {
    onUpdate(jobSummary, companyInfo);
    setIsEditing(false);
  };

  const renderEditableList = (
    items: string[],
    onChange: (newItems: string[]) => void
  ) => (
    <ul className="list-disc pl-5">
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
              className="mt-1"
            />
          ) : (
            item
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <Card>
        <CardHeader>
          <CardTitle>Job Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              value={jobSummary.summary}
              onChange={(e) =>
                handleJobSummaryChange("summary", e.target.value)
              }
              className="mb-4"
            />
          ) : (
            <p>{jobSummary.summary}</p>
          )}
          <h4 className="mt-4 font-bold">Key Highlights:</h4>
          {renderEditableList(jobSummary.highlights, (newHighlights) =>
            handleJobSummaryChange("highlights", newHighlights)
          )}
          <h4 className="mt-4 font-bold">Required Skills:</h4>
          {renderEditableList(jobSummary.requiredSkills, (newSkills) =>
            handleJobSummaryChange("requiredSkills", newSkills)
          )}
          <h4 className="mt-4 font-bold">Preferred Skills:</h4>
          {renderEditableList(jobSummary.preferredSkills, (newSkills) =>
            handleJobSummaryChange("preferredSkills", newSkills)
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(companyInfo).map(([key, value]) => (
            <div key={key} className="mb-2">
              <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
              {isEditing ? (
                <Input
                  value={value}
                  onChange={(e) =>
                    handleCompanyInfoChange(
                      key as keyof CompanyInfo,
                      e.target.value
                    )
                  }
                  className="mt-1"
                />
              ) : (
                value
              )}
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="flex justify-end space-x-2">
        {isEditing ? (
          <>
            <Button onClick={handleSave}>Save Changes</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
        )}
      </div>
    </motion.div>
  );
};

export default JobAnalysisResult;
