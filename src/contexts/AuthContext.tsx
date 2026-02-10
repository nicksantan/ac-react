import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { auth, database } from '../firebase/config';

const googleProvider = new GoogleAuthProvider();

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  editModeEnabled: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  toggleEditMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editModeEnabled, setEditModeEnabled] = useState(() => {
    const stored = localStorage.getItem('editModeEnabled');
    return stored !== null ? stored === 'true' : true;
  });
  const [loading, setLoading] = useState(true);

  const toggleEditMode = () => {
    setEditModeEnabled(prev => {
      const newValue = !prev;
      localStorage.setItem('editModeEnabled', String(newValue));
      return newValue;
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);

      if (user) {
        // Check admin status in database
        const adminRef = ref(database, `admins/${user.uid}`);
        const adminUnsubscribe = onValue(adminRef, (snapshot) => {
          setIsAdmin(snapshot.val() === true);
          setLoading(false);
        }, () => {
          // Error reading admin status
          setIsAdmin(false);
          setLoading(false);
        });

        return () => adminUnsubscribe();
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, editModeEnabled, loading, loginWithGoogle, logout, toggleEditMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthContext };
