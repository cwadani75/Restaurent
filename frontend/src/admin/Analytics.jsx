import { useState, useEffect } from 'react';
import api from '../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Sparkles, BarChart3 } from 'lucide-react';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const [statsRes, salesRes, categoryRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/charts/sales'),
          api.get('/admin/charts/categories')
        ]);
        setStats(statsRes.data.stats);
        setSalesData(salesRes.data);
        setCategoryData(categoryRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const COLORS = ['#d99b26', '#b97d19', '#8c5b0f', '#66410a'];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white">Analytics</h1>
          <p className="text-sm text-gray-400">Live performance metrics for orders, revenue, and category demand.</p>
        </div>
      </div>

      {loading || !stats ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Revenue', value: `$${stats.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: <TrendingUp className="h-5 w-5 text-amber-500" />, note: 'Gross sales value' },
              { label: 'Orders', value: stats.total_orders, icon: <Sparkles className="h-5 w-5 text-amber-500" />, note: 'All orders received' },
              { label: 'Reservations', value: stats.total_reservations, icon: <BarChart3 className="h-5 w-5 text-amber-500" />, note: 'Booked tables' }
            ].map((item) => (
              <div key={item.label} className="glassmorphism p-6 rounded-3xl border border-white/5 flex items-start gap-4">
                <div className="bg-amber-500/10 p-3 rounded-2xl">{item.icon}</div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-400">{item.label}</p>
                  <p className="text-2xl font-serif font-bold text-white mt-2">{item.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.note}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-charcoal-900 border border-white/5 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-white">Sales Trend</h2>
                <span className="text-xs uppercase tracking-widest text-gray-500">Last 7 days</span>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData} margin={{ top: 0, right: 0, left: -16, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d99b26" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#d99b26" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} />
                    <YAxis stroke="#9ca3af" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0d0d12', borderColor: 'rgba(255,255,255,0.1)' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#d99b26" strokeWidth={2} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-white/5 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-white">Category Share</h2>
                <span className="text-xs uppercase tracking-widest text-gray-500">Orders by category</span>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={5}>
                      {categoryData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0d0d12', borderColor: 'rgba(255,255,255,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-1 gap-2 text-xs text-gray-400 mt-4">
                {categoryData.map((entry, idx) => (
                  <div key={entry.name} className="flex items-center justify-between">
                    <span>{entry.name}</span>
                    <span>{entry.value} orders</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
