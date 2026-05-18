import React, { useState, useEffect } from "react";

const C = {
  green:"#0ECB81", amber:"#F5A623", red:"#F6465D",
  bg:"#080808", surface:"#0c0c0c", card:"#101010", card2:"#141414",
  border:"#1a1a1a", border2:"#222222",
  text:"#ffffff", muted:"#555555", muted2:"#2e2e2e",
};

const CSS = `
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .toggle-track   { transition:background 0.2s; cursor:pointer; }
  .card-in        { animation:fadeUp 0.4s ease both; }
  .copy-btn:hover { color:#0ECB81 !important; }
  .copy-btn       { transition:color 0.15s; }
  .danger-btn:hover { background:rgba(246,70,93,0.15) !important; border-color:rgba(246,70,93,0.4) !important; }
  .danger-btn     { transition:all 0.2s; }

  @media (max-width: 1024px) {
    .topbar-container {
      display: none !important;
    }
  }

  @media (max-width: 768px) {
    .profile-hero-content {
      flex-direction: column !important;
      align-items: center !important;
      text-align: center !important;
      gap: 18px !important;
    }
    .profile-hero-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .profile-hero-stats {
      width: 100% !important;
      justify-content: center !important;
      gap: 32px !important;
      margin-top: 14px !important;
      border-top: 1px solid #1a1a1a !important;
      padding-top: 18px !important;
    }
  }

  @media (max-width: 480px) {
    .profile-hero-stats {
      gap: 20px !important;
    }
    .field-row {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 6px !important;
    }
  }
`;

// ─── FIELD ROW ────────────────────────────────────────────
function FieldRow({ label, value, mono, tag }) {
  return (
    <div className="field-row" style={{ display:"flex", justifyContent:"space-between",
      alignItems:"center", padding:"14px 0",
      borderBottom:`1px solid ${C.border}` }}>
      <span style={{ fontSize:12, color:C.muted, minWidth:140 }}>{label}</span>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        {tag && (
          <span style={{ fontSize:10, padding:"2px 8px", borderRadius:100,
            background: tag.color==="green" ? "rgba(14,203,129,0.1)" : "rgba(245,166,35,0.1)",
            color: tag.color==="green" ? C.green : C.amber,
            fontWeight:600, letterSpacing:1 }}>
            {tag.label}
          </span>
        )}
        <span style={{ fontFamily: mono ? "'DM Mono',monospace" : "'Outfit',sans-serif",
          fontSize:13, color:"#ccc",
          letterSpacing: mono ? "0.5px" : "normal" }}>
          {value}
        </span>
      </div>
    </div>
  );
}

// ─── SECTION CARD ─────────────────────────────────────────
function Section({ title, icon, children, delay="0s" }) {
  return (
    <div className="card-in"
      style={{ background:C.card, border:`1px solid ${C.border}`,
        borderRadius:14, overflow:"hidden",
        marginBottom:16, animationDelay:delay }}>
      <div style={{ display:"flex", alignItems:"center", gap:8,
        padding:"14px 20px", borderBottom:`1px solid ${C.border}` }}>
        <span style={{ color:C.muted }}>{icon}</span>
        <span style={{ fontSize:12, fontWeight:600, letterSpacing:1,
          color:"#bbb" }}>{title}</span>
      </div>
      <div style={{ padding:"0 20px" }}>{children}</div>
    </div>
  );
}

// ─── TOGGLE ───────────────────────────────────────────────
function Toggle({ on, onChange }) {
  return (
    <div className="toggle-track" onClick={() => onChange(!on)}
      style={{ width:40, height:22, borderRadius:11,
        background: on ? C.green : C.border2,
        position:"relative", flexShrink:0 }}>
      <div style={{ position:"absolute",
        top:3, left: on ? 21 : 3,
        width:16, height:16, borderRadius:"50%",
        background:"#fff",
        transition:"left 0.2s",
        boxShadow:"0 1px 4px rgba(0,0,0,0.4)" }}/>
    </div>
  );
}

function ToggleRow({ label, sub, on, onChange }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between",
      alignItems:"center", padding:"14px 0",
      borderBottom:`1px solid ${C.border}` }}>
      <div>
        <div style={{ fontSize:13, color:"#ccc", marginBottom:2 }}>{label}</div>
        {sub && <div style={{ fontSize:11, color:C.muted }}>{sub}</div>}
      </div>
      <Toggle on={on} onChange={onChange}/>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────
export default function Settings() {
  const [notifs, setNotifs] = useState({
    email:true, sms:true, tradeComplete:true, loginAlert:true,
  });

  useEffect(() => {
    const s = document.createElement("style"); s.textContent = CSS;
    document.head.appendChild(s); return () => document.head.removeChild(s);
  }, []);

  return (
    <>
      {/* Topbar */}
      <div className="topbar-container" style={{ height:56, display:"flex", alignItems:"center",
        justifyContent:"space-between", padding:"0 28px",
        borderBottom:`1px solid ${C.border}`,
        background:"rgba(6,6,6,0.95)", backdropFilter:"blur(12px)", flexShrink:0 }}>
        <div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:20,
            letterSpacing:1, lineHeight:1 }}>Settings</div>
          <div style={{ fontSize:11, color:C.muted, marginTop:1 }}>
            Your account information and preferences
          </div>
        </div>
        <div style={{ width:32, height:32, borderRadius:"50%",
          background:`linear-gradient(135deg,${C.green},${C.amber})`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontFamily:"'Bebas Neue',sans-serif", fontSize:12, color:"#000" }}>AO</div>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:"auto", padding:"24px 28px" }}>
        <div style={{ maxWidth:680, margin:"0 auto" }}>

          {/* Profile hero */}
          <div className="card-in"
            style={{ background:C.card, border:`1px solid ${C.border}`,
              borderRadius:16, padding:"28px 24px",
              marginBottom:16, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:-40, right:-40, width:200, height:200,
              borderRadius:"50%",
              background:`radial-gradient(circle,rgba(14,203,129,0.06),transparent 60%)`,
              filter:"blur(30px)", pointerEvents:"none" }}/>

            <div className="profile-hero-content" style={{ display:"flex", alignItems:"center", gap:20,
              position:"relative" }}>
              {/* Avatar */}
              <div style={{ position:"relative", flexShrink:0 }}>
                <div style={{ width:72, height:72, borderRadius:"50%",
                  background:`linear-gradient(135deg,${C.green},${C.amber})`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontFamily:"'Bebas Neue',sans-serif", fontSize:28,
                  color:"#000", letterSpacing:1 }}>AO</div>
                <div style={{ position:"absolute", bottom:2, right:2,
                  width:14, height:14, borderRadius:"50%",
                  background:C.green, border:"2px solid #101010",
                  animation:"pulse 3s infinite" }}/>
              </div>

              {/* Info */}
              <div className="profile-hero-info" style={{ flex:1 }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif",
                  fontSize:26, letterSpacing:1, lineHeight:1,
                  marginBottom:4 }}>ADEWALE OBI</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:12,
                  color:C.muted, marginBottom:8 }}>adewale@gmail.com</div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent: "inherit" }}>
                  <span style={{ fontSize:10, padding:"3px 10px", borderRadius:100,
                    background:"rgba(14,203,129,0.1)",
                    border:"1px solid rgba(14,203,129,0.2)",
                    color:C.green, fontWeight:600, letterSpacing:1 }}>
                    ✓ VERIFIED
                  </span>
                  <span style={{ fontSize:10, padding:"3px 10px", borderRadius:100,
                    background:"rgba(255,255,255,0.04)", border:`1px solid ${C.border2}`,
                    color:C.muted, letterSpacing:1 }}>
                    MEMBER SINCE DEC 2025
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="profile-hero-stats" style={{ display:"flex", gap:24, flexShrink:0 }}>
                {[
                  { val:"7",         label:"Trades"    },
                  { val:"₦3.26M",    label:"Volume"    },
                  { val:"3",         label:"Banks"     },
                ].map(s => (
                  <div key={s.label} style={{ textAlign:"center" }}>
                    <div style={{ fontFamily:"'Bebas Neue',sans-serif",
                      fontSize:22, color:C.green, letterSpacing:1 }}>{s.val}</div>
                    <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Personal info */}
          <Section title="PERSONAL INFORMATION"
            icon={<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
            delay="0.06s">
            <FieldRow label="Full Name"     value="Adewale Ifeoluwa Obi" />
            <FieldRow label="Email Address" value="adewale@gmail.com" mono />
            <FieldRow label="Phone Number"  value="+234 801 234 5678" mono />
            <FieldRow label="Date of Birth" value="15 March 1995" />
            <FieldRow label="Account ID"    value="USR-00284" mono />
          </Section>

          {/* KYC */}
          <Section title="VERIFICATION & KYC"
            icon={<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
            delay="0.1s">
            <FieldRow label="KYC Status"    value="Verified"
              tag={{ label:"VERIFIED", color:"green" }} />
            <FieldRow label="BVN"           value="••••••••983" mono />
            <FieldRow label="ID Type"       value="National ID (NIN)" />
            <FieldRow label="Tier"          value="Tier 2 — Full Access"
              tag={{ label:"TIER 2", color:"amber" }} />
            <FieldRow label="Verified On"   value="December 10, 2025" />
          </Section>

          {/* Security */}
          <Section title="SECURITY"
            icon={<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>}
            delay="0.14s">
            <FieldRow label="Password"      value="Last changed Dec 10, 2025" />
            <FieldRow label="2FA"           value="Enabled — Authenticator App"
              tag={{ label:"ON", color:"green" }} />
            <FieldRow label="Last Login"    value="Today, 9:14 AM — Lagos, NG" />
            <div style={{ padding:"14px 0" }}>
              <button style={{ fontSize:13, color:C.amber, background:"none",
                border:"none", cursor:"pointer", padding:0,
                fontFamily:"'Outfit',sans-serif", fontWeight:500 }}>
                Change Password →
              </button>
            </div>
          </Section>

          {/* Notifications */}
          <Section title="NOTIFICATIONS"
            icon={<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>}
            delay="0.18s">
            <ToggleRow
              label="Email Notifications"
              sub="Trade updates, withdrawals and security alerts"
              on={notifs.email}
              onChange={v => setNotifs(n => ({ ...n, email:v }))}/>
            <ToggleRow
              label="SMS Notifications"
              sub="OTP and critical account alerts"
              on={notifs.sms}
              onChange={v => setNotifs(n => ({ ...n, sms:v }))}/>
            <ToggleRow
              label="Trade Completion Alerts"
              sub="Get notified when your NGN payout is released"
              on={notifs.tradeComplete}
              onChange={v => setNotifs(n => ({ ...n, tradeComplete:v }))}/>
            <ToggleRow
              label="Login Alerts"
              sub="Be notified of new logins to your account"
              on={notifs.loginAlert}
              onChange={v => setNotifs(n => ({ ...n, loginAlert:v }))}/>
          </Section>

          {/* Danger zone */}
          <div className="card-in"
            style={{ background:"rgba(246,70,93,0.03)",
              border:"1px solid rgba(246,70,93,0.15)",
              borderRadius:14, padding:"20px 20px",
              animationDelay:"0.22s" }}>
            <div style={{ fontSize:12, fontWeight:600, color:C.red,
              letterSpacing:1, marginBottom:14 }}>DANGER ZONE</div>
            <div style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center" }}>
              <div>
                <div style={{ fontSize:13, fontWeight:500, marginBottom:3 }}>
                  Deactivate Account
                </div>
                <div style={{ fontSize:12, color:C.muted, lineHeight:1.5 }}>
                  Permanently disable your Swift Trade account.
                </div>
              </div>
              <button className="danger-btn"
                style={{ background:"transparent",
                  border:"1px solid rgba(246,70,93,0.25)",
                  color:C.red, fontSize:12, fontWeight:600,
                  padding:"8px 16px", borderRadius:8,
                  cursor:"pointer", fontFamily:"'Outfit',sans-serif",
                  flexShrink:0, marginLeft:24 }}>
                Deactivate
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
