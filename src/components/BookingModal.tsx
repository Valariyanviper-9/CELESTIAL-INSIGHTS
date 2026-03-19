import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle, Loader2, Copy, ExternalLink, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { Appointment } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, initialService }) => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    type: (initialService || 'Detailed Astrology') as Appointment['consultationType']
  });

  // Reset type when initialService changes or modal opens
  React.useEffect(() => {
    if (isOpen && initialService) {
      setFormData(prev => ({ ...prev, type: initialService as any }));
    }
  }, [isOpen, initialService]);

  const isFree = !profile?.hasUsedFreeConsultation;
  const price = isFree ? 0 : 2000;
  const upiId = 'meenutalwar.talwar@oksbi';

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    // Validate UTR for paid consultations
    if (!isFree && (utrNumber.length !== 12 || !/^\d+$/.test(utrNumber))) {
      alert("Please enter a valid 12-digit UTR number.");
      return;
    }

    setLoading(true);
    const appointmentPath = 'appointments';
    const userPath = `users/${user.uid}`;
    
    try {
      const appointment: Appointment = {
        userId: user.uid,
        userName: profile.name,
        date: formData.date,
        consultationType: formData.type,
        priceCharged: price,
        status: 'pending',
        createdAt: new Date().toISOString(),
        ...(isFree ? {} : { utrNumber })
      };

      try {
        await addDoc(collection(db, 'appointments'), appointment);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, appointmentPath);
        return;
      }
      
      if (isFree) {
        try {
          await updateDoc(doc(db, 'users', user.uid), {
            hasUsedFreeConsultation: true
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, userPath);
          return;
        }
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setUtrNumber('');
      }, 3000);
    } catch (error) {
      // General error handling if needed
      console.error("Booking Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-indigo-deep/80 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="bg-indigo-deep p-6 text-white flex justify-between items-center sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold-metallic rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-indigo-deep" />
              </div>
              <h2 className="text-2xl font-serif">Secure Booking</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-8">
            {success ? (
              <div className="text-center py-12">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-12 h-12" />
                </motion.div>
                <h3 className="text-2xl font-serif text-indigo-deep mb-2">Booking Received!</h3>
                <p className="text-indigo-deep/60">
                  {isFree 
                    ? "Your request for a free session is received. We'll confirm it shortly." 
                    : "Your payment is being verified. You'll receive a confirmation soon."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Step 1: Details */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-deep text-white text-xs flex items-center justify-center font-bold">1</span>
                    <h3 className="font-bold text-indigo-deep uppercase tracking-widest text-sm">Consultation Details</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-indigo-deep/40 uppercase tracking-widest ml-1">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-deep/30" />
                      <input 
                        required
                        type="date" 
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-12 pr-4 py-4 bg-indigo-deep/5 border-none rounded-2xl focus:ring-2 focus:ring-gold-metallic outline-none transition-all"
                        value={formData.date}
                        onChange={e => setFormData({...formData, date: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-indigo-deep/40 uppercase tracking-widest ml-1">Consultation Type</label>
                    <select 
                      className="w-full px-6 py-4 bg-indigo-deep/5 border-none rounded-2xl focus:ring-2 focus:ring-gold-metallic outline-none appearance-none font-medium text-indigo-deep"
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value as any})}
                    >
                      <option value="Detailed Astrology">Detailed Astrology</option>
                      <option value="Vastu Shastra">Vastu Shastra</option>
                      <option value="Numerology">Numerology</option>
                      <option value="Naam Karan">Naam Karan</option>
                      <option value="Psychological Counselling">Psychological Counselling</option>
                      <option value="Astrology + Lal Kitab">Astrology + Lal Kitab</option>
                      <option value="Meditation & Healing">Meditation & Healing</option>
                      <option value="Nakshatras">Nakshatras</option>
                    </select>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-indigo-deep/5 rounded-3xl p-6 border border-indigo-deep/10">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-indigo-deep uppercase tracking-widest text-xs">Order Summary</h4>
                    {isFree && (
                      <span className="bg-gold-metallic text-indigo-deep text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-tighter">
                        First Time Offer
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-indigo-deep/60 text-sm">{formData.type} Consultation</span>
                    <span className="text-2xl font-serif text-indigo-deep">
                      {isFree ? '₹0' : '₹2,000'}
                    </span>
                  </div>
                </div>

                {/* Step 2: Payment (Only for Paid) */}
                {!isFree && (
                  <div className="space-y-6 pt-4 border-t border-indigo-deep/5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-deep text-white text-xs flex items-center justify-center font-bold">2</span>
                      <h3 className="font-bold text-indigo-deep uppercase tracking-widest text-sm">Secure Payment</h3>
                    </div>

                    <div className="bg-white border-2 border-indigo-deep/5 rounded-[32px] p-8 shadow-xl text-center space-y-6">
                      <p className="text-sm font-medium text-indigo-deep/60">Secure Direct UPI Transfer to Meenu Talwar</p>
                      
                      <div className="relative inline-block p-4 bg-white rounded-3xl shadow-inner border border-indigo-deep/5">
                        <img 
                          src="/gpay-qr.png" 
                          alt="GPay QR Code" 
                          className="w-48 h-48 mx-auto rounded-xl"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            // Fallback if image doesn't exist
                            (e.target as HTMLImageElement).src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=meenutalwar.talwar@oksbi%26pn=Meenu%20Talwar%26cu=INR';
                          }}
                        />
                      </div>

                      <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center gap-2 bg-indigo-deep/5 px-4 py-2 rounded-full border border-indigo-deep/10">
                          <span className="font-mono font-bold text-indigo-deep">{upiId}</span>
                          <button 
                            type="button"
                            onClick={handleCopyUPI}
                            className="p-1 hover:bg-indigo-deep/10 rounded-full transition-all text-gold-metallic"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        {copySuccess && (
                          <motion.span 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[10px] font-bold text-green-600 uppercase tracking-widest"
                          >
                            Copied to clipboard!
                          </motion.span>
                        )}
                      </div>

                      <a 
                        href="upi://pay?pa=meenutalwar.talwar@oksbi&pn=Meenu%20Talwar&cu=INR"
                        className="w-full btn-gold !py-4 flex items-center justify-center gap-2 group"
                      >
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        Click to Pay via any UPI App
                      </a>
                      <p className="text-[10px] text-indigo-deep/40 italic">(Mobile only)</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-deep text-white text-xs flex items-center justify-center font-bold">3</span>
                        <h3 className="font-bold text-indigo-deep uppercase tracking-widest text-sm">Verify Transaction</h3>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-indigo-deep/60 uppercase tracking-widest ml-1">12-Digit UTR / Transaction Number</label>
                        <input 
                          required={!isFree}
                          type="text" 
                          maxLength={12}
                          placeholder="Enter 12-digit number"
                          className="w-full px-6 py-4 bg-indigo-deep/5 border-none rounded-2xl focus:ring-2 focus:ring-gold-metallic outline-none transition-all font-mono text-center tracking-[0.2em]"
                          value={utrNumber}
                          onChange={e => setUtrNumber(e.target.value.replace(/\D/g, ''))}
                        />
                        <p className="text-[10px] text-indigo-deep/40 text-center">After payment, please verify your transaction above.</p>
                      </div>
                    </div>
                  </div>
                )}

                <button 
                  disabled={loading}
                  type="submit" 
                  className="w-full btn-gold !py-5 flex items-center justify-center gap-2 text-lg"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirm Booking'}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BookingModal;
