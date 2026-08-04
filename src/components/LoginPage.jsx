import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = ({ onLogin }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSuccess = (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      const payload = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      const email = (payload.email || '').toLowerCase();
      if (!email.endsWith('@apnibus.com')) {
        setError('Access denied. Only @apnibus.com accounts are allowed.\nYou tried: ' + email);
        setLoading(false);
        return;
      }
      onLogin({ email, name: payload.name || email, picture: payload.picture || '', given_name: payload.given_name || '' });
    } catch (e) {
      setError('Login failed — could not verify credentials. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0f172a 50%, #0a0f1e 100%)',
      fontFamily: '"Inter", system-ui, sans-serif', padding: 20, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 15% 60%, rgba(37,99,235,0.12) 0%, transparent 55%), radial-gradient(ellipse at 85% 20%, rgba(16,185,129,0.10) 0%, transparent 55%), radial-gradient(ellipse at 50% 90%, rgba(139,92,246,0.08) 0%, transparent 55%)'
      }} />
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.03,
        backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />
      <div style={{
        position: 'relative', zIndex: 1,
        background: 'rgba(15,23,42,0.88)', backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24,
        padding: '52px 44px', width: '100%', maxWidth: 420, textAlign: 'center',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
      }}>
        <div style={{ marginBottom: 24 }}>
          <img src="/logo.png" alt="Apnibus" style={{ height: 56, objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(37,99,235,0.3))' }} onError={e => { e.target.style.display='none'; }} />
        </div>
        <h1 style={{ color: '#f8fafc', fontSize: 26, fontWeight: 900, margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
          Field Intelligence
        </h1>
        <p style={{ color: '#475569', fontSize: 12, margin: '0 0 8px 0', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Apnibus Internal Dashboard
        </p>
        <div style={{ width: 48, height: 3, margin: '20px auto 28px', background: 'linear-gradient(90deg, #2563eb, #10b981)', borderRadius: 4 }} />
        <p style={{ color: '#64748b', fontSize: 13, marginBottom: 28, lineHeight: 1.6 }}>
          Sign in with your <span style={{ color: '#93c5fd', fontWeight: 700, background: 'rgba(37,99,235,0.12)', padding: '1px 6px', borderRadius: 4 }}>@apnibus.com</span> Google account
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#10b981', fontSize: 14, fontWeight: 600, padding: '12px 24px', background: 'rgba(16,185,129,0.1)', borderRadius: 8, border: '1px solid rgba(16,185,129,0.2)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'loginSpin 0.8s linear infinite' }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Verifying access...
            </div>
          ) : (
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => setError('Google sign-in failed. Please try again.')}
              theme="filled_black" size="large" text="signin_with_google" shape="rectangular" logo_alignment="left" width="280"
            />
          )}
        </div>
        {error && (
          <div style={{ marginTop: 20, padding: '14px 16px', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: 12, color: '#f87171', fontSize: 12, fontWeight: 500, lineHeight: 1.6, textAlign: 'left', whiteSpace: 'pre-line' }}>
            {error}
          </div>
        )}
        <div style={{ marginTop: 36, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ color: '#334155', fontSize: 11, margin: 0 }}>Restricted to Apnibus team only</p>
        </div>
      </div>
      <style>{'.loginSpin{animation:loginSpin 0.8s linear infinite} @keyframes loginSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}'}</style>
    </div>
  );
};

export default LoginPage;
