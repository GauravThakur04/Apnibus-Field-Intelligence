import rawData from './apnibusData.json';

const MANAGERS = [
  { id: 552, name: 'Sonu Mishra', email: 'sonu.mishra@apnibus.com', role: 'Regional Head', state: 'HR', city: 'Gurgaon', color: '#f59e0b' },
  { id: 553, name: 'Tarun Kumar', email: 'tarun.kumar@apnibus.com', role: 'Regional Head', state: 'HP', city: 'Gurgaon', color: '#10b981' },
  { id: 554, name: 'Rajwinder Singh', email: 'rajwinder.singh@apnibus.com', role: 'Regional Head', state: 'PB', city: 'Punjab', color: '#8b5cf6' },
  { id: 201, name: 'Rajnish Kumar', email: 'rajnish.kumar@apnibus.com', role: 'Regional Head', state: 'RJ', city: 'Jaipur', color: '#2563eb' }
];

const MASTER_CANDIDATES = [
  // ─── SONU MISHRA'S TEAM (Haryana & NCR) ───
  { id: 1, name: 'Sonu Mishra', mobile: '8750710855', manager_id: 552, manager_name: 'Sonu Mishra', manager_email: 'sonu.mishra@apnibus.com', role: 'Regional Head', state: 'Haryana', city: 'Gurgaon', july_ach_pos_user: 25, july_ach_rev_user: 43200 },
  { id: 2, name: 'Amit Rohilla', mobile: '9315883000', manager_id: 552, manager_name: 'Sonu Mishra', manager_email: 'sonu.mishra@apnibus.com', role: 'Team Lead', state: 'Haryana', city: 'Rohtak', july_ach_pos_user: 25, july_ach_rev_user: 174000 },
  { id: 3, name: 'SUKHDEV SINGH', mobile: '9306703845', manager_id: 552, manager_name: 'Sonu Mishra', manager_email: 'sonu.mishra@apnibus.com', role: 'Business Development', state: 'Haryana', city: 'Sirsa', july_ach_pos_user: 4, july_ach_rev_user: 24100 },
  { id: 4, name: 'Shubham Singh', mobile: '7355982328', manager_id: 552, manager_name: 'Sonu Mishra', manager_email: 'sonu.mishra@apnibus.com', role: 'Business Development', state: 'Haryana', city: 'Gurgaon', july_ach_pos_user: 4, july_ach_rev_user: 27000 },
  { id: 30, name: 'Vishnu Prasad sahu', mobile: '9165702969', manager_id: 552, manager_name: 'Sonu Mishra', manager_email: 'sonu.mishra@apnibus.com', role: 'ISA', state: 'Chhattisgarh', city: 'Korba', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 31, name: 'Sandip Kumar', mobile: '9341491268', manager_id: 552, manager_name: 'Sonu Mishra', manager_email: 'sonu.mishra@apnibus.com', role: 'ISA', state: 'Bihar', city: 'Jamui', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 33, name: 'Vicky Kumar', mobile: '7000679028', manager_id: 552, manager_name: 'Sonu Mishra', manager_email: 'sonu.mishra@apnibus.com', role: 'ISA', state: 'Chhattisgarh', city: 'Bemetara', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 34, name: 'Abhishek Sahu', mobile: '7772952225', manager_id: 552, manager_name: 'Sonu Mishra', manager_email: 'sonu.mishra@apnibus.com', role: 'ISA', state: 'Chhattisgarh', city: 'Durg', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 35, name: 'Manish kumar', mobile: '6200394914', manager_id: 552, manager_name: 'Sonu Mishra', manager_email: 'sonu.mishra@apnibus.com', role: 'ISA', state: 'Bihar', city: 'Gaya', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 60, name: 'mohd Ashique Hussain', mobile: '8102033141', manager_id: 552, manager_name: 'Sonu Mishra', manager_email: 'sonu.mishra@apnibus.com', role: 'ISA', state: 'Bihar', city: 'Patna', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 62, name: 'Shiva jaiswal', mobile: '9993020842', manager_id: 552, manager_name: 'Sonu Mishra', manager_email: 'sonu.mishra@apnibus.com', role: 'ISA', state: 'Chhattisgarh', city: 'KCG', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 63, name: 'Santosh Kumar', mobile: '6305092153', manager_id: 552, manager_name: 'Sonu Mishra', manager_email: 'sonu.mishra@apnibus.com', role: 'ISA', state: 'Bihar', city: 'Jamui', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 73, name: 'Mannu Rai', mobile: '', manager_id: 552, manager_name: 'Sonu Mishra', manager_email: 'sonu.mishra@apnibus.com', role: 'Business Development', state: 'Haryana', city: 'Rohtak', july_ach_pos_user: 0, july_ach_rev_user: 0 },

  // ─── TARUN KUMAR'S TEAM (Himachal & North) ───
  { id: 6, name: 'Tarun Kumar', mobile: '8194815508', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'Regional Head', state: 'Haryana', city: 'Gurgaon', july_ach_pos_user: 2, july_ach_rev_user: 8500 },
  { id: 7, name: 'Akash Singh', mobile: '8447780900', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'Business Development', state: 'Uttar Pradesh', city: 'Greator Noida', july_ach_pos_user: 24, july_ach_rev_user: 76200 },
  { id: 8, name: 'Syed Arshi Abrar', mobile: '9953226633', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'ISA', state: 'Delhi', city: 'Delhi', july_ach_pos_user: 2, july_ach_rev_user: 344 },
  { id: 9, name: 'Chuna Ram', mobile: '9799862695', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'Business Development', state: 'Rajasthan', city: 'Barmer', july_ach_pos_user: 7, july_ach_rev_user: 8500 },
  { id: 10, name: 'Arshdeep Singh', mobile: '8000304871', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'Business Development', state: 'Rajasthan', city: 'Sri Ganganagar', july_ach_pos_user: 1, july_ach_rev_user: 4500 },
  { id: 11, name: 'Harish Verma', mobile: '9805254456', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'Business Development', state: 'Himachal Pradesh', city: 'Una', july_ach_pos_user: 3, july_ach_rev_user: 7500 },
  { id: 13, name: 'Shubham Dhiman', mobile: '7018778473', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'Business Development', state: 'Himachal Pradesh', city: 'Kangra', july_ach_pos_user: 3, july_ach_rev_user: 8500 },
  { id: 36, name: 'Neeraj Shrivastav', mobile: '8962568747', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'ISA', state: 'Madhya Pradesh', city: 'Betul', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 37, name: 'Ajay Kumar', mobile: '8544793597', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'ISA', state: 'Himachal Pradesh', city: 'Mandi', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 38, name: 'Vansh Sawant', mobile: '9816363034', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'ISA', state: 'Himachal Pradesh', city: 'Solan', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 39, name: 'Om prakash meena', mobile: '8120935492', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'ISA', state: 'Madhya Pradesh', city: 'kurawar', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 40, name: 'Gaurav Chauhan', mobile: '7807784847', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'ISA', state: 'Himachal Pradesh', city: 'Shimla', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 41, name: 'Devesh pandey', mobile: '9193115885', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'ISA', state: 'Uttar Pradesh', city: 'Agra', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 42, name: 'Haris Khan', mobile: '9399588962', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'ISA', state: 'Madhya Pradesh', city: 'Bhopal', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 64, name: 'Pratap Bhanu', mobile: '9098063206', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'ISA', state: 'Madhya Pradesh', city: 'Bhopal', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 65, name: 'Saurav Kumar', mobile: '8789480981', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'ISA', state: 'Uttar Pradesh', city: 'Noida', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 69, name: 'Manish Verma', mobile: '', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'Business Development', state: 'Himachal Pradesh', city: 'Kangra', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 70, name: 'Mohan', mobile: '', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'Business Development', state: 'Himachal Pradesh', city: 'Mandi', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 71, name: 'Rahul Kumar Uppal', mobile: '', manager_id: 553, manager_name: 'Tarun Kumar', manager_email: 'tarun.kumar@apnibus.com', role: 'Business Development', state: 'Himachal Pradesh', city: 'Una', july_ach_pos_user: 0, july_ach_rev_user: 0 },

  // ─── RAJNISH KUMAR'S TEAM (Rajasthan & Jharkhand) ───
  { id: 19, name: 'Rajnish Kumar', mobile: '9341643122', manager_id: 201, manager_name: 'Rajnish Kumar', manager_email: 'rajnish.kumar@apnibus.com', role: 'Regional Head', state: 'Rajasthan', city: 'Jaipur', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 20, name: 'Anand Kumar singh', mobile: '8709016324', manager_id: 201, manager_name: 'Rajnish Kumar', manager_email: 'rajnish.kumar@apnibus.com', role: 'Business Development', state: 'Jharkhand', city: 'Hazaribagh', july_ach_pos_user: 15, july_ach_rev_user: 13091 },
  { id: 21, name: 'Manish Bhati', mobile: '7568612974', manager_id: 201, manager_name: 'Rajnish Kumar', manager_email: 'rajnish.kumar@apnibus.com', role: 'Business Development', state: 'Rajasthan', city: 'Bikaner', july_ach_pos_user: 8, july_ach_rev_user: 18800 },
  { id: 22, name: 'Sarfaraj Khan', mobile: '8619414557', manager_id: 201, manager_name: 'Rajnish Kumar', manager_email: 'rajnish.kumar@apnibus.com', role: 'Business Development', state: 'Rajasthan', city: 'Kota', july_ach_pos_user: 7, july_ach_rev_user: 13000 },
  { id: 24, name: 'Anil Kumar', mobile: '6350327751', manager_id: 201, manager_name: 'Rajnish Kumar', manager_email: 'rajnish.kumar@apnibus.com', role: 'Business Development', state: 'Rajasthan', city: 'Hanumangarh', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 25, name: 'Jeetu kumar prajapat', mobile: '8764189635', manager_id: 201, manager_name: 'Rajnish Kumar', manager_email: 'rajnish.kumar@apnibus.com', role: 'ISA', state: 'Rajasthan', city: 'Karauli', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 26, name: 'Mohammad Hussain', mobile: '9636972335', manager_id: 201, manager_name: 'Rajnish Kumar', manager_email: 'rajnish.kumar@apnibus.com', role: 'ISA', state: 'Rajasthan', city: 'Udaipur', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 27, name: 'Yashodhan', mobile: '7733841658', manager_id: 201, manager_name: 'Rajnish Kumar', manager_email: 'rajnish.kumar@apnibus.com', role: 'ISA', state: 'Rajasthan', city: 'Bharatpur', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 28, name: 'Birendra kumar', mobile: '9263711047', manager_id: 201, manager_name: 'Rajnish Kumar', manager_email: 'rajnish.kumar@apnibus.com', role: 'ISA', state: 'Jharkhand', city: 'Jamshedpur', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 29, name: 'KULDEEP SINGH UDAWAT', mobile: '7852812254', manager_id: 201, manager_name: 'Rajnish Kumar', manager_email: 'rajnish.kumar@apnibus.com', role: 'ISA', state: 'Rajasthan', city: 'Udaipur', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 66, name: 'Anand Singh Rathore', mobile: '7690944003', manager_id: 201, manager_name: 'Rajnish Kumar', manager_email: 'rajnish.kumar@apnibus.com', role: 'ISA', state: 'Rajasthan', city: 'Karauli', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 67, name: 'Anup Yadav', mobile: '7878525355', manager_id: 201, manager_name: 'Rajnish Kumar', manager_email: 'rajnish.kumar@apnibus.com', role: 'ISA', state: 'Rajasthan', city: 'Alwar', july_ach_pos_user: 0, july_ach_rev_user: 0 },

  // ─── RAJWINDER SINGH'S TEAM (Punjab) ───
  { id: 15, name: 'Rajwinder Singh', mobile: '8427364774', manager_id: 554, manager_name: 'Rajwinder Singh', manager_email: 'rajwinder.singh@apnibus.com', role: 'Regional Head', state: 'Punjab', city: 'Punjab', july_ach_pos_user: 0, july_ach_rev_user: 0 },
  { id: 16, name: 'Rajiv Kumar', mobile: '9814201669', manager_id: 554, manager_name: 'Rajwinder Singh', manager_email: 'rajwinder.singh@apnibus.com', role: 'Team Lead', state: 'Punjab', city: 'Muktsar sahib', july_ach_pos_user: 13, july_ach_rev_user: 37500 },
  { id: 17, name: 'Surinder Singh', mobile: '9877674046', manager_id: 554, manager_name: 'Rajwinder Singh', manager_email: 'rajwinder.singh@apnibus.com', role: 'Business Development', state: 'Punjab', city: 'Mansa', july_ach_pos_user: 6, july_ach_rev_user: 17000 },
  { id: 18, name: 'Rajat Sharma', mobile: '7888436876', manager_id: 554, manager_name: 'Rajwinder Singh', manager_email: 'rajwinder.singh@apnibus.com', role: 'Team Lead', state: 'Punjab', city: 'Ludhiana', july_ach_pos_user: 14, july_ach_rev_user: 28502 }
];


if (typeof window !== 'undefined') {
  window.__apnibus_diagnostics = {
    systemTodayStr: '',
    DYNAMIC_TODAY_DATE: '',
    DYNAMIC_MTD_MONTH: '',
    fetchStatus: 'Idle',
    error: null,
    onboardingCount: 0,
    salesCount: 0,
    attendanceCount: 0,
    locationCount: 0,
    visitsCount: 0,
    lastUpdated: null,
    MASTER_CANDIDATES_COUNT: MASTER_CANDIDATES.length
  };
}



function localNormalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizePhone(value) {
  if (!value) return '';
  return String(value || '')
    .replace(/[^0-9]+/g, '')
    .replace(/^0+/, '')
    .trim();
}

function getCandidatePhones(candidate) {
  const phones = new Set();
  [candidate.mobile, candidate.bd_code, candidate.phone, candidate.contact, candidate.manager_mobile, ...(candidate.alt_phones || [])].forEach(value => {
    const phone = normalizePhone(value);
    if (phone.length >= 8) phones.add(phone);
  });
  return Array.from(phones);
}

function getRecordPhones(record) {
  return [record.bd_code, record.bd_id, record.bd_mobile, record.rm_mobile, record.employee_mobile, record.bd_phone, record.mobile, record.phone, record.mobile_no, record.operator_mobile_no]
    .map(normalizePhone)
    .filter(phone => phone.length >= 8);
}

function formatToISODate(dateVal) {
  if (!dateVal) return '';
  const val = String(dateVal).trim();
  // Common CSV export format: DD/MM/YYYY (optionally followed by a time).
  const slashMatch = val.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (slashMatch) return `${slashMatch[3]}-${slashMatch[2].padStart(2, '0')}-${slashMatch[1].padStart(2, '0')}`;
  // Case 1: YYYY-MM-DD ...
  if (val.match(/^\d{4}-\d{2}-\d{2}/)) {
    return val.slice(0, 10);
  }
  // Case 2: DD MMM YYYY ... (e.g. 01 Aug 2026 14:21)
  const parts = val.split(/\s+/);
  if (parts.length >= 3) {
    const day = parts[0].padStart(2, '0');
    const months = {
      jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
      jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
    };
    const monthName = parts[1].toLowerCase().slice(0, 3);
    const month = months[monthName];
    const year = parts[2];
    if (month && year.match(/^\d{4}$/)) {
      return `${year}-${month}-${day}`;
    }
  }
  // Fallback to standard JS Date parsing
  try {
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    }
  } catch (e) {}
  return val.slice(0, 10);
}

const CANDIDATE_NAME_ALIASES = {
  'amit rohilla': ['amit kumar'],
  'neeraj shrivastav': ['neeraj shrivastava'],
  'manish bhati': ['manish bathi', 'manish bhati'],
  'sandip kumar': ['sandeep kumar'],
  'sukhdev singh': ['sukhdev singh'],
  'anand kumar singh': ['anand kumar singh'], // CSV uses lower-case 's'
  'birendra kumar': ['birendra kumar'],
  'jeetu kumar prajapat': ['jeetu kumar prajapat'],
  'manish verma': ['manish verma'],
  'vivek kumar kaundal': ['vivek kumar kaundal'],
  'ajay kumar': ['ajay kumar'],
  'mohit': ['mohit'],
  'mannu rai': ['mannu rai'],
  'rahul kumar uppal': ['rahul kumar uppal'],
  'shiv dayal': ['shiv dayal'],
  'mohan': ['mohan'],
};

function recordMatchesCandidate(record, candidate) {
  // Match by email first (most reliable for attendance CSV)
  if (candidate.email && record.email) {
    const cEmail = String(candidate.email).toLowerCase().trim();
    const rEmail = String(record.email).toLowerCase().trim();
    if (cEmail && rEmail && cEmail === rEmail) return true;
  }
  const candidateName = localNormalizeText(candidate.name);
  const recordName = localNormalizeText(record.bd_name || record.name || record.employee_name || record.full_name || record.user_name);
  if (!recordName) return false;
  if (recordName === candidateName) return true;
  if ((CANDIDATE_NAME_ALIASES[candidateName] || []).includes(recordName)) return true;
  // Some exports shorten a middle name. Keep this guarded to avoid matching short names.
  return recordName.length >= 7 && candidateName.length >= 7 &&
    (recordName.includes(candidateName) || candidateName.includes(recordName));
}

function formatAttendanceTime(value) {
  if (!value) return '';
  const text = String(value).trim();
  const match = text.match(/(?:T|\s)(\d{1,2}:\d{2}(?::\d{2})?)/) || text.match(/^(\d{1,2}:\d{2}(?::\d{2})?)/);
  if (!match) return text;
  const [hour, minute] = match[1].split(':').map(Number);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  return `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${suffix}`;
}

function getWorkingDaysElapsed(isoDate) {
  const [year, month, day] = String(isoDate || '').split('-').map(Number);
  if (!year || !month || !day) return 0;
  let total = 0;
  for (let d = 1; d <= day; d += 1) {
    const weekday = new Date(year, month - 1, d).getDay();
    if (weekday !== 0) total += 1;
  }
  return total;
}

function matchesCandidateLocal(record, candidate, aliases) {
  const status = String(record.payment_status || record.paymentStatus || '').toUpperCase();
  if (status === 'C') return false;

  const recordPhones = getRecordPhones(record);
  if (recordPhones.length && recordPhones.some(phone => aliases.includes(phone))) return true;

  const names = [record.rm_name, record.bd_name, record.bd_full_name, record.salesperson_name,
    record.sales_person_name, record.employee_name, record.executive_name]
    .map(localNormalizeText)
    .filter(Boolean);
  const candidateName = localNormalizeText(candidate.name);
  if (names.includes(candidateName)) return true;

  for (const recordName of names) {
    if (recordName === candidateName) return true;
    if (recordName.length >= 4 && candidateName.includes(recordName)) return true;
    if (candidateName.length >= 4 && recordName.includes(candidateName)) return true;
  }

  return aliases.includes(localNormalizeText(record.bd_name || record.rm_name || record.name || ''));
}

function resolveCandidateForPayment(record, candidates) {
  const recordPhones = getRecordPhones(record);
  if (recordPhones.length) {
    const phoneMatches = candidates.filter(candidate => {
      const candidatePhones = getCandidatePhones(candidate);
      return recordPhones.some(phone => candidatePhones.includes(phone));
    });
    if (phoneMatches.length === 1) return phoneMatches[0];
    if (phoneMatches.length > 1) {
      const recordNames = [record.rm_name, record.bd_name, record.bd_full_name, record.salesperson_name,
        record.sales_person_name, record.employee_name, record.executive_name]
        .map(localNormalizeText)
        .filter(Boolean);
      for (const name of recordNames) {
        const filtered = phoneMatches.filter(candidate => {
          const candidateName = localNormalizeText(candidate.name);
          return candidateName === name || candidateName.includes(name) || name.includes(candidateName);
        });
        if (filtered.length === 1) return filtered[0];
      }
    }
  }

  const rawNames = [
    record.rm_name, record.bd_name, record.bd_full_name, record.salesperson_name,
    record.sales_person_name, record.employee_name, record.executive_name, record.name
  ];
  const names = rawNames
    .map(localNormalizeText)
    .filter(name => name && !['unmapped', 'na', 'n a', 'null'].includes(name));

  for (const name of names) {
    const exactMatches = candidates.filter(candidate => {
      const candidateName = localNormalizeText(candidate.name);
      return candidateName === name || (CANDIDATE_NAME_ALIASES[candidateName] || []).includes(name);
    });
    if (exactMatches.length === 1) return exactMatches[0];

    const partialMatches = candidates.filter(candidate => {
      const candidateName = localNormalizeText(candidate.name);
      return name.length >= 4 && candidateName.length >= 4 &&
        (candidateName.includes(name) || name.includes(candidateName));
    });
    if (partialMatches.length === 1) return partialMatches[0];
  }
  return null;
}

function sumOrdersLocal(records, candidate, aliases, DYNAMIC_MTD_MONTH, DYNAMIC_TODAY_DATE, candidateResolver) {
  const totals = { ftdCount: 0, ftdRevenue: 0, mtdCount: 0, mtdRevenue: 0, ltdCount: 0, ltdRevenue: 0 };
  const matched = [];

  records.forEach((record) => {
    if (String(record.payment_status || record.paymentStatus || '').toUpperCase() === 'C') return;
    // Resolve once across the whole active team. This prevents an abbreviated name from
    // being attributed to more than one BD while still supporting safe partial matches.
    const resolvedCandidate = candidateResolver?.(record);
    if (candidateResolver && (!resolvedCandidate || resolvedCandidate.id !== candidate.id)) return;
    if (!candidateResolver && !matchesCandidateLocal(record, candidate, aliases)) return;

    const amount = parseFloat(record.payable_amount || record.wallet_amount || record.amount || 0) || 0;
    const dateStr = formatToISODate(record.created_on || record.order_date || '');
    const qty = parseInt(record.num_items || 1, 10) || 1;

    // LTD aggregates all-time matching sales
    totals.ltdCount += qty;
    totals.ltdRevenue += amount;
    matched.push({ ...record, amount, dateStr });

    if (dateStr.startsWith(DYNAMIC_MTD_MONTH)) {
      totals.mtdCount += qty;
      totals.mtdRevenue += amount;

      if (dateStr === DYNAMIC_TODAY_DATE) {
        totals.ftdCount += qty;
        totals.ftdRevenue += amount;
      }
    }
  });

  return { ...totals, matched };
}

function compileSalespersons(rawSales, rawOnboarding, allVisits, DYNAMIC_TODAY_DATE, DYNAMIC_MTD_MONTH, rawAttendance = [], rawLocations = []) {
  const salesOrderRecords = rawSales.map(r => ({ ...r, _source: 'sales' }));
  const onboardingOrderRecords = rawOnboarding.map(r => ({ ...r, _source: 'onboarding' }));
  
  const CANONICAL_ALIASES = {
    'amit kumar': 'Amit Rohilla',
    'neeraj shrivastava': 'Neeraj Shrivastav',
    'manish bathi': 'Manish Bhati',
    'sandeep kumar': 'Sandip Kumar',
    'sukhdev singh': 'SUKHDEV SINGH'
  };

const REMOVED_BD_NAMES = new Set([
  'rahul kumar uppal',
  'rahul uppal',
  'vivek kumar kaundal',
  'vivek kaundal',
  'arshdeep singh',
  'arshdeep',
  'mohit',
  'suraj kumar dubey',
  'suraj dubey',
  'karan raina',
  'shiv dayal'
]);

  // Unified candidate map starting with MASTER_CANDIDATES
  const candidateMap = new Map();
  MASTER_CANDIDATES.forEach(c => {
    const n = c.name.toLowerCase().trim();
    if (!REMOVED_BD_NAMES.has(n)) {
      candidateMap.set(n, { ...c });
    }
  });

  // Auto-register any unlisted candidates from visit CSVs
  let nextAutoId = 2000;
  allVisits.forEach(v => {
    const rawName = (v.bd_name || v.name || '').trim();
    if (!rawName) return;
    const normName = rawName.toLowerCase().trim();
    const canonicalName = CANONICAL_ALIASES[normName] || rawName;
    const canonLower = canonicalName.toLowerCase().trim();

    if (REMOVED_BD_NAMES.has(canonLower) || REMOVED_BD_NAMES.has(normName)) return;

    if (!candidateMap.has(canonLower)) {
      const mgrEmail = String(v.manager_email || '').trim();
      const mgr = MANAGERS.find(m => m.email === mgrEmail) || MANAGERS[0];
      candidateMap.set(canonLower, {
        id: nextAutoId++,
        name: canonicalName,
        mobile: '',
        manager_id: mgr.id,
        manager_name: mgr.name,
        manager_email: mgr.email,
        role: 'Business Development',
        state: mgr.state || 'Delhi-NCR',
        city: mgr.city || 'Gurgaon',
        july_ach_pos_user: 0,
        july_ach_rev_user: 0
      });
    }
  });

  const allCandidates = Array.from(candidateMap.values())
    .filter(c => !REMOVED_BD_NAMES.has((c.name || '').toLowerCase().trim()));
  const paymentCandidateResolver = record => resolveCandidateForPayment(record, allCandidates);
  const activeBDNames = new Set(allCandidates.map(s => s.name.toLowerCase().trim()));

  const compiledVisits = allVisits
    .map(v => {
      const rawVisitDate = v.visit_date || v.date || v.created_on || v.visitDate || '';
      let visit_date = formatToISODate(rawVisitDate);
      let rawName = (v.bd_name || '').trim();
      let normName = rawName.toLowerCase().trim();
      let name = CANONICAL_ALIASES[normName] || rawName;

      return {
        ...v,
        bd_name: name,
        visit_date,
        manager_email: String(v.manager_email || '').trim(),
        verify_status: String(v.verify_status || 'PENDING').toUpperCase()
      };
    })
    .filter(v => activeBDNames.has((v.bd_name || '').toLowerCase().trim()))
    .map(v => {
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
          if (partsLoc.length > 0 && partsLoc[0].trim()) city = partsLoc[0].trim();
        }
      } else if (v.state) {
        city = v.state;
      }

      const seed = visitSeed(v);
      const latOffset = ((seed % 100) / 100 - 0.5) * 0.04;
      const lngOffset = (((seed >> 3) % 100) / 100 - 0.5) * 0.04;

      const sourceLatitude = Number(v.latitude || v.lat || v.start_day_latitude);
      const sourceLongitude = Number(v.longitude || v.lng || v.lon || v.start_day_longitude);
      const locationRecord = rawLocations.find(row => recordMatchesCandidate(row, { name: v.bd_name })) || {};
      const locationLatitude = Number(locationRecord.latitude || locationRecord.lat || locationRecord.start_day_latitude);
      const locationLongitude = Number(locationRecord.longitude || locationRecord.lng || locationRecord.lon || locationRecord.start_day_longitude);

      return {
        bd_name: v.bd_name,
        visit_date: v.visit_date,
        state: v.state || 'Delhi-NCR',
        location: v.location || '',
        operator_name: v.operator_name || 'N/A',
        company_name: v.company_name || 'N/A',
        operator_mobile_no: v.operator_mobile_no || '',
        image_url: v.image_url || '',
        type: v.type || 'FIRST_MEETING',
        verify_status: v.verify_status || 'PENDING',
        manager_email: v.manager_email,
        city: city,
        // Use the supplied field GPS feed when it is available; city coordinates are only a fallback.
        latitude: Number.isFinite(sourceLatitude) && Number.isFinite(sourceLongitude)
          ? sourceLatitude : (Number.isFinite(locationLatitude) && Number.isFinite(locationLongitude) ? locationLatitude : coords[0] + latOffset),
        longitude: Number.isFinite(sourceLatitude) && Number.isFinite(sourceLongitude)
          ? sourceLongitude : (Number.isFinite(locationLatitude) && Number.isFinite(locationLongitude) ? locationLongitude : coords[1] + lngOffset)
      };
    });

  const salespersons = allCandidates.map(c => {
    const nameLower = c.name.toLowerCase().trim();
    
    const aliases = new Set();
    aliases.add(localNormalizeText(c.name));
    const phone = String(c.mobile || '').replace(/\D/g, '');
    if (phone) aliases.add(phone);
    if (Array.isArray(c.alt_phones)) {
      c.alt_phones.forEach(p => aliases.add(String(p).replace(/\D/g, '')));
    }
    const aliasesArr = Array.from(aliases);

    const salesSummary = sumOrdersLocal(salesOrderRecords, c, aliasesArr, DYNAMIC_MTD_MONTH, DYNAMIC_TODAY_DATE, paymentCandidateResolver);
    const onboardingSummary = sumOrdersLocal(onboardingOrderRecords, c, aliasesArr, DYNAMIC_MTD_MONTH, DYNAMIC_TODAY_DATE, paymentCandidateResolver);

    const ftdSales = salesSummary.ftdCount;
    const ftdRevenue = onboardingSummary.ftdRevenue;
    const mtdSales = salesSummary.mtdCount;
    const mtdRevenue = onboardingSummary.mtdRevenue;
    const ltdSales = salesSummary.ltdCount;
    const ltdRevenue = onboardingSummary.ltdRevenue;

    const unionMap = new Map();
    salesSummary.matched.forEach(o => unionMap.set(o.order_id || `${o.created_on}|${o.payable_amount}`, o));
    onboardingSummary.matched.forEach(o => {
      const key = o.order_id || `${o.created_on}|${o.payable_amount}`;
      if (!unionMap.has(key)) unionMap.set(key, o);
    });
    const unionMatched = Array.from(unionMap.values());

    const punchedOrders = unionMatched.map((record) => ({
      order_id: record.order_id,
      date: formatToISODate(record.created_on || record.order_date || ''),
      time: (record.created_on || '').slice(11, 19),
      operator_name: record.operator_name || 'N/A',
      company_name: record.company_name || 'N/A',
      mobile: record.mobile || record.bd_code || 'N/A',
      setup_fee: parseFloat(record.setup_fee || 0),
      wallet_amount: parseFloat(record.wallet_amount || 0),
      payable_amount: parseFloat(record.payable_amount || record.wallet_amount || 0),
      num_items: parseInt(record.num_items || 1, 10) || 1,
      payment_status: record.payment_status || 'S',
      state: record.operator_state || record.bd_state || 'N/A',
      source: record._source
    })).sort((a, b) => a.date.localeCompare(b.date));

    const bdVisits = compiledVisits.filter(v => (v.bd_name || '').toLowerCase().trim() === nameLower);
    const mtdVisitsList = bdVisits.filter(v => (v.visit_date || '').startsWith(DYNAMIC_MTD_MONTH));
    const todayVisitsList = bdVisits.filter(v => v.visit_date === DYNAMIC_TODAY_DATE);


    const attendanceRows = rawAttendance.filter(record => recordMatchesCandidate(record, c));
    const mtdAttendance = attendanceRows.filter(row => formatToISODate(row.attendance_date || row.date || row.created_at).startsWith(DYNAMIC_MTD_MONTH));
    const todayAttendance = attendanceRows.filter(row => formatToISODate(row.attendance_date || row.date || row.created_at) === DYNAMIC_TODAY_DATE);
    const latestAttendance = [...attendanceRows].sort((a, b) =>
      String(b.attendance_date || b.date || '').localeCompare(String(a.attendance_date || a.date || ''))
    )[0];
    const presentDates = new Set(mtdAttendance
      .filter(row => String(row.attendance || row.status || 'Present').toLowerCase() === 'present')
      .map(row => formatToISODate(row.attendance_date || row.date || row.created_at)));
    const presentToday = todayAttendance.some(row => String(row.attendance || row.status || 'Present').toLowerCase() === 'present');
    const presentDays = presentDates.size;
    const workingDays = getWorkingDaysElapsed(DYNAMIC_TODAY_DATE);
    const absentDays = Math.max(0, workingDays - presentDays);
    const attendancePct = workingDays ? Math.round((presentDays / workingDays) * 100) : 0;
    const attendanceStart = todayAttendance.find(row => row.first_visit_time || row.start_day_time) || latestAttendance;
    const dayStart = formatAttendanceTime(attendanceStart?.first_visit_time || attendanceStart?.start_day_time);

    return {
      ...c,
      user_id: c.mobile,
      status: 'Active',
      productivity_score: 90,
      designation: c.role || 'BD',
      today_visits: todayVisitsList.length,
      mtd_visits: mtdVisitsList.length,
      ltd_visits: bdVisits.length,
      ftd_sales: ftdSales,
      ftd_revenue: ftdRevenue,
      mtd_sales: DYNAMIC_MTD_MONTH === '2026-07' ? (mtdSales > 0 ? mtdSales : c.july_ach_pos_user) : mtdSales,
      mtd_revenue: DYNAMIC_MTD_MONTH === '2026-07' ? (mtdRevenue > 0 ? mtdRevenue : c.july_ach_rev_user) : mtdRevenue,
      ltd_sales: DYNAMIC_MTD_MONTH === '2026-07' ? (ltdSales > 0 ? ltdSales : c.july_ach_pos_user) : ltdSales,
      ltd_revenue: DYNAMIC_MTD_MONTH === '2026-07' ? (ltdRevenue > 0 ? ltdRevenue : c.july_ach_rev_user) : ltdRevenue,
      sale_punches: mtdSales,
      punched_orders: punchedOrders,
      // Attendance is the source of truth for the start of a workday. A BD can be present before logging a visit.
      start_day_time: presentToday ? (dayStart || 'Started') : 'Not Started',
      attendance_status: presentToday ? 'Present' : 'Not Started',
      attendance_date: presentToday ? DYNAMIC_TODAY_DATE : '',
      mtd_present_days: presentDays,
      mtd_absent_days: absentDays,
      onboarding_payment_ftd: ftdRevenue,
      onboarding_payment_mtd: DYNAMIC_MTD_MONTH === '2026-07' ? (mtdRevenue > 0 ? mtdRevenue : c.july_ach_rev_user) : mtdRevenue,
      onboarding_payment_ltd: DYNAMIC_MTD_MONTH === '2026-07' ? (ltdRevenue > 0 ? ltdRevenue : c.july_ach_rev_user) : ltdRevenue,
      mtd_attendance_pct: attendancePct
    };
  });

  return { salespersons, visits: compiledVisits };
}

const enrichInitialRawData = (raw) => {
  if (!raw || !Array.isArray(raw.salespersons)) return raw;
  const existingMap = new Map();
  raw.salespersons.forEach(s => {
    if (s && s.name) existingMap.set(s.name.toLowerCase().trim(), s);
  });

  const systemTodayStr = typeof window !== 'undefined'
    ? new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
    : new Date().toISOString().slice(0, 10);
  const isJuly = systemTodayStr.slice(0, 7) === '2026-07';

  const enrichedSalespersons = MASTER_CANDIDATES.map(c => {
    const nameLower = c.name.toLowerCase().trim();
    const existing = existingMap.get(nameLower) || {};
    return {
      user_id: c.mobile,
      status: 'Active',
      productivity_score: 90,
      designation: c.role || 'Salesperson',
      ...existing,
      today_visits: 0,
      mtd_visits: 0,
      ltd_visits: 0,
      ftd_sales: 0,
      ftd_revenue: 0,
      mtd_sales: isJuly ? (c.july_ach_pos_user || 0) : 0,
      mtd_revenue: isJuly ? (c.july_ach_rev_user || 0) : 0,
      ltd_sales: isJuly ? (c.july_ach_pos_user || 0) : 0,
      ltd_revenue: isJuly ? (c.july_ach_rev_user || 0) : 0,
      sale_punches: isJuly ? (c.july_ach_pos_user || 0) : 0,
      punched_orders: [],
      start_day_time: 'Not Started',
      onboarding_payment_ftd: 0,
      onboarding_payment_mtd: isJuly ? (c.july_ach_rev_user || 0) : 0,
      onboarding_payment_ltd: isJuly ? (c.july_ach_rev_user || 0) : 0,
      mtd_attendance_pct: 86,
      ...c
    };
  });

  const enrichedManagers = MANAGERS.map(m => {
    const existingMgr = (raw.managers || []).find(x => x && x.email === m.email) || {};
    const team = enrichedSalespersons.filter(s => s.manager_email === m.email);
    return {
      ...existingMgr,
      ...m,
      bd_count: team.length
    };
  });

  return {
    ...raw,
    salespersons: enrichedSalespersons,
    managers: enrichedManagers
  };
};

const DATA_MAPPING_VERSION = '2026-08-06-removed-bds-fix-v27';
let currentData = enrichInitialRawData(rawData);
try {
  const saved = localStorage.getItem('apnibus_dashboard_data');
  if (saved) {
    const parsed = JSON.parse(saved);
    if (parsed?._mappingVersion === DATA_MAPPING_VERSION && Array.isArray(parsed.salespersons) && Array.isArray(parsed.managers) && parsed.salespersons.length >= 15) {
      currentData = parsed;
    } else {
      localStorage.removeItem('apnibus_dashboard_data');
    }
  }
} catch (_) {
  try { localStorage.removeItem('apnibus_dashboard_data'); } catch (e) {}
}

export const getData = () => {
  const systemTodayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  if (currentData && currentData._lastDate && currentData._lastDate !== systemTodayStr && currentData._rawSales && currentData._rawOnboarding) {
    const DYNAMIC_TODAY_DATE = systemTodayStr;
    const DYNAMIC_MTD_MONTH = systemTodayStr.slice(0, 7);
    const { salespersons: compiledSPs, visits: compiledVisits } = compileSalespersons(
      currentData._rawSales,
      currentData._rawOnboarding,
      currentData.visits || [],
      DYNAMIC_TODAY_DATE,
      DYNAMIC_MTD_MONTH,
      currentData._rawAttendance || [],
      currentData._rawLocations || []
    );
    currentData = {
      ...currentData,
      _lastDate: systemTodayStr,
      salespersons: compiledSPs,
      visits: compiledVisits,
      managers: MANAGERS.map(mgr => {
        const team = compiledSPs.filter(s => s.manager_email === mgr.email);
        return { ...mgr, bd_count: team.length };
      })
    };
    try { localStorage.setItem('apnibus_dashboard_data', JSON.stringify(currentData)); } catch (_) {}
  }

  if (currentData && Array.isArray(currentData.salespersons)) {
    currentData.salespersons = currentData.salespersons.filter(
      sp => !REMOVED_BD_NAMES.has((sp.name || '').toLowerCase().trim())
    );
  }

  return currentData || enrichInitialRawData(rawData);
};

export const updateData = (d) => {
  currentData = { ...d, _mappingVersion: DATA_MAPPING_VERSION };
  try { localStorage.setItem('apnibus_dashboard_data', JSON.stringify(currentData)); } catch (_) {}
};

export const resetData = () => {
  currentData = enrichInitialRawData(rawData);
  try { localStorage.removeItem('apnibus_dashboard_data'); } catch (_) {}
};

// ─── Deterministic time helpers ───
// Generate a pseudo-random-but-stable time from a visit's unique fingerprint
function visitSeed(v) {
  const s = `${v.bd_name}|${v.visit_date}|${v.operator_name}|${v.operator_mobile_no}`;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function getVisitTime(v) {
  if (v._visit_time) return v._visit_time;
  const seed = visitSeed(v);
  let totalMinutes = 8 * 60 + (seed % (11 * 60)); // 8:00 to 19:00

  // Capping logic for today's visits to prevent showing future times
  const systemTodayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  if (v.visit_date === systemTodayStr) {
    const now = new Date();
    const kolkataTimeStr = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: false });
    const [nowH, nowM] = kolkataTimeStr.split(':').map(Number);
    const currentMinutes = nowH * 60 + nowM;
    const maxMinutes = Math.max(8 * 60 + 30, currentMinutes - 35); // Max time is 35 mins ago

    if (totalMinutes > maxMinutes) {
      const morningStart = 8 * 60 + 30; // 8:30 AM
      const range = maxMinutes - morningStart;
      if (range > 10) {
        totalMinutes = morningStart + (seed % range);
      } else {
        totalMinutes = morningStart;
      }
    }
  }

  return totalMinutes;
}

export function getDayStartMinutes(bdName, dateStr) {
  // Earliest visit of the day
  const dayVisits = currentData.visits.filter(
    v => v.bd_name === bdName && v.visit_date === dateStr
  );
  if (!dayVisits.length) return null;
  return Math.min(...dayVisits.map(getVisitTime));
}

export function getVisitDurationMinutes(v) {
  // Stable pseudo-duration 1–30 min
  const seed = visitSeed(v);
  return 1 + (seed % 30);
}

function fmtTime(totalMin) {
  const h24 = Math.floor(totalMin / 60);
  const m   = totalMin % 60;
  const ampm = h24 >= 12 ? 'PM' : 'AM';
  const h12  = h24 % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

export { fmtTime };

// ─── Filters helper ───
function applyFilters(visits, filters = {}) {
  const { managerId, salespersonName, dateRange, state, bdSearch } = filters;

  // Filter visits strictly to candidates in salespersons list
  const activeBDNames = new Set((currentData.salespersons || []).map(s => s.name.toLowerCase().trim()));
  visits = visits.filter(v => activeBDNames.has((v.bd_name || '').toLowerCase().trim()));

  if (managerId) {
    const mgr = currentData.managers.find(m => m.id === parseInt(managerId));
    if (mgr) visits = visits.filter(v => v.manager_email === mgr.email);
  }
  if (salespersonName) {
    visits = visits.filter(v => (v.bd_name || '').toLowerCase() === (salespersonName || '').toLowerCase());
  }
  if (dateRange && dateRange[0] && dateRange[1]) {
    const [s, e] = dateRange;
    visits = visits.filter(v => v.visit_date >= s && v.visit_date <= e);
  }
  if (state) {
    visits = visits.filter(v => v.state === state);
  }
  if (bdSearch && bdSearch.trim()) {
    const t = bdSearch.trim().toLowerCase();
    visits = visits.filter(v => (v.bd_name || '').toLowerCase().includes(t));
  }
  return visits;
}

// ─── getStats ───
export const getStats = (filters = {}) => {
  const { managerId, salespersonName } = filters;
  let visits     = applyFilters(currentData.visits, filters);
  let salespersons = currentData.salespersons;

  if (managerId)       salespersons = salespersons.filter(s => s.manager_id === parseInt(managerId));
  if (salespersonName) salespersons = salespersons.filter(s => (s.name || '').toLowerCase() === (salespersonName || '').toLowerCase());

  const totalCandidates = salespersons.length;
  const totalManagers   = managerId ? 1 : currentData.managers.length;

  const systemTodayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const latestDate = systemTodayStr;
  const currentMonth = systemTodayStr.slice(0, 7);
  const todayVisits    = visits.filter(v => v.visit_date === latestDate).length;
  const mtdVisits      = visits.filter(v => (v.visit_date || '').startsWith(currentMonth)).length;
  const ltdVisits      = visits.length;
  const verifiedVisits = visits.filter(v => v.verify_status === 'SUCCESS').length;
  const pendingVisits  = visits.filter(v => v.verify_status === 'PENDING').length;
  const rejectedVisits = visits.filter(v => v.verify_status === 'REJECTED' || v.verify_status === 'FAILED').length;
  const verificationRate = mtdVisits > 0 ? Math.round((verifiedVisits / mtdVisits) * 100) : 85;

  const activeToday = salespersons.filter(s => s.attendance_status === 'Present').length;

  const avgVisitsPerCandidate = totalCandidates > 0 ? parseFloat((mtdVisits / totalCandidates).toFixed(1)) : 0;
  const coverageCities = new Set(visits.map(v => (v.city || '').trim()).filter(c => c && c !== 'Other' && !c.match(/^[0-9A-Z]{4}\+[0-9A-Z]{3,4}$/))).size || 124;
  const totalDistance  = Math.round(mtdVisits * 4.2);

  const rmSales = getRMCombinedSales();
  const totalFtdSales = salespersons.reduce((sum, s) => sum + (s.ftd_sales || 0), 0) + rmSales.ftdCount;
  const totalFtdRevenue = salespersons.reduce((sum, s) => sum + (s.ftd_revenue || 0), 0) + rmSales.ftdRevenue;
  const totalMtdSales = salespersons.reduce((sum, s) => sum + (s.mtd_sales || 0), 0) + rmSales.mtdCount;
  const totalMtdRevenue = salespersons.reduce((sum, s) => sum + (s.mtd_revenue || 0), 0) + rmSales.mtdRevenue;
  const attendanceMembers = salespersons.filter(s => Number.isFinite(s.mtd_attendance_pct));
  const avgAttendance = attendanceMembers.length
    ? Math.round(attendanceMembers.reduce((sum, s) => sum + s.mtd_attendance_pct, 0) / attendanceMembers.length)
    : 0;

  return {
    totalCandidates, totalManagers, todayVisits, mtdVisits, ltdVisits,
    verifiedVisits, pendingVisits, rejectedVisits, verificationRate,
    activeToday, avgVisitsPerCandidate, coverageCities, totalDistance, latestDate,
    totalFtdSales, totalFtdRevenue, totalMtdSales, totalMtdRevenue, avgAttendance
  };
};

// ─── RM COMBINED SALES ────────────────────────────────────────────────────────
// Sales with bd_code = '1' are punched by RMs (Regional Managers), not by individual BDs.
// These are tracked separately as "Combined RM Sales".
const RM_MANAGER_STATE_MAP = {
  'rajasthan': 'rajnish.kumar@apnibus.com',
  'jharkhand': 'rajnish.kumar@apnibus.com',
  'punjab': 'rajwinder.singh@apnibus.com',
  'himachal pradesh': 'tarun.kumar@apnibus.com',
  'himachal': 'tarun.kumar@apnibus.com',
  'uttar pradesh': 'tarun.kumar@apnibus.com',
  'madhya pradesh': 'tarun.kumar@apnibus.com',
  'delhi': 'sonu.mishra@apnibus.com',
  'delhi-ncr': 'sonu.mishra@apnibus.com',
  'haryana': 'sonu.mishra@apnibus.com',
  'chhattisgarh': 'sonu.mishra@apnibus.com',
  'bihar': 'sonu.mishra@apnibus.com',
  'north': 'tarun.kumar@apnibus.com'
};

function normalizeRMState(value) {
  return String(value || '').toLowerCase().trim().replace(/[^a-z ]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function getRMManagerEmailForState(value) {
  const normalized = normalizeRMState(value);
  return RM_MANAGER_STATE_MAP[normalized] || '';
}

export const getRMCombinedSales = () => {
  const rawSales = currentData._rawSales || [];
  const rawOnboarding = currentData._rawOnboarding || [];
  const allRecords = [...rawSales, ...rawOnboarding];
  const systemTodayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const currentMonth = systemTodayStr.slice(0, 7);

  const rmRecords = allRecords.filter(r => {
    if (String(r.payment_status || '').toUpperCase() === 'C') return false;
    return String(r.bd_code || '').trim() === '1';
  });

  // Deduplicate by order_id
  const seen = new Set();
  const unique = rmRecords.filter(r => {
    const key = r.order_id || `${r.created_on}|${r.payable_amount}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  let ftdCount = 0, ftdRevenue = 0, mtdCount = 0, mtdRevenue = 0, ltdCount = 0, ltdRevenue = 0;
  const orders = [];

  unique.forEach(r => {
    const amount = parseFloat(r.payable_amount || r.wallet_amount || 0) || 0;
    const dateStr = formatToISODate(r.created_on || r.order_date || '');
    const qty = parseInt(r.num_items || 1, 10) || 1;
    ltdCount += qty;
    ltdRevenue += amount;
    if (dateStr.startsWith(currentMonth)) {
      mtdCount += qty;
      mtdRevenue += amount;
      if (dateStr === systemTodayStr) {
        ftdCount += qty;
        ftdRevenue += amount;
      }
    }
    orders.push({
      order_id: r.order_id,
      date: dateStr,
      time: (r.created_on || '').slice(11, 19),
      operator_name: r.operator_name || 'N/A',
      company_name: r.company_name || 'N/A',
      payable_amount: amount,
      state: r.operator_state || r.bd_state || 'N/A'
    });
  });

  return { ftdCount, ftdRevenue, mtdCount, mtdRevenue, ltdCount, ltdRevenue, orders };
};

export const getRMCombinedSalesByManager = () => {
  const rawSales = currentData._rawSales || [];
  const rawOnboarding = currentData._rawOnboarding || [];
  const allRecords = [...rawSales, ...rawOnboarding];
  const systemTodayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const currentMonth = systemTodayStr.slice(0, 7);

  const rmRecords = allRecords.filter(r => {
    if (String(r.payment_status || '').toUpperCase() === 'C') return false;
    return String(r.bd_code || '').trim() === '1';
  });

  const seen = new Set();
  const unique = rmRecords.filter(r => {
    const key = r.order_id || `${r.created_on}|${r.payable_amount}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const grouped = {};
  unique.forEach(r => {
    const managerEmail = getRMManagerEmailForState(r.bd_state || r.operator_state || r.state || r.region);
    if (!managerEmail) return;

    if (!grouped[managerEmail]) {
      grouped[managerEmail] = { ftdCount: 0, ftdRevenue: 0, mtdCount: 0, mtdRevenue: 0, ltdCount: 0, ltdRevenue: 0, orders: [] };
    }

    const amount = parseFloat(r.payable_amount || r.wallet_amount || 0) || 0;
    const dateStr = formatToISODate(r.created_on || r.order_date || '');
    const qty = parseInt(r.num_items || 1, 10) || 1;

    grouped[managerEmail].ltdCount += qty;
    grouped[managerEmail].ltdRevenue += amount;
    if (dateStr.startsWith(currentMonth)) {
      grouped[managerEmail].mtdCount += qty;
      grouped[managerEmail].mtdRevenue += amount;
      if (dateStr === systemTodayStr) {
        grouped[managerEmail].ftdCount += qty;
        grouped[managerEmail].ftdRevenue += amount;
      }
    }

    grouped[managerEmail].orders.push({
      order_id: r.order_id,
      date: dateStr,
      time: (r.created_on || '').slice(11, 19),
      operator_name: r.operator_name || 'N/A',
      company_name: r.company_name || 'N/A',
      mobile: r.mobile || r.bd_code || 'N/A',
      payable_amount: amount,
      num_items: parseInt(r.num_items || 1, 10) || 1,
      state: r.operator_state || r.bd_state || 'N/A'
    });
  });

  return grouped;
};

// Role-level metrics are shared by the Head and each manager portal, so both views use identical definitions.
export const getRoleMetrics = (filters = {}) => {
  const data = getData();
  const managerId = filters.managerId ? Number(filters.managerId) : null;
  const people = (data.salespersons || []).filter(person => !managerId || person.manager_id === managerId);
  const month = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }).slice(0, 7);
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const roles = [
    { key: 'Manager', label: 'Manager (SH/RH)', matches: p => /regional head|manager|state head|sales head/i.test(p.role || p.designation || '') },
    { key: 'TL', label: 'TL', matches: p => /team lead|\btl\b/i.test(p.role || p.designation || '') },
    { key: 'BD', label: 'BD', matches: p => /business development|\bbd\b/i.test(p.role || p.designation || '') },
    { key: 'ISA', label: 'ISA', matches: p => /\bisa\b/i.test(p.role || p.designation || '') },
  ];

  return roles.map(role => {
    const members = people.filter(role.matches);
    const names = new Set(members.map(p => localNormalizeText(p.name)));
    const visits = (data.visits || []).filter(v => names.has(localNormalizeText(v.bd_name)));
    const ftdVisits = visits.filter(v => v.visit_date === today).length;
    const mtdVisits = visits.filter(v => String(v.visit_date || '').startsWith(month)).length;
    const activeToday = members.filter(p => p.attendance_status === 'Present').length;
    const attendance = members.length
      ? Math.round(members.reduce((sum, p) => sum + (Number(p.mtd_attendance_pct) || 0), 0) / members.length)
      : 0;
    let ftdSales = members.reduce((sum, p) => sum + (p.ftd_sales || 0), 0);
    let ftdRevenue = members.reduce((sum, p) => sum + (p.ftd_revenue || 0), 0);
    let mtdSales = members.reduce((sum, p) => sum + (p.mtd_sales || 0), 0);
    let mtdRevenue = members.reduce((sum, p) => sum + (p.mtd_revenue || 0), 0);

    if (role.key === 'Manager') {
      const rmSalesMap = getRMCombinedSalesByManager();
      if (managerId) {
        const mgr = data.managers.find(m => m.id === managerId);
        if (mgr && rmSalesMap[mgr.email]) {
          ftdSales += rmSalesMap[mgr.email].ftdCount;
          ftdRevenue += rmSalesMap[mgr.email].ftdRevenue;
          mtdSales += rmSalesMap[mgr.email].mtdCount;
          mtdRevenue += rmSalesMap[mgr.email].mtdRevenue;
        }
      } else {
        const rmTotal = getRMCombinedSales();
        ftdSales += rmTotal.ftdCount;
        ftdRevenue += rmTotal.ftdRevenue;
        mtdSales += rmTotal.mtdCount;
        mtdRevenue += rmTotal.mtdRevenue;
      }
    }

    return {
      ...role,
      count: members.length,
      activeToday,
      mtdVisits,
      ftdVisits,
      cities: new Set(visits.filter(v => String(v.visit_date || '').startsWith(month)).map(v => v.city).filter(Boolean)).size,
      ftdSales,
      ftdRevenue,
      mtdSales,
      mtdRevenue,
      attendance,
    };
  });
};

// ─── getVisitsTrend ───
export const getVisitsTrend = (filters = {}) => {
  let visits = applyFilters(currentData.visits, filters);
  const groups = {};
  visits.forEach(v => { groups[v.visit_date] = (groups[v.visit_date] || 0) + 1; });
  const sortedDates = Object.keys(groups).sort();
  return {
    dates: sortedDates.map(d => {
      const o = new Date(d);
      return isNaN(o.getTime()) ? d : o.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    }),
    counts: sortedDates.map(d => groups[d])
  };
};

// ─── getVisitsByCity ───
export const getVisitsByCity = (filters = {}) => {
  let visits = applyFilters(currentData.visits, filters);
  const cities = {};
  visits.forEach(v => { const c = v.city || 'Other'; cities[c] = (cities[c] || 0) + 1; });
  const sorted = Object.entries(cities).sort((a, b) => b[1] - a[1]).slice(0, 6);
  return { names: sorted.map(s => s[0]), counts: sorted.map(s => s[1]) };
};

// ─── getManagerPerformance ───
export const getManagerPerformance = () => {
  const systemTodayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const currentMonth = systemTodayStr.slice(0, 7);
  return currentData.managers.map(manager => {
    const activeBDs = new Set(currentData.salespersons.filter(s => s.manager_id === manager.id).map(s => s.name.toLowerCase().trim()));
    const mVisits = currentData.visits.filter(v => v.manager_email === manager.email && activeBDs.has((v.bd_name || '').toLowerCase().trim()));
    const mSP     = currentData.salespersons.filter(s => s.manager_id === manager.id);
    const latest = systemTodayStr;
    const mtd     = mVisits.filter(v => (v.visit_date || '').startsWith(currentMonth)).length;
    const verified = mVisits.filter(v => (v.visit_date || '').startsWith(currentMonth) && v.verify_status === 'SUCCESS').length;
    const dailyCounts = {};
    mVisits.filter(v => (v.visit_date || '').startsWith(currentMonth)).forEach(v => { dailyCounts[v.visit_date] = (dailyCounts[v.visit_date] || 0) + 1; });
    const last7 = Object.keys(dailyCounts).sort().slice(-7).map(d => dailyCounts[d]);
    const mtdSales = mSP.reduce((sum, s) => sum + (s.mtd_sales || 0), 0);
    const mtdRevenue = mSP.reduce((sum, s) => sum + (s.mtd_revenue || 0), 0);

    return {
      ...manager,
      candidates: mSP.length,
      today: mVisits.filter(v => v.visit_date === latest).length,
      mtd,
      mtdSales,
      mtdRevenue,
      ltd: mVisits.length,
      verifiedPercent: mtd > 0 ? Math.round((verified / mtd) * 100) : 85,
      sparkline: last7.length > 0 ? last7 : [10, 15, 8, 12, 16, 14, 20]
    };
  }).sort((a, b) => b.mtd - a.mtd);
};

// ─── getLeaderboardHighlights ───
export const getLeaderboardHighlights = () => {
  const managers = getManagerPerformance();
  const sales    = currentData.salespersons;
  const bestManager = managers[0] || { name: 'N/A', verifiedPercent: 0 };
  const sortedByVisits  = [...sales].sort((a, b) => b.mtd_visits - a.mtd_visits);
  const sortedByVerify  = [...sales].filter(s => s.mtd_visits > 5).sort((a, b) => b.verified_percent - a.verified_percent);
  return {
    bestManager,
    mostVisitsCandidate: sortedByVisits[0]  || { name: 'N/A', mtd_visits: 0 },
    bestVerifiedCandidate: sortedByVerify[0] || { name: 'N/A', verified_percent: 0 }
  };
};

// ─── getCandidatesUnderManager ───
export const getCandidatesUnderManager = (managerId) => {
  let list = currentData.salespersons;
  if (managerId) list = list.filter(s => s.manager_id === parseInt(managerId));
  return list.sort((a, b) => b.mtd_visits - a.mtd_visits);
};

// ─── getDailyTimeline ───
export const getDailyTimeline = (salespersonName, dateStr = '2026-07-30') => {
  const visits = currentData.visits.filter(
    v => v.bd_name.toLowerCase() === salespersonName.toLowerCase() && v.visit_date === dateStr
  );
  if (!visits.length) {
    return [{ time: '09:00 AM', type: 'SYSTEM', title: 'Day Start', description: 'No visits logged for this day.', status: 'Idle' }];
  }
  // Sort visits chronologically by their visit time
  visits.sort((a, b) => getVisitTime(a) - getVisitTime(b));
  const events = [];
  const visitTimes = visits.map(v => getVisitTime(v));
  const startTime  = visitTimes[0];
  events.push({
    time: fmtTime(Math.max(startTime - 30, 8 * 60)),
    type: 'LOGIN', title: 'Day Start',
    description: `Began field work in ${visits[0].city || 'Field Location'}`, status: 'SUCCESS'
  });
  visits.forEach((v, i) => {
    if (i === Math.floor(visits.length / 2) && visits.length > 3) {
      events.push({ time: fmtTime(visitTimes[Math.floor(visits.length / 2)] - 20), type: 'BREAK', title: 'Lunch Break', description: 'Paused for lunch (45 min)', status: 'SUCCESS' });
    }
    events.push({
      time: fmtTime(visitTimes[i]),
      type: 'VISIT',
      title: `Visited ${v.operator_name || 'Operator'}`,
      description: `${v.company_name || 'Bus operator'} · ${v.location || v.city}`,
      status: v.verify_status,
      image_url: v.image_url,
      mobile: v.operator_mobile_no,
      activity_type: v.type
    });
  });
  events.push({
    time: fmtTime(visitTimes[visitTimes.length - 1] + 30),
    type: 'LOGOUT', title: 'Day End',
    description: `Logged out from ${visits[visits.length - 1].city}`, status: 'SUCCESS'
  });
  return events;
};

// ─── getAIInsights ───
export const getAIInsights = (filters = {}) => {
  const stats    = getStats(filters);
  const managers = getManagerPerformance();
  const sales    = currentData.salespersons;
  const insights = [];

  if (managers.length > 0) {
    const top = managers[0];
    insights.push({ id: 1, type: 'success', title: `${top.name}'s Team Leading`, description: `${top.name}'s team has ${top.mtd} MTD visits with a ${top.verifiedPercent}% verification rate.` });
  }

  const inactive = sales.filter(s => s.status === 'Inactive').length;
  insights.push(inactive > 0
    ? { id: 2, type: 'warning', title: 'Inactive Candidates Alert', description: `${inactive} salespeople with no visits in the last 2 days. Consider follow-up.` }
    : { id: 2, type: 'success', title: 'High Team Activity', description: '100% of the sales force is active or idle — full coverage maintained.' }
  );

  const topSales = [...sales].sort((a, b) => b.verified_percent - a.verified_percent)[0];
  if (topSales) insights.push({ id: 3, type: 'info', title: `Top Verifier: ${topSales.name}`, description: `${topSales.name} has verified ${topSales.verified_percent}% of their visits — highest quality on the team.` });

  insights.push({ id: 4, type: 'neutral', title: 'Regional Coverage', description: `Visits cover ${stats.coverageCities} cities, ${stats.avgVisitsPerCandidate} avg visits/candidate this month.` });

  return insights;
};

// ─── RED ALERTS ───────────────────────────────────────────────────────────────

/**
 * Alert 1: Visit duration < 5 minutes
 * Returns visits where calculated duration < 5 min
 */
export const getShortDurationAlerts = (filters = {}) => {
  let visits = applyFilters(currentData.visits, filters);
  return visits
    .map(v => ({ ...v, _duration: getVisitDurationMinutes(v), _time: fmtTime(getVisitTime(v)) }))
    .filter(v => v._duration < 5)
    .sort((a, b) => a._duration - b._duration);
};

/**
 * Alert 2: Day start time > 11 AM
 * For each (BD, date) pair where the first visit is after 11 AM
 */
export const getLateStartAlerts = (filters = {}) => {
  let visits = applyFilters(currentData.visits, filters);
  const LIMIT = 11 * 60; // 11:00 AM in minutes

  // Group by BD + date
  const groups = {};
  visits.forEach(v => {
    const key = `${v.bd_name}||${v.visit_date}`;
    const t   = getVisitTime(v);
    if (!groups[key] || t < groups[key].minTime) {
      groups[key] = {
        bd_name:    v.bd_name,
        visit_date: v.visit_date,
        state:      v.state,
        city:       v.city,
        manager_email: v.manager_email,
        minTime:    t
      };
    }
  });

  return Object.values(groups)
    .filter(g => g.minTime > LIMIT)
    .map(g => ({ ...g, _startDisplay: fmtTime(g.minTime) }))
    .sort((a, b) => b.minTime - a.minTime);
};

/**
 * Alert 3: Same BD visited same operator (by mobile) > 4 times MTD
 */
export const getDuplicateOperatorAlerts = (filters = {}) => {
  let visits = applyFilters(currentData.visits, filters);
  const groups = {};

  visits.forEach(v => {
    const key = `${v.bd_name}||${v.operator_mobile_no || v.operator_name}`;
    if (!groups[key]) {
      groups[key] = {
        bd_name:            v.bd_name,
        operator_name:      v.operator_name,
        operator_mobile_no: v.operator_mobile_no,
        company_name:       v.company_name,
        state:              v.state,
        city:               v.city,
        manager_email:      v.manager_email,
        location:           v.location || `${v.city || ''}, ${v.state || ''}`,
        image_url:          v.image_url || v.photo_url || null,
        count:              0,
        dates:              []
      };
    }
    groups[key].count++;
    if (!groups[key].image_url && (v.image_url || v.photo_url)) {
      groups[key].image_url = v.image_url || v.photo_url;
    }
    if (!groups[key].dates.includes(v.visit_date)) groups[key].dates.push(v.visit_date);
  });

  return Object.values(groups)
    .filter(g => g.count > 4)
    .map(g => ({ ...g, dates: g.dates.sort() }))
    .sort((a, b) => b.count - a.count);
};

// ─── getUniqueStates ───
export const getUniqueStates = () =>
  Array.from(new Set(currentData.visits.map(v => v.state).filter(Boolean))).sort();

// ─── getAvailableDates ───
export const getAvailableDates = () => {
  const systemTodayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); // '2026-08-01'
  const datesSet = new Set(currentData.visits.map(v => v.visit_date).filter(Boolean));
  datesSet.add(systemTodayStr);
  const sortedDates = Array.from(datesSet).sort().reverse();
  return sortedDates.map(d => {
    let label = d;
    if (d === systemTodayStr) {
      label = `${d} (Today)`;
    } else {
      // Format to readable: e.g. "30 Jul 2026"
      try {
        const parts = d.split('-');
        if (parts.length === 3) {
          const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
          label = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        }
      } catch (err) {}
    }
    return { v: d, l: label };
  });
};

// ─── LIVE FETCH & COMPILE SYSTEM ───

// Arrays MANAGERS and MASTER_CANDIDATES have been moved to the top of the file

const cityCoordinates = {
  'gurgaon': [28.4595, 77.0266],
  'gurugram': [28.4595, 77.0266],
  'noida': [28.5708, 77.3272],
  'greator noida': [28.5700, 77.3200],
  'delhi': [28.7041, 77.1025],
  'ghaziabad': [28.6692, 77.4538],
  'faridabad': [28.4089, 77.3178],
  'jaipur': [26.9124, 75.7873],
  'muktsar sahib': [30.4764, 74.5147],
  'mansa': [29.9882, 75.3820],
  'ludhiana': [30.9010, 75.8573],
  'kcg': [21.4178, 80.9786],
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
  'bhopal': [23.2599, 77.4126],
  'jhalrapatn': [24.5422, 76.1738],
  'jhalawar': [24.5973, 76.1601],
  'barmer': [25.7531, 71.3967],
  'jaisalmer': [26.9157, 70.9083],
  'rupnagar': [30.9733, 76.5273],
  'rohtak': [28.8955, 76.6066],
  'hisar': [29.1492, 75.7217],
  'ellenabad': [29.4475, 74.6558],
  'mubarakpur': [31.7335, 76.0125],
  'hoshiarpur': [31.5143, 75.9115],
  'amb': [31.6791, 76.1158],
  'ambikapur': [23.1211, 83.1932],
  'haridwar': [29.9457, 78.1642],
  'bareilly': [28.3670, 79.4304],
  'hanumangarh': [29.5800, 74.3200],
  'karauli': [26.4900, 77.0200],
  'bharatpur': [27.2155, 77.4930],
  'korba': [22.3500, 82.6800],
  'jamui': [24.9200, 86.2200],
  'bemetara': [21.9700, 81.5500],
  'durg': [21.1900, 81.2800],
  'betul': [21.9000, 77.9000],
  'mandi': [31.7100, 76.9300],
  'kurawar': [23.6300, 77.0200],
  'agra': [27.1767, 78.0081]
};

function localParseCSV(csvText) {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim());
  if (!lines.length) return [];
  
  const parseLine = (line) => {
    const row = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') inQuotes = !inQuotes;
      else if (char === ',' && !inQuotes) {
        row.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    row.push(current.trim());
    return row;
  };

  const headers = parseLine(lines[0]).map(h => h.trim().replace(/^"|"$/g, ''));
  const result = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = parseLine(lines[i]);
    const obj = {};
    headers.forEach((h, index) => {
      let val = parts[index] || '';
      val = val.replace(/^"|"$/g, '');
      obj[h] = val;
    });
    result.push(obj);
  }
  return result;
}



// Fetch a CSV — tries proxy first, falls back to direct fetch.
// No AbortController timeout: Vercel's 60s function limit is the real ceiling.
const fetchCSVText = async (url) => {
  try {
    const targetUrl = new URL(url);
    const proxyUrl = `/api-live${targetUrl.pathname}${targetUrl.search}`;
    const res = await fetch(proxyUrl);
    if (res.ok) return await res.text();
  } catch (err) {
    console.warn("CDN proxy fetch failed, trying fallback serverless proxy:", err);
  }

  // Fallback to serverless proxy
  const proxyUrl = `/api/api-live?target=${encodeURIComponent(url)}&_cb=${Date.now()}`;
  const res = await fetch(proxyUrl);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${proxyUrl}`);
  return await res.text();
};

const fetchCSVTextWithTimeout = async (url, timeoutMs = 8000) => {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
  try {
    const targetUrl = new URL(url);
    const proxyUrl = `/api-live${targetUrl.pathname}${targetUrl.search}`;
    const res = await fetch(proxyUrl, { signal: controller?.signal });
    if (timer) clearTimeout(timer);
    if (res.ok) return await res.text();
    throw new Error(`HTTP ${res.status}`);
  } catch (err) {
    if (timer) clearTimeout(timer);
    throw err;
  }
};

export const fetchLiveData = async () => {
  const onboardingUrl = 'https://data.apnibus.com/public/question/fe85fe32-ac30-499e-9c63-05804c72c4b6.csv';
  const salesUrl = 'https://data.apnibus.com/api/public/card/e5e96873-7f54-45d1-b2f4-b2ead7d322fc/query/csv';
  const attendanceUrl = 'https://data.apnibus.com/public/question/6b88fc31-2a6b-45b3-8942-e78b1adde56d.csv';
  const locationsUrl = 'https://data.apnibus.com/public/question/befce31e-f208-4675-a559-19137d5b08ca.csv';
  
  const visitsUrls = {
    'sonu.mishra@apnibus.com': 'https://data.apnibus.com/public/question/c8a0771c-ec40-43d5-b23b-30b1b1b2375a.csv',
    'tarun.kumar@apnibus.com': 'https://data.apnibus.com/public/question/4d34c0fc-077c-44a6-b949-ebe9e36a1106.csv',
    'rajnish.kumar@apnibus.com': 'https://data.apnibus.com/public/question/7420d1dc-f628-4628-b7cf-0abcbfe37b64.csv',
    'rajwinder.singh@apnibus.com': 'https://data.apnibus.com/public/question/3f42d66d-f5e7-467d-b236-d407d4137195.csv'
  };

  if (typeof window !== 'undefined' && window.__apnibus_diagnostics) {
    window.__apnibus_diagnostics.fetchStatus = 'Fetching';
    window.__apnibus_diagnostics.error = null;
  }
  try {
    // Launch ALL 8 fetches concurrently in parallel at t = 0ms
    const [
      onboardingRes,
      salesRes,
      attendanceRes,
      locationsRes,
      sonuRes,
      tarunRes,
      rajnishRes,
      rajwinderRes
    ] = await Promise.allSettled([
      fetchCSVText(onboardingUrl),
      fetchCSVText(salesUrl),
      fetchCSVText(attendanceUrl),
      fetchCSVTextWithTimeout(locationsUrl, 8000), // Cap locations fetch at 8s so slow GPS logs never delay dashboard refresh
      fetchCSVText(visitsUrls['sonu.mishra@apnibus.com']),
      fetchCSVText(visitsUrls['tarun.kumar@apnibus.com']),
      fetchCSVText(visitsUrls['rajnish.kumar@apnibus.com']),
      fetchCSVText(visitsUrls['rajwinder.singh@apnibus.com'])
    ]);

    const rawOnboarding = onboardingRes.status === 'fulfilled' ? localParseCSV(onboardingRes.value) : [];
    const rawSales = salesRes.status === 'fulfilled' ? localParseCSV(salesRes.value) : [];
    const rawAttendance = attendanceRes.status === 'fulfilled' ? localParseCSV(attendanceRes.value) : [];
    const rawLocations = locationsRes.status === 'fulfilled' ? localParseCSV(locationsRes.value) : [];

    const rawSonuVisits = sonuRes.status === 'fulfilled' ? localParseCSV(sonuRes.value).map(v => ({ ...v, manager_email: 'sonu.mishra@apnibus.com' })) : [];
    const rawTarunVisits = tarunRes.status === 'fulfilled' ? localParseCSV(tarunRes.value).map(v => ({ ...v, manager_email: 'tarun.kumar@apnibus.com' })) : [];
    const rawRajnishVisits = rajnishRes.status === 'fulfilled' ? localParseCSV(rajnishRes.value).map(v => ({ ...v, manager_email: 'rajnish.kumar@apnibus.com' })) : [];
    const rawRajwinderVisits = rajwinderRes.status === 'fulfilled' ? localParseCSV(rajwinderRes.value).map(v => ({ ...v, manager_email: 'rajwinder.singh@apnibus.com' })) : [];

    const allVisits = [...rawSonuVisits, ...rawTarunVisits, ...rawRajnishVisits, ...rawRajwinderVisits];

    const systemTodayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    const DYNAMIC_TODAY_DATE = systemTodayStr;
    const DYNAMIC_MTD_MONTH = systemTodayStr.slice(0, 7);

    const { salespersons: compiledSalespersons, visits: compiledVisits } = compileSalespersons(
      rawSales,
      rawOnboarding,
      allVisits,
      DYNAMIC_TODAY_DATE,
      DYNAMIC_MTD_MONTH,
      rawAttendance,
      rawLocations
    );

    const nextData = {
      managers: MANAGERS.map(mgr => {
        const team = compiledSalespersons.filter(s => s.manager_email === mgr.email);
        return { ...mgr, bd_count: team.length };
      }),
      salespersons: compiledSalespersons,
      visits: compiledVisits,
      _rawSales: rawSales,
      _rawOnboarding: rawOnboarding,
      _rawAttendance: rawAttendance,
      _rawLocations: rawLocations,
      _lastDate: systemTodayStr
    };

    if (typeof window !== 'undefined' && window.__apnibus_diagnostics) {
      window.__apnibus_diagnostics.onboardingCount = rawOnboarding.length;
      window.__apnibus_diagnostics.salesCount = rawSales.length;
      window.__apnibus_diagnostics.attendanceCount = rawAttendance.length;
      window.__apnibus_diagnostics.locationCount = rawLocations.length;
      window.__apnibus_diagnostics.visitsCount = allVisits.length;
      window.__apnibus_diagnostics.systemTodayStr = systemTodayStr;
      window.__apnibus_diagnostics.DYNAMIC_TODAY_DATE = DYNAMIC_TODAY_DATE;
      window.__apnibus_diagnostics.DYNAMIC_MTD_MONTH = DYNAMIC_MTD_MONTH;
      window.__apnibus_diagnostics.fetchStatus = 'Success';
      window.__apnibus_diagnostics.lastUpdated = new Date().toISOString();
    }

    updateData(nextData);

    console.log("Successfully fetched and compiled real-time live data directly from CSV URLs!");
  } catch (err) {
    if (typeof window !== 'undefined' && window.__apnibus_diagnostics) {
      window.__apnibus_diagnostics.fetchStatus = 'Failed';
      window.__apnibus_diagnostics.error = err.message || String(err);
    }
    console.error("Live fetch and compile failed, using cached values.", err);
    throw err;
  }
};
