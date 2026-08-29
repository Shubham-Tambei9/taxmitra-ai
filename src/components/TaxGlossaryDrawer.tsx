import React, { useState } from 'react';
import { X, Search, BookOpen, HelpCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface TaxGlossaryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GlossaryItem {
  term: string;
  code: string;
  simpleExplanation: string;
  exampleAnalogy: string;
  appliesTo: 'Old Regime' | 'New Regime' | 'Both Regimes';
}

const GLOSSARY_ITEMS: GlossaryItem[] = [
  {
    term: 'Form 16',
    code: 'Salary & TDS Certificate',
    simpleExplanation: 'An official certificate given by your employer showing how much salary you were paid and how much tax (TDS) was deducted.',
    exampleAnalogy: 'Think of Form 16 as your annual salary report card provided by your company.',
    appliesTo: 'Both Regimes',
  },
  {
    term: 'Section 80C',
    code: 'Investments Exemption (Max ₹1.5 Lakhs)',
    simpleExplanation: 'Allows you to subtract up to ₹1,50,000 from your taxable salary if you invest in PPF, ELSS mutual funds, EPF, or pay LIC premiums.',
    exampleAnalogy: 'Like getting a ₹1.5 Lakh coupon code off your income before calculating tax.',
    appliesTo: 'Old Regime',
  },
  {
    term: 'Section 80D',
    code: 'Health Insurance Exemption',
    simpleExplanation: 'Deduction for paying health insurance premiums for yourself, your spouse, children, or parents.',
    exampleAnalogy: 'Up to ₹25,000 for your family + up to ₹50,000 for senior citizen parents.',
    appliesTo: 'Old Regime',
  },
  {
    term: 'HRA Exemption',
    code: 'Section 10(13A)',
    simpleExplanation: 'Tax rebate on house rent paid if you receive House Rent Allowance in your salary slip.',
    exampleAnalogy: 'Reduces your taxable income based on your actual rent paid minus 10% basic salary.',
    appliesTo: 'Old Regime',
  },
  {
    term: 'Standard Deduction',
    code: 'Flat Salaried Tax Waiver',
    simpleExplanation: 'A flat sum automatically subtracted from your salary income without submitting any investment proof.',
    exampleAnalogy: '₹75,000 standard discount under New Regime (Budget 2024) vs ₹50,000 under Old Regime.',
    appliesTo: 'Both Regimes',
  },
  {
    term: 'Section 87A Rebate',
    code: 'Zero Tax Rebate for Low/Medium Income',
    simpleExplanation: 'A government tax rebate that makes your income tax zero if your taxable income is within limits.',
    exampleAnalogy: 'If taxable income is up to ₹7 Lakhs in New Regime (or ₹5 Lakhs in Old Regime), your final tax is ₹0!',
    appliesTo: 'Both Regimes',
  },
  {
    term: 'ITR-1 (Sahaj)',
    code: 'Simplified Salaried Return Form',
    simpleExplanation: 'The easiest 1-page income tax return form for salaried individuals earning up to ₹50 Lakhs.',
    exampleAnalogy: 'The standard tax return form designed specifically for first-time salaried employees.',
    appliesTo: 'Both Regimes',
  },
];

export const TaxGlossaryDrawer: React.FC<TaxGlossaryDrawerProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredItems = GLOSSARY_ITEMS.filter(
    (item) =>
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.simpleExplanation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-white text-base">Plain English Tax Glossary</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search tax jargon (e.g. 80C, HRA, Form 16)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 text-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 outline-none"
            />
          </div>
        </div>

        {/* List of Glossary terms */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-2 hover:border-emerald-500/40 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-white text-sm">{item.term}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {item.appliesTo}
                </span>
              </div>
              <p className="text-[11px] text-emerald-300 font-mono">{item.code}</p>
              <p className="text-xs text-slate-300 leading-relaxed">{item.simpleExplanation}</p>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80 text-[11px] text-slate-400 flex items-start space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{item.exampleAnalogy}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
