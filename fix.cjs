const fs = require('fs');
const files = [
  'src/pages/dashboard/DashboardLayout.jsx',
  'src/pages/dashboard/TransactionHistory.jsx',
  'src/pages/dashboard/SellCrypto.jsx'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf8');
    const newContent = content.replace(/\\\$/g, '$').replace(/\\`/g, '`');
    fs.writeFileSync(f, newContent);
    console.log(`Fixed ${f}`);
  }
});
