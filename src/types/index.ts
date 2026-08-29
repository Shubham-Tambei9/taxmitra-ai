export type FilingStep = 'upload' | 'chat' | 'compare' | 'filing' | 'complete';

export interface Form16Data {
  employerName: string;
  employerTan: string;
  employeeName: string;
  employeePan: string;
  financialYear: string;
  assessmentYear: string;
  grossSalary: number; // Sec 17(1)
  perquisites: number; // Sec 17(2)
  profitsInLieu: number; // Sec 17(3)
  section10Exemptions: {
    hra: number; // Sec 10(13A)
    lta: number; // Sec 10(5)
    others: number;
  };
  stdDeductionForm16: number; // Standard deduction ₹50k or ₹75k
  entertainmentAllowance: number;
  professionalTax: number;
  chapter6ADeductions: {
    sec80C: number;
    sec80CCC: number;
    sec80CCD1: number;
    sec80CCD1B: number; // NPS additional 50k
    sec80D: number; // Health Insurance
    sec80E: number; // Education Loan interest
    sec80EEB: number; // EV Loan
    sec80G: number; // Donations
    sec80TTA: number; // Savings interest
  };
  tdsDeducted: number; // Tax Deducted at Source
  taxPayableForm16: number;
  fileName?: string;
  isSample?: boolean;
}

export interface UserAnswers {
  hasParentsHealthInsurance: boolean;
  parentsAge60Plus: boolean;
  healthInsuranceAmountSelf: number;
  healthInsuranceAmountParents: number;
  paysRent: boolean;
  monthlyRentPaid: number;
  cityIsMetro: boolean;
  hasELSSorPPF: boolean;
  elssPpfAmount: number;
  hasSavingsInterest: boolean;
  savingsInterestAmount: number;
  hasHomeLoanInterest: boolean;
  homeLoanInterestAmount: number;
}

export interface RegimeTaxBreakdown {
  regimeName: 'Old Regime' | 'New Regime';
  grossSalary: number;
  totalExemptions: number; // HRA, LTA, etc.
  netSalary: number;
  standardDeduction: number;
  professionalTax: number;
  taxableSalary: number;
  otherIncome: number;
  grossTotalIncome: number;
  totalChapter6ADeductions: number; // 80C, 80D, 80TTA, etc.
  netTaxableIncome: number;
  basicTax: number;
  rebate87A: number;
  taxAfterRebate: number;
  cess: number; // 4%
  totalTaxLiability: number;
  tdsPaid: number;
  refundOrPayable: number; // Negative = Refund, Positive = Payable
  isRecommended: boolean;
  savingsVsOther: number;
}

export interface ChatQuestion {
  id: string;
  question: string;
  explanation: string;
  taxSectionHelp: string;
  inputType: 'boolean' | 'number' | 'multi_choice';
  options?: { label: string; value: string | number | boolean }[];
  fieldKey: keyof UserAnswers | string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  questionId?: string;
  suggestedAnswers?: { label: string; actionValue: any }[];
  taxImpactBadge?: string;
}

export interface ITRFilingReceipt {
  ackNumber: string;
  filingDate: string;
  assessmentYear: string;
  pan: string;
  name: string;
  selectedRegime: 'Old Regime' | 'New Regime';
  grossTotalIncome: number;
  totalDeductions: number;
  netTaxableIncome: number;
  totalTaxLiability: number;
  tdsPaid: number;
  refundOrPayableAmount: number;
  eVerifyStatus: 'e-Verified via Aadhaar OTP' | 'Pending Verification';
  tokenHash: string;
}
