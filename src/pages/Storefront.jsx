import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Storefront() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('perfume');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://ecomm-backend-7rs6.onrender.com/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on the selected tab
  const filteredProducts = products.filter(
    (product) => product.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Store Header */}
      <header className="bg-white shadow-sm py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Choice Collections
          </h1>
          <p className="mt-2 text-gray-500">Discover our exclusive selection</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Category Tabs */}
        <div className="flex justify-center space-x-2 md:space-x-8 mb-10 border-b pb-4">
          {['perfume', 'shoes', 'watches'].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`text-lg font-medium capitalize px-4 py-2 transition-colors duration-200 ${
                activeCategory === category
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="text-center text-gray-500 mt-20">Loading collections...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="h-64 overflow-hidden bg-gray-100">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                    <div className="flex items-center space-x-3 mb-4">
                      {product.discountPrice ? (
                        <>
                          <span className="text-2xl font-bold text-red-600">₹{product.discountPrice}</span>
                          <span className="text-lg text-gray-400 line-through">₹{product.price}</span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                      )}
                    </div>
                    {/* Link to the Product Details Page */}
                    <Link
                      to={`/product/${product._id}`}
                      className="block w-full text-center bg-gray-900 text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 mt-10">
                No items currently available in this category.
              </div>
            )}
          </div>
        )}
      </main>
      {/* Simple Footer */}
<footer className="bg-gray-900 text-white py-8 mt-12">
  <div className="max-w-6xl mx-auto px-4 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
    
    <div className="mb-4 md:mb-0">
      <h2 className="text-xl font-bold tracking-wider mb-2">Choice Collections</h2>
      <p className="text-gray-400 text-sm">Elevate your style with our curated selection.</p>
    </div>

    <div className="flex space-x-6 text-sm text-gray-400">
      <a href="#" className="hover:text-white transition">Privacy Policy</a>
      <a href="#" className="hover:text-white transition">Terms of Service</a>
      <a href="#" className="hover:text-white transition">Contact Us</a>
    </div>

  </div>
  <div className="text-center text-gray-500 text-sm mt-8 border-t border-gray-800 pt-4">
    &copy; {new Date().getFullYear()} Choice Collections. All rights reserved.
  </div>
</footer>
    </div>
  );
}