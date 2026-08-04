import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Dashboard Error Boundary Caught:", error, errorInfo);
    try { localStorage.removeItem('apnibus_dashboard_data'); } catch (_) {}
  }

  handleReset = () => {
    try {
      localStorage.removeItem('apnibus_dashboard_data');
      localStorage.clear();
    } catch (_) {}
    window.location.href = window.location.origin + window.location.pathname;
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', background: '#f8faff',
          fontFamily: 'Inter, sans-serif', padding: 20, textAlign: 'center'
        }}>
          <div style={{
            background: '#ffffff', border: '1px solid #e2e8f0', padding: 32,
            borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', maxWidth: 480
          }}>
            <h2 style={{ color: '#0f172a', marginBottom: 8, fontSize: 20 }}>Dashboard Reset Needed</h2>
            <p style={{ color: '#64748b', fontSize: 13, marginBottom: 20, lineHeight: 1.5 }}>
              An issue was detected with the saved session data. Click below to restore default dashboard settings.
            </p>
            <button
              onClick={this.handleReset}
              style={{
                background: '#2563eb', color: '#ffffff', border: 'none',
                padding: '10px 20px', borderRadius: 8, fontSize: 13,
                fontWeight: 600, cursor: 'pointer'
              }}
            >
              Reset &amp; Reload Dashboard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

try {
  localStorage.removeItem('apnibus_dashboard_data');
} catch (_e) {}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
