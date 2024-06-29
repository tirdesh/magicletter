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

Use this format:
${candidateInfo.fullName}
${candidateInfo.city}, ${candidateInfo.state}
${candidateInfo.phoneNumber}
${candidateInfo.email}

${currentDate}

${companyInfo.name}
${companyInfo.city}, ${companyInfo.state}

Dear Hiring Manager,

[Cover Letter Content]

Sincerely,
${candidateInfo.fullName}

Return only the formatted cover letter.`;

    const context = JSON.stringify({
      jobSummary,
      companyInfo,
      relevantExperience,
      options,
    });

    const result = await this.aiService.processText(prompt, context);

    return {
      content: result, // Now we're returning the raw text directly
    };
  }
}
