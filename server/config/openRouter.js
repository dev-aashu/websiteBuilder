const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions"
const models = [
    "google/gemini-2.5-pro-exp-03-25:free",
    "google/gemini-2.0-flash-lite-001:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "qwen/qwen-2.5-coder-32b-instruct:free",
    "deepseek/deepseek-chat"
]

export const generateResponse = async (prompt) => {
    let lastError = null;

    // 1. Try OpenRouter Models
    for (const model of models) {
        try {
            console.log(`Trying OpenRouter model: ${model}`);
            const res = await fetch(openRouterUrl, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: "system", content: "You must return ONLY the raw HTML code exactly as requested. Start immediately with <!DOCTYPE html>. Do NOT wrap in markdown code fences." },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.2,
                    stream: false
                }),
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`[${model}] HTTP ${res.status}: ${errText}`);
            }

            const data = await res.json();
            const content = data?.choices?.[0]?.message?.content;
            if (!content) throw new Error(`[${model}] Empty response`);
            console.log(`[${model}] Response length: ${content.length}`);
            return content;
        } catch (error) {
            console.warn(error.message);
            lastError = error;
        }
    }

    // 2. Pollinations AI Fallback
    console.log("OpenRouter exhausted. Falling back to Pollinations AI...");
    try {
        const res = await fetch("https://text.pollinations.ai/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: "Return ONLY a raw JSON object with exactly one key 'code' whose value is a complete HTML document string. No explanation, no markdown." },
                    { role: "user", content: prompt }
                ],
                model: "openai",
                jsonMode: true,
                stream: false
            })
        });

        if (!res.ok) {
            const errBody = await res.text().catch(() => "");
            throw new Error(`Pollinations HTTP ${res.status}: ${errBody}`);
        }

        const textResponse = await res.text();
        // IMPORTANT: never fall back to raw textResponse — it may be SSE stream data
        const parsed = JSON.parse(textResponse);
        if (typeof parsed.code !== 'string' || !parsed.code.includes('<!DOCTYPE')) {
            throw new Error("Pollinations response missing valid HTML code field");
        }
        console.log(`Pollinations response length: ${parsed.code.length}`);
        return parsed.code;
    } catch (pollinationsError) {
        console.error("Pollinations fallback failed:", pollinationsError.message);
        throw new Error(`All AI providers failed. Last OpenRouter error: ${lastError?.message}`);
    }
}
