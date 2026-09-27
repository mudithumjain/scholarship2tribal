import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  FileCheck, 
  Upload, 
  Building, 
  User, 
  AlertCircle 
} from 'lucide-react';

interface ApplicationWizardProps {
  initialSchemeCode?: string;
  onCancel: () => void;
}

export const ApplicationWizard: React.FC<ApplicationWizardProps> = ({ 
  initialSchemeCode = 'TOP_CLASS', 
  onCancel 
}) => {
  const { profile, schemes, applyForScholarship } = useApp();
  
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedSchemeCode, setSelectedSchemeCode] = useState<string>(initialSchemeCode);
  const [isReused, setIsReused] = useState<boolean>(true); // Pre-filled by default for smooth UX

  // Step names
  const steps = [
    'Personal Details',
    'Category Check',
    'Academic Details',
    'Institution Details',
    'Documents',
    'Review',
    'Submit'
  ];

  const targetScheme = schemes.find(s => s.code === selectedSchemeCode) || schemes[2];

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final Submit
      applyForScholarship(selectedSchemeCode as any, { profile, targetScheme, isReused });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm max-w-4xl mx-auto overflow-hidden">
      {/* Wizard Header */}
      <div className="bg-gov-navy text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gov-blue">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
            Multi-Step Application Portal
          </span>
          <h2 className="text-base sm:text-lg font-bold">
            Applying for: {targetScheme.name}
          </h2>
        </div>

        <button
          onClick={onCancel}
          className="text-xs text-slate-300 hover:text-white underline self-start sm:self-auto"
        >
          Cancel Application
        </button>
      </div>

      {/* Progress Stepper Bar */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700">
            Step {currentStep} of 7: <span className="text-gov-primary">{steps[currentStep - 1]}</span>
          </span>
          <span className="text-xs font-mono font-bold text-slate-500">
            {Math.round((currentStep / 7) * 100)}% Completed
          </span>
        </div>

        {/* Stepper track */}
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-gov-primary h-full transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 7) * 100}%` }}
          />
        </div>

        {/* Step labels on desktop */}
        <div className="hidden md:flex justify-between text-[10px] text-slate-500 font-semibold mt-2">
          {steps.map((s, idx) => (
            <span key={idx} className={idx + 1 === currentStep ? 'text-gov-primary font-bold' : ''}>
              {idx + 1}. {s}
            </span>
          ))}
        </div>
      </div>

      {/* Reduction of Repetitive Entry Banner (Prompt Item 12) */}
      <div className="mx-6 mt-4 p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold text-emerald-900">
              DigiLocker Reusable Profile Active
            </p>
            <p className="text-[11px] text-emerald-800">
              Your ST caste certificate, domicile, and academic records have already been verified.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsReused(true)}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shrink-0 transition-colors shadow-xs"
        >
          Reuse Verified Information
        </button>
      </div>

      {/* Step Content Area */}
      <div className="p-6 text-xs space-y-4 min-h-[320px]">
        {/* Step 1: Personal Details */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
              Step 1: Student Demographics (UIDAI Auto-Populated)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-500 font-semibold">Student Name</label>
                <input
                  type="text"
                  value={profile.name}
                  disabled
                  className="w-full mt-1 p-2 bg-slate-100 border border-slate-200 rounded font-medium text-slate-800"
                />
              </div>
              <div>
                <label className="text-slate-500 font-semibold">Date of Birth</label>
                <input
                  type="text"
                  value={profile.dob}
                  disabled
                  className="w-full mt-1 p-2 bg-slate-100 border border-slate-200 rounded font-medium text-slate-800"
                />
              </div>
              <div>
                <label className="text-slate-500 font-semibold">Mobile Number</label>
                <input
                  type="text"
                  value={profile.phone}
                  disabled
                  className="w-full mt-1 p-2 bg-slate-100 border border-slate-200 rounded font-medium text-slate-800"
                />
              </div>
              <div>
                <label className="text-slate-500 font-semibold">Email Address</label>
                <input
                  type="text"
                  value={profile.email}
                  disabled
                  className="w-full mt-1 p-2 bg-slate-100 border border-slate-200 rounded font-medium text-slate-800"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Category Verification */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
              Step 2: Scheduled Tribe Category Verification
            </h3>
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-900">ST Certificate: #{profile.stCertificateNo}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  ✓ Verified in State e-Pramana
                </span>
              </div>
              <p className="text-slate-600">
                Community: <strong>{profile.tribeName}</strong> • Issuing Authority: Tahsildar Mangaluru
              </p>
              <p className="text-[11px] text-slate-500">
                No need to physically upload or re-scan this certificate. It is cryptographically validated via DigiLocker.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Academic Details */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
              Step 3: Academic Record
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-500 font-semibold">Enrolled Course</label>
                <input
                  type="text"
                  value={profile.course}
                  disabled
                  className="w-full mt-1 p-2 bg-slate-100 border border-slate-200 rounded font-medium"
                />
              </div>
              <div>
                <label className="text-slate-500 font-semibold">Current Semester / Year</label>
                <input
                  type="text"
                  value={profile.currentYearSemester}
                  disabled
                  className="w-full mt-1 p-2 bg-slate-100 border border-slate-200 rounded font-medium"
                />
              </div>
              <div>
                <label className="text-slate-500 font-semibold">Previous Year CGPA / Percentage</label>
                <input
                  type="text"
                  value={`${profile.previousYearMarksPercentage}%`}
                  disabled
                  className="w-full mt-1 p-2 bg-slate-100 border border-slate-200 rounded font-medium text-emerald-700 font-bold"
                />
              </div>
              <div>
                <label className="text-slate-500 font-semibold">APAAR / ABC Academic ID</label>
                <input
                  type="text"
                  value={profile.apaarId}
                  disabled
                  className="w-full mt-1 p-2 bg-slate-100 border border-slate-200 rounded font-mono font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Institution Details */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
              Step 4: Institution Authentication (AISHE)
            </h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <p className="font-bold text-slate-800 text-sm">{profile.institution}</p>
              <div className="flex flex-wrap gap-4 text-slate-600 text-[11px] pt-1">
                <span>AISHE Code: <strong className="font-mono">{profile.institutionCode}</strong></span>
                <span>Type: <strong>Institute of National Importance (INI)</strong></span>
                <span>Top Class Approved: <strong className="text-emerald-700">Yes</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Documents */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
              Step 5: Document Check & Synchronization
            </h3>
            <div className="space-y-2">
              {[
                { title: 'ST Caste Certificate', status: 'Reused from DigiLocker (Verified ✓)' },
                { title: 'Bonafide College Enrollment', status: 'Synced via AISHE Portal (Verified ✓)' },
                { title: 'Income Certificate', status: 'Linked from State e-District Registry' },
                { title: 'Aadhaar Seeded Bank Account', status: 'NPCI APBS Validated (Verified ✓)' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{item.title}</span>
                  <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{item.status}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Review */}
        {currentStep === 6 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
              Step 6: Review Application & Self-Declaration
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-slate-700">
              <p><strong>Applicant:</strong> {profile.name} (ST ID: {profile.studentId})</p>
              <p><strong>Applying Scheme:</strong> {targetScheme.name}</p>
              <p><strong>Institution:</strong> {profile.institution}</p>
              <p><strong>Claimed Annual Assistance:</strong> Full Tuition Waiver + Living Grants</p>
              <p><strong>Disbursement Mode:</strong> Direct Benefit Transfer (DBT) to SBI ••••4589</p>
            </div>

            <label className="flex items-start gap-2 pt-2 cursor-pointer text-slate-700">
              <input type="checkbox" defaultChecked className="mt-0.5 rounded text-gov-primary" />
              <span>
                I hereby declare that the particulars provided above are authentic and cross-referenced with DigiLocker and Government registers.
              </span>
            </label>
          </div>
        )}

        {/* Step 7: Final Submit Screen */}
        {currentStep === 7 && (
          <div className="space-y-4 text-center py-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Ready to Dispatch Application</h3>
            <p className="text-slate-600 max-w-md mx-auto text-xs leading-relaxed">
              Your application will be submitted directly to the MoTA Unified Verification Orchestrator and queued for Institution & State clearance.
            </p>
          </div>
        )}
      </div>

      {/* Footer Navigation Buttons */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous Step</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-2 bg-gov-navy hover:bg-gov-blue text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
        >
          <span>{currentStep === 7 ? 'Submit Application' : 'Save & Continue'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
