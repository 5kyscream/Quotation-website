import React, { useState, useEffect } from 'react';
import { getProposals, deleteProposal } from '../utils/storage';
import { Trash2, Download } from 'lucide-react';

const PastProposals = () => {
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    setProposals(getProposals());
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this proposal?')) {
      deleteProposal(id);
      setProposals(getProposals());
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <h1 className="subheading" style={{ fontSize: '32px' }}>Past Proposals</h1>
      </div>

      {proposals.length === 0 ? (
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
                <tr key={prop.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <td style={{ padding: '16px', color: 'var(--color-white)' }}>{prop.proposalNumber}</td>
                  <td style={{ padding: '16px', color: 'var(--color-white)' }}>{prop.clientName}</td>
                  <td style={{ padding: '16px', color: 'var(--color-teal)', fontWeight: 600 }}>{prop.capacity}</td>
                  <td style={{ padding: '16px', color: 'var(--color-muted-blue)' }}>{prop.date}</td>
                  <td style={{ padding: '16px', display: 'flex', gap: '12px' }}>
                    <button 
                      onClick={() => alert('View/Download functionality will be available from the creation page.')}
                      style={{ background: 'none', border: 'none', color: 'var(--color-orange)', cursor: 'pointer' }}
                      title="Download PDF"
                    >
                      <Download size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(prop.id)}
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
