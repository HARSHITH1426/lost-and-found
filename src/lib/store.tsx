
"use client"

import { useState, useEffect, createContext, useContext } from 'react';
import { User, LostItem, FoundItem, Claim } from './types';

interface AppState {
  currentUser: User | null;
  lostItems: LostItem[];
  foundItems: FoundItem[];
  claims: Claim[];
  login: (email: string, role: 'USER' | 'STAFF' | 'ADMIN') => void;
  logout: () => void;
  addLostItem: (item: Omit<LostItem, 'id' | 'status' | 'type' | 'reportedBy'>) => void;
  addFoundItem: (item: Omit<FoundItem, 'id' | 'status' | 'type' | 'reportedBy'>) => void;
  createClaim: (claim: Omit<Claim, 'id' | 'status' | 'date'>) => void;
  updateClaimStatus: (claimId: string, status: Claim['status']) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [foundItems, setFoundItems] = useState<FoundItem[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);

  // Load initial state
  useEffect(() => {
    const savedUser = localStorage.getItem('sentry_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));

    const savedLost = localStorage.getItem('sentry_lost');
    if (savedLost) setLostItems(JSON.parse(savedLost));

    const savedFound = localStorage.getItem('sentry_found');
    if (savedFound) setFoundItems(JSON.parse(savedFound));

    const savedClaims = localStorage.getItem('sentry_claims');
    if (savedClaims) setClaims(JSON.parse(savedClaims));
  }, []);

  // Save state
  useEffect(() => {
    if (currentUser) localStorage.setItem('sentry_user', JSON.stringify(currentUser));
    else localStorage.removeItem('sentry_user');
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('sentry_lost', JSON.stringify(lostItems));
  }, [lostItems]);

  useEffect(() => {
    localStorage.setItem('sentry_found', JSON.stringify(foundItems));
  }, [foundItems]);

  useEffect(() => {
    localStorage.setItem('sentry_claims', JSON.stringify(claims));
  }, [claims]);

  const login = (email: string, role: 'USER' | 'STAFF' | 'ADMIN') => {
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      email,
      role
    };
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addLostItem = (item: Omit<LostItem, 'id' | 'status' | 'type' | 'reportedBy'>) => {
    if (!currentUser) return;
    const newItem: LostItem = {
      ...item,
      id: `L-${Date.now()}`,
      type: 'LOST',
      status: 'OPEN',
      reportedBy: currentUser.id
    };
    setLostItems(prev => [newItem, ...prev]);
  };

  const addFoundItem = (item: Omit<FoundItem, 'id' | 'status' | 'type' | 'reportedBy'>) => {
    if (!currentUser) return;
    const newItem: FoundItem = {
      ...item,
      id: `F-${Date.now()}`,
      type: 'FOUND',
      status: 'OPEN',
      reportedBy: currentUser.id
    };
    setFoundItems(prev => [newItem, ...prev]);
  };

  const createClaim = (claimData: Omit<Claim, 'id' | 'status' | 'date'>) => {
    const newClaim: Claim = {
      ...claimData,
      id: `C-${Date.now()}`,
      status: 'PENDING',
      date: new Date().toISOString()
    };
    setClaims(prev => [newClaim, ...prev]);
  };

  const updateClaimStatus = (claimId: string, status: Claim['status']) => {
    setClaims(prev => prev.map(c => {
      if (c.id === claimId) {
        if (status === 'APPROVED') {
          setFoundItems(found => found.map(f => f.id === c.foundItemId ? { ...f, status: 'CLAIMED' } : f));
        }
        return { ...c, status };
      }
      return c;
    }));
  };

  return (
    <AppContext.Provider value={{
      currentUser, lostItems, foundItems, claims,
      login, logout, addLostItem, addFoundItem, createClaim, updateClaimStatus
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
