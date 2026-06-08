import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, Menu, X, Utensils, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginMenu, setShowLoginMenu] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide navbar on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Menu', path: '/menu' },
    { name: 'Order Online', path: '/ordering' },
    { name: 'Reservations', path: '/reservations' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 glassmorphism border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center space-x-2">
        <div className="bg-gradient-to-r from-amber-500 to-gold-500 p-2 rounded-lg">
          <Utensils className="h-5 w-5 text-charcoal-950" />
        </div>
        <span className="font-serif text-xl font-bold tracking-widest text-white hover:text-amber-500 transition-colors">
          Sowda restaurent
        </span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center space-x-8">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `text-sm font-medium tracking-wide uppercase transition-colors hover:text-amber-500 ${
                isActive ? 'text-amber-500 font-semibold border-b-2 border-amber-500 pb-1' : 'text-gray-300'
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </div>

      {/* Utilities / Profile Section */}
      <div className="hidden lg:flex items-center space-x-6">
        {/* Cart Icon */}
        <Link to="/cart" className="relative p-2 text-gray-300 hover:text-amber-500 transition-colors">
          <ShoppingCart className="h-6 w-6" />
          {getCartCount() > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-500 text-charcoal-950 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
              {getCartCount()}
            </span>
          )}
        </Link>

        {/* User Menu */}
        <div className="relative">
          {user ? (
            <div>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 text-gray-300 hover:text-amber-500 transition-colors py-2 px-3 rounded-full hover:bg-white/5"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-500 to-gold-500 flex items-center justify-center text-charcoal-950 font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium max-w-[100px] truncate">{user.name}</span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-charcoal-900 border border-white/10 shadow-2xl p-2 z-50">
                  <div className="px-4 py-2 border-b border-white/5 mb-1">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                  </div>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center space-x-2 w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-amber-600/20 rounded-lg transition-all"
                    >
                      <LayoutDashboard className="h-4 w-4 text-amber-500" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center space-x-2 w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    <User className="h-4 w-4 text-gray-400" />
                    <span>My Profile & Orders</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-all mt-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => {
                    setShowLoginMenu(!showLoginMenu);
                    setShowDropdown(false);
                  }}
                  className="text-sm font-medium text-gray-300 hover:text-amber-500 transition-colors px-4 py-2 rounded-full border border-white/10 hover:bg-white/5"
                >
                  Login
                </button>

                {showLoginMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-3xl bg-charcoal-900 border border-white/10 shadow-2xl overflow-hidden z-50">
                    <Link
                      to="/login"
                      onClick={() => setShowLoginMenu(false)}
                      className="block px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                    >
                      User Login
                    </Link>
                    <Link
                      to="/admin/login"
                      onClick={() => setShowLoginMenu(false)}
                      className="block px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                    >
                      Admin Login
                    </Link>
                  </div>
                )}
              </div>

              <Link
                to="/register"
                className="text-sm font-semibold text-amber-500 hover:text-amber-400 transition-colors px-4 py-2 rounded-full border border-amber-500 hover:bg-amber-500/10"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden text-gray-300 hover:text-amber-500 transition-colors p-2 rounded-full border border-white/10"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-charcoal-950 border-t border-white/10 shadow-2xl z-40">
          <div className="flex flex-col px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium uppercase tracking-wide text-gray-300 hover:text-amber-500 py-3 border-b border-white/10"
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-white/10 pt-4 space-y-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block text-sm text-gray-300 hover:text-amber-500"
              >
                User Login
              </Link>
              <Link
                to="/admin/login"
                onClick={() => setIsOpen(false)}
                className="block text-sm text-gray-300 hover:text-amber-500"
              >
                Admin Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block text-sm text-amber-500 font-semibold"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
