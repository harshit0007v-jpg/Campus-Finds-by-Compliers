import React from 'react';
import { ItemStatus } from '../types';
import { Clock, Sparkles, Building2, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface StatusBadgeProps {
  status: ItemStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', showIcon = true }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  };

  switch (status) {
    case 'reported':
      return (
        <span className={`inline-flex items-center rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses[size]}`}>
          {showIcon && <Clock className="w-3.5 h-3.5 text-slate-500" />}
          Reported
        </span>
      );
    case 'potential_match':
      return (
        <span className={`inline-flex items-center rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 animate-pulse ${sizeClasses[size]}`}>
          {showIcon && <Sparkles className="w-3.5 h-3.5 text-indigo-600" />}
          Potential Match
        </span>
      );
    case 'deposited':
      return (
        <span className={`inline-flex items-center rounded-full bg-amber-50 text-amber-800 border border-amber-200 ${sizeClasses[size]}`}>
          {showIcon && <Building2 className="w-3.5 h-3.5 text-amber-600" />}
          Deposited at Office
        </span>
      );
    case 'verified':
      return (
        <span className={`inline-flex items-center rounded-full bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses[size]}`}>
          {showIcon && <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />}
          Ownership Verified
        </span>
      );
    case 'recovered':
      return (
        <span className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses[size]}`}>
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
          Recovered
        </span>
      );
    default:
      return null;
  }
};
