// CoverLetterWriter.ts
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
  async generateInitialCoverLetter(
    jobSummary: JobSummary,
    companyInfo: CompanyInfo,
    relevantExperience: RelevantExperience,
    userInstructions: string,
    options: CoverLetterOptions
  ): Promise<string> {
    const prompt = `
      Generate a cover letter using the provided job summary, company information, relevant experiences, and specific instructions.
      The cover letter should:
      1. Have a compelling introduction mentioning the specific position and company.
      2. In the body, address key requirements from the job description and how the candidate's experience matches them.
      3. Include a paragraph about why the candidate is particularly interested in this company.
      4. ${
        options.includeCallToAction
          ? "Conclude with a strong call to action."
          : "Conclude with a summary of interest in the role."
      }
      5. Use a ${options.tone} tone.
      6. Focus particularly on: ${options.focusAreas.join(", ")}.
      7. Be ${
        options.length === "short"
          ? "250-300"
          : options.length === "medium"
          ? "300-350"
          : "350-400"
      } words.
      8. ${
        options.emphasizeUniqueness
          ? "Emphasize what makes the candidate unique and stand out from other applicants."
          : ""
      }
      9. Follow these specific user instructions: ${userInstructions}
      Return the cover letter as a string, focusing only on the content paragraphs (do not include the header or signature).
    `;
    const context = JSON.stringify({
      jobSummary,
      companyInfo,
      relevantExperience,
      options,
      userInstructions,
    });
    const result = await this.aiService.processText(prompt, context);
    console.log("Cover letter:", result);
    return result;
  }

  async refineCoverLetter(
    initialCoverLetter: string,
    jobSummary: JobSummary,
    options: CoverLetterOptions,
    candidateInfo: CandidateInfo,
    companyInfo: CompanyInfo
  ): Promise<GeneratedCoverLetter> {
    const currentDate = new Date().toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
    const prompt = `
      Refine the following cover letter content:
      ${initialCoverLetter}
      Ensure it's concise, impactful, and between ${
        options.length === "short"
          ? "250-300"
          : options.length === "medium"
          ? "300-350"
          : "350-400"
      } words.
      Format the cover letter as follows:
      ${candidateInfo.fullName}
      ${candidateInfo.city}, ${candidateInfo.state}
      ${candidateInfo.phoneNumber}
      ${candidateInfo.email}
      ${currentDate}
      Hiring Manager
      ${companyInfo.name}
      ${companyInfo.city}, ${companyInfo.state}
      Dear Hiring Manager,
      [Refined Paragraph 1]
      [Refined Paragraph 2]
      [Refined Paragraph 3]
      [Optional Refined Paragraph 4 if needed]
      Warm regards,
      ${candidateInfo.fullName}
      After formatting:
      1. Extract 5 key points that make the candidate a strong fit for the role.
      2. Provide a match score (0-100) based on how well the cover letter aligns with the job requirements.
      3. Suggest 2-3 improvements or additions that could make the cover letter even stronger.
      Return the result as a JSON object with the following structure:
      {
        "coverLetter": "The formatted and refined cover letter text",
        "importantNotes": ["Key point 1", "Key point 2", "Key point 3", "Key point 4", "Key point 5"],
        "matchScore": 85,
        "suggestedImprovements": ["Improvement 1", "Improvement 2", "Improvement 3"]
      }
    `;
    const context = JSON.stringify({
      jobSummary,
      options,
      candidateInfo,
      companyInfo,
    });
    const result = await this.aiService.processText(prompt, context);
    console.log("Refined Cover Letter:", result);
    return JSON.parse(result);
  }
}
