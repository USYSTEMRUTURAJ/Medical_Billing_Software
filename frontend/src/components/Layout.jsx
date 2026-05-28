import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Users, Truck, LogOut, Settings, UserCog } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Layout = () => {
  const { userInfo, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'POS / Billing', icon: ShoppingCart, path: '/pos' },
    { name: 'Inventory', icon: Package, path: '/inventory' },
    { name: 'Customers', icon: Users, path: '/customers' },
    { name: 'Suppliers', icon: Truck, path: '/suppliers' },
    ...(userInfo?.role === 'Admin' ? [{ name: 'Staff Management', icon: UserCog, path: '/staff' }] : []),
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-primary-900 text-white flex flex-col transition-all duration-300 shadow-xl">
        <div className="p-6 flex items-center justify-center border-b border-primary-800">
          <div className="flex items-center gap-2">
            <div className="bg-primary-500 p-2 rounded-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-wider">PharmaPro</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-primary-100 hover:bg-primary-800 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-primary-800">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-primary-800 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center font-bold">
              {userInfo?.name?.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold truncate w-32">{userInfo?.name}</span>
              <span className="text-xs text-primary-200">{userInfo?.role}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">
            Welcome back, {userInfo?.name?.split(' ')[0]}
          </h2>
        </header>

        <div className="flex-1 overflow-auto p-8 bg-gray-50/50">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
