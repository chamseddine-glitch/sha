// This is a Vercel serverless function.
// It acts as a proxy to the jsonbin.io API for orders.
import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { PlacedOrder } from '../types';

const JSON_ORDERS_URL = 'https://api.jsonbin.io/v3/b/66a18f48e41b4d34e416f48f';
// IMPORTANT: Set JSONBIN_API_KEY in your Vercel project's Environment Variables.
const API_KEY = process.env.JSONBIN_API_KEY;

// Helper to fetch current orders from jsonbin.io
const fetchCurrentOrders = async (): Promise<PlacedOrder[] | { error: true, status: number, message: string }> => {
    const response = await fetch(`${JSON_ORDERS_URL}/latest`, {
        headers: { 'X-Master-Key': API_KEY! },
    });
    if (!response.ok) {
        if (response.status === 404) {
            return []; // No orders yet is a valid state, return empty array.
        }
        const errorText = await response.text();
        return { error: true, status: response.status, message: `Failed to fetch orders from jsonbin: ${response.statusText} - ${errorText}` };
    }
    const data = await response.json();
    return data.record || [];
};

// Helper to update the entire order list on jsonbin.io
const updateOrdersOnBin = async (orders: PlacedOrder[] | []) => {
     const response = await fetch(JSON_ORDERS_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': API_KEY!,
        },
        body: JSON.stringify(orders),
    });
     if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update orders on jsonbin: ${response.status} ${response.statusText} - ${errorText}`);
    }
    return await response.json();
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (!API_KEY) {
        return res.status(500).json({ message: 'Server configuration error: JSONBIN_API_KEY is not set.' });
    }

    try {
        switch (req.method) {
            case 'GET': {
                const orders = await fetchCurrentOrders();
                if (Array.isArray(orders)) {
                    return res.status(200).json(orders);
                }
                // Handle fetch error
                if (orders.status === 401) return res.status(500).json({ message: 'Authentication failed. Check your JSONBIN_API_KEY.' });
                return res.status(502).json({ message: orders.message });
            }
            
            case 'POST': { // For placing a new order
                const orderData = req.body;
                const currentOrdersResult = await fetchCurrentOrders();

                if (!Array.isArray(currentOrdersResult)) {
                     if (currentOrdersResult.status === 401) return res.status(500).json({ message: 'Authentication failed. Check your JSONBIN_API_KEY.' });
                     return res.status(502).json({ message: currentOrdersResult.message });
                }

                const newOrder: PlacedOrder = {
                    ...orderData,
                    id: new Date().toISOString()
                };
                const updatedOrders = [...currentOrdersResult, newOrder];
                const result = await updateOrdersOnBin(updatedOrders);
                return res.status(201).json(result);
            }

            case 'DELETE': { // For clearing all orders
                const result = await updateOrdersOnBin([]);
                return res.status(200).json(result);
            }

            default:
                res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
                return res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error: any) {
        console.error(`Error in /api/orders (${req.method}):`, error.message);
        if (error.message.includes('401')) {
            return res.status(500).json({ message: 'Authentication failed. Check your JSONBIN_API_KEY.' });
        }
        return res.status(500).json({ message: 'An internal server error occurred.', error: error.message });
    }
}