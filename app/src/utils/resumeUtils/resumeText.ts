// In src/utils/firebaseFunctions.ts

import { db } from '../../firebase'; // Adjust the import path as needed
import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';
import { doc, getDoc } from 'firebase/firestore';

export const getResumeText = async (resumeId: string): Promise<string> => {
    try {
        // Get the resume metadata
        console.log('Getting resume metadata...');
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

        // Fetch the file
        const response = await fetch(fileUrl);
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
        throw error;
    }
};

async function extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let text = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(' ') + '\n';
    }

    return text;
}

async function extractTextFromDOC(arrayBuffer: ArrayBuffer): Promise<string> {
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
}