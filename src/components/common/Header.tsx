import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Language } from '../../types';
import { 
  Bell, 
  Globe, 
  HelpCircle, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Menu,
  X,
  LogOut
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onOpenArchitecture: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenArchitecture }) => {
  const { 
    role, 
    language, 
    setLanguage, 
    t, 
    notifications, 
    markNotificationRead, 
    setActiveTab, 
    profile 
  } = useApp();
  const { currentUser, logout } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
    { code: 'or', label: 'ଓଡ଼ିଆ' }
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* National Tricolor Accent Strip */}
      <div className="h-1 w-full flex">
        <div className="w-1/3 bg-[#FF6B00]"></div>
        <div className="w-1/3 bg-white"></div>
        <div className="w-1/3 bg-[#138808]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Emblem & App Branding */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button 
              onClick={onToggleSidebar}
              className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* National Emblem & MoTA Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gov-navy flex items-center justify-center text-white font-black text-xl shadow-xs border border-gov-blue/20">
              <span className="text-amber-400">TS</span>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-bold tracking-tight text-gov-navy leading-none">
                  {t('appName')}
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-gov-primary border border-blue-200">
                  MoTA • PS ID: 26238
                </span>
              </div>
              <p className="text-[11px] md:text-xs text-slate-500 font-medium truncate max-w-[240px] sm:max-w-md">
                {t('appSubtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Actions, Language, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Architecture / How It Works Button */}
          <button
            onClick={onOpenArchitecture}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
          >
            <HelpCircle className="w-3.5 h-3.5 text-gov-primary" />
            <span>Architecture & DPI Flow</span>
          </button>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <label htmlFor="language-select" className="sr-only">Select Language</label>
            <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
            <select
              id="language-select"
              aria-label="Select Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="pl-7 pr-2 py-1 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 focus:outline-hidden focus:ring-1 focus:ring-gov-primary cursor-pointer"
            >
              {languages.map(l => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Drawer */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-800">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      className={`p-3 text-xs transition-colors ${notif.read ? 'bg-white opacity-85' : 'bg-blue-50/60'}`}
                      onClick={() => markNotificationRead(notif.id)}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5">
                          {notif.type === 'ACTION_REQUIRED' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                          ) : notif.type === 'PAYMENT' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Bell className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800 leading-snug">{notif.title}</p>
                          <p className="text-slate-600 mt-0.5 line-clamp-2">{notif.message}</p>
                          <div className="flex items-center justify-between mt-2 pt-1 text-[11px] text-slate-400 border-t border-slate-100/60">
                            <span>{notif.timestamp}</span>
                            {notif.actionText && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markNotificationRead(notif.id);
                                  setShowNotifications(false);
                                  if (notif.actionUrl) setActiveTab(notif.actionUrl);
                                }}
                                className="font-bold text-gov-primary hover:text-blue-700 flex items-center gap-1"
                              >
                                <span>{notif.actionText}</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-4 py-2 border-t border-slate-100 text-center bg-slate-50 rounded-b-xl">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      setActiveTab('notifications');
                    }}
                    className="text-xs font-semibold text-gov-primary hover:underline"
                  >
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Badge */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 font-bold text-xs">
              {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('') : 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-none">
                {currentUser?.name || 'User'}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                {currentUser?.role === 'STUDENT' ? profile.studentId : currentUser?.officialRole || currentUser?.id}
              </p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
