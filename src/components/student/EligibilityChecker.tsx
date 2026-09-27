import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckSquare, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  Sparkles, 
  Filter, 
  RefreshCw,
  Info
} from 'lucide-react';

interface EligibilityCheckerProps {
  onApplyScheme: (schemeCode: string) => void;
}

export const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({ onApplyScheme }) => {
  const { profile } = useApp();

  // Form State initialized with Rahul's real profile
  const [stStatus, setStStatus] = useState<boolean>(true);
  const [pvtgStatus, setPvtgStatus] = useState<boolean>(false);
  const [educationLevel, setEducationLevel] = useState<string>('Undergraduate');
  const [institutionType, setInstitutionType] = useState<string>('Premier (IIT/NIT/IIM/AIIMS)');
  const [familyIncome, setFamilyIncome] = useState<number>(profile.familyIncome);
  const [marksPercentage, setMarksPercentage] = useState<number>(81.5);
  const [netJrfQualified, setNetJrfQualified] = useState<boolean>(false);
  const [hasOverseasAdmission, setHasOverseasAdmission] = useState<boolean>(false);
  const [disabilityStatus, setDisabilityStatus] = useState<boolean>(false);

  // Evaluate eligibility for all 5 schemes with explicit reasoning
  const evaluateSchemes = () => {
    // 1. Pre-Matric
    const preMatricEligible = stStatus && (educationLevel === 'Class 9-10') && familyIncome <= 250000;
    const preMatricReasons: string[] = [];
    if (!stStatus) preMatricReasons.push('Must belong to Scheduled Tribe (ST) category.');
    if (educationLevel !== 'Class 9-10') preMatricReasons.push(`Currently in ${educationLevel}; Pre-Matric is strictly for Class 9 and 10.`);
    if (familyIncome > 250000) preMatricReasons.push(`Income ₹${familyIncome.toLocaleString('en-IN')} exceeds ₹2.5 Lakh limit.`);

    // 2. Post-Matric
    const postMatricEligible = stStatus && (educationLevel === 'Class 11-12' || educationLevel === 'Undergraduate' || educationLevel === 'Postgraduate') && familyIncome <= 250000;
    const postMatricReasons: string[] = [];
    if (!stStatus) postMatricReasons.push('Must belong to Scheduled Tribe (ST) category.');
    if (educationLevel === 'Class 9-10') postMatricReasons.push('Requires post-secondary or post-matric enrollment (Class 11 through PG).');
    if (familyIncome > 250000) postMatricReasons.push(`Income ₹${familyIncome.toLocaleString('en-IN')} exceeds ceiling of ₹2,50,000 / year.`);

    // 3. Top Class Education
    const isPremierInstitute = institutionType === 'Premier (IIT/NIT/IIM/AIIMS)';
    const topClassEligible = stStatus && isPremierInstitute && (educationLevel === 'Undergraduate' || educationLevel === 'Postgraduate') && familyIncome <= 600000;
    const topClassReasons: string[] = [];
    if (!stStatus) topClassReasons.push('Must belong to Scheduled Tribe (ST).');
    if (!isPremierInstitute) topClassReasons.push('Enrolled institute must be notified on Central Top Class Premier Institutes list (e.g. NITK, IITs, IIMs).');
    if (familyIncome > 600000) topClassReasons.push(`Family income exceeds ₹6.0 Lakhs per annum limit.`);

    // 4. NFST Fellowship
    const nfstEligible = stStatus && (educationLevel === 'M.Phil / Ph.D.') && netJrfQualified;
    const nfstReasons: string[] = [];
    if (!stStatus) nfstReasons.push('Must belong to Scheduled Tribe (ST).');
    if (educationLevel !== 'M.Phil / Ph.D.') nfstReasons.push(`Enrolled in ${educationLevel}. NFST requires full-time M.Phil or Ph.D. research enrollment.`);
    if (!netJrfQualified) nfstReasons.push('Must qualify UGC-NET / CSIR-NET or GATE examination.');

    // 5. National Overseas Scholarship (NOS)
    const nosEligible = stStatus && hasOverseasAdmission && familyIncome <= 800000 && marksPercentage >= 55;
    const nosReasons: string[] = [];
    if (!stStatus) nosReasons.push('Must belong to Scheduled Tribe (ST).');
    if (!hasOverseasAdmission) nosReasons.push('Requires unconditional admission offer letter from a Top 500 QS ranked foreign university.');
    if (familyIncome > 800000) nosReasons.push(`Income exceeds ₹8.0 Lakh limit.`);
    if (marksPercentage < 55) nosReasons.push('Requires minimum 55% marks in qualifying degree.');

    return [
      {
        code: 'POST_MATRIC',
        name: 'Post-Matric Scholarship for ST Students',
        eligible: postMatricEligible,
        reasons: postMatricReasons,
        eligibleRationale: '✓ ST Category verified • Enrolled in B.Tech Undergraduate program • Annual income ₹1,20,000 is well within ₹2.5 Lakh limit.',
        benefits: '100% Tuition Fees + Maintenance Allowance (₹13,500/year)'
      },
      {
        code: 'TOP_CLASS',
        name: 'Top Class Education Scholarship for ST',
        eligible: topClassEligible,
        reasons: topClassReasons,
        eligibleRationale: '✓ ST Category verified • Enrolled at NITK Surathkal (Notified Premier Institute AISHE C-1284) • Income ₹1,20,000 < ₹6.0 LPA limit.',
        benefits: 'Full Tuition Fee Waiver + Living ₹3,000/mo + Computer Grant ₹45,000'
      },
      {
        code: 'PRE_MATRIC',
        name: 'Pre-Matric Scholarship for ST Students',
        eligible: preMatricEligible,
        reasons: preMatricReasons,
        eligibleRationale: 'Applicable for Class 9 and 10 students.',
        benefits: 'Maintenance allowance up to ₹7,000 / year'
      },
      {
        code: 'NFST',
        name: 'National Fellowship for ST Students (NFST)',
        eligible: nfstEligible,
        reasons: nfstReasons,
        eligibleRationale: 'Qualified research scholars pursuing Ph.D.',
        benefits: '₹37,000 - ₹42,000 / month Fellowship + Contingency'
      },
      {
        code: 'NOS',
        name: 'National Overseas Scholarship (NOS)',
        eligible: nosEligible,
        reasons: nosReasons,
        eligibleRationale: 'Approved overseas Master\'s / Ph.D. scholars.',
        benefits: 'Full Foreign Tuition + ~$15,400 / yr Living Allowance'
      }
    ];
  };

  const results = evaluateSchemes();
  const eligibleSchemes = results.filter(r => r.eligible);
  const ineligibleSchemes = results.filter(r => !r.eligible);

  const resetToRahulProfile = () => {
    setStStatus(true);
    setPvtgStatus(false);
    setEducationLevel('Undergraduate');
    setInstitutionType('Premier (IIT/NIT/IIM/AIIMS)');
    setFamilyIncome(120000);
    setMarksPercentage(81.5);
    setNetJrfQualified(false);
    setHasOverseasAdmission(false);
    setDisabilityStatus(false);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Smart Rule Engine • No Black-Box Rejections</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Find Scholarships You May Be Eligible For
          </h2>
          <p className="text-xs text-slate-500">
            Simulate or tweak your parameters to see transparent explanations of which MoTA schemes you qualify for.
          </p>
        </div>

        <button
          onClick={resetToRahulProfile}
          className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset to Rahul&apos;s Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Filters Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Filter className="w-4 h-4 text-gov-primary" />
            <span>Eligibility Parameters</span>
          </h3>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Scheduled Tribe (ST) Category?</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStStatus(true)}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${stStatus ? 'bg-gov-navy text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                Yes (ST)
              </button>
              <button
                type="button"
                onClick={() => setStStatus(false)}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${!stStatus ? 'bg-gov-navy text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                Non-ST
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Current Education Level</label>
            <select
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-gov-primary font-medium"
            >
              <option value="Class 9-10">Class 9 - 10 (Secondary)</option>
              <option value="Class 11-12">Class 11 - 12 (Higher Secondary / PUC)</option>
              <option value="Undergraduate">Undergraduate (B.Tech / MBBS / B.Sc / BA)</option>
              <option value="Postgraduate">Postgraduate (M.Tech / MBA / MA / M.Sc)</option>
              <option value="M.Phil / Ph.D.">M.Phil / Ph.D. Research Scholar</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Institution Type</label>
            <select
              value={institutionType}
              onChange={(e) => setInstitutionType(e.target.value)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-gov-primary font-medium"
            >
              <option value="Premier (IIT/NIT/IIM/AIIMS)">Premier Notified (NITK, IIT, IIM, AIIMS, NLU)</option>
              <option value="State University / Govt College">State University / Govt Aided College</option>
              <option value="Private Recognized College">Private UGC/AICTE Recognized College</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Annual Family Income</label>
              <span className="text-xs font-mono font-bold text-gov-primary">
                ₹{familyIncome.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="50000"
              max="1000000"
              step="25000"
              value={familyIncome}
              onChange={(e) => setFamilyIncome(Number(e.target.value))}
              className="w-full accent-gov-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>₹50K</span>
              <span>₹2.5L (Post-Matric)</span>
              <span>₹6L (Top Class)</span>
              <span>₹10L</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Previous Year Score: {marksPercentage}%</label>
            <input
              type="range"
              min="40"
              max="100"
              value={marksPercentage}
              onChange={(e) => setMarksPercentage(Number(e.target.value))}
              className="w-full accent-gov-primary cursor-pointer"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={netJrfQualified}
                onChange={(e) => setNetJrfQualified(e.target.checked)}
                className="rounded border-slate-300 text-gov-primary focus:ring-gov-primary"
              />
              <span className="text-slate-700">Qualified UGC-NET / CSIR-NET / GATE</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasOverseasAdmission}
                onChange={(e) => setHasOverseasAdmission(e.target.checked)}
                className="rounded border-slate-300 text-gov-primary focus:ring-gov-primary"
              />
              <span className="text-slate-700">Hold Unconditional Offer from Top 500 QS World University</span>
            </label>
          </div>
        </div>

        {/* Right Column: Transparent Results with Explanations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Potentially Eligible Schemes */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-base text-slate-900">
                Potentially Eligible ({eligibleSchemes.length})
              </h3>
            </div>

            {eligibleSchemes.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                No schemes qualify with current parameter configuration. Adjust family income or education level.
              </div>
            ) : (
              <div className="space-y-3">
                {eligibleSchemes.map(s => (
                  <div key={s.code} className="bg-emerald-50/40 border border-emerald-300 rounded-xl p-4 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <h4 className="font-bold text-sm text-slate-900">{s.name}</h4>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        ✓ Criteria Satisfied
                      </span>
                    </div>

                    <div className="p-2.5 bg-white/80 rounded-lg border border-emerald-200 text-xs text-slate-700 mt-2">
                      <p className="font-semibold text-emerald-900">{s.eligibleRationale}</p>
                      <p className="text-[11px] text-slate-500 mt-1"><strong>Benefits:</strong> {s.benefits}</p>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => onApplyScheme(s.code)}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                      >
                        <span>Apply for This Scheme</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Not Currently Eligible (With Detailed WHY) */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="w-5 h-5 text-slate-400" />
              <h3 className="font-bold text-base text-slate-700">
                Not Currently Eligible ({ineligibleSchemes.length})
              </h3>
            </div>

            <div className="space-y-3">
              {ineligibleSchemes.map(s => (
                <div key={s.code} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-xs text-slate-700">{s.name}</h4>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                      ✕ Not Eligible
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs mt-2">
                    <p className="font-bold text-slate-600 text-[11px] uppercase tracking-wider mb-1">
                      Reason for ineligibility:
                    </p>
                    <ul className="space-y-1 text-[11px] text-slate-600">
                      {s.reasons.map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
