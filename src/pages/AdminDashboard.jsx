import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [products, setProducts] = useState([]);
  const [leads, setLeads] = useState([]);
  const navigate = useNavigate();

  // Form state for new products
  const [newProduct, setNewProduct] = useState({
    name: '', category: 'perfume', description: '', sizes: '', price: '', discountPrice: '', imageUrl: ''
  });

  const token = localStorage.getItem('adminToken');

  // Fetch data when component loads
  useEffect(() => {
    fetchProducts();
    fetchLeads();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('https://ecomm-backend-7rs6.onrender.com/api/products');
    const data = await res.json();
    setProducts(data);
  };

  const fetchLeads = async () => {
    try {
      const res = await fetch('https://ecomm-backend-7rs6.onrender.com/api/leads', {
        headers: { 
          'Authorization': `Bearer ${token}` // <-- We must send the token!
        }
      });
      const data = await res.json();
      
      // Safety check: ensure data is actually an array before setting it
      if (Array.isArray(data)) {
        setLeads(data);
      } else {
        console.error("Backend returned an error instead of leads:", data);
        setLeads([]); // Fallback to empty array to prevent page crash
      }
    } catch (err) {
      console.error("Failed to fetch leads:", err);
      setLeads([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    // Convert sizes string (e.g., "8, 9, 10") to an array
    const productData = {
      ...newProduct,
      sizes: newProduct.sizes.split(',').map(s => s.trim()),
      price: Number(newProduct.price),
      discountPrice: newProduct.discountPrice ? Number(newProduct.discountPrice) : null,
    };

    await fetch('https://ecomm-backend-7rs6.onrender.com/api/products', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(productData)
    });

    // Reset form and refresh list
    setNewProduct({ name: '', category: 'perfume', description: '', sizes: '', price: '', discountPrice: '', imageUrl: '' });
    fetchProducts();
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    await fetch(`https://ecomm-backend-7rs6.onrender.com/api/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Top Navigation */}
      <nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-lg">
        <h1 className="text-xl font-bold tracking-wider">Admin Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-semibold transition">
          Logout
        </button>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b pb-2">
          <button 
            className={`font-semibold px-4 py-2 rounded-t-lg transition ${activeTab === 'inventory' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setActiveTab('inventory')}
          >
            Inventory Management
          </button>
          <button 
            className={`font-semibold px-4 py-2 rounded-t-lg transition ${activeTab === 'leads' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setActiveTab('leads')}
          >
            Customer Leads
          </button>
        </div>

        {/* INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Add Product Form */}
            <div className="bg-white p-6 rounded-lg shadow-md col-span-1 h-fit">
              <h2 className="text-lg font-bold mb-4">Add New Product</h2>
              <form onSubmit={handleAddProduct} className="space-y-3">
                <input type="text" placeholder="Product Name" required className="w-full border p-2 rounded" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                
                <select className="w-full border p-2 rounded" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                  <option value="perfume">Perfume</option>
                  <option value="shoes">Shoes</option>
                  <option value="watches">Watches</option>
                </select>

                <textarea placeholder="Description" className="w-full border p-2 rounded" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                
                <input type="text" placeholder="Sizes (comma separated, e.g., 8, 9, 10)" className="w-full border p-2 rounded" value={newProduct.sizes} onChange={e => setNewProduct({...newProduct, sizes: e.target.value})} />
                
                <div className="flex space-x-2">
                  <input type="number" placeholder="Price" required className="w-1/2 border p-2 rounded" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                  <input type="number" placeholder="Discount Price" className="w-1/2 border p-2 rounded" value={newProduct.discountPrice} onChange={e => setNewProduct({...newProduct, discountPrice: e.target.value})} />
                </div>

                <input type="text" placeholder="Image URL (e.g., https://...)" required className="w-full border p-2 rounded" value={newProduct.imageUrl} onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})} />

                <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700 transition">Add Product</button>
              </form>
            </div>

            {/* Product List */}
            <div className="bg-white p-6 rounded-lg shadow-md col-span-2">
              <h2 className="text-lg font-bold mb-4">Current Inventory</h2>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {products.map(product => (
                  <div key={product._id} className="flex justify-between items-center border-b pb-3">
                    <div className="flex items-center space-x-4">
                      <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded shadow-sm" />
                      <div>
                        <p className="font-bold">{product.name} <span className="text-xs text-gray-500 uppercase ml-2 bg-gray-100 px-2 py-1 rounded">{product.category}</span></p>
                        <p className="text-sm text-gray-600">Price: ₹{product.price} {product.discountPrice && <span className="text-green-600 font-semibold">(Sale: ₹{product.discountPrice})</span>}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteProduct(product._id)} className="text-red-500 hover:text-red-700 font-bold p-2">
                      Delete
                    </button>
                  </div>
                ))}
                {products.length === 0 && <p className="text-gray-500">No products added yet.</p>}
              </div>
            </div>
          </div>
        )}

        {/* LEADS TAB */}
        {activeTab === 'leads' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Customer Leads</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="p-3 font-semibold rounded-tl-lg">Customer</th>
                    <th className="p-3 font-semibold">Contact Info</th>
                    <th className="p-3 font-semibold">Interested In</th>
                    <th className="p-3 font-semibold rounded-tr-lg">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(lead => (
                    <tr key={lead._id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-3 font-medium">{lead.customerName}</td>
                      <td className="p-3">
                        <div>{lead.customerPhone}</div>
                        <div className="text-sm text-gray-500">{lead.customerEmail}</div>
                      </td>
                      <td className="p-3">
                        {lead.productId ? (
                          <div className="flex items-center space-x-2">
                            <img src={lead.productId.imageUrl} alt="product" className="w-8 h-8 rounded object-cover" />
                            <span>{lead.productId.name}</span>
                          </div>
                        ) : (
                          <span className="text-red-500">Product Deleted</span>
                        )}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-4 text-center text-gray-500">No leads yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}