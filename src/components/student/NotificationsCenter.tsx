import React from 'react';
import { useApp } from '../../context/AppContext';
import { NotificationItem } from '../../types';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  CreditCard, 
  ArrowRight, 
  Clock, 
  ShieldCheck,
  CheckCheck
} from 'lucide-react';

export const NotificationsCenter: React.FC = () => {
  const { notifications, markNotificationRead, setActiveTab } = useApp();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-gov-primary" />
            <span>Actionable Notification Center</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time alerts regarding document verifications, officer requests, and DBT bank disbursements.
          </p>
        </div>

        <button
          onClick={() => notifications.forEach(n => markNotificationRead(n.id))}
          className="text-xs font-semibold text-gov-primary hover:underline flex items-center gap-1"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notif: NotificationItem) => (
          <div
            key={notif.id}
            onClick={() => markNotificationRead(notif.id)}
            className={`p-4 rounded-xl border transition-all text-xs ${
              !notif.read ? 'bg-white border-blue-300 shadow-sm ring-1 ring-blue-100' : 'bg-slate-50/70 border-slate-200 opacity-80'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                {notif.type === 'ACTION_REQUIRED' ? (
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  </div>
                ) : notif.type === 'PAYMENT' ? (
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{notif.title}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">{notif.timestamp}</span>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed">{notif.message}</p>

                {notif.actionText && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markNotificationRead(notif.id);
                        if (notif.actionUrl) setActiveTab(notif.actionUrl);
                      }}
                      className="px-3 py-1.5 bg-gov-navy hover:bg-gov-blue text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <span>{notif.actionText}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
