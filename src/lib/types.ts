
export type UserRole = 'USER' | 'STAFF' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type ItemStatus = 'OPEN' | 'CLOSED' | 'CLAIMED' | 'PENDING';

export interface BaseItem {
  id: string;
  category: string;
  keywords: string;
  description: string;
  location: string;
  date: string;
  status: ItemStatus;
  reportedBy: string; // User ID
}

export interface LostItem extends BaseItem {
  type: 'LOST';
}

export interface FoundItem extends BaseItem {
  type: 'FOUND';
}

export interface Claim {
  id: string;
  foundItemId: string;
  userId: string;
  userName: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date: string;
}
