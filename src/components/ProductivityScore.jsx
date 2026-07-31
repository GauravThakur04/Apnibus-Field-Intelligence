import React, { useState, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import { CheckCircle } from 'lucide-react';

const ProductivityScore = ({ candidateName, salesperson, theme }) => {
  if (!salesperson) return null;
  const score = salesperson.productivity_score;
  const isDark = theme === 'dark';
  const tc = isDark ? '#94a3b8' : '#64748b';
  const gc = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(226,232,240,0.8)';

  const scoreLabel = score >= 90 ? 'Excellent' : score >= 75 ? 'Good' : 'Needs Improvement';
  const scoreColor = score >= 90 ? '#10b981' : score >= 75 ? '#2563eb' : '#f59e0b';

  // Radial gauge via SVG
  const R = 56, SW = 9, circ = 2 * Math.PI * R;
  const offset = circ - (score / 100) * circ;

  // Breakdown
  const ver   = salesperson.verified_percent;
  const photo = Math.min(98, score > 85 ? 90 : score > 75 ? 80 : 70);
  const freq  = Math.min(100, Math.round((salesperson.mtd_visits / 30) * 100));
  const cov   = Math.min(98, score > 85 ? 88 : score > 75 ? 78 : 65);

  // History chart
  const hist = [0.78,0.82,0.80,0.88,0.92,0.96,1].map(f => Math.round(score * f));
  const histOpts = {
    chart: { toolbar: { show: false }, background: 'transparent', fontFamily: 'Inter,sans-serif', sparkline: { enabled: false } },
    colors: [scoreColor],
    stroke: { width: 2.5, curve: 'smooth' },
    fill: { type: 'gradient', gradient: { opacityFrom: 0.3, opacityTo: 0.01 } },
    grid: { borderColor: gc, strokeDashArray: 4 },
    xaxis: { categories: ['1 Jul','6 Jul','11 Jul','16 Jul','21 Jul','26 Jul','30 Jul'], labels: { style: { colors: tc, fontSize: '10px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { max: 100, labels: { style: { colors: tc, fontSize: '10px' } } },
    tooltip: { theme }
  };

  const breakdown = [
    { label: 'Verified Visits', pct: 40, score: ver,   color: '#10b981' },
    { label: 'Photo Quality',   pct: 25, score: photo, color: '#2563eb' },
    { label: 'Coverage Area',   pct: 20, score: cov,   color: '#7c3aed' },
    { label: 'Visit Frequency', pct: 15, score: freq,  color: '#f59e0b' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 16 }}>
        {/* Gauge */}
        <div className="card" style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 160 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Productivity</div>
          <div style={{ position: 'relative', width: 130, height: 130 }}>
            <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="65" cy="65" r={R} fill="none" stroke="var(--border)" strokeWidth={SW} />
              <circle cx="65" cy="65" r={R} fill="none" stroke={scoreColor} strokeWidth={SW}
                strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.3s ease' }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font-header)', fontSize: 32, fontWeight: 800, color: 'var(--text-heading)', lineHeight: 1 }}>{score}</span>
              <span style={{ fontSize: 10, color: scoreColor, fontWeight: 700, marginTop: 2 }}>{scoreLabel}</span>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="card" style={{ flex: 1, padding: '20px 22px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-heading)', marginBottom: 16 }}>Score Breakdown</div>
          <div className="breakdown-list">
            {breakdown.map(b => (
              <div key={b.label} className="breakdown-row">
                <div className="breakdown-meta">
                  <span>{b.label} <span style={{ color: 'var(--text-faint)', fontSize: 10 }}>({b.pct}%)</span></span>
                  <span style={{ color: b.color }}>{b.score}%</span>
                </div>
                <div className="prog-track">
                  <div className="prog-fill" style={{ width: `${b.score}%`, background: b.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* History chart */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Score History (MTD)</div>
        </div>
        <div className="card-body">
          <ReactApexChart options={histOpts} series={[{ name: 'Score', data: hist }]} type="area" height={130} />
        </div>
      </div>

      {/* Banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)' }}>
        <CheckCircle size={16} color="#10b981" />
        <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text-main)' }}>
          {candidateName} is performing <strong style={{ color: '#10b981' }}>18% better</strong> than last month.
        </span>
      </div>
    </div>
  );
};

export default ProductivityScore;
