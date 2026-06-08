import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, ShoppingCart, BookOpen, Layers, Calendar, 
  Users, BarChart3, FileSpreadsheet, Settings as SettingsIcon, LogOut, Home
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Overview', path: '/admin', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart className="h-5 w-5" /> },
    { name: 'Menu Management', path: '/admin/menu', icon: <BookOpen className="h-5 w-5" /> },
    { name: 'Categories', path: '/admin/categories', icon: <Layers className="h-5 w-5" /> },
    { name: 'Reservations', path: '/admin/reservations', icon: <Calendar className="h-5 w-5" /> },
    { name: 'Customers', path: '/admin/customers', icon: <Users className="h-5 w-5" /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <BarChart3 className="h-5 w-5" /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <FileSpreadsheet className="h-5 w-5" /> },
    { name: 'Reports', path: '/admin/reports', icon: <SettingsIcon className="h-5 w-5" /> },
    { name: 'Settings', path: '/admin/settings', icon: <SettingsIcon className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-charcoal-950 text-gray-200 flex flex-col md:flex-row text-left">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-charcoal-900 border-r border-white/5 flex flex-col shrink-0">
        {/* Branding header */}
        <div className="p-6 border-b border-white/5 flex items-center space-x-2">
          <div className="bg-amber-500 text-charcoal-950 p-1.5 rounded-lg font-bold text-xs uppercase font-serif">
            S
          </div>
          <span className="font-serif font-bold text-white text-md tracking-wider">Sowda Admin</span>
        </div>

        {/* Navigation lists */}
        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-charcoal-950 shadow-lg shadow-amber-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/5 space-y-1">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <Home className="h-4 w-4 text-gray-500" />
            <span>Store Front</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 w-full text-left transition-all"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Outlet Container */}
      <main className="flex-grow flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-charcoal-900 border-b border-white/5 flex items-center justify-between px-6 md:px-8 shrink-0">
          <h2 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">Management Dashboard</h2>
          
          <div className="flex items-center space-x-4">
            <span className="text-xs text-gray-500">Welcome back,</span>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white">{user?.name}</span>
              <div className="h-7 w-7 rounded-full bg-amber-500 text-charcoal-950 font-bold text-xs flex items-center justify-center">
                {user?.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Views panel */}
        <div className="flex-grow p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
