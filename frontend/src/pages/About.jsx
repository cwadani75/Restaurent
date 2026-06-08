import { Award, Sparkles, Heart, Landmark } from 'lucide-react';

const About = () => {
  const team = [
    {
      name: "Chef Antoine Laurent",
      role: "Executive Chef & Founder",
      image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=500",
      description: "Trained in Paris under legendary Michelin masters, Antoine has spent 20 years perfecting his craft."
    },
    {
      name: "Elena Rostova",
      role: "Master Pastry Chef",
      image: "https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?w=500",
      description: "Elena creates award-winning, artistic desserts combining classical baking with modern styles."
    },
    {
      name: "Jean-Pierre Dubois",
      role: "Head Sommelier",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500",
      description: "Curator of our legendary wine vault, ensuring perfect pairing combinations for every guest."
    }
  ];

  return (
    <div className="space-y-24 pb-20 pt-10">
      {/* Intro Header */}
      <section className="max-w-4xl mx-auto text-center px-6 space-y-4">
        <span className="text-xs font-semibold tracking-widest text-amber-500 uppercase">Our Story</span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">Sowda restaurent</h1>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-6"></div>
        <p className="text-gray-400 text-lg leading-relaxed font-light">
          Founded in 2012, Sowda restaurent represents the culmination of French culinary tradition merged with modern culinary science.
        </p>
      </section>

      {/* History and Legacy */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-amber-500">
            <Landmark className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-widest">Heritage</span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-white leading-tight">Born From Culinary Passion</h2>
          <p className="text-gray-400 leading-relaxed">
            Chef Antoine Laurent started the restaurant with a simple goal: to make gourmet dining approachable yet premium. Located in the heart of the historic district, Sowda restaurent sits in a restored 19th-century building, blending classical architectural beauty with warm, glassmorphic modern design.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Over the years, we have been honored with 3 Michelin Stars, recognizing our commitment to purity of ingredients, technical precision, and a dining service that treats every single visitor as a royalty.
          </p>
        </div>
        <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800" 
            alt="Chef Preparing Food"
            className="w-full h-full object-cover" 
          />
        </div>
      </section>

      {/* Philosophy Metrics */}
      <section className="bg-charcoal-900/50 border-y border-white/5 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-3">
            <Award className="h-10 w-10 text-amber-500 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-white">Authentic Techniques</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              We employ slow-reduction stocks, hand-kneaded dough, and traditional copper pan searing for depth of flavor.
            </p>
          </div>
          <div className="space-y-3">
            <Sparkles className="h-10 w-10 text-amber-500 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-white">Innovation</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Using state-of-the-art sous-vide control and culinary smoke infusion to elevate textures.
            </p>
          </div>
          <div className="space-y-3">
            <Heart className="h-10 w-10 text-amber-500 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-white">100% Care</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              From organic local farms directly to your plate, catering fully to custom allergies and preferences.
            </p>
          </div>
        </div>
      </section>

      {/* Culinary Team */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-semibold tracking-widest text-amber-500 uppercase">The Artisans</span>
          <h2 className="text-3xl font-serif font-bold text-white">Meet Our Culinary Team</h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <div key={idx} className="glassmorphism-card rounded-2xl overflow-hidden flex flex-col group">
              <div className="aspect-[4/3] bg-charcoal-900 overflow-hidden relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-2 flex-grow">
                <h3 className="font-serif text-xl font-bold text-white">{member.name}</h3>
                <span className="text-xs font-semibold text-amber-500 tracking-wider uppercase block">{member.role}</span>
                <p className="text-sm text-gray-400 leading-relaxed pt-2">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
