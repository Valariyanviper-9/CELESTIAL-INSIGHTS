import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Moon, Star, User, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, profile, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-indigo-deep text-white py-4 px-6 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gold-metallic p-2 rounded-lg group-hover:rotate-12 transition-transform">
            <Moon className="w-6 h-6 text-indigo-deep" />
          </div>
          <span className="text-xl font-serif font-bold tracking-wider">CELESTIAL INSIGHTS</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="hover:text-gold-metallic transition-colors">Home</Link>
          <a href="/#services" className="hover:text-gold-metallic transition-colors">Services</a>
          {user ? (
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link to="/admin" className="text-gold-metallic hover:text-white transition-colors font-bold text-xs uppercase tracking-widest border border-gold-metallic/30 px-3 py-1 rounded-lg">
                  Admin
                </Link>
              )}
              <Link to="/dashboard" className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-all">
                <User className="w-4 h-4" />
                <span>{profile?.name || 'Dashboard'}</span>
              </Link>
              <button 
                onClick={() => { logout(); navigate('/'); }}
                className="p-2 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn-gold !py-2 !px-6 text-sm">
              Login / Sign Up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
