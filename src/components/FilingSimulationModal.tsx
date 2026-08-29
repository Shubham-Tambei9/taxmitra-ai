import React, { useState } from 'react';
import { Form16Data, UserAnswers, ITRFilingReceipt } from '../types';
import { computeTaxForRegimes, formatINR } from '../lib/taxEngine';
import { CheckCircle2, ShieldCheck, Download, FileText, Sparkles, Lock, ArrowRight, RotateCcw, Copy, Check } from 'lucide-react';

interface FilingSimulationModalProps {
  form16: Form16Data;
  userAnswers: UserAnswers;
  selectedRegime: 'Old Regime' | 'New Regime';
  onResetAll: () => void;
}

export const FilingSimulationModal: React.FC<FilingSimulationModalProps> = ({
  form16,
  userAnswers,
  selectedRegime,
  onResetAll,
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOtp] = useState('849201');
  const [receipt, setReceipt] = useState<ITRFilingReceipt | null>(null);
  const [copied, setCopied] = useState(false);

  const { oldRegime, newRegime } = computeTaxForRegimes(form16, userAnswers);
  const activeRegimeData = selectedRegime === 'Old Regime' ? oldRegime : newRegime;

  const handleSimulateFiling = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const ackNum = `ITR1-${Math.floor(100000000000 + Math.random() * 900000000000)}`;
      const tokenHash = `eVERIFY_${Math.random().toString(36).substring(2, 12).toUpperCase()}`;

      setReceipt({
        ackNumber: ackNum,
        filingDate: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        assessmentYear: form16.assessmentYear,
        pan: form16.employeePan,
        name: form16.employeeName,
        selectedRegime,
        grossTotalIncome: activeRegimeData.grossTotalIncome,
        totalDeductions: activeRegimeData.totalChapter6ADeductions + activeRegimeData.totalExemptions,
        netTaxableIncome: activeRegimeData.netTaxableIncome,
        totalTaxLiability: activeRegimeData.totalTaxLiability,
        tdsPaid: activeRegimeData.tdsPaid,
        refundOrPayableAmount: activeRegimeData.refundOrPayable,
        eVerifyStatus: 'e-Verified via Aadhaar OTP',
        tokenHash,
      });

      setIsVerifying(false);
    }, 1500);
  };

  const handleDownloadJSON = () => {
    if (!receipt) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ ...receipt, form16, userAnswers }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ITR1_Filing_${receipt.pan}_${receipt.assessmentYear}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyAck = () => {
    if (receipt) {
      navigator.clipboard.writeText(receipt.ackNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {!receipt ? (
        /* Step 4A: Pre-Filing Review & Aadhaar OTP Verification */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2 border-b border-slate-800 pb-5">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">1-Click Income Tax e-Filing</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Ready to submit ITR-1 (Sahaj) return to Income Tax Department simulation engine under{' '}
              <span className="text-emerald-400 font-bold">{selectedRegime}</span>.
            </p>
          </div>

          {/* Tax Filing Summary Card */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Taxpayer Name & PAN:</span>
              <span className="font-semibold text-white">{form16.employeeName} ({form16.employeePan})</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Assessment Year:</span>
              <span className="font-semibold text-white">{form16.assessmentYear}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Selected Tax Regime:</span>
              <span className="font-bold text-emerald-400">{selectedRegime}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Net Taxable Income:</span>
              <span className="font-mono text-white">{formatINR(activeRegimeData.netTaxableIncome)}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold border-t border-slate-800 pt-3">
              <span className="text-slate-300">Net Refund / Payable Status:</span>
              <span className={`font-mono text-base ${activeRegimeData.refundOrPayable <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {activeRegimeData.refundOrPayable < 0
                  ? `Refund Due: ${formatINR(Math.abs(activeRegimeData.refundOrPayable))}`
                  : activeRegimeData.refundOrPayable === 0
                  ? 'Zero Tax Payable (₹0)'
                  : `Payable: ${formatINR(activeRegimeData.refundOrPayable)}`}
              </span>
            </div>
          </div>

          {/* Aadhaar e-Verify OTP Box */}
          <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700/80 space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Simulated Instant Aadhaar e-Verification</span>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400">Enter 6-digit Aadhaar OTP (Simulated pre-filled):</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-slate-900 text-white font-mono text-center tracking-widest text-lg p-2.5 rounded-xl border border-slate-700 font-bold"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSimulateFiling}
            disabled={isVerifying}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-base rounded-xl shadow-xl hover:from-emerald-400 hover:to-teal-300 transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isVerifying ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin text-slate-950" />
                <span>e-Filing Return & Generating Receipt...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-slate-950" />
                <span>Confirm & Submit ITR-1 Return Now</span>
              </>
            )}
          </button>
        </div>
      ) : (
        /* Step 4B: Official e-Filing Acknowledgement Receipt (ITR-V) */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl animate-scaleUp">
          {/* Header Banner */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-8 h-8 font-black" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Income Tax Return Submitted!</h2>
              <p className="text-xs sm:text-sm text-emerald-400 font-semibold mt-1">
                Successfully Filed & e-Verified under {receipt.selectedRegime}
              </p>
            </div>
          </div>

          {/* Acknowledgement Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4 font-sans text-xs sm:text-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-slate-400">Acknowledgement No.</span>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-white text-base">{receipt.ackNumber}</span>
                <button
                  onClick={handleCopyAck}
                  className="p-1 text-slate-400 hover:text-white bg-slate-800 rounded"
                  title="Copy Ack Number"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 text-xs block">Taxpayer Name</span>
                <span className="font-bold text-white text-sm">{receipt.name}</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs block">PAN</span>
                <span className="font-mono font-semibold text-slate-300">{receipt.pan}</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs block">Assessment Year</span>
                <span className="font-semibold text-slate-300">{receipt.assessmentYear}</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs block">Filing Date</span>
                <span className="font-semibold text-slate-300">{receipt.filingDate}</span>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Gross Total Income</span>
                <span className="font-mono text-white">{formatINR(receipt.grossTotalIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Exemptions & Deductions</span>
                <span className="font-mono text-white">-{formatINR(receipt.totalDeductions)}</span>
              </div>
              <div className="flex justify-between font-bold text-white pt-1">
                <span>Net Taxable Income</span>
                <span className="font-mono text-emerald-400">{formatINR(receipt.netTaxableIncome)}</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-1">
                <span>Total Tax Liability</span>
                <span className="font-mono text-white">{formatINR(receipt.totalTaxLiability)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>TDS Paid</span>
                <span className="font-mono text-white">{formatINR(receipt.tdsPaid)}</span>
              </div>
              <div className="flex justify-between font-black text-sm pt-2 border-t border-slate-800">
                <span className="text-slate-200">
                  {receipt.refundOrPayableAmount <= 0 ? 'Refund Payable to Bank Account' : 'Net Tax Payable'}
                </span>
                <span className={`font-mono text-base ${receipt.refundOrPayableAmount <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {formatINR(Math.abs(receipt.refundOrPayableAmount))}
                </span>
              </div>
            </div>

            <div className="bg-slate-900 p-3 rounded-lg flex items-center justify-between text-[11px] text-slate-400 border border-slate-800">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verification Status: <strong className="text-emerald-400">{receipt.eVerifyStatus}</strong></span>
              </span>
              <span className="font-mono text-[10px] text-slate-500">{receipt.tokenHash}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownloadJSON}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition flex items-center justify-center space-x-2 text-xs sm:text-sm"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download Official ITR JSON</span>
            </button>

            <button
              onClick={onResetAll}
              className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition flex items-center justify-center space-x-2 text-xs sm:text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>File Another Tax Return</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
