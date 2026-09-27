import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  UserRole, 
  Language, 
  StudentProfile, 
  ScholarshipScheme, 
  ScholarshipApplication, 
  StudentDocument, 
  PaymentRecord, 
  NotificationItem, 
  OfficerReviewItem, 
  JagoMessage,
  TimelineEvent
} from '../types';
import { 
  INITIAL_STUDENT_PROFILE, 
  SCHOLARSHIP_SCHEMES, 
  INITIAL_DOCUMENTS, 
  INITIAL_APPLICATIONS, 
  INITIAL_PAYMENTS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_OFFICER_REVIEWS 
} from '../data/mockData';
import { TRANSLATIONS } from '../data/i18n';
import { runUnifiedVerificationOrchestrator } from '../services/mockGovernmentApis';
import { useAuth } from './AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';
import { supabase } from '../lib/supabase';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedSchemeForDetail: ScholarshipScheme | null;
  setSelectedSchemeForDetail: (scheme: ScholarshipScheme | null) => void;
  
  // Data
  profile: StudentProfile;
  updateProfile: (updated: Partial<StudentProfile>) => void;
  schemes: ScholarshipScheme[];
  applications: ScholarshipApplication[];
  documents: StudentDocument[];
  payments: PaymentRecord[];
  notifications: NotificationItem[];
  officerReviews: OfficerReviewItem[];
  chatMessages: JagoMessage[];
  isIncomeRenewed: boolean;
  isDataLoading: boolean;

  // Actions
  applyForScholarship: (schemeCode: 'PRE_MATRIC' | 'POST_MATRIC' | 'TOP_CLASS' | 'NFST' | 'NOS', data: any) => void;
  uploadRenewedIncomeCertificate: () => Promise<void>;
  fetchFromDigiLocker: (docType: string) => Promise<void>;
  markNotificationRead: (id: string) => void;
  officerRequestCorrection: (reviewId: string, reason: string) => void;
  officerApproveApplication: (reviewId: string, remarks?: string) => void;
  officerRejectApplication: (reviewId: string, reason: string) => void;
  sendJagoMessage: (text: string) => void;
  runDemoStory: () => void;
  resetAllDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ─── Helper: Map Supabase DB row → existing frontend types ─────────────────

function mapDbScholarship(row: any): ScholarshipScheme {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    shortDescription: row.short_description || '',
    targetGroup: row.target_group || '',
    eligibilitySummary: row.eligibility_summary || [],
    maxIncomeLimit: Number(row.max_income_limit) || 0,
    benefitsSummary: row.benefits_summary || '',
    annualGrantAmountText: row.annual_grant_amount_text || '',
    requiredDocuments: row.required_documents || [],
    importantDates: row.important_dates || { portalOpen: '', lastDate: '', verificationDeadline: '' },
    demoRulesNote: row.demo_rules_note || '',
  };
}

function mapDbStudentProfile(row: any): StudentProfile {
  return {
    studentId: row.student_id,
    name: row.full_name,
    dob: row.date_of_birth || '',
    gender: row.gender || '',
    phone: row.mobile_number || '',
    email: row.email || '',
    state: row.state || '',
    district: row.district || '',
    pincode: row.pincode || '',
    stStatus: row.st_status || 'Pending',
    stCertificateNo: row.caste_certificate_number || '',
    tribeName: row.tribe_name || '',
    pvtgStatus: row.pvtg_status || false,
    pvtgGroup: row.pvtg_group,
    familyIncome: Number(row.family_income) || 0,
    incomeCertificateNo: row.income_certificate_number || '',
    incomeValidityDate: row.income_validity_date || '',
    institution: row.institution_name || '',
    institutionCode: row.institution_code || '',
    institutionState: row.institution_state || '',
    course: row.course || '',
    degreeLevel: row.course_level || 'Undergraduate',
    academicYear: row.academic_year || '',
    currentYearSemester: row.year_of_study || '',
    previousYearMarksPercentage: Number(row.previous_marks_percentage) || 0,
    disabilityStatus: row.disability_status || false,
    disabilityPercentage: row.disability_percentage ? Number(row.disability_percentage) : undefined,
    domicileState: row.domicile_state || '',
    domicileStatus: row.domicile_status || 'Pending',
    bankAccount: {
      accountNumberMasked: row.bank_account_masked || '',
      bankName: row.bank_name || '',
      ifscCode: row.ifsc_code || '',
      aadhaarSeeded: row.aadhaar_seeded || false,
      dbtActive: row.dbt_active || false,
    },
    apaarId: row.apaar_id,
    digilockerLinked: row.digilocker_linked || false,
  };
}

function mapDbApplication(row: any): ScholarshipApplication {
  return {
    id: row.application_number || row.id,
    schemeId: row.scholarship_id,
    schemeCode: row.scholarships?.code || 'POST_MATRIC',
    schemeName: row.scholarships?.name || '',
    academicSession: row.academic_year || '',
    appliedDate: row.application_date || '',
    currentStatus: row.status,
    currentStage: row.current_stage || 'SUBMITTED',
    claimedAmount: Number(row.claimed_amount) || 0,
    approvedAmount: row.approved_amount ? Number(row.approved_amount) : undefined,
    usedDigiLockerReuse: row.used_digilocker_reuse || false,
    timeline: row.timeline || [],
    verificationIssues: row.verification_issues,
  };
}

function mapDbDocument(row: any): StudentDocument {
  return {
    id: row.id,
    documentType: row.document_type,
    title: row.document_name || '',
    fileName: row.file_name || '',
    fileSize: row.file_size || '',
    uploadDate: row.uploaded_at ? new Date(row.uploaded_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
    source: row.source || 'Manual Upload',
    verificationStatus: row.verification_status || 'PENDING',
    expiryDate: row.expiry_date,
    certificateNumber: row.certificate_number,
    issuingAuthority: row.issuing_authority,
    ocrExtractedData: row.ocr_extracted_data,
  };
}

function mapDbPayment(row: any): PaymentRecord {
  return {
    id: row.id,
    applicationId: row.application_id,
    schemeName: row.scheme_name || '',
    amount: Number(row.amount) || 0,
    installmentNo: row.installment_no || '',
    status: row.payment_status || 'SANCTIONED',
    pfmsReferenceId: row.pfms_reference_id || '',
    bankUtrNumber: row.bank_utr_number || '',
    sanctionOrderNumber: row.sanction_order_number || '',
    sanctionDate: row.sanction_date || '',
    creditedDate: row.credited_date,
    bankName: row.bank_name || '',
    accountMasked: row.account_masked || '',
  };
}

function mapDbNotification(row: any): NotificationItem {
  return {
    id: row.id,
    type: row.type || 'INFO',
    title: row.title || '',
    message: row.message || '',
    timestamp: row.created_at ? new Date(row.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
    read: row.is_read || false,
    actionUrl: row.action_url,
    actionText: row.action_text,
    severity: row.severity,
  };
}

function mapDbOfficerReview(row: any): OfficerReviewItem {
  return {
    id: row.id,
    applicationId: row.application_id,
    studentId: row.student_id || '',
    studentName: row.student_name || '',
    schemeName: row.scheme_name || '',
    issueType: row.issue_type || 'INCOME_MISMATCH',
    sourceSystem: row.source_system || '',
    submittedValue: row.submitted_value || '',
    sourceValue: row.source_value || '',
    status: row.status || 'PENDING_REVIEW',
    flaggedDate: row.flagged_date || row.created_at || '',
    documentsAttached: row.documents_attached || [],
    officerRemarks: row.manager_remarks,
  };
}

// ─── AppProvider ───────────────────────────────────────────────────────────────

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('student');
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedSchemeForDetail, setSelectedSchemeForDetail] = useState<ScholarshipScheme | null>(null);

  const [profile, setProfile] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);
  const [schemes, setSchemes] = useState<ScholarshipScheme[]>(SCHOLARSHIP_SCHEMES);
  const [applications, setApplications] = useState<ScholarshipApplication[]>(INITIAL_APPLICATIONS);
  const [documents, setDocuments] = useState<StudentDocument[]>(INITIAL_DOCUMENTS);
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [officerReviews, setOfficerReviews] = useState<OfficerReviewItem[]>(INITIAL_OFFICER_REVIEWS);
  const [isIncomeRenewed, setIsIncomeRenewed] = useState<boolean>(false);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  // Chatbot state
  const [chatMessages, setChatMessages] = useState<JagoMessage[]>([
    {
      id: 'm-1',
      sender: 'jago',
      text: 'Johar Rahul! 🙏 I am JAGO, your dedicated MoTA Scholarship Assistant. How can I help you navigate your scholarship journey today?',
      timestamp: 'Just now',
      actionButton: {
        label: 'Why is my Post-Matric application pending?',
        action: 'check_post_matric_status'
      }
    }
  ]);

  // Get auth context (may not have currentUser yet on first render)
  let authCurrentUser: any = null;
  try {
    const auth = useAuth();
    authCurrentUser = auth.currentUser;
  } catch (e) {
    // AuthContext not available yet — okay, we'll use mock data
  }

  // ─── Load Data from Supabase when authenticated ──────────────────────────

  useEffect(() => {
    if (!isSupabaseConfigured() || !authCurrentUser) return;

    const loadFromSupabase = async () => {
      setIsDataLoading(true);
      try {
        // 1. Load scholarships (both roles need this)
        const { data: schemesData } = await supabase
          .from('scholarships')
          .select('*')
          .order('created_at');
        if (schemesData && schemesData.length > 0) {
          setSchemes(schemesData.map(mapDbScholarship));
        }

        if (authCurrentUser.role === 'STUDENT') {
          // 2. Load student profile
          const { data: profileData } = await supabase
            .from('student_profiles')
            .select('*')
            .eq('student_id', authCurrentUser.id)
            .single();
          if (profileData) {
            setProfile(mapDbStudentProfile(profileData));

            // 3. Load student applications (with scholarship join)
            const { data: appsData } = await supabase
              .from('applications')
              .select('*, scholarships(code, name)')
              .eq('student_id', profileData.id)
              .order('created_at', { ascending: false });
            if (appsData && appsData.length > 0) {
              setApplications(appsData.map(mapDbApplication));
            }

            // 4. Load documents
            const { data: docsData } = await supabase
              .from('documents')
              .select('*')
              .eq('student_id', profileData.id)
              .order('uploaded_at', { ascending: false });
            if (docsData && docsData.length > 0) {
              setDocuments(docsData.map(mapDbDocument));
            }

            // 5. Load payments
            const { data: payData } = await supabase
              .from('payments')
              .select('*')
              .eq('student_id', profileData.id)
              .order('created_at', { ascending: false });
            if (payData && payData.length > 0) {
              setPayments(payData.map(mapDbPayment));
            }
          }

          // 6. Load notifications for the user
          const { data: userData } = await supabase
            .from('users')
            .select('id')
            .eq('auth_id', (await supabase.auth.getUser()).data.user?.id)
            .single();
          if (userData) {
            const { data: notifData } = await supabase
              .from('notifications')
              .select('*')
              .eq('user_id', userData.id)
              .order('created_at', { ascending: false });
            if (notifData && notifData.length > 0) {
              setNotifications(notifData.map(mapDbNotification));
            }
          }
        } else if (authCurrentUser.role === 'MANAGER') {
          // Load all applications for manager
          const { data: appsData } = await supabase
            .from('applications')
            .select('*, scholarships(code, name)')
            .order('created_at', { ascending: false });
          if (appsData && appsData.length > 0) {
            setApplications(appsData.map(mapDbApplication));
          }

          // Load manual reviews
          const { data: reviewsData } = await supabase
            .from('manual_reviews')
            .select('*')
            .order('created_at', { ascending: false });
          if (reviewsData && reviewsData.length > 0) {
            setOfficerReviews(reviewsData.map(mapDbOfficerReview));
          }

          // Load all payments for monitoring
          const { data: payData } = await supabase
            .from('payments')
            .select('*')
            .order('created_at', { ascending: false });
          if (payData && payData.length > 0) {
            setPayments(payData.map(mapDbPayment));
          }

          // Load manager notifications
          const { data: userData } = await supabase
            .from('users')
            .select('id')
            .eq('auth_id', (await supabase.auth.getUser()).data.user?.id)
            .single();
          if (userData) {
            const { data: notifData } = await supabase
              .from('notifications')
              .select('*')
              .eq('user_id', userData.id)
              .order('created_at', { ascending: false });
            if (notifData && notifData.length > 0) {
              setNotifications(notifData.map(mapDbNotification));
            }
          }
        }
      } catch (err) {
        console.error('Failed to load data from Supabase:', err);
        // Silently fall back to mock data which is already set as defaults
      } finally {
        setIsDataLoading(false);
      }
    };

    loadFromSupabase();
  }, [authCurrentUser?.id, authCurrentUser?.role]);

  // Translation helper
  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  const updateProfile = (updated: Partial<StudentProfile>) => {
    setProfile(prev => ({ ...prev, ...updated }));

    // Also persist to Supabase if configured
    if (isSupabaseConfigured() && authCurrentUser?.role === 'STUDENT') {
      const dbUpdates: any = {};
      if (updated.name !== undefined) dbUpdates.full_name = updated.name;
      if (updated.phone !== undefined) dbUpdates.mobile_number = updated.phone;
      if (updated.email !== undefined) dbUpdates.email = updated.email;
      if (updated.state !== undefined) dbUpdates.state = updated.state;
      if (updated.district !== undefined) dbUpdates.district = updated.district;
      if (updated.familyIncome !== undefined) dbUpdates.family_income = updated.familyIncome;
      if (updated.incomeCertificateNo !== undefined) dbUpdates.income_certificate_number = updated.incomeCertificateNo;
      if (updated.incomeValidityDate !== undefined) dbUpdates.income_validity_date = updated.incomeValidityDate;

      if (Object.keys(dbUpdates).length > 0) {
        supabase
          .from('student_profiles')
          .update(dbUpdates)
          .eq('student_id', authCurrentUser.id)
          .then(({ error }) => {
            if (error) console.error('Failed to persist profile update:', error);
          });
      }
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

    // Persist to Supabase
    if (isSupabaseConfigured()) {
      supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.error('Failed to mark notification read:', error);
        });
    }
  };

  // Submit Application via Wizard
  const applyForScholarship = (
    schemeCode: 'PRE_MATRIC' | 'POST_MATRIC' | 'TOP_CLASS' | 'NFST' | 'NOS',
    formData: any
  ) => {
    const scheme = schemes.find(s => s.code === schemeCode);
    const newId = `APP-2026-ST-${schemeCode}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newApplication: ScholarshipApplication = {
      id: newId,
      schemeId: scheme?.id || 'scheme-custom',
      schemeCode,
      schemeName: scheme?.name || 'MoTA Scholarship Scheme',
      academicSession: '2025-26',
      appliedDate: 'Today, Just now',
      currentStatus: 'UNDER_VERIFICATION',
      currentStage: 'INSTITUTION_VERIFICATION',
      claimedAmount: schemeCode === 'TOP_CLASS' ? 120000 : schemeCode === 'NFST' ? 444000 : 68000,
      usedDigiLockerReuse: true,
      timeline: [
        {
          stage: 'SUBMITTED',
          label: 'Application Submitted',
          description: 'Successfully received on Unified Portal with verified DigiLocker documents',
          completedAt: 'Just now',
          status: 'COMPLETED'
        },
        {
          stage: 'INSTITUTION_VERIFICATION',
          label: 'Institution Verification',
          description: `Dispatched to ${profile.institution} AISHE portal for enrollment authentication`,
          status: 'IN_PROGRESS'
        },
        {
          stage: 'ST_VERIFICATION',
          label: 'ST Category Verification',
          description: 'Auto-verification queued via DigiLocker Caste vault',
          status: 'PENDING'
        },
        {
          stage: 'DOCUMENT_VERIFICATION',
          label: 'Document Verification',
          description: 'Direct verification with State revenue registries',
          status: 'PENDING'
        },
        {
          stage: 'DEPARTMENT_VERIFICATION',
          label: 'Department Sanction',
          description: 'Final review by Ministry of Tribal Affairs welfare officer',
          status: 'PENDING'
        },
        {
          stage: 'SANCTION',
          label: 'Sanction Order Generation',
          description: 'Automated sanction order creation for PFMS dispatch',
          status: 'PENDING'
        },
        {
          stage: 'DISBURSEMENT',
          label: 'DBT Direct Bank Disbursement',
          description: 'Direct electronic credit into Aadhaar-seeded account',
          status: 'PENDING'
        }
      ]
    };

    setApplications(prev => [newApplication, ...prev]);

    // Persist to Supabase
    if (isSupabaseConfigured()) {
      (async () => {
        try {
          const { data: profileData } = await supabase
            .from('student_profiles')
            .select('id')
            .eq('student_id', authCurrentUser?.id)
            .single();

          if (profileData) {
            await supabase.from('applications').insert({
              application_number: newId,
              student_id: profileData.id,
              scholarship_id: scheme?.id,
              academic_year: '2025-26',
              status: 'UNDER_VERIFICATION',
              current_stage: 'INSTITUTION_VERIFICATION',
              claimed_amount: newApplication.claimedAmount,
              used_digilocker_reuse: true,
              timeline: newApplication.timeline,
            });
          }
        } catch (err) {
          console.error('Failed to persist application:', err);
        }
      })();
    }

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'VERIFICATION',
      title: `Application Submitted: ${scheme?.name}`,
      message: `Your application #${newId} has been successfully submitted and forwarded for Institution Verification.`,
      timestamp: 'Just now',
      read: false,
      actionUrl: 'applications',
      actionText: 'Track Application',
      severity: 'success'
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Trigger confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    setActiveTab('applications');
  };

  // Upload or Renew Income Certificate (The Core Demo Story Step!)
  const uploadRenewedIncomeCertificate = async () => {
    setIsIncomeRenewed(true);

    // 1. Update Document in Wallet
    const updatedDocs: StudentDocument[] = documents.map(doc => {
      if (doc.documentType === 'INCOME_CERTIFICATE') {
        return {
          ...doc,
          title: 'Annual Family Income Certificate (FY 2025-26)',
          fileName: 'income_cert_2025_9902_renewed.pdf',
          uploadDate: 'Today, Just now',
          verificationStatus: 'VERIFIED',
          expiryDate: '2026-03-31',
          certificateNumber: 'KA/RD/INC/2025/9902',
          issuingAuthority: 'Tahsildar, Mangaluru Taluk, Govt of Karnataka',
          ocrExtractedData: {
            beneficiaryName: profile.name,
            documentNumber: 'KA/RD/INC/2025/9902',
            issueDate: '15 Aug 2025',
            annualIncome: 120000,
            consistencyScore: 99,
            matchedWithProfile: true
          }
        };
      }
      return doc;
    });
    setDocuments(updatedDocs);

    // 2. Update Student Profile
    setProfile(prev => ({
      ...prev,
      incomeCertificateNo: 'KA/RD/INC/2025/9902',
      incomeValidityDate: '2026-03-31'
    }));

    // 3. Update Application Status & Timeline
    setApplications(prev => prev.map(app => {
      if (app.schemeCode === 'POST_MATRIC') {
        const updatedTimeline: TimelineEvent[] = app.timeline.map(item => {
          if (item.stage === 'DEPARTMENT_VERIFICATION') {
            return {
              ...item,
              label: 'State Department Verification',
              description: 'Income Certificate FY 2025-26 verified with Nadakacheri e-District registry. Ready for sanction.',
              status: 'COMPLETED',
              completedAt: 'Today, Just now',
              actionRequired: undefined,
              officerNote: 'Renewed certificate authenticated successfully.'
            };
          }
          if (item.stage === 'SANCTION') {
            return {
              ...item,
              status: 'IN_PROGRESS',
              description: 'MoTA Central Sanction Order under generation.'
            };
          }
          return item;
        });

        return {
          ...app,
          currentStatus: 'UNDER_VERIFICATION',
          currentStage: 'SANCTION',
          verificationIssues: app.verificationIssues?.map(v => ({ ...v, resolved: true })),
          timeline: updatedTimeline
        };
      }
      return app;
    }));

    // 4. Update Officer Review Queue
    setOfficerReviews(prev => prev.map(item => {
      if (item.applicationId === 'APP-2025-ST-POST-1024') {
        return {
          ...item,
          status: 'APPROVED',
          officerRemarks: 'Student uploaded renewed FY 2025-26 certificate. Auto-verified via e-District adapter.'
        };
      }
      return item;
    }));

    // 5. Add Notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        type: 'VERIFICATION',
        title: 'Income Certificate Verified Successfully',
        message: 'Your renewed FY 2025-26 Income Certificate has been authenticated via Karnataka Nadakacheri e-District. Application advanced to Sanction Stage.',
        timestamp: 'Just now',
        read: false,
        actionUrl: 'verification',
        actionText: 'View Verification',
        severity: 'success'
      },
      ...prev
    ]);

    // 6. Push JAGO assistant message
    setChatMessages(prev => [
      ...prev,
      {
        id: `jago-${Date.now()}`,
        sender: 'jago',
        text: 'Great news Rahul! 🌟 Your renewed Income Certificate (#KA/RD/INC/2025/9902) was verified by the State e-District adapter. The mismatch flag has been cleared, and your Post-Matric application has progressed to the Sanction stage!',
        timestamp: 'Just now',
        actionButton: {
          label: 'View Application Timeline',
          action: 'view_timeline'
        }
      }
    ]);
  };

  // Fetch document from DigiLocker simulation
  const fetchFromDigiLocker = async (docType: string) => {
    await new Promise(r => setTimeout(r, 600));
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        type: 'INFO',
        title: 'DigiLocker Document Pulled',
        message: `Successfully synchronized digitally signed ${docType} from National DigiLocker Repository.`,
        timestamp: 'Just now',
        read: false,
        actionUrl: 'wallet',
        actionText: 'View in Wallet',
        severity: 'info'
      },
      ...prev
    ]);
  };

  // Officer Action: Request Correction
  const officerRequestCorrection = (reviewId: string, reason: string) => {
    setOfficerReviews(prev => prev.map(item => {
      if (item.id === reviewId) {
        return {
          ...item,
          status: 'CORRECTION_REQUESTED',
          officerRemarks: reason
        };
      }
      return item;
    }));

    // Update student's application status
    setApplications(prev => prev.map(app => {
      if (app.id === 'APP-2025-ST-POST-1024') {
        return {
          ...app,
          currentStatus: 'CORRECTION_REQUESTED',
          timeline: app.timeline.map(t => {
            if (t.stage === 'DEPARTMENT_VERIFICATION') {
              return {
                ...t,
                status: 'FLAGGED',
                actionRequired: reason,
                officerNote: reason
              };
            }
            return t;
          })
        };
      }
      return app;
    }));

    // Persist to Supabase
    if (isSupabaseConfigured()) {
      supabase.from('manual_reviews').update({
        status: 'CORRECTION_REQUESTED',
        manager_remarks: reason,
      }).eq('id', reviewId).then(({ error }) => {
        if (error) console.error('Failed to persist correction request:', error);
      });
    }

    // Notify Student
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        type: 'ACTION_REQUIRED',
        title: 'Officer Action Required: Correction Requested',
        message: `Welfare Officer requested: "${reason}". Please upload updated document in your Document Wallet.`,
        timestamp: 'Just now',
        read: false,
        actionUrl: 'wallet',
        actionText: 'Upload Document',
        severity: 'warning'
      },
      ...prev
    ]);
  };

  // Officer Action: Approve Application & Initiate DBT Payment
  const officerApproveApplication = (reviewId: string, remarks?: string) => {
    setOfficerReviews(prev => prev.map(item => {
      if (item.id === reviewId) {
        return {
          ...item,
          status: 'APPROVED',
          officerRemarks: remarks || 'Approved after reviewing digital verification and eligibility rules.'
        };
      }
      return item;
    }));

    // Update application to SANCTIONED -> DISBURSED
    setApplications(prev => prev.map(app => {
      if (app.id === 'APP-2025-ST-POST-1024') {
        const approvedTimeline: TimelineEvent[] = app.timeline.map(t => {
          if (t.stage === 'DEPARTMENT_VERIFICATION') {
            return {
              ...t,
              status: 'COMPLETED',
              completedAt: 'Today, Just now',
              description: 'Approved by MoTA Sanctioning Authority'
            };
          }
          if (t.stage === 'SANCTION') {
            return {
              ...t,
              status: 'COMPLETED',
              completedAt: 'Today, Just now',
              description: 'Sanction Order #MOTA/2026/KA/ST-9912 generated. Dispatched to PFMS.'
            };
          }
          if (t.stage === 'DISBURSEMENT') {
            return {
              ...t,
              status: 'COMPLETED',
              completedAt: 'Today, Just now',
              description: 'Direct Benefit Transfer (DBT) ₹34,000 credited to SBI ••••4589'
            };
          }
          return t;
        });

        return {
          ...app,
          currentStatus: 'DISBURSED',
          currentStage: 'DISBURSEMENT',
          approvedAmount: 34000,
          timeline: approvedTimeline
        };
      }
      return app;
    }));

    // Add new credited payment
    const newPayment: PaymentRecord = {
      id: `PAY-2026-${Date.now()}`,
      applicationId: 'APP-2025-ST-POST-1024',
      schemeName: 'Post-Matric Scholarship (B.Tech 3rd Year - Inst 1)',
      amount: 34000,
      installmentNo: 'Installment 1 of 2 (FY 2025-26)',
      status: 'CREDITED',
      pfmsReferenceId: 'PFMS/2026/MOTA/881902',
      bankUtrNumber: `UTR26092400${Math.floor(1000 + Math.random() * 9000)}`,
      sanctionOrderNumber: 'MOTA/2026/KA/ST-9912',
      sanctionDate: 'Today',
      creditedDate: 'Today, Just now',
      bankName: 'State Bank of India',
      accountMasked: '•••• •••• 4589'
    };
    setPayments(prev => [newPayment, ...prev]);

    // Persist to Supabase
    if (isSupabaseConfigured()) {
      supabase.from('manual_reviews').update({
        status: 'APPROVED',
        manager_remarks: remarks || 'Approved after reviewing digital verification.',
        resolved_at: new Date().toISOString(),
      }).eq('id', reviewId).then(({ error }) => {
        if (error) console.error('Failed to persist approval:', error);
      });
    }

    // Student notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        type: 'PAYMENT',
        title: 'DBT Payment Credited: ₹34,000',
        message: 'Direct Benefit Transfer of ₹34,000 for Post-Matric Scholarship has been successfully credited to your SBI account ••••4589 via PFMS.',
        timestamp: 'Just now',
        read: false,
        actionUrl: 'payments',
        actionText: 'View Receipt',
        severity: 'success'
      },
      ...prev
    ]);

    // Confetti celebration
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch (e) {}
  };

  // Officer Action: Reject Application
  const officerRejectApplication = (reviewId: string, reason: string) => {
    setOfficerReviews(prev => prev.map(item => {
      if (item.id === reviewId) {
        return {
          ...item,
          status: 'REJECTED',
          officerRemarks: reason
        };
      }
      return item;
    }));

    setApplications(prev => prev.map(app => {
      if (app.id === 'APP-2025-ST-POST-1024') {
        return {
          ...app,
          currentStatus: 'REJECTED'
        };
      }
      return app;
    }));

    // Persist to Supabase
    if (isSupabaseConfigured()) {
      supabase.from('manual_reviews').update({
        status: 'REJECTED',
        manager_remarks: reason,
        resolved_at: new Date().toISOString(),
      }).eq('id', reviewId).then(({ error }) => {
        if (error) console.error('Failed to persist rejection:', error);
      });
    }

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        type: 'ACTION_REQUIRED',
        title: 'Application Update: Ineligible',
        message: `Your application was rejected by the officer with reason: "${reason}". You may appeal or re-apply.`,
        timestamp: 'Just now',
        read: false,
        actionUrl: 'applications',
        actionText: 'Review Details',
        severity: 'danger'
      },
      ...prev
    ]);
  };

  // JAGO Chatbot Logic with Live Context Awareness
  const sendJagoMessage = (text: string) => {
    const userMsg: JagoMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now'
    };

    setChatMessages(prev => [...prev, userMsg]);

    // Generate intelligent contextual response
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = '';
      let actionBtn: { label: string; action: string } | undefined = undefined;

      const postMatricApp = applications.find(a => a.schemeCode === 'POST_MATRIC');
      const isPendingMismatch = postMatricApp?.currentStatus === 'MANUAL_REVIEW' || postMatricApp?.currentStatus === 'CORRECTION_REQUESTED';
      const isDisbursed = postMatricApp?.currentStatus === 'DISBURSED';

      if (lower.includes('status') || lower.includes('pending') || lower.includes('why')) {
        if (isPendingMismatch) {
          reply = `Rahul, your Post-Matric application (#APP-2025-ST-POST-1024) is currently in **Manual Review** at the Department stage.\n\n**Reason:** The State e-District database reported that your Income Certificate expired on 31-03-2025. You need to provide your renewed certificate for FY 2025-26. No automatic rejection was made thanks to MoTA's exception-handling policy!`;
          actionBtn = {
            label: 'Open Document Wallet to Upload',
            action: 'open_wallet'
          };
        } else if (isDisbursed) {
          reply = `🎉 Rahul, your Post-Matric application (#APP-2025-ST-POST-1024) has been **Approved and Disbursed**! A Direct Benefit Transfer (DBT) of ₹34,000 was credited to your SBI account ••••4589.`;
          actionBtn = {
            label: 'View Payment Receipt',
            action: 'open_payments'
          };
        } else {
          reply = `Rahul, your application is progressing well. Your ST caste identity, institution (NITK Surathkal), and academic scores have all been verified by the respective government adapters.`;
          actionBtn = {
            label: 'View Verification Center',
            action: 'open_verification'
          };
        }
      } else if (lower.includes('payment') || lower.includes('money') || lower.includes('credited') || lower.includes('amount')) {
        const totalCredited = payments.reduce((acc, p) => p.status === 'CREDITED' ? acc + p.amount : acc, 0);
        reply = `You have received a total of **₹${totalCredited.toLocaleString('en-IN')}** in Direct Benefit Transfers across your academic journey! Your most recent disbursement can be tracked with PFMS references.`;
        actionBtn = {
          label: 'Open Payment Dashboard',
          action: 'open_payments'
        };
      } else if (lower.includes('document') || lower.includes('wallet') || lower.includes('certificate')) {
        reply = `Your Document Wallet contains 6 digitized certificates linked via DigiLocker and State registries. ST Certificate (#KA/ST/2021/88921) is permanently verified. ${isIncomeRenewed ? 'Your renewed FY 2025-26 Income Certificate is also verified!' : 'Your Income Certificate requires renewal.'}`;
        actionBtn = {
          label: 'Manage Document Wallet',
          action: 'open_wallet'
        };
      } else if (lower.includes('top class') || lower.includes('eligible')) {
        reply = `Yes! Based on your student profile at **NITK Surathkal (AISHE Code C-1284)** and family income of ₹1,20,000 (well within the ₹6.0 LPA ceiling), you are **Potentially Eligible** for the **Top Class Education Scholarship**! This covers 100% of your tuition fees plus ₹86,000 in living and computer allowances.`;
        actionBtn = {
          label: 'Check Eligibility & Apply',
          action: 'open_eligibility'
        };
      } else if (lower.includes('nfst') || lower.includes('fellowship')) {
        reply = `The **National Fellowship for ST Students (NFST)** provides ₹37,000–₹42,000/month for M.Phil and Ph.D. scholars who have qualified UGC-NET/CSIR-NET. Since you are currently enrolled in B.Tech (Undergraduate), you will be eligible when you enroll in a research program.`;
        actionBtn = {
          label: 'View NFST Scheme Details',
          action: 'open_scholarships'
        };
      } else if (lower.includes('nos') || lower.includes('overseas') || lower.includes('abroad')) {
        reply = `The **National Overseas Scholarship (NOS)** supports ST students pursuing Master's or Ph.D. degrees in top 500 QS world universities abroad, covering full overseas tuition and ~$15,400 annual stipend. You will need an unconditional admission offer from a qualifying foreign university.`;
        actionBtn = {
          label: 'Explore NOS Guidelines',
          action: 'open_scholarships'
        };
      } else {
        reply = `I am here to help you with anything regarding the 5 MoTA scholarship schemes (Pre-Matric, Post-Matric, Top Class, NFST, NOS), your document verification status, or DBT bank disbursements. Feel free to ask!`;
        actionBtn = {
          label: 'Check My Eligibility',
          action: 'open_eligibility'
        };
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: `jago-${Date.now()}`,
          sender: 'jago',
          text: reply,
          timestamp: 'Just now',
          actionButton: actionBtn
        }
      ]);
    }, 450);
  };

  // 2-Minute Demo Story Walkthrough Runner
  const runDemoStory = () => {
    // Switch to student view, then navigate to dashboard
    setRole('student');
    setActiveTab('dashboard');

    setTimeout(() => {
      // Step 1: Open verification center showing mismatch
      setActiveTab('verification');
    }, 1500);
  };

  // Reset all state to clean initial mock
  const resetAllDemoData = () => {
    setProfile(INITIAL_STUDENT_PROFILE);
    setApplications(INITIAL_APPLICATIONS);
    setDocuments(INITIAL_DOCUMENTS);
    setPayments(INITIAL_PAYMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setOfficerReviews(INITIAL_OFFICER_REVIEWS);
    setIsIncomeRenewed(false);
    setRole('student');
    setActiveTab('dashboard');
    setChatMessages([
      {
        id: 'm-reset',
        sender: 'jago',
        text: 'Johar Rahul! 🙏 System state reset to initial demo values. Your Post-Matric application is currently at Department Verification with an Income Certificate expiry exception.',
        timestamp: 'Just now',
        actionButton: {
          label: 'Review Verification Status',
          action: 'open_verification'
        }
      }
    ]);
  };

  return (
    <AppContext.Provider value={{
      role,
      setRole,
      language,
      setLanguage,
      t,
      activeTab,
      setActiveTab,
      selectedSchemeForDetail,
      setSelectedSchemeForDetail,
      profile,
      updateProfile,
      schemes,
      applications,
      documents,
      payments,
      notifications,
      officerReviews,
      chatMessages,
      isIncomeRenewed,
      isDataLoading,
      applyForScholarship,
      uploadRenewedIncomeCertificate,
      fetchFromDigiLocker,
      markNotificationRead,
      officerRequestCorrection,
      officerApproveApplication,
      officerRejectApplication,
      sendJagoMessage,
      runDemoStory,
      resetAllDemoData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
