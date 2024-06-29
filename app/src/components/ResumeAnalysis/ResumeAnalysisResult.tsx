// src/components/ResumeAnalysis/ResumeAnalysisResult.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CandidateInfo, RelevantExperience } from "@/model";
import { motion } from "framer-motion";
import React, { useState } from "react";

interface ResumeAnalysisResultProps {
  initialRelevantExperience: RelevantExperience;
  initialCandidateInfo: CandidateInfo;
  onUpdate: (
    relevantExperience: RelevantExperience,
    candidateInfo: CandidateInfo
  ) => void;
}

const ResumeAnalysisResult: React.FC<ResumeAnalysisResultProps> = ({
  initialRelevantExperience,
  initialCandidateInfo,
  onUpdate,
}) => {
  const [relevantExperience, setRelevantExperience] = useState(
    initialRelevantExperience
  );
  const [candidateInfo, setCandidateInfo] = useState(initialCandidateInfo);
  const [isEditing, setIsEditing] = useState(false);

  const handleExperienceChange = (index: number, value: string) => {
    const newExperiences = [...relevantExperience.experiences];
    newExperiences[index] = value;
    setRelevantExperience({
      ...relevantExperience,
      experiences: newExperiences,
    });
  };

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...relevantExperience.skills];
    newSkills[index] = value;
    setRelevantExperience({ ...relevantExperience, skills: newSkills });
  };

  const handleAchievementChange = (index: number, value: string) => {
    const newAchievements = [...relevantExperience.achievements];
    newAchievements[index] = value;
    setRelevantExperience({
      ...relevantExperience,
      achievements: newAchievements,
    });
  };

  const handleCandidateInfoChange = (
    field: keyof CandidateInfo,
    value: string
  ) => {
    setCandidateInfo({ ...candidateInfo, [field]: value });
  };

  const handleSave = () => {
    onUpdate(relevantExperience, candidateInfo);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <Card>
        <CardHeader>
          <CardTitle>Relevant Experience</CardTitle>
        </CardHeader>
        <CardContent>
          <h4 className="font-bold">Experiences:</h4>
          <ul className="list-disc pl-5">
            {relevantExperience.experiences.map((exp, index) => (
              <li key={index}>
                {isEditing ? (
                  <Textarea
                    value={exp}
                    onChange={(e) =>
                      handleExperienceChange(index, e.target.value)
                    }
                    className="mt-1"
                  />
                ) : (
                  exp
                )}
              </li>
            ))}
          </ul>
          <h4 className="mt-4 font-bold">Skills:</h4>
          <ul className="list-disc pl-5">
            {relevantExperience.skills.map((skill, index) => (
              <li key={index}>
                {isEditing ? (
                  <Input
                    value={skill}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  skill
                )}
              </li>
            ))}
          </ul>
          <h4 className="mt-4 font-bold">Achievements:</h4>
          <ul className="list-disc pl-5">
            {relevantExperience.achievements.map((achievement, index) => (
              <li key={index}>
                {isEditing ? (
                  <Textarea
                    value={achievement}
                    onChange={(e) =>
                      handleAchievementChange(index, e.target.value)
                    }
                    className="mt-1"
                  />
                ) : (
                  achievement
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Candidate Information</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(candidateInfo).map(([key, value]) => (
            <div key={key} className="mb-2">
              <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
              {isEditing ? (
                <Input
                  value={value}
                  onChange={(e) =>
                    handleCandidateInfoChange(
                      key as keyof CandidateInfo,
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

export default ResumeAnalysisResult;
