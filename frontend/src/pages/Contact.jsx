import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Phone, MapPin, Send, CheckCircle, Clock } from 'lucide-react';

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate contact form submission
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-20 pb-20 pt-10 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <section className="max-w-3xl mx-auto text-center space-y-4">
        <span className="text-xs font-semibold tracking-widest text-amber-500 uppercase">{t('contact.headerTag', 'Contact Us')}</span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">{t('contact.heading', "We'd Love to Hear From You")}</h1>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"></div>
        <p className="text-gray-400 font-light">
          {t('contact.description', 'Have a question about our menu, private events, or catering? Send us a message, and our host team will respond within 24 hours.')}
        </p>
      </section>

      {/* Info & Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Info Column */}
        <div className="lg:col-span-5 space-y-8">
          <div className="glassmorphism p-8 rounded-2xl border border-white/5 space-y-6">
            <h2 className="font-serif text-xl font-bold text-white">{t('contact.infoTitle', 'Contact Information')}</h2>
            
            <ul className="space-y-6 text-sm text-gray-300">
              <li className="flex items-start space-x-4">
                <MapPin className="h-5 w-5 text-amber-500 shrink-0" />
                <div>
                  <p className="font-semibold text-white">{t('contact.locationLabel', 'Our Location')}</p>
                  <p className="text-gray-400 pt-1">42 Champs-Élysées, Paris, France 75008</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <Phone className="h-5 w-5 text-amber-500 shrink-0" />
                <div>
                  <p className="font-semibold text-white">{t('contact.hotlineLabel', 'Hotline')}</p>
                  <p className="text-gray-400 pt-1">+254 724 631727</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <Mail className="h-5 w-5 text-amber-500 shrink-0" />
                <div>
                  <p className="font-semibold text-white">{t('contact.emailLabel', 'Email Address')}</p>
                  <p className="text-gray-400 pt-1">reservations@sowda.com</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="glassmorphism p-8 rounded-2xl border border-white/5 space-y-4">
            <h2 className="font-serif text-xl font-bold text-white flex items-center space-x-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <span>{t('contact.hoursTitle', 'Dining Room Hours')}</span>
            </h2>
            <div className="text-sm text-gray-400 space-y-2">
              <p className="flex justify-between">
                <span>{t('contact.hours.0.label', 'Monday - Friday')}</span>
                <span className="text-white font-medium">{t('contact.hours.0.value', '17:00 - 23:00')}</span>
              </p>
              <p className="flex justify-between">
                <span>{t('contact.hours.1.label', 'Saturday')}</span>
                <span className="text-white font-medium">{t('contact.hours.1.value', '12:00 - 23:30')}</span>
              </p>
              <p className="flex justify-between">
                <span>{t('contact.hours.2.label', 'Sunday')}</span>
                <span className="text-white font-medium">{t('contact.hours.2.value', '12:00 - 22:00')}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7">
          {success ? (
            <div className="glassmorphism p-10 rounded-3xl border border-amber-500/20 text-center space-y-6">
              <div className="bg-amber-500/10 text-amber-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white">{t('contact.successHeading', 'Message Sent!')}</h3>
              <p className="text-gray-400 leading-relaxed">
                {t('contact.successDescription', 'Thank you for contacting us. Your message has been submitted successfully. Our customer support manager will get back to you shortly.')}
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="bg-amber-500 hover:bg-amber-600 text-charcoal-950 font-bold py-2.5 px-6 rounded-full transition-all"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glassmorphism p-8 md:p-10 rounded-3xl border border-white/5 space-y-6">
              <h2 className="font-serif text-xl font-bold text-white">{t('contact.formHeading', 'Send Us A Message')}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">{t('contact.fields.name', 'Your Name')}</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('contact.placeholders.name', 'John Doe')}
                    className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">{t('contact.fields.email', 'Email Address')}</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('contact.placeholders.email', 'john@example.com')}
                    className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">{t('contact.fields.subject', 'Subject')}</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={t('contact.placeholders.subject', 'Private Booking Inquiry')}
                    className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">{t('contact.fields.message', 'Message')}</label>
                  <textarea
                    name="message"
                    required
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t('contact.placeholders.message', 'Write details of your query...')}
                    className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-gold-500 hover:from-amber-600 hover:to-gold-600 text-charcoal-950 font-bold py-4 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-charcoal-950"></div>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>{t('buttons.sendMessage', 'Send Message')}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Map Placeholder */}
      <section className="w-full h-[400px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative bg-charcoal-900 flex justify-center items-center">
        {/* Abstract design to mock a modern map */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,155,38,0.08)_0,transparent_75%)] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-y-4">
          <div className="bg-amber-500 text-charcoal-950 p-4 rounded-full shadow-lg shadow-amber-500/20 animate-bounce">
            <MapPin className="h-6 w-6" />
          </div>
          <div className="text-center">
            <p className="font-serif text-lg font-bold text-white">{t('contact.mapLocation', '42 Champs-Élysées')}</p>
            <p className="text-xs text-gray-500">{t('contact.mapCity', 'Paris, France 75008')}</p>
          </div>
        </div>
        <div className="text-xs text-gray-600 absolute bottom-4 right-4">{t('contact.mapHint', 'Interactive Map View Simulation')}</div>
      </section>
    </div>
  );
};

export default Contact;
