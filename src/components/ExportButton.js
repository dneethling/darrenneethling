import React from 'react';
import html2pdf from 'html2pdf.js';

const ExportButton = () => {
  const exportToPDF = () => {
    const element = document.getElementById('cv-container');
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Neethling, D - CV ${currentDate}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        logging: true,
        letterRendering: true
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // Temporarily add a class for PDF generation
    document.body.classList.add('generating-pdf');

    // Function to remove temporary class
    const cleanup = () => {
      document.body.classList.remove('generating-pdf');
    };

    html2pdf().set(opt).from(element).save().then(cleanup).catch(cleanup);
  };

  return (
    <button onClick={exportToPDF} className="export-button">
      Export to PDF
    </button>
  );
};

export default ExportButton;