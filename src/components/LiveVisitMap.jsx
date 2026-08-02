import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getData } from '../data/dataService';
import { Filter, Navigation, X, Lock } from 'lucide-react';

// Manager color palette
const MANAGER_COLORS = {
  'rajnish.kumar@apnibus.com':   { color: '#2563eb', name: 'Rajnish Kumar'   },
  'tarun.kumar@apnibus.com':     { color: '#10b981', name: 'Tarun Kumar'     },
  'sonu.mishra@apnibus.com':     { color: '#f59e0b', name: 'Sonu Mishra'     }
};

const createSvgIcon = (color, verified) => {
  const ring = verified ? '#fff' : 'rgba(255,255,255,0.6)';
  const svg = `<svg width="22" height="28" viewBox="0 0 22 28" xmlns="http://www.w3.org/2000/svg">
    <filter id="s${color.replace('#','')}" x="-30%" y="-20%" width="160%" height="160%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="${color}" flood-opacity="0.35"/>
    </filter>
    <path filter="url(#s${color.replace('#','')})"
      d="M11 1C6.03 1 2 5.03 2 10c0 6.75 9 17 9 17s9-10.25 9-17c0-4.97-4.03-9-9-9z"
      fill="${color}" stroke="${ring}" stroke-width="1.5"/>
    <circle cx="11" cy="10" r="3.5" fill="white" opacity="0.9"/>
  </svg>`;
  return L.divIcon({ html: svg, className: '', iconSize: [22, 28], iconAnchor: [11, 28], popupAnchor: [0, -30] });
};

const LiveVisitMap = ({ globalFilters, onSelectCandidate, theme }) => {
  const allData = getData();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersLayer = useRef(null);
  const tileLayer = useRef(null);

  // If locked to a single manager via globalFilters
  const lockedEmail = globalFilters?.managerEmail || '';

  const [managerEmail, setManagerEmail] = useState(lockedEmail);
  const [bdName, setBdName] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [markerCount, setMarkerCount] = useState(0);

  // Sync state if globalFilters change
  useEffect(() => {
    if (lockedEmail) setManagerEmail(lockedEmail);
  }, [lockedEmail]);

  const activeEmail = lockedEmail || managerEmail;

  const activeBDNames = useMemo(() => new Set(allData.salespersons.map(s => s.name.toLowerCase().trim())), [allData.salespersons]);

  const bdList = useMemo(() => {
    let visits = allData.visits.filter(x => activeBDNames.has((x.bd_name || '').toLowerCase().trim()));
    if (activeEmail) visits = visits.filter(v => v.manager_email === activeEmail);
    return Array.from(new Set(visits.map(v => v.bd_name))).sort();
  }, [activeEmail, allData, activeBDNames]);

  const filteredVisits = useMemo(() => {
    let v = allData.visits.filter(x => activeBDNames.has((x.bd_name || '').toLowerCase().trim()));
    if (activeEmail) v = v.filter(x => x.manager_email === activeEmail);
    if (bdName)       v = v.filter(x => (x.bd_name || '').toLowerCase() === (bdName || '').toLowerCase());
    if (statusFilter) v = v.filter(x => x.verify_status === statusFilter);
    if (dateFilter)   v = v.filter(x => x.visit_date === dateFilter);
    // Keep only visits with valid coords
    v = v.filter(x => x.latitude && x.longitude && !isNaN(x.latitude) && !isNaN(x.longitude));
    return v.slice(0, 300); // cap for performance
  }, [activeEmail, bdName, statusFilter, dateFilter, allData, activeBDNames]);

  const totalVisitsCount = useMemo(() => {
    let v = allData.visits.filter(x => activeBDNames.has((x.bd_name || '').toLowerCase().trim()));
    if (activeEmail) v = v.filter(x => x.manager_email === activeEmail);
    if (bdName)       v = v.filter(x => (x.bd_name || '').toLowerCase() === (bdName || '').toLowerCase());
    if (statusFilter) v = v.filter(x => x.verify_status === statusFilter);
    if (dateFilter)   v = v.filter(x => x.visit_date === dateFilter);
    return v.length;
  }, [activeEmail, bdName, statusFilter, dateFilter, allData, activeBDNames]);

  // Init map
  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      const map = L.map(mapRef.current, {
        center: [23.5937, 78.9629],
        zoom: 5,
        zoomControl: true,
      });

      const darkTiles = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      const lightTiles = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      const tiles = L.tileLayer(theme === 'dark' ? darkTiles : lightTiles, {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap &copy; CARTO'
      }).addTo(map);

      tileLayer.current = tiles;
      markersLayer.current = L.layerGroup().addTo(map);
      mapInstance.current = map;
    }
  }, []);

  // Update tiles on theme change
  useEffect(() => {
    if (tileLayer.current) {
      const darkTiles = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      const lightTiles = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      tileLayer.current.setUrl(theme === 'dark' ? darkTiles : lightTiles);
    }
  }, [theme]);

  // Plot markers
  useEffect(() => {
    if (!mapInstance.current || !markersLayer.current) return;

    markersLayer.current.clearLayers();
    const bounds = L.latLngBounds();
    let count = 0;

    filteredVisits.forEach(v => {
      const lat = parseFloat(v.latitude);
      const lng = parseFloat(v.longitude);
      if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) return;

      const mgrInfo = MANAGER_COLORS[v.manager_email] || { color: '#2563eb', name: v.manager_name };
      const icon = createSvgIcon(mgrInfo.color, v.verify_status === 'SUCCESS');

      const popContent = `
        <div style="font-family:Inter,sans-serif;font-size:12px;padding:4px;min-width:180px;">
          <div style="font-weight:700;font-size:13px;color:#0f172a;margin-bottom:2px;">${v.operator_name || 'Operator Visit'}</div>
          <div style="font-size:11px;color:#64748b;margin-bottom:6px;">${v.company_name || ''}</div>
          <div style="font-size:11px;margin-bottom:4px;">👤 <strong>BD:</strong> ${v.bd_name}</div>
          <div style="font-size:11px;margin-bottom:4px;">👔 <strong>Manager:</strong> ${mgrInfo.name}</div>
          <div style="font-size:11px;margin-bottom:4px;">📍 <strong>City:</strong> ${v.city || 'N/A'}, ${v.state || ''}</div>
          <div style="font-size:11px;margin-bottom:6px;">📅 <strong>Date:</strong> ${v.visit_date}</div>
          <span style="font-size:10px;padding:2px 6px;border-radius:10px;background:${v.verify_status === 'SUCCESS' ? '#dcfce7' : '#fef3c7'};color:${v.verify_status === 'SUCCESS' ? '#15803d' : '#b45309'};font-weight:700;">
            ${v.verify_status === 'SUCCESS' ? '✓ Verified' : '⏳ Pending'}
          </span>
        </div>
      `;

      const marker = L.marker([lat, lng], { icon }).bindPopup(popContent);
      markersLayer.current.addLayer(marker);
      bounds.extend([lat, lng]);
      count++;
    });

    setMarkerCount(count);

    if (count > 0 && mapInstance.current) {
      mapInstance.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
    }
  }, [filteredVisits]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: 'calc(100vh - 100px)' }}>
      {/* Header & Filter Controls */}
      <div className="card" style={{ padding: '14px 20px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-header)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Navigation size={18} color="var(--primary)" />
              Live Visit Map Tracker
              {lockedEmail && (
                <span className="badge badge-info" style={{ fontSize: 10, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Lock size={10} /> Team Scoped
                </span>
              )}
            </h2>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Showing <strong>{totalVisitsCount}</strong> visits{bdName ? ` for ${bdName}` : ''}{dateFilter ? ` on ${dateFilter}` : ''}
            </div>
          </div>

          {/* Filter Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {/* Date Filter */}
            <input type="date" className="input" value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={{ width: '130px', padding: '6px 10px', height: '34px', fontSize: '12px' }} />

            {/* Manager Filter (Hidden/Disabled if locked in Single Manager Portal Mode) */}
            {!lockedEmail ? (
              <select className="select" value={managerEmail} onChange={e => { setManagerEmail(e.target.value); setBdName(''); }}>
                <option value="">All Managers</option>
                {allData.managers.map(m => <option key={m.id} value={m.email}>{m.name}</option>)}
              </select>
            ) : (
              <div style={{ fontSize: 12, fontWeight: 700, padding: '6px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', color: 'var(--primary)' }}>
                Manager: {MANAGER_COLORS[lockedEmail]?.name || lockedEmail}
              </div>
            )}

            {/* BD Name Filter */}
            <select className="select" value={bdName} onChange={e => setBdName(e.target.value)}>
              <option value="">All BDs ({bdList.length})</option>
              {bdList.map(b => <option key={b} value={b}>{b}</option>)}
            </select>

            {/* Status Filter */}
            <select className="select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="SUCCESS">Verified Only</option>
              <option value="PENDING">Pending Only</option>
            </select>

            {(bdName || statusFilter || dateFilter || (!lockedEmail && managerEmail)) && (
              <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: 12 }}
                onClick={() => { if (!lockedEmail) setManagerEmail(''); setBdName(''); setStatusFilter(''); setDateFilter(''); }}>
                <X size={14} /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', position: 'relative' }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
};

export default LiveVisitMap;
