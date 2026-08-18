import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProposals, deleteProposal } from '../utils/storage';
import { Trash2, Download, Eye, Loader } from 'lucide-react';
import { generatePptx } from '../utils/PptxRenderer';

const PastProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProposals = async () => {
    setLoading(true);
    const data = await getProposals();
    setProposals(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this proposal?')) {
      await deleteProposal(id);
      fetchProposals();
    }
  };

  const handleDownload = async (prop, e) => {
    e.stopPropagation();
    try {
      await generatePptx(prop);
    } catch (err) {
      console.error(err);
      alert('Failed to generate PPTX');
    }
  };

  const handleView = (id) => {
    navigate(`/proposals/${id}`);
  };

  return (
    <div>
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="subheading" style={{ fontSize: '32px' }}>Past Proposals</h1>
        {loading && <Loader className="animate-spin" color="var(--color-teal)" />}
      </div>

      {loading && proposals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <p style={{ color: 'var(--color-muted-blue)' }}>Loading proposals...</p>
        </div>
      ) : proposals.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px', 
          backgroundColor: 'var(--color-navy)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <p style={{ color: 'var(--color-muted-blue)' }}>No past proposals found.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-navy)', borderLeft: '3px solid var(--color-teal)' }}>
                <th style={{ padding: '16px', fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--color-white)', fontSize: '14px' }}>Proposal No.</th>
                <th style={{ padding: '16px', fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--color-white)', fontSize: '14px' }}>Client Name</th>
                <th style={{ padding: '16px', fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--color-white)', fontSize: '14px' }}>Capacity (kWp)</th>
                <th style={{ padding: '16px', fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--color-white)', fontSize: '14px' }}>Date</th>
                <th style={{ padding: '16px', fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--color-white)', fontSize: '14px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((prop) => (
                <tr 
                  key={prop.id} 
                  style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)', cursor: 'pointer' }}
                  onClick={() => handleView(prop.id)}
                  className="table-row-hover"
                >
                  <td style={{ padding: '16px', color: 'var(--color-white)' }}>{prop.proposalNumber}</td>
                  <td style={{ padding: '16px', color: 'var(--color-white)' }}>{prop.companyName || prop.clientName}</td>
                  <td style={{ padding: '16px', color: 'var(--color-teal)', fontWeight: 600 }}>{prop.capacity}</td>
                  <td style={{ padding: '16px', color: 'var(--color-muted-blue)' }}>{prop.date}</td>
                  <td style={{ padding: '16px', display: 'flex', gap: '12px' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleView(prop.id); }}
                      style={{ background: 'none', border: 'none', color: 'var(--color-teal)', cursor: 'pointer' }}
                      title="View Proposal"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={(e) => handleDownload(prop, e)}
                      style={{ background: 'none', border: 'none', color: 'var(--color-orange)', cursor: 'pointer' }}
                      title="Download PPTX"
                    >
                      <Download size={18} />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(prop.id, e)}
                      style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PastProposals;
