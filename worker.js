addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');

    if (!query) {
      return new Response("Missing 'q' query parameter", { status: 400 });
    }

    // Access the Workers AI model
    const ai = await AI.getInstance({
      name: "isleyen.yindin777.workers.dev", // Replace with your actual AI model name
      binding: "Workers AI Catalog" // Binding name from the screenshot
    });

    // Access the service binding (assuming it's named 'nearby4uservice')
    const nearby4uservice = await ServiceBinding.getBinding("nearby4uservice");

    // Use the service binding to get relevant data (e.g., location information)
    const locationData = await nearby4uservice.getLocationData(query); // Example: Get location data based on user query

    // Generate AI response based on location data
    const response = await ai.generate({
      prompt: `Find interesting places and recommendations near ${locationData.location}. Provide results in a concise and human-readable format.`,
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
