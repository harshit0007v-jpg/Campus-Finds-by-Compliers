import React from 'react';
import { useApp } from '../context/AppContext';
import { ItemCard } from '../components/ItemCard';
import { CampusArea } from '../types';
import { 
  Search, 
  PlusCircle, 
  Sparkles, 
  QrCode, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  Shield,
  Layers,
  MapPin,
  PackageSearch,
  Inbox
} from 'lucide-react';

const CAMPUS_AREAS: { name: CampusArea; icon: string; countDesc: string }[] = [
  { name: 'Block 33', icon: '🏢', countDesc: 'Lost & Found Dept, Central Desk' },
  { name: 'Library', icon: '📚', countDesc: 'Quiet study, 2nd floor pods' },
  { name: 'Block 34', icon: '🔬', countDesc: 'Science & Engineering labs' },
  { name: 'Cafeteria', icon: '☕', countDesc: 'Central dining & lounge' },
  { name: 'Hostel', icon: '🛏️', countDesc: 'Blocks A & B, laundry' },
  { name: 'Academic Block', icon: '🏛️', countDesc: 'Lecture halls 101-304' },
  { name: 'Sports Complex', icon: '🎾', countDesc: 'Courts, gymnasium, pavilion' },
  { name: 'Student Center', icon: '🎮', countDesc: 'Club rooms, student union' },
  { name: 'Computer Labs', icon: '💻', countDesc: 'IT suites, design hubs' },
];

export const HomeView: React.FC = () => {
  const { 
    items, 
    searchQuery, 
    setSearchQuery, 
    setActiveTab, 
    setSelectedAreaFilter,
    setReportModalOpen,
    setReportInitialType,
    setSelectedItem,
    setMatchingPair,
    setQrHandoverItem,
    setVerifyingItem
  } = useApp();

  const totalReported = items.length;
  const totalRecovered = items.filter(it => it.status === 'recovered').length;
  const activeLostCount = items.filter(it => it.type === 'lost').length;
  const activeFoundCount = items.filter(it => it.type === 'found').length;

  const recentLost = items.filter(it => it.type === 'lost').slice(0, 3);
  const recentFound = items.filter(it => it.type === 'found').slice(0, 3);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab('lost');
    }
  };

  const handleAreaSelect = (area: CampusArea) => {
    setSelectedAreaFilter(area);
    setActiveTab('browse');
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Official Campus Launch Announcement Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 shadow-xl border border-indigo-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Official University Launch — Central Registry Active</span>
            </div>
            <h2 className="text-lg font-bold text-white">
              Campus Find by Compilers is Live Across All 9 Campus Zones
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Report lost items in seconds, match with turn-ins automatically, and safely claim belongings via verified QR handover at Central Office (Block 33 - Lost and Found Department).
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                setReportInitialType('lost');
                setReportModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Report Item</span>
            </button>
            <button
              onClick={() => setActiveTab('browse')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Zones</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Official University Campus Safety Initiative</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Lost Something? <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              We’ll Help You Find It.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            The intelligent campus lost and found platform. Powered by AI multi-characteristic matching, confidential ownership verification, and secure physical QR handover at the Campus Office.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto pt-2">
            <div className="relative flex items-center shadow-lg rounded-2xl overflow-hidden border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-indigo-500 transition">
              <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search lost or found items by keyword, brand, category, or building..."
                className="w-full py-4 pl-3 pr-28 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition"
              >
                Search
              </button>
            </div>
          </form>

          {/* Buttons: Report Lost & Report Found */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setReportInitialType('lost');
                setReportModalOpen(true);
              }}
              className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-md shadow-rose-200 transition active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Lost Item</span>
            </button>

            <button
              onClick={() => {
                setReportInitialType('found');
                setReportModalOpen(true);
              }}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-200 transition active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Found Item</span>
            </button>
          </div>
        </div>

        {/* Live Launch Statistics Section */}
        <div className="mt-14 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
            <span className="text-3xl font-black text-slate-900">9</span>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Monitored Zones</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
            <span className="text-3xl font-black text-rose-600">{activeLostCount}</span>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Lost Reports</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
            <span className="text-3xl font-black text-indigo-600">{activeFoundCount}</span>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Found Items Logged</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
            <span className="text-3xl font-black text-emerald-600">100%</span>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Secure Escrow</p>
          </div>
        </div>
      </section>

      {/* Two Feed Grids: Recently Lost & Recently Found */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Recently Lost */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <h2 className="text-xl font-bold text-slate-900">Recently Lost Items</h2>
              <span className="text-xs text-slate-600">({activeLostCount} active)</span>
            </div>
            <button
              onClick={() => setActiveTab('lost')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View All Lost Items</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentLost.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                <PackageSearch className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800 text-sm">No Lost Items Reported Yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  The campus registry is currently fresh and clear. If you or a classmate misplaced an article, create a report to activate community matching.
                </p>
              </div>
              <button
                onClick={() => {
                  setReportInitialType('lost');
                  setReportModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs border border-rose-200 transition cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Report First Lost Item</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recentLost.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Recently Found */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-indigo-500" />
              <h2 className="text-xl font-bold text-slate-900">Recently Found Items</h2>
              <span className="text-xs text-slate-600">({activeFoundCount} active)</span>
            </div>
            <button
              onClick={() => setActiveTab('found')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View All Found Items</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentFound.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800 text-sm">No Found Items Awaiting Custody</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  No unattended belongings have been logged yet. If you picked up an item on campus, report it here or bring it to Block 33 (Lost and Found Department).
                </p>
              </div>
              <button
                onClick={() => {
                  setReportInitialType('found');
                  setReportModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs border border-indigo-200 transition cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Report First Found Item</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recentFound.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Browse by Campus Area Visual Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Browse by Campus Area</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Pinpoint items reported across campus buildings, research labs, dining commons, and student dormitories.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CAMPUS_AREAS.map(area => {
            const count = items.filter(it => it.area === area.name).length;
            return (
              <div
                key={area.name}
                onClick={() => handleAreaSelect(area.name)}
                className="group p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{area.icon}</span>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    {count} reports
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition">
                    {area.name}
                  </h4>
                  <p className="text-[11px] text-slate-600 truncate mt-0.5">{area.countDesc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Two Feature Highlights: AI Matching & Secure QR Handover */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* AI Matching Spotlight */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 border border-indigo-100 space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Smart Vision & Semantics</span>
              <h3 className="text-xl font-bold text-slate-900">How AI Matching Works</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              When students upload a photo and description of a lost or found item, our multi-modal embedding model analyzes color palette, geometry silhouette, timestamps, and campus location proximity. When a similarity threshold exceeds 80%, a Potential Match Alert is instantly sent to both parties.
            </p>
            <div className="flex items-center gap-3 text-xs font-semibold text-indigo-700">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>Real-time instant candidate matching</span>
            </div>
          </div>

          {/* Secure QR Handover Spotlight */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-blue-50/50 border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md">
              <QrCode className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Zero-Fraud Escrow Protocol</span>
              <h3 className="text-xl font-bold text-slate-900">Secure Physical QR Handover</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Finders physically deposit items at Campus Lost and Found Department (Block 33). A unique Case QR is generated. Claimants must answer confidential zero-knowledge questions before staff scan the code and verify physical student IDs. Finder rewards remain locked in escrow until successful physical handover!
            </p>
            <div className="flex items-center gap-3 text-xs font-semibold text-emerald-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Anti-Cheating & Reputation Scoring</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
