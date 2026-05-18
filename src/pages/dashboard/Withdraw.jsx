import React, { useState, useEffect } from "react";

const C = {
  green:"#0ECB81", amber:"#F5A623", red:"#F6465D",
  bg:"#080808", surface:"#0c0c0c", card:"#101010", card2:"#141414",
  border:"#1a1a1a", border2:"#222222",
  text:"#ffffff", muted:"#555555", muted2:"#2e2e2e",
};

const CSS = `
  @keyframes fadeUp    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes slideIn   { from{opacity:0;transform:translateX(22px)} to{opacity:1;transform:translateX(0)} }
  @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes successIn { 0%{transform:scale(0.5);opacity:0} 65%{transform:scale(1.06)} 100%{transform:scale(1);opacity:1} }
  @keyframes checkDraw { from{stroke-dashoffset:70} to{stroke-dashoffset:0} }
  @keyframes ripple    { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(2.8);opacity:0} }
  @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes popIn     { 0%{transform:scale(0.6);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }

  .step-form       { animation:slideIn 0.3s ease; }
  .pri-btn         { transition:all 0.2s; }
  .pri-btn:hover:not(:disabled) { background:#0fdf8e !important; transform:translateY(-2px); box-shadow:0 10px 28px rgba(14,203,129,0.32) !important; }
  .pri-btn:disabled { opacity:0.35 !important; cursor:not-allowed !important; }
  .ghost-btn       { transition:all 0.18s; }
  .ghost-btn:hover { border-color:#555 !important; color:#ccc !important; }
  .bank-card       { transition:all 0.18s; }
  .bank-card:hover { border-color:#444 !important; background:#181818 !important; }
  .bank-card.sel   { border-color:rgba(14,203,129,0.4) !important; background:rgba(14,203,129,0.05) !important; }
  .amt-btn:hover   { background:rgba(255,255,255,0.07) !important; color:#fff !important; }
  .amt-btn         { transition:all 0.15s; }
  .st-input:focus  { border-color:rgba(14,203,129,0.5) !important; box-shadow:0 0 0 3px rgba(14,203,129,0.08) !important; outline:none; }
  .st-input        { transition:border-color 0.2s, box-shadow 0.2s; }
  .back-btn:hover  { color:#fff !important; }
  .back-btn        { transition:color 0.15s; }

  .withdraw-container {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .left-panel {
    width: 300px;
    background: #060606;
    border-right: 1px solid #1a1a1a;
    display: flex;
    flex-direction: column;
    height: 100%;
    flex-shrink: 0;
    padding: 28px 24px;
    position: relative;
    overflow-y: auto;
  }

  .form-area {
    flex: 1;
    overflow-y: auto;
    padding: 32px 48px 40px;
  }

  @media (max-width: 1024px) {
    .withdraw-container {
      flex-direction: column !important;
    }
    .left-panel {
      width: 100% !important;
      height: auto !important;
      border-right: none !important;
      border-bottom: 1px solid #1a1a1a !important;
      padding: 20px !important;
    }
    .left-panel-ambient, .left-panel-logo, .left-panel-title {
      display: none !important;
    }
    .form-area {
      padding: 24px 20px 40px !important;
    }
    .withdraw-topbar {
      display: none !important;
    }
  }

  @media (max-width: 640px) {
    .form-area {
      padding: 20px 16px 40px !important;
    }
    h2 {
      font-size: 32px !important;
    }
  }
`;

// ─── DATA ─────────────────────────────────────────────────
const NGN_BALANCE = 482200;
const MIN_WITHDRAWAL = 1000;
const MAX_WITHDRAWAL = 500000;

const BANKS = [
  { id:"b1", name:"GTBank",     number:"4521", account:"0123454521", type:"Savings",  isDefault:true  },
  { id:"b2", name:"Access Bank",number:"8812", account:"0198778812", type:"Current",  isDefault:false },
  { id:"b3", name:"Zenith Bank",number:"2230", account:"2012782230", type:"Savings",  isDefault:false },
];

const BANK_COLORS = {
  "GTBank":     { color:"#E8460A", bg:"linear-gradient(135deg,#1a0800,#3d1200)" },
  "Access Bank":{ color:"#D91921", bg:"linear-gradient(135deg,#1a0000,#3d0000)" },
  "Zenith Bank":{ color:"#E00000", bg:"linear-gradient(135deg,#1a0000,#2d0000)" },
};
const bankMeta = name => BANK_COLORS[name] || { color:"#888", bg:"linear-gradient(135deg,#111,#1a1a1a)" };

// ─── PROGRESS BAR ─────────────────────────────────────────
function ProgressBar({ step }) {
  const steps = ["Amount", "Bank", "Confirm"];
  const cur = ["amount","bank","review"].indexOf(step);
  return (
    <div style={{ display:"flex", alignItems:"flex-start", marginBottom:32 }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display:"flex", alignItems:"center",
          flex: i < steps.length-1 ? 1 : "none" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
            <div style={{ width:24, height:24, borderRadius:"50%",
              display:"flex", alignItems:"center", justifyContent:"center",
              background: i<cur ? C.green : i===cur ? "rgba(14,203,129,0.12)" : C.border2,
              border: i===cur ? `1px solid ${C.green}55` : "none",
              boxShadow: i===cur ? "0 0 0 4px rgba(14,203,129,0.06)" : "none",
              transition:"all 0.3s" }}>
              {i < cur
                ? <svg width={11} height={11} viewBox="0 0 11 11" fill="none"><path d="M1.5 5.5l2.5 3L9.5 2" stroke="#000" strokeWidth={1.5} strokeLinecap="round"/></svg>
                : <span style={{ fontSize:10, fontWeight:700, color:i===cur?C.green:C.muted }}>{i+1}</span>}
            </div>
            <span style={{ fontSize:9, letterSpacing:"0.5px", textTransform:"uppercase",
              color: i<=cur ? C.green : C.muted, whiteSpace:"nowrap" }}>{s}</span>
          </div>
          {i < steps.length-1 && (
            <div style={{ flex:1, height:1, margin:"0 10px 16px",
              background: i<cur ? `linear-gradient(90deg,${C.green},rgba(14,203,129,0.3))` : C.border,
              transition:"background 0.4s" }}/>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── LEFT PANEL ───────────────────────────────────────────
function LeftPanel({ amount, bank, step }) {
  const fmtN = n => n > 0 ? "₦"+Number(n).toLocaleString("en-NG",{maximumFractionDigits:0}) : "—";
  
  return (
    <div className="left-panel">
      <div className="left-panel-ambient" style={{ position:"absolute", top:-60, left:-60, width:300, height:300,
        borderRadius:"50%", background:`radial-gradient(circle,rgba(14,203,129,0.07),transparent 60%)`,
        filter:"blur(50px)", pointerEvents:"none" }}/>

      <div className="left-panel-title" style={{ fontSize:10, color:C.muted, letterSpacing:3, marginBottom:12 }}>WITHDRAWAL</div>
      <div className="left-panel-title" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:32,
        letterSpacing:1, lineHeight:0.9, marginBottom:28 }}>
        NGN TO<br/><span style={{ color:C.green }}>YOUR BANK</span>
      </div>

      {/* Balance card */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`,
        borderRadius:12, padding:"16px 18px", marginBottom:20 }}>
        <div style={{ fontSize:10, color:C.muted, letterSpacing:2, marginBottom:8 }}>
          AVAILABLE BALANCE
        </div>
        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:30,
          color:C.green, letterSpacing:1, lineHeight:1 }}>
          ₦{NGN_BALANCE.toLocaleString()}
        </div>
        <div style={{ fontSize:11, color:C.muted, marginTop:4 }}>Swift Trade wallet</div>
      </div>

      {/* Summary ticket */}
      <div style={{ flex:1 }}>
        {(amount || bank) ? (
          <div style={{ background:C.card, border:`1px solid ${C.border}`,
            borderRadius:12, overflow:"hidden" }}>
            <div style={{ padding:"10px 14px", borderBottom:`1px solid ${C.border}`,
              fontSize:10, color:C.muted, letterSpacing:2 }}>SUMMARY</div>
            <div style={{ padding:"4px 14px" }}>
              {[
                { label:"You Send",  val: amount > 0 ? `₦${Number(amount).toLocaleString()}` : null, green:true },
                { label:"Bank",      val: bank ? `${bank.name}` : null },
                { label:"Account",   val: bank ? `••${bank.number}` : null },
                { label:"Est. Time", val: amount > 0 ? "5–15 minutes" : null },
              ].map(r => (
                <div key={r.label} style={{ display:"flex", justifyContent:"space-between",
                  padding:"9px 0", borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ fontSize:11, color:C.muted }}>{r.label}</span>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:12,
                    color: r.val ? (r.green ? C.green : "#ccc") : C.muted2 }}>
                    {r.val || "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ border:`1px dashed ${C.muted2}`, borderRadius:12,
            padding:"28px 20px", textAlign:"center" }}>
            <div style={{ fontSize:28, marginBottom:10 }}>💸</div>
            <div style={{ fontSize:13, color:C.muted, lineHeight:1.6 }}>
              Enter an amount to start your withdrawal
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="left-panel-title" style={{ marginTop:20, display:"flex", flexDirection:"column", gap:8 }}>
        {[
          { icon:"⚡", text:"Arrives in 5–15 minutes" },
          { icon:"🏦", text:"All Nigerian banks supported" },
          { icon:"💯", text:"No withdrawal fees" },
        ].map(t => (
          <div key={t.text} style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:13 }}>{t.icon}</span>
            <span style={{ fontSize:11, color:C.muted }}>{t.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── STEP 1: AMOUNT ───────────────────────────────────────
function StepAmount({ amount, setAmount, onNext }) {
  const QUICK = [5000, 10000, 50000, 100000, 200000];
  const n       = parseFloat(amount) || 0;
  const tooLow  = n > 0 && n < MIN_WITHDRAWAL;
  const tooHigh = n > MAX_WITHDRAWAL;
  const overBal = n > NGN_BALANCE;
  const error   = tooLow  ? `Minimum withdrawal is ₦${MIN_WITHDRAWAL.toLocaleString()}`
                : tooHigh ? `Maximum withdrawal is ₦${MAX_WITHDRAWAL.toLocaleString()}`
                : overBal ? "Amount exceeds your available balance" : "";
  const isValid = n >= MIN_WITHDRAWAL && n <= MAX_WITHDRAWAL && n <= NGN_BALANCE;

  return (
    <div className="step-form">
      <div style={{ fontSize:10, color:C.muted, letterSpacing:3, marginBottom:10 }}>STEP 1</div>
      <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:42,
        letterSpacing:1, lineHeight:0.9, marginBottom:6 }}>
        HOW MUCH DO<br/>YOU WANT TO<br/><span style={{ color:C.green }}>WITHDRAW?</span>
      </h2>
      <p style={{ color:C.muted, fontSize:14, fontWeight:300,
        lineHeight:1.6, marginBottom:28 }}>
        Available: <span style={{ color:C.green, fontWeight:600 }}>
          ₦{NGN_BALANCE.toLocaleString()}
        </span>
      </p>

      {/* Input */}
      <div style={{ position:"relative", marginBottom: error ? 8 : 16 }}>
        <div style={{ position:"absolute", left:16, top:"50%",
          transform:"translateY(-50%)", fontFamily:"'DM Mono',monospace",
          fontSize:22, color:C.muted, pointerEvents:"none" }}>₦</div>
        <input className="st-input" type="number" value={amount}
          onChange={e => setAmount(e.target.value)}
          autoFocus placeholder="0"
          style={{ width:"100%", background:C.card2,
            border:`1px solid ${error ? "rgba(246,70,93,0.5)" : C.border2}`,
            borderRadius:12, padding:"16px 16px 16px 40px",
            color:"#fff", fontSize:24,
            fontFamily:"'DM Mono',monospace" }}/>
        {isValid && (
          <div style={{ position:"absolute", right:16, top:"50%",
            transform:"translateY(-50%)",
            animation:"popIn 0.2s ease" }}>
            <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
              <circle cx={10} cy={10} r={10} fill={C.green}/>
              <path d="M5 10l3.5 4L15 7" stroke="#000" strokeWidth={1.8}
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>

      {error && (
        <div style={{ display:"flex", gap:5, alignItems:"center",
          fontSize:12, color:C.red, marginBottom:14,
          animation:"fadeIn 0.2s ease" }}>
          <svg width={12} height={12} viewBox="0 0 12 12"><circle cx={6} cy={6} r={6} fill={C.red}/><path d="M6 3.5v3M6 7.5h.01" stroke="#000" strokeWidth={1.1} strokeLinecap="round"/></svg>
          {error}
        </div>
      )}

      {/* Quick amounts */}
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:10, color:C.muted, letterSpacing:2, marginBottom:10 }}>QUICK AMOUNTS</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {QUICK.map(q => (
            <button key={q} className="amt-btn"
              onClick={() => setAmount(String(q))}
              style={{ padding:"7px 14px", borderRadius:100,
                background: parseFloat(amount)===q ? "rgba(14,203,129,0.1)" : C.card2,
                border:`1px solid ${parseFloat(amount)===q ? "rgba(14,203,129,0.3)" : C.border2}`,
                color: parseFloat(amount)===q ? C.green : C.muted,
                fontSize:12, fontFamily:"'DM Mono',monospace",
                cursor:"pointer", fontWeight:500 }}>
              ₦{q.toLocaleString()}
            </button>
          ))}
          <button className="amt-btn"
            onClick={() => setAmount(String(NGN_BALANCE))}
            style={{ padding:"7px 14px", borderRadius:100,
              background: parseFloat(amount)===NGN_BALANCE ? "rgba(14,203,129,0.1)" : C.card2,
              border:`1px solid ${parseFloat(amount)===NGN_BALANCE ? "rgba(14,203,129,0.3)" : C.border2}`,
              color: parseFloat(amount)===NGN_BALANCE ? C.green : C.muted,
              fontSize:12, fontFamily:"'DM Mono',monospace", cursor:"pointer" }}>
            Max
          </button>
        </div>
      </div>

      {/* Fee note */}
      <div style={{ display:"flex", gap:8, alignItems:"center",
        background:"rgba(14,203,129,0.04)", border:"1px solid rgba(14,203,129,0.1)",
        borderRadius:10, padding:"11px 14px", marginBottom:24 }}>
        <svg width={13} height={13} viewBox="0 0 24 24" fill="none"
          stroke={C.green} strokeWidth={2} strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span style={{ fontSize:12, color:C.muted }}>
          Zero withdrawal fees. What you enter is exactly what you receive.
        </span>
      </div>

      <button disabled={!isValid} onClick={onNext} className="pri-btn"
        style={{ width:"100%", background:isValid?C.green:C.border,
          color:isValid?"#000":C.muted, fontWeight:700, fontSize:15,
          padding:"15px", borderRadius:12, border:"none",
          fontFamily:"'Outfit',sans-serif", cursor:"pointer" }}>
        Continue →
      </button>
    </div>
  );
}

// ─── STEP 2: BANK ─────────────────────────────────────────
function StepBank({ selected, onSelect, onNext }) {
  return (
    <div className="step-form">
      <div style={{ fontSize:10, color:C.muted, letterSpacing:3, marginBottom:10 }}>STEP 2</div>
      <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:42,
        letterSpacing:1, lineHeight:0.9, marginBottom:6 }}>
        SEND TO<br/><span style={{ color:C.green }}>WHICH ACCOUNT?</span>
      </h2>
      <p style={{ color:C.muted, fontSize:14, fontWeight:300,
        lineHeight:1.6, marginBottom:28 }}>
        Select where you want to receive your naira.
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
        {BANKS.map(b => {
          const meta = bankMeta(b.name);
          const isSel = selected?.id === b.id;
          return (
            <button key={b.id} className={`bank-card${isSel?" sel":""}`}
              onClick={() => onSelect(b)}
              style={{ width:"100%", background:C.card, border:`1px solid ${C.border}`,
                borderRadius:12, padding:"16px 18px", cursor:"pointer",
                display:"flex", alignItems:"center", gap:14,
                fontFamily:"'Outfit',sans-serif", textAlign:"left" }}>

              {/* Bank logo */}
              <div style={{ width:44, height:44, borderRadius:10, flexShrink:0,
                background:meta.bg, border:`1px solid ${meta.color}22`,
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontFamily:"'Bebas Neue',sans-serif",
                  fontSize:14, color:meta.color, letterSpacing:1 }}>
                  {b.name.slice(0,2).toUpperCase()}
                </span>
              </div>

              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                  <span style={{ fontSize:14, fontWeight:600,
                    color:isSel?C.green:"#ddd" }}>{b.name}</span>
                  {b.isDefault && (
                    <span style={{ fontSize:9, padding:"2px 7px", borderRadius:100,
                      background:"rgba(14,203,129,0.08)",
                      color:C.green, border:"1px solid rgba(14,203,129,0.2)",
                      letterSpacing:1, fontWeight:600 }}>DEFAULT</span>
                  )}
                </div>
                <div style={{ display:"flex", gap:12 }}>
                  <span style={{ fontFamily:"'DM Mono',monospace",
                    fontSize:12, color:C.muted }}>••••{b.number}</span>
                  <span style={{ fontSize:11, color:C.muted2 }}>{b.type}</span>
                </div>
              </div>

              {isSel
                ? <div style={{ width:20, height:20, borderRadius:"50%",
                    background:C.green, display:"flex", alignItems:"center",
                    justifyContent:"center", flexShrink:0,
                    animation:"popIn 0.2s ease" }}>
                    <svg width={10} height={10} viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5l2.5 3L8.5 2" stroke="#000" strokeWidth={1.2} strokeLinecap="round"/>
                    </svg>
                  </div>
                : <div style={{ width:20, height:20, borderRadius:"50%",
                    border:`1px solid ${C.border2}`, flexShrink:0 }}/>}
            </button>
          );
        })}
      </div>

      <button disabled={!selected} onClick={onNext} className="pri-btn"
        style={{ width:"100%", background:selected?C.green:C.border,
          color:selected?"#000":C.muted, fontWeight:700, fontSize:15,
          padding:"15px", borderRadius:12, border:"none",
          fontFamily:"'Outfit',sans-serif", cursor:"pointer" }}>
        Continue →
      </button>
    </div>
  );
}

// ─── STEP 3: REVIEW ───────────────────────────────────────
function StepReview({ amount, bank, onConfirm, loading }) {
  const meta = bankMeta(bank.name);
  return (
    <div className="step-form">
      <div style={{ fontSize:10, color:C.muted, letterSpacing:3, marginBottom:10 }}>STEP 3</div>
      <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:42,
        letterSpacing:1, lineHeight:0.9, marginBottom:24 }}>
        CONFIRM YOUR<br/><span style={{ color:C.green }}>WITHDRAWAL</span>
      </h2>

      {/* Amount hero */}
      <div style={{ background:"rgba(14,203,129,0.05)",
        border:"1px solid rgba(14,203,129,0.15)",
        borderRadius:14, padding:"20px 22px", marginBottom:16,
        display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:10, color:C.green, letterSpacing:2, marginBottom:6 }}>YOU RECEIVE</div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:40,
            color:"#fff", letterSpacing:1, lineHeight:1 }}>
            ₦{Number(amount).toLocaleString()}
          </div>
        </div>
        <div style={{ fontSize:36 }}>💸</div>
      </div>

      {/* Bank preview */}
      <div style={{ background:meta.bg, border:`1px solid ${meta.color}22`,
        borderRadius:12, padding:"16px 18px", marginBottom:16,
        display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ width:40, height:40, borderRadius:9, flexShrink:0,
          background:"rgba(0,0,0,0.3)", border:`1px solid ${meta.color}22`,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontFamily:"'Bebas Neue',sans-serif",
            fontSize:13, color:meta.color, letterSpacing:1 }}>
            {bank.name.slice(0,2).toUpperCase()}
          </span>
        </div>
        <div>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:2 }}>{bank.name}</div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color:"rgba(255,255,255,0.6)" }}>
            ••••{bank.number} · {bank.type}
          </div>
        </div>
      </div>

      {/* Details */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`,
        borderRadius:12, overflow:"hidden", marginBottom:20 }}>
        {[
          ["Amount",      `₦${Number(amount).toLocaleString()}`],
          ["Fee",         "₦0.00 — Free"],
          ["You Receive", `₦${Number(amount).toLocaleString()}`],
          ["Est. Time",   "5–15 minutes"],
        ].map(([k,v]) => (
          <div key={k} style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", padding:"12px 16px",
            borderBottom:`1px solid ${C.border}`,
            background:k==="You Receive"?"rgba(14,203,129,0.04)":"transparent" }}>
            <span style={{ fontSize:13, color:k==="You Receive"?C.green:C.muted }}>{k}</span>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:13,
              color:k==="You Receive"?C.green:k==="Fee"?"#888":"#ccc",
              fontWeight:k==="You Receive"?600:400 }}>{v}</span>
          </div>
        ))}
      </div>

      <button onClick={onConfirm} disabled={loading} className="pri-btn"
        style={{ width:"100%", background:C.green, color:"#000",
          fontWeight:700, fontSize:15, padding:"15px", borderRadius:12,
          border:"none", fontFamily:"'Outfit',sans-serif",
          display:"flex", alignItems:"center", justifyContent:"center", gap:10, cursor:"pointer" }}>
        {loading
          ? <><div style={{ width:18, height:18, borderRadius:"50%",
              border:"2.5px solid rgba(0,0,0,0.2)", borderTopColor:"#000",
              animation:"spin 0.8s linear infinite" }}/>Processing...</>
          : "Confirm Withdrawal ✓"}
      </button>

      <p style={{ textAlign:"center", fontSize:11, color:C.muted2,
        marginTop:12 }}>
        By confirming you agree to Swift Trade's withdrawal terms
      </p>
    </div>
  );
}

// ─── STEP 4: SUCCESS ──────────────────────────────────────
function StepDone({ amount, bank, refId, onReset }) {
  return (
    <div className="step-form" style={{ textAlign:"center", padding:"16px 0" }}>
      <div style={{ position:"relative", width:96, height:96, margin:"0 auto 24px" }}>
        <div style={{ position:"absolute", inset:-8, borderRadius:"50%",
          border:`2px solid rgba(14,203,129,0.4)`, animation:"ripple 0.8s ease-out" }}/>
        <div style={{ position:"absolute", inset:-8, borderRadius:"50%",
          border:`2px solid rgba(14,203,129,0.2)`, animation:"ripple 0.8s 0.25s ease-out" }}/>
        <div style={{ width:96, height:96, borderRadius:"50%",
          background:"rgba(14,203,129,0.1)", border:`2px solid ${C.green}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          animation:"successIn 0.5s ease", boxShadow:`0 0 40px rgba(14,203,129,0.2)` }}>
          <svg width={40} height={40} viewBox="0 0 40 40" fill="none">
            <path d="M8 20l8 9L32 12" stroke={C.green} strokeWidth={3}
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={70}
              style={{ animation:"checkDraw 0.5s 0.3s ease forwards", strokeDashoffset:70 }}/>
          </svg>
        </div>
      </div>

      <div style={{ display:"inline-flex", alignItems:"center", gap:7,
        background:"rgba(14,203,129,0.08)", border:"1px solid rgba(14,203,129,0.2)",
        borderRadius:100, padding:"4px 14px", fontSize:10, color:C.green,
        letterSpacing:3, marginBottom:16 }}>WITHDRAWAL SUBMITTED</div>

      <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:44,
        letterSpacing:1, lineHeight:0.9, marginBottom:12 }}>
        ON ITS<br/><span style={{ color:C.green }}>WAY TO YOU!</span>
      </h2>

      <p style={{ color:C.muted, fontSize:14, lineHeight:1.7,
        maxWidth:320, margin:"0 auto 24px" }}>
        <span style={{ color:C.green, fontWeight:600 }}>
          ₦{Number(amount).toLocaleString()}
        </span> is being sent to your {bank.name} account ending in ••{bank.number}. Expected within 5–15 minutes.
      </p>

      {/* Ref */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`,
        borderRadius:12, padding:"16px 18px", marginBottom:24, textAlign:"left" }}>
        <div style={{ fontSize:9, color:C.muted, letterSpacing:2, marginBottom:8 }}>
          REFERENCE ID
        </div>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:18,
          color:C.green, fontWeight:500, marginBottom:4 }}>{refId}</div>
        <div style={{ fontSize:11, color:C.muted }}>
          Save this to track your withdrawal
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        <button onClick={onReset} className="pri-btn"
          style={{ background:C.green, color:"#000", fontWeight:700,
            fontSize:14, padding:"13px", borderRadius:11,
            border:"none", fontFamily:"'Outfit',sans-serif", cursor:"pointer" }}>
          New Withdrawal
        </button>
        <button className="ghost-btn"
          style={{ background:"transparent", border:`1px solid ${C.border2}`,
            color:C.muted, fontSize:14, padding:"13px", borderRadius:11,
            fontFamily:"'Outfit',sans-serif", cursor:"pointer" }}>
          Dashboard →
        </button>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────
export default function Withdraw() {
  const [step, setStep]     = useState("amount");
  const [amount, setAmount] = useState("");
  const [bank, setBank]     = useState(BANKS.find(b => b.isDefault) || null);
  const [loading, setLoading] = useState(false);
  const [refId, setRefId]   = useState("");

  useEffect(() => {
    const s = document.createElement("style"); s.textContent = CSS;
    document.head.appendChild(s); return () => document.head.removeChild(s);
  }, []);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRefId("WD-" + Math.floor(1000 + Math.random() * 9000));
      setStep("done");
    }, 1600);
  };

  const handleReset = () => {
    setStep("amount"); setAmount(""); setRefId("");
    setBank(BANKS.find(b => b.isDefault) || null);
  };

  const next = () => {
    if (step === "amount") setStep("bank");
    else if (step === "bank") setStep("review");
  };

  const back = () => {
    if (step === "bank")   setStep("amount");
    if (step === "review") setStep("bank");
  };

  return (
    <div className="withdraw-container">
      <LeftPanel amount={parseFloat(amount)||0} bank={bank} step={step}/>

      {/* Right */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

        {/* Topbar */}
        <div className="withdraw-topbar" style={{ height:54, display:"flex", alignItems:"center",
          justifyContent:"space-between", padding:"0 32px",
          borderBottom:`1px solid ${C.border}`,
          background:"rgba(8,8,8,0.95)", backdropFilter:"blur(12px)", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            {step !== "amount" && step !== "done" && (
              <button className="back-btn" onClick={back}
                style={{ background:"none", border:"none", color:C.muted,
                  fontSize:12, cursor:"pointer", display:"flex",
                  alignItems:"center", gap:5, padding:0,
                  fontFamily:"'Outfit',sans-serif" }}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                  <path d="M19 12H5M12 5l-7 7 7 7"/>
                </svg>
                Back
              </button>
            )}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ width:5, height:5, borderRadius:"50%", background:C.green,
              animation:"pulse 2s infinite", display:"inline-block" }}/>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9,
              color:C.green }}>INSTANT TRANSFER</span>
          </div>
        </div>

        {/* Scrollable form */}
        <div className="form-area">
          <div style={{ maxWidth:520, margin:"0 auto" }}>

            {step !== "done" && <ProgressBar step={step}/>}

            {step === "amount" && (
              <StepAmount amount={amount} setAmount={setAmount} onNext={next}/>
            )}

            {step === "bank" && (
              <StepBank selected={bank} onSelect={setBank} onNext={next}/>
            )}

            {step === "review" && (
              <StepReview amount={amount} bank={bank}
                onConfirm={handleConfirm} loading={loading}/>
            )}

            {step === "done" && (
              <StepDone amount={amount} bank={bank}
                refId={refId} onReset={handleReset}/>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
