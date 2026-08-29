import React from 'react';
import { FilingStep } from '../types';
import { ShieldCheck, HelpCircle, Sparkles, FileCheck, ArrowRight, RotateCcw } from 'lucide-react';

interface NavbarProps {
  currentStep: FilingStep;
  setStep: (step: FilingStep) => void;
  onOpenGlossary: () => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentStep, setStep, onOpenGlossary, onReset }) => {
  const steps: { id: FilingStep; label: string; num: number }[] = [
    { id: 'upload', label: '1. Form 16 Upload', num: 1 },
    { id: 'chat', label: '2. AI Q&A', num: 2 },
    { id: 'compare', label: '3. Regime Comparison', num: 3 },
    { id: 'filing', label: '4. File Tax', num: 4 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  TaxMitra<span className="text-emerald-400">.ai</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  AY 2025-26
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Filing ITR-1 in plain English</p>
            </div>
          </div>

          {/* Stepper Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60">
            {steps.map((step) => {
              const isActive = currentStep === step.id;
              const isPassed =
                (currentStep === 'chat' && step.id === 'upload') ||
                (currentStep === 'compare' && (step.id === 'upload' || step.id === 'chat')) ||
                (currentStep === 'filing' && step.id !== 'filing') ||
                currentStep === 'complete';

              return (
                <button
                  key={step.id}
                  onClick={() => setStep(step.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                      : isPassed
                      ? 'text-emerald-400 hover:bg-slate-700/50'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      isActive
                        ? 'bg-slate-950 text-emerald-400'
                        : isPassed
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {step.num}
                  </span>
                  <span>{step.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onOpenGlossary}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition"
              title="Plain English Tax Jargon Dictionary"
            >
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Tax Glossary</span>
            </button>

            <button
              onClick={onReset}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Start Over"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Stepper Bar */}
      <div className="md:hidden bg-slate-800/60 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-xs">
        <div className="text-emerald-400 font-semibold flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            {currentStep === 'upload' && 'Step 1: Upload Form 16'}
            {currentStep === 'chat' && 'Step 2: Plain AI Q&A'}
            {currentStep === 'compare' && 'Step 3: Old vs New Regime'}
            {currentStep === 'filing' && 'Step 4: File ITR Return'}
            {currentStep === 'complete' && 'ITR Submitted Successfully!'}
          </span>
        </div>
        <div className="text-slate-400 font-mono">Step {currentStep === 'upload' ? 1 : currentStep === 'chat' ? 2 : currentStep === 'compare' ? 3 : 4}/4</div>
      </div>
    </header>
  );
};
