import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { DollarSign, ShoppingBag, Calendar, Users, TrendingUp, Sparkles, LayoutDashboard } from 'lucide-react';

const Overview = () => {
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_orders: 0,
    total_reservations: 0,
    total_customers: 0
  });
  const [popularDishes, setPopularDishes] = useState([]);
  const [salesChartData, setSalesChartData] = useState([]);
  const [categoryChartData, setCategoryChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, salesChartRes, categoryChartRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/charts/sales'),
          api.get('/admin/charts/categories')
        ]);
        setStats(statsRes.data.stats);
        setPopularDishes(statsRes.data.popular_dishes);
        setSalesChartData(salesChartRes.data);
        setCategoryChartData(categoryChartRes.data);
      } catch (err) {
        console.error("Failed to load dashboard overview data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const kpis = [
    {
      label: "Total Sales",
      value: `$${stats.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <DollarSign className="h-6 w-6 text-amber-500" />,
      desc: "Gross revenue logs"
    },
    {
      label: "Total Orders",
      value: stats.total_orders,
      icon: <ShoppingBag className="h-6 w-6 text-amber-500" />,
      desc: "Placed food orders"
    },
    {
      label: "Table Reservations",
      value: stats.total_reservations,
      icon: <Calendar className="h-6 w-6 text-amber-500" />,
      desc: "Total booked seats"
    },
    {
      label: "Registered Customers",
      value: stats.total_customers,
      icon: <Users className="h-6 w-6 text-amber-500" />,
      desc: "Unique accounts created"
    }
  ];

  const PIE_COLORS = ['#d99b26', '#b97d19', '#8c5b0f', '#66410a'];

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <h1 className="font-serif text-2xl font-bold text-white flex items-center space-x-2">
          <LayoutDashboard className="h-6 w-6 text-amber-500" />
          <span>Dashboard Overview</span>
        </h1>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="glassmorphism p-6 rounded-2xl border border-white/5 flex items-center space-x-4">
            <div className="bg-amber-500/10 p-3 rounded-xl">
              {kpi.icon}
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold tracking-wider uppercase">{kpi.label}</p>
              <h3 className="text-xl font-serif font-bold text-white pt-1">{kpi.value}</h3>
              <p className="text-[10px] text-gray-400">{kpi.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sales Trend Line/Area Chart */}
        <div className="lg:col-span-8 bg-charcoal-900 border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-lg font-bold text-white flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-amber-500" />
              <span>Gourmet Sales Trend (7 Days)</span>
            </h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesChartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d99b26" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#d99b26" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0d0d12', borderColor: 'rgba(255,255,255,0.1)' }}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#d99b26" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" name="Sales ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category breakdown (Pie Chart) */}
        <div className="lg:col-span-4 bg-charcoal-900 border border-white/5 rounded-2xl p-6 flex flex-col space-y-4">
          <h3 className="font-serif text-lg font-bold text-white flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Category Share</span>
          </h3>
          <div className="h-56 w-full flex justify-center items-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d0d12', borderColor: 'rgba(255,255,255,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 pt-2 border-t border-white/5">
            {categoryChartData.map((cat, idx) => (
              <div key={cat.name} className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}></span>
                <span className="truncate">{cat.name}: {cat.value} items</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Dishes Table */}
      <div className="bg-charcoal-900 border border-white/5 rounded-2xl p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-white">Top 5 Best-Selling Dishes</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-charcoal-950 text-xs font-semibold text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-3 rounded-l-xl">Dish Name</th>
                <th className="px-6 py-3 text-center">Dishes Sold</th>
                <th className="px-6 py-3 text-center">Unit Price</th>
                <th className="px-6 py-3 text-right rounded-r-xl">Est. Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {popularDishes.map((dish, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-semibold text-white">{dish.name}</td>
                  <td className="px-6 py-4 text-center">{dish.total_sold} units</td>
                  <td className="px-6 py-4 text-center font-serif">${dish.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right font-serif font-bold text-amber-500">
                    ${(dish.price * dish.total_sold).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;
