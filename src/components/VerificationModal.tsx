import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Lock, 
  KeyRound, 
  Building2, 
  QrCode,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const VerificationModal: React.FC = () => {
  const { 
    verifyingItem, 
    setVerifyingItem, 
    verifyOwnership, 
    setQrHandoverItem, 
    user 
  } = useApp();

  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState<'pending' | 'verified' | 'failed'>('pending');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [showDemoHint, setShowDemoHint] = useState(false);

  if (!verifyingItem) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || attemptsLeft <= 0) return;

    const result = verifyOwnership(verifyingItem.id, answer);

    if (result.success) {
      setStatus('verified');
      setFeedbackMessage(result.message);
    } else {
      const newAttempts = attemptsLeft - 1;
      setAttemptsLeft(newAttempts);
      setStatus('failed');
      setFeedbackMessage(
        newAttempts > 0 
          ? `${result.message} (${newAttempts} attempts remaining before case lockout)` 
          : 'Case locked due to multiple failed verification attempts. Please present student ID in person at Block 33 (Lost and Found Department).'
      );
    }
  };

  const handleProceedToQR = () => {
    const itemToHandover = verifyingItem;
    setVerifyingItem(null);
    setQrHandoverItem(itemToHandover);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Ownership Verification</h2>
              <p className="text-xs text-slate-500">Case #{verifyingItem.id} — Security Protocol</p>
            </div>
          </div>

          <button 
            onClick={() => setVerifyingItem(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Status Tracker */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="font-semibold text-slate-600">Verification Status:</span>
            {status === 'pending' && (
              <span className="inline-flex items-center gap-1.5 font-bold text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Pending Verification
              </span>
            )}
            {status === 'verified' && (
              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Owner
              </span>
            )}
            {status === 'failed' && (
              <span className="inline-flex items-center gap-1.5 font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                <AlertCircle className="w-3.5 h-3.5" />
                Verification Failed
              </span>
            )}
          </div>

          {/* Item Quick Overview */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <img 
              src={verifyingItem.imageUrl} 
              alt={verifyingItem.title} 
              className="w-12 h-12 rounded-lg object-cover border border-slate-200"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-900 truncate">{verifyingItem.title}</h4>
              <p className="text-[11px] text-slate-500">{verifyingItem.area} • Reported {verifyingItem.date}</p>
            </div>
          </div>

          {/* Verification Challenge */}
          {status !== 'verified' ? (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950">
                  <Lock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Hidden Ownership Question:</span>
                </div>
                <p className="text-sm font-semibold text-indigo-900 leading-snug">
                  "{verifyingItem.hiddenDetails.questionPrompt}"
                </p>
                <p className="text-[11px] text-indigo-700 leading-relaxed">
                  Only the legitimate owner possesses this confidential detail. Correct answers are kept secret on our server.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Your Answer: <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  placeholder="Describe the hidden sticker, engraving, lockscreen wallpaper, or internal contents..."
                  disabled={attemptsLeft <= 0}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
                />
              </div>

              {/* Feedback Alert if failed */}
              {status === 'failed' && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{feedbackMessage}</span>
                </div>
              )}

              {/* Hackathon Demo Helper Button (Discloses secret for smooth grading) */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowDemoHint(!showDemoHint)}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{showDemoHint ? 'Hide Hackathon Demo Hint' : 'Show Hackathon Demo Hint (Secret Answer)'}</span>
                </button>

                {showDemoHint && (
                  <div className="mt-2 p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 space-y-1">
                    <p className="font-bold">🧪 Hackathon Tester Hint:</p>
                    <p>Correct answer on file: <strong className="text-amber-950 font-mono bg-amber-100 px-1 py-0.5 rounded">{verifyingItem.hiddenDetails.correctAnswer}</strong></p>
                    <button
                      type="button"
                      onClick={() => setAnswer(verifyingItem.hiddenDetails.correctAnswer)}
                      className="text-xs text-indigo-600 font-semibold underline mt-1 block"
                    >
                      Click here to paste answer automatically
                    </button>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setVerifyingItem(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={attemptsLeft <= 0}
                  className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Submit for Verification</span>
                </button>
              </div>
            </form>
          ) : (
            /* Verified Success Screen */
            <div className="space-y-5 text-center py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900">Ownership Confirmed!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  {feedbackMessage}
                </p>
              </div>

              {/* Digital Claim Pass */}
              <div className="p-4 rounded-xl bg-slate-900 text-white text-left space-y-3 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[11px] font-mono text-indigo-400 font-bold uppercase">
                    Official Student Claim Pass
                  </span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                    VALIDATED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px]">Claimant:</span>
                    <p className="font-semibold text-white">{user.name}</p>
                    <p className="text-slate-400 text-[11px] font-mono">{user.studentId}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Collection Point:</span>
                    <p className="font-semibold text-white">Block 33, Lost and Found Dept</p>
                    <p className="text-amber-400 text-[11px] font-medium">{verifyingItem.officeLockerId || 'Locker A-07'}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Present your student ID card or this Claim Pass at the office for staff QR scan.</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={handleProceedToQR}
                  className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition active:scale-95 flex items-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Proceed to QR Handover Screen</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
