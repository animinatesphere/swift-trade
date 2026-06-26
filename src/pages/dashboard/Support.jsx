import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

const C = {
  green: "#0ECB81", amber: "#F5A623", red: "#F6465D", blue: "#3B82F6",
  bg: "#080808", surface: "#0c0c0c", card: "#101010", card2: "#141414",
  border: "#1a1a1a", border2: "#222222",
  text: "#ffffff", muted: "#888888", muted2: "#2e2e2e",
};

const CSS = `
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes popIn   { 0%{transform:scale(0.8);opacity:0} 70%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }
  @keyframes checkDraw { from{stroke-dashoffset:60} to{stroke-dashoffset:0} }

  .faq-item       { transition:background 0.15s; }
  .faq-item:hover { background:#161616 !important; }

  .channel-card   { transition:all 0.18s; }
  .channel-card:hover { border-color:#444 !important; background:#161616 !important; transform:translateY(-2px); }

  .pri-btn        { transition:all 0.2s; }
  .pri-btn:hover:not(:disabled) { background:#0fdf8e !important; transform:translateY(-1px); box-shadow:0 8px 24px rgba(14,203,129,0.3) !important; }
  .pri-btn:disabled { opacity:0.4 !important; cursor:not-allowed !important; }

  .st-input:focus    { border-color:rgba(14,203,129,0.45) !important; box-shadow:0 0 0 3px rgba(14,203,129,0.07) !important; outline:none; }
  .st-input          { transition:border-color 0.2s, box-shadow 0.2s; }
  .st-select:focus   { border-color:rgba(14,203,129,0.45) !important; outline:none; }
  .st-select         { transition:border-color 0.2s; }
  .search-input:focus{ border-color:rgba(14,203,129,0.4) !important; outline:none; }
  .search-input      { transition:border-color 0.2s; }
  
  @media (max-width: 1024px) {
    .topbar-container {
      display: none !important;
    }
  }

  @media (max-width: 768px) {
    .support-content {
      padding: 16px !important;
    }
    .channels-grid {
      grid-template-columns: 1fr 1fr !important;
    }
  }

  @media (max-width: 640px) {
    .channels-grid {
      grid-template-columns: 1fr !important;
    }
    .faq-search-row {
      flex-direction: column !important;
      align-items: stretch !important;
    }
    .faq-cats-row {
      width: 100% !important;
    }
    .tabs-row {
      width: 100% !important;
    }
    .tabs-row button {
      flex: 1;
    }
  }

  @media (max-width: 480px) {
    .support-content {
      padding: 14px !important;
    }
  }
`;

const FAQS = [
  { id:1, cat:"Trades", q:"How long does it take to receive my NGN after a trade?", a:"Once our team confirms your crypto deposit, your NGN is released to your bank account within 5–15 minutes during business hours. Trades submitted outside business hours are processed first thing the next morning." },
  { id:2, cat:"Trades", q:"What happens if I send the wrong coin or wrong network?", a:"Unfortunately, sending the wrong coin or using the wrong network results in permanent loss of funds. Swift Trade cannot reverse blockchain transactions. Always double-check the coin and network before sending." },
  { id:3, cat:"Trades", q:"My trade is still showing pending after 30 minutes. What should I do?", a:"If your trade is pending for more than 30 minutes, please contact support with your Trade ID (e.g. TRD-7841). Our team will investigate and update you immediately." },
  { id:4, cat:"Trades", q:"Why was my trade rate different from what I expected?", a:"Rates are locked for 60 seconds after you generate a quote. If you took longer to send your crypto, the rate may have refreshed. The rate displayed at the time of wallet generation is the rate that applies to your trade." },
  { id:5, cat:"Gift Cards", q:"How long does gift card verification take?", a:"Most gift cards are verified within 5–15 minutes. Amazon and iTunes cards are usually faster. If your card has not been verified after 1 hour, contact support with your reference ID." },
  { id:6, cat:"Gift Cards", q:"Which gift card countries and denominations do you accept?", a:"We currently accept USD and GBP denominations for Amazon, iTunes, Steam, Google Play, Netflix, and Xbox gift cards. We do not accept physical cards — only digital codes." },
  { id:7, cat:"Withdrawals", q:"I requested a withdrawal but the money hasn't arrived. What do I do?", a:"Withdrawals typically reflect within 5–15 minutes. Some bank transfers may take up to 2 hours due to interbank processing. If it has been over 2 hours, contact support with your Withdrawal ID." },
  { id:8, cat:"Withdrawals", q:"Can I withdraw to any Nigerian bank?", a:"Yes. We support all major Nigerian banks including GTBank, Access, Zenith, First Bank, UBA, Kuda, OPay, Moniepoint, and more. You can save up to 5 bank accounts on your profile." },
  { id:9, cat:"Account", q:"How do I verify my account (KYC)?", a:"During registration, you'll be asked to provide your BVN and a government-issued ID. Verification usually takes a few minutes. Unverified accounts have limited withdrawal limits." },
  { id:10, cat:"Account", q:"I forgot my password. How do I reset it?", a:'Click "Forgot Password" on the login page, enter your registered email, and we\'ll send you a 6-digit OTP. Enter the OTP and set a new password. The link expires in 10 minutes.' },
];

const CATS = ["All", "Trades", "Gift Cards", "Withdrawals", "Account"];

function FaqItem({ item, delay }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item" style={{ borderBottom: `1px solid ${C.border}`, animation: `fadeUp 0.4s ${delay}s ease both` }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 20px", background:"none", border:"none", cursor:"pointer", textAlign:"left", fontFamily:"'Outfit',sans-serif" }}>
        <span style={{ fontSize:14, fontWeight:500, color:"#ddd", paddingRight:16, lineHeight:1.5 }}>{item.q}</span>
        <div style={{ width:22, height:22, borderRadius:"50%", flexShrink:0, background: open ? "rgba(14,203,129,0.1)" : C.border2, border: `1px solid ${open ? "rgba(14,203,129,0.3)" : C.border}`, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}>
          <svg width={10} height={10} viewBox="0 0 10 10" fill="none" stroke={open ? C.green : C.muted} strokeWidth={1.6} strokeLinecap="round" style={{ transform: open ? "rotate(45deg)" : "none", transition:"transform 0.25s" }}>
            <line x1="5" y1="1" x2="5" y2="9"/><line x1="1" y1="5" x2="9" y2="5"/>
          </svg>
        </div>
      </button>
      {open && (
        <div style={{ padding:"0 20px 18px", animation:"fadeIn 0.25s ease" }}>
          <p style={{ fontSize:13, color:C.muted, lineHeight:1.8, fontWeight:300 }}>{item.a}</p>
        </div>
      )}
    </div>
  );
}

const SUPPORT_EMAIL = "support@swiftrade.com";

function TicketForm() {
  const [form, setForm]     = useState({ ref:"", message:"" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent]     = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]:e.target.value }));
  const canSubmit = form.message.trim().length > 10;

  const submit = () => {
    setLoading(true);
    const subject = `Support Ticket${form.ref ? ` — ${form.ref.trim()}` : ""}`;
    const body = `${form.message.trim()}${form.ref ? `\n\nReference ID: ${form.ref.trim()}` : ""}`;
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setTimeout(() => { setLoading(false); setSent(true); }, 800);
  };

  if (sent) return (
    <div style={{ textAlign:"center", padding:"32px 20px", animation:"fadeIn 0.4s ease" }}>
      <div style={{ width:64, height:64, borderRadius:"50%", background:"rgba(14,203,129,0.1)", border: `2px solid ${C.green}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", animation:"popIn 0.4s ease" }}>
        <svg width={28} height={28} viewBox="0 0 28 28" fill="none">
          <path d="M5 14l6 7L23 9" stroke={C.green} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={60} style={{ animation:"checkDraw 0.5s 0.3s ease forwards", strokeDashoffset:60 }}/>
        </svg>
      </div>
      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:1, marginBottom:8 }}>EMAIL APP OPENED</div>
      <p style={{ color:C.muted, fontSize:13, lineHeight:1.7, marginBottom:20 }}>
        Hit send in your email app to deliver your message to {SUPPORT_EMAIL}. We'll reply within 2 hours.
      </p>
      <button onClick={() => { setSent(false); setForm({ ref:"", message:"" }); }} style={{ background:"none", border: `1px solid ${C.border2}`, color:C.muted, fontSize:12, padding:"8px 20px", borderRadius:8, cursor:"pointer", fontFamily:"'Outfit',sans-serif" }}>Submit Another</button>
    </div>
  );

  return (
    <div style={{ padding:"20px" }}>
      <div style={{ marginBottom:14 }}>
        <label style={{ display:"block", fontSize:10, color:C.muted, letterSpacing:2, marginBottom:7 }}>TRADE / REFERENCE ID (optional)</label>
        <input className="st-input" value={form.ref} onChange={set("ref")} placeholder="e.g. TRD-7841, GC-4421, WD-1024" style={{ width:"100%", background:C.card2, border: `1px solid ${C.border2}`, borderRadius:10, padding:"12px 14px", color:"#fff", fontSize:14, fontFamily:"'DM Mono',monospace", letterSpacing:1 }}/>
      </div>
      <div style={{ marginBottom:18 }}>
        <label style={{ display:"block", fontSize:10, color:C.muted, letterSpacing:2, marginBottom:7 }}>DESCRIBE YOUR ISSUE</label>
        <textarea className="st-input" value={form.message} onChange={set("message")} rows={4} placeholder="Tell us exactly what happened and when..." style={{ width:"100%", background:C.card2, border: `1px solid ${C.border2}`, borderRadius:10, padding:"12px 14px", color:"#fff", fontSize:14, lineHeight:1.6 }}/>
        <div style={{ fontSize:11, color:form.message.length > 10 ? C.muted : C.muted2, marginTop:5, textAlign:"right" }}>{form.message.length} chars</div>
      </div>
      <button onClick={submit} disabled={!canSubmit || loading} className="pri-btn" style={{ width:"100%", background:canSubmit ? C.green : C.border, color:canSubmit ? "#000" : C.muted, fontWeight:700, fontSize:14, padding:"13px", borderRadius:10, border:"none", fontFamily:"'Outfit',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
        {loading ? <><div style={{ width:16, height:16, borderRadius:"50%", border:"2px solid rgba(0,0,0,0.2)", borderTopColor:"#000", animation:"spin 0.8s linear infinite" }}/>Opening email...</> : "Submit Ticket →"}
      </button>
    </div>
  );
}

export default function Support() {
  const [search, setSearch] = useState("");
  const [cat, setCat]       = useState("All");
  const [tab, setTab]       = useState("faq");
  const { setIsMobileOpen } = useOutletContext() || {};

  useEffect(() => {
    const s = document.createElement("style"); s.textContent = CSS;
    document.head.appendChild(s); return () => document.head.removeChild(s);
  }, []);

  const filtered = FAQS
    .filter(f => cat === "All" || f.cat === cat)
    .filter(f => !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));

  const CHANNELS = [
    { icon:<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>, label:"WhatsApp", sub:"Fastest response", action:"Chat with us", color:C.green, href:"https://wa.me/2349161814877", target:"_blank" },
    { icon:<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, label:"Email", sub:"Reply within 2hrs", action:"Send an email", color:"#aaa", href:`mailto:${SUPPORT_EMAIL}` },
  ];

  return (
    <>
      <div className="topbar-container" style={{ height:56, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 28px", borderBottom: `1px solid ${C.border}`, background:"rgba(6,6,6,0.95)", backdropFilter:"blur(12px)", flexShrink:0 }}>
        <div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:20, letterSpacing:1, lineHeight:1 }}>Support</div>
          <div style={{ fontSize:11, color:C.muted, marginTop:1 }}>We typically respond within 2 hours</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:5, background:"rgba(14,203,129,0.06)", border:"1px solid rgba(14,203,129,0.15)", borderRadius:100, padding:"4px 10px" }}>
            <span style={{ width:5, height:5, borderRadius:"50%", background:C.green, animation:"pulse 2s infinite", display:"inline-block" }}/>
            <span style={{ fontSize:10, color:C.green, fontFamily:"'DM Mono',monospace" }}>ONLINE</span>
          </div>
          <div style={{ width:32, height:32, borderRadius:"50%", background: `linear-gradient(135deg,${C.green},${C.amber})`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Bebas Neue',sans-serif", fontSize:12, color:"#000" }}>AO</div>
        </div>
      </div>

      <div className="support-content" style={{ flex:1, overflowY:"auto", padding:"24px 28px" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <div className="channels-grid" style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12, marginBottom:28, animation:"fadeUp 0.4s ease" }}>
            {CHANNELS.map(ch => (
              <a key={ch.label} href={ch.href} target={ch.target} rel={ch.target ? "noopener noreferrer" : undefined} className="channel-card" style={{ background:C.card, border: `1px solid ${C.border}`, borderRadius:12, padding:"16px 18px", display:"flex", alignItems:"center", gap:14, textDecoration:"none", cursor:"pointer" }}>
                <span style={{ flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>{ch.icon}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:600, color:"#ddd", marginBottom:2 }}>{ch.label}</div>
                  <div style={{ fontSize:11, color:C.muted }}>{ch.sub}</div>
                </div>
                <span style={{ fontSize:11, color:ch.color, fontWeight:500, whiteSpace:"nowrap" }}>{ch.action} →</span>
              </a>
            ))}
          </div>

          <div className="tabs-row" style={{ display:"flex", background:C.card2, border: `1px solid ${C.border}`, borderRadius:10, padding:3, gap:2, marginBottom:20, width:"fit-content" }}>
            {[{v:"faq",l:"FAQ"},{v:"ticket",l:"Submit a Ticket"}].map(t => (
              <button key={t.v} onClick={() => setTab(t.v)} style={{ padding:"7px 20px", borderRadius:8, border:"none", fontSize:13, fontWeight:600, cursor:"pointer", background: tab===t.v ? C.card : "transparent", color: tab===t.v ? "#fff" : C.muted, fontFamily:"'Outfit',sans-serif", boxShadow: tab===t.v ? "0 1px 4px rgba(0,0,0,0.3)" : "none", transition:"all 0.15s" }}>{t.l}</button>
            ))}
          </div>

          {tab === "faq" && (
            <div style={{ animation:"fadeIn 0.25s ease" }}>
              <div className="faq-search-row" style={{ display:"flex", gap:10, alignItems:"center", marginBottom:16 }}>
                <div style={{ position:"relative", flex:1 }}>
                  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth={2} strokeLinecap="round" style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }}>
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input value={search} onChange={e => setSearch(e.target.value)} className="search-input" placeholder="Search questions..." style={{ width:"100%", background:C.card, border: `1px solid ${C.border2}`, borderRadius:9, padding:"9px 14px 9px 34px", color:"#fff", fontSize:13, fontFamily:"'Outfit',sans-serif" }}/>
                </div>
                <div className="faq-cats-row" style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:2 }}>
                  {CATS.map(c => (
                    <button key={c} onClick={() => setCat(c)} style={{ padding:"7px 12px", borderRadius:100, fontSize:11, fontWeight:500, cursor:"pointer", background: cat===c ? "rgba(14,203,129,0.1)" : "transparent", border: `1px solid ${cat===c ? "rgba(14,203,129,0.3)" : C.border2}`, color: cat===c ? C.green : C.muted, fontFamily:"'Outfit',sans-serif", transition:"all 0.15s", whiteSpace:"nowrap" }}>{c}</button>
                  ))}
                </div>
              </div>

              <div style={{ background:C.card, border: `1px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
                {filtered.length === 0 ? (
                  <div style={{ padding:"48px 20px", textAlign:"center" }}>
                    <div style={{ display:"flex", justifyContent:"center", marginBottom:10 }}>
                      <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                    </div>
                    <div style={{ fontSize:14, color:C.muted }}>No questions match your search</div>
                  </div>
                ) : filtered.map((f, i) => (
                  <FaqItem key={f.id} item={f} delay={i * 0.04}/>
                ))}
              </div>

              <div style={{ marginTop:16, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px", background:C.card, border: `1px solid ${C.border}`, borderRadius:12 }}>
                <div style={{ fontSize:13, color:C.muted }}>Didn't find your answer?</div>
                <button onClick={() => setTab("ticket")} style={{ background:"none", border:"none", color:C.green, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'Outfit',sans-serif" }}>Submit a ticket →</button>
              </div>
            </div>
          )}

          {tab === "ticket" && (
            <div style={{ background:C.card, border: `1px solid ${C.border}`, borderRadius:14, overflow:"hidden", animation:"fadeIn 0.25s ease" }}>
              <div style={{ padding:"16px 20px", borderBottom: `1px solid ${C.border}`, display:"flex", alignItems:"center", gap:8 }}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth={2} strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                <span style={{ fontSize:13, fontWeight:600 }}>New Support Ticket</span>
                <span style={{ fontSize:11, color:C.muted, marginLeft:4 }}>· We'll reply to your email within 2 hours</span>
              </div>
              <TicketForm/>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
