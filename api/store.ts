// This is a Vercel serverless function.
// It acts as a proxy to the jsonbin.io API for store settings.
import type { VercelRequest, VercelResponse } from '@vercel/node';

const JSON_STORE_URL = 'https://api.jsonbin.io/v3/b/669ff422e41b4d34e416a5a8';
// IMPORTANT: Set JSONBIN_API_KEY in your Vercel project's Environment Variables.
const API_KEY = process.env.JSONBIN_API_KEY;

const handleFetchError = (res: VercelResponse, response: Response, errorText: string) => {
    if (response.status === 401) {
        return res.status(500).json({ message: 'Authentication failed. Please check your JSONBIN_API_KEY environment variable.' });
    }
    if (response.status === 429) {
        return res.status(429).json({ message: 'API rate limit exceeded for storage service. Please try again later.' });
    }
    console.error(`jsonbin.io error (${response.status}): ${errorText}`);
    return res.status(502).json({ message: `Failed to communicate with storage service: ${response.statusText}` });
};


export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (!API_KEY) {
        return res.status(500).json({ message: 'Server configuration error: JSONBIN_API_KEY is not set.' });
    }

    try {
        if (req.method === 'GET') {
            const response = await fetch(`${JSON_STORE_URL}/latest`, {
                headers: { 'X-Master-Key': API_KEY },
            });
            
            if (!response.ok) {
                 if (response.status === 404) {
                    // Bin is empty or not found, a valid state.
                    return res.status(200).json(null);
                }
                const errorText = await response.text();
                return handleFetchError(res, response, errorText);
            }

            const data = await response.json();
            return res.status(200).json(data.record);
        }

        if (req.method === 'PUT') {
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
                const errorText = await response.text();
                return handleFetchError(res, response, errorText);
            }
            
            const data = await response.json();
            return res.status(200).json(data);
        }

        res.setHeader('Allow', ['GET', 'PUT']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    } catch (error: any) {
        console.error(`Error in /api/store (${req.method}):`, error);
        return res.status(500).json({ message: 'An internal server error occurred.', error: error.message });
    }
}