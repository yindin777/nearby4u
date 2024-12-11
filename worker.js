import { getAi, getAiCatalog } from 'https://cloudflare.com/kv/public/cloudflare-workers-for-github/cloudflare-workers-for-github/raw/main/cloudflare-workers-for-github/dist/index.js';

export default {
  async fetch(request) {
    const { pathname } = new URL(request.url);

    if (pathname === '/ai-search') {
      const { query, latitude, longitude } = await request.json();

      // Get the AI model from the Workers AI Catalog
      const ai = await getAi(getAiCatalog(), 'nearby4u'); 

      // Use the AI model to generate a response
      const response = await ai.generate({ 
        prompt: `Find interesting places and recommendations near ${latitude},${longitude}.`, 
        // Add more context or instructions to the prompt as needed
      });

      return new Response(JSON.stringify({ result: response.text }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Handle other requests (e.g., serving static files)
    return await fetch(request);
  }
};
