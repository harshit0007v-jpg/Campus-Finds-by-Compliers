import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Gift, 
  Check, 
  Trash2,
  ArrowRight
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    items, 
    setSelectedItem,
    setMatchingPair,
    setQrHandoverItem
  } = useApp();

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationRead(notif.id);

    if (notif.relatedItemId) {
      const item = items.find(it => it.id === notif.relatedItemId);
      if (item) {
        if (notif.type === 'match' && item.matchedItemId) {
          const counterpart = items.find(it => it.id === item.matchedItemId);
          if (counterpart) {
            setMatchingPair({
              lost: item.type === 'lost' ? item : counterpart,
              found: item.type === 'found' ? item : counterpart,
            });
            return;
          }
        }
        if (notif.type === 'recovery' || notif.type === 'reward') {
          setQrHandoverItem(item);
          return;
        }
        setSelectedItem(item);
      }
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'match':
        return <Sparkles className="w-5 h-5 text-indigo-600" />;
      case 'deposit':
        return <Building2 className="w-5 h-5 text-amber-600" />;
      case 'verification':
        return <ShieldCheck className="w-5 h-5 text-blue-600" />;
      case 'recovery':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'reward':
        return <Gift className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-5 h-5 text-indigo-600" />
            <h1 className="text-2xl font-black text-slate-900">Notifications</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time updates on AI match detections, campus office custody changes, and verified returns.
          </p>
        </div>

        {notifications.some(n => !n.read) && (
          <button
            onClick={markAllNotificationsRead}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
        {notifications.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">
            No notifications at this time
          </div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 sm:p-5 flex items-start gap-4 hover:bg-slate-50 transition cursor-pointer ${
                !notif.read ? 'bg-indigo-50/40' : ''
              }`}
            >
              <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-sm font-bold truncate ${!notif.read ? 'text-indigo-950 font-extrabold' : 'text-slate-800'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[11px] text-slate-600 shrink-0">{notif.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>

                {notif.relatedItemId && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-indigo-600 hover:underline flex items-center gap-1">
                      <span>Inspect Case #{notif.relatedItemId}</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
