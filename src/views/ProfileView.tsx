import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Award, 
  Gift, 
  Lock, 
  CheckCircle2, 
  User, 
  Mail, 
  GraduationCap, 
  Building2, 
  QrCode, 
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Edit2,
  Check,
  LogOut
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, updateUserEmail, items, resetDemoData, fireConfetti, logout } = useApp();
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState(user.email);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      updateUserEmail(emailInput.trim());
      setIsEditingEmail(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const handleClaimVoucher = () => {
    fireConfetti();
  };

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'CF';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Student Identity Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-2xl shadow-md">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{user.name}</h1>
                <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Student
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{user.studentId}</p>
              <p className="text-xs text-slate-600 mt-1">{user.department} ({user.year})</p>
            </div>
          </div>

          {/* Trust Score Badge */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[140px]">
            <div className="flex items-center justify-center gap-1 text-emerald-600 font-black text-3xl">
              <span>{user.trustScore}</span>
              <span className="text-sm font-bold text-slate-400">/100</span>
            </div>
            <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mt-0.5">
              Campus Trust Score
            </p>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium inline-block mt-1">
              Top 2% Finder Status
            </span>
          </div>
        </div>

        {/* User Email ID Management Card */}
        <div className="mt-6 pt-5 border-t border-slate-100 bg-slate-50/70 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-6 sm:p-8 rounded-b-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-indigo-600" />
                Active User Email ID
              </span>
              {!isEditingEmail ? (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm sm:text-base font-bold text-slate-900 select-all">
                    {user.email}
                  </span>
                  {savedSuccess && (
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Saved!
                    </span>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSaveEmail} className="flex items-center gap-2 mt-1">
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
                    className="text-xs font-mono px-3 py-1.5 rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsEditingEmail(false); setEmailInput(user.email); }}
                    className="px-2.5 py-1.5 bg-slate-200 text-slate-700 text-xs rounded-lg hover:bg-slate-300 transition"
                  >
                    Cancel
                  </button>
                </form>
              )}
              <p className="text-[11px] text-slate-500">
                All lost item matches and finder custody receipts will be synchronized to this email ID.
              </p>
            </div>

            {!isEditingEmail && (
              <button
                onClick={() => { setIsEditingEmail(true); setEmailInput(user.email); }}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition flex items-center gap-1.5 shadow-2xs"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Change Email</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Trust & Anti-Cheating Architecture Matrix */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Anti-Cheating & Reputation Architecture</span>
          </div>
          <h2 className="text-xl font-bold">Why Campus Find by Compilers Prevents Fraud & Scams</h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Standard campus forums suffer from fake claims, theft, and spam reports. Campus Find by Compilers enforces a multi-layer verification protocol.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Campus SSO Verification</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Every reporter and claimant is authenticated via institutional .edu student credentials and linked university ID numbers.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 font-bold text-indigo-400">
              <Lock className="w-4 h-4" />
              <span>Hidden Identifying Vault</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Secret markings, engravings, serials, and wallet photos are encrypted. Only legitimate owners can pass verification challenges.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <Building2 className="w-4 h-4" />
              <span>Physical Office Custody</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Finders physically deposit valuable items at Block 33 (Lost and Found Department), ensuring chain-of-custody before release.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 font-bold text-violet-400">
              <QrCode className="w-4 h-4" />
              <span>Cryptographic QR Handover</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Staff scan the unique case QR code and visually inspect physical student ID cards before completing handover.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 font-bold text-pink-400">
              <Gift className="w-4 h-4" />
              <span>Escrow Reward Release</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Rewards are never released for merely filing a report. Points unlock strictly after confirmed physical return.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sky-400">
              <Award className="w-4 h-4" />
              <span>Dynamic Trust Scoring</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Successful returns increase campus reputation score. Failed or fraudulent claim attempts trigger security flag reviews.
            </p>
          </div>
        </div>
      </div>

      {/* Rewards & Campus Perks Redemption */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Gift className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-bold text-slate-900">Campus Karma Rewards Store</h3>
            </div>
            <p className="text-xs text-slate-500">
              Redeem karma points unlocked from verified campus returns.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium">Current Balance:</span>
            <div className="text-xl font-black text-indigo-600">{user.rewardBalance} pts</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-slate-900">Campus Coffee Voucher</span>
                <span className="text-indigo-600">100 pts</span>
              </div>
              <p className="text-slate-500">Free specialty drink or cold brew at Central Library Cafe.</p>
            </div>
            <button
              onClick={handleClaimVoucher}
              disabled={user.rewardBalance < 100}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition disabled:opacity-50"
            >
              Redeem Voucher
            </button>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-slate-900">Bookstore $10 Gift Card</span>
                <span className="text-indigo-600">200 pts</span>
              </div>
              <p className="text-slate-500">Applicable towards stationery, university merch, or textbooks.</p>
            </div>
            <button
              onClick={handleClaimVoucher}
              disabled={user.rewardBalance < 200}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition disabled:opacity-50"
            >
              Redeem Voucher
            </button>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-slate-900">Library Study Room Priority</span>
                <span className="text-indigo-600">350 pts</span>
              </div>
              <p className="text-slate-500">Guaranteed 4-hour quiet study room reservation pass during midterms.</p>
            </div>
            <button
              onClick={handleClaimVoucher}
              disabled={user.rewardBalance < 350}
              className="w-full py-2 bg-slate-300 text-slate-600 rounded-lg font-bold cursor-not-allowed"
            >
              {user.rewardBalance < 350 ? 'Need 350 pts' : 'Redeem'}
            </button>
          </div>
        </div>
      </div>

      {/* Account Session & Login Access */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-indigo-600" />
            <span>Active OTP Authentication Session</span>
          </h3>
          <p className="text-xs text-slate-500">
            Authenticated as <strong className="text-slate-800 font-mono">{user.email}</strong>. You can sign out to re-enter via OTP with another email ID.
          </p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-600" />
          <span>Sign Out & Return to Login</span>
        </button>
      </div>
    </div>
  );
};
