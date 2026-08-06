import React from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import { ArrowRight, FileText } from 'lucide-react';

const Dashboard = () => {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px', position: 'relative' }}>
        <div className="bg-diagonal-teal" style={{ top: '-50px', right: '10%' }}></div>
        <h1 className="headline-1" style={{ fontSize: '72px', marginBottom: '16px' }}>
          Vykon <span className="headline-2">Proposal Studio</span>
        </h1>
        <p style={{ color: 'var(--color-muted-blue)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
          Generate professional, fully branded solar proposals in minutes. 
          Built for the Vykon sales team.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '60px' }}>
        <StatCard value="44+" unit="MW" label="Total Capacity" color="var(--color-orange)" />
        <StatCard value="21+" label="Active Sites" color="var(--color-teal)" />
        <StatCard value="180" unit="kWp" label="Max Single Site" color="var(--color-white)" />
      </div>

      <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
        <Link to="/new" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 32px', fontSize: '16px', textDecoration: 'none' }}>
          Create New Proposal <ArrowRight size={20} />
        </Link>
        <Link to="/proposals" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 32px', fontSize: '16px', textDecoration: 'none' }}>
          <FileText size={20} /> View Past Proposals
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
