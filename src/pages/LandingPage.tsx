import React from 'react';
import { motion } from 'motion/react';
import { Star, Shield, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCTA = () => {
    if (user) navigate('/dashboard');
    else navigate('/auth');
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center px-6 pt-20 pb-32">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?auto=format&fit=crop&q=80&w=2000" 
            alt="Cosmic Background" 
            className="w-full h-full object-cover opacity-10"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-gold-metallic/10 text-gold-metallic px-4 py-2 rounded-full text-sm font-bold tracking-widest uppercase mb-6">
              <Star className="w-4 h-4 fill-current" />
              Trusted by 5000+ Seekers
            </div>
            <h1 className="text-5xl md:text-7xl font-serif text-indigo-deep leading-tight mb-8">
              Unlock Your <span className="text-gold-metallic italic">Cosmic</span> Destiny
            </h1>
            <p className="text-xl text-indigo-deep/60 leading-relaxed mb-10 max-w-lg">
              Expert consultations in Astrology, Vastu, and Numerology to bring harmony, 
              prosperity, and clarity to your personal and professional life.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={handleCTA} className="btn-gold flex items-center gap-2 group">
                Book Your First Free Session
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a href="#services" className="px-8 py-3 rounded-full border border-indigo-deep/10 font-bold hover:bg-indigo-deep/5 transition-all">
                Explore Services
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1515942400420-2b98fed1f515?auto=format&fit=crop&q=80&w=800" 
                alt="Astrologer" 
                className="w-full aspect-[4/5] object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Floating Stats */}
            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-xl z-20 border border-indigo-deep/5">
              <p className="text-4xl font-serif text-indigo-deep">15+</p>
              <p className="text-sm font-bold text-indigo-deep/40 uppercase tracking-widest">Years Experience</p>
            </div>
            <div className="absolute -top-10 -right-10 bg-indigo-deep p-6 rounded-3xl shadow-xl z-20">
              <p className="text-gold-metallic text-4xl font-serif">99%</p>
              <p className="text-white/60 text-sm font-bold uppercase tracking-widest">Accuracy Rate</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 px-6 bg-indigo-deep/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif text-indigo-deep mb-6">Our Sacred Services</h2>
            <p className="text-indigo-deep/60 max-w-2xl mx-auto text-lg">
              Combining ancient wisdom with modern insights to provide you with actionable 
              guidance for every aspect of your life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Vastu Shastra',
                desc: 'Optimize the energy flow in your home or office to attract health, wealth, and happiness.',
                icon: <Shield className="w-10 h-10" />,
                img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600'
              },
              {
                title: 'Numerology',
                desc: 'Discover the hidden power of numbers in your life and how they influence your personality and destiny.',
                icon: <Zap className="w-10 h-10" />,
                img: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&q=80&w=600'
              },
              {
                title: 'Detailed Astrology',
                desc: 'In-depth analysis of your birth chart to understand planetary influences on your career, relationships, and health.',
                icon: <Star className="w-10 h-10" />,
                img: 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?auto=format&fit=crop&q=80&w=600'
              }
            ].map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="card-premium group"
              >
                <div className="relative h-48 rounded-xl overflow-hidden mb-8">
                  <img 
                    src={service.img} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-indigo-deep/20 group-hover:bg-indigo-deep/0 transition-colors" />
                  <div className="absolute top-4 left-4 bg-white p-3 rounded-xl text-gold-metallic shadow-lg">
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-serif text-indigo-deep mb-4">{service.title}</h3>
                <p className="text-indigo-deep/60 leading-relaxed mb-8">{service.desc}</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm font-medium text-indigo-deep/80">
                    <CheckCircle2 className="w-4 h-4 text-gold-metallic" />
                    Personalized Reports
                  </li>
                  <li className="flex items-center gap-2 text-sm font-medium text-indigo-deep/80">
                    <CheckCircle2 className="w-4 h-4 text-gold-metallic" />
                    1-on-1 Consultation
                  </li>
                </ul>
                <button onClick={handleCTA} className="w-full py-3 rounded-xl border border-indigo-deep/10 font-bold group-hover:bg-indigo-deep group-hover:text-white transition-all">
                  Book Session
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
