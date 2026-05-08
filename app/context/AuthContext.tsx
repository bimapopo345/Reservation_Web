import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  nik: string;
  name: string;
  role: 'user' | 'admin';
  employeeCode?: string;
  position?: string;
}

interface AuthContextType {
  user: User | null;
  login: (nik: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (nik: string, password: string): boolean => {
    // Mock authentication
    if (nik === '456' && password === 'demo') {
      const userData: User = {
        nik: '456',
        name: 'Fauzi Ramdani',
        role: 'user',
        employeeCode: '04148',
        position: 'Software Engineer (Non-Financial) Sr Staff',
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    } else if (nik === '567' && password === 'demo') {
      const userData: User = {
        nik: '567',
        name: 'Fauzi Ramdani',
        role: 'admin',
        employeeCode: '04148',
        position: 'Software Engineer (Non-Financial) Sr Staff',
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
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
