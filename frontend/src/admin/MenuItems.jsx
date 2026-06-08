import { useState, useEffect } from 'react';
import api from '../services/api';
import { BookOpen, Plus, Edit2, Trash2, Search, SlidersHorizontal } from 'lucide-react';

const MenuItems = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category_id: '',
    is_available: true
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [itemsRes, catRes] = await Promise.all([
        api.get('/menu/items'),
        api.get('/menu/categories')
      ]);
      setItems(itemsRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      image_url: '',
      category_id: categories[0]?.id || '',
      is_available: true
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      image_url: item.image_url,
      category_id: item.category_id,
      is_available: item.is_available
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;
    try {
      await api.delete(`/menu/items/${id}`);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Failed to delete item:", err);
      alert("Error deleting item.");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const response = await api.put(`/menu/items/${editingItem.id}`, formData);
        setItems(prev => prev.map(item => item.id === editingItem.id ? response.data.item : item));
      } else {
        const response = await api.post('/menu/items', formData);
        setItems(prev => [...prev, response.data.item]);
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error saving menu item.");
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = catFilter === 'all' || item.category_id === parseInt(catFilter);
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <h1 className="font-serif text-2xl font-bold text-white flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-amber-500" />
          <span>Menu Management</span>
        </h1>
        <button
          onClick={handleOpenAdd}
          className="bg-amber-500 hover:bg-amber-600 text-charcoal-950 font-bold py-2 px-4 rounded-lg text-xs flex items-center space-x-1 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Dish</span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-charcoal-900 border border-white/5 p-4 rounded-xl items-center">
        <div className="md:col-span-8 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search items by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-charcoal-950 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>
        <div className="md:col-span-4 flex items-center space-x-2 bg-charcoal-950 border border-white/10 px-3 py-2 rounded-lg">
          <SlidersHorizontal className="h-4 w-4 text-amber-500" />
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="bg-transparent text-xs text-gray-300 focus:outline-none cursor-pointer w-full"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Items Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="glassmorphism p-12 text-center rounded-2xl border border-white/5">
          <p className="text-gray-400">No menu items found.</p>
        </div>
      ) : (
        <div className="bg-charcoal-900 border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-400">
              <thead className="bg-charcoal-950 text-gray-500 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-3.5 rounded-l-xl">Dish</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5 text-center">Unit Price</th>
                  <th className="px-6 py-3.5 text-center">Availability</th>
                  <th className="px-6 py-3.5 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 flex items-center space-x-3">
                      <img
                        src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate">{item.name}</p>
                        <p className="text-[10px] text-gray-500 truncate max-w-[250px]">{item.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">{item.category_name}</td>
                    <td className="px-6 py-4 text-center font-bold text-white font-serif">${item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] uppercase font-semibold ${
                        item.is_available 
                          ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                          : 'bg-red-500/10 border-red-500/20 text-red-400'
                      }`}>
                        {item.is_available ? 'Available' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 cursor-pointer"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <form onSubmit={handleFormSubmit} className="bg-charcoal-900 border border-white/10 max-w-lg w-full rounded-2xl p-6 space-y-4 text-left">
            <h3 className="font-serif text-lg font-bold text-white border-b border-white/5 pb-2">
              {editingItem ? 'Edit Menu Dish' : 'Add New Dish'}
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-gray-400 uppercase">Dish Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-charcoal-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-gray-400 uppercase">Description</label>
                <textarea
                  required
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-charcoal-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-gray-400 uppercase">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full bg-charcoal-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-gray-400 uppercase">Category</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, category_id: parseInt(e.target.value) }))}
                    className="w-full bg-charcoal-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-gray-400 uppercase">Image URL</label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-charcoal-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="is_available"
                  checked={formData.is_available}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_available: e.target.checked }))}
                  className="rounded border-white/10 text-amber-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="is_available" className="text-xs text-gray-300 select-none cursor-pointer">
                  Make Dish Available
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-white/5 hover:bg-white/10 text-gray-300 font-semibold py-2 px-4 rounded-lg text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-charcoal-950 font-bold py-2 px-6 rounded-lg text-xs cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MenuItems;
