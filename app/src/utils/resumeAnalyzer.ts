// ResumeAnalyzer.ts
import { AIProviderName } from "@/model";
import AIService from "@/services/AIService";
import { getAIService } from "@/utils/getAIService";
import {
  CandidateInfo,
  CompanyInfo,
  JobSummary,
  RelevantExperience,
} from "../model";

export class ResumeAnalyzer {
  private aiService: AIService;

  constructor(providerName: AIProviderName) {
    this.aiService = getAIService(providerName);
  }
  async fetchRelevantExperience(
    resumeText: string,
    jobSummary: JobSummary,
    companyInfo: CompanyInfo
  ): Promise<RelevantExperience> {
    const prompt = `
      Given the resume text, job summary, and company information:
      1. Identify the most relevant experiences that match the job requirements
      2. List skills from the resume that align with the required and preferred skills
      3. Extract notable achievements that would be relevant to this role
      Return the result as a JSON object with the following structure:
      {
        "experiences": ["Relevant experience 1", "Relevant experience 2", ...],
        "skills": ["Relevant skill 1", "Relevant skill 2", ...],
        "achievements": ["Notable achievement 1", "Notable achievement 2", ...]
      }
    `;
    const context = JSON.stringify({ resumeText, jobSummary, companyInfo });
    const result = await this.aiService.processText(prompt, context);
    console.log("Relevant experience:", result);
    return JSON.parse(result);
  }

  async extractCandidateInfo(resumeText: string): Promise<CandidateInfo> {
    const prompt = `
      From the given resume text, extract the following information:
      1. Full Name
      2. City
      3. State
      4. Phone Number
      5. Email Address
      Return the result as a JSON object with the following structure:
      {
        "fullName": "Candidate's Full Name",
        "city": "Candidate's City",
        "state": "Candidate's State",
        "phoneNumber": "Candidate's Phone Number",
        "email": "Candidate's Email Address"
      }
    `;
    const result = await this.aiService.processText(prompt, resumeText);
    console.log("Extracted candidate info:", result);
    return JSON.parse(result);
  }
}
