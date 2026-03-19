export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  hasUsedFreeConsultation: boolean;
  createdAt: string;
  role?: 'admin' | 'user';
  photoURL?: string;
}

export interface Appointment {
  id?: string;
  userId: string;
  userName: string;
  date: string;
  time?: string;
  consultationType: 'Vastu Shastra' | 'Numerology' | 'Detailed Astrology' | 'Naam Karan' | 'Psychological Counselling' | 'Astrology + Lal Kitab' | 'Meditation & Healing' | 'Nakshatras';
  priceCharged: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'Pending Verification' | 'Confirmed';
  utrNumber?: string;
  createdAt: string;
}
