// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { getResumes, addResume } from '../utils/firebaseFunctions';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Resume } from '../model';
import ResumeUpload, { ResumeFormValues } from '@/components/ResumeUpload';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

const Dashboard: React.FC = () => {
    const currentUser = auth.currentUser;
    const navigate = useNavigate();
    const [jobLink, setJobLink] = useState('');
    const [selectedResume, setSelectedResume] = useState('');
    const [instructions, setInstructions] = useState('');
    const [aiModel, setAiModel] = useState('');
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [generatedLetter, setGeneratedLetter] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [accordionValue, setAccordionValue] = useState<string>('');

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            const fetchedResumes = await getResumes();
            setResumes(fetchedResumes);
        } catch (error) {
            console.error('Error fetching resumes:', error);
            toast({
                title: "Error",
                description: "Failed to fetch resumes.",
                variant: "destructive",
            });
        }
    };

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            navigate('/signin');
        } catch (error) {
            console.error('Error signing out:', error);
            toast({
                title: "Error",
                description: "Failed to sign out.",
                variant: "destructive",
            });
        }
    };

    const handleUpload = async (values: ResumeFormValues) => {
        setIsUploading(true);
        try {
            const newResumeId = await addResume(values.file, values.label);
            toast({
                title: "Success",
                description: "Resume uploaded successfully.",
            });
            await fetchResumes();
            setSelectedResume(newResumeId);
            setAccordionValue(''); // Close the accordion after successful upload
        } catch (error) {
            console.error('Error uploading resume:', error);
            toast({
                title: "Error",
                description: "Failed to upload resume.",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    const generateCoverLetter = async () => {
        // Implement cover letter generation logic here
        // This is a placeholder
        setGeneratedLetter("This is a generated cover letter based on your inputs...");
        toast({
            title: "Success",
            description: "Cover letter generated successfully.",
        });
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLetter);
        toast({
            title: "Copied",
            description: "Cover letter copied to clipboard.",
        });
    };

    const downloadAsDoc = () => {
        // Implement download as .doc logic here
        toast({
            title: "Download",
            description: "Downloading cover letter as .doc file.",
        });
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto p-4"
        >
            <Card>
                <CardHeader>
                    <CardTitle>Welcome to Your Dashboard</CardTitle>
                    <CardDescription>Hello, {currentUser?.email}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="job-link">Job Posting Link</Label>
                        <Input id="job-link" value={jobLink} onChange={(e) => setJobLink(e.target.value)} placeholder="Enter job posting URL" />
                    </div>
                    <div>
                        <Label htmlFor="resume-select">Select Resume</Label>
                        <Select value={selectedResume} onValueChange={setSelectedResume} disabled={accordionValue !== ''}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a resume" />
                            </SelectTrigger>
                            <SelectContent>
                                {resumes.map((resume) => (
                                    <SelectItem key={resume.id} value={resume.id}>{resume.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Accordion type="single" collapsible value={accordionValue} onValueChange={setAccordionValue}>
                        <AccordionItem value="upload-resume">
                            <AccordionTrigger>Upload a New Resume</AccordionTrigger>
                            <AccordionContent>
                                <ResumeUpload onSubmit={handleUpload} isLoading={isUploading} />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <div>
                        <Label htmlFor="instructions">Instructions</Label>
                        <Textarea id="instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Enter any specific instructions" />
                    </div>
                    <div>
                        <Label htmlFor="ai-model">AI Model</Label>
                        <Select value={aiModel} onValueChange={setAiModel}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select AI model" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="openai">OpenAI</SelectItem>
                                <SelectItem value="claude">Claude</SelectItem>
                                <SelectItem value="cohere">Cohere</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={generateCoverLetter}>Generate Cover Letter</Button>
                </CardContent>
                {generatedLetter && (
                    <CardFooter className="flex flex-col items-start">
                        <h3 className="text-lg font-semibold mb-2">Generated Cover Letter:</h3>
                        <p className="mb-4">{generatedLetter}</p>
                        <div className="space-x-2">
                            <Button onClick={copyToClipboard}>Copy to Clipboard</Button>
                            <Button onClick={downloadAsDoc}>Download as .doc</Button>
                        </div>
                    </CardFooter>
                )}
                <CardFooter>
                    <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default Dashboard;