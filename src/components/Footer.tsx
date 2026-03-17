import React from 'react';
import { Moon, Star, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-indigo-deep text-white pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <Moon className="w-8 h-8 text-gold-metallic" />
            <span className="text-2xl font-serif font-bold tracking-wider">CELESTIAL INSIGHTS</span>
          </div>
          <p className="text-white/70 max-w-md leading-relaxed">
            Guiding you through the cosmic energies of Astrology, Vastu, and Numerology. 
            Find balance, prosperity, and clarity in your life's journey with our expert consultations.
          </p>
        </div>

        <div>
          <h4 className="text-gold-metallic font-serif text-lg mb-6">Quick Links</h4>
          <ul className="space-y-4 text-white/70">
            <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
            <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
            <li><a href="#about" className="hover:text-white transition-colors">About Me</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-gold-metallic font-serif text-lg mb-6">Contact Info</h4>
          <ul className="space-y-4 text-white/70">
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gold-metallic" />
              <span>consult@celestial.com</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gold-metallic" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gold-metallic" />
              <span>Vastu Enclave, New Delhi, India</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 text-center text-white/40 text-sm">
        <p>&copy; {new Date().getFullYear()} Celestial Insights. All cosmic rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
