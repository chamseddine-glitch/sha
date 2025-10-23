// This is a Vercel serverless function.
// It acts as a proxy to the jsonbin.io API for store settings.

const JSON_STORE_URL = 'https://api.jsonbin.io/v3/b/669ff422e41b4d34e416a5a8';
// IMPORTANT: Set JSONBIN_API_KEY in your Vercel project's Environment Variables.
const API_KEY = process.env.JSONBIN_API_KEY;

export default async function handler(req: any, res: any) {
    if (!API_KEY) {
        return res.status(500).json({ message: 'Server configuration error: JSONBIN_API_KEY is not set.' });
    }

    if (req.method === 'GET') {
        try {
            const response = await fetch(`${JSON_STORE_URL}/latest`, {
                headers: { 'X-Master-Key': API_KEY },
            });
            if (!response.ok) {
                 if (response.status === 404) {
                    // Bin is empty or not found, which is a valid state. Return null.
                    return res.status(200).json(null);
                }
                const errorText = await response.text();
                throw new Error(`Failed to fetch store data from jsonbin: ${response.statusText} - ${errorText}`);
            }
            const data = await response.json();
            return res.status(200).json(data.record);
        } catch (error: any) {
            console.error("Error fetching store data from jsonbin:", error);
            return res.status(500).json({ message: 'Failed to fetch store data.', error: error.message });
        }
    }

    if (req.method === 'PUT') {
        try {
            const storeData = req.body;
            const response = await fetch(JSON_STORE_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': API_KEY,
                },
                body: JSON.stringify(storeData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to publish store data to jsonbin: ${errorData.message || response.statusText}`);
            }
            const data = await response.json();
            return res.status(200).json(data);
        } catch (error: any) {
            console.error("Error publishing store data to jsonbin:", error);
            return res.status(500).json({ message: 'Failed to publish store data.', error: error.message });
        }
    }

    res.setHeader('Allow', ['GET', 'PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}
