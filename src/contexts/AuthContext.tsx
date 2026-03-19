import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const ADMIN_EMAILS = [
  'himanshu.sabharwal9@gmail.com',
  'meenutalwar.talwar@gmail.com',
  'himanshu.devilking@gmail.com'
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext: Setting up onAuthStateChanged');
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('AuthContext: Auth state changed:', firebaseUser?.email);
      setUser(firebaseUser);
      if (!firebaseUser) {
        setProfile(null);
        setLoading(false);
      } else {
        // We have a user, but we need to wait for the profile
        setLoading(true);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      console.log('AuthContext: No user, skipping profile fetch');
      return;
    }

    console.log('AuthContext: Fetching profile for:', user.uid);
    setLoading(true);
    const path = `users/${user.uid}`;
    const unsubscribeProfile = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        console.log('AuthContext: Profile loaded:', data.role);
        setProfile(data);
      } else {
        console.log('AuthContext: No profile found in Firestore');
        // If no profile exists yet, we still set loading to false
        // createProfile will eventually create it and trigger this again
        setProfile(null);
      }
      setLoading(false);
    }, (error) => {
      console.error('AuthContext: Profile fetch error:', error);
      // Don't throw here, just log and set loading false to avoid crashing the app
      // handleFirestoreError(error, OperationType.GET, path);
      setLoading(false);
    });

    return () => unsubscribeProfile();
  }, [user]);

  const createProfile = async (user: User, name?: string) => {
    const path = `users/${user.uid}`;
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      const role = ADMIN_EMAILS.includes(user.email || '') ? 'admin' : 'user';

      if (!docSnap.exists()) {
        const newProfile: UserProfile = {
          uid: user.uid,
          name: name || user.displayName || 'User',
          email: user.email || '',
          hasUsedFreeConsultation: false,
          createdAt: new Date().toISOString(),
          role,
          photoURL: user.photoURL || ''
        };
        await setDoc(docRef, newProfile);
      } else {
        const existingData = docSnap.data() as UserProfile;
        if (existingData.role !== role) {
          await setDoc(docRef, { role }, { merge: true });
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await createProfile(result.user);
    } catch (error) {
      console.error("Google Sign In Error:", error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      await createProfile(result.user);
    } catch (error) {
      console.error("Email Sign In Error:", error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(result.user, { displayName: name });
      await createProfile(result.user, name);
    } catch (error) {
      console.error("Email Sign Up Error:", error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const isAdmin = profile?.role === 'admin' || (!!user && user.emailVerified && ADMIN_EMAILS.includes(user.email || ''));
  
  console.log('AuthContext State:', { 
    hasUser: !!user, 
    hasProfile: !!profile, 
    loading, 
    isAdmin,
    email: user?.email 
  });

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
