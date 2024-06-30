import { motion } from "framer-motion";
import { AlertTriangle, Eye, FileIcon, Search, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ResumeUpload, { ResumeFormValues } from "@/components/ResumeUpload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Resume } from "@/model";
import {
  addResume,
  deleteResume,
  getResumes,
} from "../utils/firebaseFunctions";

const ResumeDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      refreshResumes();
    }
  }, [currentUser]);

  const onSubmit = async (values: ResumeFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await addResume(values.file, values.label);
      await refreshResumes();
      toast({ title: "Success", description: "Resume added successfully" });
    } catch (error) {
      console.error("Error adding resume:", error);
      setError(
        "Failed to add resume. Please check your connection and try again."
      );
      toast({
        title: "Error",
        description: "Failed to add resume",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteResume = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteResume(id);
      await refreshResumes();
      toast({ title: "Success", description: "Resume deleted successfully" });
    } catch (error) {
      console.error("Error deleting resume:", error);
      setError(
        "Failed to delete resume. Please check your connection and try again."
      );
      toast({
        title: "Error",
        description: "Failed to delete resume",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshResumes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedResumes = await getResumes();
      setResumes(fetchedResumes);
    } catch (error) {
      console.error("Error fetching resumes:", error);
      setError(
        "Failed to fetch resumes. Please check your connection and try again."
      );
      toast({
        title: "Error",
        description: "Failed to fetch resumes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredResumes = resumes.filter((resume) =>
    resume.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-grow flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="h-full flex flex-col"
        >
          <Card className="w-full max-w-4xl mx-auto shadow-md flex flex-col flex-grow max-h-[calc(100vh-8rem)]">
            <CardHeader className="bg-primary/10 dark:bg-primary/20">
              <CardTitle className="text-2xl font-bold text-primary">
                Resume Dashboard
              </CardTitle>
              <CardDescription>Manage your resumes efficiently</CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex flex-col flex-grow overflow-hidden">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-destructive/15 border-l-4 border-destructive text-destructive p-4 rounded-md mb-4"
                  role="alert"
                >
                  <div className="flex items-center">
                    <AlertTriangle className="h-6 w-6 mr-2" />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
              <ResumeUpload onSubmit={onSubmit} isLoading={isLoading} />
              <div className="mt-8 flex-grow flex flex-col">
                <div className="relative mb-4">
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Resumes"
                    className="w-full pl-10"
                  />
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                </div>
                <ScrollArea className="flex-grow pr-4 overflow-y-auto">
                  <div className="pb-8">
                    {filteredResumes.length > 0 ? (
                      <div className="overflow-x-auto bg-card rounded-lg shadow-sm">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-2/3">Label</TableHead>
                              <TableHead className="w-1/3">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredResumes.map((resume) => (
                              <TableRow key={resume.id}>
                                <TableCell className="font-medium">
                                  {resume.label}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        window.open(resume.url, "_blank")
                                      }
                                    >
                                      <Eye className="h-4 w-4" />
                                      <span className="sr-only">Preview</span>
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        navigate(`/app/resume/${resume.id}`)
                                      }
                                    >
                                      <FileIcon className="h-4 w-4" />
                                      <span className="sr-only">View Text</span>
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() =>
                                        handleDeleteResume(resume.id)
                                      }
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Delete</span>
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No resumes found.
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ResumeDashboard;
