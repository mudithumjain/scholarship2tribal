import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { MobileNav } from './components/common/MobileNav';
import { ArchitectureModal } from './components/common/ArchitectureModal';
import { ScholarshipDetailsModal } from './components/student/ScholarshipDetailsModal';

// Auth Screens
import { RoleSelectionScreen } from './components/auth/RoleSelectionScreen';
import { StudentLoginScreen } from './components/auth/StudentLoginScreen';
import { ManagerLoginScreen } from './components/auth/ManagerLoginScreen';

// Student Views
import { StudentDashboard } from './components/student/StudentDashboard';
import { ScholarshipList } from './components/student/ScholarshipList';
import { EligibilityChecker } from './components/student/EligibilityChecker';
import { ApplicationWizard } from './components/student/ApplicationWizard';
import { DocumentWallet } from './components/student/DocumentWallet';
import { VerificationCenter } from './components/student/VerificationCenter';
import { ApplicationTimeline } from './components/student/ApplicationTimeline';
import { PaymentDashboard } from './components/student/PaymentDashboard';
import { NotificationsCenter } from './components/student/NotificationsCenter';
import { JagoChatbot } from './components/student/JagoChatbot';
import { StudentProfile } from './components/student/StudentProfile';

// Officer & Admin Views
import { OfficerDashboard } from './components/officer/OfficerDashboard';
import { ScholarshipGapAnalytics } from './components/admin/ScholarshipGapAnalytics';

import { Bot, ShieldAlert, ArrowRight } from 'lucide-react';

// ─── Access Restricted Component ───────────────────────────────────────────────

const AccessRestricted: React.FC<{
  message: string;
  buttonLabel: string;
  onReturn: () => void;
}> = ({ message, buttonLabel, onReturn }) => (
  <div className="flex-1 flex items-center justify-center p-8">
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12 max-w-md text-center">
      <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4">
        <ShieldAlert className="w-7 h-7 text-red-500" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">Access Restricted</h2>
      <p className="text-sm text-slate-500 mb-6">{message}</p>
      <button
        onClick={onReturn}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gov-navy hover:bg-gov-blue text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
      >
        <span>{buttonLabel}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// ─── Main Authenticated App Content ────────────────────────────────────────────

export const AppContent: React.FC = () => {
  const { 
    role, 
    setRole,
    activeTab, 
    setActiveTab, 
    schemes, 
    selectedSchemeForDetail, 
    setSelectedSchemeForDetail 
  } = useApp();

  const { currentUser } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [architectureOpen, setArchitectureOpen] = useState(false);
  const [wizardSchemeCode, setWizardSchemeCode] = useState<string | null>(null);
  const [floatingJagoOpen, setFloatingJagoOpen] = useState(false);

  // Sync auth role with AppContext role on login
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'STUDENT') {
        setRole('student');
        setActiveTab('dashboard');
      } else if (currentUser.role === 'MANAGER') {
        setRole('officer');
        setActiveTab('dashboard');
      }
    }
  }, [currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Role-Based Tab Access Control ─────────────────────────────────────────

  const studentTabs = new Set([
    'dashboard', 'scholarships', 'eligibility', 'apply', 'applications',
    'wallet', 'verification', 'payments', 'notifications', 'jago', 'profile', 'settings'
  ]);

  const managerTabs = new Set([
    'dashboard', 'manual-review', 'applications', 'verification',
    'analytics', 'payments', 'notifications', 'settings'
  ]);

  const isStudentRole = currentUser?.role === 'STUDENT';
  const isManagerRole = currentUser?.role === 'MANAGER';

  // Check if current tab is restricted
  const isTabRestricted = (() => {
    if (isStudentRole && !studentTabs.has(activeTab)) return true;
    if (isManagerRole && !managerTabs.has(activeTab)) return true;
    return false;
  })();

  const handleOpenDetails = (schemeId: string) => {
    const s = schemes.find(item => item.id === schemeId) || null;
    setSelectedSchemeForDetail(s);
  };

  const handleOpenApply = (schemeCode: string) => {
    setWizardSchemeCode(schemeCode);
    setActiveTab('apply');
  };

  // Show access restricted if trying to access wrong role's tab
  if (isTabRestricted) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
        <Header 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenArchitecture={() => setArchitectureOpen(true)}
        />
        <AccessRestricted
          message={
            isStudentRole
              ? 'You do not have permission to access this section.'
              : 'This section is available only to students.'
          }
          buttonLabel={
            isStudentRole ? 'Return to Student Dashboard' : 'Return to Manager Dashboard'
          }
          onReturn={() => setActiveTab('dashboard')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Official MoTA Brand Header */}
      <Header 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onOpenArchitecture={() => setArchitectureOpen(true)}
      />

      {/* Main Body: Sidebar + Dynamic Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar 
          isOpen={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
          onOpenArchitecture={() => setArchitectureOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 overflow-y-auto">
          {/* Active Application Wizard */}
          {activeTab === 'apply' && isStudentRole && (
            <ApplicationWizard 
              initialSchemeCode={wizardSchemeCode || 'TOP_CLASS'}
              onCancel={() => setActiveTab('dashboard')}
            />
          )}

          {/* Student Views — Only for STUDENT role */}
          {activeTab === 'dashboard' && isStudentRole && (
            <StudentDashboard 
              onOpenDetails={handleOpenDetails}
              onOpenApply={handleOpenApply}
            />
          )}

          {activeTab === 'scholarships' && isStudentRole && (
            <ScholarshipList 
              onOpenDetails={handleOpenDetails}
              onOpenApply={handleOpenApply}
            />
          )}

          {activeTab === 'eligibility' && isStudentRole && (
            <EligibilityChecker 
              onApplyScheme={handleOpenApply}
            />
          )}

          {activeTab === 'applications' && isStudentRole && (
            <ApplicationTimeline />
          )}

          {activeTab === 'wallet' && isStudentRole && (
            <DocumentWallet />
          )}

          {activeTab === 'verification' && isStudentRole && (
            <VerificationCenter />
          )}

          {activeTab === 'payments' && isStudentRole && (
            <PaymentDashboard />
          )}

          {activeTab === 'notifications' && isStudentRole && (
            <NotificationsCenter />
          )}

          {activeTab === 'profile' && isStudentRole && (
            <StudentProfile />
          )}

          {activeTab === 'jago' && isStudentRole && (
            <div className="py-2">
              <JagoChatbot />
            </div>
          )}

          {/* Officer / Manager Views — Only for MANAGER role */}
          {(activeTab === 'dashboard' || activeTab === 'manual-review') && isManagerRole && (
            <OfficerDashboard />
          )}

          {activeTab === 'applications' && isManagerRole && (
            <OfficerDashboard />
          )}

          {activeTab === 'verification' && isManagerRole && (
            <VerificationCenter />
          )}

          {activeTab === 'payments' && isManagerRole && (
            <PaymentDashboard />
          )}

          {activeTab === 'notifications' && isManagerRole && (
            <NotificationsCenter />
          )}

          {activeTab === 'analytics' && isManagerRole && (
            <ScholarshipGapAnalytics />
          )}

          {/* Settings placeholder for both roles */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Settings</h2>
              <p className="text-sm text-slate-500">Settings and preferences for your account.</p>
              <div className="mt-6 space-y-4 text-sm">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-semibold text-slate-700">Account</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Logged in as <strong>{currentUser?.name}</strong> ({currentUser?.role})
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-semibold text-slate-700">Language</p>
                  <p className="text-xs text-slate-500 mt-1">Use the language selector in the header to change language.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-semibold text-slate-700">Notifications</p>
                  <p className="text-xs text-slate-500 mt-1">All notification preferences are enabled by default.</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation (PWA style) — Only for students */}
      {isStudentRole && <MobileNav />}

      {/* Floating JAGO Assistant Button — Only for students */}
      {isStudentRole && activeTab !== 'jago' && (
        <>
          {!floatingJagoOpen && (
            <button
              onClick={() => setFloatingJagoOpen(true)}
              className="fixed bottom-16 md:bottom-6 right-4 sm:right-6 z-40 bg-gov-navy hover:bg-gov-blue text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-2xl flex items-center gap-2 border-2 border-amber-400 hover:scale-105 transition-all group"
              aria-label="Open JAGO AI Assistant"
            >
              <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <span className="hidden sm:inline-block text-xs font-bold text-amber-300">
                Ask JAGO
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping hidden sm:inline-block" />
            </button>
          )}

          {/* Floating Chat Modal */}
          {floatingJagoOpen && (
            <JagoChatbot 
              isFloating={true}
              isOpenFloating={floatingJagoOpen}
              onCloseFloating={() => setFloatingJagoOpen(false)}
            />
          )}
        </>
      )}

      {/* Modals */}
      <ArchitectureModal 
        isOpen={architectureOpen}
        onClose={() => setArchitectureOpen(false)}
      />

      <ScholarshipDetailsModal 
        scheme={selectedSchemeForDetail}
        onClose={() => setSelectedSchemeForDetail(null)}
        onApply={handleOpenApply}
      />
    </div>
  );
};

// ─── Root App Component ────────────────────────────────────────────────────────

export default function App() {
  const { authScreen, isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking existing Supabase session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-xl bg-gov-navy flex items-center justify-center text-white font-black text-2xl shadow-md border border-gov-blue/20 mx-auto mb-4">
            <span className="text-amber-400">TS</span>
          </div>
          <div className="w-8 h-8 border-2 border-slate-300 border-t-gov-navy rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500 font-medium">Loading TribalScholar...</p>
        </div>
      </div>
    );
  }

  // Show auth screens before the app
  if (!isAuthenticated) {
    switch (authScreen) {
      case 'student-login':
        return <StudentLoginScreen />;
      case 'manager-login':
        return <ManagerLoginScreen />;
      case 'role-select':
      default:
        return <RoleSelectionScreen />;
    }
  }

  // Authenticated — show the main application
  return <AppContent />;
}
