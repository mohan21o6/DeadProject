import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role?: string) => Promise<boolean>;
  signup: (userData: Partial<User>) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  toggleSaveProject: (projectId: string) => void;
  isProjectSaved: (projectId: string) => boolean;
}

const DEFAULT_USER: User = {
  id: 'u-100',
  name: 'Devansh Reddy',
  email: 'devansh@deadproject.in',
  role: 'developer',
  institution: 'IIT Madras',
  state: 'Tamil Nadu',
  city: 'Chennai',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
  bio: 'Full-stack developer and AI researcher passionate about edge computing and IoT.',
  skills: ['React', 'TypeScript', 'Python', 'Node.js', 'PyTorch', 'MongoDB'],
  savedProjects: ['proj-1', 'proj-7', 'proj-8'],
  createdAt: '2024-01-01T00:00:00Z'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('deadproject_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_USER;
      }
    }
    return DEFAULT_USER;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('deadproject_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('deadproject_user');
    }
  }, [user]);

  const login = async (email: string, role = 'developer'): Promise<boolean> => {
    // Demo login simulation
    const name = email.split('@')[0].replace('.', ' ').toUpperCase();
    const newUser: User = {
      ...DEFAULT_USER,
      email,
      name: name || 'Demo User',
      role: (role as any) || (email.includes('admin') ? 'admin' : 'developer'),
      institution: email.includes('admin') ? 'DeadProject National Council' : 'IIT Bombay'
    };
    setUser(newUser);
    return true;
  };

  const signup = async (userData: Partial<User>): Promise<boolean> => {
    const newUser: User = {
      id: 'u-' + Date.now(),
      name: userData.name || 'New Innovator',
      email: userData.email || 'user@example.com',
      role: userData.role || 'developer',
      institution: userData.institution || 'Indian Institute of Technology',
      state: userData.state || 'Maharashtra',
      city: userData.city || 'Mumbai',
      avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name || 'innovator'}`,
      bio: userData.bio || 'Tech enthusiast and project builder.',
      skills: userData.skills || ['JavaScript', 'Python'],
      savedProjects: [],
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  const toggleSaveProject = (projectId: string) => {
    if (!user) return;
    const isSaved = user.savedProjects.includes(projectId);
    const updated = isSaved
      ? user.savedProjects.filter(id => id !== projectId)
      : [...user.savedProjects, projectId];
    setUser({ ...user, savedProjects: updated });
  };

  const isProjectSaved = (projectId: string): boolean => {
    return user?.savedProjects.includes(projectId) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateProfile,
        toggleSaveProject,
        isProjectSaved
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
