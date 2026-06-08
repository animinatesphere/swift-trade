const fs = require('fs');
const path = require('path');

const fpath = path.resolve('c:/Users/USER/Desktop/WORK STATION/JAVASCRIPT/swift-front/src/pages/dashboard/SellCrypto.jsx');
let cnt = fs.readFileSync(fpath, 'utf-8');

cnt = cnt.replace(
`const SPREAD   = 0.04;
const RATE_TTL = 60;
const PAY_TTL  = 1800; // 30 min`,
`const RATE_TTL = 300; // 5 mins
const PAY_TTL  = 1800; // 30 min`
);

cnt = cnt.replace(
`  const visibleSteps = hasNetwork
    ? ["coin","network","amount","bank","review","send"]
    : ["coin","amount","bank","review","send"];

  const labels = {
    coin:"Coin", network:"Network", amount:"Amount",
    bank:"Bank", review:"Review", send:"Send",
  };`,
`  const visibleSteps = hasNetwork
    ? ["coin","network","amount","review","send"]
    : ["coin","amount","review","send"];

  const labels = {
    coin:"Coin", network:"Network", amount:"Amount",
    review:"Review", send:"Send",
  };`
);

cnt = cnt.replace(
`    { label:"You Send",  val: trade.amount  ? \`\${trade.amount} \${trade.coin?.id}\`     : null      },
    { label:"Rate",      val: trade.coin    ? \`₦\${(trade.coin.rate*(1-SPREAD)).toLocaleString("en-NG",{maximumFractionDigits:0})}\` : null },
    { label:"You Receive", val: trade.ngnAmount > 0 ? fmtNGN(trade.ngnAmount)         : null, green:true },
    { label:"Bank",      val: trade.bank   ? \`\${trade.bank.name} ••\${trade.bank.number}\` : null  },`,
`    { label:"You Send",  val: trade.amount  ? \`\${trade.amount} \${trade.coin?.id}\`     : null      },
    { label:"Rate",      val: trade.coin    ? \`₦\${trade.coin.rate.toLocaleString("en-NG",{maximumFractionDigits:0})}\` : null },
    { label:"You Receive", val: trade.ngnAmount > 0 ? fmtNGN(trade.ngnAmount)         : null, green:true },`
);

cnt = cnt.replace(
`            <div>
              <div style={{ fontSize:14, fontWeight:600, marginBottom:2 }}>{c.id}</div>
              <div style={{ fontSize:11, color:C.muted }}>{c.name}</div>
            </div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:C.green }}>
              ₦{(c.rate*(1-SPREAD)).toLocaleString("en-NG",{maximumFractionDigits:0})}
            </div>
          </button>`,
`            <div>
              <div style={{ fontSize:14, fontWeight:600, marginBottom:2 }}>{c.id}</div>
              <div style={{ fontSize:11, color:C.muted }}>{c.name}</div>
            </div>
          </button>`
);

cnt = cnt.replace(
`  const [mode, setMode]     = useState("crypto");
  const [rateTimer, setRateTimer] = useState(RATE_TTL);
  const [liveRate, setLiveRate]   = useState(coin.rate*(1-SPREAD));`,
`  const [mode, setMode]     = useState("crypto");
  const [rateTimer, setRateTimer] = useState(RATE_TTL);
  const [liveRate, setLiveRate]   = useState(coin.rate);`
);

cnt = cnt.replace(
`        {[
          ["Rate",   \`₦\${liveRate.toLocaleString("en-NG",{maximumFractionDigits:0})} / \${coin.id}\`],
          ["Spread", "4.00%"],
          ["Payout", "To your bank account"],
        ].map(([k,v])=>(`,
`        {[
          ["Rate",   \`₦\${liveRate.toLocaleString("en-NG",{maximumFractionDigits:0})} / \${coin.id}\`],
          ["Payout", "To your NGN wallet"],
        ].map(([k,v])=>(`
);

cnt = cnt.replace(/function StepBank\(\{[^}]+\}\) \{[\s\S]*?(?=function StepReview)/, "");

cnt = cnt.replace(
`function StepReview({ trade }) {
  const rows = [
    ["Coin",            \`\${trade.coin.name} (\${trade.coin.id})\`],
    ["Network",         trade.network || trade.coin.networks[0]],
    ["You Send",        \`\${trade.amount} \${trade.coin.id}\`],
    ["Exchange Rate",   \`₦\${(trade.coin.rate*(1-SPREAD)).toLocaleString("en-NG",{maximumFractionDigits:0})} / \${trade.coin.id}\`],
    ["Spread",          "4%"],
    ["You Receive",     \`₦\${trade.ngnAmount.toLocaleString("en-NG",{maximumFractionDigits:0})}\`],
    ["Bank Account",    \`\${trade.bank.name} ••\${trade.bank.number}\`],
  ];
  return (
    <div className="step-form">
      <div style={{ fontSize:10, color:C.muted, letterSpacing:3, marginBottom:10 }}>STEP 5</div>`,
`function StepReview({ trade }) {
  const rows = [
    ["Coin",            \`\${trade.coin.name} (\${trade.coin.id})\`],
    ["Network",         trade.network || trade.coin.networks[0]],
    ["You Send",        \`\${trade.amount} \${trade.coin.id}\`],
    ["Exchange Rate",   \`₦\${trade.coin.rate.toLocaleString("en-NG",{maximumFractionDigits:0})} / \${trade.coin.id}\`],
    ["You Receive",     \`₦\${trade.ngnAmount.toLocaleString("en-NG",{maximumFractionDigits:0})}\`],
  ];
  return (
    <div className="step-form">
      <div style={{ fontSize:10, color:C.muted, letterSpacing:3, marginBottom:10 }}>STEP {trade.coin?.networks?.length > 1 ? "4" : "3"}</div>`
);

cnt = cnt.replace(
`    <div className="step-form">
      <div style={{ fontSize:10, color:C.muted, letterSpacing:3, marginBottom:10 }}>STEP 6</div>`,
`    <div className="step-form">
      <div style={{ fontSize:10, color:C.muted, letterSpacing:3, marginBottom:10 }}>STEP {trade.coin?.networks?.length > 1 ? "5" : "4"}</div>`
);

cnt = cnt.replace(
`        Your {trade.coin.id} payment has been flagged for review. Once our team confirms the deposit, <span style={{ color:C.green, fontWeight:500 }}>₦{trade.ngnAmount.toLocaleString("en-NG",{maximumFractionDigits:0})}</span> will be sent to your {trade.bank.name} account.
      </p>

      <div style={{ background:C.card, border:\`1px solid \${C.border}\`,
        borderRadius:14, padding:"18px 20px", marginBottom:24, textAlign:"left" }}>
        <div style={{ fontSize:9, color:C.muted, letterSpacing:2, marginBottom:12 }}>
          TRADE REFERENCE
        </div>
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"center", marginBottom:4 }}>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:20,
            color:C.green, fontWeight:500 }}>{trade.tradeId}</span>
          <Copy text={trade.tradeId}/>
        </div>
        <div style={{ fontSize:11, color:C.muted }}>
          Save this ID to track your trade status
        </div>

        <div style={{ height:1, background:C.border, margin:"14px 0" }} />

        {[
          ["You Sent",       \`\${trade.amount} \${trade.coin.id}\`],
          ["Network",        trade.network||trade.coin.networks[0]],
          ["Expected Payout",\`₦\${trade.ngnAmount.toLocaleString("en-NG",{maximumFractionDigits:0})}\`],
          ["Bank",           \`\${trade.bank.name} ••\${trade.bank.number}\`],
          ["Est. Time",      "5–15 minutes"],
        ].map(([k,v])=>(`,
`        Your {trade.coin.id} payment has been flagged for review. Once our team confirms the deposit, <span style={{ color:C.green, fontWeight:500 }}>₦{trade.ngnAmount.toLocaleString("en-NG",{maximumFractionDigits:0})}</span> will be instantly credited to your NGN balance.
      </p>

      <div style={{ background:C.card, border:\`1px solid \${C.border}\`,
        borderRadius:14, padding:"18px 20px", marginBottom:24, textAlign:"left" }}>
        <div style={{ fontSize:9, color:C.muted, letterSpacing:2, marginBottom:12 }}>
          TRADE REFERENCE
        </div>
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"center", marginBottom:4 }}>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:20,
            color:C.green, fontWeight:500 }}>{trade.tradeId}</span>
          <Copy text={trade.tradeId}/>
        </div>
        <div style={{ fontSize:11, color:C.muted }}>
          Save this ID to track your trade status
        </div>

        <div style={{ height:1, background:C.border, margin:"14px 0" }} />

        {[
          ["You Sent",       \`\${trade.amount} \${trade.coin.id}\`],
          ["Network",        trade.network||trade.coin.networks[0]],
          ["Expected Payout",\`₦\${trade.ngnAmount.toLocaleString("en-NG",{maximumFractionDigits:0})}\`],
          ["Est. Time",      "5–15 minutes"],
        ].map(([k,v])=>(`
);

cnt = cnt.replace(
`  const [trade, setTrade] = useState({
    coin:null, network:null, amount:"", ngnAmount:0, bank:null, tradeId:null,
  });`,
`  const [trade, setTrade] = useState({
    coin:null, network:null, amount:"", ngnAmount:0, tradeId:null,
  });`
);

cnt = cnt.replace(
`  const next = () => {
    const order = hasNetwork
      ? ["coin","network","amount","bank","review","send","done"]
      : ["coin","amount","bank","review","send","done"];
    const i = order.indexOf(step);
    if(i < order.length-1) setStep(order[i+1]);
  };

  const back = () => {
    const order = hasNetwork
      ? ["coin","network","amount","bank","review","send","done"]
      : ["coin","amount","bank","review","send","done"];
    const i = order.indexOf(step);
    if(i > 0) setStep(order[i-1]);
  };

  const canNext = () => {
    if(step==="coin")    return !!trade.coin;
    if(step==="network") return !!trade.network;
    if(step==="amount")  return !!trade.amount && parseFloat(trade.amount)>0 && trade.ngnAmount>=5000;
    if(step==="bank")    return !!trade.bank;
    if(step==="review")  return true;
    return false;
  };`,
`  const next = () => {
    const order = hasNetwork
      ? ["coin","network","amount","review","send","done"]
      : ["coin","amount","review","send","done"];
    const i = order.indexOf(step);
    if(i < order.length-1) setStep(order[i+1]);
  };

  const back = () => {
    const order = hasNetwork
      ? ["coin","network","amount","review","send","done"]
      : ["coin","amount","review","send","done"];
    const i = order.indexOf(step);
    if(i > 0) setStep(order[i-1]);
  };

  const canNext = () => {
    if(step==="coin")    return !!trade.coin;
    if(step==="network") return !!trade.network;
    if(step==="amount")  return !!trade.amount && parseFloat(trade.amount)>0 && trade.ngnAmount>=5000;
    if(step==="review")  return true;
    return false;
  };`
);

cnt = cnt.replace(
`            {step==="amount" && (
              <StepAmount coin={trade.coin} network={trade.network}
                amount={trade.amount} setAmount={v=>update({amount:v})}
                ngnAmount={trade.ngnAmount} setNgnAmount={v=>update({ngnAmount:v})}/>
            )}
            {step==="bank" && (
              <StepBank selected={trade.bank} onSelect={b=>update({bank:b})}/>
            )}
            {step==="review" && <StepReview trade={trade}/>}
            {step==="send"   && <StepSend trade={trade} onPaid={next}/>}`,
`            {step==="amount" && (
              <StepAmount coin={trade.coin} network={trade.network}
                amount={trade.amount} setAmount={v=>update({amount:v})}
                ngnAmount={trade.ngnAmount} setNgnAmount={v=>update({ngnAmount:v})}/>
            )}
            {step==="review" && <StepReview trade={trade}/>}
            {step==="send"   && <StepSend trade={trade} onPaid={next}/>}`
);

fs.writeFileSync(fpath, cnt, 'utf-8');
console.log('Update finished!');
