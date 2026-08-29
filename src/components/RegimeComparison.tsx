import React, { useState } from 'react';
import { Form16Data, UserAnswers, RegimeTaxBreakdown } from '../types';
import { computeTaxForRegimes, formatINR } from '../lib/taxEngine';
import { CheckCircle2, Trophy, HelpCircle, ArrowRight, ShieldCheck, Sparkles, AlertCircle, FileText } from 'lucide-react';

interface RegimeComparisonProps {
  form16: Form16Data;
  userAnswers: UserAnswers;
  onProceedToFiling: (selectedRegime: 'Old Regime' | 'New Regime') => void;
}

export const RegimeComparison: React.FC<RegimeComparisonProps> = ({ form16, userAnswers, onProceedToFiling }) => {
  const { oldRegime, newRegime, recommendedRegime, taxSavings } = computeTaxForRegimes(form16, userAnswers);
  const [selectedRegime, setSelectedRegime] = useState<'Old Regime' | 'New Regime'>(recommendedRegime);

  const rows = [
    {
      label: 'Gross Salary (Form 16 Sec 17(1))',
      oldVal: oldRegime.grossSalary,
      newVal: newRegime.grossSalary,
      isDeduction: false,
    },
    {
      label: 'Less: HRA & Sec 10 Exemptions',
      oldVal: oldRegime.totalExemptions,
      newVal: 0,
      isDeduction: true,
      tooltip: 'HRA & LTA exemptions are only available in Old Tax Regime',
    },
    {
      label: 'Less: Standard Deduction',
      oldVal: oldRegime.standardDeduction,
      newVal: newRegime.standardDeduction,
      isDeduction: true,
      tooltip: '₹75,000 for New Regime (Budget 2024) vs ₹50,000 for Old Regime',
    },
    {
      label: 'Less: Professional Tax',
      oldVal: oldRegime.professionalTax,
      newVal: 0,
      isDeduction: true,
    },
    {
      label: 'Net Taxable Salary',
      oldVal: oldRegime.taxableSalary,
      newVal: newRegime.taxableSalary,
      isHeader: true,
    },
    {
      label: 'Add: Other Income (Savings Interest)',
      oldVal: oldRegime.otherIncome,
      newVal: newRegime.otherIncome,
      isDeduction: false,
    },
    {
      label: 'Gross Total Income',
      oldVal: oldRegime.grossTotalIncome,
      newVal: newRegime.grossTotalIncome,
      isHeader: true,
    },
    {
      label: 'Less: Total Chapter VI-A Deductions (80C, 80D, 80TTA, Sec 24)',
      oldVal: oldRegime.totalChapter6ADeductions,
      newVal: 0,
      isDeduction: true,
      highlight: true,
      tooltip: '80C (₹1.5L max), 80D Health, 80TTA Savings Interest & Sec 24 Home Loan Interest',
    },
    {
      label: 'Net Taxable Income',
      oldVal: oldRegime.netTaxableIncome,
      newVal: newRegime.netTaxableIncome,
      isHeader: true,
    },
    {
      label: 'Basic Income Tax (Slab Rate)',
      oldVal: oldRegime.basicTax,
      newVal: newRegime.basicTax,
      isDeduction: false,
    },
    {
      label: 'Less: Section 87A Tax Rebate',
      oldVal: oldRegime.rebate87A,
      newVal: newRegime.rebate87A,
      isDeduction: true,
      tooltip: 'Tax-free income rebate for taxable income <= 5L (Old) or <= 7L (New)',
    },
    {
      label: 'Add: Health & Education Cess (4%)',
      oldVal: oldRegime.cess,
      newVal: newRegime.cess,
      isDeduction: false,
    },
    {
      label: 'Total Tax Liability',
      oldVal: oldRegime.totalTaxLiability,
      newVal: newRegime.totalTaxLiability,
      isFinalTotal: true,
    },
    {
      label: 'Less: Tax Deducted at Source (TDS Paid)',
      oldVal: oldRegime.tdsPaid,
      newVal: newRegime.tdsPaid,
      isDeduction: true,
    },
    {
      label: 'Final Tax Refund (-) / Net Payable (+)',
      oldVal: oldRegime.refundOrPayable,
      newVal: newRegime.refundOrPayable,
      isRefundRow: true,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Banner / Recommendation */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black text-white">AI Tax Regime Recommendation</h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                Recommended
              </span>
            </div>
            <p className="text-sm text-slate-300 mt-1">
              Selecting <strong className="text-emerald-400 font-bold">{recommendedRegime}</strong> will save you{' '}
              <strong className="text-emerald-400 font-extrabold">{formatINR(taxSavings)}</strong> in total tax liability compared to the alternative!
            </p>
          </div>
        </div>

        <button
          onClick={() => onProceedToFiling(selectedRegime)}
          className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold rounded-xl shadow-lg hover:from-emerald-400 hover:to-teal-300 transition flex items-center justify-center space-x-2 shrink-0 text-sm"
        >
          <span>File Tax under {selectedRegime}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Comparison Table Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
          <h3 className="font-bold text-white text-base flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Side-by-Side Tax Computation (FY 2024-25 / AY 2025-26)</span>
          </h3>
          <span className="text-xs text-slate-400">Click column radio to switch selection</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400">
                <th className="p-4 font-semibold w-1/2">Particulars / Tax Breakdown</th>
                <th
                  onClick={() => setSelectedRegime('Old Regime')}
                  className={`p-4 text-right cursor-pointer transition w-1/4 ${
                    selectedRegime === 'Old Regime' ? 'bg-slate-800/80 text-white' : 'hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-end space-x-2">
                    <input
                      type="radio"
                      checked={selectedRegime === 'Old Regime'}
                      onChange={() => setSelectedRegime('Old Regime')}
                      className="accent-emerald-400"
                    />
                    <span className="font-extrabold text-sm">Old Regime</span>
                  </div>
                  {oldRegime.isRecommended && (
                    <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
                      ★ Lowest Tax
                    </span>
                  )}
                </th>

                <th
                  onClick={() => setSelectedRegime('New Regime')}
                  className={`p-4 text-right cursor-pointer transition w-1/4 ${
                    selectedRegime === 'New Regime' ? 'bg-slate-800/80 text-white' : 'hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-end space-x-2">
                    <input
                      type="radio"
                      checked={selectedRegime === 'New Regime'}
                      onChange={() => setSelectedRegime('New Regime')}
                      className="accent-emerald-400"
                    />
                    <span className="font-extrabold text-sm">New Regime</span>
                  </div>
                  {newRegime.isRecommended && (
                    <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
                      ★ Lowest Tax
                    </span>
                  )}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {rows.map((row, idx) => (
                <tr
                  key={idx}
                  className={`transition ${
                    row.isHeader
                      ? 'bg-slate-800/40 font-bold text-slate-200'
                      : row.isFinalTotal
                      ? 'bg-slate-950 font-black text-white text-base'
                      : row.isRefundRow
                      ? 'bg-emerald-950/20 font-bold'
                      : 'hover:bg-slate-800/20 text-slate-300'
                  }`}
                >
                  <td className="p-3.5 pl-4 flex items-center space-x-2">
                    <span>{row.label}</span>
                    {row.tooltip && (
                      <span className="text-slate-500 hover:text-slate-300 cursor-help" title={row.tooltip}>
                        <HelpCircle className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                  <td className={`p-3.5 text-right font-mono ${selectedRegime === 'Old Regime' ? 'bg-slate-800/30' : ''}`}>
                    {row.isDeduction && row.oldVal > 0 ? `-${formatINR(row.oldVal)}` : formatINR(row.oldVal)}
                  </td>
                  <td className={`p-3.5 text-right font-mono ${selectedRegime === 'New Regime' ? 'bg-slate-800/30' : ''}`}>
                    {row.isDeduction && row.newVal > 0 ? `-${formatINR(row.newVal)}` : formatINR(row.newVal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer CTA & Regime Summary */}
        <div className="p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 space-y-1">
            <p className="flex items-center space-x-1.5 font-medium text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Selected for Filing: <strong className="text-emerald-400 font-bold">{selectedRegime}</strong></span>
            </p>
            <p>Net Refund / Payable: <strong className="font-mono text-white">{formatINR(selectedRegime === 'Old Regime' ? oldRegime.refundOrPayable : newRegime.refundOrPayable)}</strong></p>
          </div>

          <button
            onClick={() => onProceedToFiling(selectedRegime)}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold rounded-xl shadow-xl hover:from-emerald-400 hover:to-teal-300 transition flex items-center justify-center space-x-2 text-base"
          >
            <span>Proceed to 1-Click File Tax</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
