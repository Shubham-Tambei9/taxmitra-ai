import { ChatQuestion, UserAnswers } from '../types';

export const INITIAL_USER_ANSWERS: UserAnswers = {
  hasParentsHealthInsurance: false,
  parentsAge60Plus: false,
  healthInsuranceAmountSelf: 0,
  healthInsuranceAmountParents: 0,
  paysRent: false,
  monthlyRentPaid: 0,
  cityIsMetro: true,
  hasELSSorPPF: false,
  elssPpfAmount: 0,
  hasSavingsInterest: false,
  savingsInterestAmount: 0,
  hasHomeLoanInterest: false,
  homeLoanInterestAmount: 0,
};

export const CHAT_QUESTIONS: ChatQuestion[] = [
  {
    id: 'health_insurance',
    question: 'Did you pay health insurance premiums for yourself, your family, or your parents this year?',
    explanation: 'Health insurance saves tax under Section 80D! Up to ₹25,000 for yourself, plus up to ₹50,000 if paying for senior citizen parents.',
    taxSectionHelp: 'Section 80D - Medical Insurance',
    inputType: 'boolean',
    fieldKey: 'hasParentsHealthInsurance',
  },
  {
    id: 'house_rent',
    question: 'Do you live in a rented house and pay monthly rent?',
    explanation: 'House Rent Allowance (HRA) exemption under Sec 10(13A) can significantly reduce your tax if you pay rent!',
    taxSectionHelp: 'Section 10(13A) - HRA Exemption',
    inputType: 'boolean',
    fieldKey: 'paysRent',
  },
  {
    id: 'investments_80c',
    question: 'Did you make investments in ELSS funds, PPF, EPF, LIC, or pay school tuition / home loan principal?',
    explanation: 'Section 80C allows you to claim tax deductions up to ₹1.5 Lakhs per year under the Old Tax Regime.',
    taxSectionHelp: 'Section 80C - Tax Saving Investments',
    inputType: 'boolean',
    fieldKey: 'hasELSSorPPF',
  },
  {
    id: 'savings_interest',
    question: 'Did you earn interest from your savings bank accounts this year?',
    explanation: 'Interest earned from savings accounts up to ₹10,000 is tax-exempt under Section 80TTA.',
    taxSectionHelp: 'Section 80TTA - Bank Interest',
    inputType: 'boolean',
    fieldKey: 'hasSavingsInterest',
  },
  {
    id: 'home_loan',
    question: 'Do you pay interest on a home loan for a house you own?',
    explanation: 'You can claim up to ₹2,00,000 deduction on home loan interest paid under Section 24(b).',
    taxSectionHelp: 'Section 24(b) - Home Loan Interest',
    inputType: 'boolean',
    fieldKey: 'hasHomeLoanInterest',
  },
];

export function getAiGreetingMessage(employeeName: string, grossSalaryFormatted: string): string {
  return `Hi ${employeeName}! 👋 I'm **Mitra**, your AI Tax Assistant. I've extracted your Form 16 gross income (**${grossSalaryFormatted}**).

To make sure you don't overpay taxes and claim every single eligible deduction, I just need to ask you **5 quick plain-English questions**. Ready? Let's start! 🚀`;
}

export function generateDynamicTaxTip(answers: UserAnswers, recommendedRegime: string, taxSavings: number): string {
  if (taxSavings > 0) {
    return `💡 **Pro Tip**: Choosing **${recommendedRegime}** saves you **₹${taxSavings.toLocaleString('en-IN')}** compared to the other regime!`;
  }
  return `💡 **Pro Tip**: Both tax regimes yield similar results for your current profile. New Regime offers simpler filing without investment proofs!`;
}
