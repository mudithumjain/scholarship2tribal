import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Award, 
  FileText, 
  Wallet, 
  Bot, 
  User 
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, t, notifications } = useApp();
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'scholarships', label: 'Schemes', icon: Award },
    { id: 'applications', label: 'Apply', icon: FileText },
    { id: 'wallet', label: 'Docs', icon: Wallet },
    { id: 'jago', label: 'JAGO', icon: Bot, isAssistant: true },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1 shadow-lg flex items-center justify-around"
    >
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        if (item.isAssistant) {
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center justify-center -mt-4"
              aria-label="JAGO AI Assistant"
            >
              <div className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-all ${
                isActive ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300' : 'bg-gov-navy text-amber-400'
              }`}>
                <Bot className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold mt-0.5 ${isActive ? 'text-gov-navy' : 'text-slate-500'}`}>
                JAGO
              </span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
              isActive ? 'text-gov-navy font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'text-gov-primary' : 'text-slate-400'}`} />
              {item.id === 'applications' && unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-amber-500" />
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
