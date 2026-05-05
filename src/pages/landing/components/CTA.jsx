import { C } from "../constants";

export function CTA() {
  return (
    <section style={{ padding:"120px 64px", textAlign:"center", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", left:"50%", top:"50%", transform:"translate(-50%,-50%)",
        width:600, height:400, background:"radial-gradient(ellipse,rgba(14,203,129,0.08) 0%,transparent 70%)",
        pointerEvents:"none" }} />
      <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(48px,6vw,88px)",
        letterSpacing:2, lineHeight:0.95, marginBottom:24, position:"relative" }}>
        READY TO TRADE<br />
        <span style={{ color:C.green }}>FASTER?</span>
      </h2>
      <p style={{ color:C.muted, fontSize:17, fontWeight:300, marginBottom:48,
        maxWidth:480, marginLeft:"auto", marginRight:"auto", lineHeight:1.7 }}>
        Join 50,000 Nigerians already using Swift Trade for crypto exchange and gift card conversion.
      </p>
      <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
        <button className="btn-lg-primary" style={{ background:C.green, color:"#000",
          fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:16,
          padding:"16px 40px", borderRadius:12, border:"none", transition:"all 0.2s" }}>
          Create Free Account
        </button>
        <button className="btn-lg-outline" style={{ background:"transparent", color:"#fff",
          fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:16,
          padding:"16px 40px", borderRadius:12, border:`1px solid ${C.border2}`, transition:"all 0.2s" }}>
          Download the App
        </button>
      </div>
    </section>
  );
}
