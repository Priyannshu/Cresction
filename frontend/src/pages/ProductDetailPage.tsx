import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Check } from 'lucide-react';
import { productsAPI } from '../services/api';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const response = await productsAPI.getById(id);
        setProduct(response.data.product);
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    const result = await addItem(product.id, quantity);
    setAdding(false);
    if (result.error) {
      setMessage(result.error);
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage('Added to cart!');
      setTimeout(() => {
        setMessage(null);
        navigate('/cart');
      }, 1000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
              <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <button
          onClick={() => navigate('/products')}
          className="text-primary-500 hover:underline flex items-center gap-1 mx-auto"
        >
          <ArrowLeft size={16} /> Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/products')}
        className="mb-6 flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="glass rounded-2xl overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-auto object-contain max-h-[500px]"
            />
          ) : (
            <div className="h-96 flex items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-500">
              No image
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {product.category_name && (
            <span className="text-sm uppercase tracking-wider text-primary-500 font-semibold">
              {product.category_name}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            ${Number(product.price).toFixed(2)}
          </p>

          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description || 'No description available.'}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Availability: {product.inventory_count > 0 ? (
                <span className="text-green-500 font-medium">In Stock ({product.inventory_count})</span>
              ) : (
                <span className="text-red-500 font-medium">Out of Stock</span>
              )}
            </p>
          </div>

          {product.inventory_count > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.inventory_count}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(product.inventory_count, Math.max(1, Number(e.target.value))))}
                  className="w-16 text-center bg-transparent border-x border-gray-300 dark:border-gray-700 py-2 focus:outline-none"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.inventory_count, quantity + 1))}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="magnetic-btn bg-primary-500 hover:bg-primary-600 disabled:opacity-70 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2"
              >
                {adding ? (
                  'Adding...'
                ) : message ? (
                  <>
                    <Check size={20} /> {message}
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} /> Add to Cart
                  </>
                )}
              </button>
            </div>
          )}

          {message && !message.includes('Added') && (
            <p className="text-red-500 text-sm">{message}</p>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold mb-2">Features</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Premium quality product</li>
              <li>• Fast and reliable shipping</li>
              <li>• 30-day return policy</li>
              <li>• Secure checkout</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;