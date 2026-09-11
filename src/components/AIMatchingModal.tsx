import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  BrainCircuit,
  Building2,
  Lock,
  Mail
} from 'lucide-react';

export const AIMatchingModal: React.FC = () => {
  const { 
    matchingPair, 
    setMatchingPair, 
    triggerAIMatchCheck, 
    setVerifyingItem,
    depositItemAtOffice 
  } = useApp();

  if (!matchingPair) return null;

  const { lost, found } = matchingPair;
  const analysis = matchingPair.analysis || triggerAIMatchCheck(lost, found);

  const handleProceedVerification = () => {
    // Proceed to claim & verify the found item or lost item
    setVerifyingItem(found);
    setMatchingPair(null);
  };

  const handleDepositAtOffice = () => {
    depositItemAtOffice(found.id, 'Locker A-07');
    setMatchingPair(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Potential Match Found</h2>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                  AI Vision & Semantic Match
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Comparing Case #{lost.id} (Lost) with Case #{found.id} (Found)
              </p>
            </div>
          </div>

          <button 
            onClick={() => setMatchingPair(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Match Score Hero Banner */}
          <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 text-white p-5 rounded-2xl relative overflow-hidden shadow-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300 flex items-center justify-center sm:justify-start gap-1">
                  <BrainCircuit className="w-4 h-4" /> High Confidence Detection
                </span>
                <h3 className="text-2xl font-black tracking-tight">
                  {analysis.matchScore}% Visual & Metadata Match
                </h3>
                <p className="text-xs text-slate-300 max-w-md">
                  Neural similarity detects matching color gradient, geometry, physical category, and matching campus sector.
                </p>
              </div>

              {/* Circular Gauge / Percentage badge */}
              <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center shrink-0">
                <span className="text-2xl font-black text-white">{analysis.matchScore}%</span>
                <span className="text-[9px] uppercase tracking-wider text-indigo-200">Confidence</span>
              </div>
            </div>

            {/* Subtle glow background */}
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* Side-by-Side Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lost Item Card */}
            <div className="rounded-xl border border-rose-200 bg-rose-50/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-600" />
                  Lost Item Report
                </span>
                <span className="text-xs font-mono text-slate-500 font-medium">#{lost.id}</span>
              </div>

              <div className="aspect-video rounded-lg overflow-hidden bg-white border border-rose-100">
                <img src={lost.imageUrl} alt={lost.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">{lost.title}</h4>
                <div className="mt-1 space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{lost.area} ({lost.locationDetail})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Lost on {lost.date} at {lost.time}</span>
                  </div>
                  {(lost.reporterEmail || lost.reportedBy?.email) && (
                    <div className="flex items-center gap-1.5 text-rose-700 font-mono text-[11px] truncate">
                      <Mail className="w-3 h-3 text-rose-500 shrink-0" />
                      <span className="font-sans font-medium text-[10px] text-slate-500 uppercase">Owner Email:</span>
                      <span className="truncate">{lost.reporterEmail || lost.reportedBy?.email}</span>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100 line-clamp-2">
                  {lost.description}
                </p>
              </div>
            </div>

            {/* Found Item Card */}
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  Found Item Report
                </span>
                <span className="text-xs font-mono text-slate-500 font-medium">#{found.id}</span>
              </div>

              <div className="aspect-video rounded-lg overflow-hidden bg-white border border-indigo-100">
                <img src={found.imageUrl} alt={found.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">{found.title}</h4>
                <div className="mt-1 space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{found.area} ({found.locationDetail})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Found on {found.date} at {found.time}</span>
                  </div>
                  {(found.finderEmail || found.reportedBy?.email) && (
                    <div className="flex items-center gap-1.5 text-indigo-700 font-mono text-[11px] truncate">
                      <Mail className="w-3 h-3 text-indigo-500 shrink-0" />
                      <span className="font-sans font-medium text-[10px] text-slate-500 uppercase">Finder Email:</span>
                      <span className="truncate">{found.finderEmail || found.reportedBy?.email}</span>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100 line-clamp-2">
                  {found.description}
                </p>
              </div>
            </div>
          </div>

          {/* AI Matching Breakdown Characteristics */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4 text-indigo-600" />
              <span>AI Multi-Characteristic Analysis</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-lg border border-slate-200/70 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 font-medium">Visual Feature Alignment</span>
                  <span className="font-bold text-indigo-600">{analysis.visualSimilarity}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${analysis.visualSimilarity}%` }} />
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  Color palette match, silhouette boundaries & wear signature match
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200/70 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 font-medium">Location Proximity</span>
                  <span className="font-bold text-emerald-600">{analysis.locationProximityScore}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${analysis.locationProximityScore}%` }} />
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  Both reports centered around campus zone: {lost.area}
                </p>
              </div>
            </div>

            {/* List of matching characteristics */}
            <div className="space-y-1.5 pt-1">
              {analysis.matchingPoints.map((point, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Anti-cheating reminder */}
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
            <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">Next Step: Zero-Knowledge Verification</span>
              <p className="text-amber-800 leading-relaxed">
                Matches do not automatically grant possession. The claimant must answer private hidden questions set during reporting before security staff authorize QR handover.
              </p>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
            <button
              onClick={() => setMatchingPair(null)}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              Close Match
            </button>

            <div className="flex items-center gap-2">
              {found.status !== 'deposited' && found.status !== 'recovered' && (
                <button
                  onClick={handleDepositAtOffice}
                  className="px-3.5 py-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <Building2 className="w-4 h-4 text-amber-700" />
                  <span>Deposit Item at Office</span>
                </button>
              )}

              <button
                onClick={handleProceedVerification}
                className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition active:scale-95 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Ownership & Claim</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
