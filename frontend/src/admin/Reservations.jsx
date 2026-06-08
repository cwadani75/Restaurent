import { useState, useEffect } from 'react';
import api from '../services/api';
import { Calendar, RefreshCw } from 'lucide-react';

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadReservations = async () => {
    setLoading(true);
    try {
      const response = await api.get('/reservations');
      setReservations(response.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Unable to load reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.put(`/reservations/${id}/status`, { status });
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Unable to update reservation status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <h1 className="font-serif text-2xl font-bold text-white flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-amber-500" />
          <span>Reservations</span>
        </h1>
        <button
          onClick={loadReservations}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : reservations.length === 0 ? (
        <div className="glassmorphism p-12 text-center rounded-2xl border border-white/5">
          <p className="text-gray-400">No reservation requests have been submitted yet.</p>
        </div>
      ) : (
        <div className="bg-charcoal-900 border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-400">
              <thead className="bg-charcoal-950 text-gray-500 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-3.5 rounded-l-xl">#</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Date / Time</th>
                  <th className="px-6 py-3.5 text-center">Party</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                  <th className="px-6 py-3.5 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">#{reservation.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-white">{reservation.name}</p>
                      <p className="text-[10px] text-gray-500">{reservation.email} · {reservation.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p>{reservation.date}</p>
                      <p className="text-gray-500 text-[10px]">{reservation.time}</p>
                    </td>
                    <td className="px-6 py-4 text-center">{reservation.party_size}</td>
                    <td className="px-6 py-4 text-center uppercase font-semibold text-sm">
                      <span className={`px-2.5 py-1 rounded-full border text-[10px] ${
                        reservation.status === 'confirmed'
                          ? 'bg-green-500/10 border-green-500/20 text-green-400'
                          : reservation.status === 'cancelled'
                          ? 'bg-red-500/10 border-red-500/20 text-red-400'
                          : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                      }`}>
                        {reservation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={reservation.status}
                        onChange={(e) => handleStatusChange(reservation.id, e.target.value)}
                        disabled={updatingId === reservation.id}
                        className="bg-charcoal-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none w-full"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
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

export default AdminReservations;
