import React from 'react';
import html2pdf from 'html2pdf.js';
import { FaDownload } from 'react-icons/fa';

const ExportButton = () => {
  const exportToPDF = () => {
    const element = document.getElementById('cv-container');
    const currentDate = new Date().toISOString().split('T')[0];
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Darren Neethling - CV ${currentDate}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    document.body.classList.add('generating-pdf');

    const cleanup = () => {
      document.body.classList.remove('generating-pdf');
    };

    html2pdf().set(opt).from(element).save().then(cleanup).catch(cleanup);
  };

  return (
    <button onClick={exportToPDF} className="export-button">
      <FaDownload /> Download CV
    </button>
  );
};

export default ExportButton;
