import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// We will build these next!
import Storefront from './pages/Storefront';
import ProductDetail from './pages/ProductDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// A simple protector wrapper to check if your friend is logged in
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  // If no token exists, kick them back to the login page
  if (!token) return <Navigate to="/admin" />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Customer Routes */}
        <Route path="/" element={<Storefront />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        
        {/* Wrapped in ProtectedRoute so strangers can't access it */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;