import { CampusItem, UserProfile, AppNotification } from './types';

export const INITIAL_USER: UserProfile = {
  name: 'Harshit Verma',
  studentId: 'STU-2024-8142',
  email: 'harshit0007v@gmail.com',
  department: 'Computer Science & Engineering',
  year: '3rd Year Junior',
  trustScore: 100,
  verifiedStudent: true,
  rewardBalance: 50,
  itemsReportedCount: 0,
  itemsRecoveredCount: 0,
};

// Fresh Launch: All pre-existing items erased. Clean slate for new campus launch.
export const INITIAL_ITEMS: CampusItem[] = [];

// Fresh Launch: Official launch welcome notification
export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-launch',
    title: '🎓 Official Launch: Campus Find by Compilers is Live',
    message: 'Welcome to Campus Find by Compilers! The official campus lost & found system is active. Report lost belongings, log turned-in items, and securely claim recovered articles.',
    timestamp: 'Just now',
    read: false,
    type: 'recovery',
  }
];

// Helpful Category Templates for reporting (no hardcoded personal articles)
export const CATEGORY_SAMPLE_TEMPLATES = [
  {
    label: 'Electronics',
    category: 'Electronics' as const,
    defaultLocation: 'Library',
    placeholder: 'e.g. Laptop charger, wireless earbuds, scientific calculator',
    suggestedQuestion: 'What is the serial number, custom engraving, or sticker on the device?',
  },
  {
    label: 'ID & Cards',
    category: 'ID & Cards' as const,
    defaultLocation: 'Cafeteria',
    placeholder: 'e.g. University student ID card, transit pass lanyard',
    suggestedQuestion: 'What is the full student name, ID number, or card holder color?',
  },
  {
    label: 'Bottles & Mugs',
    category: 'Bottles & Containers' as const,
    defaultLocation: 'Sports Complex',
    placeholder: 'e.g. Insulated stainless steel water flask',
    suggestedQuestion: 'What stickers, dents, or brand markings are on the body?',
  },
  {
    label: 'Wallets & Keys',
    category: 'Wallets & Bags' as const,
    defaultLocation: 'Student Center',
    placeholder: 'e.g. Leather bifold wallet, keychain with dorm fob',
    suggestedQuestion: 'What specific cards, key fobs, or initials are inside or attached?',
  },
];

export interface StaffContact {
  name: string;
  role: string;
  contact: string;
}

export const CENTRAL_OFFICE_INFO = {
  building: 'Block 33',
  department: 'Lost and Found Department',
  fullLocation: 'Block 33, Lost and Found Department',
  timings: 'Mon–Fri: 08:00 – 20:00 | Sat: 09:00 – 14:00',
  status: 'Desk Active • Staff On Duty',
};

export const DEPARTMENT_CONTACTS: StaffContact[] = [
  {
    name: 'Deepika Priyadarshini',
    role: 'Lost and Found Department',
    contact: '-',
  },
  {
    name: 'Nancy Mishra',
    role: 'Lost and Found Department',
    contact: '-',
  },
  {
    name: 'Ayush Nishad',
    role: 'Lost and Found Department',
    contact: '-',
  },
  {
    name: 'Harshit Verma',
    role: 'Lost and Found Department',
    contact: '-',
  },
];

