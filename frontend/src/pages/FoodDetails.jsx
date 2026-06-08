import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { ShoppingBag, ChevronLeft, Plus, Minus, Star, Heart, Check } from 'lucide-react';

const FoodDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.get(`/menu/items/${id}`);
        setItem(response.data);
      } catch (err) {
        console.error("Error loading item details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    if (item) {
      addToCart(item, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="glassmorphism p-12 text-center rounded-3xl max-w-lg mx-auto my-12 border border-white/5">
        <h3 className="text-white font-serif text-xl font-bold mb-1">Dish Not Found</h3>
        <p className="text-sm text-gray-400 mb-6">The item you are looking for does not exist or has been removed.</p>
        <Link to="/menu" className="bg-amber-500 hover:bg-amber-600 text-charcoal-950 font-bold py-2.5 px-6 rounded-full transition-all">
          Back to Menu
        </Link>
      </div>
    );
  }

  // Mocked rich detail parameters for premium presentation
  const mockIngredients = ["Organic local produce", "House-made specialty reductions", "Traditional herbs & butter infusion", "Hand-selected spices"];
  const mockNutrition = { calories: "320 kcal", protein: "14g", carbs: "22g", fat: "12g" };

  return (
    <div className="space-y-12 pb-20 pt-6 px-6 max-w-7xl mx-auto">
      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 text-sm text-gray-400 hover:text-amber-500 transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Image */}
        <div className="lg:col-span-6 relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 aspect-video bg-charcoal-900">
          <img
            src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Column: Info & Action */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold tracking-widest text-amber-500 uppercase">
              {item.category_name}
            </span>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">{item.name}</h1>
            <p className="text-2xl font-serif text-amber-500 font-bold">${item.price.toFixed(2)}</p>
          </div>

          <div className="w-full h-px bg-white/5"></div>

          <p className="text-gray-400 leading-relaxed">{item.description}</p>

          {/* Quantity and Cart Buttons */}
          <div className="flex flex-wrap items-center gap-6 pt-4">
            <div className="flex items-center space-x-1 bg-charcoal-900 border border-white/10 rounded-full p-1.5">
              <button
                onClick={handleDecrement}
                disabled={!item.is_available}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-md font-semibold text-white px-4">{quantity}</span>
              <button
                onClick={handleIncrement}
                disabled={!item.is_available}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!item.is_available}
              className={`flex-grow md:flex-grow-0 flex items-center justify-center space-x-2 py-4 px-8 rounded-full text-sm font-bold transition-all duration-300 transform active:scale-95 cursor-pointer ${
                item.is_available
                  ? added
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-amber-500 to-gold-500 hover:from-amber-600 hover:to-gold-600 text-charcoal-950 shadow-lg shadow-amber-500/10 hover:-translate-y-0.5'
                  : 'bg-white/5 text-gray-500 cursor-not-allowed'
              }`}
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  <span>{item.is_available ? 'Add to Cart' : 'Out of Stock'}</span>
                </>
              )}
            </button>
          </div>

          <div className="w-full h-px bg-white/5"></div>

          {/* Details Tabs (Ingredients, Nutrition) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-white text-md">Key Ingredients</h4>
              <ul className="text-sm text-gray-400 space-y-1.5 list-disc pl-4">
                {mockIngredients.map((ing, i) => <li key={i}>{ing}</li>)}
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-white text-md">Nutrition Info</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                <div>Calories: <span className="text-white font-medium">{mockNutrition.calories}</span></div>
                <div>Protein: <span className="text-white font-medium">{mockNutrition.protein}</span></div>
                <div>Fat: <span className="text-white font-medium">{mockNutrition.fat}</span></div>
                <div>Carbs: <span className="text-white font-medium">{mockNutrition.carbs}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;
