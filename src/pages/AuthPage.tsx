import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Moon, Star, Mail, Lock, Loader2 } from 'lucide-react';

const AuthPage: React.FC = () => {
  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (user && !loading) {
      const returnTo = location.state?.returnTo || '/dashboard';
      navigate(returnTo, { replace: true });
    }
  }, [user, loading, navigate, location]);

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    try {
      await signInWithGoogle();
      // Navigation will be handled by the useEffect once user is set and loading is false
    } catch (error) {
      console.error(error);
      alert("Authentication failed. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, name);
      }
      // Navigation will be handled by the useEffect once user is set and loading is false
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Authentication failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-20">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-metallic/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-deep/5 rounded-full blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-[40px] p-10 shadow-2xl border border-indigo-deep/5">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gold-metallic rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-12">
              <Moon className="w-8 h-8 text-indigo-deep -rotate-12" />
            </div>
            <h1 className="text-3xl font-serif text-indigo-deep mb-2">
              {isLogin ? 'Welcome Back' : 'Begin Your Journey'}
            </h1>
            <p className="text-indigo-deep/40">
              {isLogin ? 'Enter your cosmic credentials' : 'Join our community of seekers'}
            </p>
          </div>

          <div className="space-y-6">
            <button 
              onClick={handleGoogleSignIn}
              disabled={authLoading || loading}
              className="w-full flex items-center justify-center gap-3 py-4 border border-indigo-deep/10 rounded-2xl hover:bg-indigo-deep/5 transition-all font-bold text-indigo-deep"
            >
              {authLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                  Continue with Google
                </>
              )}
            </button>

            <div className="relative flex items-center gap-4 py-4">
              <div className="flex-1 h-px bg-indigo-deep/10" />
              <span className="text-xs font-bold text-indigo-deep/30 uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-indigo-deep/10" />
            </div>

            <form className="space-y-4" onSubmit={handleEmailAuth}>
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-indigo-deep/60 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <Star className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-deep/30" />
                    <input 
                      required
                      type="text" 
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-indigo-deep/5 border-none rounded-2xl focus:ring-2 focus:ring-gold-metallic outline-none transition-all"
                    />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-xs font-bold text-indigo-deep/60 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-deep/30" />
                  <input 
                    required
                    type="email" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-indigo-deep/5 border-none rounded-2xl focus:ring-2 focus:ring-gold-metallic outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-indigo-deep/60 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-deep/30" />
                  <input 
                    required
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-indigo-deep/5 border-none rounded-2xl focus:ring-2 focus:ring-gold-metallic outline-none transition-all"
                  />
                </div>
              </div>
              <button 
                disabled={authLoading || loading}
                type="submit"
                className="w-full btn-gold !py-4 flex items-center justify-center"
              >
                {authLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>


            <p className="text-center text-sm text-indigo-deep/40">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-gold-metallic font-bold hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
