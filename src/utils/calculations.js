export const calculateFinancials = (inputs) => {
  const capacity = parseFloat(inputs.capacity) || 0;
  const tariffRate = parseFloat(inputs.tariffRate) || 0;
  const baseCost = parseFloat(inputs.baseCost) || 0;
  const gstRate = parseFloat(inputs.gstRate) || 8.9;
  
  const downPaymentPercent = parseFloat(inputs.downPayment) || 40;
  const interestRate = parseFloat(inputs.interestRate) || 10;
  const tenureYears = parseFloat(inputs.tenureYears) || 5;
  const escalationRate = parseFloat(inputs.escalationRate) || 3;

  // Project Cost (base) = Base Cost per kWp × Plant Capacity (kWp)
  const projectCost = baseCost * capacity;
  
  // GST Amount = Project Cost × GST Rate
  const gstAmount = projectCost * (gstRate / 100);
  
  // Grand Total = Project Cost + GST Amount
  const grandTotal = projectCost + gstAmount;

  // Annual Generation (kWh) = Plant Capacity × 1825
  const annualGeneration = capacity * 1825;

  // 1st Year Savings (₹) = Annual Generation × Tariff Rate
  const firstYearSavings = annualGeneration * tariffRate;

  // Average Annual Savings & Lifetime Savings (25 yrs)
  let lifetimeSavings = 0;
  let currentTariff = tariffRate;
  let currentGeneration = annualGeneration;
  
  for (let year = 1; year <= 25; year++) {
    lifetimeSavings += currentGeneration * currentTariff;
    // 3% tariff escalation per year
    currentTariff *= (1 + (escalationRate / 100));
    // 1% degradation from Year 2
    if (year >= 1) {
      currentGeneration *= 0.99;
    }
  }
  
  const averageAnnualSavings = lifetimeSavings / 25;

  // Payback Period (months) = (Grand Total / 1st Year Savings) × 12
  const paybackMonths = firstYearSavings > 0 ? (grandTotal / firstYearSavings) * 12 : 0;
  const paybackYears = Math.floor(paybackMonths / 12);
  const paybackRemainingMonths = Math.round(paybackMonths % 12);

  // Annual Returns % = (1st Year Savings / Grand Total) × 100
  const annualReturns = grandTotal > 0 ? (firstYearSavings / grandTotal) * 100 : 0;

  // GST Input Credit = GST Amount
  const gstInputCredit = gstAmount;
  
  // Accelerated Depreciation = Project Cost × 0.4 × 0.3
  const acceleratedDepreciation = projectCost * 0.4 * 0.3;
  
  // Total Incentives = GST Input Credit + Accelerated Depreciation
  const totalIncentives = gstInputCredit + acceleratedDepreciation;

  // --- Loan Calculations ---
  let loanAmount = 0;
  let upfrontInvestment = 0;
  let monthlyEMI = 0;

  if (inputs.isLoan) {
    loanAmount = grandTotal * (1 - (downPaymentPercent / 100));
    upfrontInvestment = (grandTotal * (downPaymentPercent / 100)) - totalIncentives;
    
    // EMI = P × r × (1+r)^n / ((1+r)^n − 1)
    const p = loanAmount;
    const r = (interestRate / 100) / 12;
    const n = tenureYears * 12;
    
    if (r > 0 && n > 0) {
      monthlyEMI = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
  }

  // --- Environmental ---
  // CO2 Offset (tonnes) = Annual Generation × 0.000716 × 25
  const co2Offset = annualGeneration * 0.000716 * 25;
  // Trees Equivalent = CO2 Offset × 45
  const treesEquivalent = co2Offset * 45;
  // Distance Driven (lakh km) = CO2 Offset × 4000 / 100000
  const distanceDriven = (co2Offset * 4000) / 100000;

  return {
    projectCost,
    gstAmount,
    grandTotal,
    annualGeneration,
    firstYearSavings,
    averageAnnualSavings,
    lifetimeSavings,
    paybackMonths,
    paybackYears,
    paybackRemainingMonths,
    annualReturns,
    gstInputCredit,
    acceleratedDepreciation,
    totalIncentives,
    loanAmount,
    upfrontInvestment,
    monthlyEMI,
    co2Offset,
    treesEquivalent,
    distanceDriven
  };
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};
