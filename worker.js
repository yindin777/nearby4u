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
      binding: "Workers AI Catalog" 
    });

    // Access service bindings (assuming names are as in the screenshot)
    const sitedendigerarama = await ServiceBinding.getBinding("sitedendigerarama");
    const siteninbindingi = await ServiceBinding.getBinding("siteninbindingi");
    const sitenindigeri = await ServiceBinding.getBinding("sitenindigeri");

    // Example: Get data from service bindings (replace with actual methods)
    const data1 = await sitedendigerarama.getData1(); 
    const data2 = await siteninbindingi.getData2(); 
    const data3 = await sitenindigeri.getData3(); 

    // Generate AI response (adapt prompt as needed)
    const response = await ai.generate({
      prompt: `Find interesting places and recommendations near ${query}. Utilize information from the following sources: 
      - Data1: ${data1}
      - Data2: ${data2}
      - Data3: ${data3} 
      Provide results in a concise and human-readable format, including place names, locations, and any relevant details.`,
      input: query
    });

    // Format response for index.html
    const results = response.text.split('\n').map(line => { 
      const parts = line.split(' - '); 
      if (parts.length >= 2) { 
        return { 
          display_name: parts[0], 
          location: parts[1] 
        }; 
      } 
      return null; 
    }).filter(result => result !== null); 

    return new Response(JSON.stringify({ results }), { 
      headers: { 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'An error occurred' }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
