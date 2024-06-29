// pages/api/fetch-job-content.ts

import axios from "axios";
import * as cheerio from "cheerio";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const url = new URL(req.url).searchParams.get("url");

  if (!url) {
    return new Response(
      JSON.stringify({ error: "URL parameter is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Remove script and style elements
    $("script, style").remove();

    // Get the text content
    let text = $("body").text();

    // Clean up the text
    text = text.replace(/\s+/g, " ").trim();

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching job content:", error);
    return new Response(
      JSON.stringify({ error: "Error fetching job content" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
