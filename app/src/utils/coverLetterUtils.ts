import AIService from "@/services/AIService";

interface GeneratedCoverLetter {
  coverLetter: string;
  importantNotes: string[];
}

class CoverLetterGenerator {
  private aiService: AIService;

  constructor(private providerName: "openai" | "claude") {
    this.aiService = new AIService(this.providerName);
  }

  async generateCoverLetter(
    resumeText: string,
    jobDescription: string,
    instructions: string
  ): Promise<GeneratedCoverLetter> {
    const prompt = `
        Using the provided resume text, job description, and specific instructions, generate a cover letter and list important things to be noted regarding the job.
        
        Return a JSON object with the following structure:
        {
            "coverLetter": "",
            "importantNotes": [""]
        }
        Ensure the cover letter is professional, tailored to the job description, and follows any specific instructions provided. Extract key points from the job description and highlight them in the important notes.`;

    const text = `
        Resume Text:
        ${resumeText}

        Job Description:
        ${jobDescription}

        Specific Instructions:
        ${instructions}`;

    try {
      console.log(
        `Generating cover letter with ${this.providerName} AI provider...`
      );
      const result = await this.aiService.processText(prompt, text);
      const generatedResult: GeneratedCoverLetter = JSON.parse(result);
      return generatedResult;
    } catch (error) {
      console.error(
        `Error generating cover letter with ${this.providerName} AI provider:`,
        error
      );
      throw error;
    }
  }
}

export default CoverLetterGenerator;
