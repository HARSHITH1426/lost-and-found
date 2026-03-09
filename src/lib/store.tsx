
"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, useAuth } from '@/firebase';
import { collection, query, doc, getDoc, where } from 'firebase/firestore';
import { UserProfile, LostItemReport, FoundItemRecord, OwnershipClaim, UserRole } from './types';
import { setDocumentNonBlocking, addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { signInAnonymously, signOut } from 'firebase/auth';

interface DatabaseState {
  currentUser: UserProfile | null;
  lostItems: LostItemReport[];
  foundItems: FoundItemRecord[];
  claims: OwnershipClaim[];
  isLoading: boolean;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  addLostItem: (data: Partial<LostItemReport>) => void;
  addFoundItem: (data: Partial<FoundItemRecord>) => void;
  createClaim: (data: any) => void;
  updateClaimStatus: (claimId: string, status: OwnershipClaim['status']) => void;
}

const StoreContext = createContext<DatabaseState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Lost and Found items are public read in security rules
  const lostQuery = useMemoFirebase(() => query(collection(db, 'lost_items')), [db]);
  const foundQuery = useMemoFirebase(() => query(collection(db, 'found_items')), [db]);
  
  // Claims require authentication and specific filters for non-staff
  const claimsQuery = useMemoFirebase(() => {
    if (!db || !profile) return null;
    
    // Staff/Admin can see all claims
    if (profile.role === 'STAFF' || profile.role === 'ADMIN') {
      return collection(db, 'claims');
    }
    
    // Regular users can only see their own claims (matches security rule requirement)
    return query(collection(db, 'claims'), where('claimingUserId', '==', profile.id));
  }, [db, profile]);

  const { data: lostItems, isLoading: loadingLost } = useCollection<LostItemReport>(lostQuery);
  const { data: foundItems, isLoading: loadingFound } = useCollection<FoundItemRecord>(foundQuery);
  const { data: claims, isLoading: loadingClaims } = useCollection<OwnershipClaim>(claimsQuery);

  useEffect(() => {
    if (user && db) {
      const userRef = doc(db, 'users', user.uid);
      getDoc(userRef).then(snap => {
        if (snap.exists()) {
          setProfile(snap.data() as UserProfile);
        }
      });
    } else {
      setProfile(null);
    }
  }, [user, db]);

  const login = (email: string, role: UserRole) => {
    signInAnonymously(auth).then(({ user: firebaseUser }) => {
      const profileData: UserProfile = {
        id: firebaseUser.uid,
        email,
        displayName: email.split('@')[0],
        role,
        createdAt: new Date().toISOString()
      };
      setDocumentNonBlocking(doc(db, 'users', firebaseUser.uid), profileData, { merge: true });
      setProfile(profileData);
    });
  };

  const logout = () => signOut(auth);

  const addLostItem = (data: Partial<LostItemReport>) => {
    if (!user || !db) return;
    const report: Omit<LostItemReport, 'id'> = {
      category: data.category || 'Other',
      title: data.title || '',
      description: data.description || '',
      location: data.location || '',
      date: data.date || new Date().toISOString().split('T')[0],
      reportedByUserId: user.uid,
      status: 'OPEN',
      createdAt: new Date().toISOString()
    };
    addDocumentNonBlocking(collection(db, 'lost_items'), report);
  };

  const addFoundItem = (data: Partial<FoundItemRecord>) => {
    if (!user || !db) return;
    const record: Omit<FoundItemRecord, 'id'> = {
      category: data.category || 'Other',
      title: data.title || '',
      description: data.description || '',
      location: data.location || '',
      date: data.date || new Date().toISOString().split('T')[0],
      registeredByUserId: user.uid,
      status: 'OPEN',
      createdAt: new Date().toISOString()
    };
    addDocumentNonBlocking(collection(db, 'found_items'), record);
  };

  const createClaim = (data: any) => {
    if (!user || !db) return;
    const claim: Omit<OwnershipClaim, 'id'> = {
      foundItemId: data.foundItemId,
      claimingUserId: user.uid,
      userName: profile?.displayName || data.userName || 'Unknown',
      description: data.description || '',
      status: 'PENDING',
      date: new Date().toISOString()
    };
    addDocumentNonBlocking(collection(db, 'claims'), claim);
  };

  const updateClaimStatus = (claimId: string, status: OwnershipClaim['status']) => {
    if (!db) return;
    const claimRef = doc(db, 'claims', claimId);
    updateDocumentNonBlocking(claimRef, { status });
    
    if (status === 'APPROVED') {
      const claim = claims?.find(c => c.id === claimId);
      if (claim) {
        const itemRef = doc(db, 'found_items', claim.foundItemId);
        updateDocumentNonBlocking(itemRef, { status: 'CLAIMED' });
      }
    }
  };

  return (
    <StoreContext.Provider value={{
      currentUser: profile,
      lostItems: lostItems || [],
      foundItems: foundItems || [],
      claims: claims || [],
      isLoading: loadingLost || loadingFound || (loadingClaims && !!profile),
      login,
      logout,
      addLostItem,
      addFoundItem,
      createClaim,
      updateClaimStatus
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useApp() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useApp requires AppProvider');
  return context;
}
