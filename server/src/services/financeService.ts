// server/src/services/financeService.ts
import FinanceProfile from "../models/FinanceProfile";

interface FinanceInput {
  yearly_income: number;
  tax_percent?: number;
  savings_percent?: number;
  wants_percent?: number;
  needs_percent?: number;
}

export const calculateMonthly = (input: FinanceInput) => {
  const taxPercent = input.tax_percent ?? 0;
  const savingsPercent = input.savings_percent ?? 20;
  const wantsPercent = input.wants_percent ?? 30;
  const needsPercent = input.needs_percent ?? 50;

  // Validation
  if (input.yearly_income < 0) throw new Error("Yearly income must be ≥ 0");
  if (taxPercent < 0) throw new Error("Tax percent cannot be negative");
  if (savingsPercent + wantsPercent + needsPercent > 100)
    throw new Error("Percentages sum cannot exceed 100");

  // Calculate after-tax yearly income
  const afterTax = input.yearly_income * (1 - taxPercent / 100);

  // Split into categories
  const yearly_savings = (afterTax * savingsPercent) / 100;
  const yearly_wants = (afterTax * wantsPercent) / 100;
  const yearly_needs = (afterTax * needsPercent) / 100;

  // Monthly breakdown
  const monthly_income = afterTax / 12;
  const monthly_savings = yearly_savings / 12;
  const monthly_wants = yearly_wants / 12;
  const monthly_needs = yearly_needs / 12;

  return {
    monthly_income,
    monthly_savings,
    monthly_wants,
    monthly_needs,
    yearly_savings,
    yearly_wants,
    yearly_needs,
  };
};

// Create profile
export const createFinanceProfile = async (userId: number, input: FinanceInput) => {
  const monthlyData = calculateMonthly(input);

  const profile = await FinanceProfile.create({
    user_id: userId,
    yearly_income: input.yearly_income,
    tax_percent: input.tax_percent ?? 0,
    savings_percent: input.savings_percent ?? 20,
    wants_percent: input.wants_percent ?? 30,
    needs_percent: input.needs_percent ?? 50,
    monthly_income: monthlyData.monthly_income,
    monthly_savings: monthlyData.monthly_savings,
    monthly_wants: monthlyData.monthly_wants,
    monthly_needs: monthlyData.monthly_needs,
  });

  return profile;
};

// Update profile
export const updateFinanceProfile = async (id: number, input: FinanceInput) => {
  const monthlyData = calculateMonthly(input);

  const profile = await FinanceProfile.findByPk(id);
  if (!profile) throw new Error("FinanceProfile not found");

  await profile.update({
    yearly_income: input.yearly_income,
    tax_percent: input.tax_percent ?? profile.tax_percent,
    savings_percent: input.savings_percent ?? profile.savings_percent,
    wants_percent: input.wants_percent ?? profile.wants_percent,
    needs_percent: input.needs_percent ?? profile.needs_percent,
    monthly_income: monthlyData.monthly_income,
    monthly_savings: monthlyData.monthly_savings,
    monthly_wants: monthlyData.monthly_wants,
    monthly_needs: monthlyData.monthly_needs,
  });

  return profile;
};

// Fetch profile
export const getFinanceProfileByUser = async (userId: number) => {
  const profile = await FinanceProfile.findOne({ where: { user_id: userId } });
  return profile;
};
