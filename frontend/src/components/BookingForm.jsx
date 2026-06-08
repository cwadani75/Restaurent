import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Calendar, Users, Clock, MessageSquare, Send, CheckCircle } from 'lucide-react';

const BookingForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    party_size: '2',
    special_requests: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Prefill details if user is logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const timeSlots = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.time) {
      setError('Please select a time slot.');
      setLoading(false);
      return;
    }

    try {
      await api.post('/reservations', formData);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'An error occurred while booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="glassmorphism rounded-3xl p-8 text-center max-w-xl mx-auto border border-amber-500/20">
        <div className="bg-amber-500/10 text-amber-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-white mb-2">Reservation Requested!</h3>
        <p className="text-gray-400 mb-6 leading-relaxed">
          Thank you, <span className="text-white font-medium">{formData.name}</span>. We have received your booking request for <span className="text-white font-medium">{formData.party_size} guests</span> on <span className="text-white font-medium">{formData.date}</span> at <span className="text-white font-medium">{formData.time}</span>.
        </p>
        <div className="bg-charcoal-900 border border-white/5 p-4 rounded-xl text-left space-y-2 mb-6">
          <p className="text-xs text-gray-500">Note: All bookings are initial pending requests. Our host team will verify availability and confirm your reservation via email shortly.</p>
        </div>
        <button
          onClick={() => {
            setSuccess(false);
            setFormData({
              name: user?.name || '',
              email: user?.email || '',
              phone: '',
              date: '',
              time: '',
              party_size: '2',
              special_requests: '',
            });
          }}
          className="bg-amber-500 hover:bg-amber-600 text-charcoal-950 font-bold py-2.5 px-6 rounded-full transition-all cursor-pointer"
        >
          Book Another Table
        </button>
      </div>
    );
  }

  return (
    <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1514432324607-2e467f4af445?w=1200&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.3) blur(1px)'
        }}
      ></div>

      {/* Glassmorphic Overlay */}
      <div className="absolute inset-0 bg-charcoal-900/70 backdrop-blur-md z-10"></div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="relative z-20 p-8 md:p-10 space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Your Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Phone */}
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

          {/* Party Size */}
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase flex items-center space-x-1">
              <Users className="h-3 w-3 text-amber-500" />
              <span>Guests</span>
            </label>
            <select
              name="party_size"
              value={formData.party_size}
              onChange={handleChange}
              className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                <option key={size} value={size}>
                  {size} {size === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase flex items-center space-x-1">
              <Calendar className="h-3 w-3 text-amber-500" />
              <span>Date</span>
            </label>
            <input
              type="date"
              name="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={formData.date}
              onChange={handleChange}
              className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Time Slot Header */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase flex items-center space-x-1">
              <Clock className="h-3 w-3 text-amber-500" />
              <span>Preferred Time Slot</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {timeSlots.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setFormData((prev) => ({ ...prev, time: slot }))}
                  className={`py-2 px-3 text-sm rounded-lg border transition-all cursor-pointer ${
                    formData.time === slot
                      ? 'bg-amber-500 text-charcoal-950 border-amber-500 font-bold'
                      : 'bg-charcoal-900 border-white/10 text-gray-300 hover:border-amber-500/50 hover:text-white'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Special Requests */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase flex items-center space-x-1">
              <MessageSquare className="h-3 w-3 text-amber-500" />
              <span>Special Requests</span>
            </label>
            <textarea
              name="special_requests"
              rows="3"
              value={formData.special_requests}
              onChange={handleChange}
              placeholder="Please mention any dietary requirements, allergies, or table location preferences (e.g. window side, quiet booth)."
              className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-500 to-gold-500 hover:from-amber-600 hover:to-gold-600 text-charcoal-950 font-bold py-4 rounded-xl flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-charcoal-950"></div>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Confirm Booking Request</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
