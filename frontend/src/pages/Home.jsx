import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import MenuItemCard from '../components/MenuItemCard';
import { Star, ShieldAlert, Clock, Award, StarHalf, ChevronRight, Sparkles } from 'lucide-react';

const Home = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.get('/menu/items');
        // Grab first 3 items as featured
        setFeaturedItems(response.data.slice(0, 3));
      } catch (err) {
        console.error("Error loading featured items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const features = t('home.features');
  const testimonials = t('home.testimonials');

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-20 px-6">
        {/* Abstract Background Design */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,155,38,0.12)_0,transparent_60%)] pointer-events-none"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        {/* Hero Image Overlay Background */}
        <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1544025162-d76694265947?w=1600')] bg-cover bg-center opacity-15"></div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full text-xs font-semibold text-amber-500 uppercase tracking-widest animate-bounce">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t('home.heroBadge', 'Exquisite Fine Dining Experience')}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif leading-tight font-extrabold tracking-wide text-white">
            {t('home.heroTitle', 'Where Gastronomy Meets Luxury')}
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-gray-400 font-sans leading-relaxed">
            {t('home.heroDescription', 'Welcome to Sowda restaurant. Immerse your senses in a luxurious culinary journey designed by award-winning French masters.')}
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link
              to="/reservations"
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-gold-500 hover:from-amber-600 hover:to-gold-600 text-charcoal-950 font-bold py-4 px-8 rounded-full shadow-lg shadow-amber-500/20 transition-all transform hover:scale-105 active:scale-95 text-center"
            >
              {t('buttons.bookTable', 'Book A Table')}
            </Link>
            <Link
              to="/ordering"
              className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-amber-500/30 font-semibold py-4 px-8 rounded-full transition-all text-center"
            >
              {t('buttons.orderOnline', 'Order Online')}
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Values / Features */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feat, idx) => (
          <div key={idx} className="glassmorphism rounded-2xl p-8 border border-white/5 hover:border-amber-500/20 transition-colors space-y-4">
            <div className="bg-amber-500/10 w-14 h-14 rounded-xl flex items-center justify-center">
              <Award className="h-8 w-8 text-amber-500" />
            </div>
            <h3 className="font-serif text-xl font-bold text-white">{feat.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{feat.description}</p>
          </div>
        ))}
      </section>

      {/* Featured Dishes Section */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-semibold tracking-widest text-amber-500 uppercase">{t('home.chefSelection', "Chef's Selection")}</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">{t('home.featuredTitle', 'Featured Creations')}</h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"></div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

        <div className="text-center pt-4">
          <Link
            to="/menu"
            className="inline-flex items-center space-x-2 text-amber-500 hover:text-amber-600 font-semibold text-sm group"
          >
            <span>{t('buttons.viewFullMenu', 'View Full Menu')}</span>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Experience Intro / Video Placeholder Section */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
          <img 
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800" 
            alt={t('home.heroImageAlt', 'Restaurant Dining Area')}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/20 to-transparent flex items-end p-6">
            <p className="text-xs font-medium text-amber-500 tracking-wider">{t('home.heroCaption', 'Sowda restaurant Main Salon')}</p>
          </div>
        </div>
        <div className="space-y-6">
          <span className="text-xs font-semibold tracking-widest text-amber-500 uppercase">{t('home.diningExperience', 'The Dining Experience')}</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight">{t('home.experienceTitle', 'Elevating Food To An Art Form')}</h2>
          <p className="text-gray-400 leading-relaxed">
            {t('home.experienceDescription', 'Our philosophy focuses on purity of flavor, precise execution, and a sensory journey that takes you across the classic French regions.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="border-l-2 border-amber-500 pl-4">
              <h4 className="text-2xl font-serif font-bold text-white">{t('home.michelinText', '3 Michelin')}</h4>
              <p className="text-xs text-gray-500 uppercase tracking-widest">{t('home.starsExcellence', 'Stars Excellence')}</p>
            </div>
            <div className="border-l-2 border-amber-500 pl-4">
              <h4 className="text-2xl font-serif font-bold text-white">{t('home.organicText', '100% Organic')}</h4>
              <p className="text-xs text-gray-500 uppercase tracking-widest">{t('home.farmToTable', 'Farm-To-Table Sourcing')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-6 space-y-12 bg-charcoal-900/50 py-16 rounded-3xl border border-white/5">
        <div className="text-center space-y-4">
          <span className="text-xs font-semibold tracking-widest text-amber-500 uppercase">{t('home.reviewTag', 'Reviews')}</span>
          <h2 className="text-3xl font-serif font-bold text-white">{t('home.reviewHeading', 'What Culinary Enthusiasts Say')}</h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <div key={idx} className="glassmorphism p-8 rounded-2xl flex flex-col space-y-4 relative">
              <div className="flex text-amber-500 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(test.rating) ? 'fill-amber-500' : 'text-gray-600'}`} />
                ))}
              </div>
              <p className="text-sm text-gray-400 italic leading-relaxed flex-grow">"{test.comment}"</p>
              <div className="border-t border-white/5 pt-4">
                <p className="font-semibold text-white text-sm">{test.name}</p>
                <p className="text-xs text-gray-500">{test.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Reservation Section */}
      <section className="max-w-7xl mx-auto px-6 text-center">
        <div className="glassmorphism bg-gradient-to-b from-charcoal-900 to-charcoal-950 p-12 rounded-3xl border border-white/5 space-y-6 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">{t('home.reserveHeading', 'Join Us For An Unforgettable Evening')}</h2>
          <p className="max-w-lg mx-auto text-sm text-gray-400 leading-relaxed">
            {t('home.reserveDescription', 'Seating is highly limited. We recommend booking your table at least 2 weeks in advance.')}
          </p>
          <div className="pt-2">
            <Link
              to="/reservations"
              className="inline-block bg-gradient-to-r from-amber-500 to-gold-500 hover:from-amber-600 hover:to-gold-600 text-charcoal-950 font-bold py-3.5 px-8 rounded-full transition-all transform hover:scale-105 active:scale-95"
            >
              {t('home.ctaReserve', 'Reserve Table Now')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
