import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Zap, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        backgroundColor: 'var(--color-navy)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '16px 0'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/logo.png" alt="Vykon Logo" style={{ height: '40px' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', color: 'var(--color-white)', lineHeight: 1 }}>VYKON</div>
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px', color: 'var(--color-orange)', letterSpacing: '2px', marginTop: '2px' }}>PROPOSAL STUDIO</div>
            </div>
          </Link>
          
          <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
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
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '16px', paddingLeft: '16px', borderLeft: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <span style={{ color: 'var(--color-muted-blue)', fontSize: '14px' }}>{user.email}</span>
                <button 
                  onClick={handleLogout}
                  style={{ background: 'none', border: 'none', color: 'var(--color-white)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
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
