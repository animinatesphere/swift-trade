import React, { useState, useEffect, useRef } from "react";
import api from "../../api/axios";

const C = {
  green: "#0ECB81", amber: "#F5A623", red: "#F6465D", blue: "#3B82F6",
  bg: "#080808", surface: "#0c0c0c", card: "#101010", card2: "#141414",
  border: "#1a1a1a", border2: "#222222",
  text: "#ffffff", muted: "#888888", muted2: "#2e2e2e",
};

const MAX_ACCOUNTS = 5;

const CSS = `
  @keyframes fadeUp    { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes slideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes popIn     { 0%{transform:scale(0.7);opacity:0} 70%{transform:scale(1.06)} 100%{transform:scale(1);opacity:1} }
  @keyframes successIn { 0%{transform:scale(0.5);opacity:0} 65%{transform:scale(1.06)} 100%{transform:scale(1);opacity:1} }
  @keyframes checkDraw { from{stroke-dashoffset:70} to{stroke-dashoffset:0} }
  @keyframes pulse     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.35;transform:scale(0.8)} }
  @keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes ripple    { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(2.6);opacity:0} }

  .bank-page { display:flex; flex:1; overflow:hidden; min-width:0; }
  .bank-left {
    width:300px; background:#060606; border-right:1px solid #1a1a1a;
    display:flex; flex-direction:column; flex-shrink:0; padding:28px 24px;
    position:relative; overflow-y:auto;
  }
  .bank-main { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; }
  .bank-scroll { flex:1; overflow-y:auto; padding:28px 32px 40px; }

  .stat-chip { animation:fadeUp 0.4s ease both; }
  .acct-row  { animation:fadeUp 0.35s ease both; transition:background 0.15s, border-color 0.15s; }
  .acct-row:hover { background:#141414 !important; border-color:#2a2a2a !important; }

  .pri-btn:hover:not(:disabled) { background:#0fdf8e !important; transform:translateY(-1px); box-shadow:0 8px 24px rgba(14,203,129,0.28) !important; }
  .pri-btn:disabled { opacity:0.35 !important; cursor:not-allowed !important; }
  .pri-btn, .ghost-btn, .icon-act { transition:all 0.18s; }
  .ghost-btn:hover:not(:disabled) { border-color:#444 !important; color:#ccc !important; }
  .icon-act:hover { background:rgba(255,255,255,0.06) !important; color:#fff !important; }
  .icon-act.danger:hover { background:rgba(246,70,93,0.1) !important; color:#F6465D !important; }
  .icon-act.primary:hover { background:rgba(14,203,129,0.1) !important; color:#0ECB81 !important; }

  .add-slot:hover { border-color:rgba(14,203,129,0.35) !important; background:rgba(14,203,129,0.03) !important; }
  .add-slot { transition:all 0.2s; cursor:pointer; }

  .bank-opt:hover  { background:#1c1c1c !important; }
  .bank-opt.sel    { background:rgba(14,203,129,0.07) !important; }
  .bank-opt        { transition:background 0.15s; }
  .st-input:focus  { border-color:rgba(14,203,129,0.5) !important; box-shadow:0 0 0 3px rgba(14,203,129,0.07) !important; outline:none; }
  .st-input        { transition:border-color 0.2s, box-shadow 0.2s; }

  @media (max-width:1024px) {
    .bank-page { flex-direction:column; }
    .bank-left { display:none !important; }
    .bank-scroll { padding:20px 16px 32px; }
    .bank-topbar { display:none !important; }
    .stats-row { grid-template-columns:1fr 1fr !important; }
    .acct-actions .act-label { display:none !important; }
  }
  @media (max-width:640px) {
    .stats-row { grid-template-columns:1fr !important; }
  }
`;

const BANK_COLORS = {
  "GTBank":     { color:"#E8460A" },
  "Access Bank":{ color:"#D91921" },
  "Zenith Bank":{ color:"#E00000" },
  "First Bank": { color:"#005CA8" },
  "UBA":        { color:"#E20A16" },
  "Fidelity Bank":{ color:"#5DAB00" },
  "FCMB":       { color:"#009900" },
  "Kuda Bank":  { color:"#4000BF" },
  "OPay":       { color:"#00B140" },
  "Moniepoint": { color:"#006CFF" },
  "Polaris Bank": { color:"#E2001A" },
  "Keystone Bank":{ color:"#046A38" },
};

function getBankMeta(code, name) {
  const color = BANK_COLORS[name]?.color || "#888";
  const abbr = name ? name.substring(0, 2).toUpperCase() : "BK";
  return { color, abbr, name };
}

function maskAccount(num) {
  if (!num) return "";
  return `•••• •••• ${num.slice(-4)}`;
}

// ─── LEFT PANEL ───────────────────────────────────────────
function LeftPanel({ banks }) {
  const def = banks.find(b => b.isDefault) || banks[0];
  const meta = def ? getBankMeta(def.bankCode, def.bankName) : null;

  return (
    <div className="bank-left">
      <div className="bank-left-hero" style={{ position:"absolute", top:-50, left:-50, width:260, height:260,
        borderRadius:"50%", background:"radial-gradient(circle,rgba(14,203,129,0.07),transparent 60%)",
        filter:"blur(40px)", pointerEvents:"none" }} />

      <div className="bank-left-hero" style={{ fontSize:10, color:C.muted, letterSpacing:3, marginBottom:16 }}>WITHDRAWALS</div>
      <div className="bank-left-hero" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:34,
        letterSpacing:1, lineHeight:0.92, marginBottom:28 }}>
        BANK<br/><span style={{ color:C.green }}>ACCOUNTS</span>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
        {[
          { label:"Saved accounts", val:banks.length, sub:`of ${MAX_ACCOUNTS} max` },
          { label:"Default payout", val:def?.bankName || "None set", sub:def ? `••${def.accountNumber.slice(-4)}` : "Add an account" },
        ].map(s => (
          <div key={s.label} style={{ background:C.card, border:`1px solid ${C.border}`,
            borderRadius:12, padding:"12px 14px" }}>
            <div style={{ fontSize:10, color:C.muted, letterSpacing:1, marginBottom:4 }}>{s.label.toUpperCase()}</div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, color:"#fff", letterSpacing:0.5, lineHeight:1 }}>{s.val}</div>
            <div style={{ fontSize:11, color:C.muted, marginTop:4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {def && meta && (
        <div className="bank-left-default" style={{ background:C.card, border:`1px solid ${meta.color}33`,
          borderRadius:14, padding:"16px", marginBottom:24, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", right:-20, top:-20, width:100, height:100,
            borderRadius:"50%", background:`${meta.color}15`, filter:"blur(20px)" }} />
          <div style={{ fontSize:9, color:meta.color, letterSpacing:2, marginBottom:10 }}>DEFAULT ACCOUNT</div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:`${meta.color}18`,
              border:`1px solid ${meta.color}33`, display:"flex", alignItems:"center", justifyContent:"center",
              fontFamily:"'Bebas Neue',sans-serif", fontSize:13, color:meta.color }}>{meta.abbr}</div>
            <div>
              <div style={{ fontSize:14, fontWeight:600 }}>{def.bankName}</div>
              <div style={{ fontSize:11, color:C.muted }}>{def.type}</div>
            </div>
          </div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color:"#ccc", letterSpacing:1 }}>{maskAccount(def.accountNumber)}</div>
          <div style={{ fontSize:11, color:C.muted, marginTop:8, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{def.accountName}</div>
        </div>
      )}

      <div style={{ marginTop:"auto", display:"flex", flexDirection:"column", gap:12 }}>
        {[
          {
            icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M3 10h18"/><path d="M5 6l7-3 7 3"/><path d="M4 10v11"/><path d="M20 10v11"/><path d="M8 14v3"/><path d="M12 14v3"/><path d="M16 14v3"/></svg>,
            text:"NGN withdrawals go to your default account"
          },
          {
            icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
            text:"Account names are verified before saving"
          },
          {
            icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
            text:"Switch default anytime in one tap"
          },
        ].map(t => (
          <div key={t.text} style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ display:"flex", color:C.muted }}>{t.icon}</span>
            <span style={{ fontSize:12, color:C.muted, lineHeight:1.4 }}>{t.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ACCOUNT ROW ──────────────────────────────────────────
function AccountRow({ account, index, onDelete, onSetDefault }) {
  const meta = getBankMeta(account.bankCode, account.bankName);

  return (
    <div className="acct-row" style={{
      display:"flex", alignItems:"center", gap:14,
      background:C.card, border:`1px solid ${account.isDefault ? "rgba(14,203,129,0.25)" : C.border}`,
      borderRadius:14, padding:"16px 18px",
      animationDelay:`${index * 0.05}s`,
      position:"relative", overflow:"hidden",
    }}>
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3,
        background: account.isDefault ? C.green : meta.color, borderRadius:"14px 0 0 14px" }} />

      <div style={{ width:44, height:44, borderRadius:12, flexShrink:0,
        background:`${meta.color}14`, border:`1px solid ${meta.color}28`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontFamily:"'Bebas Neue',sans-serif", fontSize:15, color:meta.color, marginLeft:4 }}>
        {meta.abbr}
      </div>

      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
          <span style={{ fontSize:15, fontWeight:600 }}>{account.bankName}</span>
          {account.isDefault && (
            <span style={{ fontSize:9, color:C.green, background:"rgba(14,203,129,0.1)",
              border:"1px solid rgba(14,203,129,0.22)", borderRadius:100,
              padding:"2px 8px", letterSpacing:1, fontWeight:700 }}>DEFAULT</span>
          )}
          <span style={{ fontSize:10, color:C.muted, background:C.card2,
            border:`1px solid ${C.border}`, borderRadius:100, padding:"2px 8px" }}>{account.type}</span>
        </div>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:13, color:"#ccc", letterSpacing:0.5, marginBottom:3 }}>
          {maskAccount(account.accountNumber)}
        </div>
        <div style={{ fontSize:12, color:C.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
          {account.accountName}
        </div>
      </div>

      <div className="acct-actions" style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
        {!account.isDefault && (
          <button onClick={() => onSetDefault(account.id)} className="icon-act"
            title="Make Default"
            style={{ background:"transparent", border:`1px solid ${C.border2}`,
              borderRadius:8, padding:"7px 10px", cursor:"pointer", color:C.muted,
              fontSize:11, fontWeight:600, fontFamily:"'Outfit',sans-serif",
              display:"flex", alignItems:"center", gap:5 }}>
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span className="act-label">Make Default</span>
          </button>
        )}
        <button onClick={() => onDelete(account.id)} className="icon-act danger"
          title="Remove account"
          style={{ background:"transparent", border:`1px solid ${C.border2}`,
            borderRadius:8, padding:"7px 10px", cursor:"pointer", color:C.muted,
            fontSize:11, fontWeight:600, fontFamily:"'Outfit',sans-serif",
            display:"flex", alignItems:"center", gap:5 }}>
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
          <span className="act-label">Remove</span>
        </button>
      </div>
    </div>
  );
}

// ─── ADD MODAL ────────────────────────────────────────────
function AddAccountModal({ onAdd, onClose, supportedBanks }) {
  // Views: "form" | "bankPicker" | "confirm" | "success"
  const [view, setView] = useState("form");
  const [accountNumber, setAccNum] = useState("");
  const [selectedBank, setBank] = useState(null);
  const [accountName, setAccName] = useState("");
  const [accountType, setAccType] = useState("Savings");
  const [resolving, setResolving] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [bankSearch, setBankSearch] = useState("");
  const searchRef = useRef(null);

  // Live account name resolution
  useEffect(() => {
    let cancel = false;
    const resolveAccount = async () => {
      if (accountNumber.length === 10 && selectedBank) {
        setResolving(true); setResolved(false); setAccName(""); setErrorMsg("");
        try {
          const res = await api.post("/wallets/resolve-account", {
            account_number: accountNumber,
            bank_code: selectedBank.code
          });
          if (!cancel) {
            setAccName(res.data.account_name);
            setResolved(true);
          }
        } catch (err) {
          if (!cancel) {
            setErrorMsg(err.response?.data?.detail || "Could not verify account details.");
          }
        } finally {
          if (!cancel) setResolving(false);
        }
      } else {
        setResolved(false); setAccName(""); setErrorMsg("");
      }
    };
    
    const t = setTimeout(resolveAccount, 800);
    return () => { clearTimeout(t); cancel = true; };
  }, [accountNumber, selectedBank]);

  // Auto-focus search when bankPicker opens
  useEffect(() => {
    if (view === "bankPicker" && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [view]);

  const canSubmit = accountNumber.length === 10 && selectedBank && resolved && accountName;
  const filteredBanks = supportedBanks.filter(b =>
    (b?.name || "").toLowerCase().includes((bankSearch || "").toLowerCase())
  );

  const handleSubmit = () => { setLoading(true); setTimeout(() => { setLoading(false); setView("confirm"); }, 300); };
  
  const handleConfirm = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await api.post("/wallets/bank-accounts", {
        bank_code: selectedBank.code,
        account_number: accountNumber
      });
      const newAcc = {
        id: res.data.id,
        bankCode: res.data.bank_code,
        bankName: res.data.bank_name,
        accountNumber: res.data.account_number,
        accountName: res.data.account_name,
        type: "Savings",
        isDefault: res.data.is_default
      };
      onAdd(newAcc);
      setView("success");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.detail || err.response?.data?.error || "Failed to add account");
      setView("form");
    } finally {
      setLoading(false);
    }
  };

  const handleBankPick = (b) => {
    setBank(b);
    setBankSearch("");
    setView("form");
  };

  // ─── HEADER ───
  const getHeader = () => {
    if (view === "bankPicker") return { step: "SELECT BANK", title: "Choose Your Bank" };
    if (view === "confirm") return { step: "STEP 2 OF 2", title: "Confirm Details" };
    if (view === "success") return { step: "DONE", title: "Account Saved" };
    return { step: "STEP 1 OF 2", title: "Add Bank Account" };
  };
  const header = getHeader();

  return (
    <>
      <div onClick={view === "bankPicker" ? () => setView("form") : onClose}
        style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.78)",
          backdropFilter:"blur(5px)", zIndex:200, animation:"fadeIn 0.2s ease" }} />
      <div style={{ position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
        zIndex:201, width:"92%", maxWidth:440, background:C.card,
        border:`1px solid ${C.border2}`, borderRadius:18,
        boxShadow:"0 32px 64px rgba(0,0,0,0.7)",
        display:"flex", flexDirection:"column",
        maxHeight: view === "bankPicker" ? "80vh" : "auto",
        overflow:"hidden",
        willChange:"transform", animation:"fadeIn 0.2s ease" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
          padding:"16px 20px", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {view === "bankPicker" && (
              <button onClick={() => { setView("form"); setBankSearch(""); }}
                style={{ background:C.card2, border:`1px solid ${C.border}`,
                  borderRadius:8, width:30, height:30, display:"flex", alignItems:"center",
                  justifyContent:"center", cursor:"pointer", color:C.muted, fontSize:14 }}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth={2} strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
            )}
            <div>
              <div style={{ fontSize:10, color:C.muted, letterSpacing:2, marginBottom:3 }}>{header.step}</div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:1 }}>{header.title}</div>
            </div>
          </div>
          {view !== "success" && view !== "bankPicker" && (
            <button onClick={onClose} style={{ background:C.card2, border:`1px solid ${C.border}`,
              borderRadius:8, width:30, height:30, display:"flex", alignItems:"center",
              justifyContent:"center", cursor:"pointer", color:C.muted, fontSize:15 }}>{"\u2715"}</button>
          )}
        </div>

        {/* ─── BANK PICKER VIEW ─── */}
        {view === "bankPicker" && (
          <>
            <div style={{ padding:"12px 16px", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
              <div style={{ position:"relative" }}>
                <svg width={13} height={13} viewBox="0 0 24 24" fill="none"
                  stroke={C.muted} strokeWidth={2} strokeLinecap="round"
                  style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input ref={searchRef} value={bankSearch}
                  onChange={e => setBankSearch(e.target.value)}
                  placeholder="Search banks..."
                  className="st-input"
                  style={{ width:"100%", background:"#0a0a0a", border:`1px solid ${C.border2}`,
                    borderRadius:9, padding:"11px 14px 11px 34px", color:"#fff", fontSize:13,
                    fontFamily:"'Outfit',sans-serif" }} />
              </div>
            </div>
            <div style={{ flex:1, overflowY:"auto", minHeight:0 }}>
              {filteredBanks.length === 0 ? (
                <div style={{ padding:"32px", textAlign:"center", color:C.muted, fontSize:13 }}>
                  No banks match &ldquo;{bankSearch}&rdquo;
                </div>
              ) : filteredBanks.map(b => {
                const meta = getBankMeta(b.code, b.name);
                const isSel = selectedBank?.code === b.code;
                return (
                  <button key={b.code} className={`bank-opt${isSel ? " sel" : ""}`}
                    onClick={() => handleBankPick(b)}
                    style={{ width:"100%", display:"flex", alignItems:"center", gap:10,
                      padding:"12px 16px", background:"transparent", border:"none",
                      borderBottom:`1px solid ${C.border}`, color:"#fff", cursor:"pointer",
                      fontFamily:"'Outfit',sans-serif", textAlign:"left" }}>
                    <div style={{ width:32, height:32, borderRadius:8, background:`${meta.color}18`,
                      border:`1px solid ${meta.color}28`, display:"flex", alignItems:"center",
                      justifyContent:"center", fontFamily:"'Bebas Neue',sans-serif",
                      fontSize:11, color:meta.color, flexShrink:0 }}>{meta.abbr}</div>
                    <span style={{ fontSize:14, fontWeight:500 }}>{b.name}</span>
                    {isSel && (
                      <svg width={16} height={16} viewBox="0 0 16 16" fill="none" style={{ marginLeft:"auto" }}>
                        <circle cx={8} cy={8} r={8} fill={C.green}/>
                        <path d="M4 8l2.5 3L12 5" stroke="#000" strokeWidth={1.5} strokeLinecap="round"/>
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ─── FORM VIEW ─── */}
        {view === "form" && (
          <div style={{ padding:"20px" }}>
            {errorMsg && (
              <div style={{ background:"rgba(246,70,93,0.1)", border:"1px solid rgba(246,70,93,0.2)",
                borderRadius:10, padding:"12px", marginBottom:14, color:C.red, fontSize:13 }}>
                {errorMsg}
              </div>
            )}
            <div style={{ marginBottom:14 }}>
              <label style={{ display:"block", fontSize:10, color:C.muted, letterSpacing:2, marginBottom:8 }}>ACCOUNT NUMBER</label>
              <div style={{ position:"relative" }}>
                <input className="st-input" type="text" maxLength={10} value={accountNumber}
                  onChange={e => setAccNum(e.target.value.replace(/\D/g, ""))}
                  placeholder="10-digit account number"
                  style={{ width:"100%", background:"#0a0a0a", border:`1px solid ${resolved ? C.green : C.border2}`,
                    borderRadius:10, padding:"13px 44px 13px 14px", color:"#fff", fontSize:15,
                    fontFamily:"'DM Mono',monospace", letterSpacing:2 }} />
                <div style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)" }}>
                  {resolving && (
                    <div style={{ width:16, height:16, borderRadius:"50%",
                      border:"2px solid rgba(14,203,129,0.2)", borderTopColor:C.green,
                      animation:"spin 0.8s linear infinite" }} />
                  )}
                  {resolved && !resolving && (
                    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" style={{ animation:"popIn 0.2s ease" }}>
                      <circle cx={8} cy={8} r={8} fill={C.green}/>
                      <path d="M4 8l2.5 3L12 5" stroke="#000" strokeWidth={1.5} strokeLinecap="round"/>
                    </svg>
                  )}
                </div>
              </div>
            </div>

            <div style={{ marginBottom:14 }}>
              <label style={{ display:"block", fontSize:10, color:C.muted, letterSpacing:2, marginBottom:8 }}>BANK</label>
              <button onClick={() => setView("bankPicker")}
                style={{ width:"100%", background:"#0a0a0a",
                  border:`1px solid ${selectedBank ? C.green : C.border2}`,
                  borderRadius:10, padding:"13px 14px", color:selectedBank ? "#fff" : C.muted,
                  fontSize:14, cursor:"pointer", display:"flex", justifyContent:"space-between",
                  alignItems:"center", fontFamily:"'Outfit',sans-serif", textAlign:"left" }}>
                <span>{selectedBank ? selectedBank.name : "Choose your bank"}</span>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={C.muted}
                  strokeWidth={2} strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>

            {resolved && accountName && (
              <div style={{ background:"rgba(14,203,129,0.05)", border:"1px solid rgba(14,203,129,0.15)",
                borderRadius:10, padding:"12px 14px", marginBottom:14, animation:"fadeIn 0.25s ease" }}>
                <div style={{ fontSize:9, color:C.green, letterSpacing:2, marginBottom:4 }}>ACCOUNT NAME</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:14, color:"#fff" }}>{accountName}</div>
              </div>
            )}

            <button disabled={!canSubmit || loading} onClick={handleSubmit} className="pri-btn"
              style={{ width:"100%", background:canSubmit ? C.green : C.border,
                color:canSubmit ? "#000" : C.muted, fontWeight:700, fontSize:14,
                padding:"14px", borderRadius:11, border:"none", fontFamily:"'Outfit',sans-serif",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              {loading ? "Preparing\u2026" : "Continue \u2192"}
            </button>
          </div>
        )}

        {/* ─── CONFIRM VIEW ─── */}
        {view === "confirm" && (
          <div style={{ padding:"20px" }}>
            {[
              ["Bank", selectedBank?.name],
              ["Account Number", accountNumber],
              ["Account Name", accountName],
              ["Type", accountType],
            ].map(([k, v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between",
                padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
                <span style={{ fontSize:13, color:C.muted }}>{k}</span>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:13, color:"#ccc" }}>{v}</span>
              </div>
            ))}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:20 }}>
              <button onClick={() => setView("form")} className="ghost-btn" disabled={loading}
                style={{ background:"transparent", border:`1px solid ${C.border2}`, color:C.muted,
                  fontSize:14, padding:"13px", borderRadius:11, cursor:"pointer",
                  fontFamily:"'Outfit',sans-serif" }}>{"\u2190"} Edit</button>
              <button onClick={handleConfirm} className="pri-btn" disabled={loading}
                style={{ background:C.green, color:"#000", fontWeight:700, fontSize:14,
                  padding:"13px", borderRadius:11, border:"none", cursor:"pointer",
                  fontFamily:"'Outfit',sans-serif", display: "flex", justifyContent: "center", alignItems: "center" }}>
                {loading ? (
                  <><div style={{ width:16, height:16, marginRight:8, borderRadius:"50%", border:"2px solid rgba(0,0,0,0.2)", borderTopColor:"#000", animation:"spin 0.8s linear infinite" }} /> Saving...</>
                ) : "Confirm & Add"}
              </button>
            </div>
          </div>
        )}

        {/* ─── SUCCESS VIEW ─── */}
        {view === "success" && (
          <div style={{ padding:"20px", textAlign:"center" }}>
            <div style={{ position:"relative", width:72, height:72, margin:"12px auto 18px" }}>
              <div style={{ position:"absolute", inset:-6, borderRadius:"50%",
                border:"2px solid rgba(14,203,129,0.35)", animation:"ripple 0.8s ease-out" }} />
              <div style={{ width:72, height:72, borderRadius:"50%",
                background:"rgba(14,203,129,0.1)", border:`2px solid ${C.green}`,
                display:"flex", alignItems:"center", justifyContent:"center", animation:"successIn 0.45s ease" }}>
                <svg width={30} height={30} viewBox="0 0 34 34" fill="none">
                  <path d="M7 17l6 7L27 10" stroke={C.green} strokeWidth={2.5}
                    strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray={70}
                    style={{ animation:"checkDraw 0.5s 0.2s ease forwards", strokeDashoffset:70 }} />
                </svg>
              </div>
            </div>
            <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:26, letterSpacing:1, marginBottom:8 }}>ACCOUNT ADDED</h3>
            <p style={{ color:C.muted, fontSize:13, lineHeight:1.6, marginBottom:22 }}>
              {selectedBank?.name} is saved. Use it for NGN withdrawals anytime.
            </p>
            <button onClick={onClose} className="pri-btn"
              style={{ width:"100%", background:C.green, color:"#000", fontWeight:700,
                fontSize:14, padding:"13px", borderRadius:11, border:"none", cursor:"pointer",
                fontFamily:"'Outfit',sans-serif" }}>Done</button>
          </div>
        )}
      </div>
    </>
  );
}

function DeleteConfirm({ account, onConfirm, onCancel }) {
  const [loading, setLoading] = useState(false);
  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
  };

  return (
    <>
      <div onClick={onCancel} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)",
        backdropFilter:"blur(4px)", zIndex:200 }} />
      <div style={{ position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
        zIndex:201, width:"92%", maxWidth:360, background:C.card,
        border:"1px solid rgba(246,70,93,0.25)", borderRadius:16, padding:"22px",
        boxShadow:"0 24px 48px rgba(0,0,0,0.6)", animation:"slideUp 0.25s ease" }}>
        <div style={{ width:48, height:48, borderRadius:"50%", background:"rgba(246,70,93,0.1)",
          border:"1px solid rgba(246,70,93,0.2)", display:"flex", alignItems:"center",
          justifyContent:"center", margin:"0 auto 14px" }}>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={C.red}
            strokeWidth={2} strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
        </div>
        <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, textAlign:"center",
          letterSpacing:1, marginBottom:8 }}>REMOVE ACCOUNT?</h3>
        <p style={{ color:C.muted, fontSize:13, textAlign:"center", lineHeight:1.6, marginBottom:18 }}>
          Remove <span style={{ color:"#ccc" }}>{account.bankName} ••{account.accountNumber.slice(-4)}</span> from your saved accounts?
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <button onClick={onCancel} className="ghost-btn" disabled={loading}
            style={{ background:"transparent", border:`1px solid ${C.border2}`, color:C.muted,
              fontSize:14, padding:"12px", borderRadius:10, cursor:"pointer",
              fontFamily:"'Outfit',sans-serif" }}>Cancel</button>
          <button onClick={handleConfirm} disabled={loading}
            style={{ background:"rgba(246,70,93,0.12)", border:"1px solid rgba(246,70,93,0.3)",
              color:C.red, fontWeight:700, fontSize:14, padding:"12px", borderRadius:10,
              cursor:"pointer", fontFamily:"'Outfit',sans-serif" }}>
            {loading ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── MAIN ─────────────────────────────────────────────────
export default function BankAccounts() {
  const [banks, setBanks] = useState([]);
  const [supportedBanks, setSupportedBanks] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingInitial(true);
        
        // 1. Fetch Supported Banks (with fallback if backend Paystack is unconfigured)
        let fetchedBanks = [];
        try {
          const banksRes = await api.get("/wallets/banks");
          fetchedBanks = Array.isArray(banksRes.data) ? banksRes.data : [];
        } catch (e) {
          console.warn("Could not fetch live banks, using fallback list:", e);
          fetchedBanks = [
            { code:"058", name:"GTBank" }, { code:"044", name:"Access Bank" },
            { code:"057", name:"Zenith Bank" }, { code:"011", name:"First Bank" },
            { code:"033", name:"UBA" }, { code:"070", name:"Fidelity Bank" },
            { code:"214", name:"FCMB" }, { code:"000", name:"Kuda Bank" },
            { code:"100", name:"OPay" }, { code:"50515", name:"Moniepoint" },
            { code:"076", name:"Polaris Bank" }, { code:"082", name:"Keystone Bank" }
          ];
        }
        setSupportedBanks(fetchedBanks);

        // 2. Fetch User's Linked Bank Accounts
        const accountsRes = await api.get("/wallets/bank-accounts");
        const accountsData = Array.isArray(accountsRes.data) ? accountsRes.data : [];
        const formattedAccounts = accountsData.map(b => ({
          id: b.id,
          bankCode: b.bank_code,
          bankName: b.bank_name,
          accountNumber: b.account_number,
          accountName: b.account_name,
          type: "Savings",
          isDefault: b.is_default
        }));
        setBanks(formattedAccounts);
      } catch (err) {
        console.error("Failed to fetch bank accounts data", err);
      } finally {
        setLoadingInitial(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await api.delete(`/wallets/bank-accounts/${deleting.id}`);
      setBanks(prev => prev.filter(x => x.id !== deleting.id));
    } catch (err) {
      console.error("Failed to delete account", err);
      alert(err.response?.data?.detail || "Failed to remove account.");
    } finally {
      setDeleting(null);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await api.patch(`/wallets/bank-accounts/${id}/default`);
      setBanks(prev => {
        const updated = prev.map(b => ({ ...b, isDefault: b.id === id }));
        // Sort so default is at the top, like the backend does
        return updated.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
      });
    } catch (err) {
      console.error("Failed to set default", err);
      alert(err.response?.data?.detail || "Failed to set default account.");
    }
  };

  const defaultAcct = banks.find(b => b.isDefault) || banks[0];
  const slotsLeft = MAX_ACCOUNTS - banks.length;

  return (
    <div className="bank-page">
      <LeftPanel banks={banks} />

      <div className="bank-main">
        <div className="bank-topbar" style={{ height:54, display:"flex", alignItems:"center",
          justifyContent:"space-between", padding:"0 32px",
          borderBottom:`1px solid ${C.border}`, background:"rgba(8,8,8,0.95)",
          backdropFilter:"blur(12px)", flexShrink:0 }}>
          <div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:20, letterSpacing:1, lineHeight:1 }}>
              Your Accounts
            </div>
            <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>
              {banks.length} saved · {slotsLeft} slot{slotsLeft !== 1 ? "s" : ""} left
            </div>
          </div>
          <button onClick={() => setShowAdd(true)} disabled={banks.length >= MAX_ACCOUNTS || loadingInitial}
            className="pri-btn bank-topbar-btn"
            style={{ background:banks.length >= MAX_ACCOUNTS ? C.border : C.green,
              color:banks.length >= MAX_ACCOUNTS ? C.muted : "#000", fontWeight:700,
              fontSize:12, padding:"8px 16px", borderRadius:8, border:"none",
              display:"flex", alignItems:"center", gap:6, cursor:"pointer",
              fontFamily:"'Outfit',sans-serif" }}>
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth={2.5} strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span className="bank-topbar-btn-text">Add Account</span>
          </button>
        </div>

        <div className="bank-scroll" style={{ position: "relative", minHeight: 300 }}>
          {loadingInitial && (
            <div style={{ position:"absolute", inset:0, background:"rgba(16,16,16,0.6)", backdropFilter:"blur(2px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:10, borderRadius: 16 }}>
              <div style={{ width:24, height:24, borderRadius:"50%", border:"2px solid rgba(14,203,129,0.2)", borderTopColor:C.green, animation:"spin 0.8s linear infinite" }}/>
            </div>
          )}
          <div className="stats-row" style={{ display:"grid",
            gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:24 }}>
            {[
              { label:"Total saved", val:banks.length, sub:`Max ${MAX_ACCOUNTS} accounts` },
              { label:"Default bank", val:defaultAcct?.bankName || "—", sub:defaultAcct ? maskAccount(defaultAcct.accountNumber) : "Not set" },
              { label:"Withdrawal Fee", val:"₦0.00", sub:"Free on all transfers" },
            ].map((s, i) => (
              <div key={s.label} className="stat-chip" style={{ background:C.card,
                border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 16px",
                animationDelay:`${i * 0.06}s` }}>
                <div style={{ fontSize:10, color:C.muted, letterSpacing:1, marginBottom:6 }}>{s.label.toUpperCase()}</div>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:24, color:"#fff", letterSpacing:0.5, lineHeight:1 }}>{s.val}</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:4 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {banks.length === 0 ? (
            <div style={{ textAlign:"center", padding:"64px 20px", animation:"fadeUp 0.4s ease" }}>
              <div style={{ width:64, height:64, borderRadius:"50%", margin:"0 auto 16px",
                background:"rgba(14,203,129,0.06)", border:"1px solid rgba(14,203,129,0.12)",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={C.muted}
                  strokeWidth={1.5} strokeLinecap="round"><rect x="3" y="10" width="18" height="11" rx="2"/><path d="M7 10V7a5 5 0 0110 0v3"/></svg>
              </div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:28, letterSpacing:1, marginBottom:8 }}>NO ACCOUNTS YET</div>
              <p style={{ color:C.muted, fontSize:14, lineHeight:1.6, marginBottom:22, maxWidth:320, margin:"0 auto 22px" }}>
                Link a Nigerian bank account to receive your NGN withdrawals.
              </p>
              <button onClick={() => setShowAdd(true)} className="pri-btn"
                style={{ background:C.green, color:"#000", fontWeight:700, fontSize:14,
                  padding:"12px 24px", borderRadius:10, border:"none", cursor:"pointer",
                  fontFamily:"'Outfit',sans-serif" }}>Add Your First Account →</button>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {banks.map((b, i) => (
                <AccountRow key={b.id} account={b} index={i}
                  onDelete={id => setDeleting(banks.find(x => x.id === id))}
                  onSetDefault={handleSetDefault} />
              ))}

              {banks.length < MAX_ACCOUNTS && (
                <button onClick={() => setShowAdd(true)} className="add-slot"
                  style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10,
                    background:"transparent", border:`1px dashed ${C.border2}`,
                    borderRadius:14, padding:"18px", fontFamily:"'Outfit',sans-serif",
                    color:C.muted, animation:`fadeUp 0.35s ${banks.length * 0.05}s ease both` }}>
                  <div style={{ width:32, height:32, borderRadius:"50%", background:C.card2,
                    border:`1px solid ${C.border}`, display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:18, color:C.muted }}>+</div>
                  <div style={{ textAlign:"left" }}>
                    <div style={{ fontSize:14, fontWeight:500, color:"#aaa" }}>Add another account</div>
                    <div style={{ fontSize:11, color:C.muted2 }}>{slotsLeft} slot{slotsLeft !== 1 ? "s" : ""} remaining</div>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {showAdd && (
        <AddAccountModal onAdd={acct => { setBanks(b => [...b, acct]); setShowAdd(false); }}
          onClose={() => setShowAdd(false)} supportedBanks={supportedBanks} />
      )}
      {deleting && (
        <DeleteConfirm account={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)} />
      )}
    </div>
  );
}
