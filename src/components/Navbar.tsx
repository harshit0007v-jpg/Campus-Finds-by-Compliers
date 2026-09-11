import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  PlusCircle, 
  Bell, 
  Shield, 
  User, 
  Menu, 
  X, 
  Compass, 
  PackageSearch, 
  Building,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  LogOut
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    unreadNotificationCount, 
    setReportModalOpen, 
    setReportInitialType,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setSelectedItem,
    items,
    viewRole,
    setViewRole,
    resetDemoData,
    user,
    canGoBack,
    goBack,
    goBackLabel,
    logout
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'lost', label: 'Lost Items' },
    { id: 'found', label: 'Found Items' },
    { id: 'browse', label: 'Browse by Area' },
    { id: 'my_reports', label: 'My Reports' },
    { id: 'office', label: 'Office Portal', badge: 'Admin' },
    { id: 'profile', label: 'Profile' },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    setNotificationsOpen(false);
  };

  const handleNotificationClick = (notifId: string, relatedItemId?: string) => {
    markNotificationRead(notifId);
    if (relatedItemId) {
      const foundItem = items.find(it => it.id === relatedItemId);
      if (foundItem) {
        setSelectedItem(foundItem);
      }
    }
    setNotificationsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top micro banner for Hackathon Showcase & Quick Role Switcher */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded text-[11px] border border-emerald-800/40">
            <Sparkles className="w-3 h-3" /> Official Launch
          </span>
          <span className="hidden sm:inline text-slate-400">
            Campus-Wide Central Lost & Found Registry • Block 33 Dept Desk • 9 Campus Zones
          </span>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {/* View Role Switcher */}
          <div className="flex items-center bg-slate-800 rounded-md p-0.5 border border-slate-700">
            <button
              onClick={() => setViewRole('student')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                viewRole === 'student' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Student View
            </button>
            <button
              onClick={() => {
                setViewRole('staff');
                setActiveTab('office');
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                viewRole === 'staff' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Office Staff View
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetDemoData}
              title="Reset to clean launch state"
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition px-1.5 py-0.5 rounded hover:bg-slate-800 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden md:inline">Reset System</span>
            </button>
            <button
              onClick={logout}
              title="Log out and return to Login screen"
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 transition px-1.5 py-0.5 rounded hover:bg-slate-800 cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Step-wise Go Back Button */}
            {canGoBack && (
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 border border-slate-300/80 shadow-2xs transition active:scale-95 cursor-pointer shrink-0"
                title={goBackLabel}
              >
                <ArrowLeft className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline font-semibold">{goBackLabel}</span>
                <span className="sm:hidden font-semibold">Back</span>
              </button>
            )}

            {/* Brand Logo */}
            <div 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:scale-105 transition">
                <PackageSearch className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-indigo-600 transition">
                    Campus Find
                  </span>
                  <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-[10px] px-1.5 py-0.5 rounded tracking-wide">
                    by Compilers
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-none">Smart Campus Lost & Found</p>
              </div>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-600 font-semibold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {item.label}
                  {item.badge && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold uppercase">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Report Button */}
            <button
              onClick={() => {
                setReportInitialType('lost');
                setReportModalOpen(true);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3.5 py-2 rounded-lg shadow-sm shadow-indigo-100 transition active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Item</span>
            </button>

            {/* Notifications Popover Toggle */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={`relative p-2 rounded-lg border transition ${
                  notificationsOpen 
                    ? 'bg-slate-100 text-indigo-600 border-indigo-200' 
                    : 'text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[11px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900">Notifications</span>
                      {unreadNotificationCount > 0 && (
                        <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-medium">
                          {unreadNotificationCount} new
                        </span>
                      )}
                    </div>
                    {unreadNotificationCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-slate-600 text-sm">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.slice(0, 5).map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif.id, notif.relatedItemId)}
                          className={`p-3.5 hover:bg-slate-50 cursor-pointer transition flex gap-3 ${
                            !notif.read ? 'bg-indigo-50/40' : ''
                          }`}
                        >
                          <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${!notif.read ? 'bg-indigo-600' : 'bg-transparent'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800 truncate">{notif.title}</p>
                            <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{notif.message}</p>
                            <p className="text-[10px] text-slate-600 mt-1">{notif.timestamp}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2 border-t border-slate-100 text-center bg-slate-50/50">
                    <button
                      onClick={() => handleNavClick('notifications')}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile pill */}
            <button
              onClick={() => handleNavClick('profile')}
              className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-200 hover:bg-slate-50 transition"
            >
              <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                AC
              </div>
              <div className="text-left text-xs leading-tight">
                <div className="font-semibold text-slate-800 truncate max-w-[90px]">{user.name}</div>
                <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
                  <Shield className="w-2.5 h-2.5" /> {user.trustScore}% Trust
                </div>
              </div>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200 shadow-xl">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => {
                setReportInitialType('lost');
                setReportModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 bg-rose-600 text-white text-xs font-semibold py-2.5 rounded-lg"
            >
              <PlusCircle className="w-4 h-4" /> Report Lost
            </button>
            <button
              onClick={() => {
                setReportInitialType('found');
                setReportModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 bg-indigo-600 text-white text-xs font-semibold py-2.5 rounded-lg"
            >
              <PlusCircle className="w-4 h-4" /> Report Found
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left py-2.5 px-2 text-sm font-medium flex items-center justify-between ${
                  activeTab === item.id ? 'text-indigo-600 bg-indigo-50/50 rounded-lg' : 'text-slate-700'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500">
            <div>Logged in as: <strong className="text-slate-800">{user.name}</strong> ({user.email || user.studentId})</div>
            <div className="flex items-center gap-3">
              <button
                onClick={resetDemoData}
                className="text-indigo-600 font-medium flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Demo
              </button>
              <button
                onClick={logout}
                className="text-rose-600 font-medium flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
