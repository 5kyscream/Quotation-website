import pptxgen from "pptxgenjs";
import { calculateFinancials, formatCurrency } from './calculations';

export const generatePptx = async (formData) => {
  const fin = calculateFinancials(formData);
  
  // 1. Initialize PPTX
  let pptx = new pptxgen();
  pptx.layout = "LAYOUT_16x9"; // 10 x 5.625 inches

  // Define Colors
  const COLORS = {
    bg: "0A1B3D",
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
      { text: { text: "VYKON INDUS TECHNOLOGIES", options: { x: 0.5, y: 5.2, w: 4, h: 0.3, fontSize: 10, color: COLORS.white, bold: true, fontFace: "Arial" } } },
      { text: { text: "careers@vykonindustechnologies.com", options: { x: 0.5, y: 5.4, w: 4, h: 0.2, fontSize: 8, color: COLORS.muted, fontFace: "Arial" } } },
    ]
  });

  // Helper function for Section Headers
  const addHeader = (slide, title, highlight) => {
    slide.addText([
      { text: title + " ", options: { color: COLORS.white, bold: true } },
      { text: highlight, options: { color: COLORS.orange, bold: true } }
    ], { x: 0.5, y: 0.3, w: 8, h: 0.5, fontSize: 24, fontFace: "Arial" });
    slide.addShape(pptx.ShapeType.line, { x: 0.5, y: 0.8, w: 9, h: 0, line: { color: "333355", width: 1 } });
  };

  // --- SLIDE 1: COVER ---
  let slide1 = pptx.addSlide({ masterName: "VYKON_MASTER" });
  slide1.addText(`PROPOSAL NO: ${formData.proposalNumber}`, { x: 0.5, y: 1.5, w: 4, h: 0.3, fontSize: 10, color: COLORS.teal, bold: true });
  slide1.addText(`${formData.capacity} kWp\nSOLAR POWER PLANT`, { x: 0.5, y: 2, w: 8, h: 1.5, fontSize: 40, color: COLORS.white, bold: true });
  
  slide1.addText("PREPARED FOR", { x: 0.5, y: 4.0, w: 4, h: 0.2, fontSize: 10, color: COLORS.muted, bold: true });
  slide1.addText(formData.companyName, { x: 0.5, y: 4.2, w: 8, h: 0.4, fontSize: 24, color: COLORS.white, bold: true });
  slide1.addText(`Attn: ${formData.contactPerson}\n${formData.siteAddress}`, { x: 0.5, y: 4.6, w: 8, h: 0.4, fontSize: 12, color: COLORS.earth });

  // --- SLIDE 2: SYSTEM PRICING ---
  let slide2 = pptx.addSlide({ masterName: "VYKON_MASTER" });
  addHeader(slide2, "SYSTEM", "PRICING");
  
  slide2.addText("Project Cost", { x: 0.5, y: 1.0, w: 4, h: 0.3, fontSize: 14, color: COLORS.white, bold: true });
  let tablePricing = [
    [
      { text: "Component", options: { bold: true, color: COLORS.orange, fill: "1A2A4D" } },
      { text: "Details", options: { bold: true, color: COLORS.orange, fill: "1A2A4D" } },
      { text: "Cost", options: { bold: true, color: COLORS.orange, fill: "1A2A4D", align: "right" } }
    ],
    ["Solar Power Generating System", "Supply & Installation of Solar PV System", { text: formatCurrency(fin.projectCost), options: { align: "right" } }],
    ["Taxes", `GST @ ${formData.gstRate || 13.8}%`, { text: formatCurrency(fin.gstAmount), options: { align: "right" } }],
    [
      { text: "Grand Total", options: { bold: true, color: COLORS.teal, fill: COLORS.darkRow } },
      { text: "", options: { fill: COLORS.darkRow } },
      { text: formatCurrency(fin.grandTotal), options: { bold: true, color: COLORS.teal, fill: COLORS.darkRow, align: "right" } }
    ]
  ];
  slide2.addTable(tablePricing, { x: 0.5, y: 1.4, w: 9, fontSize: 11, color: COLORS.white, border: { type: "solid", pt: 1, color: "333355" } });

  slide2.addText("Incentives & Tax Credit", { x: 0.5, y: 3.2, w: 4, h: 0.3, fontSize: 14, color: COLORS.white, bold: true });
  let tableIncentives = [
    [
      { text: "Incentive Type", options: { bold: true, color: COLORS.teal, fill: "1A2A4D" } },
      { text: "Amount", options: { bold: true, color: COLORS.teal, fill: "1A2A4D", align: "right" } }
    ],
    ["GST Input Credit", { text: formatCurrency(fin.gstInputCredit), options: { align: "right" } }],
    ["Accelerated Depreciation Benefit (1st Year)", { text: formatCurrency(fin.acceleratedDepreciation), options: { align: "right" } }],
    [
      { text: "Total Benefits", options: { bold: true, color: COLORS.orange, fill: COLORS.darkRow } },
      { text: formatCurrency(fin.totalIncentives), options: { bold: true, color: COLORS.orange, fill: COLORS.darkRow, align: "right" } }
    ]
  ];
  slide2.addTable(tableIncentives, { x: 0.5, y: 3.6, w: 9, fontSize: 11, color: COLORS.white, border: { type: "solid", pt: 1, color: "333355" } });


  // --- SLIDE 3: PROJECT OUTCOMES & CHARTS ---
  let slide3 = pptx.addSlide({ masterName: "VYKON_MASTER" });
  addHeader(slide3, "PROJECT", "OUTCOMES");

  // Metrics Row
  slide3.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.0, w: 2.8, h: 0.8, fill: COLORS.darkRow, line: { color: COLORS.teal, pt: 1 } });
  slide3.addText("1st Year Savings", { x: 0.5, y: 1.1, w: 2.8, h: 0.2, fontSize: 10, color: COLORS.muted, align: "center" });
  slide3.addText(formatCurrency(fin.firstYearSavings), { x: 0.5, y: 1.3, w: 2.8, h: 0.4, fontSize: 18, color: COLORS.white, bold: true, align: "center" });

  slide3.addShape(pptx.ShapeType.rect, { x: 3.6, y: 1.0, w: 2.8, h: 0.8, fill: COLORS.darkRow, line: { color: COLORS.orange, pt: 1 } });
  slide3.addText("Lifetime Savings (25 Yrs)", { x: 3.6, y: 1.1, w: 2.8, h: 0.2, fontSize: 10, color: COLORS.muted, align: "center" });
  slide3.addText(formatCurrency(fin.lifetimeSavings), { x: 3.6, y: 1.3, w: 2.8, h: 0.4, fontSize: 18, color: COLORS.white, bold: true, align: "center" });

  slide3.addShape(pptx.ShapeType.rect, { x: 6.7, y: 1.0, w: 2.8, h: 0.8, fill: COLORS.darkRow, line: { color: COLORS.teal, pt: 1 } });
  slide3.addText("Payback Period", { x: 6.7, y: 1.1, w: 2.8, h: 0.2, fontSize: 10, color: COLORS.muted, align: "center" });
  slide3.addText(`${fin.paybackYears}Y ${fin.paybackRemainingMonths}M`, { x: 6.7, y: 1.3, w: 2.8, h: 0.4, fontSize: 18, color: COLORS.white, bold: true, align: "center" });

  // Editable Charts!
  const monthlyGenData = Array.from({ length: 12 }, (_, i) => Math.round(fin.annualGeneration / 12 * (1 + Math.sin(i) * 0.1)));
  const monthlyLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  
  let genChartData = [{ name: "Generation (kWh)", labels: monthlyLabels, values: monthlyGenData }];
  slide3.addChart(pptx.ChartType.bar, genChartData, {
    x: 0.5, y: 2.0, w: 4.2, h: 2.8,
    barDir: "col",
    chartColors: [COLORS.teal],
    showTitle: true, title: "1st Year Monthly Generation (kWh)", titleColor: COLORS.white, titleFontSize: 12,
    valAxisLabelColor: COLORS.muted, valAxisLineColor: "333355",
    catAxisLabelColor: COLORS.muted, catAxisLineColor: "333355",
    showLegend: false,
    plotArea: { fill: { color: COLORS.bg } }
  });

  let cumulative = 0;
  let currentTariff = parseFloat(formData.tariffRate);
  let currentGen = fin.annualGeneration;
  const savingsData = Array.from({ length: 25 }, (_, i) => {
    cumulative += currentGen * currentTariff;
    currentTariff *= (1 + (parseFloat(formData.escalationRate || 0) / 100));
    currentGen *= 0.99;
    return Math.round(cumulative / 100000); // Lakhs
  });
  const yearLabels = Array.from({ length: 25 }, (_, i) => `Yr ${i+1}`);

  let savChartData = [{ name: "Savings (Lakhs INR)", labels: yearLabels, values: savingsData }];
  slide3.addChart(pptx.ChartType.bar, savChartData, {
    x: 5.2, y: 2.0, w: 4.2, h: 2.8,
    barDir: "col",
    chartColors: [COLORS.orange],
    showTitle: true, title: "25 Year Cumulative Savings (Lakhs INR)", titleColor: COLORS.white, titleFontSize: 12,
    valAxisLabelColor: COLORS.muted, valAxisLineColor: "333355",
    catAxisLabelColor: COLORS.muted, catAxisLineColor: "333355",
    showLegend: false,
    plotArea: { fill: { color: COLORS.bg } },
    catAxisLabelFrequency: 5
  });


  // --- SLIDE 4: BILL OF MATERIALS ---
  let slide4 = pptx.addSlide({ masterName: "VYKON_MASTER" });
  addHeader(slide4, "BILL OF", "MATERIALS & WARRANTY");

  let tableBom = [
    [
      { text: "Component", options: { bold: true, color: COLORS.teal, fill: "1A2A4D" } },
      { text: "Make", options: { bold: true, color: COLORS.teal, fill: "1A2A4D" } },
      { text: "Warranty", options: { bold: true, color: COLORS.teal, fill: "1A2A4D" } }
    ],
    ["Solar Panels/Modules", formData.panelMake, "25 Years"],
    ["Inverter", formData.inverterMake, "5 Years"],
    ["DC Cable", formData.dcCableMake, "1 Year"],
    ["AC Cable", formData.acCableMake, "1 Year"],
    ["Switchgear", formData.switchgearMake, "1 Year"]
  ];
  slide4.addTable(tableBom, { x: 0.5, y: 1.2, w: 9, fontSize: 12, color: COLORS.white, border: { type: "solid", pt: 1, color: "333355" } });

  slide4.addText("Note: OEM products have manufacturer warranties. System warranty provided by Vykon Indus Technologies.", {
    x: 0.5, y: 4.5, w: 9, h: 0.3, fontSize: 10, color: COLORS.muted, italic: true
  });


  // 4. Download File
  pptx.writeFile({ fileName: `Proposal_${formData.proposalNumber}_${formData.companyName.replace(/\s+/g, '_')}.pptx` });
};
