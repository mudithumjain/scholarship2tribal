// Data Model & Types for TribalScholar Platform

export type UserRole = 'student' | 'officer' | 'admin' | 'public';

export type AuthRole = 'STUDENT' | 'MANAGER';

export interface CurrentUser {
  id: string;
  name: string;
  role: AuthRole;
  officialRole?: string;
  phone?: string;
  email?: string;
}

export type Language = 'en' | 'hi' | 'kn' | 'or';

export type VerificationStatus = 'VERIFIED' | 'PENDING' | 'MANUAL_REVIEW' | 'MISMATCH' | 'FAILED' | 'NOT_AVAILABLE';

export type ApplicationStage = 
  | 'SUBMITTED' 
  | 'INSTITUTION_VERIFICATION' 
  | 'ST_VERIFICATION' 
  | 'DOCUMENT_VERIFICATION' 
  | 'DEPARTMENT_VERIFICATION' 
  | 'SANCTION' 
  | 'DISBURSEMENT';

export type PaymentStatus = 'SANCTIONED' | 'PAYMENT_INITIATED' | 'BANK_PROCESSING' | 'CREDITED' | 'FAILED';

export interface StudentProfile {
  studentId: string;
  name: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  state: string;
  district: string;
  pincode: string;
  stStatus: 'Verified' | 'Pending' | 'Needs Review';
  stCertificateNo: string;
  tribeName: string;
  pvtgStatus: boolean; // Particularly Vulnerable Tribal Group
  pvtgGroup?: string;
  familyIncome: number; // e.g. 120000
  incomeCertificateNo: string;
  incomeValidityDate: string;
  institution: string;
  institutionCode: string; // AISHE Code
  institutionState: string;
  course: string;
  degreeLevel: 'Class 9-10' | 'Class 11-12' | 'Undergraduate' | 'Postgraduate' | 'M.Phil / Ph.D.' | 'Overseas Degree';
  academicYear: string;
  currentYearSemester: string;
  previousYearMarksPercentage: number;
  disabilityStatus: boolean;
  disabilityPercentage?: number;
  domicileState: string;
  domicileStatus: 'Verified' | 'Pending' | 'Needs Review';
  bankAccount: {
    accountNumberMasked: string;
    bankName: string;
    ifscCode: string;
    aadhaarSeeded: boolean;
    dbtActive: boolean;
  };
  apaarId?: string;
  digilockerLinked: boolean;
}

export interface ScholarshipScheme {
  id: string;
  code: 'PRE_MATRIC' | 'POST_MATRIC' | 'TOP_CLASS' | 'NFST' | 'NOS';
  name: string;
  shortDescription: string;
  targetGroup: string;
  eligibilitySummary: string[];
  maxIncomeLimit: number; // in INR per annum (e.g. 250000, 600000)
  benefitsSummary: string;
  annualGrantAmountText: string;
  requiredDocuments: string[];
  importantDates: {
    portalOpen: string;
    lastDate: string;
    verificationDeadline: string;
  };
  demoRulesNote: string;
}

export interface StudentDocument {
  id: string;
  documentType: 
    | 'ST_CERTIFICATE' 
    | 'PVTG_CERTIFICATE' 
    | 'INCOME_CERTIFICATE' 
    | 'DOMICILE_CERTIFICATE' 
    | 'MARKSHEET' 
    | 'INSTITUTION_ID' 
    | 'DISABILITY_CERTIFICATE' 
    | 'NET_JRF_CERTIFICATE' 
    | 'OVERSEAS_OFFER' 
    | 'BANK_PASSBOOK';
  title: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  source: 'DigiLocker' | 'Manual Upload' | 'e-District Direct' | 'Institution Sync';
  verificationStatus: VerificationStatus;
  expiryDate?: string;
  certificateNumber?: string;
  issuingAuthority?: string;
  ocrExtractedData?: {
    beneficiaryName: string;
    documentNumber: string;
    issueDate: string;
    annualIncome?: number;
    category?: string;
    consistencyScore: number; // 0 to 100
    matchedWithProfile: boolean;
    discrepancyNote?: string;
  };
}

export interface TimelineEvent {
  stage: ApplicationStage;
  label: string;
  description: string;
  completedAt?: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'FLAGGED';
  actionRequired?: string;
  officerNote?: string;
}

export interface ScholarshipApplication {
  id: string;
  schemeId: string;
  schemeCode: 'PRE_MATRIC' | 'POST_MATRIC' | 'TOP_CLASS' | 'NFST' | 'NOS';
  schemeName: string;
  academicSession: string;
  appliedDate: string;
  currentStatus: 'DRAFT' | 'SUBMITTED' | 'UNDER_VERIFICATION' | 'MANUAL_REVIEW' | 'CORRECTION_REQUESTED' | 'SANCTIONED' | 'DISBURSED' | 'REJECTED';
  currentStage: ApplicationStage;
  claimedAmount: number;
  approvedAmount?: number;
  timeline: TimelineEvent[];
  verificationIssues?: {
    field: string;
    issueDescription: string;
    sourceSystem: string;
    flaggedAt: string;
    resolved: boolean;
    officerCorrectionNote?: string;
  }[];
  usedDigiLockerReuse: boolean;
}

export interface PaymentRecord {
  id: string;
  applicationId: string;
  schemeName: string;
  amount: number;
  installmentNo: string;
  status: PaymentStatus;
  pfmsReferenceId: string;
  bankUtrNumber: string;
  sanctionOrderNumber: string;
  sanctionDate: string;
  creditedDate?: string;
  bankName: string;
  accountMasked: string;
}

export interface NotificationItem {
  id: string;
  type: 'VERIFICATION' | 'ACTION_REQUIRED' | 'PAYMENT' | 'OFFICER_NOTE' | 'INFO';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  severity?: 'warning' | 'info' | 'success' | 'danger';
}

export interface OfficerReviewItem {
  id: string;
  applicationId: string;
  studentId: string;
  studentName: string;
  schemeName: string;
  issueType: 'INCOME_MISMATCH' | 'ST_CERTIFICATE_EXPIRED' | 'AISHE_CODE_MISMATCH' | 'DOMICILE_STATE_DISCREPANCY' | 'PVTG_VALIDATION';
  sourceSystem: string;
  submittedValue: string;
  sourceValue: string;
  status: 'PENDING_REVIEW' | 'CORRECTION_REQUESTED' | 'APPROVED' | 'REJECTED';
  flaggedDate: string;
  documentsAttached: string[];
  officerRemarks?: string;
}

export interface MockAdapterLog {
  id: string;
  adapterName: string;
  endpoint: string;
  status: 'CONNECTED' | 'LATENCY_NORMAL' | 'WARN_MISMATCH';
  lastPingMs: number;
  recordsVerifiedCount: number;
  description: string;
}

export interface JagoMessage {
  id: string;
  sender: 'user' | 'jago';
  text: string;
  timestamp: string;
  actionButton?: {
    label: string;
    action: string;
  };
  highlightInfo?: string;
}
