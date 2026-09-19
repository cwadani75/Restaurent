import BookingForm from '../components/BookingForm';
import { Calendar, Award, ShieldAlert, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Reservations = () => {
  const { t } = useLanguage();
  const policies = [0, 1, 2].map((idx) => ({
    icon: [
      <Sparkles className="h-5 w-5 text-amber-500" />,
      <Award className="h-5 w-5 text-amber-500" />,
      <ShieldAlert className="h-5 w-5 text-amber-500" />,
    ][idx],
    title: t(`reservations.policies.${idx}.title`, ['Dress Code', 'Punctuality', 'Cancellation'][idx]),
    description: t(
      `reservations.policies.${idx}.description`,
      [
        'Smart elegant. We kindly request guests to avoid athletic wear, beach attire, or casual t-shirts.',
        'Tables are held for a maximum of 15 minutes. Please notify us if you are running late.',
        'Cancellations or changes must be submitted at least 24 hours prior to your slot.',
      ][idx]
    ),
  }));

  return (
    <div className="space-y-16 pb-20 pt-10 px-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <section className="max-w-3xl mx-auto text-center space-y-4">
        <span className="text-xs font-semibold tracking-widest text-amber-500 uppercase">{t('reservations.smallTitle', 'Fine Dining Seating')}</span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">{t('reservations.heading', 'Table Reservations')}</h1>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"></div>
        <p className="text-gray-400 font-light leading-relaxed">
          {t('reservations.description', 'Book your table at Sowda restaurent. Experience exceptional French fine dining and attentive service in our main dining salon or private chambers.')}
        </p>
      </section>

      {/* Grid: Info and Booking Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Policies & Details Panel (Left Column) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="glassmorphism p-8 rounded-2xl border border-white/5 space-y-6">
            <h2 className="font-serif text-xl font-bold text-white">{t('reservations.guidelinesTitle', 'Reservation Guidelines')}</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t('reservations.guidelinesIntro', 'To guarantee a premium atmosphere for all our guests, we maintain basic dining guidelines:')}
            </p>

            <div className="space-y-6">
              {policies.map((policy, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <div className="bg-white/5 p-2.5 rounded-lg shrink-0">
                    {policy.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{policy.title}</h3>
                    <p className="text-xs text-gray-400 pt-1 leading-relaxed">{policy.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Private Events Alert */}
          <div className="glassmorphism p-8 rounded-2xl border border-white/5 space-y-4 bg-gradient-to-b from-amber-950/20 to-transparent">
            <h3 className="font-serif text-lg font-bold text-white">{t('reservations.privateEventsTitle', 'Private Events & Banquets')}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t('reservations.privateEventsDescription', 'We host bespoke private dinners, corporate receptions, and wedding banquets for up to 80 guests. Contact our events manager directly for tailored menus.')}
            </p>
            <p className="text-xs text-amber-500 font-medium pt-1">{t('reservations.privateEventsContact', 'Email: events@sowda.com | Tel: +254 724 631727')}</p>
          </div>
        </div>

        {/* Booking Form (Right Column) */}
        <div className="lg:col-span-7">
          <BookingForm />
        </div>
      </div>
    </div>
  );
};

export default Reservations;
