// src/components/ResumeUpload.tsx

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileIcon, Loader2, Upload } from "lucide-react";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { resumeFormSchema } from "./resumeFormSchema";

export type ResumeFormValues = z.infer<typeof resumeFormSchema>;

interface ResumeUploadProps {
  onSubmit: (values: ResumeFormValues) => Promise<void>;
  isLoading: boolean;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onSubmit, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: {
      file: undefined,
      label: "",
    },
  });

  const handleSubmit = async (values: ResumeFormValues) => {
    if (values.file instanceof File) {
      await onSubmit(values);
      form.reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">
                  Upload Resume
                </FormLabel>
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
                      {field.value
                        ? (field.value as File).name
                        : "No file chosen"}
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
                  <Input
                    {...field}
                    placeholder="Enter a label for your resume"
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-start mt-6">
            <Button
              type="submit"
              disabled={isLoading}
              className="transition-all duration-200"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileIcon className="mr-2 h-4 w-4" />
              )}
              Add Resume
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ResumeUpload;
