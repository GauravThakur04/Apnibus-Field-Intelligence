const fs = require('fs');
const path = require('path');

// 1. Read existing apnibusData.json
const rawDataPath = path.join(__dirname, 'src/data/apnibusData.json');
const currentData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));

// 2. Read actual_bd_revenue.csv (e5e96873-7f54-45d1-b2f4-b2ead7d322fc.csv)
const csvPath = path.join(__dirname, 'src/data/actual_bd_revenue.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') inQuotes = !inQuotes;
    else if (char === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
    else current += char;
  }
  result.push(current.trim());
  return result;
}

const lines = csvContent.split('\n');
const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

const orderRecords = [];
for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  const parts = parseCSVLine(lines[i]);
  if (parts.length < 5) continue;
  
  const rec = {};
  headers.forEach((h, idx) => { rec[h] = parts[idx] || ''; });
  orderRecords.push(rec);
}

console.log(`Loaded ${orderRecords.length} actual revenue order records.`);

// Master Alias Map for exact candidate lookup
const ALIAS_MAP = {
  '8709016324': 'anand kumar singh',
  'anand kumar singh': 'anand kumar singh',
  'anand kumar': 'anand kumar singh',

  '8619414557': 'sarfaraj khan',
  'sarfaraj khan': 'sarfaraj khan',

  '7568612974': 'manish bhati',
  'manish bhati': 'manish bhati',
  'manish bathi': 'manish bhati',

  '7891064831': 'shiv dayal',
  'shiv dayal': 'shiv dayal',

  '9694255341': 'anil kumar',
  'anil kumar': 'anil kumar',

  '9805254456': 'harish verma',
  'harish verma': 'harish verma',
  'manish verma': 'harish verma',

  '7018778473': 'shubham dhiman',
  'shubham dhiman': 'shubham dhiman',

  '8000304871': 'arshdeep singh',
  'arshdeep singh': 'arshdeep singh',

  '9799862695': 'chuna ram',
  'chuna ram': 'chuna ram',

  '8219990300': 'vivek kumar kaundal',
  'vivek kumar kaundal': 'vivek kumar kaundal',

  '9805472672': 'karan raina',
  'karan raina': 'karan raina',

  '9953226633': 'syed arshi abrar',
  'syed arshi abrar': 'syed arshi abrar',

  '9814201669': 'rahul kumar uppal',
  'rahul kumar uppal': 'rahul kumar uppal',

  '8447780900': 'akash singh',
  'akash singh': 'akash singh',

  '7355982328': 'shubham singh',
  'shubham singh': 'shubham singh',

  '8750710855': 'sonu mishra',
  '9315883000': 'sonu mishra',
  'sonu mishra': 'sonu mishra',

  '9306703845': 'sukhdev singh',
  'sukhdev singh': 'sukhdev singh',

  '9877674046': 'surinder singh',
  'surinder singh': 'surinder singh',

  '7888436876': 'rajat sharma',
  'rajat sharma': 'rajat sharma'
};

const TODAY_DATE = '2026-07-30';

// Calculate exact candidate stats
currentData.salespersons.forEach((sp) => {
  const nameLower = sp.name.toLowerCase().trim();
  
  let ftdSales = 0, ftdRevenue = 0;
  let mtdSales = 0, mtdRevenue = 0;
  let ltdSales = 0, ltdRevenue = 0;

  orderRecords.forEach(o => {
    if (o.payment_status === 'C') return; // exclude cancelled orders
    
    const rm = (o.rm_name || '').trim().toLowerCase();
    const code = (o.bd_code || '').trim();

    const matchedKey = ALIAS_MAP[code] || ALIAS_MAP[rm];
    const isMatch = matchedKey === nameLower || rm === nameLower;
    if (!isMatch) return;

    const qty = parseInt(o.num_items) || 1;
    const amt = parseFloat(o.payable_amount) || parseFloat(o.wallet_amount) || 0;
    const dateStr = (o.created_on || '').slice(0, 10);

    ltdSales += qty;
    ltdRevenue += amt;

    if (dateStr.startsWith('2026-07')) {
      mtdSales += qty;
      mtdRevenue += amt;
    }

    if (dateStr === TODAY_DATE) {
      ftdSales += qty;
      ftdRevenue += amt;
    }
  });

  sp.ftd_sales = ftdSales;
  sp.ftd_revenue = ftdRevenue;
  sp.mtd_sales = mtdSales;
  sp.mtd_revenue = mtdRevenue;
  sp.ltd_sales = ltdSales;
  sp.ltd_revenue = ltdRevenue;
  sp.sale_punches = mtdSales;
});

// Save updated apnibusData.json
fs.writeFileSync(rawDataPath, JSON.stringify(currentData, null, 2), 'utf8');

console.log('Successfully updated apnibusData.json with MASTER REVENUE DATA!');
console.log('=== MASTER REVENUE MATCHING RESULTS ===');
currentData.salespersons.forEach(sp => {
  console.log(`BD: ${sp.name.padEnd(20)} | FTD: ${sp.ftd_sales} (₹ ${sp.ftd_revenue.toLocaleString()}) | MTD: ${sp.mtd_sales} (₹ ${sp.mtd_revenue.toLocaleString()}) | LTD: ${sp.ltd_sales} (₹ ${sp.ltd_revenue.toLocaleString()})`);
});
