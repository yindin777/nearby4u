addEventListener('fetch', event => {
    return event.request.method === 'POST'
        ? handlePostRequest(event)
        : new Response('Method Not Allowed', { status: 405 });
});

async function handlePostRequest(event) {
    const request = event.request;
    const { query, latitude, longitude } = await request.json();

    try {
        // Retrieve the AI model from the Workers AI Catalog
        const ai = await event.waitUntil(AI.getInstance({
            name: "nearby4u", // Replace with the actual name of your AI model
            binding: "nearby4u" 
        }));

        // Generate AI response
        const response = await ai.generate({ 
            prompt: `Find interesting places and recommendations near ${latitude},${longitude}. 
                    Consider user interests (if available). 
                    Provide results in a concise and human-readable format.`,
            input: query
        });

        // Return the AI response as JSON
        return new Response(JSON.stringify({ result: response.text }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error generating AI response:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
