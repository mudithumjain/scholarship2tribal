import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentDocument } from '../../types';
import { OcrModal } from '../common/OcrModal';
import { 
  Wallet, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Upload, 
  Download, 
  ScanLine, 
  Sparkles, 
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export const DocumentWallet: React.FC = () => {
  const { 
    documents, 
    uploadRenewedIncomeCertificate, 
    fetchFromDigiLocker, 
    isIncomeRenewed 
  } = useApp();

  const [ocrModalOpen, setOcrModalOpen] = useState(false);
  const [selectedDocForOcr, setSelectedDocForOcr] = useState<string>('INCOME_CERTIFICATE');
  const [digiLockerLoading, setDigiLockerLoading] = useState(false);
  const [uploadSuccessToast, setUploadSuccessToast] = useState(false);

  const handleDigiLockerFetch = async () => {
    setDigiLockerLoading(true);
    await fetchFromDigiLocker('Latest Certificates');
    setDigiLockerLoading(false);
  };

  const handleQuickRenew = async () => {
    await uploadRenewedIncomeCertificate();
    setUploadSuccessToast(true);
    setTimeout(() => setUploadSuccessToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Wallet Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold mb-1 border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5 text-gov-primary" />
            <span>DigiLocker & State e-District Integrated Vault</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Digital Document Wallet
          </h2>
          <p className="text-xs text-slate-500">
            Secure, verified digital repository. Verified documents are automatically reused across all 5 scholarship schemes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setSelectedDocForOcr('INCOME_CERTIFICATE');
              setOcrModalOpen(true);
            }}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-200"
          >
            <ScanLine className="w-4 h-4 text-gov-primary" />
            <span>OCR Auto-Scan</span>
          </button>

          <button
            onClick={handleDigiLockerFetch}
            disabled={digiLockerLoading}
            className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-gov-primary rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border border-blue-200 disabled:opacity-50"
          >
            <Download className={`w-4 h-4 ${digiLockerLoading ? 'animate-bounce' : ''}`} />
            <span>{digiLockerLoading ? 'Syncing...' : 'Get from DigiLocker'}</span>
          </button>

          <button
            onClick={handleQuickRenew}
            className="px-4 py-2 bg-gov-navy hover:bg-gov-blue text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Upload className="w-4 h-4 text-amber-400" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {uploadSuccessToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">Renewed FY 2025-26 Income Certificate Uploaded!</p>
            <p className="text-[11px] text-emerald-800">
              State e-District adapter cross-verified record #KA/RD/INC/2025/9902. Status moved to VERIFIED.
            </p>
          </div>
        </div>
      )}

      {/* Deficiency Action Notice (The Core Demo Flow trigger) */}
      {!isIncomeRenewed && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-900 block text-sm">
                Action Required: Update Income Certificate
              </span>
              <p className="text-slate-600 mt-0.5">
                Current certificate (#KA/RD/INC/2024/7741) expired on 31-03-2025. Please upload the renewed FY 2025-26 certificate to resolve your Post-Matric manual review flag.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => {
                setSelectedDocForOcr('INCOME_CERTIFICATE');
                setOcrModalOpen(true);
              }}
              className="px-3 py-1.5 bg-white border border-amber-400 text-amber-900 rounded-lg font-bold text-xs hover:bg-amber-100"
            >
              Test with OCR
            </button>
            <button
              onClick={handleQuickRenew}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow-xs"
            >
              Upload Renewed Cert (1-Click)
            </button>
          </div>
        </div>
      )}

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc: StudentDocument) => {
          const isIncomeCert = doc.documentType === 'INCOME_CERTIFICATE';
          const isMismatch = doc.verificationStatus === 'MANUAL_REVIEW' || doc.verificationStatus === 'MISMATCH';

          return (
            <div 
              key={doc.id}
              className={`bg-white rounded-xl border p-4 flex flex-col justify-between transition-all shadow-xs ${
                isMismatch ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${isMismatch ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-gov-primary'}`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 leading-snug">{doc.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{doc.fileSize} • {doc.source}</span>
                    </div>
                  </div>

                  {doc.verificationStatus === 'VERIFIED' ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-300 shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1 border border-amber-300 shrink-0 animate-pulse">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      <span>Needs Update</span>
                    </span>
                  )}
                </div>

                {/* Metadata */}
                <div className="bg-slate-50 rounded-lg p-2.5 space-y-1 text-[11px] text-slate-600 border border-slate-100 mt-2">
                  {doc.certificateNumber && (
                    <p className="truncate">
                      <strong className="text-slate-700">Cert #:</strong> <span className="font-mono text-slate-800">{doc.certificateNumber}</span>
                    </p>
                  )}
                  {doc.expiryDate && (
                    <p>
                      <strong className="text-slate-700">Expiry:</strong>{' '}
                      <span className={isMismatch ? 'text-amber-700 font-bold' : 'text-emerald-700 font-bold'}>
                        {doc.expiryDate} {isMismatch ? '(Lapsed)' : '(Active)'}
                      </span>
                    </p>
                  )}
                  {doc.issuingAuthority && (
                    <p className="text-[10px] text-slate-500 truncate">
                      {doc.issuingAuthority}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400">Uploaded {doc.uploadDate}</span>

                <div className="flex items-center gap-2">
                  {isIncomeCert && !isIncomeRenewed ? (
                    <button
                      onClick={handleQuickRenew}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-[11px] transition-colors"
                    >
                      Update
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Reusable</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* OCR Modal */}
      <OcrModal
        isOpen={ocrModalOpen}
        onClose={() => setOcrModalOpen(false)}
        documentType={selectedDocForOcr}
      />
    </div>
  );
};
