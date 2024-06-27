import axios from "axios";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const url = new URL(req.url).searchParams.get("url");

  if (!url) {
    return new Response("URL parameter is required", { status: 400 });
  }

  try {
    const response = await axios.get(url);
    return new Response(response.data, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error("Error fetching job content:", error);
    return new Response("Error fetching job content", { status: 500 });
  }
}
