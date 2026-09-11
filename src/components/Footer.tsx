import React from 'react';
import { Shield, Building, Clock, QrCode, Sparkles, MapPin, Users, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CENTRAL_OFFICE_INFO, DEPARTMENT_CONTACTS } from '../mockData';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                CF
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-lg tracking-tight">Campus Find</span>
                <span className="text-[10px] font-semibold text-indigo-400 bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded">
                  by Compilers
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Campus Find by Compilers — Smart Campus Lost & Found ecosystem. Connecting students across campus zones to safely report and recover items through AI matching, hidden question verification, and verified physical custody handovers.
            </p>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official University Campus Network</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Quick Access</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('lost')} className="hover:text-white transition cursor-pointer">
                  Browse Lost Items
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('found')} className="hover:text-white transition cursor-pointer">
                  Browse Found Items
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('browse')} className="hover:text-white transition cursor-pointer">
                  Browse by Campus Buildings
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('office')} className="hover:text-amber-400 text-amber-300 font-medium transition flex items-center gap-1 cursor-pointer">
                  <Building className="w-3.5 h-3.5" /> Lost & Found Department Desk
                </button>
              </li>
            </ul>

            <div className="pt-2">
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-emerald-400 text-[11px]">
                  <Shield className="w-3 h-3" />
                  <span>Zero-Fraud Custody</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  All claim handovers verified by student ID & secure QR scanning at Block 33.
                </p>
              </div>
            </div>
          </div>

          {/* Central Office Desk & Timings */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Central Office</h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white text-sm">{CENTRAL_OFFICE_INFO.building}</p>
                    <p className="text-xs text-slate-300 font-medium">{CENTRAL_OFFICE_INFO.department}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-1.5 border-t border-slate-700/70">
                  <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Operating Hours:</span>
                    <span className="text-xs text-slate-200 font-semibold">{CENTRAL_OFFICE_INFO.timings}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium pt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{CENTRAL_OFFICE_INFO.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Department Contact Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Contact Details</h4>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2">
                {DEPARTMENT_CONTACTS.map((officer, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2 py-1 border-b border-slate-700/50 last:border-b-0 text-[11px]">
                    <div className="flex items-center gap-1.5 font-medium text-slate-200">
                      <UserCheck className="w-3 h-3 text-indigo-400 shrink-0" />
                      <span className="font-semibold text-white">{officer.name}</span>
                    </div>
                    <div className="text-slate-400 font-mono text-[11px]">
                      contact - {officer.contact !== '-' ? officer.contact : ''}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 text-right">
                Lost and Found Department • Block 33
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 Campus Find by Compilers — Official University Lost & Found Network (Block 33).</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-slate-400">
              <QrCode className="w-3.5 h-3.5 text-indigo-400" /> Real-time QR Engine
            </span>
            <span className="text-slate-600">•</span>
            <span>Student Privacy Protected</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
