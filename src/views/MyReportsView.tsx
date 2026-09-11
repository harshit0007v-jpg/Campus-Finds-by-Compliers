import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ItemCard } from '../components/ItemCard';
import { 
  Package, 
  Sparkles, 
  Building2, 
  CheckCircle2, 
  Gift, 
  Lock, 
  Unlock, 
  PlusCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const MyReportsView: React.FC = () => {
  const { 
    items, 
    user, 
    setReportModalOpen, 
    setReportInitialType,
    setMatchingPair,
    setQrHandoverItem,
    setVerifyingItem
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'all' | 'lost' | 'found' | 'matches' | 'deposited' | 'recovered'>('all');

  // Filter items reported by or involving current user
  const myItems = items.filter(it => it.reportedBy.studentId === user.studentId);

  const myLost = myItems.filter(it => it.type === 'lost');
  const myFound = myItems.filter(it => it.type === 'found');
  const myMatches = myItems.filter(it => it.status === 'potential_match' || it.matchedItemId);
  const myDeposited = myItems.filter(it => it.status === 'deposited');
  const myRecovered = myItems.filter(it => it.status === 'recovered');

  const displayedItems = (() => {
    switch (activeSubTab) {
      case 'lost': return myLost;
      case 'found': return myFound;
      case 'matches': return myMatches;
      case 'deposited': return myDeposited;
      case 'recovered': return myRecovered;
      default: return myItems;
    }
  })();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Reward Balance Widget */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-5 h-5 text-indigo-600" />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">My Reports & Activity</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Track your lost and found submissions, monitor potential AI matches, and claim unlocked finder karma points.
          </p>
        </div>

        {/* Reward Status Banner */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 p-3.5 rounded-2xl border border-indigo-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider block">
              Campus Karma Balance
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-slate-900">{user.rewardBalance} pts</span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-100 text-xs">
        {[
          { id: 'all', label: 'All My Items', count: myItems.length },
          { id: 'lost', label: 'My Lost Items', count: myLost.length },
          { id: 'found', label: 'My Found Items', count: myFound.length },
          { id: 'matches', label: 'Potential Matches', count: myMatches.length, badge: 'AI' },
          { id: 'deposited', label: 'Items Deposited', count: myDeposited.length },
          { id: 'recovered', label: 'Recovered Items', count: myRecovered.length },
        ].map(tab => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
              className={`px-3.5 py-2 rounded-xl font-semibold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {tab.count}
              </span>
              {tab.badge && (
                <span className={`text-[9px] px-1 rounded font-bold uppercase ${
                  isActive ? 'bg-indigo-800 text-white' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Status Explainer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
          <div className="flex items-center gap-2 font-bold text-indigo-900">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>AI Potential Matches</span>
          </div>
          <p className="text-slate-500">
            {myMatches.length > 0 
              ? `${myMatches.length} items have high confidence counterpart reports. Click to inspect side-by-side.` 
              : 'No active matches currently flagged.'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <Building2 className="w-4 h-4 text-amber-600" />
            <span>Office Custody & QR</span>
          </div>
          <p className="text-slate-500">
            Finders physically deposit turned-in goods to Block 33 (Lost and Found Department). QR codes secure the handover.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
          <div className="flex items-center gap-2 font-bold text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Escrow Reward Status</span>
          </div>
          <p className="text-slate-500">
            Rewards unlock only upon confirmed QR physical handover, eliminating false report manipulation.
          </p>
        </div>
      </div>

      {/* Items List */}
      {displayedItems.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-base">No items found in this section</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't filed any reports matching this filter yet.
            </p>
          </div>
          <button
            onClick={() => {
              setReportInitialType('lost');
              setReportModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition"
          >
            Report An Item Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
