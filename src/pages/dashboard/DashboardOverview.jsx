import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const C = {
  green:"#0ECB81", amber:"#F5A623", red:"#F6465D",
  blue:"#3B82F6",
  bg:"#080808", surface:"#0c0c0c", card:"#101010",
  card2:"#141414",
  border:"#1a1a1a", border2:"#222222",
  text:"#ffffff", muted:"#555555", muted2:"#2e2e2e",
};

const CSS = `
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes ticker  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.7)} }
  @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes slideR  { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }

  .ticker-wrap { animation:ticker 34s linear infinite; }
  .ticker-wrap:hover { animation-play-state:paused; }

  .rate-row:hover { background:#181818 !important; }
  .rate-row { transition:background 0.15s; }

  .trade-btn:hover:not(:disabled) { background:#0fdf8e !important; transform:translateY(-1px); box-shadow:0 10px 28px rgba(14,203,129,0.3) !important; }
  .trade-btn:disabled { opacity:0.35 !important; cursor:not-allowed !important; }
  .trade-btn { transition:all 0.2s; }

  .ghost-btn:hover { border-color:#444 !important; color:#ccc !important; }
  .ghost-btn { transition:all 0.18s; }

  .txn-row:hover { background:#181818 !important; }
  .txn-row { transition:background 0.15s; }

  .copy-btn:hover { color:#0ECB81 !important; }
  .copy-btn { transition:color 0.15s; }

  .icon-btn:hover { background:rgba(255,255,255,0.06) !important; }
  .icon-btn { transition:background 0.15s; }

  .coin-btn:hover { background:#1c1c1c !important; }
  .coin-btn.sel   { background:rgba(14,203,129,0.07) !important; border-color:rgba(14,203,129,0.3) !important; }
  .coin-btn { transition:all 0.15s; }

  .card-in { animation:fadeUp 0.4s ease both; }
  .pending-in { animation:slideR 0.35s ease both; }
  .soon { opacity:0.38; cursor:not-allowed !important; pointer-events:none; }

  @media (max-width: 1024px) {
    .dashboard-topbar { padding: 0 16px !important; }
    .topbar-greet, .topbar-email { display: none !important; }
    .topbar-status { margin-left: 0 !important; }
    .stats-grid { grid-template-columns: 1fr !important; }
    .content-row { flex-direction: column !important; }
    .rates-panel { width: 100% !important; }
  }

  @media (max-width: 640px) {
    .topbar-status span:last-child { display: none !important; }
    .trade-btn-text { display: none !important; }
    .trade-btn { padding: 8px !important; border-radius: 50% !important; }
  }
`;

// ─── DATA ─────────────────────────────────────────────────
const COINS = [
  { id:"USDT", name:"Tether",   icon:"₮", color:"#26A17B", bg:"rgba(38,161,123,0.15)",  rate:1592,     network:"TRC20" },
  { id:"BTC",  name:"Bitcoin",  icon:"₿", color:"#F7931A", bg:"rgba(247,147,26,0.15)",  rate:98240000, network:"BTC"   },
  { id:"ETH",  name:"Ethereum", icon:"Ξ", color:"#627EEA", bg:"rgba(98,126,234,0.15)",  rate:3420000,  network:"ERC20" },
  { id:"USDC", name:"USD Coin", icon:"◎", color:"#0072FF", bg:"rgba(0,114,255,0.15)",   rate:1590,     network:"ERC20" },
  { id:"BNB",  name:"BNB",      icon:"⬡", color:"#F3BA2F", bg:"rgba(243,186,47,0.15)",  rate:920000,   network:"BEP20" },
  { id:"SOL",  name:"Solana",  icon:"◎", color:"#9945FF", bg:"rgba(153,69,255,0.15)",  rate:218400,   network:"SOL"   },
];

const USER_EMAIL = "adewale@gmail.com";
const NGN_BALANCE = 482200;

const HISTORY = [
  { id:"TRD-7840", coin:"USDT", icon:"₮", color:"#26A17B", amount:500,   ngn:795000,   date:"Today, 10:32 AM",   bank:"GTBank ••4521"  },
  { id:"TRD-7835", coin:"BTC",  icon:"₿", color:"#F7931A", amount:0.002, ngn:196000,   date:"Yesterday, 3:14 PM",bank:"Access ••8812"  },
  { id:"TRD-7829", coin:"ETH",  icon:"Ξ", color:"#627EEA", amount:0.05,  ngn:170000,   date:"Dec 18, 9:00 AM",   bank:"GTBank ••4521"  },
  { id:"TRD-7821", coin:"USDT", icon:"₮", color:"#26A17B", amount:1000,  ngn:1585000,  date:"Dec 17, 2:45 PM",   bank:"Zenith ••2230"  },
  { id:"TRD-7814", coin:"BTC",  icon:"₿", color:"#F7931A", amount:0.001, ngn:97500,    date:"Dec 15, 11:00 AM",  bank:"GTBank ••4521"  },
];

const TICKERS = [
  {s:"USDT/NGN",p:"₦1,592",     c:"-0.3%",up:false},
  {s:"BTC/NGN", p:"₦98,240,000",c:"+2.4%",up:true },
  {s:"ETH/NGN", p:"₦3,420,000", c:"+1.8%",up:true },
  {s:"USDC/NGN",p:"₦1,590",     c:"+0.1%",up:true },
  {s:"BNB/NGN", p:"₦920,000",   c:"+3.1%",up:true },
  {s:"SOL/NGN", p:"₦218,400",   c:"-1.2%",up:false},
];

// ─── SMALL UTILS ──────────────────────────────────────────
function CopyBtn({ text }) {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={()=>{ navigator.clipboard.writeText(text); setOk(true); setTimeout(()=>setOk(false),2000); }}
      className="copy-btn"
      style={{ background:"none",border:"none",cursor:"pointer",padding:0,
        fontSize:11,fontFamily:"'Outfit',sans-serif",fontWeight:500,
        color:ok?C.green:C.muted,display:"flex",alignItems:"center",gap:4 }}>
      {ok
        ? <><svg width={11} height={11} viewBox="0 0 11 11" fill="none"><path d="M1.5 5.5l2.5 3L9 2" stroke={C.green} strokeWidth={1.5} strokeLinecap="round"/></svg>Copied</>
        : <><svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Copy</>}
    </button>
  );
}

// ─── TICKER ───────────────────────────────────────────────
function Ticker() {
  const d = [...TICKERS,...TICKERS];
  return (
    <div style={{ background:"#060606",borderBottom:`1px solid ${C.border}`,
      overflow:"hidden",padding:"8px 0",flexShrink:0 }}>
      <div className="ticker-wrap" style={{ display:"flex",width:"max-content" }}>
        {d.map((t,i)=>(
          <div key={i} style={{ display:"flex",alignItems:"center",gap:8,
            padding:"0 20px",borderRight:`1px solid ${C.border}`,whiteSpace:"nowrap" }}>
            <span style={{ fontFamily:"'DM Mono',monospace",fontSize:11,color:"#777" }}>{t.s}</span>
            <span style={{ fontFamily:"'DM Mono',monospace",fontSize:11,color:"#555" }}>{t.p}</span>
            <span style={{ fontSize:10,fontWeight:600,color:t.up?C.green:C.red }}>{t.c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── STATS ────────────────────────────────────────────────
function Stats() {
  const items = [
    { label:"NGN Balance",        val:`₦${NGN_BALANCE.toLocaleString()}`, sub:"Available to withdraw", col:C.green, icon:"🏦", highlight:true },
    { label:"Total Converted",    val:"₦3,264,000", sub:"All time",       col:"#aaa",  icon:"💹" },
    { label:"Trades Completed",   val:"7",           sub:"Successfully",   col:"#aaa",  icon:"✅" },
    { label:"This Month",         val:"₦1,108,400",  sub:"December",       col:C.amber, icon:"📅" },
  ];
  return (
    <div className="stats-grid" style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:12 }}>
      {items.map((s,i)=>(
        <div key={s.label} className="card-in"
          style={{ background: s.highlight
              ? "linear-gradient(135deg,rgba(14,203,129,0.1),rgba(14,203,129,0.04))"
              : C.card,
            border:`1px solid ${s.highlight?"rgba(14,203,129,0.25)":C.border}`,
            borderRadius:12,padding:"14px 16px",animationDelay:`${i*0.06}s`,
            position:"relative",overflow:"hidden" }}>
          {s.highlight && (
            <div style={{ position:"absolute",top:-20,right:-20,width:80,height:80,
              borderRadius:"50%",
              background:"radial-gradient(circle,rgba(14,203,129,0.12),transparent 70%)",
              pointerEvents:"none" }} />
          )}
          <div style={{ display:"flex",justifyContent:"space-between",
            alignItems:"center",marginBottom:10 }}>
            <span style={{ fontSize:10,color:s.highlight?C.green:C.muted,letterSpacing:1 }}>
              {s.label.toUpperCase()}
            </span>
            <span style={{ fontSize:16 }}>{s.icon}</span>
          </div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif",
            fontSize:24,color:s.col,letterSpacing:1,lineHeight:1 }}>{s.val}</div>
          <div style={{ fontSize:11,color:s.highlight?C.green:C.muted,marginTop:4 }}>{s.sub}</div>
          {s.highlight && (
            <button style={{ marginTop:12,background:"rgba(14,203,129,0.12)",
              border:"1px solid rgba(14,203,129,0.25)",
              borderRadius:7,padding:"5px 12px",
              color:C.green,fontSize:11,fontWeight:600,
              fontFamily:"'Outfit',sans-serif",cursor:"pointer" }}>
              Withdraw →
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── HISTORY TABLE ────────────────────────────────────────
function History() {
  const navigate = useNavigate();
  return (
    <div className="card-in" style={{ background:C.card,border:`1px solid ${C.border}`,
      borderRadius:14,overflow:"hidden",animationDelay:"0.15s",flex:1 }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",
        padding:"14px 18px",borderBottom:`1px solid ${C.border}` }}>
        <span style={{ fontSize:12,fontWeight:600,letterSpacing:1 }}>TRANSACTION HISTORY</span>
        <span style={{ fontSize:11,color:C.green,cursor:"pointer" }} onClick={() => navigate("/dashboard/txn")}>View all →</span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 500 }}>
          <div style={{ display:"grid",gridTemplateColumns:"1.4fr 1fr 1fr 1.2fr",
            padding:"8px 18px",borderBottom:`1px solid ${C.border}` }}>
            {["Trade","You Sent","You Received","Date"].map(h=>(
              <span key={h} style={{ fontSize:9,color:C.muted,letterSpacing:2,textTransform:"uppercase" }}>{h}</span>
            ))}
          </div>
          {HISTORY.map((t,i)=>(
            <div key={t.id} className="txn-row"
              style={{ display:"grid",gridTemplateColumns:"1.4fr 1fr 1fr 1.2fr",
                padding:"12px 18px",borderBottom:`1px solid ${C.border}`,
                alignItems:"center",cursor:"pointer",
                animationDelay:`${i*0.04}s` }}>
              <div style={{ display:"flex",alignItems:"center",gap:9 }}>
                <div style={{ width:28,height:28,borderRadius:"50%",
                  background:t.bg||"rgba(38,161,123,0.12)",flexShrink:0,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:11,fontWeight:700,color:t.color }}>{t.icon}</div>
                <div>
                  <div style={{ fontSize:13,fontWeight:500 }}>{t.coin}/NGN</div>
                  <div style={{ fontSize:10,color:C.muted }}>{t.id}</div>
                </div>
              </div>
              <div style={{ fontFamily:"'DM Mono',monospace",fontSize:12,color:"#bbb" }}>
                {t.amount} {t.coin}
              </div>
              <div>
                <div style={{ fontFamily:"'DM Mono',monospace",fontSize:13,color:C.green }}>
                  ₦{t.ngn.toLocaleString()}
                </div>
                <div style={{ fontSize:10,color:C.muted }}>{t.bank}</div>
              </div>
              <div>
                <div style={{ fontSize:11,color:C.muted }}>{t.date}</div>
                <span style={{ fontSize:9,padding:"2px 7px",borderRadius:100,
                  background:"rgba(14,203,129,0.08)",color:C.green,letterSpacing:1 }}>
                  COMPLETED
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── RATES PANEL ──────────────────────────────────────────
function RatesPanel({ onTrade }) {
  const [rates, setRates] = useState(COINS);
  useEffect(()=>{
    const iv=setInterval(()=>{
      setRates(p=>p.map(c=>({...c,rate:c.rate*(1+(Math.random()-0.5)*0.003)})));
    },2500);
    return ()=>clearInterval(iv);
  },[]);
  return (
    <div className="card-in" style={{ background:C.card,border:`1px solid ${C.border}`,
      borderRadius:14,overflow:"hidden",animationDelay:"0.2s",width:"100%" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",
        padding:"14px 16px",borderBottom:`1px solid ${C.border}` }}>
        <span style={{ fontSize:12,fontWeight:600,letterSpacing:1 }}>LIVE RATES</span>
        <div style={{ display:"flex",alignItems:"center",gap:4 }}>
          <span style={{ width:5,height:5,borderRadius:"50%",background:C.green,
            animation:"pulse 2s infinite",display:"inline-block" }} />
          <span style={{ fontFamily:"'DM Mono',monospace",fontSize:9,color:C.green }}>LIVE</span>
        </div>
      </div>
      {rates.map(c=>(
        <div key={c.id} className="rate-row"
          style={{ display:"flex",alignItems:"center",gap:10,
            padding:"11px 16px",borderBottom:`1px solid ${C.border}`,cursor:"pointer" }}
          onClick={()=>onTrade(c)}>
          <div style={{ width:30,height:30,borderRadius:"50%",background:c.bg,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:12,fontWeight:700,color:c.color,flexShrink:0 }}>{c.icon}</div>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ fontSize:13,fontWeight:500 }}>{c.id}/NGN</div>
            <div style={{ fontSize:10,color:C.muted }}>{c.network}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:"'DM Mono',monospace",fontSize:12,color:"#ccc" }}>
              ₦{c.rate.toLocaleString("en-NG",{maximumFractionDigits:0})}
            </div>
            <div style={{ fontSize:10,color:C.green }}>Trade →</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── NEW TRADE MODAL ──────────────────────────────────────
function TradeModal({ coin: initCoin, onClose }) {
  const [coin, setCoin]   = useState(initCoin || COINS[0]);
  const [amt, setAmt]     = useState("");
  const [step, setStep]   = useState(1); // 1=form, 2=wallet
  const SPREAD = 0.04;
  const rate   = coin.rate * (1 - SPREAD);
  const ngnOut = amt && parseFloat(amt)>0 ? parseFloat(amt)*rate : 0;

  return (
    <>
      <div onClick={onClose} style={{ position:"fixed",inset:0,
        background:"rgba(0,0,0,0.78)",backdropFilter:"blur(5px)",zIndex:200 }}/>
      <div style={{ position:"fixed",top:"50%",left:"50%",
        transform:"translate(-50%,-50%)",zIndex:201,
        width:"90%",maxWidth:450,
        background:C.card,border:`1px solid ${C.border2}`,
        borderRadius:18,overflow:"hidden",
        boxShadow:"0 32px 64px rgba(0,0,0,0.7)",
        animation:"fadeUp 0.3s ease" }}>

        {/* Header */}
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",
          padding:"16px 20px",borderBottom:`1px solid ${C.border}` }}>
          <div>
            <div style={{ fontSize:10,color:C.muted,letterSpacing:2,marginBottom:3 }}>
              {step===1?"STEP 1 OF 2 — SELECT COIN & AMOUNT":"STEP 2 OF 2 — SEND CRYPTO"}
            </div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:1 }}>
              {step===1?"New Trade":"Send Payment"}
            </div>
          </div>
          <button onClick={onClose}
            style={{ background:C.card2,border:`1px solid ${C.border}`,
              borderRadius:8,width:30,height:30,display:"flex",
              alignItems:"center",justifyContent:"center",
              cursor:"pointer",color:C.muted,fontSize:15,lineHeight:1 }}>✕</button>
        </div>

        <div style={{ padding:"18px 20px" }}>
          {step===1 ? (
            <>
              {/* Coin grid */}
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:9,color:C.muted,letterSpacing:2,marginBottom:10 }}>CHOOSE COIN</div>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8 }}>
                  {COINS.map(c=>(
                    <button key={c.id} className={`coin-btn${coin.id===c.id?" sel":""}`}
                      onClick={()=>setCoin(c)}
                      style={{ display:"flex",flexDirection:"column",alignItems:"center",
                        gap:4,padding:"9px 4px",borderRadius:10,
                        background:coin.id===c.id?"rgba(14,203,129,0.07)":C.card2,
                        border:`1px solid ${coin.id===c.id?"rgba(14,203,129,0.3)":C.border}`,
                        cursor:"pointer" }}>
                      <div style={{ width:26,height:26,borderRadius:"50%",background:c.bg,
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:11,fontWeight:700,color:c.color }}>{c.icon}</div>
                      <span style={{ fontSize:10,fontWeight:600,
                        color:coin.id===c.id?C.green:"#aaa" }}>{c.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:9,color:C.muted,letterSpacing:2,marginBottom:8 }}>AMOUNT</div>
                <div style={{ position:"relative" }}>
                  <input type="number" value={amt} onChange={e=>setAmt(e.target.value)}
                    autoFocus placeholder="0.00"
                    style={{ width:"100%",background:"#0a0a0a",
                      border:`1px solid ${C.border2}`,borderRadius:10,
                      padding:"13px 56px 13px 14px",
                      color:"#fff",fontSize:18,
                      fontFamily:"'DM Mono',monospace",outline:"none" }}/>
                  <div style={{ position:"absolute",right:14,top:"50%",
                    transform:"translateY(-50%)",
                    fontFamily:"'DM Mono',monospace",fontSize:13,
                    color:coin.color,fontWeight:500 }}>{coin.id}</div>
                </div>
              </div>

              {/* NGN preview */}
              {ngnOut>0 && (
                <div style={{ background:"rgba(14,203,129,0.05)",
                  border:"1px solid rgba(14,203,129,0.14)",
                  borderRadius:10,padding:"11px 14px",marginBottom:14,
                  animation:"fadeIn 0.2s ease" }}>
                  {[
                    ["You receive", `₦${ngnOut.toLocaleString("en-NG",{maximumFractionDigits:0})}`, C.green],
                    ["Rate",        `₦${rate.toLocaleString("en-NG",{maximumFractionDigits:0})} / ${coin.id}`, "#888"],
                    ["Spread",      "4%", C.amber],
                  ].map(([k,v,c])=>(
                    <div key={k} style={{ display:"flex",justifyContent:"space-between",
                      marginBottom:5 }}>
                      <span style={{ fontSize:12,color:C.muted }}>{k}</span>
                      <span style={{ fontFamily:"'DM Mono',monospace",fontSize:13,color:c,
                        fontWeight:k==="You receive"?600:400 }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}

              <button disabled={!amt||parseFloat(amt)<=0}
                onClick={()=>setStep(2)} className="trade-btn"
                style={{ width:"100%",background:C.green,color:"#000",
                  fontWeight:700,fontSize:14,padding:"13px",
                  borderRadius:10,border:"none",fontFamily:"'Outfit',sans-serif" }}>
                Generate Wallet Address →
              </button>
            </>
          ) : (
            <>
              {/* Summary chip */}
              <div style={{ background:"rgba(14,203,129,0.05)",
                border:"1px solid rgba(14,203,129,0.18)",
                borderRadius:12,padding:"13px 16px",marginBottom:14 }}>
                <div style={{ fontSize:9,color:C.green,letterSpacing:2,marginBottom:8 }}>SEND EXACTLY</div>
                <div style={{ display:"flex",alignItems:"center",
                  justifyContent:"space-between" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                    <div style={{ width:30,height:30,borderRadius:"50%",background:coin.bg,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:13,fontWeight:700,color:coin.color }}>{coin.icon}</div>
                    <span style={{ fontFamily:"'DM Mono',monospace",fontSize:18,fontWeight:500 }}>
                      {amt} {coin.id}
                    </span>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:10,color:C.muted,marginBottom:2 }}>you receive</div>
                    <div style={{ fontFamily:"'DM Mono',monospace",fontSize:16,color:C.green,fontWeight:500 }}>
                      ₦{ngnOut.toLocaleString("en-NG",{maximumFractionDigits:0})}
                    </div>
                  </div>
                </div>
              </div>

              {/* Wallet address */}
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:9,color:C.muted,letterSpacing:2,marginBottom:8 }}>
                  SEND {coin.id} TO THIS ADDRESS
                </div>
                <div style={{ background:"#080808",border:`1px solid ${C.border}`,
                  borderRadius:10,padding:"12px 14px" }}>
                  <div style={{ display:"flex",justifyContent:"space-between",
                    alignItems:"center",marginBottom:6 }}>
                    <span style={{ fontSize:9,color:coin.color,letterSpacing:1 }}>
                      {coin.id} · {coin.network}
                    </span>
                    <CopyBtn text="TQn9Y7tgsJgxnBt7K8aVHJp5mEkRdCPLsW"/>
                  </div>
                  <div style={{ fontFamily:"'DM Mono',monospace",fontSize:12,
                    color:C.green,wordBreak:"break-all",lineHeight:1.5 }}>
                    TQn9Y7tgsJgxnBt7K8aVHJp5mEkRdCPLsW
                  </div>
                </div>
                <div style={{ display:"flex",alignItems:"flex-start",gap:5,
                  marginTop:8,fontSize:11,color:C.amber }}>
                  <span style={{ flexShrink:0 }}>⚠</span>
                  <span>Send only {coin.id} on {coin.network}. Sending any other coin or network will result in permanent loss.</span>
                </div>
              </div>

              <button onClick={onClose} className="trade-btn"
                style={{ width:"100%",background:C.green,color:"#000",
                  fontWeight:700,fontSize:14,padding:"13px",
                  borderRadius:10,border:"none",fontFamily:"'Outfit',sans-serif",
                  marginBottom:8 }}>
                I've Sent the Payment ✓
              </button>
              <button onClick={()=>setStep(1)} className="ghost-btn"
                style={{ width:"100%",background:"transparent",
                  border:`1px solid ${C.border2}`,color:C.muted,
                  fontSize:13,padding:"10px",borderRadius:10,
                  fontFamily:"'Outfit',sans-serif",cursor:"pointer" }}>
                ← Change amount
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ─── TOPBAR ───────────────────────────────────────────────
function Topbar({ onNewTrade }) {
  const h = new Date().getHours();
  const greet = h<12?"Good morning":h<17?"Good afternoon":"Good evening";
  return (
    <div className="dashboard-topbar" style={{ height:56, display:"flex", alignItems:"center",
      justifyContent:"space-between", padding:"0 22px",
      borderBottom:`1px solid ${C.border}`, flexShrink:0,
      background:"rgba(6,6,6,0.95)", backdropFilter:"blur(12px)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
        <span className="topbar-greet" style={{ fontSize:13, color:C.muted }}>{greet}, </span>
        <span style={{ fontSize:13, fontWeight:600 }}>Adewale</span>
        <span className="topbar-status" style={{ marginLeft:6, display:"flex", alignItems:"center", gap:5,
          background:"rgba(14,203,129,0.06)", border:"1px solid rgba(14,203,129,0.15)",
          borderRadius:100, padding:"3px 8px" }}>
          <span style={{ width:5,height:5,borderRadius:"50%",background:C.green,
            animation:"pulse 2s infinite",display:"inline-block" }} />
          <span style={{ fontFamily:"'DM Mono',monospace",fontSize:9,
            color:C.green,letterSpacing:1 }}>LIVE</span>
        </span>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <button onClick={onNewTrade} className="trade-btn"
          style={{ background:C.green,color:"#000",fontWeight:700,
            fontSize:12,padding:"7px 16px",borderRadius:8,border:"none",
            display:"flex",alignItems:"center",gap:5,
            fontFamily:"'Outfit',sans-serif",cursor:"pointer" }}>
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span className="trade-btn-text">New Trade</span>
        </button>
        <button className="icon-btn"
          style={{ width:34,height:34,borderRadius:8,background:C.card,
            border:`1px solid ${C.border}`,display:"flex",alignItems:"center",
            justifyContent:"center",cursor:"pointer",color:C.muted,position:"relative" }}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>
          <span style={{ position:"absolute",top:6,right:6,width:5,height:5,
            borderRadius:"50%",background:C.red,border:"1.5px solid #060606" }} />
        </button>
        <div style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer",
          background:C.card, border:`1px solid ${C.border2}`,
          borderRadius:100, padding:"4px 12px 4px 4px" }}>
          <div style={{ width:26,height:26,borderRadius:"50%",
            background:`linear-gradient(135deg,${C.green},${C.amber})`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontFamily:"'Bebas Neue',sans-serif",fontSize:10,color:"#000",flexShrink:0 }}>AO</div>
          <span className="topbar-email" style={{ fontFamily:"'DM Mono',monospace",fontSize:11,
            color:"#aaa",maxWidth:160,overflow:"hidden",
            textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{USER_EMAIL}</span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardOverview() {
  const [modal, setModal]     = useState(false);
  const [modalCoin, setMCoin] = useState(null);

  useEffect(()=>{
    const s=document.createElement("style"); s.textContent=CSS; document.head.appendChild(s);
    return ()=>document.head.removeChild(s);
  },[]);

  const openTrade = (coin=null)=>{ setMCoin(coin); setModal(true); };

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
      <Topbar onNewTrade={()=>openTrade()}/>
      <Ticker/>

      <div style={{ flex:1, overflowY:"auto", padding:"18px 20px",
        display:"flex", flexDirection:"column", gap:14 }}>

        {/* Stats row */}
        <Stats/>

        {/* History + Rates */}
        <div className="content-row" style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
          <History/>
          <div className="rates-panel" style={{ width:268, flexShrink:0 }}>
            <RatesPanel onTrade={openTrade}/>
          </div>
        </div>
      </div>

      {modal && <TradeModal coin={modalCoin} onClose={()=>{ setModal(false); setMCoin(null); }}/>}
    </div>
  );
}
