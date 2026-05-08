import { C } from "../constants";
import { Ticker } from "./Ticker";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section style={{ minHeight:"100vh", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", position:"relative",
      overflow:"hidden", padding:"120px 64px 80px", textAlign:"center" }}>

      {/* Grid */}
      <div style={{ position:"absolute", inset:0,
        backgroundImage:`linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`,
        backgroundSize:"60px 60px", opacity:0.35,
        WebkitMaskImage:"radial-gradient(ellipse 80% 80% at 50% 50%,black 30%,transparent 80%)" }} />

      {/* Orbs */}
      <div className="orb-1" style={{ position:"absolute", borderRadius:"50%", pointerEvents:"none",
        filter:"blur(80px)", width:500, height:500,
        background:"radial-gradient(circle,rgba(14,203,129,0.12),transparent 60%)", top:-100, left:-100 }} />
      <div className="orb-2" style={{ position:"absolute", borderRadius:"50%", pointerEvents:"none",
        filter:"blur(80px)", width:400, height:400,
        background:"radial-gradient(circle,rgba(245,166,35,0.1),transparent 60%)", top:-50, right:-80 }} />
      <div className="orb-3" style={{ position:"absolute", borderRadius:"50%", pointerEvents:"none",
        filter:"blur(80px)", width:600, height:600,
        background:"radial-gradient(circle,rgba(14,203,129,0.06),transparent 60%)", bottom:-200, left:"50%" }} />

      {/* Badge */}
      <div className="hero-badge" style={{ display:"inline-flex", alignItems:"center", gap:8,
        background:"rgba(14,203,129,0.08)", border:"1px solid rgba(14,203,129,0.2)",
        borderRadius:100, padding:"7px 16px", fontSize:12, color:C.green,
        letterSpacing:1, marginBottom:32 }}>
        <span style={{ width:6, height:6, borderRadius:"50%", background:C.green,
          animation:"pulse 2s infinite", display:"inline-block" }} />
        Trusted by 50,000+ Nigerians
      </div>

      {/* Title */}
      <h1 className="hero-title" style={{ fontFamily:"'Bebas Neue',sans-serif",
        fontSize:"clamp(64px,8vw,120px)", lineHeight:0.92, letterSpacing:2, marginBottom:28 }}>
        TRADE CRYPTO<br />
        <span style={{ color:C.green }}>FAST.</span> GET <span style={{ color:C.amber }}>NAIRA.</span><br />
        INSTANTLY.
      </h1>

      {/* Sub */}
      <p className="hero-sub" style={{ maxWidth:560, fontSize:17, color:C.muted,
        lineHeight:1.7, fontWeight:300, marginBottom:48 }}>
        Buy, sell and convert Bitcoin, USDT, Ethereum and more — straight to your naira account.
        Plus the best rates on gift cards.
      </p>

      {/* Actions */}
      <div className="hero-actions" style={{ display:"flex", gap:16, alignItems:"center", marginBottom:72 }}>
        <Link to="/login" className="btn-primary" style={{ background:C.green, color:"#000",
          fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:15,
          padding:"14px 32px", borderRadius:10, border:"none", letterSpacing:"0.3px", transition:"all 0.2s",
          textDecoration:"none", display:"inline-block" }}>
          Start Trading →
        </Link>
        <button className="btn-secondary" style={{ background:"transparent", color:"#fff",
          fontFamily:"'Outfit',sans-serif", fontWeight:500, fontSize:15,
          padding:"14px 32px", borderRadius:10, border:`1px solid ${C.border2}`, transition:"all 0.2s" }}>
          View Live Rates
        </button>
      </div>

      <Ticker />
    </section>
  );
}
