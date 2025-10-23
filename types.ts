
export interface ProductOption {
    name: string; // e.g., 'Color'
    values: string[]; // e.g., ['Red', 'Blue', 'Green']
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrls: string[];
    category: string; // e.g., 'Electronics', 'Accessories'
    options?: ProductOption[];
}

export interface CartItem {
    id: string;
    product: Product;
    quantity: number;
    selectedOptions: { [key: string]: string }; // e.g., { Color: 'Red', Size: 'M' }
}

export interface OrderDetails {
  name: string;
  phone: string;
  email: string;
  wilaya: string;
  commune: string;
  shippingMethod: 'home' | 'office';
  address?: string; // For detailed home delivery address
}

export interface PlacedOrder {
    id: string;
    createdAt: string;
    customer: OrderDetails;
    items: CartItem[];
    totalAmount: number;
}