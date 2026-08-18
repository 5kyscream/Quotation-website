import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProposalDocument from '../pdf/ProposalDocument';
import { generatePptx } from '../utils/PptxRenderer';
import { ArrowLeft, Download, Check } from 'lucide-react';
import { saveProposal } from '../utils/storage';

const ReviewExport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData;
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  if (!formData) {
    return (
      <div style={{ padding: '40px', color: 'white' }}>
        <h2>No proposal data found.</h2>
        <button className="btn-secondary" onClick={() => navigate('/new')} style={{ marginTop: '20px' }}>Go Back</button>
      </div>
    );
  }

  const totalPages = formData.isLoan ? 10 : 9;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Create PPTX
      await generatePptx(formData);
      
      // Save to local storage for "Past Proposals" dashboard
      await saveProposal({
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      });
      
      setGenerated(true);
    } catch (error) {
      console.error("Failed to generate:", error);
      alert("Failed to generate proposal. See console.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <button className="btn-secondary" onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', padding: '0 16px 0 0' }}>
            <ArrowLeft size={16} /> Back to proposals
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h1 className="headline-1" style={{ fontSize: '32px', marginBottom: '8px' }}>Review every page <span className="headline-2">before you generate</span></h1>
        <p style={{ color: 'var(--color-muted-blue)' }}>Review the final document. Hit Generate Proposal in the footer when the deck looks right.</p>
      </div>

      {/* The Carousel Container */}
      <div style={{ 
        flex: 1, 
        overflowX: 'auto', 
        overflowY: 'hidden',
        display: 'flex', 
        alignItems: 'center', 
        gap: '40px',
        paddingBottom: '24px',
        width: '100%'
      }}>
        <div style={{ transform: 'scale(0.25)', transformOrigin: 'left center', display: 'flex', gap: '100px' }}>
          <ProposalDocument formData={formData} layout="carousel" />
        </div>
      </div>

      <div style={{ 
        borderTop: '1px solid rgba(255,255,255,0.1)', 
        paddingTop: '24px', 
        marginTop: 'auto',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <div>
          <p style={{ color: 'var(--color-muted-blue)', fontSize: '14px' }}>
            {totalPages} Pages • {formData.companyName} • {formData.capacity} kWp
          </p>
        </div>
        <button 
          className="btn-primary" 
          onClick={handleGenerate}
          disabled={isGenerating || generated}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 32px', fontSize: '16px' }}
        >
          {isGenerating ? (
            'Generating PPTX...'
          ) : generated ? (
            <><Check size={20} /> Download Complete</>
          ) : (
            <><Download size={20} /> Generate Proposal</>
          )}
        </button>
      </div>

    </div>
  );
};

export default ReviewExport;
