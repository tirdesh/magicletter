import * as z from "zod";

export const resumeFormSchema = z.object({
  file: z.any(),
  label: z.string().min(2, "Label must be at least 2 characters"),
});
