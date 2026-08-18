import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProposalById, deleteProposal } from '../utils/storage';
import { generatePptx } from '../utils/PptxRenderer';
import { ArrowLeft, Edit2, Download, Share2, Trash2 } from 'lucide-react';
import ProposalDocument from '../pdf/ProposalDocument';

const ProposalView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposal = async () => {
      setLoading(true);
      const data = await getProposalById(id);
      setProposal(data);
      setLoading(false);
    };
    fetchProposal();
  }, [id]);

  if (loading) {
    return <div style={{ padding: '40px', color: 'white', textAlign: 'center' }}>Loading proposal...</div>;
  }

  if (!proposal) {
    return (
      <div style={{ padding: '40px', color: 'white', textAlign: 'center' }}>
        <h2>Proposal not found.</h2>
        <button className="btn-secondary" onClick={() => navigate('/proposals')} style={{ marginTop: '20px' }}>Back to Proposals</button>
      </div>
    );
  }

  const handleEdit = () => {
    navigate('/new', { state: { editData: proposal } });
  };

  const handleDownload = async () => {
    try {
      await generatePptx(proposal);
    } catch (err) {
      console.error(err);
      alert('Failed to generate PPTX');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this proposal?')) {
      await deleteProposal(id);
      navigate('/proposals');
    }
  };

  const handleShare = () => {
    alert("Share functionality (e.g., email link) to be implemented.");
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* TOP BAR */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '16px 32px',
        backgroundColor: 'var(--color-navy)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => navigate('/proposals')} 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--color-muted-blue)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600 }}
          >
            <ArrowLeft size={16} /> Proposals
          </button>
          
          <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{proposal.proposalNumber}</span>
            <span style={{ color: 'var(--color-muted-blue)', fontSize: '14px' }}>{proposal.companyName || proposal.clientName}</span>
            <span style={{ 
              backgroundColor: 'rgba(0,194,168,0.1)', 
              color: 'var(--color-teal)', 
              padding: '2px 8px', 
              borderRadius: '12px', 
              fontSize: '12px', 
              fontWeight: 600 
            }}>
              Generated
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={handleEdit}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
          >
            <Edit2 size={16} /> Edit
          </button>
          <button 
            onClick={handleShare}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
          >
            <Share2 size={16} /> Share
          </button>
          <button 
            onClick={handleDownload}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--color-teal)', border: 'none', color: 'var(--color-navy)', fontWeight: 600, padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
          >
            <Download size={16} /> Download PPTX
          </button>
          <button 
            onClick={handleDelete}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid rgba(255,0,0,0.3)', color: '#ff4444', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', marginLeft: '12px' }}
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* CAROUSEL PREVIEW AREA */}
      <div style={{ 
        flex: 1, 
        backgroundColor: '#111', 
        overflowX: 'auto', 
        overflowY: 'hidden',
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 40px',
        gap: '40px'
      }}>
        <div style={{ transform: 'scale(0.35)', transformOrigin: 'left center', display: 'flex', gap: '60px' }}>
          <ProposalDocument formData={proposal} layout="carousel" />
        </div>
      </div>
    </div>
  );
};

export default ProposalView;
