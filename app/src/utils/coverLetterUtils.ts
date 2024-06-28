import AIService from "@/services/AIService";

interface GeneratedCoverLetter {
  coverLetter: string;
  importantNotes: string[];
  matchScore: number;
  suggestedImprovements: string[];
}

interface JobSummary {
  summary: string;
  highlights: string[];
  keywords: string[];
  requiredSkills: string[];
  preferredSkills: string[];
}

interface CompanyInfo {
  name: string;
  city: string;
  state: string;
  missionValues: string;
  recentNews: string;
  culture: string;
  industry: string;
}

interface RelevantExperience {
  experiences: string[];
  skills: string[];
  achievements: string[];
}

interface CoverLetterOptions {
  tone: "professional" | "enthusiastic" | "formal" | "conversational";
  focusAreas: (
    | "technical skills"
    | "soft skills"
    | "achievements"
    | "cultural fit"
  )[];
  length: "short" | "medium" | "long";
  includeCallToAction: boolean;
  emphasizeUniqueness: boolean;
}

interface CandidateInfo {
  fullName: string;
  city: string;
  state: string;
  phoneNumber: string;
  email: string;
}

class CoverLetterGenerator {
  private aiService: AIService;

  constructor(private providerName: "openai" | "claude") {
    this.aiService = new AIService(this.providerName);
  }

  async generateCoverLetter(
    resumeText: string,
    jobDescription: string,
    userInstructions: string
  ): Promise<GeneratedCoverLetter> {
    try {
      console.log(
        `Starting cover letter generation process with ${this.providerName} AI provider...`
      );

      const jobSummary = await this.fetchJobSummary(jobDescription);
      const companyInfo = await this.identifyCompanyInfo(jobDescription);
      const relevantExperience = await this.fetchRelevantExperience(
        resumeText,
        jobSummary,
        companyInfo
      );
      const candidateInfo = await this.extractCandidateInfo(resumeText);

      const defaultOptions: CoverLetterOptions = {
        tone: "enthusiastic",
        focusAreas: ["technical skills", "cultural fit"],
        length: "medium",
        includeCallToAction: true,
        emphasizeUniqueness: true,
      };

      const initialCoverLetter = await this.generateInitialCoverLetter(
        jobSummary,
        companyInfo,
        relevantExperience,
        userInstructions,
        defaultOptions
      );

      const finalCoverLetter = await this.refineCoverLetter(
        initialCoverLetter,
        jobSummary,
        defaultOptions,
        candidateInfo,
        companyInfo
      );

      return finalCoverLetter;
    } catch (error) {
      console.error(`Error in cover letter generation process:`, error);
      throw new Error(`Cover letter generation failed: ${error}`);
    }
  }

  private async fetchJobSummary(jobDescription: string): Promise<JobSummary> {
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
    return JSON.parse(result);
  }

  private async identifyCompanyInfo(
    jobDescription: string
  ): Promise<CompanyInfo> {
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
    return JSON.parse(result);
  }

  private async fetchRelevantExperience(
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
    return JSON.parse(result);
  }

  private async extractCandidateInfo(
    resumeText: string
  ): Promise<CandidateInfo> {
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
    return JSON.parse(result);
  }

  private async generateInitialCoverLetter(
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
    return await this.aiService.processText(prompt, context);
  }

  private async refineCoverLetter(
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
    return JSON.parse(result);
  }
}

export default CoverLetterGenerator;
