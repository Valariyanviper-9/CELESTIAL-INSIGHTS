export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  hasUsedFreeConsultation: boolean;
  createdAt: string;
}

export interface Appointment {
  id?: string;
  userId: string;
  userName: string;
  date: string;
  time: string;
  consultationType: 'Vastu Shastra' | 'Numerology' | 'Detailed Astrology';
  priceCharged: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'Pending Verification' | 'Confirmed';
  utrNumber?: string;
  createdAt: string;
}
