import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const [adding, setAdding] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.inventory_count <= 0) return;
    setAdding(true);
    const result = await addItem(product.id, 1);
    setAdding(false);
    if (result.error) {
      setMessage('Failed');
      setTimeout(() => setMessage(null), 2000);
    } else {
      setMessage('Added!');
      setTimeout(() => setMessage(null), 2000);
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card glass rounded-2xl overflow-hidden block">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
        {product.inventory_count <= 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        {product.category_name && (
          <span className="text-xs uppercase tracking-wider text-primary-500 font-semibold">
            {product.category_name}
          </span>
        )}
        <h3 className="text-lg font-semibold mt-1 mb-2 line-clamp-2">{product.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            ${Number(product.price).toFixed(2)}
          </span>
          {product.inventory_count > 0 && (
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="magnetic-btn bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-full flex items-center justify-center"
            >
              <ShoppingCart size={18} />
            </button>
          )}
        </div>
        {message && (
          <div className={`mt-2 text-sm ${message === 'Added!' ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;