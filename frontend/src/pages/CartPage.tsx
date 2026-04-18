import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage: React.FC = () => {
  const { cart, loading, updateItem, removeItem } = useCart();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cart.items.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Looks like you haven't added any items yet.
          </p>
          <Link
            to="/products"
            className="magnetic-btn bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-full font-semibold inline-flex items-center gap-2"
          >
            Start Shopping <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
                {/* Product Image */}
                <div className="w-full sm:w-24 h-32 sm:h-24 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden flex-shrink-0">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      No img
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <Link to={`/products/${item.product_id}`} className="font-semibold text-lg hover:text-primary-500 transition-colors">
                    {item.name}
                  </Link>
                  <p className="text-xl font-bold mt-1">${Number(item.price).toFixed(2)}</p>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
                      <button
                        onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateItem(item.id, Math.min(item.inventory_count, item.quantity + 1))}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-600 p-2 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="font-bold text-lg">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                  <span className="font-semibold">${cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Shipping</span>
                  <span className="font-semibold text-green-500">Free</span>
                </div>
                <hr className="border-gray-200 dark:border-gray-700" />
                <div className="flex justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">${cart.total.toFixed(2)}</span>
                </div>
              </div>

              {user ? (
                <Link
                  to="/checkout"
                  className="magnetic-btn w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </Link>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login?redirect=checkout"
                    className="block w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-semibold text-center transition-colors"
                  >
                    Sign In to Checkout
                  </Link>
                  <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    or{' '}
                    <Link to="/register" className="text-primary-500 hover:underline">
                      create an account
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;