// src/pages/ResumeViewPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Copy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { getResumeText } from '../utils/resumeText';
import parseResume from '@/utils/resumeParser';
import { ParsedResume } from '@/model';

const ResumeViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [resumeText, setResumeText] = useState<string>('');
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumeText = async () => {
      if (id) {
        try {
          console.log('Fetching resume text for ID:', id);
          const text = await getResumeText(id);
          setResumeText(text);
          const parsed = await parseResume(text, "traditional");
          console.log('Parsed resume:', parsed);
          setParsedResume(parsed);
        } catch (error) {
          console.error('Error fetching or parsing resume:', error);
          toast({
            title: "Error",
            description: "Failed to load or parse resume.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchResumeText();
  }, [id]);

  const handleCopyText = () => {
    navigator.clipboard.writeText(resumeText);
    toast({
      title: "Copied to clipboard",
      description: "The resume text has been copied to your clipboard.",
    });
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([resumeText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "resume.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Resume View</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleCopyText}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button variant="outline" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="bg-white dark:bg-gray-800 p-6 rounded-b-lg">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : parsedResume ? (
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
                <div className="grid grid-cols-2 gap-2">
                  <p><strong>Name:</strong> {parsedResume.personalInfo.name}</p>
                  <p><strong>Email:</strong> {parsedResume.personalInfo.email}</p>
                  <p><strong>Phone:</strong> {parsedResume.personalInfo.phone}</p>
                  <p><strong>Location:</strong> {parsedResume.personalInfo.location}</p>
                </div>
              </section>

              {parsedResume.summary && (
                <section>
                  <h2 className="text-xl font-semibold mb-2">Summary</h2>
                  <p>{parsedResume.summary}</p>
                </section>
              )}

              <section>
                <h2 className="text-xl font-semibold mb-2">Experience</h2>
                {parsedResume.experience.map((exp, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="text-lg font-medium">{exp.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{exp.company} | {exp.date}</p>
                    <ul className="list-disc list-inside mt-2">
                      {exp.content.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">Education</h2>
                {parsedResume.education.map((edu, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="text-lg font-medium">{edu.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{edu.institution} | {edu.date}</p>
                    <ul className="list-disc list-inside mt-2">
                      {edu.content.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {parsedResume.skills.map((skill, index) => (
                    <span key={index} className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              {parsedResume.projects && parsedResume.projects.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-2">Projects</h2>
                  {parsedResume.projects.map((project, index) => (
                    <div key={index} className="mb-4">
                      <h3 className="text-lg font-medium">{project.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{project.date}</p>
                      <p className="mt-2">{project.description}</p>
                      {project.technologies && (
                        <div className="mt-2">
                          <strong>Technologies:</strong> {project.technologies.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </section>
              )}

              {parsedResume.certifications && parsedResume.certifications.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-2">Certifications</h2>
                  <ul className="list-disc list-inside">
                    {parsedResume.certifications.map((cert, index) => (
                      <li key={index}>{cert}</li>
                    ))}
                  </ul>
                </section>
              )}

              {parsedResume.languages && parsedResume.languages.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-2">Languages</h2>
                  <ul className="list-disc list-inside">
                    {parsedResume.languages.map((lang, index) => (
                      <li key={index}>{lang}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          ) : (
            <p>No parsed resume data available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeViewPage;