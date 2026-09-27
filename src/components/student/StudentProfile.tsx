import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Building, 
  CreditCard, 
  Save, 
  Edit3, 
  ShieldCheck,
  FileCheck
} from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const { profile, updateProfile, isIncomeRenewed } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...profile });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gov-navy text-amber-400 font-black text-2xl flex items-center justify-center border-2 border-amber-400/30 shadow-xs">
            RK
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
                {profile.studentId}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Scheduled Tribe (ST) Student • National Institute of Technology Karnataka (NITK)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
              ✓ Profile Updated
            </span>
          )}
          <button
            onClick={() => {
              if (isEditing) setFormData({ ...profile });
              setIsEditing(!isEditing);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              isEditing 
                ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' 
                : 'bg-gov-navy text-white hover:bg-gov-blue'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Identity & Demographic Verification */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gov-primary" />
              <span>Identity & ST Category Verification</span>
            </h3>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>DigiLocker Authenticated</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-slate-500 font-medium">Full Legal Name</label>
              <p className="font-bold text-slate-900 mt-0.5">{profile.name}</p>
            </div>

            <div>
              <label className="text-slate-500 font-medium">Date of Birth</label>
              <p className="font-bold text-slate-900 mt-0.5">{profile.dob} (Age 22)</p>
            </div>

            <div>
              <label className="text-slate-500 font-medium">Gender</label>
              <p className="font-bold text-slate-900 mt-0.5">{profile.gender}</p>
            </div>

            <div>
              <label className="text-slate-500 font-medium">ST Category Status</label>
              <div className="flex items-center gap-1.5 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-bold text-slate-900">Verified ({profile.tribeName})</span>
              </div>
            </div>

            <div>
              <label className="text-slate-500 font-medium">ST Certificate No.</label>
              <p className="font-mono font-bold text-slate-800 mt-0.5">{profile.stCertificateNo}</p>
            </div>

            <div>
              <label className="text-slate-500 font-medium">PVTG Status (Particularly Vulnerable)</label>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-bold text-slate-700">No</span>
                <span className="text-[10px] text-slate-400">(General ST Category)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Economic & Income Status (The Mismatch Flag Section) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gov-primary" />
              <span>Economic Profile & Income Verification</span>
            </h3>

            {isIncomeRenewed ? (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified (FY 2025-26)</span>
              </span>
            ) : (
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded flex items-center gap-1 border border-amber-300">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                <span>Needs Review / Expiry Flagged</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-slate-500 font-medium">Annual Family Income</label>
              {isEditing ? (
                <input
                  type="number"
                  value={formData.familyIncome}
                  onChange={(e) => setFormData({ ...formData, familyIncome: Number(e.target.value) })}
                  className="w-full mt-1 p-1.5 border rounded border-slate-300 font-bold"
                />
              ) : (
                <p className="font-bold text-slate-900 mt-0.5 text-sm">
                  ₹{profile.familyIncome.toLocaleString('en-IN')} / year
                </p>
              )}
              <span className="text-[10px] text-emerald-600 font-semibold">
                ✓ Below ₹2.5 LPA Ceiling (Post-Matric) &lt; ₹6 LPA (Top Class)
              </span>
            </div>

            <div>
              <label className="text-slate-500 font-medium">Income Certificate Number</label>
              <p className="font-mono font-bold text-slate-800 mt-0.5">
                {profile.incomeCertificateNo}
              </p>
            </div>

            <div>
              <label className="text-slate-500 font-medium">Certificate Validity Date</label>
              <div className="flex items-center gap-1.5 mt-0.5">
                {isIncomeRenewed ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-bold text-emerald-700">31-03-2026 (Active)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span className="font-bold text-amber-700">{profile.incomeValidityDate} (Expired)</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Academic & Institutional Details */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Building className="w-4 h-4 text-gov-primary" />
              <span>Academic & Institution Enrollment</span>
            </h3>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>AISHE Verified</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="text-slate-500 font-medium">Enrolled Institution</label>
              <p className="font-bold text-slate-900 mt-0.5">{profile.institution}</p>
            </div>

            <div>
              <label className="text-slate-500 font-medium">AISHE Code</label>
              <p className="font-mono font-bold text-slate-800 mt-0.5">{profile.institutionCode}</p>
            </div>

            <div>
              <label className="text-slate-500 font-medium">Course & Branch</label>
              <p className="font-bold text-slate-900 mt-0.5">{profile.course}</p>
            </div>

            <div>
              <label className="text-slate-500 font-medium">Academic Year & Level</label>
              <p className="font-bold text-slate-900 mt-0.5">{profile.degreeLevel} • {profile.academicYear}</p>
            </div>

            <div>
              <label className="text-slate-500 font-medium">Current Semester</label>
              <p className="font-bold text-slate-900 mt-0.5">{profile.currentYearSemester}</p>
            </div>

            <div>
              <label className="text-slate-500 font-medium">Previous Year Marks</label>
              <p className="font-bold text-emerald-700 mt-0.5">{profile.previousYearMarksPercentage}% (First Class with Distinction)</p>
            </div>

            <div>
              <label className="text-slate-500 font-medium">APAAR / ABC ID</label>
              <p className="font-mono font-bold text-slate-800 mt-0.5">{profile.apaarId}</p>
            </div>

            <div>
              <label className="text-slate-500 font-medium">Disability Status</label>
              <p className="font-bold text-slate-700 mt-0.5">None (Not Applicable)</p>
            </div>
          </div>
        </div>

        {/* 4. Bank Account & DBT Direct Mandate */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gov-primary" />
              <span>Direct Benefit Transfer (DBT) Bank Account</span>
            </h3>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>NPCI Aadhaar Seeded</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="text-slate-500 font-medium">Bank Name</label>
              <p className="font-bold text-slate-900 mt-0.5">{profile.bankAccount.bankName}</p>
            </div>

            <div>
              <label className="text-slate-500 font-medium">Account Number</label>
              <p className="font-mono font-bold text-slate-900 mt-0.5">{profile.bankAccount.accountNumberMasked}</p>
            </div>

            <div>
              <label className="text-slate-500 font-medium">IFSC Code</label>
              <p className="font-mono font-bold text-slate-800 mt-0.5">{profile.bankAccount.ifscCode}</p>
            </div>

            <div>
              <label className="text-slate-500 font-medium">DBT APBS Status</label>
              <p className="font-bold text-emerald-600 mt-0.5">Active & Ready</p>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gov-navy text-white rounded-lg text-xs font-bold hover:bg-gov-blue transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile Updates</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
