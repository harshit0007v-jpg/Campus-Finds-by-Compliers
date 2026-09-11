import React, { useState } from 'react';
import { CampusItem } from '../types';
import { StatusBadge } from './StatusBadge';
import { MapPin, Calendar, Tag, Sparkles, Building2, ShieldCheck, ArrowRight, Lock, Image as ImageIcon, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ItemCardProps {
  item: CampusItem;
  showMatchButton?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, showMatchButton = true }) => {
  const { setSelectedItem, setMatchingPair, items, setVerifyingItem } = useApp();
  const [imageError, setImageError] = useState(false);

  const handleCardClick = () => {
    setSelectedItem(item);
  };

  const handleMatchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.matchedItemId) {
      const counterpart = items.find(it => it.id === item.matchedItemId);
      if (counterpart) {
        const lost = item.type === 'lost' ? item : counterpart;
        const found = item.type === 'found' ? item : counterpart;
        setMatchingPair({ lost, found });
      }
    }
  };

  const isLost = item.type === 'lost';

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Image & Type Overlay */}
      <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
        {item.imageUrl && !imageError ? (
          <img 
            src={item.imageUrl} 
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center text-slate-400 gap-1.5 p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-white/80 shadow-xs flex items-center justify-center text-slate-500">
              <ImageIcon className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-600 line-clamp-1">{item.title}</span>
            <span className="text-[10px] text-slate-400">{item.category}</span>
          </div>
        )}

        {/* Type Badge: LOST (Rose) vs FOUND (Indigo) */}
        <div className="absolute top-2.5 left-2.5">
          <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider shadow-sm ${
            isLost 
              ? 'bg-rose-600 text-white' 
              : 'bg-indigo-600 text-white'
          }`}>
            {isLost ? 'Lost Item' : 'Found Item'}
          </span>
        </div>

        {/* Case ID badge */}
        <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded shadow-sm">
          #{item.id}
        </div>

        {/* Match Percentage Overlay if matched */}
        {item.matchPercentage && (
          <div className="absolute bottom-2.5 left-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>{item.matchPercentage}% AI Match</span>
          </div>
        )}

        {/* Office Locker badge if deposited */}
        {item.officeLockerId && (
          <div className="absolute bottom-2.5 right-2.5 bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            <span>{item.officeLockerId}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Header Row: Category & Status */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
              <Tag className="w-3 h-3 text-slate-400" />
              {item.category}
            </span>
            <StatusBadge status={item.status} size="sm" />
          </div>

          {/* Title */}
          <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition text-sm sm:text-base line-clamp-1">
            {item.title}
          </h3>

          {/* Location & Date */}
          <div className="mt-2 space-y-1 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-medium text-slate-700">{item.area}</span>
              <span className="text-slate-400">•</span>
              <span className="truncate">{item.locationDetail}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{item.date}</span>
              <span>at {item.time}</span>
            </div>

            {/* Finder / User Email */}
            {(item.finderEmail || item.reportedBy?.email) && (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-mono truncate pt-0.5">
                <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span className="text-slate-400 font-sans font-medium text-[10px] uppercase">
                  {item.type === 'found' ? 'Finder:' : 'Reporter:'}
                </span>
                <span className="truncate text-slate-700 font-medium">
                  {item.type === 'found' 
                    ? (item.finderEmail || item.reportedBy?.email) 
                    : (item.reporterEmail || item.reportedBy?.email)}
                </span>
              </div>
            )}
          </div>

          {/* Public Description */}
          <p className="mt-2.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Footer Area with Card Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Reward or Anti-Cheat Notice */}
          <div className="text-[11px] font-medium text-slate-500">
            {item.type === 'found' ? (
              item.status === 'recovered' ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  🎉 Reward Unlocked ({item.rewardPoints} pts)
                </span>
              ) : (
                <span className="text-amber-700 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Reward Locked (150 pts)
                </span>
              )
            ) : (
              <span className="text-slate-600">Protected by Campus Office</span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-1.5">
            {showMatchButton && item.matchedItemId && (
              <button
                onClick={handleMatchClick}
                className="px-2.5 py-1 text-xs font-semibold rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition flex items-center gap-1"
                title="View AI Match"
              >
                <Sparkles className="w-3 h-3 text-indigo-600" />
                <span>Match</span>
              </button>
            )}

            <button
              onClick={handleCardClick}
              className="px-3 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition flex items-center gap-1"
            >
              <span>Details</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
