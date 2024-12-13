addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');

    if (!query) {
      return new Response("Missing 'q' query parameter", { status: 400 });
    }

    const ai = await AI.getInstance({
      name: "@cf/stabilityai/stable-diffusion-xl-base-1.0", // Or your AI model name
      binding: "YOUR_AI_BINDING"
    });

    const response = await ai.generate({
      prompt: `Find interesting places and recommendations near ${query}. Provide results in a concise and human-readable format.`,
      input: query
    });

    return new Response(JSON.stringify({ result: response.text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'An error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
