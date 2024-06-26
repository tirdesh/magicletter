// src/utils/firebaseFunctions.ts

import { db } from '../../firebase'; // Adjust the import path as needed
import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';
import { doc, getDoc } from 'firebase/firestore';

// Set the workerSrc property
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const getResumeText = async (resumeId: string): Promise<string> => {
    try {
        // Get the resume metadata
        console.log('Getting resume metadata..., resumeId:', resumeId);
        const resumeRef = doc(db, "resumes", resumeId);
        const resumeSnap = await getDoc(resumeRef);

        if (!resumeSnap.exists()) {
            throw new Error('Resume not found');
        }
        const resumeData = resumeSnap.data();
        const fileUrl = resumeData.url;
        const fileName = resumeData.fileName;
        const fileType = resumeData.fileType;

        console.log('File name:', fileName);
        console.log('File type:', fileType);

        if(resumeData.resumeText) {
            console.log('Using cached resume text...');
            return resumeData.resumeText;
        }

        const response = await fetch(fileUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();

        if (fileType === 'application/pdf') {
            console.log('Extracting text from PDF...');
            return await extractTextFromPDF(arrayBuffer);
        } else if (fileType === 'application/msword' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            console.log('Extracting text from DOC...');
            return await extractTextFromDOC(arrayBuffer);
        } else {
            throw new Error(`Unsupported file type: ${fileType}`);
        }
    } catch (error) {
        console.error('Error in getResumeText:', error);
        return `Failed to extract text: ${error}`;
    }
};

async function extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    console.log('Extracting text from PDF pages...');
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(' ') + '\n';
    }

    console.log('Extracted text from PDF:', text);
    return text;
}

async function extractTextFromDOC(arrayBuffer: ArrayBuffer): Promise<string> {
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
}