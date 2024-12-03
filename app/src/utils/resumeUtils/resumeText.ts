// src/utils/resumeUtils/resumeText.ts

import { doc, getDoc, updateDoc } from "firebase/firestore";
import mammoth from "mammoth";
import * as pdfjs from "pdfjs-dist";
import { TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";
import { db } from "../../firebase";

// Constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const SUPPORTED_TYPES = {
  PDF: "application/pdf",
  DOC: "application/msword",
  DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Types
interface ResumeData {
  url: string;
  fileName: string;
  fileType: string;
  resumeText?: string;
}

export const getResumeText = async (resumeId: string): Promise<string> => {
  try {
    // Validate resumeId
    if (!resumeId) {
      throw new Error("Resume ID is required");
    }

    // Get resume metadata
    const resumeRef = doc(db, "resumes", resumeId);
    const resumeSnap = await getDoc(resumeRef);

    if (!resumeSnap.exists()) {
      throw new Error("Resume not found");
    }

    const resumeData = resumeSnap.data() as ResumeData;

    // Validate required fields
    if (!resumeData.url || !resumeData.fileType) {
      throw new Error("Invalid resume data: missing required fields");
    }

    // Return cached text if available
    if (resumeData.resumeText) {
      return resumeData.resumeText;
    }

    // Fetch and validate file
    const response = await fetch(resumeData.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) {
      throw new Error("File size exceeds maximum limit");
    }

    const arrayBuffer = await response.arrayBuffer();
    let extractedText = "";

    // Extract text based on file type
    switch (resumeData.fileType) {
      case SUPPORTED_TYPES.PDF:
        extractedText = await extractTextFromPDF(arrayBuffer);
        break;
      case SUPPORTED_TYPES.DOC:
      case SUPPORTED_TYPES.DOCX:
        extractedText = await extractTextFromDOC(arrayBuffer);
        break;
      default:
        throw new Error(`Unsupported file type: ${resumeData.fileType}`);
    }

    // Validate and clean extracted text
    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error("No text could be extracted from the file");
    }

    // Process the extracted text
    const processedText = processExtractedText(extractedText);

    // Cache the processed text
    await updateDoc(resumeRef, { resumeText: processedText });

    return processedText;
  } catch (error) {
    console.error("Error in getResumeText:", error);
    throw error;
  }
};

async function extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    const textPromises = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      textPromises.push(
        pdf.getPage(i).then(async (page) => {
          const content = await page.getTextContent();
          return content.items
            .map((item: TextItem | TextMarkedContent) => {
              if ("str" in item) {
                return item.str;
              }
              return "";
            })
            .join(" ");
        })
      );
    }

    const textParts = await Promise.all(textPromises);
    return textParts.join("\n");
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
}

async function extractTextFromDOC(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ arrayBuffer });
    if (!result.value) {
      throw new Error("No text extracted from document");
    }
    return result.value;
  } catch (error) {
    console.error("Error extracting text from DOC:", error);
    throw new Error("Failed to extract text from DOC/DOCX");
  }
}

function processExtractedText(text: string): string {
  return text
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .replace(/[^\x20-\x7E\n]/g, "") // Remove non-printable characters
    .trim();
}
