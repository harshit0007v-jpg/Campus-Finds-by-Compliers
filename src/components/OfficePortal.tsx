import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from './StatusBadge';
import { CampusItem, ItemStatus } from '../types';
import { CENTRAL_OFFICE_INFO, DEPARTMENT_CONTACTS } from '../mockData';
import { 
  Building2, 
  Search, 
  QrCode, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Lock, 
  Unlock, 
  UserCheck,
  AlertCircle,
  Eye,
  ArrowRight,
  Users,
  MapPin,
  Phone
} from 'lucide-react';

export const OfficePortal: React.FC = () => {
  const { 
    items, 
    depositItemAtOffice, 
    confirmHandover, 
    setSelectedItem, 
    setQrHandoverItem, 
    setVerifyingItem 
  } = useApp();

  const [searchId, setSearchId] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [assigningLockerItemId, setAssigningLockerItemId] = useState<string | null>(null);
  const [selectedLocker, setSelectedLocker] = useState('Locker A-05');

  // Stats calculation
  const totalReports = items.length;
  const pendingMatches = items.filter(it => it.status === 'potential_match').length;
  const depositedItems = items.filter(it => it.status === 'deposited').length;
  const awaitingVerification = items.filter(it => it.status === 'reported' || it.status === 'potential_match').length;
  const recoveredItems = items.filter(it => it.status === 'recovered').length;

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (filterStatus !== 'all' && item.status !== filterStatus) return false;
      if (searchId.trim()) {
        const q = searchId.toLowerCase().trim();
        return item.id.toLowerCase().includes(q) || 
               item.title.toLowerCase().includes(q) || 
               (item.officeLockerId && item.officeLockerId.toLowerCase().includes(q));
      }
      return true;
    });
  }, [items, filterStatus, searchId]);

  const handleQuickDeposit = (itemId: string) => {
    depositItemAtOffice(itemId, selectedLocker);
    setAssigningLockerItemId(null);
  };

  const handleOpenQR = (item: CampusItem) => {
    setQrHandoverItem(item);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Office Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Building2 className="w-5 h-5" />
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Campus Security & Administration
                </span>
                <h1 className="text-2xl sm:text-3xl font-black">Campus Lost & Found Office Portal</h1>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Central custody desk for logging physical item deposits, assigning secure storage lockers, validating owner identity, and authorizing cryptographic QR handovers.
            </p>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-xl text-xs space-y-2 shrink-0 max-w-sm">
            <div>
              <span className="text-slate-400 font-medium">Physical Central Office:</span>
              <p className="font-bold text-white text-sm">{CENTRAL_OFFICE_INFO.building}</p>
              <p className="text-amber-400 font-semibold text-xs">{CENTRAL_OFFICE_INFO.department}</p>
            </div>
            <div className="pt-1.5 border-t border-slate-700 text-slate-300">
              <span className="text-[11px] text-slate-400 block">Operating Hours:</span>
              <span className="font-medium text-slate-200">{CENTRAL_OFFICE_INFO.timings}</span>
            </div>
            <p className="text-emerald-400 flex items-center gap-1 text-[11px] pt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {CENTRAL_OFFICE_INFO.status}
            </p>
          </div>
        </div>

        {/* Department Coordinators & Contact Details Banner */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Department Duty Coordinators & Contacts
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Direct inquiries: Block 33 • Lost and Found Department Desk
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {DEPARTMENT_CONTACTS.map((officer, idx) => (
              <div 
                key={idx}
                className="bg-slate-800/70 hover:bg-slate-800 border border-slate-700/70 rounded-xl p-3 flex flex-col justify-between transition text-xs"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
                    {officer.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs leading-tight">{officer.name}</h4>
                    <span className="text-[10px] text-slate-400">{officer.role}</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-300">
                  <span className="font-mono text-slate-300">contact - {officer.contact !== '-' ? officer.contact : ''}</span>
                  <span className="text-[10px] bg-indigo-950/60 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-800/50">On Duty</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Staff KPIs Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs text-center space-y-0.5">
          <span className="text-2xl font-black text-slate-900">{totalReports}</span>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Reports</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs text-center space-y-0.5">
          <span className="text-2xl font-black text-indigo-600">{pendingMatches}</span>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Matches</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs text-center space-y-0.5">
          <span className="text-2xl font-black text-amber-600">{depositedItems}</span>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Deposited in Locker</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs text-center space-y-0.5">
          <span className="text-2xl font-black text-blue-600">{awaitingVerification}</span>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Awaiting Verification</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs text-center space-y-0.5 col-span-2 sm:col-span-1">
          <span className="text-2xl font-black text-emerald-600">{recoveredItems}</span>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Recovered & Returned</p>
        </div>
      </div>

      {/* Staff Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
            placeholder="Search by Case ID (e.g. CF-2026-1042), title, or locker..."
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white w-full sm:w-auto"
          >
            <option value="all">All Items ({items.length})</option>
            <option value="deposited">Deposited in Locker ({depositedItems})</option>
            <option value="potential_match">Pending Matches ({pendingMatches})</option>
            <option value="verified">Verified Ownership</option>
            <option value="recovered">Recovered Cases ({recoveredItems})</option>
          </select>
        </div>
      </div>

      {/* Items Table / Custody Registry */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">
            Office Custody Registry ({filteredItems.length})
          </h3>
          <span className="text-xs text-slate-500">Statuses: Reported → Match → Deposited → Verified → Recovered</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-3.5">Case ID & Item</th>
                <th className="px-4 py-3.5">Category & Area</th>
                <th className="px-4 py-3.5">Reported By</th>
                <th className="px-4 py-3.5">Custody / Locker</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Staff Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Building2 className="w-8 h-8 text-slate-300" />
                      <span className="font-semibold text-slate-700 text-sm">No items logged in office custody yet</span>
                      <span className="text-slate-400 text-xs">When students report lost articles or turn in items at Block 33 (Lost and Found Department), they will appear here.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-slate-900">#{item.id}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            item.type === 'lost' ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'
                          }`}>
                            {item.type}
                          </span>
                        </div>
                        <p className="font-medium text-slate-800 truncate max-w-xs">{item.title}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="space-y-0.5">
                      <span className="font-medium text-slate-700">{item.category}</span>
                      <p className="text-[11px] text-slate-500">{item.area}</p>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-slate-800">{item.reportedBy.name}</span>
                        {item.type === 'found' && (
                          <span className="text-[9px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-semibold">
                            Finder
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-[10px] text-indigo-700 font-medium truncate max-w-[180px]">
                        {item.type === 'found' ? (item.finderEmail || item.reportedBy.email) : (item.reporterEmail || item.reportedBy.email)}
                      </p>
                      <p className="font-mono text-[10px] text-slate-400">{item.reportedBy.studentId}</p>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    {item.officeLockerId ? (
                      <span className="inline-flex items-center gap-1 font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                        <Building2 className="w-3 h-3 text-amber-700" />
                        {item.officeLockerId}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">Not in locker</span>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <StatusBadge status={item.status} size="sm" />
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View details */}
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition"
                        title="View Full Item Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Deposit Button if not yet deposited */}
                      {item.status !== 'deposited' && item.status !== 'recovered' && item.status !== 'verified' && (
                        <button
                          onClick={() => handleQuickDeposit(item.id)}
                          className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[11px] border border-amber-200 transition flex items-center gap-1"
                          title="Accept Physical Item Deposit"
                        >
                          <Building2 className="w-3 h-3 text-amber-700" />
                          <span>Accept Deposit</span>
                        </button>
                      )}

                      {/* QR Handover Screen Button */}
                      {(item.status === 'deposited' || item.status === 'verified') && (
                        <button
                          onClick={() => handleOpenQR(item)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-black text-white font-bold text-[11px] transition flex items-center gap-1 shadow-xs"
                          title="Open QR Handover Screen"
                        >
                          <QrCode className="w-3 h-3 text-indigo-400" />
                          <span>QR Handover</span>
                        </button>
                      )}

                      {item.status === 'recovered' && (
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Closed
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
