import React, { useState, useEffect, useRef } from "react";

const C = {
  green:"#0ECB81", amber:"#F5A623", red:"#F6465D",
  bg:"#080808", surface:"#0c0c0c", card:"#101010", card2:"#141414",
  border:"#1a1a1a", border2:"#222222",
  text:"#ffffff", muted:"#555555", muted2:"#2e2e2e",
};

const CSS = `
  @keyframes fadeUp    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes slideUp   { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
  @keyframes popIn     { 0%{transform:scale(0.7);opacity:0} 70%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
  @keyframes successIn { 0%{transform:scale(0.5);opacity:0} 65%{transform:scale(1.06)} 100%{transform:scale(1);opacity:1} }
  @keyframes checkDraw { from{stroke-dashoffset:70} to{stroke-dashoffset:0} }
  @keyframes pulse     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.75)} }
  @keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes shimmer   { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
  @keyframes ripple    { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(2.8);opacity:0} }

  .bank-card-wrap  { transition:transform 0.3s, box-shadow 0.3s; animation:fadeUp 0.45s ease both; }
  .bank-card-wrap:hover { transform:translateY(-4px) !important; }

  .action-pill     { transition:all 0.18s; opacity:0; }
  .bank-card-wrap:hover .action-pill { opacity:1 !important; }

  /* Mobile accessibility: show action pills on mobile since there is no hover */
  @media (max-width: 1024px) {
    .action-pill { opacity:1 !important; }
  }

  .add-card        { transition:all 0.2s; }
  .add-card:hover  { border-color:rgba(14,203,129,0.4) !important; background:rgba(14,203,129,0.04) !important; }
  .add-card:hover .add-plus { color:#0ECB81 !important; }

  .pri-btn         { transition:all 0.2s; }
  .pri-btn:hover:not(:disabled) { background:#0fdf8e !important; transform:translateY(-1px); box-shadow:0 10px 28px rgba(14,203,129,0.3) !important; }
  .pri-btn:disabled { opacity:0.35 !important; cursor:not-allowed !important; }

  .ghost-btn       { transition:all 0.18s; }
  .ghost-btn:hover:not(:disabled) { border-color:#555 !important; color:#ccc !important; }

  .bank-opt:hover  { background:#1c1c1c !important; }
  .bank-opt.sel    { background:rgba(14,203,129,0.07) !important; border-color:rgba(14,203,129,0.3) !important; }
  .bank-opt        { transition:all 0.15s; }

  .st-input:focus  { border-color:rgba(14,203,129,0.5) !important; box-shadow:0 0 0 3px rgba(14,203,129,0.07) !important; outline:none; }
  .st-input        { transition:border-color 0.2s, box-shadow 0.2s; }

  .del-btn:hover   { background:rgba(246,70,93,0.12) !important; border-color:rgba(246,70,93,0.3) !important; color:#F6465D !important; }
  .del-btn         { transition:all 0.2s; }

  .default-btn:hover { background:rgba(14,203,129,0.12) !important; border-color:rgba(14,203,129,0.3) !important; color:#0ECB81 !important; }
  .default-btn     { transition:all 0.2s; }

  .close-btn:hover   { color:#fff !important; }
  .close-btn         { transition:color 0.15s; }

  /* Mobile specific overrides */
  @media (max-width: 640px) {
    .bank-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
    .bank-content { padding: 16px !important; }
    .bank-topbar { padding: 0 16px !important; }
    .bank-topbar-title { font-size: 18px !important; }
    .bank-topbar-sub { display: none !important; }
    .btn-text { display: none !important; }
    .pri-btn-mobile { padding: 8px !important; border-radius: 50% !important; width: 34px !important; height: 34px !important; display: flex !important; align-items: center !important; justify-content: center !important; }
    .info-banner { padding: 12px !important; font-size: 12px !important; }
    .bank-card-inner { padding: 16px 18px !important; border-radius: 14px !important; }
    .bank-card-number { font-size: 13px !important; letter-spacing: 3px !important; }
    .modal-container { width: 92% !important; border-radius: 14px !important; }
    .modal-header { padding: 14px 16px !important; }
    .modal-body { padding: 16px !important; }
  }
`;

// ─── BANK DATA ────────────────────────────────────────────
const NIGERIAN_BANKS = [
  { code:"058", name:"GTBank",        color:"#E8460A", bg:"linear-gradient(135deg,#1a0800,#3d1200)" },
  { code:"044", name:"Access Bank",   color:"#D91921", bg:"linear-gradient(135deg,#1a0000,#3d0000)" },
  { code:"057", name:"Zenith Bank",   color:"#E00000", bg:"linear-gradient(135deg,#1a0000,#2d0000)" },
  { code:"011", name:"First Bank",    color:"#005CA8", bg:"linear-gradient(135deg,#00091a,#001433)" },
  { code:"033", name:"UBA",           color:"#E20A16", bg:"linear-gradient(135deg,#1a0000,#330000)" },
  { code:"070", name:"Fidelity Bank", color:"#5DAB00", bg:"linear-gradient(135deg,#051a00,#0a2e00)" },
  { code:"214", name:"FCMB",          color:"#009900", bg:"linear-gradient(135deg,#001a00,#003300)" },
  { code:"000",  name:"Kuda Bank",    color:"#4000BF", bg:"linear-gradient(135deg,#0a0019,#15003d)" },
  { code:"100", name:"OPay",          color:"#00B140", bg:"linear-gradient(135deg,#001a08,#003318)" },
  { code:"50515",name:"Moniepoint",   color:"#006CFF", bg:"linear-gradient(135deg,#00091a,#00184d)" },
  { code:"076", name:"Polaris Bank",  color:"#E2001A", bg:"linear-gradient(135deg,#1a0000,#300005)" },
  { code:"082", name:"Keystone Bank", color:"#046A38", bg:"linear-gradient(135deg,#00100a,#00291a)" },
];

const ACCOUNT_NAMES = {
  "0123454521": "ADEWALE IFEOLUWA OBI",
  "0198778812": "ADEWALE OBI",
  "2012782230": "ADEWALE O.",
  "0145678901": "OBI ADEWALE",
  "0987654321": "ADEWALE OBI IFEOLUWA",
};
function resolveAccount(number) {
  return ACCOUNT_NAMES[number] || (number.length===10 ? "ADEWALE OBI" : null);
}

const INIT_BANKS = [
  { id:"b1", bankCode:"058", bankName:"GTBank",     accountNumber:"0123454521", accountName:"ADEWALE IFEOLUWA OBI", type:"Savings",  isDefault:true,  addedAt:"Dec 10, 2025" },
  { id:"b2", bankCode:"044", bankName:"Access Bank", accountNumber:"0198778812", accountName:"ADEWALE OBI",         type:"Current",  isDefault:false, addedAt:"Dec 15, 2025" },
  { id:"b3", bankCode:"057", bankName:"Zenith Bank", accountNumber:"2012782230", accountName:"ADEWALE O.",          type:"Savings",  isDefault:false, addedAt:"Dec 17, 2025" },
];

function getBankMeta(code) {
  return NIGERIAN_BANKS.find(b=>b.code===code) || { color:"#888", bg:"linear-gradient(135deg,#111,#1a1a1a)" };
}

// ─── BANK CARD VISUAL ─────────────────────────────────────
function BankCardVisual({ account, onSetDefault, onDelete }) {
  const meta = getBankMeta(account.bankCode);
  const masked = "••••  ••••  ••••  " + account.accountNumber.slice(-4);

  return (
    <div className="bank-card-wrap"
      style={{ position:"relative", animationDelay:`${Math.random()*0.2}s` }}>

      {/* Card */}
      <div className="bank-card-inner" style={{
        width:"100%", aspectRatio:"1.7",
        background:meta.bg,
        borderRadius:18,
        padding:"22px 24px",
        position:"relative",
        overflow:"hidden",
        border:`1px solid ${meta.color}22`,
        boxShadow:`0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${meta.color}18`,
        cursor:"default",
      }}>
        {/* Decorative circles */}
        <div style={{ position:"absolute", right:-30, top:-30,
          width:160, height:160, borderRadius:"50%",
          background:`${meta.color}18`, filter:"blur(20px)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", right:40, bottom:-40,
          width:120, height:120, borderRadius:"50%",
          background:`${meta.color}10`, filter:"blur(16px)", pointerEvents:"none" }}/>
        {/* Subtle grid */}
        <div style={{ position:"absolute", inset:0,
          backgroundImage:`radial-gradient(${meta.color}18 1px,transparent 1px)`,
          backgroundSize:"20px 20px", opacity:0.4, pointerEvents:"none" }}/>
        {/* Shimmer effect */}
        <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0,
            background:`linear-gradient(105deg,transparent 40%,${meta.color}10 50%,transparent 60%)`,
            transform:"translateX(-100%)", animation:"shimmer 3s 1s ease infinite" }}/>
        </div>

        {/* Top row */}
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"flex-start", marginBottom:"auto" }}>
          <div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18,
              color:"#fff", letterSpacing:2, lineHeight:1, opacity:0.9 }}>
              {account.bankName.toUpperCase()}
            </div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)",
              letterSpacing:1, marginTop:2 }}>BANK ACCOUNT</div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
            {account.isDefault && (
              <div style={{ background:`${meta.color}28`,
                border:`1px solid ${meta.color}55`,
                borderRadius:100, padding:"3px 8px",
                fontSize:9, color:meta.color, fontWeight:700, letterSpacing:1 }}>
                DEFAULT
              </div>
            )}
            <div style={{ width:32, height:24, borderRadius:4,
              background:`linear-gradient(135deg,${meta.color}55,${meta.color}22)`,
              border:`1px solid ${meta.color}33` }}/>
          </div>
        </div>

        {/* Account number */}
        <div style={{ marginTop:20, marginBottom:14 }}>
          <div className="bank-card-number" style={{ fontFamily:"'DM Mono',monospace", fontSize:15,
            color:"rgba(255,255,255,0.85)", letterSpacing:4, fontWeight:500 }}>
            {masked}
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
          <div>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.35)",
              letterSpacing:2, marginBottom:2 }}>ACCOUNT HOLDER</div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11,
              color:"rgba(255,255,255,0.8)", letterSpacing:1 }}>
              {account.accountName}
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.35)",
              letterSpacing:2, marginBottom:2 }}>TYPE</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)",
              letterSpacing:1, textTransform:"uppercase" }}>
              {account.type}
            </div>
          </div>
        </div>

        {/* Action pills */}
        <div style={{ position:"absolute", bottom:12, left:"50%",
          transform:"translateX(-50%)", display:"flex", gap:6 }}>
          {!account.isDefault && (
            <button onClick={()=>onSetDefault(account.id)}
              className="action-pill default-btn"
              style={{ background:C.card, border:`1px solid ${C.border2}`,
                color:C.muted, fontSize:10, fontWeight:600,
                padding:"4px 10px", borderRadius:100, cursor:"pointer",
                fontFamily:"'Outfit',sans-serif", whiteSpace:"nowrap" }}>
              Set Default
            </button>
          )}
          <button onClick={()=>onDelete(account.id)}
            className="action-pill del-btn"
            style={{ background:C.card, border:`1px solid ${C.border2}`,
              color:C.muted, fontSize:10, fontWeight:600,
              padding:"4px 10px", borderRadius:100, cursor:"pointer",
              fontFamily:"'Outfit',sans-serif", display:"flex",
              alignItems:"center", gap:4 }}>
            <svg width={9} height={9} viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* Below card info */}
      <div style={{ padding:"12px 4px 0",
        display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:13, fontWeight:600 }}>
            {account.bankName}
            {account.isDefault && (
              <span style={{ marginLeft:8, fontSize:9, color:C.green,
                background:"rgba(14,203,129,0.1)", border:"1px solid rgba(14,203,129,0.2)",
                borderRadius:100, padding:"2px 7px", letterSpacing:1, fontWeight:700 }}>
                DEFAULT
              </span>
            )}
          </div>
          <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>
            Added {account.addedAt}
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color:"#bbb" }}>
            ••{account.accountNumber.slice(-4)}
          </div>
          <div style={{ fontSize:10, color:C.muted }}>{account.type}</div>
        </div>
      </div>
    </div>
  );
}

// ─── ADD ACCOUNT MODAL ────────────────────────────────────
function AddAccountModal({ onAdd, onClose }) {
  const [step, setStep]             = useState(1);
  const [accountNumber, setAccNum]  = useState("");
  const [selectedBank, setBank]     = useState(null);
  const [accountName, setAccName]   = useState("");
  const [accountType, setAccType]   = useState("Savings");
  const [resolving, setResolving]   = useState(false);
  const [resolved, setResolved]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [bankSearch, setBankSearch] = useState("");
  const [showBanks, setShowBanks]   = useState(false);
  const bankRef = useRef(null);

  useEffect(()=>{
    const fn = e=>{ if(bankRef.current&&!bankRef.current.contains(e.target)) setShowBanks(false); };
    document.addEventListener("mousedown",fn);
    return ()=>document.removeEventListener("mousedown",fn);
  },[]);

  useEffect(()=>{
    if(accountNumber.length===10 && selectedBank) {
      setResolving(true); setResolved(false); setAccName("");
      const t = setTimeout(()=>{
        const name = resolveAccount(accountNumber);
        setAccName(name||""); setResolving(false); setResolved(!!name);
      }, 1400);
      return ()=>clearTimeout(t);
    } else {
      setResolved(false); setAccName("");
    }
  },[accountNumber, selectedBank]);

  const canSubmit = accountNumber.length===10 && selectedBank && resolved && accountName;

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(()=>{
      setLoading(false); setStep(2);
    }, 800);
  };

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(()=>{
      setLoading(false);
      onAdd({
        id:"b"+Date.now(), bankCode:selectedBank.code,
        bankName:selectedBank.name, accountNumber,
        accountName, type:accountType, isDefault:false,
        addedAt:new Date().toLocaleDateString("en-NG",{day:"numeric",month:"short",year:"numeric"}),
      });
      setStep(3);
    }, 1000);
  };

  const filteredBanks = NIGERIAN_BANKS.filter(b=>
    b.name.toLowerCase().includes(bankSearch.toLowerCase())
  );

  return (
    <>
      <div onClick={onClose}
        style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",
          backdropFilter:"blur(4px)",zIndex:200 }}/>
      <div className="modal-container" style={{ position:"fixed",top:"50%",left:"50%",
        transform:"translate(-50%,-50%)",zIndex:201,
        width:"100%",maxWidth:460,
        background:C.card,border:`1px solid ${C.border2}`,
        borderRadius:18,overflow:"hidden",
        boxShadow:"0 32px 64px rgba(0,0,0,0.7)",
        animation:"slideUp 0.3s ease" }}>

        {/* Header */}
        <div className="modal-header" style={{ display:"flex",justifyContent:"space-between",
          alignItems:"center",padding:"18px 22px",
          borderBottom:`1px solid ${C.border}` }}>
          <div>
            <div style={{ fontSize:10,color:C.muted,letterSpacing:2,marginBottom:3 }}>
              {step===1?"ADD NEW":""}
              {step===2?"CONFIRM DETAILS":""}
              {step===3?"":""}
            </div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:1 }}>
              {step===1?"Add Bank Account"
               :step===2?"Confirm Account"
               :"Account Added!"}
            </div>
          </div>
          {step!==3 && (
            <button onClick={onClose} className="close-btn"
              style={{ background:C.card2,border:`1px solid ${C.border}`,
                borderRadius:8,width:30,height:30,display:"flex",
                alignItems:"center",justifyContent:"center",
                cursor:"pointer",color:C.muted,fontSize:15,lineHeight:1 }}>✕</button>
          )}
        </div>

        <div className="modal-body" style={{ padding:"20px 22px" }}>

          {/* STEP 1: Form */}
          {step===1 && (
            <div style={{ animation:"fadeIn 0.3s ease" }}>
              <div style={{ marginBottom:16 }}>
                <label style={{ display:"block",fontSize:10,color:C.muted,
                  letterSpacing:2,marginBottom:8 }}>ACCOUNT NUMBER</label>
                <div style={{ position:"relative" }}>
                  <input className={`st-input${resolving||resolved?"":" "}`}
                    type="text" maxLength={10}
                    value={accountNumber}
                    onChange={e=>setAccNum(e.target.value.replace(/\D/g,""))}
                    placeholder="10-digit account number"
                    style={{ width:"100%",background:C.card2,
                      border:`1px solid ${resolved?C.green:C.border2}`,
                      borderRadius:10,padding:"13px 44px 13px 14px",
                      color:"#fff",fontSize:15,
                      fontFamily:"'DM Mono',monospace",letterSpacing:2 }}/>
                  <div style={{ position:"absolute",right:14,top:"50%",
                    transform:"translateY(-50%)" }}>
                    {resolving && (
                      <div style={{ width:16,height:16,borderRadius:"50%",
                        border:"2px solid rgba(14,203,129,0.2)",
                        borderTopColor:C.green,animation:"spin 0.8s linear infinite" }}/>
                    )}
                    {resolved && !resolving && (
                      <svg width={16} height={16} viewBox="0 0 16 16" fill="none"
                        style={{ animation:"popIn 0.2s ease" }}>
                        <circle cx={8} cy={8} r={8} fill={C.green}/>
                        <path d="M4 8l2.5 3L12 5" stroke="#000" strokeWidth={1.5} strokeLinecap="round"/>
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom:16 }} ref={bankRef}>
                <label style={{ display:"block",fontSize:10,color:C.muted,
                  letterSpacing:2,marginBottom:8 }}>SELECT BANK</label>
                <button onClick={()=>setShowBanks(!showBanks)}
                  style={{ width:"100%",background:C.card2,
                    border:`1px solid ${selectedBank?C.green:C.border2}`,
                    borderRadius:10,padding:"13px 14px",
                    color:selectedBank?"#fff":C.muted,fontSize:14,
                    fontFamily:"'Outfit',sans-serif",fontWeight:selectedBank?500:400,
                    cursor:"pointer",display:"flex",justifyContent:"space-between",
                    alignItems:"center",textAlign:"left",
                    transition:"border-color 0.2s" }}>
                  <span>{selectedBank?selectedBank.name:"Choose your bank"}</span>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
                    stroke={C.muted} strokeWidth={2} strokeLinecap="round"
                    style={{ transform:showBanks?"rotate(180deg)":"none",
                      transition:"transform 0.2s" }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {showBanks && (
                  <div style={{ position:"relative",zIndex:10 }}>
                    <div style={{ position:"absolute",top:4,left:0,right:0,
                      background:C.card,border:`1px solid ${C.border2}`,
                      borderRadius:12,boxShadow:"0 16px 32px rgba(0,0,0,0.5)",
                      overflow:"hidden",animation:"fadeIn 0.15s ease" }}>
                      <div style={{ padding:"8px 10px",
                        borderBottom:`1px solid ${C.border}` }}>
                        <input value={bankSearch}
                          onChange={e=>setBankSearch(e.target.value)}
                          placeholder="Search bank..."
                          autoFocus
                          style={{ width:"100%",background:"transparent",
                            border:"none",color:"#fff",fontSize:13,
                            fontFamily:"'Outfit',sans-serif",outline:"none" }}/>
                      </div>
                      <div style={{ maxHeight:220,overflowY:"auto" }}>
                        {filteredBanks.map(b=>(
                          <button key={b.code} className={`bank-opt${selectedBank?.code===b.code?" sel":""}`}
                            onClick={()=>{ setBank(b); setShowBanks(false); setBankSearch(""); }}
                            style={{ width:"100%",display:"flex",alignItems:"center",
                              gap:10,padding:"10px 14px",
                              background:selectedBank?.code===b.code?"rgba(14,203,129,0.07)":"transparent",
                              border:"none",borderBottom:`1px solid ${C.border}`,
                              color:"#fff",cursor:"pointer",textAlign:"left",
                              fontFamily:"'Outfit',sans-serif" }}>
                            <div style={{ width:28,height:28,borderRadius:7,flexShrink:0,
                              background:b.bg,border:`1px solid ${b.color}22`,
                              display:"flex",alignItems:"center",justifyContent:"center" }}>
                              <span style={{ fontFamily:"'Bebas Neue',sans-serif",
                                fontSize:10,color:b.color,letterSpacing:1 }}>
                                {b.name.slice(0,2).toUpperCase()}
                              </span>
                            </div>
                            <span style={{ fontSize:13,fontWeight:500 }}>{b.name}</span>
                            {selectedBank?.code===b.code && (
                              <svg width={14} height={14} viewBox="0 0 14 14" fill="none"
                                style={{ marginLeft:"auto" }}>
                                <path d="M2 7l3 3.5L12 3.5" stroke={C.green} strokeWidth={1.5} strokeLinecap="round"/>
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {resolved && accountName && (
                <div style={{ background:"rgba(14,203,129,0.05)",
                  border:"1px solid rgba(14,203,129,0.18)",
                  borderRadius:10,padding:"12px 14px",marginBottom:16,
                  animation:"fadeIn 0.3s ease" }}>
                  <div style={{ fontSize:9,color:C.green,letterSpacing:2,marginBottom:5 }}>
                    ACCOUNT NAME
                  </div>
                  <div style={{ fontFamily:"'DM Mono',monospace",fontSize:14,
                    color:"#fff",fontWeight:500 }}>{accountName}</div>
                </div>
              )}

              {resolved && (
                <div style={{ marginBottom:20, animation:"fadeIn 0.3s ease" }}>
                  <label style={{ display:"block",fontSize:10,color:C.muted,
                    letterSpacing:2,marginBottom:8 }}>ACCOUNT TYPE</label>
                  <div style={{ display:"flex",gap:8 }}>
                    {["Savings","Current"].map(t=>(
                      <button key={t} onClick={()=>setAccType(t)}
                        style={{ flex:1,padding:"10px",borderRadius:9,
                          background:accountType===t?"rgba(14,203,129,0.08)":C.card2,
                          border:`1px solid ${accountType===t?"rgba(14,203,129,0.3)":C.border2}`,
                          color:accountType===t?C.green:"#aaa",fontSize:13,fontWeight:500,
                          cursor:"pointer",fontFamily:"'Outfit',sans-serif",
                          transition:"all 0.15s" }}>{t}</button>
                    ))}
                  </div>
                </div>
              )}

              <button disabled={!canSubmit||loading} onClick={handleSubmit}
                className="pri-btn"
                style={{ width:"100%",background:canSubmit?C.green:C.border,
                  color:canSubmit?"#000":C.muted,fontWeight:700,fontSize:15,
                  padding:"14px",borderRadius:12,border:"none",
                  fontFamily:"'Outfit',sans-serif",
                  display:"flex",alignItems:"center",justifyContent:"center",gap:10 }}>
                {loading
                  ? <><div style={{ width:18,height:18,borderRadius:"50%",
                      border:"2.5px solid rgba(0,0,0,0.2)",borderTopColor:"#000",
                      animation:"spin 0.8s linear infinite" }}/>Verifying...</>
                  : "Continue →"}
              </button>
            </div>
          )}

          {/* STEP 2: Confirm */}
          {step===2 && (
            <div style={{ animation:"fadeIn 0.3s ease" }}>
              <div style={{
                background:getBankMeta(selectedBank?.code||"").bg,
                border:`1px solid ${getBankMeta(selectedBank?.code||"").color}22`,
                borderRadius:16,padding:"20px 22px",marginBottom:20,
                position:"relative",overflow:"hidden",
              }}>
                <div style={{ position:"absolute",right:-20,top:-20,width:120,height:120,
                  borderRadius:"50%",
                  background:`${getBankMeta(selectedBank?.code||"").color}18`,
                  filter:"blur(16px)" }}/>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:16,
                  letterSpacing:2,marginBottom:14,opacity:0.9 }}>
                  {selectedBank?.name.toUpperCase()}
                </div>
                <div style={{ fontFamily:"'DM Mono',monospace",fontSize:14,
                  color:"rgba(255,255,255,0.8)",letterSpacing:3,marginBottom:12 }}>
                  ••••  ••••  ••••  {accountNumber.slice(-4)}
                </div>
                <div style={{ display:"flex",justifyContent:"space-between" }}>
                  <div>
                    <div style={{ fontSize:8,color:"rgba(255,255,255,0.35)",letterSpacing:2,marginBottom:2 }}>ACCOUNT HOLDER</div>
                    <div style={{ fontFamily:"'DM Mono',monospace",fontSize:11,
                      color:"rgba(255,255,255,0.8)" }}>{accountName}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:8,color:"rgba(255,255,255,0.35)",letterSpacing:2,marginBottom:2 }}>TYPE</div>
                    <div style={{ fontSize:11,color:"rgba(255,255,255,0.6)" }}>{accountType}</div>
                  </div>
                </div>
              </div>

              {[
                ["Bank",           selectedBank?.name],
                ["Account Number", accountNumber],
                ["Account Name",   accountName],
                ["Account Type",   accountType],
              ].map(([k,v])=>(
                <div key={k} style={{ display:"flex",justifyContent:"space-between",
                  padding:"11px 0",borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ fontSize:13,color:C.muted }}>{k}</span>
                  <span style={{ fontFamily:"'DM Mono',monospace",fontSize:13,
                    color:"#ccc" }}>{v}</span>
                </div>
              ))}

              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:20 }}>
                <button onClick={()=>setStep(1)} className="ghost-btn"
                  style={{ background:"transparent",border:`1px solid ${C.border2}`,
                    color:C.muted,fontSize:14,padding:"13px",
                    borderRadius:11,fontFamily:"'Outfit',sans-serif",cursor:"pointer" }}>
                  ← Edit
                </button>
                <button onClick={handleConfirm} className="pri-btn"
                  style={{ background:C.green,color:"#000",fontWeight:700,
                    fontSize:14,padding:"13px",borderRadius:11,border:"none",
                    fontFamily:"'Outfit',sans-serif",
                    display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
                  {loading
                    ? <><div style={{ width:16,height:16,borderRadius:"50%",
                        border:"2px solid rgba(0,0,0,0.2)",borderTopColor:"#000",
                        animation:"spin 0.8s linear infinite" }}/>Adding...</>
                    : "Confirm & Add ✓"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Success */}
          {step===3 && (
            <div style={{ textAlign:"center",padding:"16px 0 8px",
              animation:"fadeIn 0.4s ease" }}>
              <div style={{ position:"relative",width:80,height:80,margin:"0 auto 20px" }}>
                <div style={{ position:"absolute",inset:-6,borderRadius:"50%",
                  border:`2px solid rgba(14,203,129,0.4)`,animation:"ripple 0.8s ease-out" }}/>
                <div style={{ width:80,height:80,borderRadius:"50%",
                  background:"rgba(14,203,129,0.1)",border:`2px solid ${C.green}`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  animation:"successIn 0.5s ease",boxShadow:`0 0 32px rgba(14,203,129,0.2)` }}>
                  <svg width={34} height={34} viewBox="0 0 34 34" fill="none">
                    <path d="M7 17l6 7L27 10" stroke={C.green} strokeWidth={2.5}
                      strokeLinecap="round" strokeLinejoin="round"
                      strokeDasharray={70}
                      style={{ animation:"checkDraw 0.5s 0.3s ease forwards",strokeDashoffset:70 }}/>
                  </svg>
                </div>
              </div>
              <h3 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:28,
                letterSpacing:1,marginBottom:8 }}>ACCOUNT ADDED!</h3>
              <p style={{ color:C.muted,fontSize:13,lineHeight:1.7,marginBottom:24 }}>
                <span style={{ color:"#ccc",fontWeight:500 }}>{selectedBank?.name}</span> has been saved to your account. You can now receive NGN withdrawals to this account.
              </p>
              <button onClick={onClose} className="pri-btn"
                style={{ width:"100%",background:C.green,color:"#000",fontWeight:700,
                  fontSize:14,padding:"13px",borderRadius:11,border:"none",
                  fontFamily:"'Outfit',sans-serif" }}>
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── DELETE CONFIRM ───────────────────────────────────────
function DeleteConfirm({ account, onConfirm, onCancel }) {
  return (
    <>
      <div onClick={onCancel}
        style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",
          backdropFilter:"blur(3px)",zIndex:200 }}/>
      <div className="modal-container" style={{ position:"fixed",top:"50%",left:"50%",
        transform:"translate(-50%,-50%)",zIndex:201,
        width:"100%",maxWidth:380,
        background:C.card,border:`1px solid rgba(246,70,93,0.2)`,
        borderRadius:16,padding:"24px 24px",
        boxShadow:"0 24px 48px rgba(0,0,0,0.6)",
        animation:"slideUp 0.25s ease" }}>
        <div style={{ width:52,height:52,borderRadius:"50%",
          background:"rgba(246,70,93,0.1)",border:"1px solid rgba(246,70,93,0.2)",
          display:"flex",alignItems:"center",justifyContent:"center",
          margin:"0 auto 16px" }}>
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none"
            stroke={C.red} strokeWidth={2} strokeLinecap="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/>
          </svg>
        </div>
        <h3 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:22,
          textAlign:"center",letterSpacing:1,marginBottom:8 }}>REMOVE ACCOUNT?</h3>
        <p style={{ color:C.muted,fontSize:13,textAlign:"center",
          lineHeight:1.6,marginBottom:20 }}>
          This will remove <span style={{ color:"#ccc" }}>{account.bankName} ••{account.accountNumber.slice(-4)}</span> from your saved accounts.
        </p>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
          <button onClick={onCancel} className="ghost-btn"
            style={{ background:"transparent",border:`1px solid ${C.border2}`,
              color:C.muted,fontSize:14,padding:"12px",borderRadius:10,
              fontFamily:"'Outfit',sans-serif",cursor:"pointer" }}>
            Cancel
          </button>
          <button onClick={onConfirm}
            style={{ background:"rgba(246,70,93,0.12)",
              border:"1px solid rgba(246,70,93,0.3)",
              color:C.red,fontWeight:700,fontSize:14,padding:"12px",borderRadius:10,
              fontFamily:"'Outfit',sans-serif",cursor:"pointer",transition:"all 0.2s" }}
            onMouseEnter={e=>{ e.currentTarget.style.background="rgba(246,70,93,0.2)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="rgba(246,70,93,0.12)"; }}>
            Remove
          </button>
        </div>
      </div>
    </>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────
export default function BankAccounts() {
  const [banks, setBanks]       = useState(INIT_BANKS);
  const [showAdd, setShowAdd]   = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(()=>{
    const s=document.createElement("style"); s.textContent=CSS;
    document.head.appendChild(s); return ()=>document.head.removeChild(s);
  },[]);

  const handleAdd     = acct => { setBanks(b=>[...b,acct]); };
  const handleDelete  = id   => { setDeleting(banks.find(b=>b.id===id)); };
  const confirmDelete = ()   => { setBanks(b=>b.filter(x=>x.id!==deleting.id)); setDeleting(null); };
  const handleDefault = id   => { setBanks(b=>b.map(x=>({...x,isDefault:x.id===id}))); };

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>

      {/* Topbar */}
      <div className="bank-topbar" style={{ height:56, display:"flex", alignItems:"center",
        justifyContent:"space-between", padding:"0 28px",
        borderBottom:`1px solid ${C.border}`,
        background:"rgba(6,6,6,0.95)", backdropFilter:"blur(12px)", flexShrink:0 }}>
        <div>
          <div className="bank-topbar-title" style={{ fontFamily:"'Bebas Neue',sans-serif",
            fontSize:20, letterSpacing:1, lineHeight:1 }}>Bank Accounts</div>
          <div className="bank-topbar-sub" style={{ fontSize:11, color:C.muted, marginTop:1 }}>
            Manage your withdrawal destinations
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <button onClick={()=>setShowAdd(true)} className="pri-btn pri-btn-mobile"
            style={{ background:C.green,color:"#000",fontWeight:700,
              fontSize:12,padding:"8px 18px",borderRadius:8,border:"none",
              display:"flex",alignItems:"center",gap:5,
              fontFamily:"'Outfit',sans-serif",cursor:"pointer" }}>
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span className="btn-text">Add Account</span>
          </button>
          <div style={{ width:32,height:32,borderRadius:"50%",cursor:"pointer",
            background:`linear-gradient(135deg,${C.green},${C.amber})`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontFamily:"'Bebas Neue',sans-serif",fontSize:12,color:"#000" }}>AO</div>
        </div>
      </div>

      {/* Content */}
      <div className="bank-content" style={{ flex:1, overflowY:"auto", padding:"28px" }}>

        {/* Info banner */}
        <div className="info-banner" style={{ display:"flex", gap:10, alignItems:"flex-start",
          background:"rgba(14,203,129,0.04)", border:"1px solid rgba(14,203,129,0.12)",
          borderRadius:12, padding:"14px 18px", marginBottom:28,
          animation:"fadeUp 0.4s ease" }}>
          <svg width={15} height={15} viewBox="0 0 24 24" fill="none"
            stroke={C.green} strokeWidth={2} strokeLinecap="round"
            style={{ flexShrink:0, marginTop:1 }}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div style={{ fontSize:13, color:C.muted, lineHeight:1.6 }}>
            Your <span style={{ color:"#bbb" }}>default account</span> is automatically selected when you make a withdrawal. Hover over any card to set default or remove.
            You can save up to <span style={{ color:"#bbb" }}>5 accounts</span>.
          </div>
        </div>

        {/* Cards grid */}
        {banks.length > 0 ? (
          <div className="bank-grid" style={{ display:"grid",
            gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",
            gap:24 }}>
            {banks.map((b,i)=>(
              <div key={b.id} style={{ animationDelay:`${i*0.08}s` }}>
                <BankCardVisual
                  account={b}
                  onSetDefault={handleDefault}
                  onDelete={handleDelete}
                />
              </div>
            ))}

            {/* Add account card */}
            {banks.length < 5 && (
              <button onClick={()=>setShowAdd(true)} className="add-card"
                style={{ background:"transparent",
                  border:`1px dashed ${C.border2}`,
                  borderRadius:18,cursor:"pointer",
                  display:"flex",flexDirection:"column",
                  alignItems:"center",justifyContent:"center",
                  gap:12, minHeight:160,
                  animation:`fadeUp 0.45s ${banks.length*0.08}s ease both`,
                  fontFamily:"'Outfit',sans-serif" }}>
                <div className="add-plus"
                  style={{ width:44,height:44,borderRadius:"50%",
                    background:C.card2, border:`1px solid ${C.border2}`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    color:C.muted, transition:"color 0.2s", fontSize:22 }}>+</div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:14,fontWeight:500,color:C.muted,marginBottom:4 }}>
                    Add Bank Account
                  </div>
                  <div style={{ fontSize:11,color:C.muted2 }}>
                    {5-banks.length} slot{5-banks.length!==1?"s":""} remaining
                  </div>
                </div>
              </button>
            )}
          </div>
        ) : (
          <div style={{ textAlign:"center",padding:"80px 0",
            animation:"fadeUp 0.5s ease" }}>
            <div style={{ fontSize:40,marginBottom:16 }}>🏦</div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif",
              fontSize:28,letterSpacing:1,marginBottom:10 }}>NO BANK ACCOUNTS YET</div>
            <p style={{ color:C.muted,fontSize:14,marginBottom:24,lineHeight:1.6 }}>
              Add a Nigerian bank account to start receiving<br/>your NGN payouts.
            </p>
            <button onClick={()=>setShowAdd(true)} className="pri-btn"
              style={{ background:C.green,color:"#000",fontWeight:700,
                fontSize:14,padding:"12px 28px",borderRadius:10,
                border:"none",fontFamily:"'Outfit',sans-serif",cursor:"pointer" }}>
              Add Your First Account →
            </button>
          </div>
        )}
      </div>

      {showAdd && (
        <AddAccountModal onAdd={acct=>{ handleAdd(acct); }} onClose={()=>setShowAdd(false)}/>
      )}
      {deleting && (
        <DeleteConfirm account={deleting}
          onConfirm={confirmDelete} onCancel={()=>setDeleting(null)}/>
      )}
    </div>
  );
}
