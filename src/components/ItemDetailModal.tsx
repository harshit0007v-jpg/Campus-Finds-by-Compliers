import React from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from './StatusBadge';
import { 
  X, 
  MapPin, 
  Calendar, 
  Tag, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle, 
  Lock, 
  Building2, 
  QrCode, 
  AlertCircle,
  Copy,
  Check,
  UserCheck,
  Image as ImageIcon,
  Mail,
  ExternalLink
} from 'lucide-react';

export const ItemDetailModal: React.FC = () => {
  const { 
    selectedItem, 
    setSelectedItem, 
    setVerifyingItem, 
    setMatchingPair, 
    setQrHandoverItem,
    depositItemAtOffice,
    setReportModalOpen,
    setReportInitialType,
    items 
  } = useApp();

  const [copiedId, setCopiedId] = React.useState(false);
  const [copiedEmail, setCopiedEmail] = React.useState(false);

  if (!selectedItem) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(selectedItem.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyEmail = (emailToCopy: string) => {
    navigator.clipboard.writeText(emailToCopy);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleClaimClick = () => {
    // If it's a found item or lost item, claimant wants to verify ownership
    setVerifyingItem(selectedItem);
    setSelectedItem(null);
  };

  const handleViewMatch = () => {
    if (selectedItem.matchedItemId) {
      const counterpart = items.find(it => it.id === selectedItem.matchedItemId);
      if (counterpart) {
        const lost = selectedItem.type === 'lost' ? selectedItem : counterpart;
        const found = selectedItem.type === 'found' ? selectedItem : counterpart;
        setMatchingPair({ lost, found });
        setSelectedItem(null);
      }
    }
  };

  const handleDeposit = () => {
    depositItemAtOffice(selectedItem.id, 'Locker B-08');
  };

  const handleReportSimilar = () => {
    setReportInitialType(selectedItem.type === 'lost' ? 'found' : 'lost');
    setReportModalOpen(true);
    setSelectedItem(null);
  };

  const handleViewQr = () => {
    setQrHandoverItem(selectedItem);
    setSelectedItem(null);
  };

  const isLost = selectedItem.type === 'lost';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
              isLost ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'
            }`}>
              {isLost ? 'Lost Item Report' : 'Found Item Report'}
            </span>
            <span className="text-slate-400 font-mono text-xs">#{selectedItem.id}</span>
            <button 
              onClick={handleCopyId}
              className="p-1 text-slate-400 hover:text-slate-600 rounded transition"
              title="Copy Case ID"
            >
              {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <button 
            onClick={() => setSelectedItem(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Image & Main Info Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="rounded-xl overflow-hidden bg-slate-100 border border-slate-200 aspect-video md:aspect-square relative">
              {selectedItem.imageUrl ? (
                <img 
                  src={selectedItem.imageUrl} 
                  alt={selectedItem.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center text-slate-400 gap-2 p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-white/80 shadow-xs flex items-center justify-center text-slate-500">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-slate-600">{selectedItem.title}</span>
                  <span className="text-[11px] text-slate-400">{selectedItem.category}</span>
                </div>
              )}
              {selectedItem.matchPercentage && (
                <div className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{selectedItem.matchPercentage}% AI Match</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    {selectedItem.category}
                  </span>
                  <StatusBadge status={selectedItem.status} size="sm" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 leading-tight">
                  {selectedItem.title}
                </h2>
              </div>

              {/* Location & Time details */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">{selectedItem.area}</span>
                    <p className="text-slate-500">{selectedItem.locationDetail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Reported on {selectedItem.date} at {selectedItem.time}</span>
                </div>
                {selectedItem.officeLockerId && (
                  <div className="flex items-center gap-2 text-amber-800 font-medium">
                    <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Custody: Campus Office {selectedItem.officeLockerId}</span>
                  </div>
                )}
              </div>

              {/* Finder / Reporter Email Details Card */}
              {(() => {
                const contactEmail = selectedItem.type === 'found'
                  ? (selectedItem.finderEmail || selectedItem.reportedBy?.email)
                  : (selectedItem.reporterEmail || selectedItem.reportedBy?.email);
                const isFinder = selectedItem.type === 'found';

                return contactEmail ? (
                  <div className={`p-3.5 rounded-xl border space-y-2 ${
                    isFinder 
                      ? 'bg-indigo-50/70 border-indigo-200' 
                      : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Mail className={`w-3.5 h-3.5 ${isFinder ? 'text-indigo-600' : 'text-slate-600'}`} />
                        <span>{isFinder ? "Finder's Email & Contact" : "User / Owner Email"}</span>
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isFinder ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {isFinder ? "Found By" : "Lost Reporter"}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-0.5">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {selectedItem.reportedBy?.name || (isFinder ? 'Campus Finder' : 'Campus Member')}
                        </p>
                        <p className="text-xs font-mono text-indigo-700 font-medium truncate select-all">
                          {contactEmail}
                        </p>
                        {selectedItem.reportedBy?.studentId && (
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            ID: {selectedItem.reportedBy.studentId} • Trust Score: {selectedItem.reportedBy.trustScore}%
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopyEmail(contactEmail)}
                          className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition flex items-center gap-1 shadow-2xs"
                          title="Copy Email ID"
                        >
                          {copiedEmail ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-500" />}
                          <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                        </button>
                        <a
                          href={`mailto:${contactEmail}?subject=Campus%20Find:%20${encodeURIComponent(selectedItem.title)}%20(${selectedItem.id})`}
                          className="px-2.5 py-1 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center gap-1 shadow-2xs"
                        >
                          <Mail className="w-3 h-3" />
                          <span>Email</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Public Description */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Public Description
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
                  {selectedItem.description}
                </p>
              </div>

              {/* Anti-Cheating Hidden Details Safety Notice */}
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-amber-900">
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  <span>Protected Private Ownership Information</span>
                </div>
                <p className="text-amber-800 leading-relaxed">
                  Unique serial numbers, hidden stickers, engravings, and pocket contents are kept hidden from this public view to prevent fraudulent claims. They are only challenged during the ownership verification step.
                </p>
              </div>
            </div>
          </div>

          {/* AI Match Callout if available */}
          {selectedItem.matchedItemId && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border border-indigo-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-indigo-950">
                    High Confidence AI Match Available ({selectedItem.matchPercentage}%)
                  </h4>
                  <p className="text-xs text-indigo-700">
                    Counterpart report #{selectedItem.matchedItemId} was found matching this item’s color, category, and campus location.
                  </p>
                </div>
              </div>
              <button
                onClick={handleViewMatch}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm shrink-0"
              >
                Inspect Match Analysis
              </button>
            </div>
          )}

          {/* Physical Custody Banner if Deposited */}
          {selectedItem.status === 'deposited' && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-amber-600 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-amber-900">Item Currently in Physical Office Custody</p>
                  <p className="text-amber-700">Stored at Block 33, Lost and Found Department ({selectedItem.officeLockerId}).</p>
                </div>
              </div>
              <button
                onClick={handleViewQr}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium transition flex items-center gap-1.5"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>View Custody QR</span>
              </button>
            </div>
          )}

          {/* Action Buttons Footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handleReportSimilar}
              className="text-xs text-slate-600 hover:text-indigo-600 font-medium transition"
            >
              Report Similar Item
            </button>

            <div className="flex flex-wrap items-center gap-2">
              {/* If found item and still reported or potential_match, allow fast deposit */}
              {!isLost && (selectedItem.status === 'reported' || selectedItem.status === 'potential_match') && (
                <button
                  onClick={handleDeposit}
                  className="px-3 py-2 text-xs font-medium rounded-lg bg-amber-100 text-amber-900 hover:bg-amber-200 transition flex items-center gap-1.5"
                >
                  <Building2 className="w-4 h-4 text-amber-700" />
                  <span>Deposit at Office</span>
                </button>
              )}

              {/* View QR if already deposited or verified */}
              {(selectedItem.status === 'deposited' || selectedItem.status === 'verified') && (
                <button
                  onClick={handleViewQr}
                  className="px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-800 text-white hover:bg-slate-900 transition flex items-center gap-1.5"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Handover QR Code</span>
                </button>
              )}

              {/* Main Claim Button */}
              {selectedItem.status !== 'recovered' && (
                <button
                  onClick={handleClaimClick}
                  className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition active:scale-95 flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>I Think This Is My Item</span>
                </button>
              )}

              {selectedItem.status === 'recovered' && (
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Item Safely Recovered on {selectedItem.recoveredDate || selectedItem.date}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
