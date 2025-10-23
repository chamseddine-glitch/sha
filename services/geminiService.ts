export const generateDescription = async (productName: string): Promise<string> => {
    try {
        const response = await fetch('/api/generate-description', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productName }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error from /api/generate-description:", errorData);
            throw new Error(errorData.message || 'Failed to generate description.');
        }

        const data = await response.json();
        return data.description;
    } catch (error) {
        console.error("Error calling description generation service:", error);
        return "فشل إنشاء الوصف. يرجى المحاولة مرة أخرى.";
    }
};
