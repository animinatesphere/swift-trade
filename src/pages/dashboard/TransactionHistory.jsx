import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const C = {
  green:"#0ECB81", amber:"#F5A623", red:"#F6465D", blue:"#3B82F6",
  bg:"#080808", surface:"#0c0c0c", card:"#101010", card2:"#141414",
  border:"#1a1a1a", border2:"#222222",
  text:"#ffffff", muted:"#555555", muted2:"#2e2e2e",
};

const CSS = `
  @keyframes fadeUp   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes slideIn  { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:translateX(0)} }

  .txn-row            { transition:background 0.15s, border-color 0.15s; }
  .txn-row:hover      { background:#161616 !important; }
  .txn-row.selected   { background:rgba(14,203,129,0.05) !important; border-color:rgba(14,203,129,0.25) !important; }
  .filter-pill        { transition:all 0.15s; }
  .filter-pill:hover  { border-color:#444 !important; color:#ccc !important; }
  .filter-pill.active { background:rgba(14,203,129,0.1) !important; border-color:rgba(14,203,129,0.35) !important; color:#0ECB81 !important; }
  .detail-panel       { animation:slideIn 0.3s ease; }
  .close-btn:hover    { color:#fff !important; }
  .close-btn          { transition:color 0.15s; }
  .copy-btn:hover     { color:#0ECB81 !important; }
  .copy-btn           { transition:color 0.15s; }
  .topbar-icon:hover  { background:rgba(255,255,255,0.06) !important; }
  .sort-th:hover      { color:#ccc !important; }
  .sort-th            { transition:color 0.15s; }
  .stat-card          { animation:fadeUp 0.4s ease both; }
  .search-input:focus { border-color:rgba(14,203,129,0.4) !important; outline:none; }
  .search-input       { transition:border-color 0.2s; }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }

  .filters-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    gap: 12px;
  }

  .filters-group {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    padding-bottom: 4px;
  }
  
  .filters-group::-webkit-scrollbar { display: none; }
  .filters-group { -ms-overflow-style: none; scrollbar-width: none; }

  .table-container {
    background: #101010;
    border: 1px solid #1a1a1a;
    border-radius: 14px;
    overflow-x: auto;
  }
  
  .table-min-width {
    min-width: 700px;
  }

  @media (max-width: 1024px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .topbar-container {
      display: none !important;
    }
  }

  @media (max-width: 640px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
    .filters-container {
      flex-direction: column;
      align-items: flex-start;
    }
    .search-input-wrapper {
      width: 100%;
    }
    .search-input {
      width: 100% !important;
    }
    .detail-panel {
      width: 100% !important;
    }
    .table-min-width {
      min-width: 0 !important;
    }
    .txn-header-row {
      display: none !important;
    }
    .txn-type-cell {
      display: none !important;
    }
    .txn-grid-row {
      grid-template-columns: 1fr 1fr !important;
      row-gap: 8px !important;
      column-gap: 10px !important;
      align-items: start !important;
    }
    .txn-cell-trade {
      grid-column: 1 / -1 !important;
      grid-row: 1 !important;
    }
    .txn-cell-amount {
      grid-column: 1 !important;
      grid-row: 2 !important;
    }
    .txn-cell-date {
      grid-column: 2 !important;
      grid-row: 2 !important;
      text-align: right !important;
      display: flex !important;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
    }
    .txn-cell-status {
      grid-column: 1 / -1 !important;
      grid-row: 3 !important;
      justify-content: flex-end !important;
    }
  }
`;

// ─── COIN COLOR MAP ───────────────────────────────────────
const COIN_COLORS = {
  USDT: "#26A17B", BTC: "#F7931A", ETH: "#627EEA",
  SOL: "#9945FF", BNB: "#F3BA2F", XRP: "#23292F",
  LTC: "#345D9D", DOGE: "#C2A633", TRX: "#FF0013",
};

const TYPE_META = {
  trade:      { label:"Crypto Trade",  color:C.green,  bg:"rgba(14,203,129,0.1)",  icon:<svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg> },
  giftcard:   { label:"Gift Card",     color:C.amber,  bg:"rgba(245,166,35,0.1)",  icon:<svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5" rx="1"/><line x1="12" y1="22" x2="12" y2="7"/></svg> },
  withdrawal: { label:"Withdrawal",    color:C.red,    bg:"rgba(246,70,93,0.1)",   icon:<svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg> },
  bills:      { label:"Bills",         color:"#3B82F6", bg:"rgba(59,130,246,0.1)", icon:<svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
};

const STATUS_META = {
  completed:  { label:"Completed",   color:C.green, bg:"rgba(14,203,129,0.1)"  },
  success:    { label:"Completed",   color:C.green, bg:"rgba(14,203,129,0.1)"  },
  converted:  { label:"Completed",   color:C.green, bg:"rgba(14,203,129,0.1)"  },
  pending:    { label:"Pending",     color:C.amber, bg:"rgba(245,166,35,0.1)"  },
  processing: { label:"Processing",  color:C.blue,  bg:"rgba(59,130,246,0.1)"  },
  confirmed:  { label:"Confirmed",   color:C.blue,  bg:"rgba(59,130,246,0.1)"  },
  failed:     { label:"Failed",      color:C.red,   bg:"rgba(246,70,93,0.1)"   },
  reversed:   { label:"Reversed",    color:C.red,   bg:"rgba(246,70,93,0.1)"   },
};

// ─── UTILS ────────────────────────────────────────────────
function fmtDate(str) {
  const d = new Date(str);
  return d.toLocaleDateString("en-NG",{ day:"numeric", month:"short", year:"numeric" }) +
    " \u00b7 " + d.toLocaleTimeString("en-NG",{ hour:"2-digit", minute:"2-digit" });
}
function fmtNGN(n) { return "\u20a6"+Number(n).toLocaleString("en-NG",{maximumFractionDigits:0}); }

function statusLabel(t) {
  if (t.type === "withdrawal") {
    if (t.status === "pending") return "Pending Review";
    if (t.status === "failed" || t.status === "reversed") return "Rejected";
  }
  return (STATUS_META[t.status] || STATUS_META.pending).label;
}

function Copy({ text, small }) {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={()=>{ navigator.clipboard?.writeText(text); setOk(true); setTimeout(()=>setOk(false),2000); }}
      className="copy-btn"
      style={{ background:"none",border:"none",cursor:"pointer",padding:0,
        color:ok?C.green:C.muted, display:"flex", alignItems:"center", gap:3,
        fontSize:small?10:11, fontFamily:"'Outfit',sans-serif", fontWeight:500 }}>
      {ok
        ? <><svg width={10} height={10} viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2 2.5L8.5 2" stroke={C.green} strokeWidth={1.4} strokeLinecap="round"/></svg>Copied</>
        : <><svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Copy</>}
    </button>
  );
}

// ─── DETAIL PANEL ─────────────────────────────────────────
function DetailPanel({ txn, onClose }) {
  const meta   = TYPE_META[txn.type] || TYPE_META.trade;
  const status = STATUS_META[txn.status] || STATUS_META.pending;
  const isTrade= txn.type==="trade";
  const isGC   = txn.type==="giftcard";
  const isWD   = txn.type==="withdrawal";
  const coinColor = COIN_COLORS[txn.coin] || C.green;

  const timeline = [
    { label: isTrade?"Trade submitted":isGC?"Card submitted":"Withdrawal requested",
      sub:"Request received by Swift Trade", done:true },
    { label: isTrade?"Crypto deposit received":isGC?"Card verified":"Funds reserved",
      sub: isTrade?"Waiting for your blockchain confirmation":isGC?"Card details checked":"NGN balance reserved",
      done:txn.status!=="pending" },
    { label:"Admin confirmed",
      sub:"Swift Trade team verified the transaction",
      done:txn.status==="completed"||txn.status==="success"||txn.status==="converted"||txn.status==="processing" },
    { label: isTrade||isGC?"NGN released to your bank":"Transfer sent",
      sub: `Funds sent to ${txn.bank || "your bank"}`,
      done:txn.status==="completed"||txn.status==="success"||txn.status==="converted" },
  ];

  if(txn.status==="failed"||txn.status==="reversed") {
    timeline.forEach((t,i)=>{ if(i>1) t.done=false; });
    timeline[2] = isWD
      ? { label:"Withdrawal rejected", sub:"Funds refunded to your wallet balance", done:true, failed:true }
      : { label:"Transaction failed", sub:"Contact support with your reference ID", done:true, failed:true };
    timeline.splice(3);
  }

  return (
    <>
      <div onClick={onClose}
        style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)",
          backdropFilter:"blur(2px)", zIndex:10 }} />
      <div className="detail-panel"
        style={{ position:"fixed", top:0, right:0, bottom:0, width:380,
          background:C.surface, borderLeft:`1px solid ${C.border}`,
          zIndex:11, overflowY:"auto", display:"flex", flexDirection:"column" }}>

        <div style={{ padding:"20px 20px 16px", borderBottom:`1px solid ${C.border}`,
          display:"flex", justifyContent:"space-between", alignItems:"flex-start",
          flexShrink:0 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:6 }}>
              <div style={{ width:26,height:26,borderRadius:7,background:meta.bg,
                display:"flex",alignItems:"center",justifyContent:"center",
                color:meta.color }}>
                {meta.icon}
              </div>
              <span style={{ fontSize:11,color:meta.color,fontWeight:600,letterSpacing:1 }}>
                {meta.label.toUpperCase()}
              </span>
            </div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:1,lineHeight:1 }}>
              {isTrade ? `${txn.cryptoAmt || ""} ${txn.coin || ""} \u2192 NGN`
               : isGC  ? `${txn.brand || ""} ${txn.cryptoAmt || ""} \u2192 NGN`
               :         `NGN Withdrawal`}
            </div>
            <div style={{ fontFamily:"'DM Mono',monospace",fontSize:11,
              color:C.muted,marginTop:4 }}>{txn.ref}</div>
          </div>
          <button onClick={onClose} className="close-btn"
            style={{ background:"none",border:"none",color:C.muted,
              fontSize:18,cursor:"pointer",padding:0,lineHeight:1 }}>{"\u2715"}</button>
        </div>

        <div style={{ padding:"20px", flex:1 }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:20 }}>
            <span style={{ fontSize:13,color:C.muted }}>Status</span>
            <span style={{ fontSize:12,fontWeight:600,padding:"4px 10px",
              borderRadius:100, color:status.color, background:status.bg,
              display:"flex",alignItems:"center",gap:5 }}>
              {txn.status==="pending" && (
                <span style={{ width:5,height:5,borderRadius:"50%",
                  background:C.amber,animation:"pulse 1.5s infinite",display:"inline-block" }}/>
              )}
              {statusLabel(txn)}
            </span>
          </div>

          <div style={{ background:C.card,border:`1px solid ${C.border}`,
            borderRadius:12,overflow:"hidden",marginBottom:20 }}>
            {isTrade && (
              <>
                <div style={{ display:"flex",justifyContent:"space-between",
                  alignItems:"center",padding:"13px 16px",borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ fontSize:12,color:C.muted }}>You sent</span>
                  <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                    <span style={{ fontSize:10,color:coinColor,letterSpacing:1 }}>{txn.network}</span>
                    <span style={{ fontFamily:"'DM Mono',monospace",fontSize:14,color:coinColor,fontWeight:500 }}>
                      {txn.cryptoAmt} {txn.coin}
                    </span>
                  </div>
                </div>
                <div style={{ display:"flex",justifyContent:"space-between",
                  alignItems:"center",padding:"13px 16px",borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ fontSize:12,color:C.muted }}>You received</span>
                  <span style={{ fontFamily:"'DM Mono',monospace",fontSize:16,
                    color:C.green,fontWeight:600 }}>{fmtNGN(txn.ngnAmt)}</span>
                </div>
                {txn.rate && (
                  <div style={{ display:"flex",justifyContent:"space-between",
                    alignItems:"center",padding:"13px 16px" }}>
                    <span style={{ fontSize:12,color:C.muted }}>Exchange Rate</span>
                    <span style={{ fontFamily:"'DM Mono',monospace",fontSize:13,
                      color:"#ccc" }}>₦{Number(txn.rate).toLocaleString("en-NG", { maximumFractionDigits: 2 })} / $</span>
                  </div>
                )}
              </>
            )}
            {isGC && (
              <>
                <div style={{ display:"flex",justifyContent:"space-between",
                  alignItems:"center",padding:"13px 16px",borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ fontSize:12,color:C.muted }}>Gift card</span>
                  <span style={{ fontSize:14,fontWeight:500 }}>
                    {txn.brand} {txn.cryptoAmt}
                  </span>
                </div>
                <div style={{ display:"flex",justifyContent:"space-between",
                  alignItems:"center",padding:"13px 16px" }}>
                  <span style={{ fontSize:12,color:C.muted }}>You received</span>
                  <span style={{ fontFamily:"'DM Mono',monospace",fontSize:16,
                    color:C.green,fontWeight:600 }}>{fmtNGN(txn.ngnAmt)}</span>
                </div>
              </>
            )}
            {isWD && (
              <div style={{ display:"flex",justifyContent:"space-between",
                alignItems:"center",padding:"13px 16px" }}>
                <span style={{ fontSize:12,color:C.muted }}>Amount withdrawn</span>
                <span style={{ fontFamily:"'DM Mono',monospace",fontSize:16,
                  color:C.red,fontWeight:600 }}>-{fmtNGN(txn.ngnAmt)}</span>
              </div>
            )}
          </div>

          <div style={{ background:C.card,border:`1px solid ${C.border}`,
            borderRadius:12,overflow:"hidden",marginBottom:20 }}>
            {[
              ["Reference", txn.ref, true],
              ["Date", fmtDate(txn.date), false],
              ["Bank Account", txn.bank || "N/A", false],
            ].map(([k,v,copy])=>(
              <div key={k} style={{ display:"flex",justifyContent:"space-between",
                alignItems:"center",padding:"12px 16px",
                borderBottom:`1px solid ${C.border}` }}>
                <span style={{ fontSize:12,color:C.muted }}>{k}</span>
                <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <span style={{ fontFamily:"'DM Mono',monospace",fontSize:11,color:"#bbb" }}>{v}</span>
                  {copy && <Copy text={v} small/>}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:10,color:C.muted,letterSpacing:2,marginBottom:14 }}>TIMELINE</div>
            <div style={{ position:"relative" }}>
              <div style={{ position:"absolute",left:11,top:12,bottom:12,width:1,
                background:C.border }} />
              {timeline.map((t,i)=>(
                <div key={i} style={{ display:"flex",gap:14,
                  marginBottom:i<timeline.length-1?20:0,
                  position:"relative" }}>
                  <div style={{ width:22,height:22,borderRadius:"50%",flexShrink:0,
                    background: t.failed?"rgba(246,70,93,0.12)"
                      : t.done?"rgba(14,203,129,0.12)":"rgba(255,255,255,0.04)",
                    border:`1px solid ${t.failed?C.red:t.done?C.green:C.border2}`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    zIndex:1, transition:"all 0.3s" }}>
                    {t.failed
                      ? <svg width={9} height={9} viewBox="0 0 9 9" fill="none"><path d="M2 2l5 5M7 2L2 7" stroke={C.red} strokeWidth={1.4} strokeLinecap="round"/></svg>
                      : t.done
                        ? <svg width={9} height={9} viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5l2 2.5 4-4" stroke={C.green} strokeWidth={1.4} strokeLinecap="round"/></svg>
                        : <span style={{ width:5,height:5,borderRadius:"50%",background:C.border2 }}/>}
                  </div>
                  <div style={{ paddingTop:1 }}>
                    <div style={{ fontSize:13,fontWeight:500,
                      color:t.failed?C.red:t.done?"#ccc":C.muted }}>{t.label}</div>
                    <div style={{ fontSize:11,color:t.done?C.muted:C.muted2,
                      fontWeight:300,marginTop:2,lineHeight:1.5 }}>{t.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {(txn.status==="failed"||txn.status==="reversed") && (
            <div style={{ background:"rgba(246,70,93,0.05)",
              border:"1px solid rgba(246,70,93,0.2)",
              borderRadius:10,padding:"12px 14px",
              display:"flex",gap:8,alignItems:"flex-start" }}>
              <span style={{ fontSize:13,flexShrink:0 }}>{"\u26a0"}</span>
              <span style={{ fontSize:12,color:"#e88",lineHeight:1.6 }}>
                {isWD
                  ? <>This withdrawal was rejected after review. <span style={{ color:"#fff",fontFamily:"'DM Mono',monospace" }}>{fmtNGN(txn.ngnAmt)}</span> has been refunded to your wallet balance.</>
                  : <>This transaction failed. Contact support with reference <span style={{ color:"#fff",fontFamily:"'DM Mono',monospace" }}>{txn.ref}</span> for assistance.</>}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function TransactionHistory() {
  const [activeFilter, setFilter] = useState("all");
  const [search, setSearch]       = useState("");
  const [selected, setSelected]   = useState(null);
  const [sortDir, setSortDir]     = useState(-1);
  const { setIsMobileOpen }       = useOutletContext() || {};
  const navigate                  = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const s=document.createElement("style"); s.textContent=CSS;
    document.head.appendChild(s); return ()=>document.head.removeChild(s);
  },[]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [txRes, statRes] = await Promise.all([
          api.get("/transactions/"),
          api.get("/transactions/stats")
        ]);

        // The paginated response wraps items in { items: [...], count: N }
        const rawItems = txRes.data?.items || txRes.data || [];
        const items = Array.isArray(rawItems) ? rawItems : [];

        // Map backend schema to frontend expectations
        const mapped = items.map(t => ({
          id: t.id,
          type: t.type,
          date: t.created_at,
          ref: t.ref || t.reference || String(t.id),
          ngnAmt: Number(t.amount) || 0,
          status: (t.status || "pending").toLowerCase(),
          bank: t.bank || null,
          coin: t.coin || null,
          network: t.network || null,
          cryptoAmt: t.crypto_amount ? Number(t.crypto_amount) : null,
          rate: t.rate ? Number(t.rate) : null,
          description: t.description || "",
        }));

        setTransactions(mapped);
        setStats(statRes.data);
      } catch (err) {
        console.error("Failed to load transactions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalIn  = stats ? Number(stats.total_deposit_amount) || 0 : 0;
  const totalOut = stats ? Number(stats.total_withdrawal_amount) || 0 : 0;
  const totalCount = stats ? (Number(stats.deposit_count) + Number(stats.withdrawal_count)) : transactions.length;
  const pending  = transactions.filter(t => t.status==="pending").length;

  const filtered = transactions
    .filter(t => activeFilter==="all" || t.type===activeFilter)
    .filter(t => {
      if(!search) return true;
      const q=search.toLowerCase();
      return String(t.id).toLowerCase().includes(q)
        || t.type.toLowerCase().includes(q)
        || (t.coin||"").toLowerCase().includes(q)
        || (t.ref||"").toLowerCase().includes(q)
        || (t.bank||"").toLowerCase().includes(q);
    })
    .sort((a,b)=> sortDir * (new Date(b.date)-new Date(a.date)));

  const FILTERS = [
    { id:"all",        label:"All",         count:transactions.length },
    { id:"trade",      label:"Trades",      count:transactions.filter(t=>t.type==="trade").length },
    { id:"withdrawal", label:"Withdrawals", count:transactions.filter(t=>t.type==="withdrawal").length },
  ];

  const STATS = [
    { label:"Total Received",  val:fmtNGN(totalIn),  sub:"From crypto trades",     col:C.green,  icon:<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>, delay:"0s"    },
    { label:"Total Withdrawn", val:fmtNGN(totalOut), sub:"To bank accounts",       col:C.red,    icon:<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M3 10h18"/><path d="M5 6l7-3 7 3"/><path d="M4 10v11"/><path d="M20 10v11"/><path d="M8 14v3"/><path d="M12 14v3"/><path d="M16 14v3"/></svg>, delay:"0.07s" },
    { label:"Transactions",    val:String(totalCount), sub:"All time",             col:"#ccc",   icon:<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M17 2.1l4 4-4 4"/><path d="M3 12.2v-2a4 4 0 0 1 4-4h12.8M7 21.9l-4-4 4-4"/><path d="M21 11.8v2a4 4 0 0 1-4 4H4.2"/></svg>, delay:"0.14s" },
    { label:"Pending",         val:String(pending),  sub:"Awaiting confirmation",  col:C.amber,  icon:<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, delay:"0.21s" },
  ];

  return (
    <>
      {/* Topbar */}
      <div className="topbar-container" style={{ height:56, display:"flex", alignItems:"center",
        justifyContent:"space-between", padding:"0 24px",
        borderBottom:`1px solid ${C.border}`,
        background:"rgba(6,6,6,0.95)", backdropFilter:"blur(12px)",
        flexShrink:0 }}>
        <div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:20,
            letterSpacing:1, lineHeight:1 }}>Transaction History</div>
          <div style={{ fontSize:11, color:C.muted, marginTop:1 }}>
            All trades and withdrawals
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <button className="topbar-icon"
            onClick={() => navigate("/dashboard/notifications")}
            style={{ width:34,height:34,borderRadius:8,background:C.card,
              border:`1px solid ${C.border}`,display:"flex",alignItems:"center",
              justifyContent:"center",cursor:"pointer",color:C.muted,position:"relative" }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>
            <span style={{ position:"absolute",top:6,right:6,width:5,height:5,
              borderRadius:"50%",background:C.red,border:"1.5px solid #060606" }}/>
          </button>
          <div style={{ width:32,height:32,borderRadius:"50%",
            background:`linear-gradient(135deg,${C.green},${C.amber})`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontFamily:"'Bebas Neue',sans-serif",fontSize:12,color:"#000",cursor:"pointer" }}>AO</div>
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"20px 24px" }}>
        <div className="stats-grid">
          {STATS.map(s=>(
            <div key={s.label} className="stat-card"
              style={{ background:C.card, border:`1px solid ${C.border}`,
                borderRadius:12, padding:"14px 16px",
                animationDelay:s.delay }}>
              <div style={{ display:"flex", justifyContent:"space-between",
                alignItems:"center", marginBottom:8 }}>
                <span style={{ fontSize:10,color:C.muted,letterSpacing:1 }}>
                  {s.label.toUpperCase()}
                </span>
                <span style={{ fontSize:16 }}>{s.icon}</span>
              </div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif",
                fontSize:24, color:s.col, letterSpacing:1, lineHeight:1 }}>{s.val}</div>
              <div style={{ fontSize:11, color:C.muted, marginTop:4 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="filters-container">
          <div className="filters-group">
            {FILTERS.map(f=>(
              <button key={f.id} className={`filter-pill${activeFilter===f.id?" active":""}`}
                onClick={()=>setFilter(f.id)}
                style={{ display:"flex", alignItems:"center", gap:5,
                  padding:"7px 14px", borderRadius:100, fontSize:12, fontWeight:500,
                  background:"transparent", flexShrink:0,
                  border:`1px solid ${activeFilter===f.id?"rgba(14,203,129,0.35)":C.border2}`,
                  color:activeFilter===f.id?C.green:C.muted,
                  fontFamily:"'Outfit',sans-serif", cursor:"pointer" }}>
                {f.label}
                <span style={{ background:activeFilter===f.id?"rgba(14,203,129,0.15)":C.border2,
                  color:activeFilter===f.id?C.green:C.muted,
                  fontSize:10, padding:"1px 6px", borderRadius:100,
                  fontFamily:"'DM Mono',monospace" }}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>
          <div className="search-input-wrapper" style={{ position:"relative" }}>
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none"
              stroke={C.muted} strokeWidth={2} strokeLinecap="round"
              style={{ position:"absolute",left:11,top:"50%",transform:"translateY(-50%)" }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              className="search-input"
              placeholder="Search by ID, coin, bank..."
              style={{ background:C.card, border:`1px solid ${C.border2}`,
                borderRadius:9, padding:"8px 14px 8px 32px",
                color:"#fff", fontSize:13, width:240,
                fontFamily:"'Outfit',sans-serif" }}/>
          </div>
        </div>

        <div className="table-container" style={{ position: "relative", minHeight: 200 }}>
          {loading && (
            <div style={{ position:"absolute", inset:0, background:"rgba(16,16,16,0.6)", backdropFilter:"blur(2px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:10 }}>
              <div style={{ width:24, height:24, borderRadius:"50%", border:"2px solid rgba(14,203,129,0.2)", borderTopColor:C.green, animation:"spin 0.8s linear infinite" }}/>
            </div>
          )}
          <div className="table-min-width">
            <div className="txn-header-row" style={{ display:"grid",
              gridTemplateColumns:"1.8fr 1fr 1fr 1.2fr 1fr",
              padding:"10px 18px", borderBottom:`1px solid ${C.border}` }}>
              {["Transaction","Type","Amount","Date","Status"].map((h,i)=>(
                <div key={h} className="sort-th"
                  onClick={()=>{ if(h==="Date") setSortDir(d=>-d); }}
                  style={{ fontSize:9,color:C.muted,letterSpacing:2,
                    textTransform:"uppercase",
                    cursor:h==="Date"?"pointer":"default",
                    display:"flex",alignItems:"center",gap:4 }}>
                  {h}
                  {h==="Date" && (
                    <span style={{ fontSize:8,color:C.muted2 }}>
                      {sortDir===-1?"\u2193":"\u2191"}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {filtered.length===0 ? (
              <div style={{ textAlign:"center", padding:"56px 0" }}>
                <div style={{ display:"flex", justifyContent:"center", marginBottom:12, color:C.muted2 }}>
                  <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
                <div style={{ fontSize:14, color:C.muted }}>No transactions found</div>
              </div>
            ) : filtered.map((t,i)=>{
              const meta   = TYPE_META[t.type] || TYPE_META.trade;
              const status = STATUS_META[t.status] || STATUS_META.pending;
              const isSel  = selected?.id===t.id;
              return (
                <div key={t.id}
                  className={`txn-row txn-grid-row${isSel?" selected":""}`}
                  onClick={()=>setSelected(isSel?null:t)}
                  style={{ display:"grid",
                    gridTemplateColumns:"1.8fr 1fr 1fr 1.2fr 1fr",
                    padding:"13px 18px",
                    borderBottom:`1px solid ${C.border}`,
                    borderLeft:`2px solid ${isSel?C.green:"transparent"}`,
                    alignItems:"center", cursor:"pointer",
                    animation:`fadeUp 0.35s ${i*0.03}s ease both` }}>

                  <div className="txn-cell-trade" style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:32,height:32,borderRadius:9,
                      background:meta.bg, flexShrink:0,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      color:meta.color }}>{meta.icon}</div>
                    <div>
                      <div style={{ fontSize:13,fontWeight:500 }}>
                        {t.type==="trade"    ? `${t.coin || "Crypto"} \u2192 NGN`
                         :                     "Bank Withdrawal"}
                      </div>
                      <div style={{ fontFamily:"'DM Mono',monospace",
                        fontSize:10,color:C.muted }}>{t.ref}</div>
                    </div>
                  </div>

                  <div className="txn-type-cell">
                    <span style={{ fontSize:10,fontWeight:600,padding:"3px 8px",
                      borderRadius:100,color:meta.color,background:meta.bg,
                      letterSpacing:"0.5px" }}>{meta.label}</span>
                  </div>

                  <div className="txn-cell-amount">
                    <div style={{ fontFamily:"'DM Mono',monospace",fontSize:13,
                      color:t.type==="withdrawal"?C.red:C.green,fontWeight:500 }}>
                      {t.type==="withdrawal"?"-":""}{fmtNGN(t.ngnAmt)}
                    </div>
                    {t.type==="trade" && t.cryptoAmt && (
                      <div style={{ fontSize:10,color:C.muted }}>
                        {t.cryptoAmt} {t.coin}
                      </div>
                    )}
                  </div>

                  <div className="txn-cell-date" style={{ fontSize:11,color:C.muted }}>
                    {fmtDate(t.date)}
                  </div>

                  <div className="txn-cell-status" style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <span style={{ fontSize:10,fontWeight:600,padding:"3px 9px",
                      borderRadius:100,color:status.color,background:status.bg,
                      display:"flex",alignItems:"center",gap:4 }}>
                      {t.status==="pending"&&(
                        <span style={{ width:4,height:4,borderRadius:"50%",
                          background:C.amber,animation:"pulse 1.5s infinite",
                          display:"inline-block" }}/>
                      )}
                      {statusLabel(t)}
                    </span>
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none"
                      stroke={C.muted2} strokeWidth={2} strokeLinecap="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ padding:"12px 18px",
            display:"flex", justifyContent:"space-between",
            alignItems:"center" }}>
            <span style={{ fontSize:11,color:C.muted }}>
              Showing {filtered.length} of {transactions.length} transactions
            </span>
            <span style={{ fontSize:11,color:C.green,cursor:"pointer" }}>
              Export CSV {"\u2192"}
            </span>
          </div>
        </div>
      </div>

      {selected && (
        <DetailPanel txn={selected} onClose={()=>setSelected(null)}/>
      )}
    </>
  );
}
