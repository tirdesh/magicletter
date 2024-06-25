// src/pages/ResumeViewPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { getResumeText } from '../utils/resumeText'; // We'll create this function

const ResumeViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [resumeText, setResumeText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumeText = async () => {
      if (id) {
        try {
          console.log('Fetching resume text for ID:', id);
          const text = await getResumeText(id);
          console.log('Resume text:', text);
          setResumeText(text);
        } catch (error) {
          console.error('Error fetching resume text:', error);
          setResumeText('Failed to load resume text.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchResumeText();
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Resume View</CardTitle>
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading resume text...</p>
          ) : (
            <pre className="whitespace-pre-wrap font-sans">{resumeText}</pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeViewPage;