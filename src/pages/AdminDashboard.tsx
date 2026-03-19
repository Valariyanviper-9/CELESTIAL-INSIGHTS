import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, onSnapshot, orderBy, updateDoc, doc, deleteDoc, getDocs } from 'firebase/firestore';
import { Appointment, UserProfile } from '../types';
import { 
  Calendar, Clock, Star, Loader2, CheckCircle2, 
  AlertCircle, ShieldCheck, User as UserIcon, Trash2, 
  Users, LayoutDashboard, Home, Settings, Search
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { user, profile, isAdmin } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'appointments' | 'users'>('appointments');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user || !isAdmin) return;

    // Fetch Appointments
    const qApts = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
    const unsubscribeApts = onSnapshot(qApts, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
      setAppointments(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'appointments');
    });

    // Fetch Users
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const userDocs = querySnapshot.docs.map(doc => doc.data() as UserProfile);
        setUsers(userDocs);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();

    return () => unsubscribeApts();
  }, [user, isAdmin]);

  const handleStatusUpdate = async (appointmentId: string, newStatus: Appointment['status']) => {
    try {
      await updateDoc(doc(db, 'appointments', appointmentId), { status: newStatus });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `appointments/${appointmentId}`);
    }
  };

  const handleDelete = async (appointmentId: string) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await deleteDoc(doc(db, 'appointments', appointmentId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `appointments/${appointmentId}`);
    }
  };

  const filteredAppointments = appointments.filter(apt => 
    apt.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.consultationType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-deep text-white p-6">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-3xl font-serif mb-2">Access Denied</h2>
          <p className="text-white/60 mb-6">You do not have administrative privileges to view this page.</p>
          <Link to="/" className="btn-gold">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <main className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="bg-gold-metallic p-3 rounded-2xl shadow-lg">
            <ShieldCheck className="w-8 h-8 text-indigo-deep" />
          </div>
          <div>
            <h1 className="text-4xl font-serif font-bold text-indigo-deep tracking-tight">Admin Control Center</h1>
            <p className="text-xs text-gold-metallic font-bold uppercase tracking-widest">Celestial Insights Management</p>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-indigo-deep/5 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-deep/5 rounded-2xl flex items-center justify-center text-indigo-deep">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-deep/40 uppercase tracking-widest">Total Bookings</p>
              <p className="text-2xl font-serif text-indigo-deep">{appointments.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-indigo-deep/5 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-deep/5 rounded-2xl flex items-center justify-center text-indigo-deep">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-deep/40 uppercase tracking-widest">Total Seekers</p>
              <p className="text-2xl font-serif text-indigo-deep">{users.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-indigo-deep/5 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-deep/5 rounded-2xl flex items-center justify-center text-indigo-deep">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-deep/40 uppercase tracking-widest">Pending Verification</p>
              <p className="text-2xl font-serif text-indigo-deep">
                {appointments.filter(a => a.status === 'pending' || a.status === 'Pending Verification').length}
              </p>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="bg-white rounded-[40px] shadow-sm border border-indigo-deep/5 overflow-hidden">
          <div className="flex border-b border-indigo-deep/5">
            <button 
              onClick={() => setActiveTab('appointments')}
              className={`flex-1 py-6 font-bold text-sm uppercase tracking-widest transition-all ${activeTab === 'appointments' ? 'bg-indigo-deep text-white' : 'hover:bg-indigo-deep/5 text-indigo-deep/40'}`}
            >
              Appointments Management
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-6 font-bold text-sm uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-indigo-deep text-white' : 'hover:bg-indigo-deep/5 text-indigo-deep/40'}`}
            >
              Seekers Directory
            </button>
          </div>

          <div className="p-8">
            {/* Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-deep/20" />
              <input 
                type="text" 
                placeholder={`Search ${activeTab}...`}
                className="w-full pl-12 pr-4 py-4 bg-indigo-deep/5 rounded-2xl outline-none focus:ring-2 focus:ring-gold-metallic transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-gold-metallic" />
              </div>
            ) : activeTab === 'appointments' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-indigo-deep/5">
                      <th className="pb-4 text-xs font-bold text-indigo-deep/40 uppercase tracking-widest">Seeker</th>
                      <th className="pb-4 text-xs font-bold text-indigo-deep/40 uppercase tracking-widest">Consultation</th>
                      <th className="pb-4 text-xs font-bold text-indigo-deep/40 uppercase tracking-widest">Date</th>
                      <th className="pb-4 text-xs font-bold text-indigo-deep/40 uppercase tracking-widest">Status</th>
                      <th className="pb-4 text-xs font-bold text-indigo-deep/40 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-deep/5">
                    {filteredAppointments.map((apt) => (
                      <tr key={apt.id} className="group">
                        <td className="py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-deep/5 rounded-full flex items-center justify-center text-indigo-deep font-serif">
                              {apt.userName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-indigo-deep">{apt.userName}</p>
                              <p className="text-[10px] font-mono text-indigo-deep/40">ID: {apt.userId.slice(0, 8)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-6">
                          <p className="font-serif text-indigo-deep">{apt.consultationType}</p>
                          <p className="text-xs text-indigo-deep/40">₹{apt.priceCharged}</p>
                        </td>
                        <td className="py-6">
                          <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-1 text-xs text-indigo-deep/60">
                              <Calendar className="w-3 h-3" />
                              {new Date(apt.date).toLocaleDateString()}
                            </span>
                            {apt.time && (
                              <span className="flex items-center gap-1 text-xs text-indigo-deep/60">
                                <Clock className="w-3 h-3" />
                                {apt.time}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            (apt.status === 'confirmed' || apt.status === 'Confirmed') ? 'bg-green-100 text-green-600' :
                            (apt.status === 'pending' || apt.status === 'Pending Verification') ? 'bg-amber-100 text-amber-600' :
                            'bg-indigo-deep/5 text-indigo-deep/40'
                          }`}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="py-6">
                          <div className="flex items-center gap-2">
                            <select 
                              onChange={(e) => handleStatusUpdate(apt.id!, e.target.value as any)}
                              className="text-[10px] font-bold uppercase tracking-widest bg-indigo-deep/5 border-none rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-gold-metallic"
                              value={apt.status}
                            >
                              <option value="pending">Pending</option>
                              <option value="Pending Verification">Verification</option>
                              <option value="Confirmed">Confirm</option>
                              <option value="completed">Complete</option>
                              <option value="cancelled">Cancel</option>
                            </select>
                            <button 
                              onClick={() => handleDelete(apt.id!)}
                              className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((u, i) => (
                  <div key={i} className="p-6 rounded-3xl border border-indigo-deep/5 hover:border-gold-metallic/30 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-indigo-deep rounded-2xl flex items-center justify-center text-gold-metallic text-xl font-serif">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-serif text-indigo-deep">{u.name}</h4>
                        <p className="text-xs text-indigo-deep/40">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-indigo-deep/60">
                      <span>Role: {u.role}</span>
                      <span>Joined: {new Date(u.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
