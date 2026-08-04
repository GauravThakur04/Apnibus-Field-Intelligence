const fs = require('fs');
const path = require('path');

// 1. Read existing apnibusData.json
const rawDataPath = path.join(__dirname, 'src/data/apnibusData.json');
const currentData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));

// 2. Read ONLY actual_bd_revenue.csv
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

console.log(`Loaded ${orderRecords.length} actual revenue order records from e5e96873-7f54-45d1-b2f4-b2ead7d322fc.csv.`);

// Phone to BD name mapping helper
const PHONE_BD_MAP = {
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

// Process each salesperson with 100% EXCLUSIVE REVENUE FROM e5e96873-7f54-45d1-b2f4-b2ead7d322fc.csv
currentData.salespersons.forEach((sp) => {
  const bdNameLower = sp.name.toLowerCase().trim();
  const phones = sp.phone_numbers || [];
  
  // Find matching order records ONLY from e5e96873-7f54-45d1-b2f4-b2ead7d322fc.csv
  const matchingOrders = orderRecords.filter(o => {
    if (o.payment_status && o.payment_status !== 'S') return false; // successful payments only
    const rmName = (o.rm_name || '').trim().toLowerCase();
    const bdCode = (o.bd_code || '').trim();
    
    if (rmName && rmName === bdNameLower) return true;
    if (rmName && bdNameLower.includes(rmName)) return true;
    if (bdCode && PHONE_BD_MAP[bdCode]?.toLowerCase() === bdNameLower) return true;
    if (bdCode && phones.includes(bdCode)) return true;
    return false;
  });

  // Calculate Today (FTD), MTD, and LTD Sales & Revenue EXCLUSIVELY from CSV
  let ftdSales = 0;
  let ftdRevenue = 0;
  let mtdSales = 0;
  let mtdRevenue = 0;


  matchingOrders.forEach(o => {
    const dateStr = (o.created_on || '').slice(0, 10);
    const amount = parseFloat(o.payable_amount) || parseFloat(o.wallet_amount) || 0;

    ltdSales += 1;
    ltdRevenue += amount;

    if (dateStr.startsWith('2026-07')) {
      mtdSales += 1;
      mtdRevenue += amount;
    }

    if (dateStr === TODAY_DATE) {
      ftdSales += 1;
      ftdRevenue += amount;
    }
  });

  sp.ftd_sales = ftdSales;
  sp.ftd_revenue = ftdRevenue;
  sp.mtd_sales = mtdSales;
  sp.mtd_revenue = mtdRevenue;
  sp.sale_punches = mtdSales;
});

// Save updated apnibusData.json
fs.writeFileSync(rawDataPath, JSON.stringify(currentData, null, 2), 'utf8');

console.log('\nSuccessfully updated apnibusData.json with EXCLUSIVE REVENUE CSV DATA!');
console.log('=== EXACT ACTUAL REVENUE MATCHING FROM CSV ===');
let totalCompanyRev = 0;
let totalCompanySales = 0;
currentData.salespersons.forEach(sp => {
  totalCompanyRev += sp.mtd_revenue;
  totalCompanySales += sp.mtd_sales;
  console.log(`BD: ${sp.name.padEnd(20)} | FTD: ${sp.ftd_sales} (₹ ${sp.ftd_revenue.toLocaleString()}) | MTD: ${sp.mtd_sales} (₹ ${sp.mtd_revenue.toLocaleString()})`);
});

console.log(`\nTOTAL COMPANY MTD SALES: ${totalCompanySales}`);
console.log(`TOTAL COMPANY MTD REVENUE: ₹ ${totalCompanyRev.toLocaleString()} (₹ ${(totalCompanyRev / 100000).toFixed(2)} L)`);
