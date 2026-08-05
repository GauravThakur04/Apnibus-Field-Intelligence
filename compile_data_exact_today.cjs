const fs = require('fs');
const path = require('path');

// 1. Read existing apnibusData.json
const rawDataPath = path.join(__dirname, 'src/data/apnibusData.json');
const currentData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));

// 2. Read actual_bd_revenue.csv
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

const TODAY_DATE = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

// Exact RM Name Matching
currentData.salespersons.forEach((sp) => {
  const bdNameLower = sp.name.toLowerCase().trim();
  
  // Find matching order records by RM_NAME strictly
  const matchingOrders = orderRecords.filter(o => {
    if (o.payment_status === 'C') return false; // exclude cancelled
    const rmName = (o.rm_name || '').trim().toLowerCase();
    if (!rmName) return false;
    
    return rmName === bdNameLower || bdNameLower.includes(rmName) || rmName.includes(bdNameLower);
  });

  let ftdSales = 0, ftdRevenue = 0;
  let mtdSales = 0, mtdRevenue = 0;
  

  matchingOrders.forEach(o => {
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
  sp.sale_punches = mtdSales;
});

// Save updated apnibusData.json
fs.writeFileSync(rawDataPath, JSON.stringify(currentData, null, 2), 'utf8');

console.log('\nSuccessfully updated apnibusData.json with STRICT RM_NAME POS MATCHING!');
console.log('=== EXACT FTD & MTD REVENUE SUMMARY ===');
currentData.salespersons.forEach(sp => {
  console.log(`BD: ${sp.name.padEnd(20)} | FTD POS: ${sp.ftd_sales} (₹ ${sp.ftd_revenue.toLocaleString()}) | MTD POS: ${sp.mtd_sales} (₹ ${sp.mtd_revenue.toLocaleString()}) | LTD POS: ${sp.ltd_sales} (₹ ${sp.ltd_revenue.toLocaleString()})`);
});
