import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { User, ShoppingBag, Calendar, Lock, Shield, Check, Clock } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'reservations', 'settings'

  // Update Profile States
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Fetch Order History & Bookings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, reservationsRes] = await Promise.all([
          api.get('/orders'),
          api.get('/reservations')
        ]);
        setOrders(ordersRes.data);
        setReservations(reservationsRes.data);
      } catch (err) {
        console.error("Failed to load profile data:", err);
      }
    };
    fetchData();
  }, []);

  // Set Profile form once user is loaded
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess(false);

    try {
      await updateProfile(profileForm.name, profileForm.email, profileForm.password);
      setProfileSuccess(true);
      setProfileForm(prev => ({ ...prev, password: '' }));
    } catch (err) {
      console.error(err);
      setProfileError(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const getStatusStep = (status) => {
    // Returns current step of order tracking
    // valid: pending -> paid -> cooking -> out_for_delivery -> completed
    const steps = ['pending', 'paid', 'cooking', 'out_for_delivery', 'completed'];
    return steps.indexOf(status);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20 pt-10 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <span className="text-xs font-semibold tracking-widest text-amber-500 uppercase">{t('profile.headerTag', 'My Account')}</span>
        <h1 className="text-4xl font-serif font-bold text-white">{t('profile.heading', 'Profile & History')}</h1>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"></div>
      </div>

      {/* Profile Overview Card */}
      {user && (
        <div className="glassmorphism rounded-3xl p-6 md:p-8 border border-white/5 flex flex-col md:flex-row items-center gap-6 max-w-3xl mx-auto">
          <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-amber-500 to-gold-500 flex items-center justify-center text-charcoal-950 font-serif font-bold text-3xl shadow-xl shadow-amber-500/10">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-center md:text-left space-y-1">
            <h2 className="text-2xl font-serif font-bold text-white">{user.name}</h2>
            <p className="text-sm text-gray-400">{user.email}</p>
            <div className="flex items-center justify-center md:justify-start space-x-2 pt-1.5">
              <span className="bg-amber-500/10 text-amber-500 text-xs font-semibold px-3 py-1 rounded-full border border-amber-500/20 capitalize">
                {t('profile.roleLabel', 'Role')}: {user.role}
              </span>
              <span className="text-xs text-gray-500">{t('profile.memberSince', 'Member since')} {new Date(user.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Controller */}
      <div className="flex justify-center border-b border-white/5 pb-px max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-4 text-center text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'border-amber-500 text-amber-500 font-bold'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-center space-x-1.5">
            <ShoppingBag className="h-4 w-4" />
            <span>{t('profile.ordersTab', 'Orders')} ({orders.length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('reservations')}
          className={`flex-1 py-4 text-center text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'reservations'
              ? 'border-amber-500 text-amber-500 font-bold'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-center space-x-1.5">
            <Calendar className="h-4 w-4" />
            <span>{t('profile.reservationsTab', 'Bookings')} ({reservations.length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-4 text-center text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'border-amber-500 text-amber-500 font-bold'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-center space-x-1.5">
            <Lock className="h-4 w-4" />
            <span>{t('profile.settingsTab', 'Settings')}</span>
          </div>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="max-w-4xl mx-auto">
        {/* PANEL 1: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="glassmorphism p-12 text-center rounded-3xl border border-white/5 space-y-4">
                <ShoppingBag className="h-10 w-10 text-gray-600 mx-auto" />
                <p className="text-sm text-gray-400 font-medium">{t('profile.noOrders', 'No order history found.')}</p>
                <Link to="/ordering" className="inline-block bg-amber-500 hover:bg-amber-600 text-charcoal-950 font-bold py-2 px-6 rounded-full text-xs">
                  {t('profile.placeFirstOrder', 'Place Your First Order')}
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="glassmorphism p-6 rounded-3xl border border-white/5 space-y-6 text-left">
                  {/* Order Headers */}
                  <div className="flex flex-wrap justify-between items-center gap-4 border-b border-white/5 pb-4">
                    <div>
                      <h3 className="font-serif font-bold text-white text-md">{t('profile.orderPrefix', 'Order #')}{order.id}</h3>
                      <p className="text-xs text-gray-500">{t('profile.orderedOn', 'Ordered on')} {new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{t('profile.totalPaid', 'Total Paid')}</p>
                      <p className="text-amber-500 font-serif font-bold text-lg">${order.total_amount.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2.5">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm text-gray-300">
                        <span>{item.menu_item_name} <span className="text-xs text-gray-500">× {item.quantity}</span></span>
                        <span className="font-serif">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Order Tracking Pipeline */}
                  {order.status !== 'cancelled' ? (
                    <div className="space-y-3 pt-4 border-t border-white/5">
                      <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">{t('profile.orderTracker', 'Live Order Tracker')}</p>
                      <div className="grid grid-cols-5 text-center text-[10px] md:text-xs text-gray-500 font-semibold gap-1 relative pt-2">
                        {/* Connecting Line */}
                        <div className="absolute top-[17px] left-[10%] right-[10%] h-0.5 bg-white/5 z-0"></div>
                        <div
                          className="absolute top-[17px] left-[10%] h-0.5 bg-amber-500 z-0 transition-all duration-500"
                          style={{
                            width: `${Math.min(100, Math.max(0, getStatusStep(order.status) * 25))}%`
                          }}
                        ></div>

                        {/* Steps */}
                        {['Placed', 'Paid', 'Cooking', 'On the Way', 'Delivered'].map((step, idx) => {
                          const orderStepIdx = getStatusStep(order.status);
                          const isActive = idx <= orderStepIdx;
                          const isCurrent = idx === orderStepIdx;
                          return (
                            <div key={idx} className="flex flex-col items-center z-10 space-y-2">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                isCurrent
                                  ? 'bg-amber-500 border-amber-500 text-charcoal-950 scale-110 font-bold'
                                  : isActive
                                    ? 'bg-charcoal-950 border-amber-500 text-amber-500'
                                    : 'bg-charcoal-950 border-white/10 text-gray-600'
                              }`}>
                                {isActive ? <Check className="h-3 w-3" /> : <span>{idx + 1}</span>}
                              </div>
                              <span className={isActive ? 'text-amber-500 font-bold' : ''}>{t(`profile.steps.${idx}`, step)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-xs font-semibold">
                      {t('profile.cancelledOrder', 'This order was cancelled.')}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* PANEL 2: RESERVATIONS */}
        {activeTab === 'reservations' && (
          <div className="space-y-6">
            {reservations.length === 0 ? (
              <div className="glassmorphism p-12 text-center rounded-3xl border border-white/5 space-y-4">
                <Calendar className="h-10 w-10 text-gray-600 mx-auto" />
                <p className="text-sm text-gray-400 font-medium">{t('profile.noBookings', 'No bookings found.')}</p>
                <Link to="/reservations" className="inline-block bg-amber-500 hover:bg-amber-600 text-charcoal-950 font-bold py-2 px-6 rounded-full text-xs">
                  {t('profile.bookATable', 'Book A Table')}
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reservations.map((res) => (
                  <div key={res.id} className="glassmorphism p-6 rounded-2xl border border-white/5 text-left space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <div>
                        <h4 className="font-serif font-bold text-white text-md">{t('profile.tableFor', 'Table for')} {res.party_size}</h4>
                        <p className="text-xs text-gray-500">{t('profile.requestedOn', 'Requested on')} {new Date(res.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className={`text-xs font-semibold tracking-wider px-3 py-1 rounded-full uppercase border ${
                        res.status === 'confirmed'
                          ? 'bg-green-500/10 border-green-500/20 text-green-400'
                          : res.status === 'cancelled'
                            ? 'bg-red-500/10 border-red-500/20 text-red-400'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                      }`}>
                        {res.status}
                      </span>
                    </div>

                    <div className="text-xs text-gray-400 space-y-1.5">
                      <p>{t('profile.reservedDate', 'Reserved Date')}: <span className="text-white font-medium">{res.date}</span></p>
                      <p>{t('profile.timeSlot', 'Time Slot')}: <span className="text-white font-medium">{res.time}</span></p>
                      {res.special_requests && (
                        <p className="line-clamp-2">{t('profile.requests', 'Requests')}: <span className="text-white font-medium italic">"{res.special_requests}"</span></p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PANEL 3: SETTINGS / PROFILE UPDATE */}
        {activeTab === 'settings' && (
          <form onSubmit={handleProfileSubmit} className="glassmorphism p-8 rounded-3xl border border-white/5 text-left space-y-6 max-w-xl mx-auto">
            <h3 className="font-serif text-xl font-bold text-white border-b border-white/5 pb-3 flex items-center space-x-2">
              <Shield className="h-5 w-5 text-amber-500" />
              <span>{t('profile.settingsTitle', 'Update Profile Credentials')}</span>
            </h3>

            {profileSuccess && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-sm">
                {t('profile.profileUpdated', 'Profile updated successfully.')}
              </div>
            )}

            {profileError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
                {profileError}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">{t('profile.nameLabel', 'Your Name')}</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">{t('profile.emailLabel', 'Email Address')}</label>
                <input
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">{t('profile.newPasswordLabel', 'New Password (optional)')}</label>
                <input
                  type="password"
                  value={profileForm.password}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder={t('profile.updatePasswordPlaceholder', 'Leave blank to keep current password')}
                  className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="w-full bg-gradient-to-r from-amber-500 to-gold-500 hover:from-amber-600 hover:to-gold-600 text-charcoal-950 font-bold py-3.5 rounded-xl transition-all cursor-pointer"
            >
              {profileLoading ? t('profile.savingChanges', 'Saving changes...') : t('profile.updateProfileButton', 'Save Changes')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
