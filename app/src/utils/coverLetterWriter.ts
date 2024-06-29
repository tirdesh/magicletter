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
    const prompt = `
      Generate a cover letter using the provided information:
      1. Have a compelling introduction mentioning the specific position and company. In the body, address key requirements from the job description and how the candidate's experience matches them.Include a paragraph about why the candidate is particularly interested in this company.
      2. Use a ${options.tone} tone.
      3. Create ${options.paragraphs} paragraphs.
      4. ${
        options.includeCallToAction
          ? "Conclude with a strong call to action."
          : "Conclude with a summary of interest in the role."
      }
      5. Focus particularly on: ${options.focusAreas.join(", ")}.
      6. ${
        options.emphasizeUniqueness
          ? "Emphasize what makes the candidate unique and stand out from other applicants."
          : ""
      }
      7. Follow these custom instructions: ${options.customInstructions}
      
      Format the cover letter as follows:
      [Candidate Name]
      [Candidate City, State]
      [Candidate Phone]
      [Candidate Email]
      
      [Current Date]
      
      [Company Name]
      [Company City, State]
      
      Dear Hiring Manager,
      
      [Paragraph x]
      
      Sincerely,
      [Candidate Name]
      
    `;

    const context = JSON.stringify({
      jobSummary,
      companyInfo,
      relevantExperience,
      candidateInfo,
      options,
    });

    const result = await this.aiService.processText(prompt, context);
    const parsedResult = JSON.parse(result);

    return {
      content: parsedResult.coverLetter,
    };
  }
}
