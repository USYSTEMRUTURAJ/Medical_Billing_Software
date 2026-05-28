import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';

import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import POS from './pages/POS';
import Customers from './pages/Customers';
import Suppliers from './pages/Suppliers';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children }) => {
  const userInfo = useAuthStore((state) => state.userInfo);
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="pos" element={<POS />} />
          <Route path="customers" element={<Customers />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
