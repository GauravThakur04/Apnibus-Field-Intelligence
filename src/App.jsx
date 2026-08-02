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

import { getData, fetchLiveData } from './data/dataService';

const MGR_EMAIL_MAP = {
  201: 'rajnish.kumar@apnibus.com',
  553: 'tarun.kumar@apnibus.com',
  366: 'sonu.mishra@apnibus.com',
  554: 'rajwinder.singh@apnibus.com'
};

const App = () => {
  // Parse manager URL query parameter or hash route (e.g. ?manager=rajnish or ?manager=tarun or ?manager=sonu or ?manager=rajwinder)
  const getManagerParam = () => {
    const params = new URLSearchParams(window.location.search);
    const mgrParam = params.get('manager')?.toLowerCase();
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const target = mgrParam || hash;
    if (['rajnish', 'tarun', 'sonu', 'rajwinder'].includes(target)) return target;
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

  const allData = useMemo(() => getData(), [dataVersion]);

  // Derived Manager ID and Email based on active URL parameter
  const activeManagerId = useMemo(() => {
    const mgrParam = getManagerParam() || (activeTab.startsWith('mgr_') ? activeTab.replace('mgr_', '') : null);
    if (mgrParam === 'rajnish')   return 201;
    if (mgrParam === 'tarun')     return 553;
    if (mgrParam === 'sonu')      return 366;
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

  // ─── Fetch live CSV data on mount ───
  useEffect(() => {
    const initLiveFetch = async () => {
      try {
        await fetchLiveData();
        handleDataChanged();
      } catch (err) {
        console.error("Mount live fetch failed:", err);
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

  return (
    <div className="app-container">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenConfig={() => setIsConfigOpen(true)}
        currentManagerParam={currentMgrParam}
      />
      <main className="main-content">
        {renderContent()}
      </main>
      <DataConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onDataChanged={handleDataChanged}
      />
    </div>
  );
};

export default App;
