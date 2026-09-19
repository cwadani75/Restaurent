import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserPlus, User, Mail, Lock, Phone, MapPin, ShieldAlert, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, login, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('register.passwordMismatch', 'Passwords do not match.'));
      return;
    }

    if (password.length < 6) {
      setError(t('register.passwordTooShort', 'Password must be at least 6 characters.'));
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, phone, address);
      // Automatically login after successful registration
      await login(email, password);
      navigate(redirect);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || t('register.registrationFailed', 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-charcoal-900 border border-white/10 p-8 md:p-10 rounded-3xl space-y-6 shadow-2xl relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,155,38,0.04)_0,transparent_70%)] pointer-events-none rounded-3xl"></div>

        {/* Header */}
        <div className="text-center space-y-2 relative z-10">
          <h1 className="font-serif text-3xl font-bold text-white">{t('register.heading', 'Create Account')}</h1>
          <p className="text-xs text-gray-400">{t('register.description', 'Sign up to place orders and book reservations instantly.')}</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs flex items-center space-x-2 relative z-10">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10 text-left">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">{t('register.nameLabel', 'Your Name')}</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('register.namePlaceholder', 'John Doe')}
                className="w-full bg-charcoal-950 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">{t('register.emailLabel', 'Email Address')}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('register.emailPlaceholder', 'john@example.com')}
                className="w-full bg-charcoal-950 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition-colors"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">{t('register.phoneLabel', 'Phone Number')}</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="tel"
                required
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('register.phonePlaceholder', '+254 7XX XXX XXX')}
                className="w-full bg-charcoal-950 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition-colors"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">{t('register.addressLabel', 'Delivery Address')}</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                required
                autoComplete="street-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t('register.addressPlaceholder', 'Street, City')}
                className="w-full bg-charcoal-950 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">{t('register.passwordLabel', 'Password')}</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('register.passwordPlaceholder', '••••••••')}
                className="w-full bg-charcoal-950 border border-white/10 rounded-xl pl-12 pr-11 py-3 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-500 transition-colors"
                aria-label={showPassword ? t('register.hidePassword', 'Hide password') : t('register.showPassword', 'Show password')}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">{t('register.confirmPasswordLabel', 'Confirm Password')}</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('register.confirmPasswordPlaceholder', '••••••••')}
                className="w-full bg-charcoal-950 border border-white/10 rounded-xl pl-12 pr-11 py-3 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-500 transition-colors"
                aria-label={showConfirmPassword ? t('register.hidePassword', 'Hide password') : t('register.showPassword', 'Show password')}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-gold-500 hover:from-amber-600 hover:to-gold-600 disabled:opacity-60 disabled:cursor-not-allowed text-charcoal-950 font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 transition-all transform active:scale-95 cursor-pointer mt-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-charcoal-950"></div>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                <span>{t('register.registerButton', 'Register Account')}</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-gray-400 pt-2 border-t border-white/5 relative z-10">
          {t('register.haveAccount', 'Already have an account?')}{' '}
          <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-amber-500 hover:underline font-semibold">
            {t('register.loginLink', 'Login Here')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
