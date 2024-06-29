// JobAnalyzer.ts
import AIService from "@/services/AIService";
import { AIProviderName, getAIService } from "@/utils/getAIService";
import { CompanyInfo, JobSummary } from "../model";

export class JobAnalyzer {
  private aiService: AIService;

  constructor(providerName: AIProviderName) {
    this.aiService = getAIService(providerName);
  }
  async fetchJobSummary(jobDescription: string): Promise<JobSummary> {
    const prompt = `
      Analyze the following job description and provide:
      1. A concise summary
      2. Key highlights
      3. Important keywords
      4. Required skills
      5. Preferred skills (if any)
      Return the result as a JSON object with the following structure:
      {
        "summary": "A brief summary of the job",
        "highlights": ["Key point 1", "Key point 2", ...],
        "keywords": ["Keyword 1", "Keyword 2", ...],
        "requiredSkills": ["Skill 1", "Skill 2", ...],
        "preferredSkills": ["Skill 1", "Skill 2", ...]
      }
    `;
    const result = await this.aiService.processText(prompt, jobDescription);
    console.log("Job summary:", result);
    return JSON.parse(result);
  }

  async identifyCompanyInfo(jobDescription: string): Promise<CompanyInfo> {
    const prompt = `
      From the given job description, extract:
      1. The company name
      2. The company's location (city and state)
      3. The company's mission and values
      4. Any recent news or projects mentioned
      5. Information about the company culture
      6. The industry the company operates in
      Return the result as a JSON object with the following structure:
      {
        "name": "Company Name",
        "city": "Company City",
        "state": "Company State",
        "missionValues": "Brief description of company's mission and values",
        "recentNews": "Any recent news or projects mentioned",
        "culture": "Description of company culture",
        "industry": "Industry the company operates in"
      }
    `;
    const result = await this.aiService.processText(prompt, jobDescription);
    console.log("Company info:", result);
    return JSON.parse(result);
  }
}
