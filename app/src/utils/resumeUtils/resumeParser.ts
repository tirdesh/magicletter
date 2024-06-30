// src/utils/resumeParser.ts
import { AIProviderName, ParsedResume } from "@/model";
import { AIParser } from "./parsers/AIParser";
import { NLPParser } from "./parsers/NLPParser";

async function parseResume(
  resumeText: string,
  method: "nlp" | "ai",
  providerName?: AIProviderName
): Promise<ParsedResume> {
  console.log(resumeText);
  try {
    let parsedResume: ParsedResume;
    switch (method) {
      case "nlp":
        parsedResume = await new NLPParser(resumeText).parse();
        break;
      case "ai":
        if (!providerName) {
          throw new Error("AI provider name is required for AI parsing method");
        }
        parsedResume = await new AIParser(resumeText, providerName).parse();
        break;
      default:
        throw new Error("Unsupported parsing method");
    }
    console.log(
      `${method.toUpperCase()} Method:`,
      JSON.stringify(parsedResume, null, 2)
    );
    return parsedResume;
  } catch (error) {
    console.error(
      `Error parsing resume with ${method} method and ${providerName} provider:`,
      error
    );
    throw error;
  }
}

export default parseResume;
