import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Shield, Truck, RefreshCw } from 'lucide-react';
import { productsAPI } from '../services/api';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await productsAPI.getAll({ limit: 4 });
        setFeaturedProducts(response.data.products);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 via-white to-secondary-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Discover Premium Style
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Explore our curated collection of high-quality products. Experience shopping redefined with seamless microservices architecture.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="magnetic-btn bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-full font-semibold text-lg flex items-center justify-center gap-2"
            >
              Shop Now <ArrowRight size={20} />
            </Link>
            <Link
              to="/register"
              className="magnetic-btn border-2 border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950 px-8 py-3 rounded-full font-semibold text-lg"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl glass">
              <ShoppingBag className="w-12 h-12 text-primary-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Premium Selection</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Curated collection of top-quality products
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl glass">
              <Truck className="w-12 h-12 text-primary-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Quick and reliable shipping worldwide
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl glass">
              <Shield className="w-12 h-12 text-primary-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Protected payments and secure checkout
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-primary-500 hover:text-primary-600 flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass rounded-2xl h-80 animate-pulse bg-gray-200 dark:bg-gray-800" />
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No products available</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 text-primary-100 max-w-2xl mx-auto">
            Join thousands of satisfied customers and experience the Cresction difference.
          </p>
          <Link
            to="/register"
            className="magnetic-btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold text-lg inline-flex items-center gap-2"
          >
            Create Free Account <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;