import { Form16Data, UserAnswers, RegimeTaxBreakdown } from '../types';

export function calculateHraExemption(
  actualHraReceived: number,
  monthlyRent: number,
  grossSalary: number,
  isMetro: boolean
): number {
  if (!monthlyRent || monthlyRent <= 0) return 0;

  const annualRent = monthlyRent * 12;
  // Estimate basic salary as 50% of gross salary if not separately specified
  const basicSalary = grossSalary * 0.5;

  const rentMinus10PercentBasic = Math.max(0, annualRent - 0.1 * basicSalary);
  const metroPercentageLimit = (isMetro ? 0.5 : 0.4) * basicSalary;

  return Math.min(
    actualHraReceived > 0 ? actualHraReceived : annualRent,
    rentMinus10PercentBasic,
    metroPercentageLimit
  );
}

export function computeTaxForRegimes(
  form16: Form16Data,
  userAnswers: UserAnswers
): {
  oldRegime: RegimeTaxBreakdown;
  newRegime: RegimeTaxBreakdown;
  recommendedRegime: 'Old Regime' | 'New Regime';
  taxSavings: number;
} {
  const grossSalary = form16.grossSalary || 0;
  const tdsPaid = form16.tdsDeducted || 0;
  const profTax = form16.professionalTax || 2400; // Standard 2400 in most states or 0

  // -------------------------------------------------------------
  // OLD REGIME CALCULATION
  // -------------------------------------------------------------
  const oldStdDeduction = 50000;

  // Exemptions u/s 10
  const calculatedHra = userAnswers.paysRent
    ? calculateHraExemption(
        form16.section10Exemptions?.hra || 0,
        userAnswers.monthlyRentPaid || 0,
        grossSalary,
        userAnswers.cityIsMetro
      )
    : form16.section10Exemptions?.hra || 0;

  const oldExemptions = calculatedHra + (form16.section10Exemptions?.lta || 0) + (form16.section10Exemptions?.others || 0);
  const oldNetSalary = Math.max(0, grossSalary - oldExemptions);
  const oldTaxableSalary = Math.max(0, oldNetSalary - oldStdDeduction - profTax);

  // Other Income
  const savingsInterest = userAnswers.hasSavingsInterest ? userAnswers.savingsInterestAmount : (form16.chapter6ADeductions?.sec80TTA ? 10000 : 0);
  const grossTotalIncomeOld = oldTaxableSalary + savingsInterest;

  // Deductions Chapter VI-A (Old Regime)
  // 80C
  const user80C = userAnswers.hasELSSorPPF ? userAnswers.elssPpfAmount : 0;
  const total80C = Math.min(150000, (form16.chapter6ADeductions?.sec80C || 0) + user80C);

  // 80D (Health Insurance)
  const healthSelf = Math.min(25000, userAnswers.healthInsuranceAmountSelf || 0);
  const healthParentsLimit = userAnswers.parentsAge60Plus ? 50000 : 25000;
  const healthParents = Math.min(healthParentsLimit, userAnswers.healthInsuranceAmountParents || 0);
  const total80D = (form16.chapter6ADeductions?.sec80D || 0) + healthSelf + (userAnswers.hasParentsHealthInsurance ? healthParents : 0);

  // 80TTA (Max 10,000)
  const total80TTA = Math.min(10000, savingsInterest);

  // Sec 24 Home Loan Interest (Max 2,00,000)
  const homeLoanInterest = userAnswers.hasHomeLoanInterest ? Math.min(200000, userAnswers.homeLoanInterestAmount || 0) : 0;

  const totalOldDeductions = total80C + total80D + total80TTA + homeLoanInterest;
  const netTaxableIncomeOld = Math.max(0, grossTotalIncomeOld - totalOldDeductions);

  // Old Regime Tax Slabs
  let basicTaxOld = 0;
  if (netTaxableIncomeOld > 1000000) {
    basicTaxOld = 112500 + (netTaxableIncomeOld - 1000000) * 0.3;
  } else if (netTaxableIncomeOld > 500000) {
    basicTaxOld = 12500 + (netTaxableIncomeOld - 500000) * 0.2;
  } else if (netTaxableIncomeOld > 250000) {
    basicTaxOld = (netTaxableIncomeOld - 250000) * 0.05;
  }

  // Section 87A Rebate for Old Regime (Up to 5L taxable income)
  let rebate87AOld = 0;
  if (netTaxableIncomeOld <= 500000) {
    rebate87AOld = Math.min(basicTaxOld, 12500);
  }

  const taxAfterRebateOld = Math.max(0, basicTaxOld - rebate87AOld);
  const cessOld = taxAfterRebateOld * 0.04;
  const totalTaxOld = Math.round(taxAfterRebateOld + cessOld);
  const refundOrPayableOld = totalTaxOld - tdsPaid;

  // -------------------------------------------------------------
  // NEW REGIME CALCULATION (FY 2024-25 Budget Slabs)
  // -------------------------------------------------------------
  const newStdDeduction = 75000;
  const newNetSalary = Math.max(0, grossSalary); // No HRA / LTA exemptions allowed
  const newTaxableSalary = Math.max(0, newNetSalary - newStdDeduction);
  const grossTotalIncomeNew = newTaxableSalary + savingsInterest;
  
  // New regime allows almost NO chapter VI-A deductions except NPS Sec 80CCD(2) employer contribution
  const netTaxableIncomeNew = Math.max(0, grossTotalIncomeNew);

  // New Tax Regime Slabs (FY 2024-25):
  // 0 - 3L : 0%
  // 3L - 7L : 5%
  // 7L - 10L : 10%
  // 10L - 12L : 15%
  // 12L - 15L : 20%
  // > 15L : 30%
  let basicTaxNew = 0;
  if (netTaxableIncomeNew > 1500000) {
    basicTaxNew = 140000 + (netTaxableIncomeNew - 1500000) * 0.3;
  } else if (netTaxableIncomeNew > 1200000) {
    basicTaxNew = 80000 + (netTaxableIncomeNew - 1200000) * 0.2;
  } else if (netTaxableIncomeNew > 1000000) {
    basicTaxNew = 50000 + (netTaxableIncomeNew - 1000000) * 0.15;
  } else if (netTaxableIncomeNew > 700000) {
    basicTaxNew = 20000 + (netTaxableIncomeNew - 700000) * 0.1;
  } else if (netTaxableIncomeNew > 300000) {
    basicTaxNew = (netTaxableIncomeNew - 300000) * 0.05;
  }

  // Section 87A Rebate for New Regime (Up to 7L net taxable income)
  let rebate87ANew = 0;
  if (netTaxableIncomeNew <= 700000) {
    rebate87ANew = Math.min(basicTaxNew, 25000);
  }

  const taxAfterRebateNew = Math.max(0, basicTaxNew - rebate87ANew);
  const cessNew = taxAfterRebateNew * 0.04;
  const totalTaxNew = Math.round(taxAfterRebateNew + cessNew);
  const refundOrPayableNew = totalTaxNew - tdsPaid;

  // Comparison & Recommendation
  const oldIsBetter = totalTaxOld < totalTaxNew;
  const recommendedRegime = oldIsBetter ? 'Old Regime' : 'New Regime';
  const taxSavings = Math.abs(totalTaxOld - totalTaxNew);

  const oldRegime: RegimeTaxBreakdown = {
    regimeName: 'Old Regime',
    grossSalary,
    totalExemptions: oldExemptions,
    netSalary: oldNetSalary,
    standardDeduction: oldStdDeduction,
    professionalTax: profTax,
    taxableSalary: oldTaxableSalary,
    otherIncome: savingsInterest,
    grossTotalIncome: grossTotalIncomeOld,
    totalChapter6ADeductions: totalOldDeductions,
    netTaxableIncome: netTaxableIncomeOld,
    basicTax: basicTaxOld,
    rebate87A: rebate87AOld,
    taxAfterRebate: taxAfterRebateOld,
    cess: cessOld,
    totalTaxLiability: totalTaxOld,
    tdsPaid,
    refundOrPayable: refundOrPayableOld,
    isRecommended: oldIsBetter,
    savingsVsOther: oldIsBetter ? taxSavings : 0,
  };

  const newRegime: RegimeTaxBreakdown = {
    regimeName: 'New Regime',
    grossSalary,
    totalExemptions: 0,
    netSalary: newNetSalary,
    standardDeduction: newStdDeduction,
    professionalTax: 0, // No prof tax deduction in New Regime
    taxableSalary: newTaxableSalary,
    otherIncome: savingsInterest,
    grossTotalIncome: grossTotalIncomeNew,
    totalChapter6ADeductions: 0,
    netTaxableIncome: netTaxableIncomeNew,
    basicTax: basicTaxNew,
    rebate87A: rebate87ANew,
    taxAfterRebate: taxAfterRebateNew,
    cess: cessNew,
    totalTaxLiability: totalTaxNew,
    tdsPaid,
    refundOrPayable: refundOrPayableNew,
    isRecommended: !oldIsBetter,
    savingsVsOther: !oldIsBetter ? taxSavings : 0,
  };

  return {
    oldRegime,
    newRegime,
    recommendedRegime,
    taxSavings,
  };
}

export function formatINR(val: number): string {
  const isNeg = val < 0;
  const absVal = Math.abs(val);
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(absVal);
  return isNeg ? `-₹${formatted}` : `₹${formatted}`;
}
