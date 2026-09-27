import { StudentProfile, StudentDocument, VerificationStatus } from '../types';

export interface AdapterVerificationResult {
  adapterId: string;
  adapterName: string;
  sourceAuthority: string;
  status: VerificationStatus;
  latencyMs: number;
  matchScore: number;
  verifiedFields: Record<string, { submitted: string; authoritative: string; match: boolean }>;
  discrepancyNote?: string;
  timestamp: string;
  requiresManualReview: boolean;
}

export interface UnifiedVerificationResponse {
  applicationId: string;
  overallStatus: VerificationStatus;
  processedAt: string;
  adapterResults: AdapterVerificationResult[];
  recommendedAction: 'PROCEED_TO_SANCTION' | 'ROUTE_TO_MANUAL_REVIEW' | 'AUTO_REJECT';
  summaryRemarks: string;
}

// 1. UIDAI Mock Adapter
export async function mockUidaiVerify(profile: StudentProfile): Promise<AdapterVerificationResult> {
  const start = Date.now();
  await new Promise(r => setTimeout(r, 250));
  return {
    adapterId: 'UIDAI_DEMOGRAPHIC',
    adapterName: 'UIDAI Aadhaar Demographic & Auth Gateway',
    sourceAuthority: 'Unique Identification Authority of India',
    status: 'VERIFIED',
    latencyMs: Date.now() - start,
    matchScore: 99.8,
    verifiedFields: {
      Name: { submitted: profile.name, authoritative: 'RAHUL KUMAR', match: true },
      DOB: { submitted: profile.dob, authoritative: '2004-05-14', match: true },
      Gender: { submitted: profile.gender, authoritative: 'MALE', match: true },
      Pincode: { submitted: profile.pincode, authoritative: '575025', match: true }
    },
    timestamp: new Date().toISOString(),
    requiresManualReview: false
  };
}

// 2. DigiLocker Caste Certificate Adapter
export async function mockDigiLockerCasteVerify(profile: StudentProfile): Promise<AdapterVerificationResult> {
  const start = Date.now();
  await new Promise(r => setTimeout(r, 320));
  return {
    adapterId: 'DIGILOCKER_CASTE',
    adapterName: 'DigiLocker National Document Exchange (State Revenue)',
    sourceAuthority: 'Revenue Department, Government of Karnataka',
    status: 'VERIFIED',
    latencyMs: Date.now() - start,
    matchScore: 100,
    verifiedFields: {
      CertificateNumber: { submitted: profile.stCertificateNo, authoritative: 'KA/ST/2021/88921', match: true },
      Category: { submitted: 'Scheduled Tribe', authoritative: 'Scheduled Tribe (Naikda)', match: true },
      IssuingTahsildar: { submitted: 'Mangaluru Taluk', authoritative: 'Tahsildar Mangaluru (Digitally Signed)', match: true }
    },
    timestamp: new Date().toISOString(),
    requiresManualReview: false
  };
}

// 3. AISHE Higher Education Institution Adapter
export async function mockAisheVerify(profile: StudentProfile): Promise<AdapterVerificationResult> {
  const start = Date.now();
  await new Promise(r => setTimeout(r, 200));
  return {
    adapterId: 'AISHE_REGISTRY',
    adapterName: 'AISHE Institution & Accreditation Registry',
    sourceAuthority: 'Ministry of Education, GoI',
    status: 'VERIFIED',
    latencyMs: Date.now() - start,
    matchScore: 100,
    verifiedFields: {
      AISHECode: { submitted: profile.institutionCode, authoritative: 'C-1284 (NITK Surathkal)', match: true },
      InstituteType: { submitted: 'Premier Institute', authoritative: 'Institute of National Importance (INI)', match: true },
      CourseStatus: { submitted: profile.course, authoritative: 'B.Tech CSE - Approved by AICTE/MoE', match: true }
    },
    timestamp: new Date().toISOString(),
    requiresManualReview: false
  };
}

// 4. State e-District Income Adapter (Core Mismatch Trigger for Demo)
export async function mockStateEDistrictIncomeVerify(
  incomeCertNo: string, 
  validityDate: string,
  familyIncome: number,
  isRenewed: boolean = false
): Promise<AdapterVerificationResult> {
  const start = Date.now();
  await new Promise(r => setTimeout(r, 400));

  if (isRenewed) {
    return {
      adapterId: 'STATE_EDISTRICT_INCOME',
      adapterName: 'State e-District Revenue Database (Nadakacheri 2.0)',
      sourceAuthority: 'Tahsildar Office, Govt of Karnataka',
      status: 'VERIFIED',
      latencyMs: Date.now() - start,
      matchScore: 100,
      verifiedFields: {
        CertificateNumber: { submitted: 'KA/RD/INC/2025/9902', authoritative: 'KA/RD/INC/2025/9902', match: true },
        AnnualFamilyIncome: { submitted: `₹${familyIncome.toLocaleString('en-IN')}`, authoritative: `₹${familyIncome.toLocaleString('en-IN')}`, match: true },
        ValidityPeriod: { submitted: 'FY 2025-26 (Valid till 31-03-2026)', authoritative: 'Active / Valid', match: true }
      },
      timestamp: new Date().toISOString(),
      requiresManualReview: false
    };
  }

  // Before renewal: Mismatch / Expiry condition!
  return {
    adapterId: 'STATE_EDISTRICT_INCOME',
    adapterName: 'State e-District Revenue Database (Nadakacheri 2.0)',
    sourceAuthority: 'Tahsildar Office, Govt of Karnataka',
    status: 'MANUAL_REVIEW',
    latencyMs: Date.now() - start,
    matchScore: 68,
    verifiedFields: {
      CertificateNumber: { submitted: incomeCertNo, authoritative: incomeCertNo, match: true },
      AnnualFamilyIncome: { submitted: `₹${familyIncome.toLocaleString('en-IN')}`, authoritative: '₹1,20,000 (FY 2024-25 Record)', match: true },
      ValidityPeriod: { submitted: validityDate, authoritative: 'EXPIRED on 31-03-2025', match: false }
    },
    discrepancyNote: 'Certificate expired on 31-03-2025. Financial year 2025-26 renewal certificate required before automated sanction.',
    timestamp: new Date().toISOString(),
    requiresManualReview: true
  };
}

// 5. NPCI DBT Bharat Adapter
export async function mockNpciDbtVerify(profile: StudentProfile): Promise<AdapterVerificationResult> {
  const start = Date.now();
  await new Promise(r => setTimeout(r, 220));
  return {
    adapterId: 'NPCI_DBT_BRIDGE',
    adapterName: 'NPCI Aadhaar Payment Bridge System (APBS)',
    sourceAuthority: 'National Payments Corporation of India',
    status: 'VERIFIED',
    latencyMs: Date.now() - start,
    matchScore: 100,
    verifiedFields: {
      AadhaarSeeding: { submitted: 'Seeded', authoritative: 'Active on SBI ••••4589', match: true },
      DBTMandate: { submitted: 'Enabled', authoritative: 'Direct Benefit Transfer Ready', match: true },
      PFMSAccountValidation: { submitted: 'Verified', authoritative: 'PFMS/CR/VALIDATED', match: true }
    },
    timestamp: new Date().toISOString(),
    requiresManualReview: false
  };
}

// Orchestrator: Combines all adapters into a unified response
export async function runUnifiedVerificationOrchestrator(
  profile: StudentProfile,
  isIncomeRenewed: boolean
): Promise<UnifiedVerificationResponse> {
  const [uidai, caste, aishe, income, npci] = await Promise.all([
    mockUidaiVerify(profile),
    mockDigiLockerCasteVerify(profile),
    mockAisheVerify(profile),
    mockStateEDistrictIncomeVerify(profile.incomeCertificateNo, profile.incomeValidityDate, profile.familyIncome, isIncomeRenewed),
    mockNpciDbtVerify(profile)
  ]);

  const results = [uidai, caste, aishe, income, npci];
  const hasManualReview = results.some(r => r.requiresManualReview || r.status === 'MANUAL_REVIEW');

  return {
    applicationId: 'APP-2025-ST-POST-1024',
    overallStatus: hasManualReview ? 'MANUAL_REVIEW' : 'VERIFIED',
    processedAt: new Date().toISOString(),
    adapterResults: results,
    recommendedAction: hasManualReview ? 'ROUTE_TO_MANUAL_REVIEW' : 'PROCEED_TO_SANCTION',
    summaryRemarks: hasManualReview
      ? 'One discrepancy detected: Income certificate expired. Non-punitive exception routed to District Officer Manual Review queue.'
      : 'All 5 national and state registers successfully cross-verified. Ready for automated MoTA sanction order generation.'
  };
}

// Mock OCR Extraction Service
export interface OcrResult {
  fileName: string;
  documentType: string;
  extractedFields: {
    beneficiaryName: string;
    certificateNumber: string;
    issuingAuthority: string;
    issueDate: string;
    validTill?: string;
    annualIncome?: number;
    category?: string;
  };
  consistencyScore: number;
  matchedWithProfile: boolean;
  notes: string;
}

export async function simulateOcrProcessing(
  fileName: string, 
  documentType: string, 
  profile: StudentProfile,
  isNewIncomeCert: boolean = false
): Promise<OcrResult> {
  await new Promise(r => setTimeout(r, 800)); // Simulate OCR processing time

  if (documentType === 'INCOME_CERTIFICATE') {
    if (isNewIncomeCert) {
      return {
        fileName,
        documentType: 'INCOME_CERTIFICATE',
        extractedFields: {
          beneficiaryName: profile.name,
          certificateNumber: 'KA/RD/INC/2025/9902',
          issuingAuthority: 'Tahsildar, Mangaluru Taluk, Govt of Karnataka',
          issueDate: '15-08-2025',
          validTill: '31-03-2026',
          annualIncome: 120000
        },
        consistencyScore: 99,
        matchedWithProfile: true,
        notes: '✓ Renewed FY 2025-26 certificate. Annual income of ₹1,20,000 matches student profile within ₹2.5 Lakh limit.'
      };
    } else {
      return {
        fileName,
        documentType: 'INCOME_CERTIFICATE',
        extractedFields: {
          beneficiaryName: profile.name,
          certificateNumber: profile.incomeCertificateNo,
          issuingAuthority: 'Revenue Department, Karnataka',
          issueDate: '12-04-2024',
          validTill: '31-03-2025',
          annualIncome: profile.familyIncome
        },
        consistencyScore: 68,
        matchedWithProfile: false,
        notes: '⚠ Validity date (31-03-2025) has lapsed. Renewal required for financial year 2025-26.'
      };
    }
  }

  // Default mock OCR for Caste/Domicile
  return {
    fileName,
    documentType,
    extractedFields: {
      beneficiaryName: profile.name,
      certificateNumber: profile.stCertificateNo,
      issuingAuthority: 'Government of Karnataka Revenue Dept',
      issueDate: '14-10-2021',
      category: 'Scheduled Tribe (Naikda)'
    },
    consistencyScore: 100,
    matchedWithProfile: true,
    notes: '✓ Digital signature valid. Permanent Scheduled Tribe certificate verified against State e-Pramana repository.'
  };
}
