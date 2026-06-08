import { useState, useEffect } from 'react';
import api from '../services/api';
import { FileSpreadsheet, Download, RefreshCw } from 'lucide-react';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const loadReports = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/reports/export');
      setData(response.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Unable to load reports');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sowda_reports_${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center space-x-2">
            <FileSpreadsheet className="h-6 w-6 text-amber-500" />
            <span>Reports</span>
          </h1>
          <p className="text-sm text-gray-400">Export order and reservation data for bookkeeping or backup.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadReports}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={downloadReport}
            disabled={!data}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-charcoal-950 font-semibold py-2 px-4 rounded-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            Download JSON
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 gap-6">
          <div className="glassmorphism p-6 rounded-3xl border border-white/5">
            <p className="text-sm text-gray-400">Orders exported: {data.orders.length}</p>
            <p className="text-sm text-gray-400">Reservations exported: {data.reservations.length}</p>
          </div>
          <div className="bg-charcoal-900 border border-white/5 rounded-3xl p-6 space-y-4">
            <h2 className="font-semibold text-white">Recent Orders</h2>
            <div className="space-y-3 text-xs text-gray-400 max-h-[280px] overflow-y-auto">
              {data.orders.slice(0, 5).map(order => (
                <div key={order.id} className="bg-white/5 p-3 rounded-2xl">
                  <p className="font-semibold text-white">Order #{order.id}</p>
                  <p>Amount: ${order.total_amount.toFixed(2)}</p>
                  <p>Status: {order.status}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-charcoal-900 border border-white/5 rounded-3xl p-6 space-y-4">
            <h2 className="font-semibold text-white">Recent Reservations</h2>
            <div className="space-y-3 text-xs text-gray-400 max-h-[280px] overflow-y-auto">
              {data.reservations.slice(0, 5).map(res => (
                <div key={res.id} className="bg-white/5 p-3 rounded-2xl">
                  <p className="font-semibold text-white">Reservation #{res.id}</p>
                  <p>{res.name} · {res.party_size} guests</p>
                  <p>{res.date} {res.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="glassmorphism p-12 rounded-3xl border border-white/5 text-center text-gray-400">
          Unable to load report data.
        </div>
      )}
    </div>
  );
};

export default Reports;
