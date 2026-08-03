import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
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
import { Menu, Sun, Moon } from 'lucide-react';
import { getData, fetchLiveData } from './data/dataService';

const MGR_EMAIL_MAP = {
  201: 'rajnish.kumar@apnibus.com',
  553: 'tarun.kumar@apnibus.com',
  552: 'sonu.mishra@apnibus.com'
};

const App = () => {
  // Parse manager URL query parameter or hash route (e.g. ?manager=rajnish or ?manager=tarun or ?manager=sonu)
  const getManagerParam = () => {
    const params = new URLSearchParams(window.location.search);
    const mgrParam = params.get('manager')?.toLowerCase();
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const target = mgrParam || hash;
    if (['rajnish', 'tarun', 'sonu'].includes(target)) return target;
    return null;
  };

  const [currentMgrParam, setCurrentMgrParam] = useState(getManagerParam);

  const getInitialTab = (param) => {
    if (param === 'rajnish')   return 'mgr_rajnish';
    if (param === 'tarun')     return 'mgr_tarun';
    if (param === 'sonu')      return 'mgr_sonu';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState(() => getInitialTab(getManagerParam()));
  const [theme, setTheme] = useState('light');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);
  const [selectedCandidateName, setSelectedCandidateName] = useState('');
  const [fetchError, setFetchError] = useState(null);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);

  const allData = useMemo(() => getData(), [dataVersion]);

  // Derived Manager ID and Email based on active URL parameter
  const activeManagerId = useMemo(() => {
    const mgrParam = getManagerParam() || (activeTab.startsWith('mgr_') ? activeTab.replace('mgr_', '') : null);
    if (mgrParam === 'rajnish')   return 201;
    if (mgrParam === 'tarun')     return 553;
    if (mgrParam === 'sonu')      return 552;
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

  // ─── Fetch live CSV data on mount ───
  useEffect(() => {
    const initLiveFetch = async () => {
      try {
        await fetchLiveData();
        handleDataChanged();
      } catch (err) {
        console.error("Mount live fetch failed:", err);
        setFetchError(err.message || String(err));
      }
    };
    initLiveFetch();
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
    switch (activeTab) {
      case 'overview':
        return <ExecutiveOverview filters={globalFilters} theme={theme} onNavigate={setActiveTab} />;

      // 👤 Isolated Dedicated Manager Dashboards
      case 'mgr_rajnish':
        return <ManagerTeamDashboard managerEmail="rajnish.kumar@apnibus.com" theme={theme} />;

      case 'mgr_tarun':
        return <ManagerTeamDashboard managerEmail="tarun.kumar@apnibus.com" theme={theme} />;

      case 'mgr_sonu':
        return <ManagerTeamDashboard managerEmail="sonu.mishra@apnibus.com" theme={theme} />;

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

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auto-close mobile sidebar when switching tabs
  useEffect(() => {
    setSidebarOpen(false);
  }, [activeTab]);

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
        <button className="mobile-header-btn" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
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

      {/* Floating Diagnostics Button & Panel */}
      <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999, fontFamily: 'monospace' }}>
        <button
          onClick={() => setDiagnosticsOpen(prev => !prev)}
          style={{
            background: '#1e293b',
            color: '#f8fafc',
            border: 'none',
            padding: '8px 12px',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 12,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          🔧 Diagnostics Console
        </button>
        {diagnosticsOpen && (() => {
          const diag = window.__apnibus_diagnostics || {};
          return (
            <div style={{
              position: 'absolute',
              bottom: 40,
              right: 0,
              background: '#0f172a',
              color: '#38bdf8',
              border: '1px solid #334155',
              borderRadius: 8,
              padding: 16,
              width: 320,
              maxHeight: 400,
              overflowY: 'auto',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3)',
              fontSize: 11,
              lineHeight: 1.5
            }}>
              <h3 style={{ margin: '0 0 8px 0', borderBottom: '1px solid #334155', paddingBottom: 4, color: '#f8fafc' }}>
                System Diagnostics
              </h3>
              <div><strong>Status:</strong> <span style={{ color: diag.fetchStatus === 'Success' ? '#4ade80' : diag.fetchStatus === 'Failed' ? '#f87171' : '#fbbf24' }}>{diag.fetchStatus}</span></div>
              <div><strong>System Time:</strong> {new Date().toISOString()}</div>
              <div><strong>System Date:</strong> {diag.systemTodayStr}</div>
              <div><strong>Today String:</strong> {diag.DYNAMIC_TODAY_DATE}</div>
              <div><strong>MTD Month:</strong> {diag.DYNAMIC_MTD_MONTH}</div>
              <div style={{ margin: '8px 0', borderBottom: '1px solid #1e293b' }} />
              <div><strong>Onboarding CSV Rows:</strong> {diag.onboardingCount}</div>
              <div><strong>Sales CSV Rows:</strong> {diag.salesCount}</div>
              <div><strong>Visits CSV Rows:</strong> {diag.visitsCount}</div>
              <div><strong>Tracked Candidates:</strong> {diag.MASTER_CANDIDATES_COUNT}</div>
              <div style={{ margin: '8px 0', borderBottom: '1px solid #1e293b' }} />
              <div><strong>Last Updated:</strong> {diag.lastUpdated || 'Never'}</div>
              {diag.error && (
                <div style={{ color: '#f87171', marginTop: 8, wordBreak: 'break-all' }}>
                  <strong>Error:</strong> {diag.error}
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default App;
