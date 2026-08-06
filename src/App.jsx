import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Sidebar from './components/Sidebar';
import LoginPage from './components/LoginPage';
import ExecutiveOverview from './components/ExecutiveOverview';
import ManagerPerformance from './components/ManagerPerformance';
import CandidateLeaderboard from './components/CandidateLeaderboard';
import LiveVisitMap from './components/LiveVisitMap';
import ProductivityScore from './components/ProductivityScore';
import VisitTable from './components/VisitTable';
import SmartInsights from './components/SmartInsights';
import DataConfigModal from './components/DataConfigModal';
import RedAlertDashboard from './components/RedAlertDashboard';
import ManagerTeamDashboard from './components/ManagerTeamDashboard';
import IndividualBDDashboard from './components/IndividualBDDashboard';
import OnboardingPayments from './components/OnboardingPayments';
import { Menu, Sun, Moon, RefreshCw } from 'lucide-react';
import { getData, fetchLiveData } from './data/dataService';

const GOOGLE_CLIENT_ID = '912392915264-fi7j1e93plf2qp338q2b4vca4fp6lm2j.apps.googleusercontent.com';

// Email -> manager param mapping
const EMAIL_TO_MANAGER = {
  'rajnish.kumar@apnibus.com':   'rajnish',
  'tarun.kumar@apnibus.com':     'tarun',
  'sonu.mishra@apnibus.com':     'sonu',
  'rajwinder.singh@apnibus.com': 'rajwinder',
};


const MGR_EMAIL_MAP = {
  201: 'rajnish.kumar@apnibus.com',
  553: 'tarun.kumar@apnibus.com',
  552: 'sonu.mishra@apnibus.com',
  554: 'rajwinder.singh@apnibus.com'
};

const App = () => {
  // Parse manager URL query parameter or hash route (e.g. ?manager=rajnish or ?manager=tarun or ?manager=sonu or ?manager=rajwinder)
  const getManagerParam = () => {
    const params = new URLSearchParams(window.location.search);
    const mgrParam = params.get('manager')?.toLowerCase();
    if (['rajnish', 'tarun', 'sonu', 'rajwinder'].includes(mgrParam)) return mgrParam;
    return null;
  };

  const [currentMgrParam, setCurrentMgrParam] = useState(getManagerParam);

  const getInitialTab = (param) => {
    if (param === 'rajnish')   return 'mgr_rajnish';
    if (param === 'tarun')     return 'mgr_tarun';
    if (param === 'sonu')      return 'mgr_sonu';
    if (param === 'rajwinder') return 'mgr_rajwinder';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState(() => getInitialTab(getManagerParam()));
  const [theme, setTheme] = useState('light');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);
  const [selectedCandidateName, setSelectedCandidateName] = useState('');
  const [fetchError, setFetchError] = useState(null);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // ── Auth state (persisted in localStorage) ──
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('apnibus_user') || 'null'); } catch { return null; }
  });

  const handleLogin = useCallback(async (userData) => {
    setUser(userData);
    localStorage.setItem('apnibus_user', JSON.stringify(userData));
    if (typeof window !== 'undefined' && window.__apnibus_diagnostics) {
      window.__apnibus_diagnostics.fetchStatus = 'Fetching';
      window.__apnibus_diagnostics.error = null;
    }
    try {
      await fetchLiveData();
      handleDataChanged();
    } catch (err) {
      console.error('Login data refresh failed:', err);
    }
    // Auto-route manager to their own portal
    const mgrParam = EMAIL_TO_MANAGER[userData.email];
    if (mgrParam) {
      setActiveTab(`mgr_${mgrParam}`);
      setCurrentMgrParam(mgrParam);
    } else {
      setActiveTab('overview');
    }
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('apnibus_user');
    setActiveTab('overview');
    setCurrentMgrParam(null);
  }, []);

  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const refreshTimerRef = useRef(null);
  const countupRef = useRef(null);

  const allData = useMemo(() => getData(), [dataVersion]);

  // ── Refresh handler: clear cache + re-fetch all live CSVs ──
  const handleManualRefresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    setFetchError(null);
    try {
      // Clear stale localStorage cache so we always get genuinely fresh data
      try { localStorage.removeItem('apnibus_dashboard_data'); } catch (_) {}
      await fetchLiveData();
      handleDataChanged();
      setLastRefreshed(new Date());
      setSecondsAgo(0);
    } catch (err) {
      console.error('Refresh failed:', err);
      setFetchError(err.message || String(err));
    } finally {
      setRefreshing(false);
    }
  }, [refreshing]);

  // Fetch live CSV data on mount — show cached data immediately, refresh silently in background
  useEffect(() => {
    let cancelled = false;
    const initLiveFetch = async () => {
      // Show whatever is in cache right away (may be stale but better than blank)
      handleDataChanged();
      try {
        await fetchLiveData();
        if (!cancelled) {
          handleDataChanged();
          setLastRefreshed(new Date());
          setFetchError(null); // clear any old error on success
        }
      } catch (err) {
        if (!cancelled) {
          console.warn("Background fetch failed, using cached data:", err.message);
          // Only show error if we have no visits at all
          const d = getData ? getData() : null;
          const hasData = d && d.visits && d.visits.length > 0;
          if (!hasData) setFetchError(err.message || String(err));
        }
      }
    };
    initLiveFetch();
    return () => { cancelled = true; }; // React StrictMode cleanup
  }, []);

  // Auto-close mobile sidebar when switching tabs
  useEffect(() => {
    setSidebarOpen(false);
  }, [activeTab]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    refreshTimerRef.current = setInterval(() => {
      handleManualRefresh();
    }, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(refreshTimerRef.current);
  }, [handleManualRefresh]);

  // Live "X ago" counter updates every second
  useEffect(() => {
    countupRef.current = setInterval(() => {
      if (lastRefreshed) {
        setSecondsAgo(Math.floor((Date.now() - lastRefreshed.getTime()) / 1000));
      }
    }, 1000);
    return () => clearInterval(countupRef.current);
  }, [lastRefreshed]);

  const formatAgo = (secs) => {
    if (secs < 60) return `${secs}s ago`;
    if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
    return `${Math.floor(secs / 3600)}h ago`;
  };

  // Derived Manager ID and Email based on active URL parameter
  const activeManagerId = useMemo(() => {
    const mgrParam = getManagerParam() || (activeTab.startsWith('mgr_') ? activeTab.replace('mgr_', '') : null);
    if (mgrParam === 'rajnish')   return 201;
    if (mgrParam === 'tarun')     return 553;
    if (mgrParam === 'sonu')      return 552;
    if (mgrParam === 'rajwinder') return 554;
    return null;
  }, [activeTab]);

  const activeManagerEmail = useMemo(() => {
    if (!activeManagerId) return null;
    return MGR_EMAIL_MAP[activeManagerId] || null;
  }, [activeManagerId]);

  // Shared Global Filters Object for child views
  const globalFilters = useMemo(() => ({
    managerId: activeManagerId,
    managerEmail: activeManagerEmail
  }), [activeManagerId, activeManagerEmail]);

  // Sync state on browser URL navigation (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const param = getManagerParam();
      setCurrentMgrParam(param);
      setActiveTab(getInitialTab(param));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
 
  // Update current manager param state when activeTab changes
  useEffect(() => {
    if (activeTab === 'mgr_rajnish') setCurrentMgrParam('rajnish');
    else if (activeTab === 'mgr_tarun') setCurrentMgrParam('tarun');
    else if (activeTab === 'mgr_sonu') setCurrentMgrParam('sonu');
    else if (activeTab === 'overview') setCurrentMgrParam(null);
  }, [activeTab]);

  // Apply theme class to document element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light-theme', 'dark-theme');
    root.classList.add(`${theme}-theme`);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  const handleDataChanged = () => setDataVersion(v => v + 1);

  /* ── Tab Router ── */
  const renderContent = () => {
    // If URL contains ?manager=..., strictly lock view to that manager's portal
    const urlMgrParam = getManagerParam();
    if (urlMgrParam === 'rajnish')   return <ManagerTeamDashboard managerEmail="rajnish.kumar@apnibus.com" theme={theme} />;
    if (urlMgrParam === 'tarun')     return <ManagerTeamDashboard managerEmail="tarun.kumar@apnibus.com" theme={theme} />;
    if (urlMgrParam === 'sonu')      return <ManagerTeamDashboard managerEmail="sonu.mishra@apnibus.com" theme={theme} />;
    if (urlMgrParam === 'rajwinder') return <ManagerTeamDashboard managerEmail="rajwinder.singh@apnibus.com" theme={theme} />;

    switch (activeTab) {
      case 'overview':
        return <ExecutiveOverview filters={globalFilters} theme={theme} onNavigate={setActiveTab} />;

      case 'onboarding':
        return <OnboardingPayments theme={theme} />;

      // 👤 Dedicated Manager Dashboards
      case 'mgr_rajnish':
        return <ManagerTeamDashboard managerEmail="rajnish.kumar@apnibus.com" theme={theme} />;

      case 'mgr_tarun':
        return <ManagerTeamDashboard managerEmail="tarun.kumar@apnibus.com" theme={theme} />;

      case 'mgr_sonu':
        return <ManagerTeamDashboard managerEmail="sonu.mishra@apnibus.com" theme={theme} />;

      case 'mgr_rajwinder':
        return <ManagerTeamDashboard managerEmail="rajwinder.singh@apnibus.com" theme={theme} />;

      case 'managers':
        return <ManagerPerformance />;

      case 'candidates':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {selectedCandidateName ? (
              <IndividualBDDashboard
                bdName={selectedCandidateName}
                onBack={() => setSelectedCandidateName('')}
                theme={theme}
              />
            ) : (
              <CandidateLeaderboard
                selectedManagerId={activeManagerId}
                setSelectedManagerId={() => {}}
                onSelectCandidate={setSelectedCandidateName}
                selectedCandidateName={selectedCandidateName}
              />
            )}
          </div>
        );

      case 'map':
        return (
          <LiveVisitMap
            globalFilters={globalFilters}
            theme={theme}
            onSelectCandidate={name => { setSelectedCandidateName(name); setActiveTab('candidates'); }}
          />
        );

      case 'table':
        return <VisitTable globalFilters={globalFilters} />;

      case 'insights':
        return <SmartInsights filters={globalFilters} />;

      case 'alerts':
        return <RedAlertDashboard globalFilters={globalFilters} />;

      default:
        return <ExecutiveOverview filters={globalFilters} theme={theme} onNavigate={setActiveTab} />;
    }
  };

  // Show login page if not authenticated
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className={`app-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Mobile Top Header Bar */}
      <header className="mobile-header">
        <button className="mobile-header-btn" onClick={() => setSidebarOpen(true)}>
          <Menu size={20} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/logo.png" alt="ApniBus Logo" style={{ height: 26, width: 'auto', objectFit: 'contain' }} />
          <span style={{ fontFamily: 'var(--font-header)', fontWeight: 800, fontSize: 15, color: 'var(--text-heading)' }}>ApniBus</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            className="mobile-header-btn"
            onClick={handleManualRefresh}
            disabled={refreshing}
            title="Refresh live data"
            style={{ color: refreshing ? '#10b981' : undefined }}
          >
            <RefreshCw size={17} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          </button>
          <button className="mobile-header-btn" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Backdrop Overlay */}
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenConfig={() => setIsConfigOpen(true)}
        currentManagerParam={currentMgrParam}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        onLogout={handleLogout}
      />
      <main className="main-content">
        {fetchError && (
          <div style={{
            background: 'var(--status-rejected-bg, #fee2e2)',
            color: 'var(--status-rejected-text, #991b1b)',
            padding: '12px 16px',
            borderRadius: 8,
            marginBottom: 16,
            border: '1px solid #fca5a5',
            fontFamily: 'sans-serif',
            fontSize: 14,
            fontWeight: 500,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>⚠️ Live Data Fetch Error: {fetchError}</span>
            <button 
              onClick={() => setFetchError(null)} 
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: 16,
                padding: '0 4px'
              }}
            >
              ×
            </button>
          </div>
        )}
        {renderContent()}
      </main>
      <DataConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onDataChanged={handleDataChanged}
      />

      {/* Floating Refresh Button */}
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
        <button
          onClick={handleManualRefresh}
          disabled={refreshing}
          title="Refresh all live data from Metabase"
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: refreshing
              ? 'linear-gradient(135deg, #059669, #10b981)'
              : 'linear-gradient(135deg, #1e293b, #334155)',
            color: '#f8fafc',
            border: 'none',
            padding: '10px 16px',
            borderRadius: 50,
            cursor: refreshing ? 'not-allowed' : 'pointer',
            fontSize: 13,
            fontWeight: 700,
            fontFamily: 'var(--font-body)',
            boxShadow: refreshing
              ? '0 4px 20px rgba(16,185,129,0.4)'
              : '0 4px 14px rgba(0,0,0,0.25)',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap',
            letterSpacing: '0.01em'
          }}
        >
          <RefreshCw
            size={15}
            style={{
              animation: refreshing ? 'spin 0.8s linear infinite' : 'none',
              flexShrink: 0
            }}
          />
          {refreshing ? 'Refreshing…' : 'Refresh Data'}
        </button>
        {lastRefreshed && !refreshing && (
          <div style={{
            background: 'rgba(15,23,42,0.82)',
            color: '#94a3b8',
            fontSize: 11,
            fontWeight: 600,
            padding: '4px 12px',
            borderRadius: 20,
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            ✓ Updated {formatAgo(secondsAgo)} · auto-refresh in {Math.max(0, 300 - secondsAgo % 300)}s
          </div>
        )}
      </div>
    </div>
  );
};

const AppWithAuth = () => (
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);

export default AppWithAuth;
