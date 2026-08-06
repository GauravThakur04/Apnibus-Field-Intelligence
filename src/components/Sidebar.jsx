import React from 'react';
import {
  LayoutDashboard, Users, UserCheck, Map, Table2,
  Lightbulb, Database, Sun, Moon, Bus, AlertTriangle, UserCog, Lock, ArrowLeft, X, DollarSign, LogOut
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, theme, toggleTheme, onOpenConfig, currentManagerParam, sidebarOpen, setSidebarOpen, user, onLogout }) => {

  const managerNav = [
    { id: 'mgr_rajnish',   label: 'Rajnish Kumar',   subtitle: 'Rajasthan & Jharkhand', param: 'rajnish',   color: '#2563eb' },
    { id: 'mgr_tarun',     label: 'Tarun Kumar',     subtitle: 'Himachal & North',      param: 'tarun',     color: '#10b981' },
    { id: 'mgr_sonu',      label: 'Sonu Mishra',      subtitle: 'Haryana & NCR',         param: 'sonu',      color: '#f59e0b' },
    { id: 'mgr_rajwinder', label: 'Rajwinder Singh',  subtitle: 'Punjab Region',         param: 'rajwinder', color: '#8b5cf6' },
  ];

  const toolsNav = [
    { id: 'candidates', label: 'Candidate Profiles',  icon: UserCheck,     badge: null },
    { id: 'map',        label: 'Live Visit Map',      icon: Map,           badge: 'Live' },
    { id: 'table',      label: 'Visit Records',       icon: Table2,        badge: null },
    { id: 'onboarding', label: 'Onboarding Payments', icon: DollarSign, badge: null },
    { id: 'insights',   label: 'Smart Insights',      icon: Lightbulb,     badge: 'AI' },
    { id: 'alerts',     label: 'Red Alerts',          icon: AlertTriangle, badge: '!', alert: true },
  ];

  // Check if locked to a single manager portal
  const isManagerPortal = Boolean(currentManagerParam);
  const activeMgrObj = managerNav.find(m => m.param === currentManagerParam);

  return (
    <aside className={`sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon" style={{ background: 'transparent', boxShadow: 'none', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img 
            src="/logo.png" 
            alt="ApniBus Logo" 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="sidebar-logo-text">ApniBus</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>
            {isManagerPortal && activeMgrObj ? `${activeMgrObj.label}'s Portal` : 'Field Intelligence'}
          </span>
        </div>
        <span className="sidebar-logo-badge" style={isManagerPortal && activeMgrObj ? { background: `${activeMgrObj.color}20`, color: activeMgrObj.color } : {}}>
          {isManagerPortal ? 'Manager' : 'Executive'}
        </span>
        
        {/* Mobile Sidebar Close Button */}
        <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
          <X size={16} />
        </button>
      </div>

      {/* Scrollable Nav Area */}
      <div className="sidebar-content">
        
        {/* Executive Link (Hidden in Manager Mode, or available as back link) */}
        {/* Main Executive Portal Link (Only shown for Executive users) */}
        {!isManagerPortal && (
          <div className="sidebar-section">
            <div className="sidebar-section-label">Main Executive Portal</div>
            <div
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => {
                try { window.history.pushState({}, '', window.location.pathname); } catch (_) {}
                setActiveTab('overview');
              }}
            >
              <LayoutDashboard size={16} />
              <span style={{ flex: 1 }}>Executive Overview</span>
            </div>
          </div>
        )}

        {/* 1. Analytics & Tools (MOVED UP) */}
        <div className="sidebar-section">
          <div className="sidebar-section-label">
            {isManagerPortal ? 'Team Tools & Logs' : 'Analytics & Tools'}
          </div>
          {toolsNav.map(item => {
            const Icon = item.icon;
            const isAlert = item.alert;
            const isActive = activeTab === item.id;
            return (
              <div
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
                style={isAlert ? {
                  color: isActive ? '#f43f5e' : '#f43f5e99',
                  background: isActive ? 'rgba(244,63,94,0.08)' : undefined
                } : {}}
              >
                <Icon size={16} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span className="nav-badge" style={isAlert ? { background: 'rgba(244,63,94,0.12)', color: '#f43f5e', fontWeight: 800 } : {}}>
                    {item.badge}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* 2. Manager Dashboards (MOVED DOWN) */}
        <div className="sidebar-section">
          <div className="sidebar-section-label">
            {isManagerPortal ? 'Manager Workspace' : 'Manager Dashboards'}
          </div>
          {managerNav
            .filter(item => !isManagerPortal || item.param === currentManagerParam)
            .map(item => {
              const isActive = activeTab === item.id;
              return (
                <div
                  key={item.id}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    try { window.history.pushState({}, '', `/?manager=${item.param}`); } catch (_) {}
                    setActiveTab(item.id);
                  }}
                  style={isActive ? {
                    background: `${item.color}14`,
                    color: item.color,
                    fontWeight: 600
                  } : {}}
                >
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-faint)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.subtitle}</span>
                  </div>
                </div>
              );
            })}
        </div>

      </div>

      {/* Footer Controls */}
      <div className="sidebar-footer">
        {/* User info */}
        {user && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', marginBottom: 6,
            background: 'var(--bg-input)', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)'
          }}>
            {user.picture ? (
              <img src={user.picture} alt={user.name} style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0 }} />
            ) : (
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                {(user.given_name || user.name || 'U')[0].toUpperCase()}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-heading)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.given_name || user.name?.split(' ')[0]}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </div>
            </div>
          </div>
        )}
        <button className="sidebar-footer-btn" onClick={onOpenConfig}>
          <Database size={14} />
          <span>Data Sources</span>
        </button>
        <button className="sidebar-footer-btn" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        {user && onLogout && (
          <button
            className="sidebar-footer-btn"
            onClick={onLogout}
            style={{ color: '#f43f5e', borderTop: '1px solid var(--border)', marginTop: 4, paddingTop: 10 }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
