// src/utils/CoverLetterWriter.ts
import AIService from "@/services/AIService";
import { AIProviderName, getAIService } from "@/utils/getAIService";
import {
  CandidateInfo,
  CompanyInfo,
  CoverLetterOptions,
  GeneratedCoverLetter,
  JobSummary,
  RelevantExperience,
} from "../model";

export class CoverLetterWriter {
  private aiService: AIService;

  constructor(providerName: AIProviderName) {
    this.aiService = getAIService(providerName);
  }

  async generateCoverLetter(
    jobSummary: JobSummary,
    companyInfo: CompanyInfo,
    relevantExperience: RelevantExperience,
    candidateInfo: CandidateInfo,
    options: CoverLetterOptions
  ): Promise<GeneratedCoverLetter> {
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const prompt = `
Generate a ${options.paragraphs}-paragraph cover letter with a ${
      options.tone
    } tone, focusing on ${options.focusAreas.join(", ")}.
${options.includeCallToAction ? "Include a call to action." : ""}
${
  options.emphasizeUniqueness
    ? "Emphasize the candidate's unique qualities."
    : ""
}
${options.customInstructions}

Use the following template exactly, replacing only the placeholders:
${options.template}

Replace [Cover Letter Content] with the generated paragraphs.
Replace other placeholders with appropriate information from the provided context.

Return only the formatted cover letter, maintaining the exact structure of the template.`;

    const context = JSON.stringify({
      jobSummary,
      companyInfo,
      relevantExperience,
      candidateInfo,
      currentDate,
    });

    const result = await this.aiService.processText(prompt, context);

    return {
      content: result,
    };
  }
}
