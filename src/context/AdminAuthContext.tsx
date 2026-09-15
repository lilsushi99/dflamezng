import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types/admin';
import { adminApiService } from '../services/adminApiService';

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Session state lives entirely in the httpOnly cookie the server set on
    // login, so we simply ask the server who (if anyone) it belongs to.
    const checkAuth = async () => {
      try {
        const currentUser = await adminApiService.getMe();
        setUser(currentUser);
      } catch (err) {
        console.error('Failed to verify admin auth session:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    const result = await adminApiService.login(username, password);
    setUser(result.admin);
  };

  const logout = async () => {
    try {
      await adminApiService.logout();
    } catch (e) {
      console.warn('Logout error:', e);
    }
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
