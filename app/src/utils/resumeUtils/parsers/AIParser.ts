// src/utils/parsers/AIParser.ts
import { aiProviders } from "@/config/aiProviders";
import { AIProviderName, ParsedResume, ResumeSection } from "@/model";
import AIService from "@/services/AIService";
import { BaseParser } from "./BaseParser";

export class AIParser extends BaseParser {
  private providerName: AIProviderName;

  constructor(text: string, providerName: AIProviderName) {
    super(text);
    this.providerName = providerName;
  }

  async parse(): Promise<ParsedResume> {
    const providerConfig = aiProviders[this.providerName];
    if (!providerConfig) {
      throw new Error(`Unsupported AI provider: ${this.providerName}`);
    }

    const aiService = new AIService(this.providerName);
    const prompt = `Parse the following resume text and return a JSON object with the following structure:
        {
            "personalInfo": { "name": "", "email": "", "phone": "", "location": "" },
            "summary": "",
            "experience": [{ "title": "", "content": [""], "company": "", "date": "" }],
            "education": [{ "title": "", "content": [""], "institution": "", "date": "" }],
            "skills": [""],
            "projects": [{ "title": "", "description": "", "technologies": [""], "date": "" }],
            "certifications": [""],
            "languages": [""],
            "additionalSections": [{ "title": "", "content": [""] }]
        }
        Ensure all dates are in the format 'MM/YYYY - MM/YYYY' or 'MM/YYYY - Present'.
        For skills, projects, certifications, and languages, extract as much information as possible from the resume text.`;

    try {
      console.log(`Parsing resume with ${this.providerName} AI provider...`);
      const result = await aiService.processText(prompt, this.text);
      const parsedResult: ParsedResume = JSON.parse(result);
      return this.formatDatesInParsedResume(parsedResult);
    } catch (error) {
      console.error(
        `Error parsing resume with ${this.providerName} AI provider:`,
        error
      );
      throw error;
    }
  }

  private formatDatesInParsedResume(parsedResume: ParsedResume): ParsedResume {
    const formatSections = (sections: ResumeSection[]) =>
      sections.map((section) => ({
        ...section,
        date: this.formatDate(section.date || ""),
      }));

    return {
      ...parsedResume,
      experience: formatSections(parsedResume.experience),
      education: formatSections(parsedResume.education),
      projects: formatSections(parsedResume.projects),
    };
  }
}
