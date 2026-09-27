import React, { useState } from 'react';
import { MOCK_ADAPTERS } from '../../data/mockData';
import { 
  X, 
  Server, 
  Cpu, 
  ArrowRight, 
  ArrowDown, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Layers, 
  Database,
  ExternalLink
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [selectedAdapterId, setSelectedAdapterId] = useState<string>('adp-6'); // Default to state e-district (shows mismatch)
  const [pinging, setPinging] = useState<boolean>(false);
  const [pingLatency, setPingLatency] = useState<number | null>(null);

  if (!isOpen) return null;

  const selectedAdapter = MOCK_ADAPTERS.find(a => a.id === selectedAdapterId) || MOCK_ADAPTERS[0];

  const handleTestPing = () => {
    setPinging(true);
    setTimeout(() => {
      setPinging(false);
      setPingLatency(Math.floor(25 + Math.random() * 80));
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gov-navy text-white flex items-center justify-between border-b border-gov-blue">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-400/20 text-amber-300 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Unified Verification & Integration Architecture</h2>
              <p className="text-xs text-slate-300">
                MoTA Problem Statement 26238 • Standardized Verification Layer over 7+ Government Systems
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Architecture Diagram */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-gov-primary" />
              <span>End-to-End System Pipeline</span>
            </h3>

            {/* Pipeline Flow Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-center">
              {/* Layer 1 */}
              <div className="p-3 bg-white rounded-lg border border-blue-200 shadow-xs">
                <span className="text-[10px] font-bold text-blue-600 uppercase">Layer 1</span>
                <p className="font-bold text-xs text-slate-800 mt-1">Student App & Portal</p>
                <p className="text-[10px] text-slate-500">PWA • JAGO AI • Offline Wallet</p>
              </div>

              <div className="hidden md:flex justify-center text-slate-400">
                <ArrowRight className="w-5 h-5" />
              </div>

              {/* Layer 2 */}
              <div className="p-3 bg-white rounded-lg border border-indigo-200 shadow-xs">
                <span className="text-[10px] font-bold text-indigo-600 uppercase">Layer 2</span>
                <p className="font-bold text-xs text-slate-800 mt-1">Unified API Gateway</p>
                <p className="text-[10px] text-slate-500">Eligibility Engine • Token Vault</p>
              </div>

              <div className="hidden md:flex justify-center text-slate-400">
                <ArrowRight className="w-5 h-5" />
              </div>

              {/* Layer 3 */}
              <div className="p-3 bg-amber-50 rounded-lg border-2 border-amber-300 shadow-xs">
                <span className="text-[10px] font-bold text-amber-700 uppercase">Layer 3 (Core)</span>
                <p className="font-bold text-xs text-slate-900 mt-1">Verification Orchestrator</p>
                <p className="text-[10px] text-amber-800">Exception Logic • Manual Review Routing</p>
              </div>
            </div>

            {/* Connecting arrows down to adapters */}
            <div className="flex justify-center my-3 text-slate-400">
              <ArrowDown className="w-5 h-5 text-amber-500 animate-bounce" />
            </div>

            {/* Layer 4: National & State Adapters */}
            <div className="bg-white rounded-xl border border-slate-300 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800">
                  Layer 4: Government & Institutional Adapter Pool (Mocked for Hackathon)
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                  7 Active Adapters
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {MOCK_ADAPTERS.slice(0, 8).map(adapter => (
                  <button
                    key={adapter.id}
                    onClick={() => {
                      setSelectedAdapterId(adapter.id);
                      setPingLatency(null);
                    }}
                    className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                      selectedAdapterId === adapter.id
                        ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-1 ring-amber-400'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[11px] text-slate-800 truncate block max-w-[130px]">
                        {adapter.adapterName.split(' ')[1]}
                      </span>
                      {adapter.status === 'WARN_MISMATCH' ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{adapter.endpoint.split(' ')[1]}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Adapter Deep-Dive Inspector */}
          <div className="border border-slate-200 rounded-xl p-5 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900">{selectedAdapter.adapterName}</h4>
                  {selectedAdapter.status === 'WARN_MISMATCH' ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      Exception Flagged (Manual Review)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Standard Verified
                    </span>
                  )}
                </div>
                <code className="text-xs text-gov-primary font-mono mt-0.5 block">{selectedAdapter.endpoint}</code>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestPing}
                  disabled={pinging}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${pinging ? 'animate-spin' : ''}`} />
                  <span>{pinging ? 'Pinging Mock API...' : 'Test Adapter Ping'}</span>
                </button>
                {pingLatency && (
                  <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                    {pingLatency}ms
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-3">{selectedAdapter.description}</p>

            {/* Standardized Response Contract */}
            <div className="mt-4 bg-slate-900 text-slate-200 rounded-lg p-3 font-mono text-[11px] overflow-x-auto">
              <span className="text-slate-400 block mb-1 font-sans font-bold text-[10px] uppercase">
                Standardized Verification Contract Payload:
              </span>
              <pre>
{`{
  "adapter": "${selectedAdapter.adapterName}",
  "status": "${selectedAdapter.status === 'WARN_MISMATCH' ? 'MANUAL_REVIEW_REQUIRED' : 'VERIFIED'}",
  "latencyMs": ${pingLatency || selectedAdapter.lastPingMs},
  "verifiedRecordsTotal": ${selectedAdapter.recordsVerifiedCount.toLocaleString()},
  "nonPunitiveException": true,
  "routeToManualReview": ${selectedAdapter.status === 'WARN_MISMATCH'},
  "timestamp": "${new Date().toISOString()}"
}`}
              </pre>
            </div>
          </div>

          {/* Hackathon Disclaimer Banner */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2.5 text-xs text-blue-900">
            <CheckCircle2 className="w-4 h-4 text-gov-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Production-Ready Architecture Note:</span>
              <p className="text-[11px] text-blue-800 mt-0.5">
                In this hackathon demonstration, all external government endpoints (UIDAI, DigiLocker, UDISE+, APAAR, AISHE, e-District) are implemented through decoupled mock adapters. In production, these adapters are swapped with authorized REST/GraphQL integrations without altering the frontend or business orchestration layers.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gov-navy hover:bg-gov-blue text-white rounded-lg text-xs font-bold transition-colors"
          >
            Close Architecture View
          </button>
        </div>
      </div>
    </div>
  );
};
