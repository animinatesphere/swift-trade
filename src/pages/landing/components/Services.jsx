import { C } from "../constants";
import { FadeIn } from "./FadeIn";
import { Link } from "react-router-dom";
import { Eyebrow } from "./Eyebrow";

const SERVICES = [
  { icon:<svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 9h-5M15.5 15h-6M10 6v2M14 6v2M10 16v2M14 16v2M9.5 9h2a2 2 0 0 1 0 4h-2M10 13h2.5a2.5 2.5 0 0 1 0 5H10"/></svg>, iconClass:"green", title:"Crypto Exchange",
    desc:"Buy and sell Bitcoin, USDT, Ethereum, and 15+ other cryptocurrencies at the best market rates with zero hidden fees.",
    link:"Start trading" },
  { icon:<svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>, iconClass:"amber", title:"Crypto Conversion",
    desc:"Convert any crypto asset directly to Nigerian Naira and receive funds in your bank account within minutes.",
    link:"Convert now" },
  { icon:<svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5" rx="1"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>, iconClass:"red", title:"Gift Card Exchange",
    desc:"Trade Amazon, iTunes, Steam, Google Play and more gift cards for naira. Instant quotes, fast payouts.",
    link:"Sell gift cards" },
];

const ICON_COLORS = {
  green: { bg:"rgba(14,203,129,0.1)", border:"rgba(14,203,129,0.2)" },
  amber: { bg:"rgba(245,166,35,0.1)", border:"rgba(245,166,35,0.2)" },
  red:   { bg:"rgba(246,70,93,0.1)",  border:"rgba(246,70,93,0.2)"  },
};

export function Services() {
  return (
    <section style={{ padding:"120px 64px", background:C.bg }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:64 }}>
        <div>
          <Eyebrow>What We Do</Eyebrow>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(40px,5vw,64px)",
            lineHeight:1, letterSpacing:1 }}>
            EVERYTHING YOU<br />NEED TO TRADE
          </h2>
        </div>
        <p style={{ color:C.muted, fontSize:16, fontWeight:300, lineHeight:1.7, maxWidth:400, textAlign:"right" }}>
          Three powerful services, one seamless platform built for Nigerians.
        </p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1,
        background:C.border, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden" }}>
        {SERVICES.map((s, i) => (
          <FadeIn key={s.title} delay={i * 0.1}>
            <div className="service-card" style={{ background:C.card, padding:"48px 40px",
              position:"relative", overflow:"hidden", transition:"background 0.3s", height:"100%" }}>
              <div className="svc-bottom-line" style={{ position:"absolute", bottom:0, left:0, right:0, height:2,
                background:`linear-gradient(90deg,transparent,${C.green},transparent)`,
                opacity:0, transition:"opacity 0.3s" }} />
              <div style={{ width:52, height:52, borderRadius:14, display:"flex", alignItems:"center",
                justifyContent:"center", marginBottom:28,
                background:ICON_COLORS[s.iconClass].bg, border:`1px solid ${ICON_COLORS[s.iconClass].border}`,
                color:C[s.iconClass] }}>
                {s.icon}
              </div>
              <h3 style={{ fontSize:20, fontWeight:600, marginBottom:14, letterSpacing:"-0.2px" }}>{s.title}</h3>
              <p style={{ color:C.muted, fontSize:14, lineHeight:1.7, fontWeight:300, marginBottom:32 }}>{s.desc}</p>
              <Link to={s.title === "Gift Card Exchange" ? "/gift-cards" : "/register"} style={{ display:"inline-flex", alignItems:"center", gap:8,
                color:C.green, fontSize:13, fontWeight:500, letterSpacing:"0.3px", transition:"gap 0.2s", textDecoration:"none" }}>
                {s.link} <span className="svc-link-arrow" style={{ marginLeft:0, transition:"margin 0.2s" }}>→</span>
              </Link>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
