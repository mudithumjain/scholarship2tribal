import React, { useState } from 'react';
import { SCHOLARSHIP_GAP_ANALYTICS } from '../../data/mockData';
import { 
  BarChart3, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Filter, 
  TrendingUp, 
  MapPin, 
  Download,
  Building,
  Sparkles
} from 'lucide-react';

export const ScholarshipGapAnalytics: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');

  const { nationalOverview, unreachedBreakdown, stateCoverage } = SCHOLARSHIP_GAP_ANALYTICS;

  const filteredStates = selectedState === 'ALL' 
    ? stateCoverage 
    : stateCoverage.filter(s => s.state === selectedState);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-1 border border-emerald-200">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>National Tribal Inclusion & Saturation Analytics</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Scholarship Coverage & Gap Analysis
          </h2>
          <p className="text-xs text-slate-500">
            Identifying enrolled Scheduled Tribe (ST) students in higher education who are not yet receiving scholarship entitlements.
          </p>
        </div>

        {/* State Filter */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700"
          >
            <option value="ALL">All States (National Aggregate)</option>
            {stateCoverage.map(s => (
              <option key={s.state} value={s.state}>{s.state}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI 4 Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Enrolled ST Students</span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {nationalOverview.totalEnrolledStStudents.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-500">AISHE & UDISE+ Synchronized</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Beneficiaries</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">
            {nationalOverview.activeBeneficiaries.toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-600 font-bold">{nationalOverview.saturationPercentage}% Saturation</span>
        </div>

        <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-300 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">Potentially Unreached Gap</span>
          <p className="text-2xl font-black text-amber-900 mt-1">
            {nationalOverview.unreachedPotentialBeneficiaries.toLocaleString()}
          </p>
          <span className="text-[10px] text-amber-800 font-semibold">24% Targeted for Outreach</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Disbursed (FY)</span>
          <p className="text-2xl font-black text-gov-primary mt-1">
            {nationalOverview.totalDisbursedFY}
          </p>
          <span className="text-[10px] text-slate-500">Avg {nationalOverview.averageProcessingDays} Days Turnaround</span>
        </div>
      </div>

      {/* Root Causes of the Unreached Gap (Prompt Section 25) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Breakdown of Unreached Beneficiaries (Root Causes)
            </h3>
            <p className="text-xs text-slate-500">
              Why 12,000 eligible tribal students have not completed their scholarship journey.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">N = 2,780 Sample Cohort</span>
        </div>

        <div className="space-y-3">
          {unreachedBreakdown.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">{item.category}</span>
                <span className="font-mono font-bold text-slate-900">
                  {item.count} students ({item.percentage}%)
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-blue-500' : idx === 2 ? 'bg-purple-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-500">{item.primaryReason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* State-Wise Coverage & Saturation Rates */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">
            State-Wise Tribal Coverage Saturation
          </h3>
          <span className="text-xs text-slate-400">Top Priority Tribal States</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {filteredStates.map((st) => (
            <div key={st.state} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-gov-primary" />
                  <span className="font-bold text-sm text-slate-900">{st.state}</span>
                </div>
                <div className="flex gap-4 text-[11px] text-slate-500">
                  <span>Enrolled ST: <strong>{st.enrolled.toLocaleString()}</strong></span>
                  <span>Receiving Aid: <strong className="text-emerald-700">{st.beneficiaries.toLocaleString()}</strong></span>
                  <span>Unreached Gap: <strong className="text-amber-700">{st.gap.toLocaleString()}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-auto shrink-0">
                <div className="w-24 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${st.rate}%` }}
                  />
                </div>
                <span className="font-black text-sm text-slate-800 w-12 text-right">
                  {st.rate}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
