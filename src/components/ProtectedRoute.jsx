import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    const CSS_SPINNER = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes pulseText {
        0%, 100% { opacity: 0.65; }
        50% { opacity: 1; }
      }
      @keyframes lockPulse {
        0%, 100% { transform: scale(1); opacity: 0.85; }
        50% { transform: scale(1.05); opacity: 1; }
      }
    `;

    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100vh', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#080808',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <style>{CSS_SPINNER}</style>

        {/* Ambient background glow */}
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,203,129,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }} />

        {/* Spinner & Lock Container */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
          {/* Animated Spinner Ring */}
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            border: '2px solid rgba(14,203,129,0.08)',
            borderTop: '2px solid #0ECB81',
            borderRight: '2px solid #F5A623',
            animation: 'spin 1.2s linear infinite',
          }} />

          {/* Secure Lock Icon in the center */}
          <div style={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'lockPulse 2s ease-in-out infinite'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0ECB81" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        </div>

        {/* Text Details */}
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <div style={{ 
            color: '#ffffff', 
            fontFamily: "'Outfit', sans-serif", 
            fontSize: '13px', 
            fontWeight: 600, 
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: 6,
            animation: 'pulseText 1.5s ease-in-out infinite'
          }}>
            Loading Secure Session
          </div>
          <div style={{ 
            color: '#888888', 
            fontFamily: "'Outfit', sans-serif", 
            fontSize: '10px', 
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontWeight: 400
          }}>
            Verifying Encrypted Credentials...
          </div>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
