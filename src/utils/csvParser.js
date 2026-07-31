export const parseCSV = (csvText) => {
  const lines = csvText.split('\n');
  const result = [];
  
  const parseLine = (line) => {
    const row = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    row.push(current.trim());
    return row;
  };

  let headers = [];
  let started = false;

  for (let line of lines) {
    const trimmed = line.trim();
    if (trimmed === '') continue;
    
    // Check if it is a header row
    if (!started) {
      if (trimmed.includes('bd_name') || trimmed.includes('email,firebase_token') || trimmed.includes('id,date_created')) {
        headers = trimmed.split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        started = true;
        continue;
      }
      // If we don't find standard headers, let's treat the first non-empty line as headers if it has commas
      if (trimmed.includes(',')) {
        headers = trimmed.split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        started = true;
        continue;
      }
      continue;
    }

    const parts = parseLine(trimmed);
    if (parts.length >= headers.length) {
      const obj = {};
      headers.forEach((h, index) => {
        let val = parts[index] || '';
        // Strip quotes
        val = val.replace(/^"|"$/g, '');
        obj[h] = val;
      });
      result.push(obj);
    }
  }
  return result;
};

// Integrate imported visit CSV under a manager
export const integrateVisits = (csvText, managerEmail, currentData) => {
  const parsed = parseCSV(csvText);
  if (parsed.length === 0) throw new Error("No valid rows found in CSV.");

  const firstRow = parsed[0];
  const requiredKeys = ['bd_name', 'visit_date', 'operator_name'];
  const missing = requiredKeys.filter(k => !(k in firstRow));
  if (missing.length > 0) {
    throw new Error(`Invalid visit CSV format. Missing columns: ${missing.join(', ')}`);
  }

  // Predefined coordinates mapping
  const cityCoordinates = {
    'gurgaon': [28.4595, 77.0266],
    'gurugram': [28.4595, 77.0266],
    'noida': [28.5708, 77.3272],
    'delhi': [28.7041, 77.1025],
    'ghaziabad': [28.6692, 77.4538],
    'faridabad': [28.4089, 77.3178],
    'jaipur': [26.9124, 75.7873],
    'udaipur': [24.5854, 73.7125],
    'bikaner': [28.0167, 73.3119],
    'kota': [25.2138, 75.8648],
    'ajmer': [26.4499, 74.6399],
    'alwar': [27.5530, 76.6346],
    'una': [31.4684, 76.2708],
    'solan': [30.9045, 77.0967],
    'kangra': [32.0998, 76.2691],
    'shimla': [31.1048, 77.1734],
    'patna': [25.5941, 85.1376],
    'gaya': [24.7955, 84.9994],
    'purnia': [25.7771, 87.4753],
    'purnea': [25.7771, 87.4753],
    'ranchi': [23.3441, 85.3096],
    'dhanbad': [23.7957, 86.4304],
    'jamshedpur': [22.8046, 86.2029],
    'hazaribagh': [23.9932, 85.3622],
    'koderma': [24.4682, 85.5949],
    'bilaspur': [22.0790, 82.1391],
    'raipur': [21.2514, 81.6296],
    'indore': [22.7196, 75.8577],
    'gwalior': [26.2183, 78.1828],
    'bhopal': [23.2599, 77.4126]
  };

  // Convert to app-format visits
  const newVisits = parsed.map(v => {
    let city = 'Other';
    let coords = [28.6139, 77.2090];
    
    if (v.location) {
      const locLower = v.location.toLowerCase();
      for (const [key, val] of Object.entries(cityCoordinates)) {
        if (locLower.includes(key)) {
          city = key.charAt(0).toUpperCase() + key.slice(1);
          coords = val;
          break;
        }
      }
      if (city === 'Other') {
        const partsLoc = v.location.split(',');
        if (partsLoc.length > 0 && partsLoc[0].trim()) {
          city = partsLoc[0].trim();
        }
      }
    } else if (v.state) {
      city = v.state;
    }

    return {
      bd_name: v.bd_name,
      visit_date: v.visit_date,
      state: v.state || 'Delhi-NCR',
      location: v.location || '',
      operator_name: v.operator_name,
      company_name: v.company_name || '',
      operator_mobile_no: v.operator_mobile_no || '',
      image_url: v.image_url || '',
      type: v.type || 'FIRST_MEETING',
      verify_status: v.verify_status || 'PENDING',
      lifetime_visits: parseInt(v.lifetime_visits) || 1,
      visits_last_30_days: parseInt(v.visits_last_30_days) || 1,
      manager_email: managerEmail,
      city: city,
      latitude: coords[0] + (Math.random() - 0.5) * 0.04,
      longitude: coords[1] + (Math.random() - 0.5) * 0.04
    };
  });

  // Filter out existing visits of this manager to replace them, or append
  const otherVisits = currentData.visits.filter(v => v.manager_email !== managerEmail);
  const updatedVisits = [...otherVisits, ...newVisits];

  // Re-build salesperson mapping
  const managers = currentData.managers;
  const currentSalespersons = currentData.salespersons;
  
  // Find distinct salespeople from the new visits
  const newSalespeopleNames = Array.from(new Set(newVisits.map(v => v.bd_name)));
  const manager = managers.find(m => m.email === managerEmail) || { id: 999, name: managerEmail.split('@')[0] };

  // Remove existing salespersons belonging to this manager email
  const otherSalespersons = currentSalespersons.filter(s => s.manager_email !== managerEmail);

  let nextId = Math.max(...currentSalespersons.map(s => s.id), 0) + 1;
  const newSalespersons = newSalespeopleNames.map(name => {
    const visits = newVisits.filter(v => v.bd_name.toLowerCase() === name.toLowerCase());
    const mtdVisits = visits.length;
    const verified = visits.filter(v => v.verify_status === 'SUCCESS').length;
    const verifiedPercent = mtdVisits > 0 ? Math.round((verified / mtdVisits) * 100) : 85;
    const dates = visits.map(v => v.visit_date).sort();
    const latestDate = dates[dates.length - 1] || '2026-07-30';
    
    let status = 'Inactive';
    if (latestDate === '2026-07-30') status = 'Active';
    else if (latestDate === '2026-07-29') status = 'Idle';

    return {
      id: nextId++,
      name,
      manager_id: manager.id,
      manager_name: manager.name,
      manager_email: managerEmail,
      status,
      productivity_score: 70 + Math.round(Math.random() * 25),
      today_visits: visits.filter(v => v.visit_date === '2026-07-30').length,
      mtd_visits: mtdVisits,
      ltd_visits: mtdVisits + Math.round(50 + Math.random() * 200),
      verified_percent: verifiedPercent,
      last_visit_time: latestDate === '2026-07-30' ? '04:30 PM' : 'Yesterday'
    };
  });

  return {
    visits: updatedVisits,
    managers: managers,
    salespersons: [...otherSalespersons, ...newSalespersons]
  };
};
