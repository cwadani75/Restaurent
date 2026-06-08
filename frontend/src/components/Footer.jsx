import { Link, useLocation } from 'react-router-dom';
import { Utensils, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const location = useLocation();

  // Hide footer on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }
  
  return (
    <footer className="bg-charcoal-900 border-t border-white/5 pt-16 pb-8 px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        {/* About Column */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-amber-500 to-gold-500 p-2 rounded-lg">
              <Utensils className="h-5 w-5 text-charcoal-950" />
            </div>
            <span className="font-serif text-lg font-bold tracking-widest text-white">
              Sowda restaurent
            </span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Experience culinary mastery at Sowda restaurent. We craft gourmet French-inspired dishes using local, organic ingredients inside a modern luxury setting.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-amber-500 hover:text-charcoal-950 text-gray-300 transition-all">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-amber-500 hover:text-charcoal-950 text-gray-300 transition-all">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-amber-500 hover:text-charcoal-950 text-gray-300 transition-all">
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="space-y-4">
          <h3 className="text-white font-serif text-md font-semibold uppercase tracking-wider">Navigation</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/" className="hover:text-amber-500 transition-colors">Home</Link></li>
            <li><Link to="/menu" className="hover:text-amber-500 transition-colors">Our Menu</Link></li>
            <li><Link to="/ordering" className="hover:text-amber-500 transition-colors">Order Online</Link></li>
            <li><Link to="/reservations" className="hover:text-amber-500 transition-colors">Reservations</Link></li>
            <li><Link to="/about" className="hover:text-amber-500 transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-amber-500 transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Hours Column */}
        <div className="space-y-4">
          <h3 className="text-white font-serif text-md font-semibold uppercase tracking-wider">Opening Hours</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex justify-between border-b border-white/5 pb-1">
              <span>Monday - Friday</span>
              <span className="text-white font-medium">17:00 - 23:00</span>
            </li>
            <li className="flex justify-between border-b border-white/5 pb-1">
              <span>Saturday</span>
              <span className="text-white font-medium">12:00 - 23:30</span>
            </li>
            <li className="flex justify-between border-b border-white/5 pb-1">
              <span>Sunday</span>
              <span className="text-white font-medium">12:00 - 22:00</span>
            </li>
            <li className="text-xs text-amber-500/70 italic pt-1">
              * Kitchen closes 45 minutes prior to closing.
            </li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div className="space-y-4">
          <h3 className="text-white font-serif text-md font-semibold uppercase tracking-wider">Contact Us</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-amber-500 shrink-0" />
              <span>42 Champs-Élysées, Paris, France 75008</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-amber-500 shrink-0" />
              <span>+254 724 631727</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-amber-500 shrink-0" />
              <span>reservations@sowda.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 text-center text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} Sowda restaurent. All rights reserved. Designed with elegance.</p>
      </div>
    </footer>
  );
};

export default Footer;
