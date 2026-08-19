import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Zap, Loader, Eye, EyeOff, Sun, Moon } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLightMode, setIsLightMode] = useState(document.body.classList.contains('light-mode'));
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    if (!isLogin && !email.endsWith('@vykonindustechnologies.com')) {
      setError('Registration is restricted to @vykonindustechnologies.com email addresses only.');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate('/');
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        alert('Account created! You can now log in.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-midnight)',
      padding: '20px',
      position: 'relative'
    }} className="bg-grid">
      
      <button 
        type="button"
        onClick={() => {
          const newMode = !isLightMode;
          setIsLightMode(newMode);
          if (newMode) document.body.classList.add('light-mode');
          else document.body.classList.remove('light-mode');
        }} 
        style={{ 
          position: 'absolute',
          top: '24px',
          right: '24px',
          background: 'var(--color-bg-subtle)', 
          border: '1px solid var(--color-border-medium)', 
          color: 'var(--color-white)', 
          padding: '8px', 
          borderRadius: '4px', 
          cursor: 'pointer', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 10
        }}
        title={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
      >
        {isLightMode ? <Moon size={20} /> : <Sun size={20} />}
      </button>
      
      <div style={{
        backgroundColor: 'var(--color-navy)',
        padding: '40px',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        zIndex: 1
      }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <img src={isLightMode ? "/logo-dark.png" : "/logo.png"} alt="Vykon Logo" style={{ height: '64px', marginBottom: '16px' }} />
          <h1 className="subheading" style={{ fontSize: '24px', margin: 0, textAlign: 'center' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p style={{ color: 'var(--color-muted-blue)', marginTop: '8px', fontSize: '14px' }}>
            {isLogin ? 'Enter your details to access your proposals.' : 'Sign up to start creating proposals.'}
          </p>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: 'rgba(255, 68, 68, 0.1)', 
            border: '1px solid #ff4444', 
            color: '#ff4444', 
            padding: '12px', 
            borderRadius: '8px',
            marginBottom: '24px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{ 
            backgroundColor: 'rgba(76, 175, 80, 0.1)', 
            border: '1px solid #4CAF50', 
            color: '#4CAF50', 
            padding: '12px', 
            borderRadius: '8px',
            marginBottom: '24px',
            fontSize: '14px'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@company.com"
              style={{ width: '100%', boxSizing: 'border-box' }}
              className="form-input-light"
            />
          </div>
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ margin: 0 }}>Password</label>
              {isLogin && (
                <button
                  type="button"
                  onClick={async () => {
                    if (!email) {
                      setError('Please enter your email address first to reset password.');
                      return;
                    }
                    setLoading(true);
                    setError(null);
                    setMessage(null);
                    try {
                      const { error } = await resetPassword(email);
                      if (error) throw error;
                      setMessage('Password reset link sent! Check your email.');
                    } catch (err) {
                      setError(err.message);
                    } finally {
                      setLoading(false);
                    }
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-teal)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{ width: '100%', boxSizing: 'border-box', paddingRight: '40px' }}
                className="form-input-light"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-muted-blue)', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          {!isLogin && (
            <div className="input-group">
              <label>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{ width: '100%', boxSizing: 'border-box', paddingRight: '40px' }}
                  className="form-input-light"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-muted-blue)', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}
          
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
            {loading ? <Loader className="animate-spin" size={20} /> : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border-medium)' }}></div>
          <span style={{ padding: '0 12px', color: 'var(--color-muted-blue)', fontSize: '14px', fontWeight: 500 }}>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border-medium)' }}></div>
        </div>

        <button 
          onClick={async () => {
            setLoading(true);
            try {
              const { error } = await signInWithGoogle();
              if (error) throw error;
            } catch (err) {
              setError(err.message);
              setLoading(false);
            }
          }}
          className="btn-secondary" 
          style={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '12px',
            backgroundColor: 'var(--color-bg-subtle)',
            border: '1px solid var(--color-border-medium)',
            color: 'var(--color-white)',
            padding: '12px',
            borderRadius: '8px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          disabled={loading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--color-teal)', 
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: 'var(--font-body)',
              fontWeight: 600
            }}
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Auth;
