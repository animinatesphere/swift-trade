const fs = require('fs');
const fpath = 'c:/Users/USER/Desktop/WORK STATION/JAVASCRIPT/swift-front/src/pages/dashboard/SellCrypto.jsx';
let c = fs.readFileSync(fpath, 'utf-8');

// Fix line endings for consistency
const NL = c.includes('\r\n') ? '\r\n' : '\n';

// 1. Add api import 
c = c.replace(
  `import React, { useState, useEffect } from "react";${NL}import { useOutletContext } from "react-router-dom";`,
  `import React, { useState, useEffect } from "react";${NL}import { useOutletContext } from "react-router-dom";${NL}import api from "../../api/axios";`
);

// 2. Remove SPREAD, change RATE_TTL to 300
c = c.replace(
  `const SPREAD   = 0.04;${NL}const RATE_TTL = 60;`,
  `const RATE_TTL = 300;`
);

// 3. Remove hardcoded rate from COINS
c = c.replace(
  `const COINS = [${NL}  { id:"USDT", name:"Tether",   icon:"₮", color:"#26A17B", bg:"rgba(38,161,123,0.15)",  rate:1592,     networks:["TRC20","ERC20"] },${NL}  { id:"BTC",  name:"Bitcoin",  icon:"₿", color:"#F7931A", bg:"rgba(247,147,26,0.15)",  rate:98240000, networks:["Bitcoin"]       },${NL}  { id:"ETH",  name:"Ethereum", icon:"Ξ", color:"#627EEA", bg:"rgba(98,126,234,0.15)",  rate:3420000,  networks:["ERC20"]         },${NL}  { id:"USDC", name:"USD Coin", icon:"◎", color:"#0072FF", bg:"rgba(0,114,255,0.15)",   rate:1590,     networks:["ERC20","SOL"]   },${NL}  { id:"BNB",  name:"BNB",      icon:"⬡", color:"#F3BA2F", bg:"rgba(243,186,47,0.15)",  rate:920000,   networks:["BEP20"]         },${NL}  { id:"SOL",  name:"Solana",   icon:"◎", color:"#9945FF", bg:"rgba(153,69,255,0.15)",  rate:218400,   networks:["SOL"]           },${NL}];`,
  `const COINS = [${NL}  { id:"USDT", name:"Tether",   icon:"₮", color:"#26A17B", bg:"rgba(38,161,123,0.15)",  networks:["ERC20","BEP20"] },${NL}  { id:"BTC",  name:"Bitcoin",  icon:"₿", color:"#F7931A", bg:"rgba(247,147,26,0.15)",  networks:["Bitcoin"]       },${NL}  { id:"ETH",  name:"Ethereum", icon:"Ξ", color:"#627EEA", bg:"rgba(98,126,234,0.15)",  networks:["ERC20"]         },${NL}  { id:"USDC", name:"USD Coin", icon:"◎", color:"#0072FF", bg:"rgba(0,114,255,0.15)",   networks:["ERC20"]         },${NL}  { id:"BNB",  name:"BNB",      icon:"⬡", color:"#F3BA2F", bg:"rgba(243,186,47,0.15)",  networks:["BEP20"]         },${NL}];`
);

// 4. Remove BANKS array
c = c.replace(
  `${NL}const BANKS = [${NL}  { id:"b1", name:"GTBank",    number:"4521", account:"0123454521", type:"Savings" },${NL}  { id:"b2", name:"Access Bank", number:"8812", account:"0198778812", type:"Current" },${NL}  { id:"b3", name:"Zenith Bank", number:"2230", account:"2012782230", type:"Savings" },${NL}];`,
  ``
);

// 5. ProgressBar - remove bank step
c = c.replace(
  `  const visibleSteps = hasNetwork${NL}    ? ["coin","network","amount","bank","review","send"]${NL}    : ["coin","amount","bank","review","send"];${NL}${NL}  const labels = {${NL}    coin:"Coin", network:"Network", amount:"Amount",${NL}    bank:"Bank", review:"Review", send:"Send",${NL}  };`,
  `  const visibleSteps = hasNetwork${NL}    ? ["coin","network","amount","review","send"]${NL}    : ["coin","amount","review","send"];${NL}${NL}  const labels = {${NL}    coin:"Coin", network:"Network", amount:"Amount",${NL}    review:"Review", send:"Send",${NL}  };`
);

// 6. LeftPanel - use trade.liveRate and remove bank row and SPREAD
c = c.replace(
  `    { label:"You Send",  val: trade.amount  ? \`\${trade.amount} \${trade.coin?.id}\`     : null      },${NL}    { label:"Rate",      val: trade.coin    ? \`₦\${(trade.coin.rate*(1-SPREAD)).toLocaleString("en-NG",{maximumFractionDigits:0})}\` : null },${NL}    { label:"You Receive", val: trade.ngnAmount > 0 ? fmtNGN(trade.ngnAmount)         : null, green:true },${NL}    { label:"Bank",      val: trade.bank   ? \`\${trade.bank.name} ••\${trade.bank.number}\` : null  },`,
  `    { label:"You Send",  val: trade.amount  ? \`\${trade.amount} \${trade.coin?.id}\`     : null      },${NL}    { label:"Rate",      val: trade.liveRate ? \`₦\${trade.liveRate.toLocaleString("en-NG",{maximumFractionDigits:0})} / \${trade.coin?.id}\` : null },${NL}    { label:"You Receive", val: trade.ngnAmount > 0 ? fmtNGN(trade.ngnAmount)         : null, green:true },`
);

// 7. Trust badges - rate locked text
c = c.replace(
  `{ icon:"💯", text:"Rate locked for 60 seconds" },`,
  `{ icon:"💯", text:"Rate locked for 5 minutes" },`
);

// 8. StepAmount - use coin.rate (will be live) instead of coin.rate*(1-SPREAD)
c = c.replace(
  `  const [liveRate, setLiveRate]   = useState(coin.rate*(1-SPREAD));`,
  `  const [liveRate, setLiveRate]   = useState(coin.rate || 0);`
);

// 9. StepAmount - remove Spread row, change payout text
c = c.replace(
  `        {[${NL}          ["Rate",   \`₦\${liveRate.toLocaleString("en-NG",{maximumFractionDigits:0})} / \${coin.id}\`],${NL}          ["Spread", "4.00%"],${NL}          ["Payout", "To your bank account"],${NL}        ].map(([k,v])=>(`,
  `        {[${NL}          ["Rate",   \`₦\${liveRate.toLocaleString("en-NG",{maximumFractionDigits:0})} / \${coin.id}\`],${NL}          ["Payout", "To your NGN wallet"],${NL}        ].map(([k,v])=>(`
);

// 10. Remove StepBank function entirely (match from "function StepBank" to start of "function StepReview")
c = c.replace(/function StepBank\(\{[\s\S]*?\n\}\r?\n\r?\n(?=function StepReview)/, '');

// 11. StepReview - remove spread, bank, fix rate
c = c.replace(
  `function StepReview({ trade }) {${NL}  const rows = [${NL}    ["Coin",            \`\${trade.coin.name} (\${trade.coin.id})\`],${NL}    ["Network",         trade.network || trade.coin.networks[0]],${NL}    ["You Send",        \`\${trade.amount} \${trade.coin.id}\`],${NL}    ["Exchange Rate",   \`₦\${(trade.coin.rate*(1-SPREAD)).toLocaleString("en-NG",{maximumFractionDigits:0})} / \${trade.coin.id}\`],${NL}    ["Spread",          "4%"],${NL}    ["You Receive",     \`₦\${trade.ngnAmount.toLocaleString("en-NG",{maximumFractionDigits:0})}\`],${NL}    ["Bank Account",    \`\${trade.bank.name} ••\${trade.bank.number}\`],${NL}  ];${NL}  return (${NL}    <div className="step-form">${NL}      <div style={{ fontSize:10, color:C.muted, letterSpacing:3, marginBottom:10 }}>STEP 5</div>`,
  `function StepReview({ trade }) {${NL}  const rows = [${NL}    ["Coin",            \`\${trade.coin.name} (\${trade.coin.id})\`],${NL}    ["Network",         trade.network || trade.coin.networks[0]],${NL}    ["You Send",        \`\${trade.amount} \${trade.coin.id}\`],${NL}    ["Exchange Rate",   \`₦\${(trade.liveRate || trade.coin.rate || 0).toLocaleString("en-NG",{maximumFractionDigits:0})} / \${trade.coin.id}\`],${NL}    ["You Receive",     \`₦\${trade.ngnAmount.toLocaleString("en-NG",{maximumFractionDigits:0})}\`],${NL}  ];${NL}  return (${NL}    <div className="step-form">${NL}      <div style={{ fontSize:10, color:C.muted, letterSpacing:3, marginBottom:10 }}>STEP {trade.coin?.networks?.length > 1 ? "4" : "3"}</div>`
);

// 12. StepSend - fix step number
c = c.replace(
  `      <div style={{ fontSize:10, color:C.muted, letterSpacing:3, marginBottom:10 }}>STEP 6</div>`,
  `      <div style={{ fontSize:10, color:C.muted, letterSpacing:3, marginBottom:10 }}>STEP {trade.coin?.networks?.length > 1 ? "5" : "4"}</div>`
);

// 13. StepDone - remove bank references
c = c.replace(
  `will be sent to your {trade.bank.name} account.`,
  `will be instantly credited to your NGN balance.`
);
c = c.replace(
  `          ["Bank",           \`\${trade.bank.name} ••\${trade.bank.number}\`],${NL}          ["Est. Time",      "5–15 minutes"],`,
  `          ["Est. Time",      "5–15 minutes"],`
);

// 14. Main component - remove bank from state
c = c.replace(
  `    coin:null, network:null, amount:"", ngnAmount:0, bank:null, tradeId:null,`,
  `    coin:null, network:null, amount:"", ngnAmount:0, liveRate:0, tradeId:null,`
);

// 15. Main component - remove bank from step order arrays
c = c.replace(
  `      ? ["coin","network","amount","bank","review","send","done"]${NL}      : ["coin","amount","bank","review","send","done"];${NL}    const i = order.indexOf(step);${NL}    if(i < order.length-1) setStep(order[i+1]);${NL}  };${NL}${NL}  const back = () => {${NL}    const order = hasNetwork${NL}      ? ["coin","network","amount","bank","review","send","done"]${NL}      : ["coin","amount","bank","review","send","done"];`,
  `      ? ["coin","network","amount","review","send","done"]${NL}      : ["coin","amount","review","send","done"];${NL}    const i = order.indexOf(step);${NL}    if(i < order.length-1) setStep(order[i+1]);${NL}  };${NL}${NL}  const back = () => {${NL}    const order = hasNetwork${NL}      ? ["coin","network","amount","review","send","done"]${NL}      : ["coin","amount","review","send","done"];`
);

// 16. canNext - remove bank check
c = c.replace(
  `    if(step==="amount")  return !!trade.amount && parseFloat(trade.amount)>0 && trade.ngnAmount>=5000;${NL}    if(step==="bank")    return !!trade.bank;`,
  `    if(step==="amount")  return !!trade.amount && parseFloat(trade.amount)>0 && trade.ngnAmount>=5000;`
);

// 17. Remove bank step rendering
c = c.replace(
  `            {step==="bank" && (${NL}              <StepBank selected={trade.bank} onSelect={b=>update({bank:b})}/>` + NL + `            )}${NL}            {step==="review"`,
  `            {step==="review"`
);

// 18. Add rates fetch in main component, after useEffect for CSS
c = c.replace(
  `  useEffect(()=>{${NL}    const s=document.createElement("style"); s.textContent=CSS;${NL}    document.head.appendChild(s); return ()=>document.head.removeChild(s);${NL}  },[]);`,
  `  useEffect(()=>{${NL}    const s=document.createElement("style"); s.textContent=CSS;${NL}    document.head.appendChild(s); return ()=>document.head.removeChild(s);${NL}  },[]);${NL}${NL}  // Fetch live rates from API${NL}  const [liveRates, setLiveRates] = useState({});${NL}  useEffect(() => {${NL}    const fetchRates = async () => {${NL}      try {${NL}        const res = await api.get("/rates/");${NL}        const map = {};${NL}        (Array.isArray(res.data) ? res.data : [res.data]).forEach(r => {${NL}          map[r.asset?.toUpperCase()] = parseFloat(r.user_rate || r.user_ngn_usd_rate || 0);${NL}        });${NL}        setLiveRates(map);${NL}      } catch(e) { console.error("Failed to fetch rates:", e); }${NL}    };${NL}    fetchRates();${NL}    const iv = setInterval(fetchRates, 30000);${NL}    return () => clearInterval(iv);${NL}  }, []);${NL}${NL}  // Merge live rates into COINS${NL}  const liveCoins = COINS.map(c => ({${NL}    ...c,${NL}    rate: liveRates[c.id] || 0,${NL}  }));`
);

// 19. StepCoin - use liveCoins
c = c.replace(
  `            <StepCoin selected={trade.coin} onSelect={c=>{${NL}                handleCoinSelect(c);${NL}              }}/>`,
  `            <StepCoin selected={trade.coin} coins={liveCoins} onSelect={c=>{${NL}                handleCoinSelect(c);${NL}              }}/>`
);

// 20. StepCoin function - accept coins prop
c = c.replace(
  `function StepCoin({ selected, onSelect }) {`,
  `function StepCoin({ selected, coins, onSelect }) {`
);
c = c.replace(
  `        {COINS.map(c=>(`,
  `        {(coins||COINS).map(c=>(`
);

// 21. StepAmount - accept coin with live rate, pass it down
c = c.replace(
  `            <StepAmount coin={trade.coin} network={trade.network}${NL}                amount={trade.amount} setAmount={v=>update({amount:v})}${NL}                ngnAmount={trade.ngnAmount} setNgnAmount={v=>update({ngnAmount:v})}/>`,
  `            <StepAmount coin={trade.coin} network={trade.network}${NL}                amount={trade.amount} setAmount={v=>update({amount:v})}${NL}                ngnAmount={trade.ngnAmount} setNgnAmount={v=>update({ngnAmount:v})}${NL}                onRateUpdate={r=>update({liveRate:r})}/>`
);

// 22. StepAmount function - accept onRateUpdate
c = c.replace(
  `function StepAmount({ coin, network, amount, setAmount, ngnAmount, setNgnAmount }) {`,
  `function StepAmount({ coin, network, amount, setAmount, ngnAmount, setNgnAmount, onRateUpdate }) {`
);

// 23. StepAmount - update parent when liveRate changes
c = c.replace(
  `  const [liveRate, setLiveRate]   = useState(coin.rate || 0);${NL}${NL}  useEffect(()=>{`,
  `  const [liveRate, setLiveRate]   = useState(coin.rate || 0);${NL}${NL}  useEffect(()=>{${NL}    if(onRateUpdate) onRateUpdate(liveRate);${NL}  },[liveRate]);${NL}${NL}  useEffect(()=>{`
);

fs.writeFileSync(fpath, c, 'utf-8');
console.log('✅ SellCrypto.jsx fully patched!');
