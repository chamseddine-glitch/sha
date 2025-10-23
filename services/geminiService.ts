
import { GoogleGenAI } from "@google/genai";

export const generateDescription = async (productName: string): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `اكتب وصفًا قصيرًا ومقنعًا واحترافيًا لمنتج يسمى "${productName}" باللغة العربية. ركز على فوائده الرئيسية ونقاط البيع الفريدة. اجعله أقل من 40 كلمة واستخدم نبرة حماسية.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        // Fix: Add robust checking for the response text to prevent potential errors.
        const text = response.text;
        if (text) {
            return text.trim();
        }
        
        console.warn("Gemini API returned a response without text content.");
        return "فشل إنشاء الوصف. يرجى المحاولة مرة أخرى.";
    } catch (error) {
        console.error("Error generating description with Gemini API:", error);
        return "فشل إنشاء الوصف. يرجى المحاولة مرة أخرى.";
    }
};
