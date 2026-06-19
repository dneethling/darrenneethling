import React, { useState } from 'react';
import generateCVPdf from './pdfGenerator';
import CVData from './cvData';

const ExportButton = () => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await generateCVPdf(CVData);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleExport} className="export-button" disabled={loading}>
      {loading ? 'Generating PDF…' : 'Download CV (PDF)'}
    </button>
  );
};

export default ExportButton;
