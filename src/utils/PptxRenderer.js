import pptxgen from "pptxgenjs";
import { calculateFinancials, formatCurrency } from './calculations';
import { brandConfig } from '../config/brand';

export const generatePptx = async (formData) => {
  const fin = calculateFinancials(formData);
  
  // 1. Initialize PPTX
  let pptx = new pptxgen();
  pptx.layout = "LAYOUT_16x9"; // 10 x 5.625 inches

  // Define Colors
  const COLORS = {
    bg: "1A1A2E",
    navy: "0A1B3D",
    orange: "F4621F",
    teal: "00C2A8",
    white: "FFFFFF",
    muted: "8CAAC8",
    earth: "D4C5A0",
    darkRow: "122345"
  };

  // 2. Define Master Slide
  pptx.defineSlideMaster({
    title: "VYKON_MASTER",
    background: { color: COLORS.bg },
    objects: [
      // Left accent bar
      { rect: { x: 0, y: 0, w: 0.1, h: "100%", fill: { color: COLORS.orange } } },
      // Footer
      { rect: { x: 0.5, y: 5.1, w: 0.5, h: 0.05, fill: { color: COLORS.orange } } },
      { text: { text: brandConfig.companyName, options: { x: 0.5, y: 5.2, w: 4, h: 0.3, fontSize: 10, color: COLORS.white, bold: true, fontFace: "Arial" } } },
      { text: { text: brandConfig.companyEmail, options: { x: 0.5, y: 5.4, w: 4, h: 0.2, fontSize: 8, color: COLORS.muted, fontFace: "Arial" } } },
      { text: { text: `CLOSE PRECISE.`, options: { x: 5, y: 5.2, w: 4.5, h: 0.3, fontSize: 10, color: COLORS.white, bold: true, align: 'right', fontFace: "Arial" } } }
    ]
  });

  // Helper function for Section Headers
  const addHeader = (slide, title, highlight) => {
    slide.addText([
      { text: title + " ", options: { color: COLORS.white, bold: true } },
      { text: highlight, options: { color: COLORS.teal, bold: true } }
    ], { x: 0.5, y: 0.3, w: 8, h: 0.5, fontSize: 24, fontFace: "Arial" });
    slide.addShape(pptx.ShapeType.line, { x: 0.5, y: 0.8, w: 9, h: 0, line: { color: COLORS.teal, width: 1 } });
  };

  // --- SLIDE 1: COVER ---
  let slide1 = pptx.addSlide({ masterName: "VYKON_MASTER" });
  slide1.addText(`PROPOSAL NO: ${formData.proposalNumber}`, { x: 0.5, y: 1.5, w: 4, h: 0.3, fontSize: 10, color: COLORS.teal, bold: true });
  slide1.addText(`${formData.capacity} kWp\nSOLAR PV SOLUTION`, { x: 0.5, y: 2, w: 8, h: 1.5, fontSize: 40, color: COLORS.white, bold: true });
  
  slide1.addText(`PREPARED FOR: ${formData.customerType}`, { x: 0.5, y: 4.0, w: 4, h: 0.2, fontSize: 10, color: COLORS.muted, bold: true });
  slide1.addText(formData.companyName, { x: 0.5, y: 4.2, w: 8, h: 0.4, fontSize: 24, color: COLORS.white, bold: true });
  slide1.addText(`Attn: ${formData.contactPerson}\n${formData.siteAddress}`, { x: 0.5, y: 4.6, w: 8, h: 0.4, fontSize: 12, color: COLORS.earth });

  // --- SLIDE 2: BENEFITS IN NUMBERS ---
  let slide2 = pptx.addSlide({ masterName: "VYKON_MASTER" });
  addHeader(slide2, "Benefits in", "Numbers");
  slide2.addText("Project Cost (Gross)", { x: 0.5, y: 1.2, w: 3, h: 0.3, fontSize: 12, color: COLORS.muted });
  slide2.addText(formatCurrency(fin.grandTotal), { x: 0.5, y: 1.5, w: 3, h: 0.5, fontSize: 24, color: COLORS.orange, bold: true });
  
  slide2.addText("1st Year Est. Savings", { x: 4, y: 1.2, w: 3, h: 0.3, fontSize: 12, color: COLORS.muted });
  slide2.addText(formatCurrency(fin.firstYearSavings), { x: 4, y: 1.5, w: 3, h: 0.5, fontSize: 24, color: COLORS.teal, bold: true });

  slide2.addText("Payback Period", { x: 7, y: 1.2, w: 2.5, h: 0.3, fontSize: 12, color: COLORS.muted });
  slide2.addText(`${fin.paybackYears}Y ${fin.paybackRemainingMonths}M`, { x: 7, y: 1.5, w: 2.5, h: 0.5, fontSize: 24, color: COLORS.white, bold: true });

  slide2.addText(`Site Address: ${formData.siteAddress} ${formData.additionalAddress} ${formData.state}`, { x: 0.5, y: 3.5, w: 9, h: 0.3, fontSize: 12, color: COLORS.white });
  slide2.addText(`Email: ${formData.email} | Phone: ${formData.consumerNumber}`, { x: 0.5, y: 4.0, w: 9, h: 0.3, fontSize: 12, color: COLORS.white });

  // --- SLIDE 3: SYSTEM PRICING ---
  let slide3 = pptx.addSlide({ masterName: "VYKON_MASTER" });
  addHeader(slide3, "System", "Pricing");
  let tablePricing = [
    [
      { text: "Component", options: { bold: true, color: COLORS.white, fill: COLORS.navy } },
      { text: "Details", options: { bold: true, color: COLORS.white, fill: COLORS.navy } },
      { text: "Cost", options: { bold: true, color: COLORS.white, fill: COLORS.navy, align: "right" } }
    ],
    ["Solar Power Generating System", "Supply & Installation of Solar PV System", { text: formatCurrency(fin.projectCost), options: { align: "right" } }],
    ["Taxes", `GST @ ${formData.gstRate || 8.9}%`, { text: formatCurrency(fin.gstAmount), options: { align: "right" } }],
    [
      { text: "Grand Total", options: { bold: true, color: COLORS.orange, fill: COLORS.darkRow } },
      { text: "", options: { fill: COLORS.darkRow } },
      { text: formatCurrency(fin.grandTotal), options: { bold: true, color: COLORS.orange, fill: COLORS.darkRow, align: "right" } }
    ]
  ];
  slide3.addTable(tablePricing, { x: 0.5, y: 1.2, w: 9, fontSize: 12, color: COLORS.white, border: { type: "solid", pt: 1, color: "333355" } });

  // --- SLIDE 4: PROJECT OUTCOMES ---
  let slide4 = pptx.addSlide({ masterName: "VYKON_MASTER" });
  addHeader(slide4, "Project", "Outcomes");
  const monthlyGenData = Array.from({ length: 12 }, (_, i) => Math.round(fin.annualGeneration / 12 * (1 + Math.sin(i) * 0.1)));
  const monthlyLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  slide4.addChart(pptx.ChartType.bar, [{ name: "Generation", labels: monthlyLabels, values: monthlyGenData }], {
    x: 0.5, y: 1.5, w: 9, h: 3,
    barDir: "col", chartColors: [COLORS.teal],
    showTitle: true, title: "1st Year Monthly Generation (kWh)", titleColor: COLORS.white, titleFontSize: 14,
    valAxisLabelColor: COLORS.muted, catAxisLabelColor: COLORS.muted
  });

  // --- SLIDE 5: FINANCING (IF LOAN) ---
  if (formData.isLoan) {
    let slide5 = pptx.addSlide({ masterName: "VYKON_MASTER" });
    addHeader(slide5, "Loan", "Option");
    slide5.addText(`Loan Provider: ${formData.loanSource}`, { x: 0.5, y: 1.5, w: 9, h: 0.5, fontSize: 24, color: COLORS.orange, bold: true });
    
    let tableLoan = [
      [{ text: "Eligible Loan Amount", options: { color: COLORS.muted } }, { text: formatCurrency(fin.loanAmount), options: { bold: true, color: COLORS.white } }],
      [{ text: "Tenure", options: { color: COLORS.muted } }, { text: `${formData.tenureYears} Years`, options: { bold: true, color: COLORS.white } }],
      [{ text: "Monthly Installment", options: { color: COLORS.muted } }, { text: formatCurrency(fin.monthlyEMI), options: { bold: true, color: COLORS.teal } }],
      [{ text: "Upfront Investment", options: { color: COLORS.muted } }, { text: formatCurrency(fin.upfrontInvestment), options: { bold: true, color: COLORS.white } }]
    ];
    slide5.addTable(tableLoan, { x: 0.5, y: 2.5, w: 5, fontSize: 14, color: COLORS.white });
  }

  // --- SLIDE 6: SCOPE & TIMELINE ---
  let slide6 = pptx.addSlide({ masterName: "VYKON_MASTER" });
  addHeader(slide6, "Scope of Work &", "Schedule");
  let tableScope = [
    [
      { text: "Task Name", options: { bold: true, color: COLORS.white, fill: COLORS.navy } },
      { text: "EPC / Cust", options: { bold: true, color: COLORS.white, fill: COLORS.navy } }
    ]
  ];
  formData.scopeItems.forEach(item => {
    tableScope.push([item.name, item.epc ? "EPC" : "Customer"]);
  });
  slide6.addTable(tableScope, { x: 0.5, y: 1.2, w: 4.2, fontSize: 10, color: COLORS.white });

  // --- SLIDE 7: BOM & WARRANTY ---
  let slide7 = pptx.addSlide({ masterName: "VYKON_MASTER" });
  addHeader(slide7, "Bill of", "Materials");
  let tableBom = [
    [
      { text: "Component", options: { bold: true, color: COLORS.white, fill: COLORS.navy } },
      { text: "Make", options: { bold: true, color: COLORS.white, fill: COLORS.navy } },
      { text: "Qty", options: { bold: true, color: COLORS.white, fill: COLORS.navy, align: "center" } }
    ]
  ];
  formData.bomItems.forEach(item => {
    tableBom.push([item.component, item.make, { text: item.qty, options: { align: "center" } }]);
  });
  slide7.addTable(tableBom, { x: 0.5, y: 1.2, w: 9, fontSize: 12, color: COLORS.white, border: { type: "solid", pt: 1, color: "333355" } });
  
  slide7.addText(`*${brandConfig.warrantyFootnote}`, { x: 0.5, y: 4.5, w: 9, h: 0.3, fontSize: 10, color: COLORS.muted, italic: true });

  // --- SLIDE 8: TERMS & CONDITIONS ---
  let slide8 = pptx.addSlide({ masterName: "VYKON_MASTER" });
  addHeader(slide8, "Terms &", "Conditions");
  let tcText = "";
  formData.termsConditions.slice(0, 4).forEach(t => tcText += `${t.title}: ${t.text}\n\n`);
  slide8.addText(tcText, { x: 0.5, y: 1.2, w: 9, h: 3, fontSize: 10, color: COLORS.white });

  // --- SLIDE 9: ABOUT VYKON ---
  let slide9 = pptx.addSlide({ masterName: "VYKON_MASTER" });
  addHeader(slide9, "About", brandConfig.companyName);
  slide9.addText(brandConfig.stats.capacity, { x: 1, y: 2, w: 3, h: 1, fontSize: 40, color: COLORS.orange, bold: true });
  slide9.addText("Installed Solar Capacity", { x: 1, y: 2.8, w: 3, h: 0.5, fontSize: 12, color: COLORS.muted });
  
  // --- SLIDE 10: ENVIRONMENTAL IMPACT ---
  let slide10 = pptx.addSlide({ masterName: "VYKON_MASTER" });
  addHeader(slide10, "Environmental", "Impact");
  slide10.addText(`${fin.treesEquivalent.toLocaleString(undefined, {maximumFractionDigits:0})} Trees Planted`, { x: 0.5, y: 2, w: 9, h: 1, fontSize: 40, color: COLORS.teal, bold: true });

  // 4. Download File
  pptx.writeFile({ fileName: `Proposal_${formData.proposalNumber}_${formData.companyName.replace(/\s+/g, '_')}.pptx` });
};
