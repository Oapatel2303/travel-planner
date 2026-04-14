// netlify/functions/chat.js

exports.handler = async function(event, context) {
    // 1. Grab the user's message from the frontend request
    const body = JSON.parse(event.body);
    const incomingMessages = body.messages;

    // 2. Grab your secret key from the Netlify vault
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    try {
        // 3. Talk to Groq securely from the server
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: incomingMessages
            })
        });

        const data = await response.json();

        // 4. Send Groq's answer back to your frontend
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error("Server Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to connect to AI" })
        };
    }
};