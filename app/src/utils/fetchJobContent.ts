// src/utils/fetchJobContent.ts

const corsProxies = [
    'https://cors-anywhere.herokuapp.com/',
    'https://api.allorigins.win/raw?url=',
    'https://api.codetabs.com/v1/proxy?quest='
  ];
  
  async function fetchWithProxy(url: string, proxyUrl: string): Promise<string> {
    const response = await fetch(`${proxyUrl}${encodeURIComponent(url)}`, {
      headers: {
        'Origin': 'http://localhost:5173', // Replace with your actual origin in production
      },
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    return await response.text();
  }
  
  async function fetchJobContent(url: string): Promise<string> {
    for (const proxy of corsProxies) {
      try {
        return await fetchWithProxy(url, proxy);
      } catch (error) {
        console.error(`Error with proxy ${proxy}:`, error);
      }
    }
  
    throw new Error('All proxies failed');
  }
  
  export default fetchJobContent;
  