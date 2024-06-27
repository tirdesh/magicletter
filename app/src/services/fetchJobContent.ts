// src/services/fetchJobContent.ts

async function fetchJobContent(url: string): Promise<string> {
    const serverlessFunctionUrl = 'https://magicletter.vercel.app/api/fetch-job-content';
    const requestUrl = `${serverlessFunctionUrl}?url=${encodeURIComponent(url)}`;
  
    try {
      const response = await fetch(requestUrl);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const content = await response.text();
      return content;
    } catch (error) {
      console.error('Error fetching web content:', error);
      throw error;
    }
  }
  
  export default fetchJobContent;