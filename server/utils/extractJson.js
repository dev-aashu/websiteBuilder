const extractJson = async (text) => {
    if (!text) {
        return null;
    }
    const cleaned = text.
         replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    const firstBrace = cleaned.indexOf('{');
    const closeBrace = cleaned.lastIndexOf('}');
    
    if (firstBrace === -1 || closeBrace === -1) {
        return null;
    }
    
    const jsonString = cleaned.slice(firstBrace, closeBrace + 1);
    
    try {
        const parsed = JSON.parse(jsonString);
        return parsed;
    } catch (e) {
        console.error("Failed to parse AI JSON response:", e.message);
        return null;
    }
}

export default extractJson