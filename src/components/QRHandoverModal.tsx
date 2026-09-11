import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { useApp } from '../context/AppContext';
import { 
  X, 
  CheckCircle2, 
  QrCode, 
  ShieldCheck, 
  Building2, 
  Sparkles, 
  Lock, 
  Unlock, 
  UserCheck,
  Calendar,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export const QRHandoverModal: React.FC = () => {
  const { 
    qrHandoverItem, 
    setQrHandoverItem, 
    confirmHandover, 
    depositItemAtOffice,
    user 
  } = useApp();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [staffOfficer, setStaffOfficer] = useState('Officer J. Briggs (Badge #9042)');
  const [recipientStudentId, setRecipientStudentId] = useState('STU-2024-8142');
  const [handoverCompleted, setHandoverCompleted] = useState(false);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  const item = qrHandoverItem;

  useEffect(() => {
    if (!item) return;

    // Generate QR code data payload
    const qrPayload = JSON.stringify({
      caseId: item.id,
      title: item.title,
      locker: item.officeLockerId || 'Locker A-07',
      authCode: item.qrHandoverCode || `QR-${item.id}-HANDOVER`,
      timestamp: new Date().toISOString(),
    });

    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, qrPayload, {
        width: 220,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      }, (err) => {
        if (err) console.error('QR generation error:', err);
      });
    }

    if (item.status === 'recovered') {
      setHandoverCompleted(true);
      setActiveStep(3);
    }
  }, [item]);

  if (!item) return null;

  const isRecovered = item.status === 'recovered' || handoverCompleted;

  const handleDepositNow = () => {
    depositItemAtOffice(item.id, 'Locker A-07');
    setActiveStep(2);
  };

  const handleConfirmHandover = () => {
    confirmHandover(item.id, staffOfficer, recipientStudentId);
    setHandoverCompleted(true);
    setActiveStep(3);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Secure QR Handover Protocol</h2>
              <p className="text-xs text-slate-500">Case #{item.id} — Chain-of-Custody Verification</p>
            </div>
          </div>

          <button 
            onClick={() => setQrHandoverItem(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Handover Flow Progress Steps */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className={`p-2 rounded-lg border font-semibold ${
              item.status === 'deposited' || item.status === 'verified' || isRecovered
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}>
              1. Physical Deposit
            </div>
            <div className={`p-2 rounded-lg border font-semibold ${
              item.status === 'verified' || isRecovered
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}>
              2. Staff ID & QR Scan
            </div>
            <div className={`p-2 rounded-lg border font-semibold ${
              isRecovered
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}>
              3. Handover & Reward
            </div>
          </div>

          {/* Reward Status Banner (Anti-Cheating Core Flow) */}
          <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
            isRecovered 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-amber-50/90 border-amber-200 text-amber-950'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                isRecovered ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
              }`}>
                {isRecovered ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider block">
                  {isRecovered ? 'Reward Unlocked 🎉' : 'Reward Locked 🔒'}
                </span>
                <p className="text-xs text-slate-600 mt-0.5">
                  {isRecovered
                    ? `Finder has been awarded +${item.rewardPoints || 150} Campus Karma Points upon confirmed release.`
                    : 'Anti-Cheat Protection: Reward points are locked until physical drop-off and recipient QR handover.'}
                </p>
              </div>
            </div>

            <div className={`text-right shrink-0 px-3 py-1 rounded-lg font-bold text-xs ${
              isRecovered ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
            }`}>
              {item.rewardPoints || 150} pts
            </div>
          </div>

          {/* Two Columns: Left QR Canvas / Right Handover Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left: Interactive Canvas QR Code */}
            <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
              <div className="bg-white p-3 rounded-xl shadow-md border border-slate-200 inline-block">
                <canvas ref={canvasRef} className="rounded-lg max-w-full" />
              </div>
              <div className="space-y-0.5">
                <p className="font-mono text-xs font-bold text-slate-800">
                  {item.qrHandoverCode || `QR-${item.id}-HANDOVER`}
                </p>
                <p className="text-[11px] text-slate-500">
                  {item.officeLockerId ? `Stored at ${item.officeLockerId}` : 'Block 33, Lost and Found Department'}
                </p>
              </div>
            </div>

            {/* Right: Handover Execution Controls */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Physical Handover Protocol
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Campus security officer verifies claimant's physical student ID card against the verified Case ID record before confirming release.
                </p>
              </div>

              {/* Office Custody Check */}
              {item.status !== 'deposited' && item.status !== 'verified' && !isRecovered && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Item not yet marked as physically deposited</span>
                  </div>
                  <p className="text-[11px]">
                    Has the finder dropped this item off at Block 33 (Lost and Found Department)?
                  </p>
                  <button
                    onClick={handleDepositNow}
                    className="w-full py-1.5 px-3 bg-amber-600 text-white rounded-lg font-bold text-xs hover:bg-amber-700 transition flex items-center justify-center gap-1.5"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Confirm Item Physically Deposited</span>
                  </button>
                </div>
              )}

              {/* Staff Verification Form Fields */}
              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Supervising Security Officer:
                  </label>
                  <input
                    type="text"
                    value={staffOfficer}
                    onChange={e => setStaffOfficer(e.target.value)}
                    disabled={isRecovered}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Verified Recipient Student ID:
                  </label>
                  <input
                    type="text"
                    value={recipientStudentId}
                    onChange={e => setRecipientStudentId(e.target.value)}
                    disabled={isRecovered}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Action Button: Staff Confirms Handover */}
              {!isRecovered ? (
                <button
                  onClick={handleConfirmHandover}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Staff Confirm Handover & Release Item</span>
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Handover Officially Recorded</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    Handed over by {staffOfficer} to recipient [{recipientStudentId}] on {item.recoveredDate || 'Today'}. Case closed.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer close */}
          <div className="pt-2 flex justify-end border-t border-slate-100">
            <button
              onClick={() => setQrHandoverItem(null)}
              className="px-5 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition"
            >
              Close Screen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
