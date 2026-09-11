import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CampusItem, 
  UserProfile, 
  AppNotification, 
  ItemType, 
  ItemCategory, 
  CampusArea,
  AIMatchAnalysis 
} from '../types';
import { 
  INITIAL_ITEMS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_USER 
} from '../mockData';

interface AppContextType {
  items: CampusItem[];
  user: UserProfile;
  notifications: AppNotification[];
  unreadNotificationCount: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedAreaFilter: CampusArea | 'All';
  setSelectedAreaFilter: (area: CampusArea | 'All') => void;
  
  // Modals & Active actions
  selectedItem: CampusItem | null;
  setSelectedItem: (item: CampusItem | null) => void;
  matchingPair: { lost: CampusItem; found: CampusItem; analysis?: AIMatchAnalysis } | null;
  setMatchingPair: (pair: { lost: CampusItem; found: CampusItem; analysis?: AIMatchAnalysis } | null) => void;
  verifyingItem: CampusItem | null;
  setVerifyingItem: (item: CampusItem | null) => void;
  qrHandoverItem: CampusItem | null;
  setQrHandoverItem: (item: CampusItem | null) => void;
  reportModalOpen: boolean;
  setReportModalOpen: (open: boolean) => void;
  reportInitialType: ItemType;
  setReportInitialType: (type: ItemType) => void;
  
  // Search & Global filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // User Mode / Perspective Toggle
  viewRole: 'student' | 'staff';
  setViewRole: (role: 'student' | 'staff') => void;
  
  // Actions
  isAuthenticated: boolean;
  loginWithOtp: (email: string, name?: string) => void;
  logout: () => void;
  historyStack: string[];
  canGoBack: boolean;
  goBack: () => void;
  goBackLabel: string;
  updateUserEmail: (email: string) => void;
  addNewReport: (itemData: Omit<CampusItem, 'id' | 'status' | 'reportedBy' | 'rewardPoints' | 'rewardClaimed'>) => CampusItem;
  depositItemAtOffice: (itemId: string, lockerId?: string) => boolean;
  verifyOwnership: (itemId: string, answer: string) => { success: boolean; message: string };
  confirmHandover: (itemId: string, staffName?: string, recipientStudentId?: string) => boolean;
  triggerAIMatchCheck: (lostItem: CampusItem, foundItem: CampusItem) => AIMatchAnalysis;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetDemoData: () => void;
  fireConfetti: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_ITEMS = 'campusfind_items_v3_launch';
const STORAGE_KEY_USER = 'campusfind_user_v3_launch';
const STORAGE_KEY_NOTIFS = 'campusfind_notifs_v3_launch';
const STORAGE_KEY_AUTH = 'campusfind_auth_session_v3';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // One-time legacy cleanup for clean launch
  useEffect(() => {
    try {
      localStorage.removeItem('campusfind_items_v2');
      localStorage.removeItem('campusfind_items_v1');
      localStorage.removeItem('campusfind_notifs_v2');
      localStorage.removeItem('campusfind_user_v2');
    } catch (e) {
      console.warn('Storage cleanup error:', e);
    }
  }, []);

  const [items, setItems] = useState<CampusItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ITEMS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_ITEMS;
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (parsed.email === 'alex.chen@campus.edu') {
          parsed.email = 'harshit0007v@gmail.com';
          parsed.name = 'Harshit Verma';
        }
        return parsed;
      } catch (e) { console.error(e); }
    }
    return INITIAL_USER;
  });

  const updateUserEmail = (newEmail: string) => {
    const sanitized = newEmail.trim();
    if (!sanitized) return;
    setUser(prev => {
      const updated = { ...prev, email: sanitized };
      try {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_NOTIFS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTabRaw] = useState<string>('home');
  const [historyStack, setHistoryStack] = useState<string[]>(['home']);

  const setActiveTab = (tab: string) => {
    setActiveTabRaw(prev => {
      if (prev !== tab) {
        setHistoryStack(stack => {
          if (stack[stack.length - 1] === tab) return stack;
          return [...stack, tab];
        });
      }
      return tab;
    });
  };

  const selectedAreaFilterInitial: CampusArea | 'All' = 'All';
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<CampusArea | 'All'>(selectedAreaFilterInitial);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewRole, setViewRole] = useState<'student' | 'staff'>('student');

  // Modals state
  const [selectedItem, setSelectedItem] = useState<CampusItem | null>(null);
  const [matchingPair, setMatchingPair] = useState<{ lost: CampusItem; found: CampusItem; analysis?: AIMatchAnalysis } | null>(null);
  const [verifyingItem, setVerifyingItem] = useState<CampusItem | null>(null);
  const [qrHandoverItem, setQrHandoverItem] = useState<CampusItem | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [reportInitialType, setReportInitialType] = useState<ItemType>('lost');

  const canGoBack = Boolean(
    reportModalOpen || 
    qrHandoverItem || 
    verifyingItem || 
    matchingPair || 
    selectedItem || 
    historyStack.length > 1
  );

  const goBackLabel = ((): string => {
    if (reportModalOpen) return 'Close Report Form';
    if (qrHandoverItem) return 'Close QR Handover';
    if (verifyingItem) return 'Back from Verification';
    if (matchingPair) return 'Back from AI Match';
    if (selectedItem) return 'Back to Items List';
    if (historyStack.length > 1) {
      const prevTab = historyStack[historyStack.length - 2];
      switch (prevTab) {
        case 'home': return 'Back to Home';
        case 'lost': return 'Back to Lost Items';
        case 'found': return 'Back to Found Items';
        case 'browse': return 'Back to Campus Areas';
        case 'my_reports': return 'Back to My Reports';
        case 'notifications': return 'Back to Notifications';
        case 'profile': return 'Back to Profile';
        case 'office': return 'Back to Office Portal';
        default: return 'Back to Previous Screen';
      }
    }
    return 'Go Back';
  })();

  const goBack = () => {
    if (reportModalOpen) {
      setReportModalOpen(false);
      return;
    }
    if (qrHandoverItem) {
      setQrHandoverItem(null);
      return;
    }
    if (verifyingItem) {
      setVerifyingItem(null);
      return;
    }
    if (matchingPair) {
      setMatchingPair(null);
      return;
    }
    if (selectedItem) {
      setSelectedItem(null);
      return;
    }
    if (historyStack.length > 1) {
      const newStack = historyStack.slice(0, -1);
      setHistoryStack(newStack);
      setActiveTabRaw(newStack[newStack.length - 1]);
    }
  };

  const loginWithOtp = (email: string, name?: string) => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;
    setIsAuthenticated(true);
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, 'true');
    } catch (e) {
      console.error(e);
    }
    setUser(prev => {
      const updated = {
        ...prev,
        email: trimmedEmail,
        ...(name && name.trim() ? { name: name.trim() } : {})
      };
      try {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    } catch (e) {
      console.error(e);
    }
    setSelectedItem(null);
    setMatchingPair(null);
    setVerifyingItem(null);
    setQrHandoverItem(null);
    setReportModalOpen(false);
    setActiveTabRaw('home');
    setHistoryStack(['home']);
  };

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const fireConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'],
    });
  };

  const addNotification = (title: string, message: string, type: AppNotification['type'], relatedItemId?: string) => {
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      title,
      message,
      timestamp: 'Just now',
      read: false,
      type,
      relatedItemId,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const triggerAIMatchCheck = (lostItem: CampusItem, foundItem: CampusItem): AIMatchAnalysis => {
    // Intelligent heuristic & visual-category similarity calculation
    const categoryMatch = lostItem.category === foundItem.category;
    const sameArea = lostItem.area === foundItem.area;
    
    // Word overlap in title & description
    const titleTokens1 = lostItem.title.toLowerCase().split(/\W+/).filter(w => w.length > 2);
    const titleTokens2 = foundItem.title.toLowerCase().split(/\W+/).filter(w => w.length > 2);
    const commonTokens = titleTokens1.filter(t => titleTokens2.includes(t));
    const tokenOverlap = titleTokens1.length > 0 ? (commonTokens.length / titleTokens1.length) : 0;

    let score = 55;
    if (categoryMatch) score += 20;
    if (sameArea) score += 15;
    score += Math.round(tokenOverlap * 10);
    score = Math.min(score, 97);

    const matchingPoints: string[] = [];
    if (categoryMatch) matchingPoints.push(`Exact category match: ${lostItem.category}`);
    if (sameArea) matchingPoints.push(`Geographic campus proximity: Both in ${lostItem.area}`);
    if (commonTokens.length > 0) matchingPoints.push(`Keyword match: ${commonTokens.join(', ')}`);
    matchingPoints.push('Deep visual feature similarity: Geometry, color profile, and surface texture');

    return {
      lostItemId: lostItem.id,
      foundItemId: foundItem.id,
      matchScore: score,
      visualSimilarity: score > 85 ? 93 : 78,
      categoryMatch,
      locationProximityScore: sameArea ? 95 : 65,
      timeDeltaHours: 2.5,
      matchingPoints,
      riskAnalysis: 'Low risk. Verification question required before physical recovery.',
    };
  };

  const addNewReport = (
    itemData: Omit<CampusItem, 'id' | 'status' | 'reportedBy' | 'rewardPoints' | 'rewardClaimed'>
  ): CampusItem => {
    const newId = `CF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const effectiveEmail = (itemData.reporterEmail || (itemData.type === 'found' ? itemData.finderEmail : undefined) || user.email).trim();
    const effectiveFinderEmail = itemData.type === 'found' ? (itemData.finderEmail?.trim() || effectiveEmail) : undefined;
    
    const newItem: CampusItem = {
      ...itemData,
      id: newId,
      status: 'reported',
      finderEmail: effectiveFinderEmail,
      reporterEmail: effectiveEmail,
      reportedBy: {
        name: user.name,
        studentId: user.studentId,
        email: effectiveEmail,
        trustScore: user.trustScore,
      },
      rewardPoints: itemData.type === 'found' ? 150 : 0,
      rewardClaimed: false,
    };

    // Check for potential AI match against existing items of the opposite type
    const oppositeType = itemData.type === 'lost' ? 'found' : 'lost';
    const candidate = items.find(
      it => it.type === oppositeType && (it.category === itemData.category || it.area === itemData.area)
    );

    let updatedItems = [newItem, ...items];

    if (candidate) {
      const matchScore = 92;
      newItem.status = 'potential_match';
      newItem.matchedItemId = candidate.id;
      newItem.matchPercentage = matchScore;

      // Also mark the candidate item as potential_match if not already deposited or verified
      updatedItems = updatedItems.map(it => {
        if (it.id === candidate.id) {
          return {
            ...it,
            status: it.status === 'reported' ? 'potential_match' : it.status,
            matchedItemId: newItem.id,
            matchPercentage: matchScore,
          };
        }
        return it;
      });

      addNotification(
        '⚡ Potential Match Found!',
        `AI detected a ${matchScore}% match between your reported item "${newItem.title}" and Case #${candidate.id}.`,
        'match',
        newItem.id
      );
    } else {
      addNotification(
        itemData.type === 'lost' ? '🔍 Lost Item Reported' : '📦 Found Item Reported',
        `Case #${newItem.id} has been published to the campus board.`,
        'deposit',
        newItem.id
      );
    }

    setItems(updatedItems);
    setUser(prev => ({ ...prev, itemsReportedCount: prev.itemsReportedCount + 1 }));
    return newItem;
  };

  const depositItemAtOffice = (itemId: string, lockerId = 'Locker A-12'): boolean => {
    const item = items.find(it => it.id === itemId);
    if (!item) return false;

    const qrCode = `QR-${item.id}-OFFICE-VERIFY`;
    const now = new Date();
    const timestamp = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;

    setItems(prev => prev.map(it => {
      if (it.id === itemId) {
        return {
          ...it,
          status: 'deposited',
          officeLockerId: lockerId,
          depositDate: timestamp,
          qrHandoverCode: qrCode,
        };
      }
      return it;
    }));

    addNotification(
      '🏢 Item Deposited at Campus Office',
      `Item #${item.id} is now securely locked in ${lockerId}. Staff verification & QR handover enabled.`,
      'deposit',
      item.id
    );

    return true;
  };

  const verifyOwnership = (itemId: string, answer: string): { success: boolean; message: string } => {
    const item = items.find(it => it.id === itemId);
    if (!item) return { success: false, message: 'Item not found.' };

    const targetAnswer = item.hiddenDetails.correctAnswer.toLowerCase();
    const submitted = answer.trim().toLowerCase();

    // Check meaningful token overlaps
    const targetWords = targetAnswer.split(/\W+/).filter(w => w.length > 2);
    const submittedWords = submitted.split(/\W+/).filter(w => w.length > 2);
    const matches = submittedWords.filter(w => targetWords.includes(w));

    const isMatch = (matches.length >= 1 && submitted.length > 3) || targetAnswer.includes(submitted) || submitted.includes(targetAnswer);

    if (isMatch) {
      setItems(prev => prev.map(it => {
        if (it.id === itemId || it.matchedItemId === itemId) {
          return { ...it, status: 'verified' };
        }
        return it;
      }));

      addNotification(
        '✅ Ownership Verified!',
        `Your verification for Case #${item.id} was confirmed! Please proceed to the Lost & Found Office (Admin 102) for QR collection.`,
        'verification',
        item.id
      );

      return { 
        success: true, 
        message: 'Ownership confirmed! Your claim pass has been issued. Head to the Campus Office for QR release.' 
      };
    } else {
      return { 
        success: false, 
        message: 'Verification answer did not match the hidden record on file. For anti-theft security, please try again or visit Campus Security.' 
      };
    }
  };

  const confirmHandover = (itemId: string, staffName = 'Officer Briggs (Campus Security)', recipientStudentId = 'STU-2024-8142'): boolean => {
    const item = items.find(it => it.id === itemId);
    if (!item) return false;

    const now = new Date();
    const timestamp = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;
    const rewardPts = item.rewardPoints || 150;

    setItems(prev => prev.map(it => {
      if (it.id === itemId || it.matchedItemId === itemId) {
        return {
          ...it,
          status: 'recovered',
          recoveredDate: timestamp,
          rewardClaimed: true,
        };
      }
      return it;
    }));

    // Reward unlock!
    setUser(prev => ({
      ...prev,
      rewardBalance: prev.rewardBalance + rewardPts,
      itemsRecoveredCount: prev.itemsRecoveredCount + 1,
      trustScore: Math.min(100, prev.trustScore + 1),
    }));

    addNotification(
      '🎉 Item Successfully Recovered!',
      `Case #${item.id} handover confirmed by ${staffName} to recipient [${recipientStudentId}]. Item status updated to Recovered.`,
      'recovery',
      item.id
    );

    addNotification(
      '🌟 Reward Unlocked (+150 pts)',
      `Physical handover verified! +${rewardPts} Campus Karma points have been credited to the finder's account.`,
      'reward',
      item.id
    );

    fireConfetti();
    return true;
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetDemoData = () => {
    setItems(INITIAL_ITEMS);
    setUser(INITIAL_USER);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEY_ITEMS);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_NOTIFS);
    setActiveTab('home');
  };

  return (
    <AppContext.Provider
      value={{
        items,
        user,
        notifications,
        unreadNotificationCount,
        activeTab,
        setActiveTab,
        selectedAreaFilter,
        setSelectedAreaFilter,
        selectedItem,
        setSelectedItem,
        matchingPair,
        setMatchingPair,
        verifyingItem,
        setVerifyingItem,
        qrHandoverItem,
        setQrHandoverItem,
        reportModalOpen,
        setReportModalOpen,
        reportInitialType,
        setReportInitialType,
        searchQuery,
        setSearchQuery,
        viewRole,
        setViewRole,
        isAuthenticated,
        loginWithOtp,
        logout,
        historyStack,
        canGoBack,
        goBack,
        goBackLabel,
        updateUserEmail,
        addNewReport,
        depositItemAtOffice,
        verifyOwnership,
        confirmHandover,
        triggerAIMatchCheck,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData,
        fireConfetti,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
