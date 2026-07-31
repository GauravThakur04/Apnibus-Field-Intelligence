import React from 'react';
import { getAIInsights, getStats } from '../data/dataService';
import { Sparkles, CheckCircle, AlertTriangle, Info, Globe, Activity, ShieldCheck } from 'lucide-react';

const iconMap = {
  success: <CheckCircle size={18} color="#10b981" />,
  warning: <AlertTriangle size={18} color="#f59e0b" />,
  info:    <Info size={18} color="#0ea5e9" />,
  neutral: <Sparkles size={18} color="#7c3aed" />,
};

const SmartInsights = ({ filters }) => {
  const insights = getAIInsights(filters);
  const stats = getStats(filters);

  const summaryCards = [
    { icon: ShieldCheck, color: '#10b981', bg: 'rgba(16,185,129,0.08)', title: 'Data Integrity', body: `${stats.verifiedVisits.toLocaleString()} of ${stats.mtdVisits.toLocaleString()} visits verified — ${stats.verificationRate}% verification rate across all field agents.` },
    { icon: Globe, color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)', title: 'Regional Coverage', body: `Agent routes span ${stats.coverageCities} unique cities, with an average distance of ~4.2 km per visit.` },
    { icon: Activity, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', title: 'Action Items', body: `${stats.pendingVisits.toLocaleString()} pending verifications remain. Follow up with agents on unverified submissions.` },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="page-header">
        <div>
          <h2>Smart Insights</h2>
          <p>AI-generated highlights from your field visit data</p>
        </div>
      </div>

      {/* Insight cards */}
      <div className="insights-grid">
        {insights.map(item => (
          <div key={item.id} className={`insight-card ${item.type}`}>
            <div style={{ paddingTop: 1 }}>{iconMap[item.type]}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-heading)', marginBottom: 5 }}>{item.title}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary section */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title"><Sparkles size={16} color="var(--primary)" /> Field Operations Summary</div>
            <div className="card-subtitle">Based on {stats.mtdVisits.toLocaleString()} MTD visits across all managers</div>
          </div>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {summaryCards.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} style={{ padding: '18px 20px', borderRadius: 'var(--radius-md)', background: s.bg, border: `1px solid ${s.color}22` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: `${s.color}18`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={16} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-heading)' }}>{s.title}</span>
                  </div>
                  <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.6 }}>{s.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartInsights;
