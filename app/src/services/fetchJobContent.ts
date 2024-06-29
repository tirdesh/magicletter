// src/services/fetchJobContent.ts

async function fetchJobContent(url: string): Promise<string> {
  const serverlessFunctionUrl = "/api/fetch-job-content";
  const requestUrl = `${serverlessFunctionUrl}?url=${encodeURIComponent(url)}`;

  try {
    const response = await fetch(requestUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const content = await response.json();
    console.log("Job content:", content.text);
    return content.text;
  } catch (error) {
    console.error("Error fetching job content:", error);
    throw error;
  }
}

export default fetchJobContent;
