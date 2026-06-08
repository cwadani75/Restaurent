import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, Mail, Lock } from 'lucide-react';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      await updateProfile(name, email, password);
      setMessage('Profile updated successfully.');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm text-gray-400">Update your admin account details and secure the dashboard access.</p>
        </div>
      </div>

      <div className="bg-charcoal-900 border border-white/5 rounded-3xl p-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-6 text-gray-300">
          <ShieldCheck className="h-5 w-5 text-amber-500" />
          <p className="text-sm">Your admin login controls the Sowda dashboard and all order/reservation management.</p>
        </div>

        {message && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 p-4 rounded-xl">{message}</div>}
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-xl">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-widest text-gray-500">Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-charcoal-950 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-widest text-gray-500">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-charcoal-950 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-widest text-gray-500">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
                className="w-full bg-charcoal-950 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-amber-500 hover:bg-amber-600 text-charcoal-950 font-bold py-3 rounded-xl transition-colors disabled:opacity-70"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
