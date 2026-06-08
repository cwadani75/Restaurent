import { useState, useEffect } from 'react';
import api from '../services/api';
import { Layers, Plus, Edit2, Trash2, ShieldAlert } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get('/menu/categories');
      setCategories(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category? All menu items in this category will also be deleted.")) return;
    try {
      await api.delete(`/menu/categories/${id}`);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error("Failed to delete category:", err);
      alert("Error deleting category.");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const response = await api.put(`/menu/categories/${editingCategory.id}`, formData);
        setCategories(prev => prev.map(c => c.id === editingCategory.id ? response.data.category : c));
      } else {
        const response = await api.post('/menu/categories', formData);
        setCategories(prev => [...prev, response.data.category]);
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error saving category.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <h1 className="font-serif text-2xl font-bold text-white flex items-center space-x-2">
          <Layers className="h-6 w-6 text-amber-500" />
          <span>Food Categories</span>
        </h1>
        <button
          onClick={handleOpenAdd}
          className="bg-amber-500 hover:bg-amber-600 text-charcoal-950 font-bold py-2 px-4 rounded-lg text-xs flex items-center space-x-1 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : categories.length === 0 ? (
        <div className="glassmorphism p-12 text-center rounded-2xl border border-white/5">
          <p className="text-gray-400">No categories found.</p>
        </div>
      ) : (
        <div className="bg-charcoal-900 border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-400">
              <thead className="bg-charcoal-950 text-gray-500 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-3.5 rounded-l-xl">Category Name</th>
                  <th className="px-6 py-3.5">Description</th>
                  <th className="px-6 py-3.5 text-center">Signup Date</th>
                  <th className="px-6 py-3.5 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {categories.map(cat => (
                  <tr key={cat.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-white text-sm">{cat.name}</td>
                    <td className="px-6 py-4 text-gray-400 max-w-sm truncate">{cat.description}</td>
                    <td className="px-6 py-4 text-center">{new Date(cat.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 cursor-pointer"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
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
          <form onSubmit={handleFormSubmit} className="bg-charcoal-900 border border-white/10 max-w-md w-full rounded-2xl p-6 space-y-4 text-left">
            <h3 className="font-serif text-lg font-bold text-white border-b border-white/5 pb-2">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-gray-400 uppercase">Category Name</label>
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
                Save Category
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Categories;
