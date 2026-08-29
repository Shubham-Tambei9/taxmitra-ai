'use client';

import React, { useState } from 'react';
import { FilingStep, Form16Data, UserAnswers } from '../types';
import { INITIAL_USER_ANSWERS } from '../lib/chatEngine';
import { Navbar } from '../components/Navbar';
import { Form16Uploader } from '../components/Form16Uploader';
import { ConversationalWizard } from '../components/ConversationalWizard';
import { RegimeComparison } from '../components/RegimeComparison';
import { FilingSimulationModal } from '../components/FilingSimulationModal';
import { TaxGlossaryDrawer } from '../components/TaxGlossaryDrawer';
import { Sparkles, Shield, Cpu, HelpCircle, CheckCircle, ArrowRight, BookOpen } from 'lucide-react';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<FilingStep>('upload');
  const [form16, setForm16] = useState<Form16Data | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>(INITIAL_USER_ANSWERS);
  const [selectedRegime, setSelectedRegime] = useState<'Old Regime' | 'New Regime'>('New Regime');
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);

  const handleForm16Loaded = (data: Form16Data) => {
    setForm16(data);
    setCurrentStep('chat');
  };

  const handleChatComplete = (answers: UserAnswers) => {
    setUserAnswers(answers);
    setCurrentStep('compare');
  };

  const handleProceedToFiling = (regime: 'Old Regime' | 'New Regime') => {
    setSelectedRegime(regime);
    setCurrentStep('filing');
  };

  const handleResetAll = () => {
    setForm16(null);
    setUserAnswers(INITIAL_USER_ANSWERS);
    setCurrentStep('upload');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Header */}
      <Navbar
        currentStep={currentStep}
        setStep={(step) => {
          if (form16) setCurrentStep(step);
        }}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onReset={handleResetAll}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {currentStep === 'upload' && (
          <Form16Uploader onForm16Loaded={handleForm16Loaded} />
        )}

        {currentStep === 'chat' && form16 && (
          <ConversationalWizard
            form16={form16}
            onComplete={handleChatComplete}
          />
        )}

        {currentStep === 'compare' && form16 && (
          <RegimeComparison
            form16={form16}
            userAnswers={userAnswers}
            onProceedToFiling={handleProceedToFiling}
          />
        )}

        {(currentStep === 'filing' || currentStep === 'complete') && form16 && (
          <FilingSimulationModal
            form16={form16}
            userAnswers={userAnswers}
            selectedRegime={selectedRegime}
            onResetAll={handleResetAll}
          />
        )}

        {/* Feature Highlights Grid */}
        <section className="pt-12 border-t border-slate-900 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-white text-base">Multimodal LLM Extraction</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Auto-extracts Gross Salary, Employer TAN, exemptions, and TDS directly from Form 16 PDF Part B with 100% precision.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl space-y-2">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-white text-base">Plain English AI Q&A</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              No deduction codes like 80C or 80D. Mitra AI asks simple everyday questions ("Did you pay rent?") and handles the tax math.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-white text-base">Old vs New Regime Comparator</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates tax under both regimes under FY 2024-25 Budget provisions and shows exact ₹ saved to ensure minimum tax liability.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-400">
            TaxMitra.ai — Conversational AI Tax Filing for First-Timers & Young Professionals
          </p>
          <p>
            Compliant with Income Tax Department FY 2024-25 (AY 2025-26) ITR-1 Sahaj provisions & revised New Tax Regime slabs.
          </p>
        </div>
      </footer>

      {/* Tax Glossary Slide-Over Drawer */}
      <TaxGlossaryDrawer
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />
    </div>
  );
}
