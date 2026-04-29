const extractHtml = (aiResponse) => {
    if (!aiResponse) return null;

    // Strip ANSI/terminal escape sequences (e.g. \e[0m, \e[1;32m)
    let cleaned = aiResponse
        .replace(/\x1B\[[0-9;]*[A-Za-z]/g, '')   // CSI sequences
        .replace(/\x1B\][^\x07]*\x07/g, '')        // OSC sequences
        .replace(/\x1B./g, '');                    // Any remaining ESC chars

    // If wrapped in a markdown code block, extract only that block (most precise)
    const codeBlockMatch = cleaned.match(/```(?:html)?\s*(<!DOCTYPE html>[\s\S]*?<\/html>)\s*```/i);
    if (codeBlockMatch) {
        return codeBlockMatch[1].trim();
    }

    // Otherwise strip stray code fence markers and search for HTML
    cleaned = cleaned.replace(/```(?:html)?/gi, '').replace(/```/g, '');

    const htmlMatch = cleaned.match(/<!DOCTYPE html>[\s\S]*<\/html>/i);
    if (!htmlMatch) return null;

    const html = htmlMatch[0].trim();

    // Must be a real production HTML file: has head, body close, CSS styles, and real content
    if (
        html.length < 500 ||
        !/<\/body>/i.test(html) ||
        !/<style[\s>]/i.test(html) ||
        !/<\/head>/i.test(html)
    ) return null;

    return html;
};

export default extractHtml;
