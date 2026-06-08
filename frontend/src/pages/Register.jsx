import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock, ShieldAlert } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register, login, user } = useAuth();
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
    setLoading(true);
    setError('');

    try {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }

      await register(name, email, password);
      // Automatically login after successful registration
      await login(email, password);
      navigate(redirect);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
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
          <h1 className="font-serif text-3xl font-bold text-white">Create Account</h1>
          <p className="text-xs text-gray-400">Sign up to place orders and book reservations instantly</p>
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
            <label className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Your Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-505" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-charcoal-950 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-505" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full bg-charcoal-950 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-505" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-charcoal-950 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-505" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-charcoal-950 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-gold-500 hover:from-amber-600 hover:to-gold-600 text-charcoal-950 font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 transition-all transform active:scale-95 cursor-pointer mt-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-charcoal-950"></div>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                <span>Register Account</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-gray-400 pt-2 border-t border-white/5 relative z-10">
          Already have an account?{' '}
          <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-amber-500 hover:underline font-semibold">
            Login Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
