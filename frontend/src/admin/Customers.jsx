import { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, RefreshCw } from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/customers');
      setCustomers(response.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Unable to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <h1 className="font-serif text-2xl font-bold text-white flex items-center space-x-2">
          <Users className="h-6 w-6 text-amber-500" />
          <span>Customers</span>
        </h1>
        <button
          onClick={loadCustomers}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : customers.length === 0 ? (
        <div className="glassmorphism p-12 text-center rounded-2xl border border-white/5">
          <p className="text-gray-400">No customers have registered yet.</p>
        </div>
      ) : (
        <div className="bg-charcoal-900 border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-400">
              <thead className="bg-charcoal-950 text-gray-500 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-3.5 rounded-l-xl">Name</th>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5 text-center">Orders</th>
                  <th className="px-6 py-3.5 text-center">Total Spent</th>
                  <th className="px-6 py-3.5 text-right rounded-r-xl">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">{customer.name}</td>
                    <td className="px-6 py-4 text-gray-300 truncate max-w-[240px]">{customer.email}</td>
                    <td className="px-6 py-4 text-center">{customer.order_count}</td>
                    <td className="px-6 py-4 text-center font-serif text-white">${customer.total_spent.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-gray-400">{new Date(customer.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
