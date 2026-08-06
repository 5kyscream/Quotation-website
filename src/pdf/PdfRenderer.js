import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const generatePdf = async (elementRef, filename) => {
  if (!elementRef.current) return;

  const pages = elementRef.current.querySelectorAll('.pdf-page');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // A4 dimensions in mm
  const a4Width = 210;
  const a4Height = 297;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    
    // We increase scale for better resolution, but keep the PDF size A4
    const canvas = await html2canvas(page, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#1A1A2E' // Midnight color as base fallback
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);

    if (i > 0) {
      pdf.addPage();
    }
    
    pdf.addImage(imgData, 'JPEG', 0, 0, a4Width, a4Height);
  }

  pdf.save(`${filename}.pdf`);
};
