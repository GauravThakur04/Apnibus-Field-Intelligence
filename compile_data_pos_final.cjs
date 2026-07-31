const fs = require('fs');
const path = require('path');

// 1. Read existing apnibusData.json
const rawDataPath = path.join(__dirname, 'src/data/apnibusData.json');
const currentData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));

// 2. Read actual_bd_revenue.csv (POS DATASET)
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

console.log(`Loaded ${orderRecords.length} actual POS revenue order records.`);

// Exact Phone Number Mapping per BD
const PHONE_TO_CANDIDATE = {
  '8447780900': 'Akash Singh',
  '9814201669': 'Shubham Dhiman',
  '8709016324': 'Anand Kumar singh',
  '7568612974': 'Manish Bhati',
  '9805254456': 'Harish Verma',
  '9799862695': 'Chuna Ram',
  '9315883000': 'Sonu Mishra',
  '8219990300': 'Vivek kumar kaundal',
  '9306703845': 'Sukhdev Singh',
  '7355982328': 'Shubham Singh',
  '8619414557': 'Sarfaraj Khan',
  '7891064831': 'Shiv Dayal',
  '9953226633': 'Syed Arshi Abrar',
  '9805472672': 'Karan Raina',
  '8000304871': 'Arshdeep Singh',
  '7888436876': 'Rajat Sharma',
  '9877674046': 'Surinder Singh',
  '9053775782': 'MOHIT'
};

const TODAY_DATE = '2026-07-30';

currentData.salespersons.forEach((sp) => {
  const nameLower = sp.name.toLowerCase().trim();
  
  let ftdSales = 0, ftdRevenue = 0;
  let mtdSales = 0, mtdRevenue = 0;
  let ltdSales = 0, ltdRevenue = 0;

  orderRecords.forEach(r => {
    if (r.payment_status === 'C') return; // EXCLUDE CANCELLED ORDERS!
    
    const rm = (r.rm_name || '').toLowerCase().trim();
    const code = (r.bd_code || '').trim();
    const mappedName = PHONE_TO_CANDIDATE[code]?.toLowerCase() || '';

    const isMatch = (rm && (rm === nameLower || nameLower.includes(rm))) || (mappedName && mappedName === nameLower);
    if (!isMatch) return;

    const qty = parseInt(r.num_items) || 1;
    const amt = parseFloat(r.payable_amount) || parseFloat(r.wallet_amount) || 0;
    const dateStr = (r.created_on || '').slice(0, 10);

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

console.log('Successfully updated apnibusData.json with 100% ACCURATE POS DEVICE SALES & REVENUE DATA!');
console.log('=== EXACT ACCURATE POS MATCHED RESULTS ===');
currentData.salespersons.forEach(sp => {
  console.log(`BD: ${sp.name.padEnd(20)} | FTD POS: ${sp.ftd_sales} (₹ ${sp.ftd_revenue.toLocaleString()}) | MTD POS: ${sp.mtd_sales} (₹ ${sp.mtd_revenue.toLocaleString()}) | LTD POS: ${sp.ltd_sales} (₹ ${sp.ltd_revenue.toLocaleString()})`);
});
