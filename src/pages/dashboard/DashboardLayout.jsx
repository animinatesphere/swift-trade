import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

// ─── TOKENS ───────────────────────────────────────────────
const C = {
  green:"#0ECB81", amber:"#F5A623", red:"#F6465D", blue:"#3B82F6",
  bg:"#080808", surface:"#0c0c0c", card:"#101010", card2:"#141414",
  border:"#1a1a1a", border2:"#222222",
  text:"#ffffff", muted:"#555555", muted2:"#2e2e2e",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html, body { height:100%; overflow:hidden; }
  body { background:#080808; color:#fff; font-family:'Outfit',sans-serif; }
  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:#1e1e1e; border-radius:4px; }

  @keyframes slideIn  { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:translateX(0)} }
  @keyframes pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.75)} }

  .nav-item           { transition:all 0.15s; border-left:2px solid transparent; text-decoration:none; display:flex; }
  .nav-item:hover     { background:rgba(255,255,255,0.04) !important; color:#ddd !important; }
  .nav-item.act       { background:rgba(14,203,129,0.08) !important; color:#0ECB81 !important; border-left-color:#0ECB81 !important; }
  .soon               { opacity:0.38; pointer-events:none; }

  .mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    color: #fff;
    font-size: 24px;
    cursor: pointer;
  }

  @media (max-width: 1024px) {
    .sidebar-container {
      position: fixed !important;
      left: 0;
      top: 0;
      bottom: 0;
      z-index: 50;
      transform: translateX(-100%);
      transition: transform 0.3s ease;
    }
    .sidebar-container.open {
      transform: translateX(0);
    }
    .mobile-menu-btn {
      display: block;
    }
    .mobile-header {
      display: flex !important;
    }
    .sidebar-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 40;
    }
    .sidebar-overlay.open {
      display: block;
    }
  }
`;

// ─── LOGO ───────────────────────────────────────────────
function Mark({ size=32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{display:"block"}}>
      <defs>
        <filter id="tg"><feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="ta"><feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <path d="M 32,52 C 26,40 16,24 8,8" stroke={C.green} strokeWidth="3.8" strokeLinecap="round" fill="none" filter="url(#tg)"/>
      <g transform="translate(8,8) rotate(-27)"><polygon points="0,-6 -3.5,3.5 3.5,3.5" fill={C.green} filter="url(#tg)"/></g>
      <path d="M 32,52 C 38,40 48,24 56,8" stroke={C.amber} strokeWidth="3.8" strokeLinecap="round" fill="none" filter="url(#ta)"/>
      <g transform="translate(56,8) rotate(27)"><polygon points="0,-6 -3.5,3.5 3.5,3.5" fill={C.amber} filter="url(#ta)"/></g>
      <circle cx="32" cy="52" r="3.5" fill="white"/>
    </svg>
  );
}

const NAV = [
  { id:"dashboard",    path: "/dashboard",        label:"Dashboard",            icon:<svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { id:"trade",        path: "/dashboard/trade",  label:"New Trade",            highlight:true, icon:<svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
  { id:"txn",          path: "/dashboard/txn",    label:"Transaction History",  icon:<svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
  { id:"giftcards",    path: "/dashboard/giftcards",label:"Gift Cards",         soon:true, icon:<svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5" rx="1"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg> },
  { id:"bills",        path: "/dashboard/bills",  label:"Bills Payment",        soon:true, icon:<svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
  { id:"bank",         path: "/dashboard/bank",   label:"Bank Accounts",        soon:true, icon:<svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg> },
];

export default function DashboardLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(()=>{
    const s=document.createElement("style"); s.textContent=CSS;
    document.head.appendChild(s); return ()=>document.head.removeChild(s);
  },[]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const activeId = NAV.find(n => location.pathname === n.path)?.id || "dashboard";

  return (
    <div style={{ display:"flex", height:"100vh", background:C.bg, overflow:"hidden" }}>
      
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${isMobileOpen ? "open" : ""}`}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* Sidebar */}
      <div className={`sidebar-container ${isMobileOpen ? "open" : ""}`} style={{ width:214, background:"#060606", borderRight:`1px solid ${C.border}`,
        display:"flex", flexDirection:"column", height:"100vh", flexShrink:0 }}>
        <div style={{ padding:"20px 18px 16px", borderBottom:`1px solid ${C.border}`,
          display:"flex", alignItems:"center", gap:10 }}>
          <Mark size={32}/><div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:19, letterSpacing:2, lineHeight:1 }}>SWIFT</div>
            <div style={{ fontSize:7, color:C.amber, letterSpacing:5, marginTop:1 }}>TRADE</div>
          </div>
        </div>
        <div style={{ padding:"14px 16px 6px" }}>
          <span style={{ fontSize:9, color:C.muted2, letterSpacing:3, fontWeight:600 }}>MENU</span>
        </div>
        <nav style={{ flex:1, padding:"0 8px", overflowY:"auto" }}>
          {NAV.map(item=>(
            <Link key={item.id} to={item.path}
              className={`nav-item${activeId===item.id?" act":""}${item.soon?" soon":""}`}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:10,
                padding:"9px 10px", borderRadius:"0 8px 8px 0", marginBottom:1,
                background: item.highlight&&activeId!==item.id ? "rgba(245,166,35,0.05)" : "transparent",
                border:"none", borderLeft:"2px solid transparent",
                color: item.highlight&&activeId!==item.id ? C.amber : activeId===item.id ? C.green : C.muted,
                fontSize:13, fontFamily:"'Outfit',sans-serif", fontWeight:500,
                cursor:"pointer", textAlign:"left" }}>
              <span style={{ flexShrink:0, display:"flex" }}>{item.icon}</span>
              <span style={{ flex:1 }}>{item.label}</span>
              {item.soon && <span style={{ fontSize:8, padding:"2px 6px", borderRadius:4, background:C.muted2, color:"#555", letterSpacing:1 }}>SOON</span>}
              {item.highlight&&activeId!==item.id && <span style={{ width:6,height:6,borderRadius:"50%",background:C.amber,animation:"pulse 2s infinite",flexShrink:0 }}/>}
            </Link>
          ))}
        </nav>
        <div style={{ padding:"8px", borderTop:`1px solid ${C.border}` }}>
          {[{ label:"Settings", path:"#" },{ label:"Log Out", path:"/" }].map(b=>(
            <Link key={b.label} to={b.path} className="nav-item"
              style={{ width:"100%", display:"flex", alignItems:"center", gap:10,
                padding:"8px 10px", borderRadius:"0 8px 8px 0", marginBottom:1,
                background:"transparent", border:"none", borderLeft:"2px solid transparent",
                color:C.muted, fontSize:13, fontFamily:"'Outfit',sans-serif",
                fontWeight:500, cursor:"pointer", textAlign:"left" }}>
              {b.label}
            </Link>
          ))}
          <div style={{ display:"flex", alignItems:"center", gap:10,
            padding:"10px 10px 4px", borderTop:`1px solid ${C.border}`, marginTop:6 }}>
            <div style={{ width:28,height:28,borderRadius:"50%",flexShrink:0,
              background:`linear-gradient(135deg,${C.green},${C.amber})`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontFamily:"'Bebas Neue',sans-serif",fontSize:11,color:"#000" }}>AO</div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:11, fontWeight:600, color:"#bbb",
                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>Adewale Obi</div>
              <div style={{ fontSize:9, color:C.green, letterSpacing:1 }}>✓ VERIFIED</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, position:"relative", overflow:"hidden" }}>
        
        {/* Mobile Header (only visible on mobile to toggle sidebar) */}
        <div className="mobile-header" style={{ height:56, display:"none", alignItems:"center", padding:"0 16px", borderBottom:`1px solid ${C.border}`, background:"#060606", flexShrink:0 }}>
            <button className="mobile-menu-btn" onClick={() => setIsMobileOpen(true)} style={{ marginRight:12 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:20, letterSpacing:1, color:"#fff" }}>SWIFT TRADE</div>
        </div>
        
        {/* The current dashboard page content */}
        <Outlet context={{ setIsMobileOpen }} />
        
      </div>
    </div>
  );
}
