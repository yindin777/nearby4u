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
      name: "isleyen.yindin777.workers.dev", // AI model name from screenshot
      binding: "Workers AI Catalog" // Binding name from screenshot
    });

    // Access the service bindings
    const sitedendigerarama = await ServiceBinding.getBinding("sitedendigerarama");
    const siteninbindingi = await ServiceBinding.getBinding("siteninbindingi");
    const sitenindigeri = await ServiceBinding.getBinding("sitenindigeri");

    // Use the service bindings to get relevant data (example)
    const data1 = await sitedendigerarama.getData1(); // Replace with actual method and parameters
    const data2 = await siteninbindingi.getData2(); // Replace with actual method and parameters
    const data3 = await sitenindigeri.getData3(); // Replace with actual method and parameters

    // Generate AI response based on data from service bindings
    const response = await ai.generate({
      prompt: `Find interesting places and recommendations near ${query}. Use data1: ${data1}, data2: ${data2}, and data3: ${data3} to provide more relevant and informative results.`,
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
