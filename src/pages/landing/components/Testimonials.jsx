import { C } from "../constants";
import { FadeIn } from "./FadeIn";
import { Eyebrow } from "./Eyebrow";

const TESTIMONIALS = [
  { initials:"AO", name:"Adebayo Okafor",  loc:"Lagos, Nigeria",         text:`"I sold 200 USDT and had the naira in my GTBank account in under 10 minutes. Fastest I've ever experienced on any platform."` },
  { initials:"CN", name:"Chioma Nwosu",    loc:"Abuja, Nigeria",          text:`"The gift card rates are the best I've seen anywhere online. My Amazon card was processed in minutes and money was in my account same day."` },
  { initials:"EI", name:"Emeka Ike",       loc:"Port Harcourt, Nigeria",  text:`"Very transparent rates. No surprises. You see what you get before you confirm, and that's exactly what hits your account. Finally an honest platform."` },
];

export function Testimonials() {
  return (
    <section style={{ padding:"120px 64px", background:C.bg }}>
      <Eyebrow>Testimonials</Eyebrow>
      <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(40px,5vw,64px)", lineHeight:1, letterSpacing:1 }}>
        NIGERIANS LOVE<br />SWIFT TRADE
      </h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginTop:60 }}>
        {TESTIMONIALS.map((t, i) => (
          <FadeIn key={t.name} delay={i * 0.1}>
            <div className="testi-card" style={{ background:C.card, border:`1px solid ${C.border}`,
              borderRadius:14, padding:"32px 28px", transition:"border-color 0.3s,transform 0.3s", height:"100%" }}>
              <div style={{ color:C.amber, display:"flex", gap:2, marginBottom:16 }}>
                {[...Array(5)].map((_, idx) => (
                  <svg key={idx} width={14} height={14} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                ))}
              </div>
              <p style={{ fontSize:15, lineHeight:1.7, color:"#bbb", fontWeight:300, marginBottom:24 }}>{t.text}</p>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:38, height:38, borderRadius:"50%", display:"flex", alignItems:"center",
                  justifyContent:"center", fontSize:14, fontWeight:600, background:C.border2, color:C.muted }}>
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontSize:14, fontWeight:500 }}>{t.name}</div>
                  <div style={{ fontSize:12, color:C.muted }}>{t.loc}</div>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
