import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Appointment } from '../types';
import { Calendar, Clock, Star, Plus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import BookingModal from '../components/BookingModal';

const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'appointments'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const path = 'appointments';
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
      setAppointments(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-gold-metallic" />
    </div>
  );

  return (
    <div className="min-h-screen bg-indigo-deep/5 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-serif text-indigo-deep mb-2">Namaste, {profile.name}</h1>
            <p className="text-indigo-deep/60">Manage your cosmic consultations and spiritual journey.</p>
          </div>
          <button 
            onClick={() => setIsBookingOpen(true)}
            className="btn-gold flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Book New Session
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats / Profile Card */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-indigo-deep/5">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-indigo-deep rounded-2xl flex items-center justify-center text-gold-metallic text-2xl font-serif">
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-serif text-indigo-deep">{profile.name}</h3>
                  <p className="text-sm text-indigo-deep/40">{profile.email}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-indigo-deep/5 rounded-2xl">
                  <span className="text-sm font-bold text-indigo-deep/60 uppercase tracking-widest">Free Session</span>
                  {profile.hasUsedFreeConsultation ? (
                    <span className="text-xs font-bold text-red-400 uppercase">Used</span>
                  ) : (
                    <span className="text-xs font-bold text-green-500 uppercase">Available</span>
                  )}
                </div>
                <div className="flex justify-between items-center p-4 bg-indigo-deep/5 rounded-2xl">
                  <span className="text-sm font-bold text-indigo-deep/60 uppercase tracking-widest">Total Sessions</span>
                  <span className="text-lg font-serif text-indigo-deep">{appointments.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-indigo-deep rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
              <Star className="absolute -top-4 -right-4 w-24 h-24 text-white/5 rotate-12" />
              <h4 className="text-gold-metallic font-serif text-xl mb-4">Daily Insight</h4>
              <p className="text-white/70 leading-relaxed italic">
                "The stars do not compel us, they incline us. Your destiny is a canvas, and your actions are the brushstrokes."
              </p>
            </div>
          </div>

          {/* Appointments List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-indigo-deep/5 min-h-[500px]">
              <h3 className="text-2xl font-serif text-indigo-deep mb-8">Your Appointments</h3>
              
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-gold-metallic" />
                </div>
              ) : appointments.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-indigo-deep/5 text-indigo-deep/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <p className="text-indigo-deep/40 font-medium">No appointments booked yet.</p>
                  <button 
                    onClick={() => setIsBookingOpen(true)}
                    className="text-gold-metallic font-bold mt-2 hover:underline"
                  >
                    Book your first session now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((apt) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={apt.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl border border-indigo-deep/5 hover:border-gold-metallic/30 transition-all group"
                    >
                      <div className="flex items-start gap-4 mb-4 md:mb-0">
                        <div className="w-12 h-12 bg-gold-metallic/10 rounded-xl flex items-center justify-center text-gold-metallic">
                          <Star className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-serif text-lg text-indigo-deep">{apt.consultationType}</h4>
                          <div className="flex items-center gap-4 text-sm text-indigo-deep/40 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(apt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {apt.time}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-6">
                        <div className="text-right">
                          <p className="text-sm font-bold text-indigo-deep/60 uppercase tracking-widest">Fee</p>
                          <p className="font-serif text-indigo-deep">{apt.priceCharged === 0 ? 'FREE' : `₹${apt.priceCharged}`}</p>
                          {apt.utrNumber && (
                            <p className="text-[10px] font-mono text-indigo-deep/30 mt-1">UTR: {apt.utrNumber}</p>
                          )}
                        </div>
                        <div className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${
                          (apt.status === 'confirmed' || apt.status === 'Confirmed') ? 'bg-green-100 text-green-600' :
                          (apt.status === 'pending' || apt.status === 'Pending Verification') ? 'bg-amber-100 text-amber-600' :
                          'bg-indigo-deep/5 text-indigo-deep/40'
                        }`}>
                          {(apt.status === 'confirmed' || apt.status === 'Confirmed') ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                          {apt.status}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;
