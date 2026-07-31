import React, { useState, useMemo } from 'react';
import { getDailyTimeline } from '../data/dataService';
import { LogIn, LogOut, Coffee, MapPin, Camera, Phone, Tag, Calendar } from 'lucide-react';

const typeConfig = {
  LOGIN:  { icon: LogIn,  nodeClass: 'login',  label: 'Login'  },
  LOGOUT: { icon: LogOut, nodeClass: 'logout', label: 'Logout' },
  BREAK:  { icon: Coffee, nodeClass: 'break',  label: 'Break'  },
  VISIT:  { icon: MapPin, nodeClass: 'visit',  label: 'Visit'  },
  SYSTEM: { icon: Tag,    nodeClass: 'logout', label: 'Info'   },
};

const DATES = [
  { v: '2026-07-30', l: '30 Jul 2026 (Today)'     },
  { v: '2026-07-29', l: '29 Jul 2026 (Yesterday)' },
  { v: '2026-07-28', l: '28 Jul 2026'              },
  { v: '2026-07-27', l: '27 Jul 2026'              },
  { v: '2026-07-26', l: '26 Jul 2026'              },
  { v: '2026-07-25', l: '25 Jul 2026'              },
];

const DailyTimeline = ({ candidateName }) => {
  const [date, setDate] = useState('2026-07-30');
  const events = useMemo(() => getDailyTimeline(candidateName, date), [candidateName, date]);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-heading)' }}>Daily Activity Timeline</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{candidateName}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar size={13} color="var(--text-faint)" />
          <select className="select" style={{ width: 'auto', fontSize: 12, padding: '6px 12px' }} value={date} onChange={e => setDate(e.target.value)}>
            {DATES.map(d => <option key={d.v} value={d.v}>{d.l}</option>)}
          </select>
        </div>
      </div>

      {/* Timeline body */}
      <div style={{ padding: '20px 22px', overflowY: 'auto', maxHeight: 380 }}>
        <div className="timeline">
          <div className="timeline-track" />
          {events.map((ev, i) => {
            const cfg = typeConfig[ev.type] || typeConfig.VISIT;
            const Icon = cfg.icon;
            return (
              <div key={i} className="timeline-row">
                <div className={`timeline-node ${cfg.nodeClass}`}>
                  <Icon size={7} color="#fff" />
                </div>
                <span className="timeline-time">{ev.time}</span>
                <div className="timeline-body">
                  <div className="timeline-title">{ev.title}</div>
                  <div className="timeline-desc">{ev.description}</div>
                  {ev.type === 'VISIT' && (
                    <div className="timeline-chips">
                      {ev.activity_type && (
                        <span className="badge badge-neutral" style={{ fontSize: 10 }}>
                          {ev.activity_type.replace(/_/g, ' ')}
                        </span>
                      )}
                      {ev.mobile && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-faint)' }}>
                          <Phone size={10} />{ev.mobile}
                        </span>
                      )}
                      {ev.image_url && (
                        <a href={ev.image_url} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
                          <Camera size={10} />View Photo
                        </a>
                      )}
                      <span className={`badge ${ev.status === 'SUCCESS' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: 10 }}>
                        {ev.status === 'SUCCESS' ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DailyTimeline;
