import React, { useState, useMemo } from 'react';
import {
  Calendar, Camera, Phone, MapPin, CheckCircle, Clock, ArrowLeft,
  User, Award, Activity, Flame, ShieldAlert, ShieldCheck, ChevronRight,
  DollarSign, TrendingUp, UserCheck, Briefcase, Zap
} from 'lucide-react';
import { getDailyTimeline, getData, getStats, getVisitDurationMinutes, getVisitTime, fmtTime, getAvailableDates } from '../data/dataService';
import { getBDRiskScores } from '../data/aiEngine';

const IndividualBDDashboard = ({ bdName, onBack, theme }) => {
  const allData = getData();
  const dynamicDates = useMemo(() => getAvailableDates(), []);
  const initialDate = dynamicDates[0]?.v || new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const [selectedDate, setSelectedDate] = useState(initialDate);

  // Find candidate details
  const candidate = useMemo(() => {
    return allData.salespersons.find(s => s.name.toLowerCase() === bdName?.toLowerCase()) || {
      name: bdName || 'Field Agent',
      manager_name: 'Regional Manager',
      status: 'Active',
      productivity_score: 85,
      mtd_visits: 45,
      today_visits: 2,
      ltd_visits: 120,
      verified_percent: 88,
      user_id: 14,
      attendance_rate: 85,
      present_days: 28,
      absent_days: 2,
      half_days: 1,
      sale_punches: 42,
      service_punches: 12,
      mtd_revenue: 563400,
      avg_field_hours: 8.5
    };
  }, [bdName, allData]);

  // All visits for this candidate
  const candidateVisits = useMemo(() => {
    return allData.visits.filter(v => (v.bd_name || '').toLowerCase() === (candidate.name || '').toLowerCase());
  }, [candidate, allData]);

  const dateLabelsMap = useMemo(() => {
    const map = {};
    dynamicDates.forEach(item => {
      map[item.v] = item.l;
    });
    return map;
  }, [dynamicDates]);

  // Unique dates for date picker dropdown
  const availableDates = useMemo(() => {
    const dates = Array.from(new Set(candidateVisits.map(v => v.visit_date))).sort().reverse();
    return dates.length > 0 ? dates : dynamicDates.map(d => d.v);
  }, [candidateVisits, dynamicDates]);

  // Daily Activity timeline for selected date
  const timelineEvents = useMemo(() => {
    return getDailyTimeline(candidate.name, selectedDate);
  }, [candidate, selectedDate]);

  // Risk profile for this BD
  const riskProfile = useMemo(() => {
    const allRisks = getBDRiskScores(candidate.manager_email);
    return allRisks.find(r => (r.bd_name || '').toLowerCase() === (candidate.name || '').toLowerCase()) || {
      risk_score: 15, risk_level: 'LOW', flags: []
    };
  }, [candidate]);

  const riskColor = riskProfile.risk_level === 'HIGH' ? '#f43f5e' : riskProfile.risk_level === 'MEDIUM' ? '#f59e0b' : '#10b981';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {onBack && (
            <button className="btn btn-ghost" onClick={onBack} style={{ padding: '8px 12px', fontSize: 13 }}>
              <ArrowLeft size={16} /> Back
            </button>
          )}
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--primary-dim)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>
                {candidate.name[0]}
              </div>
              {candidate.name}
              <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 12, background: 'var(--bg-input)', color: 'var(--text-muted)', fontWeight: 600 }}>
                ID: #{candidate.user_id || 14}
              </span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>
              BD under <strong>{candidate.manager_name}</strong> · Day Start: <strong style={{ color: 'var(--text-heading)' }}>⏰ {candidate.start_day_time || '--:--'}</strong>
            </p>
          </div>
        </div>

        {/* Date Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)', padding: '6px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <Calendar size={15} color="var(--text-muted)" />
          <select className="select" style={{ border: 'none', background: 'transparent', padding: '4px 8px', fontSize: 13, fontWeight: 600 }}
            value={selectedDate} onChange={e => setSelectedDate(e.target.value)}>
            {availableDates.map(d => (
              <option key={d} value={d}>
                {dateLabelsMap[d] || d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary KPI Row — Matched Sales & Revenue Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
        {[
          { label: 'FTD Sales & Revenue (Today)', val: `${candidate.ftd_sales ?? 0} Sales (₹ ${(candidate.ftd_revenue ?? 0).toLocaleString()})`, color: (candidate.ftd_sales ?? 0) > 0 ? '#10b981' : 'var(--text-muted)', bg: (candidate.ftd_sales ?? 0) > 0 ? 'rgba(16,185,129,0.08)' : 'var(--bg-input)' },
          { label: 'MTD Sales & Revenue (Month)', val: `${candidate.mtd_sales ?? 0} Sales (${(candidate.mtd_revenue || 0) >= 100000 ? `₹ ${((candidate.mtd_revenue || 0) / 100000).toFixed(1)} L` : `₹ ${(((candidate.mtd_revenue || 0) / 1000)).toFixed(1)}k`})`, color: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
          { label: 'MTD Attendance %', val: `${candidate.mtd_attendance_pct ?? candidate.attendance_rate ?? 85}% (${candidate.mtd_present_days || candidate.present_days || 0}P / ${candidate.mtd_absent_days || candidate.absent_days || 0}A)`, color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)' },
          { label: 'Avg Field Hours', val: `${candidate.avg_field_hours || 8.5} hrs/day`, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
          { label: 'AI Risk Rating', val: `${riskProfile.risk_level} (${riskProfile.risk_score})`, color: riskColor, bg: `${riskColor}12` },
        ].map((k, i) => (
          <div key={i} className="card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>{k.label}</span>
            <span style={{ fontSize: 17, fontWeight: 800, color: k.color, fontFamily: 'var(--font-header)' }}>{k.val}</span>
          </div>
        ))}
      </div>

      {/* Order Punching History Section (Dedicated Section for BD's Punched Orders) */}
      <div className="card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: 8 }}>
              🛒 Order Punching &amp; Onboarding Payment History
              <span className="badge badge-present" style={{ fontSize: 11, padding: '3px 9px' }}>
                {(candidate.punched_orders || []).length} Orders Punched
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              Onboarding orders punched by {candidate.name} matched from database
            </div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#10b981', background: 'rgba(16,185,129,0.08)', padding: '6px 14px', borderRadius: 8 }}>
            Total Onboarding Payment: ₹ {(candidate.ltd_revenue || 0).toLocaleString()}
          </div>
        </div>

        {(candidate.punched_orders || []).length > 0 ? (
          <div className="table-wrap" style={{ maxHeight: 280, overflowY: 'auto' }}>
            <table className="table" style={{ fontSize: 12 }}>
              <thead>
                <tr>
                  <th>Order Date</th>
                  <th>Operator Name</th>
                  <th>Company Name</th>
                  <th>Operator Mobile</th>
                  <th style={{ textAlign: 'center' }}>POS Qty</th>
                  <th style={{ textAlign: 'right' }}>Setup Fee</th>
                  <th style={{ textAlign: 'right' }}>1st Rech</th>
                  <th style={{ textAlign: 'right' }}>Total Paid (Rev)</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {(candidate.punched_orders || []).map((o, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600, color: 'var(--text-heading)' }}>
                      {o.date} <span style={{ fontSize: 10, color: 'var(--text-faint)' }}>{o.time}</span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{o.operator_name}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{o.company_name}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{o.mobile}</td>
                    <td style={{ textAlign: 'center', fontWeight: 800, color: '#2563eb' }}>{o.num_items}</td>
                    <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>₹ {o.setup_fee.toLocaleString()}</td>
                    <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>₹ {o.wallet_amount.toLocaleString()}</td>
                    <td style={{ textAlign: 'right', fontWeight: 800, color: '#10b981' }}>₹ {o.payable_amount.toLocaleString()}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="badge badge-present" style={{ fontSize: 10, padding: '2px 6px' }}>
                        Success
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-faint)', fontSize: 12, background: 'var(--bg-input)', borderRadius: 8 }}>
            No direct POS orders punched in record for this candidate yet.
          </div>
        )}
      </div>

      {/* Main Content Layout: Timeline on Left + Visit Detail & Stats on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, alignItems: 'start' }}>
        
        {/* Daily Activity Timeline (Design matched with uploaded reference image) */}
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: '#15803d', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6 }}>
                Daily Activity Timeline
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>{selectedDate}</span>
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>{timelineEvents.filter(e => e.type === 'VISIT').length} visits logged</span>
          </div>

          {/* Vertical Timeline Track */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
            {/* Background vertical line */}
            <div style={{ position: 'absolute', left: 78, top: 12, bottom: 12, width: 2, background: 'var(--border)', zIndex: 0 }} />

            {timelineEvents.map((ev, i) => {
              const dotColor = ev.type === 'LOGIN' ? '#16a34a' : ev.type === 'LOGOUT' ? '#ef4444' : ev.type === 'BREAK' ? '#f59e0b' : '#2563eb';

              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative', zIndex: 1 }}>
                  {/* Time label */}
                  <div style={{ minWidth: 65, textAlign: 'right', fontSize: 12, fontWeight: 700, color: 'var(--text-main)', fontFamily: 'monospace' }}>
                    {ev.time}
                  </div>

                  {/* Colored Circle Node */}
                  <div style={{ width: 14, height: 14, borderRadius: '50%', background: dotColor, border: '3px solid var(--bg-card)', boxShadow: `0 0 0 2px ${dotColor}40`, flexShrink: 0 }} />

                  {/* Main Event Text */}
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-hover)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-heading)' }}>
                        {ev.title}
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>
                        {ev.description}
                      </div>
                    </div>

                    {/* Status & Camera Icon Button */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      {ev.type === 'VISIT' && (
                        <>
                          <span style={{ fontSize: 11, fontWeight: 700, color: ev.status === 'SUCCESS' ? '#16a34a' : '#d97706' }}>
                            {ev.status === 'SUCCESS' ? 'Verified' : 'Pending'}
                          </span>
                          {ev.image_url ? (
                            <a href={ev.image_url} target="_blank" rel="noopener noreferrer"
                              style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(22,163,74,0.1)', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                              title="View Photo">
                              <Camera size={14} />
                            </a>
                          ) : (
                            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--bg-input)', color: 'var(--text-faint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Camera size={14} />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Visited Operators & Attendance Diagnostic */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* Attendance Summary */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-heading)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <UserCheck size={16} color="#0ea5e9" /> Attendance &amp; Punch Summary
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div style={{ padding: '8px 10px', borderRadius: 6, background: 'var(--bg-input)' }}>
                <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>Present Days</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#10b981' }}>{candidate.present_days || 28} days</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: 6, background: 'var(--bg-input)' }}>
                <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>Absent Days</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#f43f5e' }}>{candidate.absent_days || 2} days</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: 6, background: 'var(--bg-input)' }}>
                <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>Sale Punches</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#2563eb' }}>{candidate.sale_punches || 0}</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: 6, background: 'var(--bg-input)' }}>
                <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>Service Punches</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#7c3aed' }}>{candidate.service_punches || 0}</div>
              </div>
            </div>
          </div>

          {/* Visited Operators List */}
          <div className="card" style={{ padding: '20px 22px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-heading)', marginBottom: 14 }}>
              Visited Bus Operators ({candidateVisits.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 300, overflowY: 'auto' }}>
              {candidateVisits.slice(0, 15).map((v, i) => (
                <div key={i} style={{ padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-heading)' }}>{v.operator_name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{v.company_name || 'Bus Operator'} · 📍 {v.city}</div>
                  </div>
                  <span className={`badge ${v.verify_status === 'SUCCESS' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: 10 }}>
                    {v.verify_status === 'SUCCESS' ? 'Verified' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk & Quality Diagnostics */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-heading)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldAlert size={15} color={riskColor} /> Risk &amp; Quality Flags
            </div>
            {riskProfile.flags && riskProfile.flags.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {riskProfile.flags.map((f, i) => (
                  <div key={i} style={{ fontSize: 12, padding: '8px 12px', borderRadius: 6, background: `${riskColor}12`, border: `1px solid ${riskColor}30`, color: riskColor, fontWeight: 600 }}>
                    ⚠️ {f.label}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle size={14} /> Zero risk flags detected — High quality field agent.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualBDDashboard;
