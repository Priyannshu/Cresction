import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart, CartItem } from '../types';
import { cartAPI } from '../services/api';

interface CartContextType {
  cart: Cart;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity: number) => Promise<{ error?: string }>;
  updateItem: (itemId: string, quantity: number) => Promise<{ error?: string }>;
  removeItem: (itemId: string) => Promise<{ error?: string }>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await cartAPI.get();
      setCart(response.data.cart);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productId: string, quantity: number) => {
    try {
      await cartAPI.addItem(productId, quantity);
      await fetchCart();
      return {};
    } catch (err: any) {
      return { error: err.response?.data?.error || 'Failed to add item' };
    }
  };

  const updateItem = async (itemId: string, quantity: number) => {
    try {
      await cartAPI.updateItem(itemId, quantity);
      await fetchCart();
      return {};
    } catch (err: any) {
      return { error: err.response?.data?.error || 'Failed to update item' };
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await cartAPI.removeItem(itemId);
      await fetchCart();
      return {};
    } catch (err: any) {
      return { error: err.response?.data?.error || 'Failed to remove item' };
    }
  };

  const clearCart = () => {
    setCart({ items: [], total: 0 });
  };

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addItem, updateItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};