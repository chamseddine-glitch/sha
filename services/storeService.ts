// This service now communicates with our own serverless functions,
// which act as a secure proxy to the JSON storage service.
import type { PlacedOrder } from '../types';

const STORE_API_ENDPOINT = '/api/store';
const ORDERS_API_ENDPOINT = '/api/orders';

// A helper function to create rich error messages from API responses.
const createApiError = async (response: Response, defaultMessage: string): Promise<Error> => {
    let errorMessage = defaultMessage;
    try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
    } catch (e) {
        // Response body was not JSON or was empty.
        errorMessage = `${defaultMessage} (Status: ${response.status} ${response.statusText})`;
    }
    return new Error(errorMessage);
};

/**
 * Fetches the latest version of the store data from our serverless function.
 */
export const fetchStoreData = async (): Promise<any | null> => {
    try {
        const response = await fetch(STORE_API_ENDPOINT);
        if (!response.ok) {
            throw await createApiError(response, 'Failed to fetch store data.');
        }
        // Handle cases where the bin is empty and the API returns an empty response.
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    } catch (error) {
        console.error("Error fetching store data:", error);
        throw error;
    }
};

/**
 * Publishes the new store data via our serverless function.
 */
export const publishStoreData = async (storeData: any): Promise<any> => {
    try {
        const response = await fetch(STORE_API_ENDPOINT, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(storeData),
        });

        if (!response.ok) {
            throw await createApiError(response, 'Failed to publish store data.');
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
        const response = await fetch(ORDERS_API_ENDPOINT);
        if (!response.ok) {
            throw await createApiError(response, 'Failed to fetch orders.');
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};

/**
 * Places a new order by posting it to our serverless function.
 */
export const placeOrder = async (orderData: Omit<PlacedOrder, 'id'>): Promise<any> => {
    try {
        const response = await fetch(ORDERS_API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
           throw await createApiError(response, 'Failed to place order.');
        }
        return await response.json();
    } catch (error)
    {
        console.error("Error placing order:", error);
        throw error;
    }
};

/**
 * Clears all orders from the list. For admin use.
 */
export const clearOrders = async (): Promise<any> => {
     try {
        const response = await fetch(ORDERS_API_ENDPOINT, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw await createApiError(response, 'Failed to clear orders.');
        }
        
        return await response.json();
    } catch (error) {
        console.error("Error clearing orders:", error);
        throw error;
    }
};