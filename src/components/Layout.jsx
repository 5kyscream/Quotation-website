import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Zap } from 'lucide-react';

const Layout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        backgroundColor: 'var(--color-navy)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '16px 0'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Placeholder for Logo */}
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'var(--color-orange)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-white)'
            }}>
              <Zap size={24} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', color: 'var(--color-white)', lineHeight: 1 }}>VYKON</div>
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px', color: 'var(--color-orange)', letterSpacing: '2px', marginTop: '2px' }}>PROPOSAL STUDIO</div>
            </div>
          </Link>
          
          <nav style={{ display: 'flex', gap: '24px' }}>
            <Link to="/proposals" style={{
              color: 'var(--color-white)',
              textDecoration: 'none',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Past Proposals
            </Link>
            <Link to="/new" className="btn-primary" style={{ textDecoration: 'none' }}>
              New Proposal
            </Link>
          </nav>
        </div>
      </header>
      
      <main style={{ flex: 1, padding: '40px 0' }} className="bg-grid">
        <div className="container">
          <Outlet />
        </div>
      </main>
      
      <footer style={{
        backgroundColor: 'var(--color-navy)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '24px 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-muted-blue)', fontSize: '12px' }}>
            © {new Date().getFullYear()} Vykon Indus Technologies. Internal Use Only.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
