import { useState, useEffect } from 'react';
import api from '../services/api';
import { ShoppingBag, Search, Eye, Filter, RefreshCw, Check } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  
  // Modal State for viewing order items
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      // Reload list or update state locally
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status. " + (err.response?.data?.error || ""));
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toString().includes(search) || 
      (order.user_name && order.user_name.toLowerCase().includes(search.toLowerCase())) ||
      (order.phone && order.phone.includes(search));
      
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 border-green-500/20 text-green-400';
      case 'cancelled': return 'bg-red-500/10 border-red-500/20 text-red-400';
      case 'cooking': return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      case 'out_for_delivery': return 'bg-purple-500/10 border-purple-500/20 text-purple-400';
      case 'paid': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      default: return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <h1 className="font-serif text-2xl font-bold text-white flex items-center space-x-2">
          <ShoppingBag className="h-6 w-6 text-amber-500" />
          <span>Manage Orders</span>
        </h1>
        <button
          onClick={loadOrders}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Filter Options */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-charcoal-900 border border-white/5 p-4 rounded-xl items-center">
        {/* Search */}
        <div className="md:col-span-8 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer Name, or Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-charcoal-950 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="md:col-span-4 relative flex items-center space-x-2 bg-charcoal-950 border border-white/10 px-3 py-2 rounded-lg">
          <Filter className="h-4 w-4 text-amber-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-xs text-gray-300 focus:outline-none cursor-pointer w-full"
          >
            <option value="all" className="bg-charcoal-950 text-white">All Statuses</option>
            <option value="pending" className="bg-charcoal-950 text-white">Pending</option>
            <option value="paid" className="bg-charcoal-950 text-white">Paid</option>
            <option value="cooking" className="bg-charcoal-950 text-white">Cooking</option>
            <option value="out_for_delivery" className="bg-charcoal-950 text-white">On the Way</option>
            <option value="completed" className="bg-charcoal-950 text-white">Completed</option>
            <option value="cancelled" className="bg-charcoal-950 text-white">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="glassmorphism p-12 text-center rounded-2xl border border-white/5">
          <p className="text-gray-400">No orders found matching the filter.</p>
        </div>
      ) : (
        <div className="bg-charcoal-900 border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-400">
              <thead className="bg-charcoal-950 text-gray-500 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-3.5 rounded-l-xl">Order ID</th>
                  <th className="px-6 py-3.5">Customer Name</th>
                  <th className="px-6 py-3.5">Details</th>
                  <th className="px-6 py-3.5 text-center">Order Type</th>
                  <th className="px-6 py-3.5 text-center">Total Paid</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                  <th className="px-6 py-3.5 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">#{order.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-white">{order.user_name || 'Guest User'}</p>
                      <p className="text-[10px] text-gray-500">{order.phone}</p>
                    </td>
                    <td className="px-6 py-4 max-w-[200px] truncate">
                      {order.items?.map(i => `${i.menu_item_name} (x${i.quantity})`).join(', ')}
                    </td>
                    <td className="px-6 py-4 text-center capitalize">{order.order_type}</td>
                    <td className="px-6 py-4 text-center font-bold text-white font-serif">
                      ${order.total_amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] uppercase font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowModal(true);
                        }}
                        className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 cursor-pointer"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {/* Quick Status Dropdown toggle */}
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="bg-charcoal-950 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-gray-300 focus:outline-none cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="cooking">Cooking</option>
                        <option value="out_for_delivery">On Way</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancel</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Items Detail Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-charcoal-900 border border-white/10 max-w-lg w-full rounded-2xl p-6 relative text-left">
            <h3 className="font-serif text-lg font-bold text-white border-b border-white/5 pb-3 mb-4">
              Order Details: #{selectedOrder.id}
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 text-xs text-gray-400 gap-y-1.5">
                <p>Customer:</p> <p className="text-white font-medium">{selectedOrder.user_name}</p>
                <p>Phone:</p> <p className="text-white font-medium">{selectedOrder.phone}</p>
                <p>Type:</p> <p className="text-white font-medium capitalize">{selectedOrder.order_type}</p>
                {selectedOrder.delivery_address && (
                  <>
                    <p>Address:</p>
                    <p className="text-white font-medium">{selectedOrder.delivery_address}</p>
                  </>
                )}
                <p>Payment Method:</p> <p className="text-white font-medium uppercase">{selectedOrder.payment_method}</p>
                <p>Order Date:</p> <p className="text-white font-medium">{new Date(selectedOrder.created_at).toLocaleString()}</p>
              </div>

              <div className="w-full h-px bg-white/5"></div>

              {/* Items List */}
              <div className="space-y-3">
                <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Items Ordered</p>
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs text-gray-300">
                    <span>{item.menu_item_name} <span className="text-gray-500">× {item.quantity}</span></span>
                    <span className="font-serif font-semibold text-white">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="w-full h-px bg-white/5"></div>

              <div className="flex justify-between text-sm font-bold text-white font-serif">
                <span>Grand Total</span>
                <span className="text-amber-500">${selectedOrder.total_amount.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedOrder(null);
                }}
                className="bg-amber-500 hover:bg-amber-600 text-charcoal-950 font-bold py-2 px-6 rounded-lg text-xs cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
