import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ProductDetail() {
  const { id } = useParams(); // Grabs the product ID from the URL
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://ecomm-backend-7rs6.onrender.com/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const res = await fetch('https://ecomm-backend-7rs6.onrender.com/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          productId: id // Attach the product ID to the lead
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      setSuccessMessage(data.message || 'Success! The team will get in touch with you quickly.');
      setFormData({ customerName: '', customerEmail: '', customerPhone: '' }); // Clear form
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="text-center mt-20 text-gray-500">Loading product details...</div>;
  if (!product) return <div className="text-center mt-20 text-red-500">{errorMessage || 'Product not found'}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans">
      <div className="max-w-5xl mx-auto">
        <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium mb-6 inline-block">
          &larr; Back to Store
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Column: Product Image */}
          <div className="md:w-1/2 bg-gray-100">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover min-h-[300px] md:min-h-[500px]"
            />
          </div>

          {/* Right Column: Details & Form */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{product.category}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center space-x-4 mb-6">
              {product.discountPrice ? (
                <>
                  <span className="text-3xl font-bold text-red-600">₹{product.discountPrice}</span>
                  <span className="text-xl text-gray-400 line-through">₹{product.price}</span>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
              )}
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description || "No description provided."}
            </p>

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-900 mb-2">Available Sizes/Variants:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-md text-sm text-gray-700">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <hr className="mb-8 border-gray-200" />

            {/* Buy Form */}
            <h3 className="text-xl font-bold text-gray-900 mb-4">Interested? Request to Buy</h3>
            
            {successMessage ? (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
                <p className="text-green-700 font-medium">{successMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                
                <div>
                  <input 
                    type="text" name="customerName" placeholder="Your Full Name" required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.customerName} onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input 
                    type="email" name="customerEmail" placeholder="Email Address" required
                    className="w-full sm:w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.customerEmail} onChange={handleInputChange}
                  />
                  <input 
                    type="tel" name="customerPhone" placeholder="Phone Number" required
                    className="w-full sm:w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.customerPhone} onChange={handleInputChange}
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full text-white font-bold py-4 rounded-lg transition-colors text-lg ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-black shadow-lg hover:shadow-xl'}`}
                >
                  {isSubmitting ? 'Sending Request...' : 'Submit Buy Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}