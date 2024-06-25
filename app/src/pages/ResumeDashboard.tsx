import React, { useEffect, useState, useRef } from "react";
import { addResume, getResumes, deleteResume } from "../utils/firebaseFunctions";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { Loader2, FileIcon, Trash2, Eye, AlertTriangle, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface Resume {
  id: string;
  label: string;
  url: string;
}

const formSchema = z.object({
  file: z.any().refine((file) => file instanceof File, "Please upload a file"),
  label: z.string().min(2, "Label must be at least 2 characters"),
});

const ResumeDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: undefined,
      label: "",
    },
  });

  useEffect(() => {
    if (currentUser) {
      refreshResumes();
    }
  }, [currentUser]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.file instanceof File) {
      setIsLoading(true);
      setError(null);
      try {
        await addResume(values.file, values.label);
        await refreshResumes();
        form.reset();
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        toast({ title: "Success", description: "Resume added successfully" });
      } catch (error) {
        console.error("Error adding resume:", error);
        setError("Failed to add resume. Please check your connection and try again.");
        toast({ title: "Error", description: "Failed to add resume", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
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
      setError("Failed to delete resume. Please check your connection and try again.");
      toast({ title: "Error", description: "Failed to delete resume", variant: "destructive" });
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
      setError("Failed to fetch resumes. Please check your connection and try again.");
      toast({ title: "Error", description: "Failed to fetch resumes", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredResumes = resumes.filter((resume) =>
    resume.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 bg-background min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-4xl mx-auto shadow-md">
          <CardHeader className="bg-primary/10 dark:bg-primary/20">
            <CardTitle className="text-2xl font-bold text-primary">Resume Dashboard</CardTitle>
            <CardDescription>Manage your resumes efficiently</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-destructive/15 border-l-4 border-destructive text-destructive p-4 rounded-md"
                role="alert"
              >
                <div className="flex items-center">
                  <AlertTriangle className="h-6 w-6 mr-2" />
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="bg-card p-6 rounded-lg shadow-sm">
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold">Upload Resume</FormLabel>
                        <FormControl>
                          <div className="flex flex-wrap items-center gap-4">
                            <div className="flex-shrink-0">
                              <Input
                                type="file"
                                ref={fileInputRef}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    field.onChange(file);
                                    form.setValue("label", file.name);
                                  }
                                }}
                                className="hidden"
                                accept=".pdf,.doc,.docx"
                                id="resume-file"
                              />
                              <Label
                                htmlFor="resume-file"
                                className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                              >
                                <Upload className="mr-2 h-4 w-4" />
                                Choose File
                              </Label>
                            </div>
                            <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {field.value ? (field.value as File).name : "No file chosen"}
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="label"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel className="text-lg font-semibold">Label</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter a label for your resume" className="w-full" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-start mt-6">
                    <Button type="submit" disabled={isLoading} className="transition-all duration-200">
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileIcon className="mr-2 h-4 w-4" />}
                      Add Resume
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
            <div className="space-y-4 mt-8">
              <div className="relative">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Resumes"
                  className="w-full pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              </div>
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
                          <TableCell className="font-medium">{resume.label}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm" onClick={() => window.open(resume.url, "_blank")}>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">Preview</span>
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => {
                                const targetUrl = `/app/resume/${resume.id}`;
                                navigate(targetUrl);
                              }}>
                                <FileIcon className="h-4 w-4" />
                                <span className="sr-only">View Text</span>
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteResume(resume.id)}>
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
                <p className="text-center text-muted-foreground py-8">No resumes found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResumeDashboard;