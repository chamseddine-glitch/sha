// This is a Vercel serverless function to securely call the Gemini API.
import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

// IMPORTANT: Set GEMINI_API_KEY in your Vercel project's Environment Variables.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        const prompt = `اكتب وصفًا قصيرًا ومقنعًا واحترافيًا لمنتج يسمى "${productName}" باللغة العربية. ركز على فوائده الرئيسية ونقاط البيع الفريدة. اجعله أقل من 40 كلمة واستخدم نبرة حماسية.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const text = response.text;
        
        if (text) {
            return res.status(200).json({ description: text.trim() });
        }
        
        console.warn("Gemini API returned a response without text content.", response);
        return res.status(500).json({ message: 'Failed to generate description from AI service.' });

    } catch (error: any) {
        console.error("Error calling Gemini API:", JSON.stringify(error, null, 2));
        let message = 'An unknown error occurred with the AI service.';
        // Check for specific error messages from the Gemini API
        if (error.message && typeof error.message === 'string') {
            if (error.message.includes('API key not valid')) {
                message = 'Authentication failed. Please check your GEMINI_API_KEY environment variable.';
            } else if (error.message.toLowerCase().includes('quota')) {
                message = 'AI service quota exceeded. Please check your billing or try again later.';
            }
        }
        return res.status(500).json({ message: message, error: error.message });
    }
}