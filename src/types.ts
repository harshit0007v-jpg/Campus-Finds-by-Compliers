export type ItemType = 'lost' | 'found';

export type ItemStatus = 
  | 'reported'        // Initial report
  | 'potential_match' // AI found high-similarity counterpart
  | 'deposited'       // Finder brought item to Campus Security/L&F Office
  | 'verified'        // Claimant answered hidden private questions correctly
  | 'recovered';      // Staff scanned QR, confirmed student ID, handed over item

export type ItemCategory = 
  | 'Electronics'
  | 'ID & Cards'
  | 'Wallets & Bags'
  | 'Keys'
  | 'Accessories'
  | 'Books & Study'
  | 'Clothing'
  | 'Bottles & Containers'
  | 'Other';

export type CampusArea = 
  | 'Library'
  | 'Block 33'
  | 'Block 34'
  | 'Cafeteria'
  | 'Hostel'
  | 'Academic Block'
  | 'Sports Complex'
  | 'Student Center'
  | 'Computer Labs';

export interface CampusItem {
  id: string; // e.g. CF-2026-8941
  type: ItemType;
  title: string;
  category: ItemCategory;
  area: CampusArea;
  locationDetail: string;
  date: string;
  time: string;
  description: string;
  imageUrl: string;
  status: ItemStatus;
  
  // Anti-cheating & Hidden details (NEVER shown publicly)
  hiddenDetails: {
    questionPrompt: string; // e.g. "What is the lock screen wallpaper or back sticker?"
    correctAnswer: string;   // e.g. "Sticker of Baby Yoda on top lid"
    serialOrSecretNotes?: string;
  };

  // Ownership & Office custody
  reportedBy: {
    name: string;
    studentId: string;
    email: string;
    trustScore: number;
  };
  finderEmail?: string; // Direct email of person who found the item
  reporterEmail?: string; // Contact email of the reporter
  matchedItemId?: string; // id of corresponding lost/found item
  matchPercentage?: number;
  officeLockerId?: string; // e.g. "Locker B-14"
  depositDate?: string;
  recoveredDate?: string;
  qrHandoverCode?: string; // generated when deposited
  rewardPoints: number;
  rewardClaimed: boolean;
}

export interface AIMatchAnalysis {
  lostItemId: string;
  foundItemId: string;
  matchScore: number; // e.g. 94%
  visualSimilarity: number;
  categoryMatch: boolean;
  locationProximityScore: number;
  timeDeltaHours: number;
  matchingPoints: string[];
  riskAnalysis: string;
}

export interface VerificationAttempt {
  itemId: string;
  claimantStudentId: string;
  claimantName: string;
  answerSubmitted: string;
  status: 'pending' | 'verified' | 'failed';
  timestamp: string;
  feedback?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'match' | 'deposit' | 'verification' | 'recovery' | 'reward';
  relatedItemId?: string;
}

export interface UserProfile {
  name: string;
  studentId: string;
  email: string;
  department: string;
  year: string;
  trustScore: number; // e.g. 98 out of 100
  verifiedStudent: boolean;
  rewardBalance: number;
  itemsReportedCount: number;
  itemsRecoveredCount: number;
}

export type AppTab = 
  | 'home' 
  | 'lost' 
  | 'found' 
  | 'browse' 
  | 'my_reports' 
  | 'notifications' 
  | 'profile' 
  | 'office';

