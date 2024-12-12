addEventListener('fetch', event => {
    event.respondWith(
        event.request.method === 'POST'
            ? handlePostRequest(event)
            : new Response('Method Not Allowed', { status: 405 })
    );
});

async function handlePostRequest(event) {
    try {
        const { query, latitude, longitude } = await event.request.json();

        // Retrieve the AI model from Workers AI Catalog
        const ai = await AI.getInstance({
            name: "nearby4u", // Replace with the actual name of your AI model
            binding: "nearby4u"
        });

        // Generate AI response
        const response = await ai.generate({
            prompt: `Find interesting places and recommendations near ${latitude},${longitude}. 
                    User query: "${query}". Provide results in a concise and human-readable format.`,
            input: query
        });

        // Return AI response
        return new Response(
            JSON.stringify({ result: response.text }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error generating AI response:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to generate response. Try again later.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
