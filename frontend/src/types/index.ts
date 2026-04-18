export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id?: string;
  category_name?: string;
  inventory_count: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface CartItem {
  id: string;
  quantity: number;
  product_id: string;
  name: string;
  price: number;
  image_url?: string;
  inventory_count: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}