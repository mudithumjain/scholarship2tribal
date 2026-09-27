import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { simulateOcrProcessing, OcrResult } from '../../services/mockGovernmentApis';
import { 
  X, 
  ScanLine, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface OcrModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: string;
}

export const OcrModal: React.FC<OcrModalProps> = ({ isOpen, onClose, documentType }) => {
  const { profile, uploadRenewedIncomeCertificate } = useApp();
  const [scanning, setScanning] = useState<boolean>(false);
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [isRenewedFile, setIsRenewedFile] = useState<boolean>(true); // Default to renewed FY 2025-26 certificate

  if (!isOpen) return null;

  const handleStartOcr = async () => {
    setScanning(true);
    const fileName = isRenewedFile 
      ? 'income_cert_2025_9902_renewed.pdf' 
      : 'income_cert_2024_7741.pdf';

    const result = await simulateOcrProcessing(fileName, documentType, profile, isRenewedFile);
    setOcrResult(result);
    setScanning(false);
  };

  const handleApplyRenewedDoc = async () => {
    await uploadRenewedIncomeCertificate();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gov-navy text-white px-6 py-4 flex items-center justify-between border-b border-gov-blue">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-400 text-slate-950 rounded-lg">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                AI / OCR Document Extraction Demo
              </span>
              <h3 className="text-base font-bold">Document Scanner & Consistency Engine</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Extracts beneficiary metadata, certificate serial numbers, and financial year validity from uploaded certificates, comparing against the student profile.
          </p>

          {/* Sample Certificate Selector */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <label className="font-bold text-slate-800 block text-xs">
              Select Certificate File for OCR Simulation:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setIsRenewedFile(true); setOcrResult(null); }}
                className={`p-3 rounded-lg border text-left transition-all ${
                  isRenewedFile 
                    ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-400' 
                    : 'border-slate-200 bg-white hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>Renewed FY 2025-26 Cert</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Valid</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">income_cert_2025_9902.pdf (Valid till 31-03-2026)</p>
              </button>

              <button
                type="button"
                onClick={() => { setIsRenewedFile(false); setOcrResult(null); }}
                className={`p-3 rounded-lg border text-left transition-all ${
                  !isRenewedFile 
                    ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-400' 
                    : 'border-slate-200 bg-white hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>Expired FY 2024-25 Cert</span>
                  <span className="text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">Expired</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">income_cert_2024_7741.pdf (Expired on 31-03-2025)</p>
              </button>
            </div>

            <button
              onClick={handleStartOcr}
              disabled={scanning}
              className="w-full py-2.5 bg-gov-navy hover:bg-gov-blue text-white rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              <ScanLine className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
              <span>{scanning ? 'Running OCR Extraction Engine...' : 'Run OCR Document Extraction'}</span>
            </button>
          </div>

          {/* OCR Results Display */}
          {ocrResult && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between p-3 rounded-xl border bg-slate-50">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Profile Match Score</span>
                  <div className="text-xl font-black text-slate-900 mt-0.5">
                    {ocrResult.consistencyScore}% Match
                  </div>
                </div>
                {ocrResult.matchedWithProfile ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs border border-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Consistent with Profile</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-xs border border-amber-300">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Discrepancy / Expired</span>
                  </span>
                )}
              </div>

              {/* Extracted JSON Card */}
              <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-[11px] space-y-1">
                <span className="text-slate-400 font-sans font-bold text-[10px] uppercase block mb-1">
                  Extracted Digital Fields (OCR):
                </span>
                <p>Beneficiary: <span className="text-amber-300 font-bold">{ocrResult.extractedFields.beneficiaryName}</span></p>
                <p>Certificate No: <span className="text-blue-300 font-bold">{ocrResult.extractedFields.certificateNumber}</span></p>
                <p>Annual Income: <span className="text-emerald-300 font-bold">₹{ocrResult.extractedFields.annualIncome?.toLocaleString('en-IN')}</span></p>
                <p>Valid Till: <span className="text-purple-300 font-bold">{ocrResult.extractedFields.validTill || 'N/A'}</span></p>
                <p>Authority: <span className="text-slate-300">{ocrResult.extractedFields.issuingAuthority}</span></p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
                <p className="font-semibold text-xs">{ocrResult.notes}</p>
                <p className="text-[10px] text-blue-700 mt-1">
                  * Note: OCR extraction aids data entry and exception resolution; authoritative verification is executed via the State e-District adapter.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Close
          </button>

          {ocrResult && isRenewedFile && (
            <button
              onClick={handleApplyRenewedDoc}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <span>Apply Renewed Certificate to Wallet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
