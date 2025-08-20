// server/src/utils/financeUtils.ts

export interface FinanceInput {
  yearly_income: number;
  tax_percent?: number; // Optional, defaults to 0
  savings_percent: number;
  wants_percent: number;
  needs_percent: number;
}

/**
 * Validates finance profile input
 * - yearly_income ≥ 0
 * - tax_percent between 0–100
 * - savings, wants, needs percentages between 0–100
 * - sum of savings + wants + needs ≤ 100
 *
 * @param data FinanceInput
 * @returns null if valid, or error message string
 */
export const validateFinanceInput = (data: FinanceInput): string | null => {
  const { yearly_income, tax_percent = 0, savings_percent, wants_percent, needs_percent } = data;

  // Validate yearly_income
  if (typeof yearly_income !== "number" || yearly_income < 0) {
    return "yearly_income must be a number greater than or equal to 0";
  }

  // Validate tax_percent
  if (typeof tax_percent !== "number" || tax_percent < 0 || tax_percent > 100) {
    return "tax_percent must be a number between 0 and 100";
  }

  // Validate savings, wants, needs percentages
  const percentages = [savings_percent, wants_percent, needs_percent];
  if (percentages.some(p => typeof p !== "number" || p < 0 || p > 100)) {
    return "Percentages (savings, wants, needs) must be numbers between 0 and 100";
  }

  // Validate total split does not exceed 100%
  const total = savings_percent + wants_percent + needs_percent;
  if (total > 100) {
    return "Sum of savings, wants, and needs cannot exceed 100%";
  }

  return null; // valid
};
