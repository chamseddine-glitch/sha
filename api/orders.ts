// This is a Vercel serverless function.
// It acts as a proxy to the jsonbin.io API for orders.
import type { PlacedOrder } from '../types';

const JSON_ORDERS_URL = 'https://api.jsonbin.io/v3/b/66a18f48e41b4d34e416f48f';
// IMPORTANT: Set JSONBIN_API_KEY in your Vercel project's Environment Variables.
const API_KEY = process.env.JSONBIN_API_KEY;

// Helper to fetch current orders from jsonbin.io
const fetchCurrentOrders = async (): Promise<PlacedOrder[]> => {
    const response = await fetch(`${JSON_ORDERS_URL}/latest`, {
        headers: { 'X-Master-Key': API_KEY! },
    });
    if (!response.ok) {
        if (response.status === 404) {
            return []; // No orders yet is a valid state, return empty array.
        }
        const errorText = await response.text();
        throw new Error(`Failed to fetch orders from jsonbin: ${response.statusText} - ${errorText}`);
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
        const errorData = await response.json();
        throw new Error(`Failed to update orders on jsonbin: ${errorData.message || response.statusText}`);
    }
    return await response.json();
};

export default async function handler(req: any, res: any) {
    if (!API_KEY) {
        return res.status(500).json({ message: 'Server configuration error: JSONBIN_API_KEY is not set.' });
    }

    try {
        switch (req.method) {
            case 'GET': {
                const orders = await fetchCurrentOrders();
                return res.status(200).json(orders);
            }
            
            case 'POST': { // For placing a new order
                const orderData = req.body;
                const currentOrders = await fetchCurrentOrders();
                const newOrder: PlacedOrder = {
                    ...orderData,
                    id: new Date().toISOString()
                };
                const updatedOrders = [...currentOrders, newOrder];
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
        console.error(`Error in /api/orders (${req.method}):`, error);
        return res.status(500).json({ message: 'An internal server error occurred.', error: error.message });
    }
}
