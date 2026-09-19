import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import MenuItemCard from '../components/MenuItemCard';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // null = 'All'
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await api.get('/menu/categories');
        setCategories(response.data);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    loadCategories();
  }, []);

  // Load items based on category and search query
  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        let url = '/menu/items';
        const params = {};
        if (selectedCategory) params.category_id = selectedCategory;
        if (search) params.search = search;
        
        const response = await api.get(url, { params });
        setItems(response.data);
      } catch (err) {
        console.error("Error loading items:", err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      loadItems();
    }, 300); // Debounce search calls

    return () => clearTimeout(delayDebounceFn);
  }, [selectedCategory, search]);

  const handleSort = (e) => {
    setSortBy(e.target.value);
  };

  const getSortedItems = () => {
    const itemsCopy = [...items];
    if (sortBy === 'price-low') {
      return itemsCopy.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      return itemsCopy.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      return itemsCopy.sort((a, b) => a.name.localeCompare(b.name));
    }
    return itemsCopy;
  };

  const sortedItems = getSortedItems();

  return (
    <div className="space-y-12 pb-20 pt-10 px-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="text-center space-y-4">
        <span className="text-xs font-semibold tracking-widest text-amber-500 uppercase">{t('menu.smallTitle', 'Le Menu')}</span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">{t('menu.heading', 'Experience Our Menu')}</h1>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"></div>
      </div>

      {/* Search and Filters Bar */}
      <div className="glassmorphism p-6 rounded-2xl border border-white/5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search */}
        <div className="md:col-span-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-505" />
          <input
            type="text"
            placeholder={t('menu.placeholder', 'Search gourmet dishes...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-charcoal-900 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Sorting */}
        <div className="md:col-span-6 relative flex items-center md:justify-end space-x-2">
          <div className="flex items-center space-x-2 bg-charcoal-900 border border-white/10 px-4 py-3 rounded-xl">
            <ArrowUpDown className="h-4 w-4 text-amber-500" />
            <select
              value={sortBy}
              onChange={handleSort}
              className="bg-transparent text-sm text-gray-300 focus:outline-none cursor-pointer"
            >
              <option value="default" className="bg-charcoal-900 text-white">{t('menu.defaultSorting', 'Default Sorting')}</option>
              <option value="price-low" className="bg-charcoal-900 text-white">{t('menu.priceLow', 'Price: Low to High')}</option>
              <option value="price-high" className="bg-charcoal-900 text-white">{t('menu.priceHigh', 'Price: High to Low')}</option>
              <option value="name" className="bg-charcoal-900 text-white">{t('menu.nameSort', 'Name: A to Z')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Selection Tabs */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`py-2 px-6 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
            selectedCategory === null
              ? 'bg-amber-500 text-charcoal-950 border-amber-500 font-bold'
              : 'bg-charcoal-900/50 border-white/10 text-gray-400 hover:border-amber-500/30 hover:text-white'
          }`}
        >
          {t('menu.allItems', 'All Items')}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`py-2 px-6 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-amber-500 text-charcoal-950 border-amber-500 font-bold'
                : 'bg-charcoal-900/50 border-white/10 text-gray-400 hover:border-amber-500/30 hover:text-white'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : sortedItems.length === 0 ? (
        <div className="glassmorphism p-12 text-center rounded-3xl max-w-lg mx-auto border border-white/5">
          <SlidersHorizontal className="h-10 w-10 text-gray-500 mx-auto mb-4" />
          <h3 className="text-white font-serif text-lg font-bold mb-1">{t('menu.noResultsTitle', 'No Dishes Found')}</h3>
          <p className="text-sm text-gray-400">{t('menu.noResultsDescription', 'Try modifying your search or changing the filter category.')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
