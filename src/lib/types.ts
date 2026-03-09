
/**
 * Core Data Models
 * Defined to support relational database principles in a cloud environment.
 */

export type UserRole = 'USER' | 'STAFF' | 'ADMIN';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
}

export type ItemStatus = 'OPEN' | 'CLOSED' | 'CLAIMED';

export interface LostItemReport {
  id: string;
  category: string;
  title: string;
  description: string;
  location: string;
  date: string;
  reportedByUserId: string;
  status: 'OPEN' | 'CLOSED';
  createdAt: string;
}

export interface FoundItemRecord {
  id: string;
  category: string;
  title: string;
  description: string;
  location: string;
  date: string;
  registeredByUserId: string;
  status: 'OPEN' | 'CLAIMED';
  createdAt: string;
}

export interface OwnershipClaim {
  id: string;
  foundItemId: string;
  claimingUserId: string;
  userName: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date: string;
}
