// This is a Vercel serverless function to securely call the Gemini API.

// IMPORTANT: Set GEMINI_API_KEY in your Vercel project's Environment Variables.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    if (!GEMINI_API_KEY) {
        return res.status(500).json({ message: 'Server configuration error: GEMINI_API_KEY is not set.' });
    }

    const { productName } = req.body;
    if (!productName) {
        return res.status(400).json({ message: 'productName is required in the request body.' });
    }

    try {
        const prompt = `اكتب وصفًا قصيرًا ومقنعًا واحترافيًا لمنتج يسمى "${productName}" باللغة العربية. ركز على فوائده الرئيسية ونقاط البيع الفريدة. اجعله أقل من 40 كلمة واستخدم نبرة حماسية.`;
        
        const apiResponse = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!apiResponse.ok) {
            const errorBody = await apiResponse.json();
            console.error("Gemini API Error:", errorBody);
            throw new Error(errorBody.error.message || 'Gemini API request failed');
        }

        const data = await apiResponse.json();
        
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (text) {
            return res.status(200).json({ description: text.trim() });
        }
        
        console.warn("Gemini API returned a response without text content.", data);
        return res.status(500).json({ message: 'Failed to generate description from API.' });

    } catch (error: any) {
        console.error("Error calling Gemini API via fetch:", error);
        return res.status(500).json({ message: 'Error calling Gemini API.', error: error.message });
    }
}
