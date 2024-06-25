import React, { useEffect, useState, useRef } from "react";
import { addResume, getResumes, deleteResume } from "../utils/firebaseFunctions";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { Loader2, FileIcon, Trash2, Eye, AlertTriangle } from "lucide-react";
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
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Resume Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </span>
            </div>
          )}
           <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resume File</FormLabel>
                    <FormControl>
                      <div className="flex flex-wrap items-center gap-2">
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
                            className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Choose File
                          </Label>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
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
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter a label for your resume" className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-start">
                <Button type="submit" disabled={isLoading} className="transition-all duration-200 ease-in-out w-full sm:w-auto">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileIcon className="mr-2 h-4 w-4" />}
                  Add Resume
                </Button>
              </div>
            </form>
          </Form>
          <div className="space-y-4">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Resumes"
              className="w-full"
            />
            {filteredResumes.length > 0 ? (
              <div className="overflow-x-auto">
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
                          <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" onClick={() => window.open(resume.url, "_blank")}>
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteResume(resume.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center">No resumes found.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeDashboard;
