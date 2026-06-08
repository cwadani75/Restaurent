import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { CreditCard, Truck, ShoppingBag, Phone, MapPin, CheckCircle, ArrowLeft } from 'lucide-react';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    order_type: 'delivery', // delivery or pickup
    delivery_address: '',
    payment_method: 'card', // card or cash
    card_number: '',
    card_expiry: '',
    card_cvc: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (cart.length === 0 && !success) {
      navigate('/menu');
    }
  }, [cart, success, navigate]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Prepare API items payload
    const apiItems = cart.map(item => ({
      menu_item_id: item.id,
      quantity: item.quantity
    }));

    const payload = {
      items: apiItems,
      phone: formData.phone,
      order_type: formData.order_type,
      delivery_address: formData.order_type === 'delivery' ? formData.delivery_address : null,
      payment_method: formData.payment_method
    };

    try {
      // If card payment, simulate a 2.5 second gateway authorization delay
      if (formData.payment_method === 'card') {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      const response = await api.post('/orders', payload);
      setPlacedOrder(response.data.order);
      clearCart();
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'An error occurred during checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success && placedOrder) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 px-6 space-y-6">
        <div className="bg-green-500/10 text-green-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-xl">
          <CheckCircle className="h-10 w-10" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-white">Order Confirmed!</h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto">
          Thank you for dining with Sowda restaurent. Your order <span className="text-white font-medium">#{placedOrder.id}</span> has been received and is currently being prepared by our master chefs.
        </p>

        <div className="glassmorphism p-6 rounded-2xl border border-white/5 text-left space-y-4 max-w-md mx-auto">
          <h3 className="font-serif font-bold text-white text-md border-b border-white/5 pb-2">Order Summary</h3>
          <div className="text-xs text-gray-400 space-y-1">
            <p>Order Status: <span className="text-amber-500 font-semibold uppercase">{placedOrder.status}</span></p>
            <p>Preparation Type: <span className="text-white font-medium capitalize">{placedOrder.order_type}</span></p>
            {placedOrder.delivery_address && <p>Address: <span className="text-white font-medium">{placedOrder.delivery_address}</span></p>}
            <p>Total Paid: <span className="text-amber-500 font-bold font-serif">${placedOrder.total_amount.toFixed(2)}</span></p>
          </div>
        </div>

        <div className="pt-4 flex justify-center space-x-4">
          <Link
            to="/profile"
            className="bg-amber-500 hover:bg-amber-600 text-charcoal-950 font-bold py-3 px-6 rounded-full transition-all"
          >
            Track My Order
          </Link>
          <Link
            to="/"
            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 py-3 px-6 rounded-full transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 pt-10 px-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="text-center space-y-4">
        <span className="text-xs font-semibold tracking-widest text-amber-500 uppercase">Finalize Dining</span>
        <h1 className="text-4xl font-serif font-bold text-white">Secure Checkout</h1>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Checkout Form */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit} className="glassmorphism p-8 md:p-10 rounded-3xl border border-white/5 space-y-8 text-left">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Delivery Details */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-white border-b border-white/5 pb-2">1. Delivery Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Recipient Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+33 6 1234 5678"
                    className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Order Type</label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, order_type: 'delivery' }))}
                      className={`flex-1 py-3 border rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                        formData.order_type === 'delivery'
                          ? 'border-amber-500 text-amber-500 bg-amber-500/5'
                          : 'border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <Truck className="h-4 w-4" />
                      <span className="text-sm font-semibold">Home Delivery</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, order_type: 'pickup' }))}
                      className={`flex-1 py-3 border rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                        formData.order_type === 'pickup'
                          ? 'border-amber-500 text-amber-500 bg-amber-500/5'
                          : 'border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span className="text-sm font-semibold">Restaurant Pickup</span>
                    </button>
                  </div>
                </div>

                {formData.order_type === 'delivery' && (
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Delivery Address</label>
                    <textarea
                      name="delivery_address"
                      required
                      rows="3"
                      value={formData.delivery_address}
                      onChange={handleChange}
                      placeholder="Street address, Apartment/Suite, Postal Code, Paris"
                      className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
                    ></textarea>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-white border-b border-white/5 pb-2">2. Settlement Method</h3>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, payment_method: 'card' }))}
                  className={`flex-1 py-3 border rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    formData.payment_method === 'card'
                      ? 'border-amber-500 text-amber-500 bg-amber-500/5'
                      : 'border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span className="text-sm font-semibold">Credit/Debit Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, payment_method: 'cash' }))}
                  className={`flex-1 py-3 border rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    formData.payment_method === 'cash'
                      ? 'border-amber-500 text-amber-500 bg-amber-500/5'
                      : 'border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-semibold">
                    {formData.order_type === 'delivery' ? 'Cash on Delivery' : 'Pay at Counter'}
                  </span>
                </button>
              </div>

              {formData.payment_method === 'card' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Card Number</label>
                    <input
                      type="text"
                      name="card_number"
                      required
                      value={formData.card_number}
                      onChange={handleChange}
                      placeholder="4000 1234 5678 9010"
                      className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Expiration</label>
                    <input
                      type="text"
                      name="card_expiry"
                      required
                      value={formData.card_expiry}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors text-center"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">CVC Code</label>
                    <input
                      type="password"
                      name="card_cvc"
                      required
                      value={formData.card_cvc}
                      onChange={handleChange}
                      placeholder="•••"
                      maxLength="4"
                      className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors text-center"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-gold-500 hover:from-amber-600 hover:to-gold-600 text-charcoal-950 font-bold py-4 rounded-xl flex items-center justify-center space-x-2 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-charcoal-950"></div>
                  <span>Authorizing Card Payment...</span>
                </div>
              ) : (
                <span>Place Order & Pay ${getCartTotal().toFixed(2)}</span>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-charcoal-900 border border-white/10 rounded-3xl p-6 space-y-6 text-left">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <h3 className="font-serif text-xl font-bold text-white">Gourmet Bag</h3>
            <Link to="/cart" className="text-xs text-amber-500 hover:underline flex items-center space-x-1">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Modify</span>
            </Link>
          </div>

          {/* Items List */}
          <div className="space-y-4 max-h-[250px] overflow-y-auto pr-1 divide-y divide-white/5">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between text-xs pt-3">
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate">{item.name}</p>
                  <p className="text-gray-400">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                </div>
                <span className="font-serif font-semibold text-amber-500 shrink-0 ml-4">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Pricing breakdown */}
          <div className="space-y-3 pt-4 border-t border-white/5 text-xs text-gray-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-white font-medium">${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>VAT (10%)</span>
              <span className="text-white font-medium">${(getCartTotal() * 0.1).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white border-t border-white/5 pt-2 font-serif">
              <span>Grand Total</span>
              <span className="text-amber-500">${(getCartTotal() * 1.1).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
