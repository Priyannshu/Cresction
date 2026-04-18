import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shipping, setShipping] = useState({
    address: '',
    city: '',
    postal_code: '',
    country: '',
    payment_method: 'credit_card',
  });

  if (!user) {
    return <Navigate to="/login?redirect=checkout" />;
  }

  if (cart.items.length === 0 && !success) {
    return <Navigate to="/cart" />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call to order service
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      clearCart();
      // In real app, we would call order service to create order
    }, 2000);
  };

  if (success) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="glass rounded-2xl p-12 max-w-lg mx-auto">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Thank you for your purchase. Your order is being processed and will be shipped soon.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="magnetic-btn bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-full font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/cart')}
        className="mb-6 flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Cart
      </button>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipping Information */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={shipping.address}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                    placeholder="123 Main St"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={shipping.city}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Postal Code</label>
                  <input
                    type="text"
                    name="postal_code"
                    value={shipping.postal_code}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                    placeholder="10001"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={shipping.country}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                    placeholder="United States"
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCard size={24} /> Payment Method
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="credit_card"
                    name="payment_method"
                    value="credit_card"
                    checked={shipping.payment_method === 'credit_card'}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-500"
                  />
                  <label htmlFor="credit_card" className="font-medium">Credit Card</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="paypal"
                    name="payment_method"
                    value="paypal"
                    checked={shipping.payment_method === 'paypal'}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-500"
                  />
                  <label htmlFor="paypal" className="font-medium">PayPal</label>
                </div>
                {/* Add more payment options as needed */}
              </div>

              {shipping.payment_method === 'credit_card' && (
                <div className="mt-4 p-4 border border-gray-300 dark:border-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    (Demo: No real payment will be processed. This is a simulation.)
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full magnetic-btn bg-primary-500 hover:bg-primary-600 disabled:opacity-70 text-white py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                'Processing...'
              ) : (
                <>Place Order • ${cart.total.toFixed(2)}</>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass rounded-2xl p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Subtotal ({cart.items.length} items)</span>
                <span className="font-semibold">${cart.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Shipping</span>
                <span className="font-semibold text-green-500">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Tax</span>
                <span className="font-semibold">$0.00</span>
              </div>
              <hr className="border-gray-200 dark:border-gray-700" />
              <div className="flex justify-between text-lg">
                <span className="font-bold">Total</span>
                <span className="font-bold">${cart.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;