import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Search, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';

const Ordering = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  const { cart, addToCart, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await api.get('/menu/categories');
        setCategories(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory) params.category_id = selectedCategory;
        if (search) params.search = search;
        const response = await api.get('/menu/items', { params });
        setItems(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, [selectedCategory, search]);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (!user) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="space-y-12 pb-20 pt-10 px-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="text-center space-y-4">
        <span className="text-xs font-semibold tracking-widest text-amber-500 uppercase">Gourmet Delivery</span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">Order Online</h1>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"></div>
      </div>

      {/* Main Grid split: Menu (8 cols) and Mini-Cart (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Menu Items Area */}
        <div className="lg:col-span-8 space-y-8">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search dishes to add to your bag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-charcoal-900 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Categories Horizontal Slider */}
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-charcoal-800">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`py-2 px-5 rounded-full text-xs font-semibold border shrink-0 transition-all cursor-pointer ${
                selectedCategory === null
                  ? 'bg-amber-500 text-charcoal-950 border-amber-500 font-bold'
                  : 'bg-charcoal-900/50 border-white/10 text-gray-400 hover:border-amber-500/30'
              }`}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`py-2 px-5 rounded-full text-xs font-semibold border shrink-0 transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-charcoal-950 border-amber-500 font-bold'
                    : 'bg-charcoal-900/50 border-white/10 text-gray-400 hover:border-amber-500/30'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Grid list */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="glassmorphism p-12 text-center rounded-2xl border border-white/5">
              <p className="text-gray-400">No items match your selections.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {items.map((item) => (
                <div key={item.id} className="glassmorphism-card rounded-2xl overflow-hidden flex p-4 border border-white/5 gap-4 items-center">
                  <img
                    src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-grow space-y-1 min-w-0 text-left">
                    <h3 className="font-serif font-bold text-white text-sm truncate">{item.name}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{item.description}</p>
                    <p className="text-xs text-amber-500 font-semibold font-serif">${item.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => addToCart(item, 1)}
                    disabled={!item.is_available}
                    className="shrink-0 bg-amber-500 hover:bg-amber-600 disabled:bg-white/5 text-charcoal-950 disabled:text-gray-500 p-2 rounded-full transition-all cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Mini-Cart sidebar panel */}
        <div className="lg:col-span-4 sticky top-28 bg-charcoal-900 border border-white/10 rounded-3xl p-6 space-y-6">
          <div className="flex items-center space-x-2 border-b border-white/5 pb-4">
            <ShoppingBag className="h-5 w-5 text-amber-500" />
            <h2 className="font-serif text-lg font-bold text-white">Your Dining Bag</h2>
            <span className="bg-amber-500/10 text-amber-500 text-xs font-bold px-2 py-0.5 rounded-full ml-auto">
              {getCartCount()}
            </span>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12 text-gray-400 space-y-2">
              <ShoppingBag className="h-8 w-8 text-gray-600 mx-auto" />
              <p className="text-xs">Your bag is empty.</p>
              <p className="text-xs text-gray-500">Add delicious gourmet meals from the left list to begin.</p>
            </div>
          ) : (
            <div className="space-y-4 text-left">
              {/* Item lists */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {cart.map((cartItem) => (
                  <div key={cartItem.id} className="flex items-center space-x-3 text-xs border-b border-white/5 pb-3">
                    <img
                      src={cartItem.image_url}
                      alt={cartItem.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="flex-grow min-w-0">
                      <p className="font-semibold text-white truncate">{cartItem.name}</p>
                      <p className="text-[10px] text-amber-500 font-serif">${cartItem.price.toFixed(2)}</p>
                    </div>
                    {/* Quantity Adjustment */}
                    <div className="flex items-center space-x-1 border border-white/10 rounded-full py-0.5 px-1.5">
                      <button
                        onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                        className="text-gray-400 hover:text-white p-0.5 cursor-pointer"
                      >
                        <Minus className="h-2.5 w-2.5" />
                      </button>
                      <span className="text-[10px] font-semibold px-1 text-white">{cartItem.quantity}</span>
                      <button
                        onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                        className="text-gray-400 hover:text-white p-0.5 cursor-pointer"
                      >
                        <Plus className="h-2.5 w-2.5" />
                      </button>
                    </div>
                    {/* Delete */}
                    <button
                      onClick={() => removeFromCart(cartItem.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="space-y-2 pt-4 border-t border-white/5">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Delivery Fee</span>
                  <span className="text-white font-medium">Free</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white border-t border-white/5 pt-2 font-serif">
                  <span>Total Amount</span>
                  <span className="text-amber-500">${getCartTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-amber-500 to-gold-500 hover:from-amber-600 hover:to-gold-600 text-charcoal-950 font-bold py-3 rounded-xl text-center flex items-center justify-center space-x-2 transition-all transform active:scale-95 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ordering;
