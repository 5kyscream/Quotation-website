export const calculateFinancials = (inputs) => {
  const capacity = parseFloat(inputs.capacity) || 0;
  const tariffRate = parseFloat(inputs.tariffRate) || 0;
  const costPerWp = parseFloat(inputs.costPerWp) || 0;
  const gstRate = parseFloat(inputs.gstRate) || 8.9;
  
  const year1GenerationPerKwp = parseFloat(inputs.year1GenerationPerKwp) || 1460;
  const degradationRate = parseFloat(inputs.degradationRate) || 0.7;
  const subsidyAmount = parseFloat(inputs.subsidyAmount) || 0;

  const downPaymentPercent = parseFloat(inputs.downPayment) || 0;
  const interestRate = parseFloat(inputs.interestRate) || 10;
  const tenureYears = parseFloat(inputs.tenureYears) || 5;
  const escalationRate = parseFloat(inputs.escalationRate) || 3;

  // Project Cost (base) = Cost per Wp × Plant Capacity (Wp)
  const projectCost = costPerWp * (capacity * 1000);
  
  // GST Amount = Project Cost × GST Rate
  const gstAmount = projectCost * (gstRate / 100);
  
  // Grand Total = Project Cost + GST Amount
  let grandTotal = projectCost + gstAmount - subsidyAmount;
  if (grandTotal < 0) grandTotal = 0;

  // Annual Generation (kWh)
  const annualGeneration = capacity * year1GenerationPerKwp;

  // 1st Year Savings (₹) = Annual Generation × Tariff Rate
  const firstYearSavings = annualGeneration * tariffRate;

  // Average Annual Savings & Lifetime Savings (25 yrs)
  let lifetimeSavings = 0;
  let currentTariff = tariffRate;
  let currentGeneration = annualGeneration;
  
  for (let year = 1; year <= 25; year++) {
    lifetimeSavings += currentGeneration * currentTariff;
    // Tariff escalation per year
    currentTariff *= (1 + (escalationRate / 100));
    // Degradation from Year 2
    if (year > 1) {
      currentGeneration *= (1 - (degradationRate / 100));
    }
  }
  
  const averageAnnualSavings = lifetimeSavings / 25;

  // Payback Period (months) = (Grand Total / 1st Year Savings) × 12
  const paybackMonths = firstYearSavings > 0 ? (grandTotal / firstYearSavings) * 12 : 0;
  const paybackYears = Math.floor(paybackMonths / 12);
  const paybackRemainingMonths = Math.round(paybackMonths % 12);

  // Annual Returns % = (1st Year Savings / Grand Total) × 100
  const annualReturns = grandTotal > 0 ? (firstYearSavings / grandTotal) * 100 : 0;

  // --- Incentives ---
  let gstInputCredit = 0;
  let acceleratedDepreciation = 0;

  if (inputs.taxBenefitAvailable) {
    gstInputCredit = gstAmount;
    
    // Tax Rate & Depreciation Rate
    const taxRate = parseFloat(inputs.taxRate) || 25;
    const depRate = parseFloat(inputs.depreciationRate) || 40;
    
    // Total Tax Savings over lifetime from Accelerated Depreciation
    // simplified: Project Cost * (Tax Rate / 100)
    acceleratedDepreciation = projectCost * (taxRate / 100); 
  }
  
  const totalIncentives = gstInputCredit + acceleratedDepreciation;

  // --- Loan Calculations ---
  let loanAmount = 0;
  let upfrontInvestment = 0;
  let monthlyEMI = 0;

  if (inputs.isLoan) {
    loanAmount = grandTotal * (1 - (downPaymentPercent / 100));
    upfrontInvestment = grandTotal * (downPaymentPercent / 100);
    
    // EMI = P × r × (1+r)^n / ((1+r)^n − 1)
    const p = loanAmount;
    const r = (interestRate / 100) / 12;
    const n = tenureYears * 12;
    
    if (r > 0 && n > 0) {
      monthlyEMI = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else if (r === 0 && n > 0) {
      monthlyEMI = p / n; // 0% interest case
    }
  } else {
    upfrontInvestment = grandTotal;
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
