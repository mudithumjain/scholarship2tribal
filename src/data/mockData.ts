import { 
  StudentProfile, 
  ScholarshipScheme, 
  ScholarshipApplication, 
  StudentDocument, 
  PaymentRecord, 
  NotificationItem, 
  OfficerReviewItem, 
  MockAdapterLog 
} from '../types';

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  studentId: 'ST10001',
  name: 'Rahul Kumar',
  dob: '2004-05-14',
  gender: 'Male',
  phone: '+91 98765 43210',
  email: 'rahul.kumar.st@demo.gov.in',
  state: 'Karnataka',
  district: 'Dakshina Kannada',
  pincode: '575025',
  stStatus: 'Verified',
  stCertificateNo: 'KA/ST/2021/88921',
  tribeName: 'Naikda / Nayaka',
  pvtgStatus: false,
  familyIncome: 120000,
  incomeCertificateNo: 'KA/RD/INC/2024/7741',
  incomeValidityDate: '2025-03-31', // Intentionally set to trigger demo manual review
  institution: 'National Institute of Technology Karnataka (NITK), Surathkal',
  institutionCode: 'AISHE-C-1284',
  institutionState: 'Karnataka',
  course: 'B.Tech - Computer Science & Engineering',
  degreeLevel: 'Undergraduate',
  academicYear: '2025-26',
  currentYearSemester: '3rd Year / 6th Semester',
  previousYearMarksPercentage: 81.5,
  disabilityStatus: false,
  domicileState: 'Karnataka',
  domicileStatus: 'Verified',
  bankAccount: {
    accountNumberMasked: '•••• •••• 4589',
    bankName: 'State Bank of India',
    ifscCode: 'SBIN0002273',
    aadhaarSeeded: true,
    dbtActive: true,
  },
  apaarId: 'APAAR-9812-7721-4019',
  digilockerLinked: true
};

export const SCHOLARSHIP_SCHEMES: ScholarshipScheme[] = [
  {
    id: 'scheme-1',
    code: 'PRE_MATRIC',
    name: 'Pre-Matric Scholarship for ST Students',
    shortDescription: 'Financial assistance for Scheduled Tribe students studying in Classes IX and X to minimize drop-out rates.',
    targetGroup: 'ST Students enrolled in Class 9 or 10 in recognized schools.',
    eligibilitySummary: [
      'Must belong to Scheduled Tribe (ST) category.',
      'Enrolled as regular, full-time student in Class IX or X.',
      'Annual parental/family income must not exceed ₹2,50,000 per annum.',
      'Not receiving any other Central or State pre-matric scholarship.'
    ],
    maxIncomeLimit: 250000,
    benefitsSummary: 'Maintenance allowance: ₹3,500/year (Day Scholars) | ₹7,000/year (Hostellers) + Book Grant.',
    annualGrantAmountText: '₹3,500 - ₹7,000 / year',
    requiredDocuments: [
      'ST Community Certificate',
      'Income Certificate (Tehsildar / SDO)',
      'Previous Year Marksheet (Class VIII / IX)',
      'School Bonafide / Enrollment Certificate',
      'Bank Account linked with Aadhaar'
    ],
    importantDates: {
      portalOpen: '01 July 2025',
      lastDate: '30 November 2025',
      verificationDeadline: '15 December 2025'
    },
    demoRulesNote: 'Official MoTA scheme. Under demo rules, applicable for Class 9-10 applicants.'
  },
  {
    id: 'scheme-2',
    code: 'POST_MATRIC',
    name: 'Post-Matric Scholarship for ST Students',
    shortDescription: 'Comprehensive financial support for post-secondary education from Class XI to Post-Doctoral studies.',
    targetGroup: 'ST Students enrolled in Class 11, 12, ITI, Polytechnic, UG, PG, or Ph.D.',
    eligibilitySummary: [
      'Must belong to Scheduled Tribe (ST) category.',
      'Enrolled in post-matriculation or post-secondary course recognized by UGC/AICTE/State Board.',
      'Annual parental/family income must not exceed ₹2,50,000 per annum.',
      'Direct Benefit Transfer (DBT) into Aadhaar-seeded bank account.'
    ],
    maxIncomeLimit: 250000,
    benefitsSummary: '100% compulsory non-refundable fees reimbursement + monthly maintenance allowance up to ₹13,500/yr.',
    annualGrantAmountText: 'Up to ₹1,20,000 / year (Full Tuition + Stipend)',
    requiredDocuments: [
      'ST Caste Certificate (DigiLocker verified)',
      'Annual Family Income Certificate (Valid FY 2025-26)',
      'Class 10th & 12th / Previous Semester Marksheet',
      'College Bonafide & Fee Receipt',
      'Aadhaar-seeded Bank Account Passbook'
    ],
    importantDates: {
      portalOpen: '15 July 2025',
      lastDate: '31 December 2025',
      verificationDeadline: '15 January 2026'
    },
    demoRulesNote: 'Primary demo active scheme. Rahul is enrolled in B.Tech 3rd year at NITK.'
  },
  {
    id: 'scheme-3',
    code: 'TOP_CLASS',
    name: 'Top Class Education Scholarship for ST Students',
    shortDescription: 'Excellence scholarship for ST students admitted to premier notified institutions (IITs, NITs, IIMs, AIIMS, NLUs).',
    targetGroup: 'ST Students admitted into any of the 260+ Central Government notified premier institutions.',
    eligibilitySummary: [
      'Must belong to Scheduled Tribe (ST) category.',
      'Secured admission in a notified Premier Institute (NITK Surathkal is notified under Code C-1284).',
      'Total family income from all sources not exceeding ₹6,00,000 per annum.',
      'Scholarship covers full duration of course subject to passing performance.'
    ],
    maxIncomeLimit: 600000,
    benefitsSummary: 'Full tuition fee waiver + Living expenses ₹3,000/month + Books/stationery allowance ₹5,000/yr + One-time computer grant ₹45,000.',
    annualGrantAmountText: 'Full Tuition Waiver + ₹86,000 Allowances / year',
    requiredDocuments: [
      'ST Community Certificate',
      'Institute Admission / Allotment Letter (JEE Main / CSAB)',
      'Income Certificate (Not exceeding ₹6.0 LPA)',
      'Institute Fee Structure Breakdown',
      'Hostel Accommodation Proof'
    ],
    importantDates: {
      portalOpen: '01 August 2025',
      lastDate: '15 January 2026',
      verificationDeadline: '31 January 2026'
    },
    demoRulesNote: 'Rahul is enrolled in NITK Surathkal and family income is ₹1.2 LPA, making him potentially eligible!'
  },
  {
    id: 'scheme-4',
    code: 'NFST',
    name: 'National Fellowship for ST Students (NFST)',
    shortDescription: 'Prestigious national research fellowship for pursuing regular M.Phil. and Ph.D. degrees in Indian Universities.',
    targetGroup: 'ST Scholars pursuing full-time M.Phil or Ph.D. in Science, Humanities, Engineering or Medical fields.',
    eligibilitySummary: [
      'Must belong to Scheduled Tribe (ST).',
      'Qualified UGC-NET or CSIR-NET or GATE examination.',
      'Enrolled in regular full-time Ph.D. or M.Phil program in UGC-recognized University.',
      'No income ceiling limit (Purely merit and research enrollment based).'
    ],
    maxIncomeLimit: 999999999, // No income ceiling
    benefitsSummary: 'JRF: ₹37,000/month + HRA | SRF: ₹42,000/month + HRA + Contingency Grant ₹20,000/year.',
    annualGrantAmountText: '₹4,44,000 to ₹5,04,000 / year + HRA',
    requiredDocuments: [
      'ST Certificate',
      'UGC-NET / CSIR-NET / GATE Scorecard & Award Letter',
      'Ph.D. / M.Phil Registration / Enrolment Letter',
      'Research Supervisor & Head of Department Endorsement',
      'Aadhaar-seeded Bank Account'
    ],
    importantDates: {
      portalOpen: '01 September 2025',
      lastDate: '28 February 2026',
      verificationDeadline: '15 March 2026'
    },
    demoRulesNote: 'Rahul is currently in B.Tech (UG), so he is not currently eligible until pursuing Ph.D.'
  },
  {
    id: 'scheme-5',
    code: 'NOS',
    name: 'National Overseas Scholarship for ST Students (NOS)',
    shortDescription: 'Financial assistance for meritorious ST students to pursue Master level courses and Ph.D. abroad.',
    targetGroup: 'ST Candidates holding unconditional admission offer from top 500 QS/Times World University Rankings.',
    eligibilitySummary: [
      'Must belong to Scheduled Tribe (ST).',
      'Secured unconditional offer from world university ranked within Top 500 QS World University Rankings.',
      'Total family income from all sources not exceeding ₹8,00,000 per annum.',
      'Minimum 55% marks or equivalent grade in relevant qualifying degree.'
    ],
    maxIncomeLimit: 800000,
    benefitsSummary: '100% Tuition fee paid directly to foreign university + Annual maintenance allowance (US$ 15,400 for USA / £9,900 for UK) + Economy airfare.',
    annualGrantAmountText: 'Full Overseas Tuition + ~₹14,00,000 / year Stipend',
    requiredDocuments: [
      'ST Certificate',
      'Valid Indian Passport',
      'Unconditional Admission Letter from Foreign University',
      'QS World Ranking proof of Institution',
      'Income Certificate (Not exceeding ₹8.0 LPA)'
    ],
    importantDates: {
      portalOpen: '15 February 2026',
      lastDate: '31 March 2026',
      verificationDeadline: '15 April 2026'
    },
    demoRulesNote: 'Rahul does not currently hold an overseas university admission offer.'
  }
];

export const INITIAL_DOCUMENTS: StudentDocument[] = [
  {
    id: 'doc-1',
    documentType: 'ST_CERTIFICATE',
    title: 'ST Community Certificate',
    fileName: 'caste_cert_KA_ST_2021_88921.pdf',
    fileSize: '420 KB',
    uploadDate: '12 Jul 2025',
    source: 'DigiLocker',
    verificationStatus: 'VERIFIED',
    certificateNumber: 'KA/ST/2021/88921',
    issuingAuthority: 'Tahsildar, Mangaluru Taluk, Govt of Karnataka',
    ocrExtractedData: {
      beneficiaryName: 'Rahul Kumar',
      documentNumber: 'KA/ST/2021/88921',
      issueDate: '14 Oct 2021',
      category: 'Scheduled Tribe (Naikda)',
      consistencyScore: 100,
      matchedWithProfile: true
    }
  },
  {
    id: 'doc-2',
    documentType: 'INCOME_CERTIFICATE',
    title: 'Annual Family Income Certificate',
    fileName: 'income_cert_2024_7741.pdf',
    fileSize: '380 KB',
    uploadDate: '15 Jul 2025',
    source: 'e-District Direct',
    verificationStatus: 'MANUAL_REVIEW', // Trigger of the core demo story!
    expiryDate: '2025-03-31',
    certificateNumber: 'KA/RD/INC/2024/7741',
    issuingAuthority: 'Revenue Department, Govt of Karnataka',
    ocrExtractedData: {
      beneficiaryName: 'Rahul Kumar',
      documentNumber: 'KA/RD/INC/2024/7741',
      issueDate: '12 Apr 2024',
      annualIncome: 120000,
      consistencyScore: 68,
      matchedWithProfile: false,
      discrepancyNote: 'Certificate expired on 31-03-2025. Financial year renewal required.'
    }
  },
  {
    id: 'doc-3',
    documentType: 'MARKSHEET',
    title: 'Class 12th / PUC Academic Marksheet',
    fileName: 'karnataka_pue_marksheet_2022.pdf',
    fileSize: '510 KB',
    uploadDate: '12 Jul 2025',
    source: 'DigiLocker',
    verificationStatus: 'VERIFIED',
    certificateNumber: 'PUE/2022/991044',
    issuingAuthority: 'Department of Pre-University Education, Karnataka',
    ocrExtractedData: {
      beneficiaryName: 'Rahul Kumar',
      documentNumber: 'PUE/2022/991044',
      issueDate: '18 May 2022',
      consistencyScore: 98,
      matchedWithProfile: true
    }
  },
  {
    id: 'doc-4',
    documentType: 'INSTITUTION_ID',
    title: 'NITK Bonafide & Fee Receipt',
    fileName: 'nitk_bonafide_2025_26.pdf',
    fileSize: '640 KB',
    uploadDate: '18 Jul 2025',
    source: 'Institution Sync',
    verificationStatus: 'VERIFIED',
    certificateNumber: 'NITK/CSE/2025/309',
    issuingAuthority: 'Registrar, NITK Surathkal',
    ocrExtractedData: {
      beneficiaryName: 'Rahul Kumar',
      documentNumber: 'NITK/CSE/2025/309',
      issueDate: '05 Jul 2025',
      consistencyScore: 100,
      matchedWithProfile: true
    }
  },
  {
    id: 'doc-5',
    documentType: 'DOMICILE_CERTIFICATE',
    title: 'Karnataka Domicile Certificate',
    fileName: 'domicile_cert_KA_2020.pdf',
    fileSize: '310 KB',
    uploadDate: '12 Jul 2025',
    source: 'DigiLocker',
    verificationStatus: 'VERIFIED',
    certificateNumber: 'DOM/KA/2020/44819',
    issuingAuthority: 'Deputy Commissioner, Dakshina Kannada',
    ocrExtractedData: {
      beneficiaryName: 'Rahul Kumar',
      documentNumber: 'DOM/KA/2020/44819',
      issueDate: '20 Aug 2020',
      consistencyScore: 99,
      matchedWithProfile: true
    }
  },
  {
    id: 'doc-6',
    documentType: 'BANK_PASSBOOK',
    title: 'SBI Bank Account & Aadhaar Mandate',
    fileName: 'sbi_passbook_dbt_mandate.pdf',
    fileSize: '450 KB',
    uploadDate: '12 Jul 2025',
    source: 'DigiLocker',
    verificationStatus: 'VERIFIED',
    certificateNumber: 'NPCI/MAP/2023/1029',
    issuingAuthority: 'NPCI Aadhaar Payment Bridge System',
    ocrExtractedData: {
      beneficiaryName: 'Rahul Kumar',
      documentNumber: 'NPCI/MAP/2023/1029',
      issueDate: '11 Jan 2023',
      consistencyScore: 100,
      matchedWithProfile: true
    }
  }
];

export const INITIAL_APPLICATIONS: ScholarshipApplication[] = [
  {
    id: 'APP-2024-ST-PM-091',
    schemeId: 'scheme-1',
    schemeCode: 'PRE_MATRIC',
    schemeName: 'Pre-Matric Scholarship for ST Students',
    academicSession: '2023-24',
    appliedDate: '18 Aug 2023',
    currentStatus: 'DISBURSED',
    currentStage: 'DISBURSEMENT',
    claimedAmount: 7000,
    approvedAmount: 7000,
    usedDigiLockerReuse: true,
    timeline: [
      {
        stage: 'SUBMITTED',
        label: 'Application Submitted',
        description: 'Online application submitted via Unified Portal',
        completedAt: '18 Aug 2023, 11:30 AM',
        status: 'COMPLETED'
      },
      {
        stage: 'INSTITUTION_VERIFICATION',
        label: 'School Verification',
        description: 'Verified by Principal, Govt Pre-University College',
        completedAt: '25 Aug 2023, 04:15 PM',
        status: 'COMPLETED'
      },
      {
        stage: 'ST_VERIFICATION',
        label: 'ST Community Check',
        description: 'Auto-verified with Karnataka e-Pramana Caste Database',
        completedAt: '28 Aug 2023, 09:20 AM',
        status: 'COMPLETED'
      },
      {
        stage: 'DOCUMENT_VERIFICATION',
        label: 'Document Verification',
        description: 'All 4 mandatory documents verified via DigiLocker',
        completedAt: '02 Sep 2023, 02:40 PM',
        status: 'COMPLETED'
      },
      {
        stage: 'DEPARTMENT_VERIFICATION',
        label: 'District Tribal Welfare Sanction',
        description: 'Sanction approved by District Welfare Officer (DWO)',
        completedAt: '15 Sep 2023, 11:00 AM',
        status: 'COMPLETED'
      },
      {
        stage: 'SANCTION',
        label: 'Sanction Order Generated',
        description: 'MoTA Sanction Order #KA/ST/2023/DWO-441 issued',
        completedAt: '20 Sep 2023, 05:30 PM',
        status: 'COMPLETED'
      },
      {
        stage: 'DISBURSEMENT',
        label: 'DBT Payment Credited',
        description: '₹7,000 credited to SBI A/c ••••4589 via PFMS',
        completedAt: '28 Sep 2023, 01:15 PM',
        status: 'COMPLETED'
      }
    ]
  },
  {
    id: 'APP-2025-ST-POST-1024',
    schemeId: 'scheme-2',
    schemeCode: 'POST_MATRIC',
    schemeName: 'Post-Matric Scholarship for ST Students',
    academicSession: '2025-26',
    appliedDate: '10 Aug 2025',
    currentStatus: 'MANUAL_REVIEW',
    currentStage: 'DEPARTMENT_VERIFICATION',
    claimedAmount: 68000,
    usedDigiLockerReuse: true,
    verificationIssues: [
      {
        field: 'Income Certificate',
        issueDescription: 'State e-District record shows certificate validity expired on 31-03-2025. Financial year 2025-26 certificate required.',
        sourceSystem: 'Karnataka Nadakacheri e-District',
        flaggedAt: '18 Aug 2025, 03:45 PM',
        resolved: false,
        officerCorrectionNote: 'Please upload the renewed Tehsildar Income Certificate for FY 2025-26 with income below ₹2.5 Lakhs.'
      }
    ],
    timeline: [
      {
        stage: 'SUBMITTED',
        label: 'Application Submitted',
        description: 'Online application submitted with reused DigiLocker credentials',
        completedAt: '10 Aug 2025, 02:15 PM',
        status: 'COMPLETED'
      },
      {
        stage: 'INSTITUTION_VERIFICATION',
        label: 'Institution Verification',
        description: 'NITK Surathkal Academic Section verified enrollment (AISHE C-1284)',
        completedAt: '14 Aug 2025, 11:20 AM',
        status: 'COMPLETED'
      },
      {
        stage: 'ST_VERIFICATION',
        label: 'ST Category Verification',
        description: 'Auto-verified with DigiLocker Caste Certificate KA/ST/2021/88921',
        completedAt: '15 Aug 2025, 09:45 AM',
        status: 'COMPLETED'
      },
      {
        stage: 'DOCUMENT_VERIFICATION',
        label: 'Document Verification',
        description: 'Academic marksheet and bonafide verified',
        completedAt: '16 Aug 2025, 04:30 PM',
        status: 'COMPLETED'
      },
      {
        stage: 'DEPARTMENT_VERIFICATION',
        label: 'State Department Verification',
        description: 'Manual Review Required: Income certificate expiry flagged by e-District adapter',
        completedAt: undefined,
        status: 'FLAGGED',
        actionRequired: 'Upload renewed FY 2025-26 Income Certificate to resolve discrepancy',
        officerNote: 'Certificate expired on 31 March 2025. Correction requested from student.'
      },
      {
        stage: 'SANCTION',
        label: 'MoTA Sanction Order',
        description: 'Sanction letter generated after department clearance',
        status: 'PENDING'
      },
      {
        stage: 'DISBURSEMENT',
        label: 'DBT Direct Bank Disbursement',
        description: 'Direct electronic credit into Aadhaar-seeded SBI account',
        status: 'PENDING'
      }
    ]
  }
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'PAY-2023-09-8812',
    applicationId: 'APP-2024-ST-PM-091',
    schemeName: 'Pre-Matric Scholarship (Class 10)',
    amount: 7000,
    installmentNo: 'Full Year Grant',
    status: 'CREDITED',
    pfmsReferenceId: 'PFMS/2023/MOTA/771092',
    bankUtrNumber: 'UTR2309280041892',
    sanctionOrderNumber: 'SANCT/KA/ST/2023/044',
    sanctionDate: '20 Sep 2023',
    creditedDate: '28 Sep 2023',
    bankName: 'State Bank of India',
    accountMasked: '•••• •••• 4589'
  },
  {
    id: 'PAY-2024-03-1190',
    applicationId: 'APP-2024-ST-POST-552',
    schemeName: 'Post-Matric Scholarship (B.Tech 1st Year)',
    amount: 24000,
    installmentNo: 'Installment 1 of 2',
    status: 'CREDITED',
    pfmsReferenceId: 'PFMS/2024/MOTA/102941',
    bankUtrNumber: 'UTR2403120098412',
    sanctionOrderNumber: 'SANCT/KA/ST/2024/182',
    sanctionDate: '02 Mar 2024',
    creditedDate: '12 Mar 2024',
    bankName: 'State Bank of India',
    accountMasked: '•••• •••• 4589'
  },
  {
    id: 'PAY-2024-10-4491',
    applicationId: 'APP-2024-ST-POST-552',
    schemeName: 'Post-Matric Scholarship (B.Tech 2nd Year Maintenance)',
    amount: 17000,
    installmentNo: 'Installment 2 of 2',
    status: 'CREDITED',
    pfmsReferenceId: 'PFMS/2024/MOTA/904128',
    bankUtrNumber: 'UTR2410200055102',
    sanctionOrderNumber: 'SANCT/KA/ST/2024/519',
    sanctionDate: '10 Oct 2024',
    creditedDate: '20 Oct 2024',
    bankName: 'State Bank of India',
    accountMasked: '•••• •••• 4589'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'ACTION_REQUIRED',
    title: 'Action Required: Renew Income Certificate',
    message: 'Your Post-Matric application was flagged by the verification orchestrator: your Income Certificate has expired. Please upload your renewed FY 2025-26 certificate.',
    timestamp: '18 Aug 2025, 03:50 PM',
    read: false,
    actionUrl: 'wallet',
    actionText: 'Update Certificate',
    severity: 'warning'
  },
  {
    id: 'notif-2',
    type: 'VERIFICATION',
    title: 'Institution Verification Completed',
    message: 'NITK Surathkal academic registrar has authenticated your enrollment for B.Tech CSE (AISHE Code C-1284).',
    timestamp: '14 Aug 2025, 11:25 AM',
    read: true,
    actionUrl: 'verification',
    actionText: 'View Verification',
    severity: 'success'
  },
  {
    id: 'notif-3',
    type: 'PAYMENT',
    title: 'Scholarship Payment Credited: ₹17,000',
    message: 'DBT maintenance grant of ₹17,000 has been credited to your SBI account ••••4589 via PFMS.',
    timestamp: '20 Oct 2024, 02:30 PM',
    read: true,
    actionUrl: 'payments',
    actionText: 'View Receipt',
    severity: 'info'
  }
];

export const INITIAL_OFFICER_REVIEWS: OfficerReviewItem[] = [
  {
    id: 'REV-1001',
    applicationId: 'APP-2025-ST-POST-1024',
    studentId: 'ST10001',
    studentName: 'Rahul Kumar',
    schemeName: 'Post-Matric Scholarship for ST Students',
    issueType: 'INCOME_MISMATCH',
    sourceSystem: 'Karnataka Nadakacheri e-District',
    submittedValue: 'Income: ₹1,20,000 (Cert #KA/RD/INC/2024/7741)',
    sourceValue: 'Record Expired on 31-03-2025 | Renewal Required',
    status: 'CORRECTION_REQUESTED',
    flaggedDate: '18 Aug 2025, 03:45 PM',
    documentsAttached: ['income_cert_2024_7741.pdf', 'caste_cert_KA_ST_2021_88921.pdf'],
    officerRemarks: 'Requested renewed FY 2025-26 income certificate from student. Pending upload.'
  },
  {
    id: 'REV-1002',
    applicationId: 'APP-2025-ST-TC-0941',
    studentId: 'ST10044',
    studentName: 'Priya Nayak',
    schemeName: 'Top Class Education Scholarship',
    issueType: 'AISHE_CODE_MISMATCH',
    sourceSystem: 'AISHE Institutional Registry',
    submittedValue: 'IIT Dharwad (AISHE: U-0891)',
    sourceValue: 'Branch campus code pending Central list mapping',
    status: 'PENDING_REVIEW',
    flaggedDate: '19 Aug 2025, 10:15 AM',
    documentsAttached: ['iit_admission_letter.pdf', 'st_cert_ka.pdf'],
    officerRemarks: 'Verifying central notified institute registry mapping for newly allotted IIT Dharwad campus.'
  },
  {
    id: 'REV-1003',
    applicationId: 'APP-2025-ST-PM-2201',
    studentId: 'ST10089',
    studentName: 'Birsa Munda',
    schemeName: 'Post-Matric Scholarship for ST Students',
    issueType: 'ST_CERTIFICATE_EXPIRED',
    sourceSystem: 'Jharkhand Jharsewa Portal',
    submittedValue: 'JH/ST/2019/3321',
    sourceValue: 'State digital record migrated to DigiLocker Jharsewa 2.0',
    status: 'PENDING_REVIEW',
    flaggedDate: '20 Aug 2025, 02:30 PM',
    documentsAttached: ['jharkhand_caste_cert.pdf'],
    officerRemarks: 'Awaiting digital synchronization with Jharkhand state portal.'
  }
];

export const MOCK_ADAPTERS: MockAdapterLog[] = [
  {
    id: 'adp-1',
    adapterName: 'Mock UIDAI Aadhaar Vault Adapter',
    endpoint: 'GET /api/mock/uidai/verify-biometric',
    status: 'CONNECTED',
    lastPingMs: 42,
    recordsVerifiedCount: 14890,
    description: 'Cryptographic demographic verification & 12-digit UID masking without storing raw Aadhaar numbers.'
  },
  {
    id: 'adp-2',
    adapterName: 'Mock DigiLocker Document Gateway',
    endpoint: 'GET /api/mock/digilocker/fetch-uri',
    status: 'CONNECTED',
    lastPingMs: 65,
    recordsVerifiedCount: 22100,
    description: 'Pulls digitally signed XML/PDF certificates directly from issuing State Authorities.'
  },
  {
    id: 'adp-3',
    adapterName: 'Mock UDISE+ School Education Registry',
    endpoint: 'GET /api/mock/udise/student-history',
    status: 'CONNECTED',
    lastPingMs: 51,
    recordsVerifiedCount: 8430,
    description: 'School enrollment, attendance track, and Pre-Matric Class 9-10 continuous progression data.'
  },
  {
    id: 'adp-4',
    adapterName: 'Mock APAAR / ABC ID Credit Registry',
    endpoint: 'GET /api/mock/apaar/student-credits',
    status: 'CONNECTED',
    lastPingMs: 78,
    recordsVerifiedCount: 11200,
    description: 'National Academic Depository & Academic Bank of Credits lifetime student education identity.'
  },
  {
    id: 'adp-5',
    adapterName: 'Mock AISHE Institution Registry',
    endpoint: 'GET /api/mock/aishe/institution-check',
    status: 'CONNECTED',
    lastPingMs: 38,
    recordsVerifiedCount: 5690,
    description: 'All India Survey on Higher Education college accreditation, course approval, and fee cap audit.'
  },
  {
    id: 'adp-6',
    adapterName: 'Mock State e-District Services (Karnataka / MP / Odisha)',
    endpoint: 'GET /api/mock/edistrict/income-caste-verify',
    status: 'WARN_MISMATCH',
    lastPingMs: 110,
    recordsVerifiedCount: 19800,
    description: 'Federated API to 28 State Tehsildar databases. Currently flagged 1 mismatch (Rahul Kumar expired income cert).'
  },
  {
    id: 'adp-7',
    adapterName: 'Mock UGC / NTA Eligibility Service',
    endpoint: 'GET /api/mock/ugc/nta-awardee-check',
    status: 'CONNECTED',
    lastPingMs: 82,
    recordsVerifiedCount: 3120,
    description: 'Validation of UGC-NET / CSIR-NET JRF award letters for NFST Fellowship sanctioning.'
  },
  {
    id: 'adp-8',
    adapterName: 'Mock NPCI Aadhaar Payment Bridge (DBT Bharat)',
    endpoint: 'GET /api/mock/npci/dbt-account-status',
    status: 'CONNECTED',
    lastPingMs: 59,
    recordsVerifiedCount: 26400,
    description: 'Real-time check for active bank account Aadhaar seeding and Direct Benefit Transfer readiness.'
  }
];

export const SCHOLARSHIP_GAP_ANALYTICS = {
  nationalOverview: {
    totalEnrolledStStudents: 50000,
    activeBeneficiaries: 38000,
    unreachedPotentialBeneficiaries: 12000,
    saturationPercentage: 76.0,
    totalDisbursedFY: '₹142.8 Crores',
    averageProcessingDays: 14
  },
  unreachedBreakdown: [
    {
      category: 'No Application Filed',
      count: 1450,
      percentage: 52,
      primaryReason: 'Unaware of Top Class / Post-Matric portal deadlines or lack of local common service center (CSC) help.'
    },
    {
      category: 'Incomplete / Stalled Drafts',
      count: 720,
      percentage: 26,
      primaryReason: 'Student started application but was stuck at pending offline document uploads.'
    },
    {
      category: 'Eligibility Unclear to Student',
      count: 310,
      percentage: 11,
      primaryReason: 'Confusion regarding whether family income ceiling includes agricultural income or hostel grants.'
    },
    {
      category: 'Verification Issue / Mismatch Stalemate',
      count: 130,
      percentage: 5,
      primaryReason: 'Name spelling mismatch between Aadhaar card and State caste certificate without manual review intervention.'
    },
    {
      category: 'Bank Account Unseeded / DBT Inactive',
      count: 170,
      percentage: 6,
      primaryReason: 'Student bank account not mapped to NPCI Aadhaar mapper.'
    }
  ],
  stateCoverage: [
    { state: 'Madhya Pradesh', enrolled: 12400, beneficiaries: 9800, gap: 2600, rate: 79 },
    { state: 'Karnataka', enrolled: 6800, beneficiaries: 5400, gap: 1400, rate: 79.4 },
    { state: 'Odisha', enrolled: 10200, beneficiaries: 7400, gap: 2800, rate: 72.5 },
    { state: 'Jharkhand', enrolled: 8900, beneficiaries: 6300, gap: 2600, rate: 70.8 },
    { state: 'Rajasthan', enrolled: 6100, beneficiaries: 4900, gap: 1200, rate: 80.3 },
    { state: 'Gujarat', enrolled: 5600, beneficiaries: 4200, gap: 1400, rate: 75.0 }
  ]
};
