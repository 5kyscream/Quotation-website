import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProposalDocument from '../pdf/ProposalDocument';
import { generatePdf } from '../pdf/PdfRenderer';
import { saveProposal } from '../utils/storage';
import { Download, Save, ArrowLeft } from 'lucide-react';

const PreviewExport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData;
  
  const docRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!formData) {
    return (
      <div style={{ textAlign: 'center', marginTop: '60px' }}>
        <p>No proposal data found.</p>
        <button className="btn-primary" onClick={() => navigate('/new')} style={{ marginTop: '20px' }}>Start Over</button>
      </div>
    );
  }

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await generatePdf(docRef, `Proposal_${formData.proposalNumber}_${formData.companyName.replace(/\s+/g, '_')}`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please check the console.');
    }
    setIsGenerating(false);
  };

  const handleSave = () => {
    const proposal = {
      id: Date.now().toString(),
      ...formData
    };
    saveProposal(proposal);
    alert('Proposal saved successfully!');
    navigate('/proposals');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--color-muted-blue)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <ArrowLeft size={16} /> Back to Edit
          </button>
          <h1 className="subheading" style={{ fontSize: '32px' }}>Preview & Export</h1>
          <p style={{ color: 'var(--color-muted-blue)' }}>Proposal for {formData.companyName} ({formData.capacity} kWp)</p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={handleSave} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Save size={20} /> Save to Dashboard
          </button>
          <button onClick={handleDownload} disabled={isGenerating} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={20} /> {isGenerating ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--color-navy)', padding: '24px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 className="ui-label" style={{ color: 'var(--color-teal)', marginBottom: '16px' }}>PDF Preview</h3>
        
        {/* Hidden Container for PDF Rendering */}
        <div style={{ width: '100%', overflowX: 'auto', backgroundColor: '#333', padding: '40px', borderRadius: '8px' }}>
          <div style={{ width: '210mm', margin: '0 auto', transform: 'scale(0.8)', transformOrigin: 'top center', marginBottom: '-500px' }}>
            {/* The Document */}
            <ProposalDocument ref={docRef} formData={formData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewExport;
