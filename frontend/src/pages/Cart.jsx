import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ShoppingBag, Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-6 space-y-6">
        <div className="bg-charcoal-900 border border-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-gray-500 shadow-xl">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-white">{t('cart.emptyTitle', 'Your Cart is Empty')}</h1>
        <p className="text-gray-400 text-sm leading-relaxed">
          {t('cart.emptyDescription', "It looks like you haven't added any gourmet dishes to your cart yet. Visit our menu and explore culinary masterpieces.")}
        </p>
        <div className="pt-2">
          <Link
            to="/menu"
            className="inline-block bg-gradient-to-r from-amber-500 to-gold-500 hover:from-amber-600 hover:to-gold-600 text-charcoal-950 font-bold py-3 px-8 rounded-full transition-all"
          >
            {t('buttons.exploreMenu', 'Explore Our Menu')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 pt-10 px-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="text-center space-y-4">
        <span className="text-xs font-semibold tracking-widest text-amber-500 uppercase">{t('cart.headerTag', 'Your Selections')}</span>
        <h1 className="text-4xl font-serif font-bold text-white">{t('cart.heading', 'Shopping Cart')}</h1>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glassmorphism rounded-3xl border border-white/5 overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 bg-charcoal-900/80 px-6 py-4 border-b border-white/5 text-xs font-semibold tracking-wider text-gray-400 uppercase">
              <div className="col-span-6">{t('cart.dishDetailsHeader', 'Dish Details')}</div>
              <div className="col-span-2 text-center">{t('cart.priceHeader', 'Price')}</div>
              <div className="col-span-2 text-center">{t('cart.quantityHeader', 'Quantity')}</div>
              <div className="col-span-2 text-right">{t('cart.totalHeader', 'Total')}</div>
            </div>

            <div className="divide-y divide-white/5">
              {cart.map((item) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-6 text-left">
                  {/* Info */}
                  <div className="col-span-12 md:col-span-6 flex items-center space-x-4">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="min-w-0">
                      <p className="font-serif font-bold text-white text-md truncate">{item.name}</p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center space-x-1 mt-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>{t('userMenu.remove', 'Remove')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-4 md:col-span-2 md:text-center flex md:block items-center justify-between text-sm">
                    <span className="md:hidden text-gray-500 text-xs">{t('cart.priceLabel', 'Price:')}</span>
                    <span className="text-gray-300 font-serif font-medium">${item.price.toFixed(2)}</span>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-4 md:col-span-2 flex md:justify-center items-center justify-between text-sm">
                    <span className="md:hidden text-gray-500 text-xs">{t('cart.qtyLabel', 'Qty:')}</span>
                    <div className="flex items-center space-x-1 border border-white/10 rounded-full p-1 bg-charcoal-900">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-gray-400 hover:text-white p-0.5 cursor-pointer"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-xs font-semibold px-2 text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-gray-400 hover:text-white p-0.5 cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="col-span-4 md:col-span-2 text-right flex md:block items-center justify-between text-sm font-bold">
                    <span className="md:hidden text-gray-500 text-xs">{t('cart.totalLabel', 'Total:')}</span>
                    <span className="text-amber-500 font-serif">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/menu"
              className="inline-flex items-center space-x-2 text-sm text-gray-400 hover:text-amber-500 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t('cart.continueShopping', 'Continue Shopping')}</span>
            </Link>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-4 bg-charcoal-900 border border-white/10 rounded-3xl p-6 space-y-6 text-left">
          <h3 className="font-serif text-xl font-bold text-white border-b border-white/5 pb-4">{t('cart.orderSummary', 'Order Summary')}</h3>

          <div className="space-y-4 text-sm text-gray-400">
            <div className="flex justify-between">
              <span>{t('cart.gourmetSubtotal', 'Gourmet Subtotal')}</span>
              <span className="text-white font-medium">${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('cart.estimatedTax', 'Estimated VAT (10%)')}</span>
              <span className="text-white font-medium">${(getCartTotal() * 0.1).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('cart.deliveryFee', 'Delivery / Service Fee')}</span>
              <span className="text-green-400 font-medium font-serif">{t('cart.complimentary', 'Complimentary')}</span>
            </div>
            <div className="w-full h-px bg-white/5"></div>
            <div className="flex justify-between text-lg font-bold text-white font-serif pt-1">
              <span>{t('cart.totalCost', 'Total cost')}</span>
              <span className="text-amber-500">${(getCartTotal() * 1.1).toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-gradient-to-r from-amber-500 to-gold-500 hover:from-amber-600 hover:to-gold-600 text-charcoal-950 font-bold py-4 rounded-xl flex items-center justify-center transition-all transform active:scale-95 cursor-pointer"
          >
            <span>{t('buttons.proceedToCheckout', 'Proceed to Checkout')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;