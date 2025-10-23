// This service simulates connecting to a simple key-value/JSON hosting service like jsonbin.io.
// It allows the store data to be fetched by all users and updated by the admin,
// creating a dynamic experience without a traditional backend.
import type { PlacedOrder } from '../types';

// The URL points to a specific 'bin' or 'document' where the store's JSON data is stored.
const JSON_STORE_URL = 'https://api.jsonbin.io/v3/b/669ff422e41b4d34e416a5a8';
const JSON_ORDERS_URL = 'https://api.jsonbin.io/v3/b/66a18f48e41b4d34e416f48f';

// The API Key is used to get permission to read and write to the bin.
// In a real-world scenario, this should be handled securely.
const API_KEY = '$2a$10$wS.B/i5OrT2fU5rTNg4ALO.8o9i4GPx8WH2BFjExoYma9x2uIZ1S2';

/**
 * Fetches the latest version of the store data from the cloud service.
 * This is called by all users when they load the site.
 */
export const fetchStoreData = async (): Promise<any | null> => {
    try {
        const response = await fetch(`${JSON_STORE_URL}/latest`, {
            headers: {
                'X-Master-Key': API_KEY,
            },
        });
        
        if (!response.ok) {
            if (response.status === 404) {
                console.warn('Store data bin is empty or not found. Using default values.');
                return null;
            }
            throw new Error(`Failed to fetch store data: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.record;
    } catch (error) {
        console.error("Error fetching store data:", error);
        throw error;
    }
};

/**
 * Publishes the new store data to the cloud service.
 * This is called by the admin when they click the "Publish" button.
 */
export const publishStoreData = async (storeData: any): Promise<any> => {
    try {
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
            throw new Error(`Failed to publish store data: ${errorData.message || response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("Error publishing store data:", error);
        throw error;
    }
};


/**
 * Fetches the list of all placed orders. For admin use.
 */
export const fetchOrders = async (): Promise<PlacedOrder[]> => {
    try {
        const response = await fetch(`${JSON_ORDERS_URL}/latest`, {
            headers: {
                'X-Master-Key': API_KEY,
            },
        });
        if (!response.ok) {
            if (response.status === 404) {
                return []; // No orders yet, return empty array
            }
            throw new Error(`Failed to fetch orders: ${response.statusText}`);
        }
        const data = await response.json();
        return data.record || [];
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};

/**
 * Places a new order by adding it to the list of existing orders.
 */
export const placeOrder = async (orderData: Omit<PlacedOrder, 'id'>): Promise<any> => {
    try {
        // Fetch the current list of orders
        const currentOrders = await fetchOrders();
        
        // Add the new order with a generated ID
        const newOrder: PlacedOrder = {
            ...orderData,
            id: new Date().toISOString()
        };
        const updatedOrders = [...currentOrders, newOrder];

        // PUT the entire updated list back
        const response = await fetch(JSON_ORDERS_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY,
            },
            body: JSON.stringify(updatedOrders),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to place order: ${errorData.message || response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("Error placing order:", error);
        throw error;
    }
};

/**
 * Clears all orders from the list. For admin use.
 */
export const clearOrders = async (): Promise<any> => {
     try {
        // Overwrite the bin with an empty array
        const response = await fetch(JSON_ORDERS_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY,
            },
            body: JSON.stringify([]),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to clear orders: ${errorData.message || response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("Error clearing orders:", error);
        throw error;
    }
};