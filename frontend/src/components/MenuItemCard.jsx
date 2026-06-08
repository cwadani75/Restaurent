import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Plus, Eye } from 'lucide-react';

const MenuItemCard = ({ item }) => {
  const { addToCart } = useCart();

  return (
    <div className="glassmorphism-card rounded-2xl overflow-hidden flex flex-col group h-full">
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden bg-charcoal-900">
        <img
          src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Floating Price */}
        <div className="absolute top-4 right-4 bg-charcoal-950/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
          <span className="text-amber-500 font-bold font-serif">${item.price.toFixed(2)}</span>
        </div>
        {/* Hover Overlay */}
        <Link
          to={`/menu/${item.id}`}
          className="absolute inset-0 bg-charcoal-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300"
        >
          <div className="bg-amber-500 text-charcoal-950 p-3 rounded-full transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Eye className="h-5 w-5" />
          </div>
        </Link>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow space-y-3">
        <div className="flex justify-between items-start">
          <span className="text-xs font-semibold tracking-widest text-amber-500/80 uppercase">
            {item.category_name}
          </span>
        </div>
        <Link to={`/menu/${item.id}`} className="hover:text-amber-500 transition-colors">
          <h3 className="text-lg font-serif font-bold leading-tight text-white">{item.name}</h3>
        </Link>
        <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed flex-grow">
          {item.description}
        </p>

        {/* Action button */}
        <div className="pt-4 border-t border-white/5 flex justify-between items-center mt-auto">
          <span className="text-xs font-medium text-gray-500">
            {item.is_available ? 'Available' : 'Out of Stock'}
          </span>
          <button
            onClick={() => addToCart(item, 1)}
            disabled={!item.is_available}
            className={`flex items-center space-x-1 py-1.5 px-4 rounded-full text-xs font-bold transition-all duration-300 ${
              item.is_available
                ? 'bg-amber-500 hover:bg-amber-600 text-charcoal-950 transform hover:-translate-y-0.5 cursor-pointer'
                : 'bg-white/5 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
