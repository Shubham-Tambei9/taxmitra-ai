import React, { useState, useEffect } from 'react';
import { Form16Data, UserAnswers, ChatMessage } from '../types';
import { CHAT_QUESTIONS, getAiGreetingMessage, generateDynamicTaxTip, INITIAL_USER_ANSWERS } from '../lib/chatEngine';
import { computeTaxForRegimes, formatINR } from '../lib/taxEngine';
import { Sparkles, Send, CheckCircle, ArrowRight, HelpCircle, ShieldCheck, Zap, RefreshCw } from 'lucide-react';

interface ConversationalWizardProps {
  form16: Form16Data;
  onComplete: (userAnswers: UserAnswers) => void;
}

export const ConversationalWizard: React.FC<ConversationalWizardProps> = ({ form16, onComplete }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>(INITIAL_USER_ANSWERS);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // Specific input state for multi-part questions
  const [healthInsuranceSelf, setHealthInsuranceSelf] = useState(15000);
  const [healthInsuranceParents, setHealthInsuranceParents] = useState(20000);
  const [parentsSenior, setParentsSenior] = useState(false);
  const [rentAmount, setRentAmount] = useState(18000);
  const [isMetro, setIsMetro] = useState(true);
  const [elssAmount, setElssAmount] = useState(150000);
  const [savingsInterestAmount, setSavingsInterestAmount] = useState(8000);
  const [homeLoanInterestAmount, setHomeLoanInterestAmount] = useState(150000);

  // Initialize Chat Messages
  useEffect(() => {
    const greetingText = getAiGreetingMessage(form16.employeeName, formatINR(form16.grossSalary));
    const firstQ = CHAT_QUESTIONS[0];
    
    setMessages([
      {
        id: 'msg-greeting',
        sender: 'ai',
        text: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      {
        id: `msg-q-${firstQ.id}`,
        sender: 'ai',
        text: `**Question 1/5**: ${firstQ.question}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        questionId: firstQ.id,
        taxImpactBadge: firstQ.taxSectionHelp,
      },
    ]);
  }, [form16]);

  const activeQuestion = CHAT_QUESTIONS[currentQuestionIdx];

  // Calculate live tax savings
  const currentCalculations = computeTaxForRegimes(form16, userAnswers);

  const handleAnswerSubmit = (updatedAnswers: Partial<UserAnswers>, userResponseText: string) => {
    const nextAnswers = { ...userAnswers, ...updatedAnswers };
    setUserAnswers(nextAnswers);

    // Append User Response Message
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: userResponseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];

    // Check if there are more questions
    if (currentQuestionIdx < CHAT_QUESTIONS.length - 1) {
      const nextIdx = currentQuestionIdx + 1;
      const nextQ = CHAT_QUESTIONS[nextIdx];
      setCurrentQuestionIdx(nextIdx);

      const aiNextMsg: ChatMessage = {
        id: `msg-q-${nextQ.id}`,
        sender: 'ai',
        text: `**Question ${nextIdx + 1}/5**: ${nextQ.question}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        questionId: nextQ.id,
        taxImpactBadge: nextQ.taxSectionHelp,
      };

      setMessages([...updatedMessages, aiNextMsg]);
    } else {
      // All questions completed!
      const finalTip = generateDynamicTaxTip(
        nextAnswers,
        currentCalculations.recommendedRegime,
        currentCalculations.taxSavings
      );

      const finalAiMsg: ChatMessage = {
        id: 'msg-final',
        sender: 'ai',
        text: `🎉 **Awesome job!** We've analyzed your tax profile.\n\n${finalTip}\n\nClick below to see your full **Side-by-Side Old vs. New Regime Comparison**!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages([...updatedMessages, finalAiMsg]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
      {/* Left 2 Cols: Main Chat Conversation */}
      <div className="lg:col-span-2 flex flex-col h-[650px] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Chat Header */}
        <div className="bg-slate-800/90 border-b border-slate-700/80 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-base">Mitra AI Assistant</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="text-xs text-slate-400">Step 2: Interactive Tax Questionnaire</p>
            </div>
          </div>
          <div className="text-xs text-slate-400 font-mono bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            Question {Math.min(currentQuestionIdx + 1, CHAT_QUESTIONS.length)} / {CHAT_QUESTIONS.length}
          </div>
        </div>

        {/* Chat Timeline Scroll */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none shadow-md font-medium'
                    : 'bg-slate-800/90 border border-slate-700/80 text-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                {msg.taxImpactBadge && (
                  <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {msg.taxImpactBadge}
                  </span>
                )}
                <div
                  className="text-sm leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: msg.text
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\n/g, '<br/>'),
                  }}
                />
                <span className="text-[10px] text-slate-400 block text-right font-mono">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Answer Input Area */}
        <div className="p-4 bg-slate-800/90 border-t border-slate-700/80 space-y-3">
          {currentQuestionIdx < CHAT_QUESTIONS.length ? (
            <div className="space-y-3">
              {/* Question Help Explanation */}
              <div className="text-xs bg-slate-900/80 border border-slate-700/60 p-2.5 rounded-xl text-slate-300 flex items-start space-x-2">
                <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{activeQuestion.explanation}</span>
              </div>

              {/* Dynamic Question Controls */}
              {activeQuestion.id === 'health_insurance' && (
                <div className="space-y-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() =>
                        handleAnswerSubmit(
                          {
                            hasParentsHealthInsurance: true,
                            healthInsuranceAmountSelf: healthInsuranceSelf,
                            healthInsuranceAmountParents: healthInsuranceParents,
                            parentsAge60Plus: parentsSenior,
                          },
                          `Yes, I paid health insurance (Self: ${formatINR(healthInsuranceSelf)}, Parents: ${formatINR(healthInsuranceParents)})`
                        )
                      }
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold p-3 rounded-xl text-xs transition"
                    >
                      Yes, I paid Health Insurance
                    </button>
                    <button
                      onClick={() =>
                        handleAnswerSubmit(
                          { hasParentsHealthInsurance: false, healthInsuranceAmountSelf: 0, healthInsuranceAmountParents: 0 },
                          'No health insurance paid'
                        )
                      }
                      className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold p-3 rounded-xl text-xs transition"
                    >
                      No, I didn't pay any
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div>
                      <label className="text-slate-400">Self & Family Premium</label>
                      <input
                        type="number"
                        value={healthInsuranceSelf}
                        onChange={(e) => setHealthInsuranceSelf(Number(e.target.value))}
                        className="w-full bg-slate-800 text-white p-2 rounded-lg border border-slate-700 mt-1 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400">Parents Premium</label>
                      <input
                        type="number"
                        value={healthInsuranceParents}
                        onChange={(e) => setHealthInsuranceParents(Number(e.target.value))}
                        className="w-full bg-slate-800 text-white p-2 rounded-lg border border-slate-700 mt-1 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeQuestion.id === 'house_rent' && (
                <div className="space-y-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-slate-400">Monthly Rent Paid (₹)</label>
                      <input
                        type="number"
                        value={rentAmount}
                        onChange={(e) => setRentAmount(Number(e.target.value))}
                        className="w-full bg-slate-800 text-white p-2 rounded-lg border border-slate-700 mt-1 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400">City Type</label>
                      <select
                        value={isMetro ? 'metro' : 'non-metro'}
                        onChange={(e) => setIsMetro(e.target.value === 'metro')}
                        className="w-full bg-slate-800 text-white p-2 rounded-lg border border-slate-700 mt-1"
                      >
                        <option value="metro">Metro (Mumbai, Delhi, Kolkata, Chennai)</option>
                        <option value="non-metro">Non-Metro City</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={() =>
                        handleAnswerSubmit(
                          { paysRent: true, monthlyRentPaid: rentAmount, cityIsMetro: isMetro },
                          `Yes, I pay ${formatINR(rentAmount)}/month rent (${isMetro ? 'Metro' : 'Non-Metro'})`
                        )
                      }
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold p-3 rounded-xl text-xs transition"
                    >
                      Save HRA Claim ({formatINR(rentAmount)}/mo)
                    </button>
                    <button
                      onClick={() =>
                        handleAnswerSubmit({ paysRent: false, monthlyRentPaid: 0 }, 'I live in my own house / no rent paid')
                      }
                      className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold p-3 rounded-xl text-xs transition"
                    >
                      No Rent Paid
                    </button>
                  </div>
                </div>
              )}

              {activeQuestion.id === 'investments_80c' && (
                <div className="space-y-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <div>
                    <label className="text-xs text-slate-400">Total Additional 80C Investments (ELSS/PPF/LIC/Tuition)</label>
                    <input
                      type="number"
                      value={elssAmount}
                      onChange={(e) => setElssAmount(Number(e.target.value))}
                      className="w-full bg-slate-800 text-white p-2 rounded-lg border border-slate-700 mt-1 font-mono text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() =>
                        handleAnswerSubmit(
                          { hasELSSorPPF: true, elssPpfAmount: elssAmount },
                          `Yes, invested ${formatINR(elssAmount)} in 80C`
                        )
                      }
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold p-3 rounded-xl text-xs transition"
                    >
                      Claim 80C Investments
                    </button>
                    <button
                      onClick={() =>
                        handleAnswerSubmit({ hasELSSorPPF: false, elssPpfAmount: 0 }, 'No additional 80C investments')
                      }
                      className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold p-3 rounded-xl text-xs transition"
                    >
                      No 80C Investments
                    </button>
                  </div>
                </div>
              )}

              {activeQuestion.id === 'savings_interest' && (
                <div className="space-y-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <div>
                    <label className="text-xs text-slate-400">Savings Bank Account Interest Earned (₹)</label>
                    <input
                      type="number"
                      value={savingsInterestAmount}
                      onChange={(e) => setSavingsInterestAmount(Number(e.target.value))}
                      className="w-full bg-slate-800 text-white p-2 rounded-lg border border-slate-700 mt-1 font-mono text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() =>
                        handleAnswerSubmit(
                          { hasSavingsInterest: true, savingsInterestAmount: savingsInterestAmount },
                          `Yes, earned ${formatINR(savingsInterestAmount)} savings interest`
                        )
                      }
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold p-3 rounded-xl text-xs transition"
                    >
                      Add Savings Interest
                    </button>
                    <button
                      onClick={() =>
                        handleAnswerSubmit({ hasSavingsInterest: false, savingsInterestAmount: 0 }, 'No savings interest')
                      }
                      className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold p-3 rounded-xl text-xs transition"
                    >
                      No Interest Earned
                    </button>
                  </div>
                </div>
              )}

              {activeQuestion.id === 'home_loan' && (
                <div className="space-y-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <div>
                    <label className="text-xs text-slate-400">Annual Home Loan Interest Paid (₹)</label>
                    <input
                      type="number"
                      value={homeLoanInterestAmount}
                      onChange={(e) => setHomeLoanInterestAmount(Number(e.target.value))}
                      className="w-full bg-slate-800 text-white p-2 rounded-lg border border-slate-700 mt-1 font-mono text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() =>
                        handleAnswerSubmit(
                          { hasHomeLoanInterest: true, homeLoanInterestAmount },
                          `Yes, paid ${formatINR(homeLoanInterestAmount)} home loan interest`
                        )
                      }
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold p-3 rounded-xl text-xs transition"
                    >
                      Claim Sec 24 Home Loan Interest
                    </button>
                    <button
                      onClick={() =>
                        handleAnswerSubmit({ hasHomeLoanInterest: false, homeLoanInterestAmount: 0 }, 'No home loan')
                      }
                      className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold p-3 rounded-xl text-xs transition"
                    >
                      No Home Loan
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onComplete(userAnswers)}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold p-4 rounded-xl shadow-lg hover:from-emerald-400 hover:to-teal-300 transition flex items-center justify-center space-x-2 text-base"
            >
              <span>View Full Old vs. New Regime Comparison</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Right 1 Col: Live Real-time Tax Simulator Card */}
      <div className="space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl sticky top-20">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Live Tax Simulator</span>
            </span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
              Real-time
            </span>
          </div>

          {/* Winning Banner */}
          <div className="bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-500/30 p-4 rounded-xl space-y-2">
            <span className="text-xs text-emerald-400 font-semibold">Recommended Regime</span>
            <div className="text-2xl font-black text-white flex items-center justify-between">
              <span>{currentCalculations.recommendedRegime}</span>
              <span className="text-emerald-400 text-sm font-bold bg-emerald-500/20 px-2.5 py-1 rounded-lg">
                Saves {formatINR(currentCalculations.taxSavings)}
              </span>
            </div>
          </div>

          {/* Quick Side-by-Side Comparison */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className={`p-3 rounded-xl border ${currentCalculations.recommendedRegime === 'Old Regime' ? 'bg-slate-800 border-emerald-500/50' : 'bg-slate-900/60 border-slate-800'}`}>
              <div className="text-slate-400 font-medium">Old Regime Tax</div>
              <div className="text-lg font-bold font-mono text-white mt-1">
                {formatINR(currentCalculations.oldRegime.totalTaxLiability)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Net Deductions: {formatINR(currentCalculations.oldRegime.totalChapter6ADeductions + currentCalculations.oldRegime.totalExemptions)}
              </div>
            </div>

            <div className={`p-3 rounded-xl border ${currentCalculations.recommendedRegime === 'New Regime' ? 'bg-slate-800 border-emerald-500/50' : 'bg-slate-900/60 border-slate-800'}`}>
              <div className="text-slate-400 font-medium">New Regime Tax</div>
              <div className="text-lg font-bold font-mono text-white mt-1">
                {formatINR(currentCalculations.newRegime.totalTaxLiability)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Std Deduction: {formatINR(75000)}
              </div>
            </div>
          </div>

          {/* TDS & Net Refund/Payable Status */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>TDS Deducted by Employer</span>
              <span className="font-mono text-white">{formatINR(form16.tdsDeducted)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-1 border-t border-slate-800">
              <span className="text-slate-300">Estimated Refund / Payable</span>
              <span className={`font-mono ${currentCalculations.recommendedRegime === 'Old Regime' ? (currentCalculations.oldRegime.refundOrPayable <= 0 ? 'text-emerald-400' : 'text-amber-400') : (currentCalculations.newRegime.refundOrPayable <= 0 ? 'text-emerald-400' : 'text-amber-400')}`}>
                {formatINR(
                  currentCalculations.recommendedRegime === 'Old Regime'
                    ? currentCalculations.oldRegime.refundOrPayable
                    : currentCalculations.newRegime.refundOrPayable
                )}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Updated live based on your active Q&A answers</span>
          </div>
        </div>
      </div>
    </div>
  );
};
