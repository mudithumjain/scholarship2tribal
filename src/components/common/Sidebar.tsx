import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Award, 
  CheckSquare, 
  FileText, 
  Wallet, 
  ShieldCheck, 
  CreditCard, 
  Bell, 
  Bot, 
  User, 
  HelpCircle,
  AlertCircle,
  BarChart3,
  LogOut,
  Settings
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
  onOpenArchitecture: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeCount?: number;
  isSpecial?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMobile, onOpenArchitecture }) => {
  const { role, activeTab, setActiveTab, t, notifications, officerReviews } = useApp();
  const { currentUser, logout } = useAuth();

  const unreadNotifs = notifications.filter(n => !n.read).length;
  const pendingReviews = officerReviews.filter(r => r.status === 'PENDING_REVIEW' || r.status === 'CORRECTION_REQUESTED').length;

  const studentNavItems: NavItem[] = [
    { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { id: 'scholarships', label: t('navScholarships'), icon: Award },
    { id: 'eligibility', label: t('navEligibility'), icon: CheckSquare },
    { id: 'applications', label: t('navApplications'), icon: FileText },
    { id: 'wallet', label: t('navDocuments'), icon: Wallet },
    { id: 'verification', label: t('navVerification'), icon: ShieldCheck, badge: 'DPI' },
    { id: 'payments', label: t('navPayments'), icon: CreditCard },
    { id: 'notifications', label: t('navNotifications'), icon: Bell, badgeCount: unreadNotifs },
    { id: 'jago', label: t('navJago'), icon: Bot, isSpecial: true },
    { id: 'profile', label: t('navProfile'), icon: User },
  ];

  const officerNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'manual-review', label: t('navManualReview'), icon: AlertCircle, badgeCount: pendingReviews },
    { id: 'applications', label: 'All Applications', icon: FileText },
    { id: 'verification', label: 'Verification System', icon: ShieldCheck },
    { id: 'analytics', label: t('navAnalytics'), icon: BarChart3 },
    { id: 'payments', label: 'Payment Monitoring', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell, badgeCount: unreadNotifs },
  ];

  const currentNavItems = role === 'student' 
    ? studentNavItems 
    : officerNavItems;

  const handleLogout = () => {
    onCloseMobile();
    logout();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed md:sticky top-18 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ height: 'calc(100vh - 4.5rem)' }}
      >
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {/* Role Indicator Banner */}
          <div className="px-3 py-2 mb-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
              Current Workspace
            </span>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-xs font-bold text-gov-navy">
                {currentUser?.role === 'STUDENT' ? 'Student Workspace' : 'Manager Workspace'}
              </span>
              <span className={`w-2 h-2 rounded-full ${currentUser?.role === 'STUDENT' ? 'bg-blue-500' : 'bg-amber-500'}`} />
            </div>
            {currentUser && (
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                {currentUser.name} • {currentUser.id}
              </p>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-0.5" aria-label="Main Navigation">
            {currentNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gov-navy text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badgeCount && item.badgeCount > 0 ? (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                      {item.badgeCount}
                    </span>
                  ) : item.badge ? (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-800">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Settings & Architecture / How It Works */}
          <div className="pt-4 border-t border-slate-100 mt-4 space-y-0.5">
            <button
              onClick={() => {
                setActiveTab('settings');
                onCloseMobile();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'settings'
                  ? 'bg-gov-navy text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>Settings</span>
            </button>

            <button
              onClick={() => {
                onOpenArchitecture();
                onCloseMobile();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-blue-50 hover:text-gov-primary transition-colors border border-dashed border-slate-200"
            >
              <HelpCircle className="w-4 h-4 text-gov-primary" />
              <span>{t('navHowItWorks')}</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Footer / Synthetic Demo Label */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500">
          <p className="font-semibold text-slate-700">Digital Public Infrastructure</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Problem Statement 26238 • MoTA</p>
        </div>
      </aside>
    </>
  );
};
