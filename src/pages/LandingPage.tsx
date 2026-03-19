import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Shield, Zap, ArrowRight, CheckCircle2, Hash, Home, Baby, Brain, BookOpen, Wind, Moon, ChevronRight, ChevronLeft, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const staticProfileImage = '/Images/profile-photo.png';

  const services = [
    {
      title: 'Numerology',
      desc: 'Analysis, Guidance, Name Correction, Lo Shu grid, Moolank, Bhagyank and Kua Number, Remedies for missing and multiple times numbers.',
      icon: <Hash className="w-10 h-10" />,
      img: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&q=80&w=800',
      features: ['Name Correction', 'Lo Shu Grid', 'Moolank & Bhagyank']
    },
    {
      title: 'Vastu Shastra',
      desc: 'Total Vastu (Live), Simple remedies, Numero Vastu, Astro Vastu, Elements, Colours. Starting 11000+ (Depends on size of the house).',
      icon: <Home className="w-10 h-10" />,
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
      features: ['Numero Vastu', 'Astro Vastu', 'Element Balancing']
    },
    {
      title: 'Naam Karan',
      desc: "Baby's name selection that is astrological and astro + numerologically aligned for a bright future.",
      icon: <Baby className="w-10 h-10" />,
      img: 'https://images.unsplash.com/photo-1510154221590-ff63e90a136f?auto=format&fit=crop&q=80&w=800',
      features: ["Baby's Name", 'Astrological Alignment', 'Numerology Check']
    },
    {
      title: 'Psychological Counselling',
      desc: 'Expert guidance for children, relationship issues, anxiety, and depression to restore mental peace.',
      icon: <Brain className="w-10 h-10" />,
      img: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=800',
      features: ['Children & Relationship', 'Anxiety & Depression', 'Mental Wellness']
    },
    {
      title: 'Astrology + Lal Kitab',
      desc: 'Remedies and general guidance based on in-depth analysis of planets and ancient Lal Kitab wisdom.',
      icon: <BookOpen className="w-10 h-10" />,
      img: 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?auto=format&fit=crop&q=80&w=800',
      features: ['Planetary Analysis', 'Lal Kitab Remedies', 'General Guidance']
    },
    {
      title: 'Meditation & Healing',
      desc: 'Self-healing techniques and Chakra healing to balance your energy and achieve spiritual growth.',
      icon: <Wind className="w-10 h-10" />,
      img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
      features: ['Self Healing', 'Chakra Balancing', 'Spiritual Growth']
    },
    {
      title: 'Nakshatras',
      desc: 'Identify lucky & unlucky nakshatras, their animals, plants, birds, and effective remedies.',
      icon: <Moon className="w-10 h-10" />,
      img: 'https://images.unsplash.com/photo-1504333638930-c8787321eee0?auto=format&fit=crop&q=80&w=800',
      features: ['Nakshatra Analysis', 'Animal & Plant Totems', 'Specific Remedies']
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % services.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [services.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % services.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + services.length) % services.length);

  const handleCTA = (serviceName?: string) => {
    if (user) {
      navigate('/dashboard', { 
        state: { 
          openBooking: true, 
          service: serviceName 
        } 
      });
    } else {
      navigate('/auth', { 
        state: { 
          returnTo: '/dashboard',
          openBooking: true,
          service: serviceName
        }
      });
    }
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
              <button onClick={() => handleCTA('Detailed Astrology')} className="btn-gold flex items-center gap-2 group">
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
            <div className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl border-8 border-white aspect-[4/5]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <img 
                    src={services[currentSlide].img} 
                    alt={services[currentSlide].title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-deep/60 via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="text-2xl font-serif mb-2">{services[currentSlide].title}</h3>
                      <p className="text-sm text-white/80 line-clamp-2">{services[currentSlide].desc}</p>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <div className="absolute inset-0 flex items-center justify-between px-4 z-20 opacity-0 hover:opacity-100 transition-opacity">
                <button 
                  onClick={prevSlide}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextSlide}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {services.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentSlide ? 'w-8 bg-gold-metallic' : 'w-2 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
            {/* Floating Stats */}
            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-xl z-20 border border-indigo-deep/5 hidden md:block">
              <p className="text-4xl font-serif text-indigo-deep">15+</p>
              <p className="text-sm font-bold text-indigo-deep/40 uppercase tracking-widest">Years Experience</p>
            </div>
            
            {/* Profile Image Circle */}
            <div className="absolute -top-16 -right-16 w-40 h-40 md:w-56 md:h-56 rounded-full border-8 border-white shadow-2xl overflow-hidden z-20 bg-white hidden md:flex items-center justify-center">
              <img 
                src={staticProfileImage} 
                alt="Astrologer Profile" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-premium group"
              >
                <div className="relative h-48 rounded-xl overflow-hidden mb-8">
                  <img 
                    src={service.img} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?auto=format&fit=crop&q=80&w=600`;
                    }}
                  />
                  <div className="absolute inset-0 bg-indigo-deep/20 group-hover:bg-indigo-deep/0 transition-colors" />
                  <div className="absolute top-4 left-4 bg-white p-3 rounded-xl text-gold-metallic shadow-lg">
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-serif text-indigo-deep mb-4">{service.title}</h3>
                <p className="text-indigo-deep/60 leading-relaxed mb-8 text-sm">{service.desc}</p>
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm font-medium text-indigo-deep/80">
                      <CheckCircle2 className="w-4 h-4 text-gold-metallic" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleCTA(service.title)} className="w-full py-3 rounded-xl border border-indigo-deep/10 font-bold group-hover:bg-indigo-deep group-hover:text-white transition-all">
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
