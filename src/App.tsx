import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { FeedView } from './views/FeedView';
import { BrowseAreaView } from './views/BrowseAreaView';
import { MyReportsView } from './views/MyReportsView';
import { NotificationsView } from './views/NotificationsView';
import { ProfileView } from './views/ProfileView';
import { OfficePortal } from './components/OfficePortal';
import { ReportModal } from './components/ReportModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import { AIMatchingModal } from './components/AIMatchingModal';
import { VerificationModal } from './components/VerificationModal';
import { QRHandoverModal } from './components/QRHandoverModal';
import { LoginView } from './views/LoginView';

const AppContent: React.FC = () => {
  const { activeTab, isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'lost':
        return <FeedView feedType="lost" />;
      case 'found':
        return <FeedView feedType="found" />;
      case 'browse':
        return <BrowseAreaView />;
      case 'my_reports':
        return <MyReportsView />;
      case 'notifications':
        return <NotificationsView />;
      case 'profile':
        return <ProfileView />;
      case 'office':
        return <OfficePortal />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      <Navbar />
      
      <main className="flex-1">
        {renderActiveView()}
      </main>

      <Footer />

      {/* Global Overlays & Modals */}
      <ReportModal />
      <ItemDetailModal />
      <AIMatchingModal />
      <VerificationModal />
      <QRHandoverModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
