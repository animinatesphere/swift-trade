import { C } from "../constants";
import { FadeIn } from "./FadeIn";
import { Eyebrow } from "./Eyebrow";

const GC_CARDS = [
  { label:"Amazon",     color:"#FF9900", bg:"linear-gradient(135deg,#1a0a00,#2d1500)", amount:"$100", rate:"≈ ₦140,000 · Rate: 1,400/USD" },
  { label:"Steam",      color:"#66C0F4", bg:"linear-gradient(135deg,#001a2d,#00264d)", amount:"$50",  rate:"≈ ₦66,500 · Rate: 1,330/USD"  },
  { label:"iTunes",     color:"#FC3C44", bg:"linear-gradient(135deg,#1a001a,#2d002d)", amount:"$25",  rate:"≈ ₦33,750 · Rate: 1,350/USD"  },
  { label:"Google Play",color:"#0ECB81", bg:"linear-gradient(135deg,#001a00,#002d00)", amount:"$50",  rate:"≈ ₦68,500 · Rate: 1,370/USD"  },
];

export function GiftCards() {
  return (
    <section style={{ padding:"120px 64px", background:C.surface, overflow:"hidden" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }}>
        <div>
          <Eyebrow>Gift Cards</Eyebrow>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(40px,5vw,64px)",
            lineHeight:1, letterSpacing:1, marginBottom:20 }}>
            SELL YOUR<br />GIFT CARDS<br />
            <span style={{ color:C.amber }}>FOR NAIRA</span>
          </h2>
          <p style={{ color:C.muted, fontSize:16, fontWeight:300, lineHeight:1.7, maxWidth:420, marginBottom:32 }}>
            Got unused Amazon, Steam, iTunes or Google Play cards? Convert them to cash in minutes. Best rates, instant payment.
          </p>
          <button className="btn-primary" style={{ background:C.green, color:"#000",
            fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:15,
            padding:"14px 32px", borderRadius:10, border:"none", transition:"all 0.2s" }}>
            Check Gift Card Rates →
          </button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {GC_CARDS.map((gc, i) => (
            <FadeIn key={gc.label} delay={i * 0.1}>
              <div className="gc-card" style={{ borderRadius:16, padding:"28px 24px",
                position:"relative", overflow:"hidden", border:`1px solid ${C.border2}`,
                background:gc.bg, transition:"transform 0.3s,box-shadow 0.3s" }}>
                <div style={{ position:"absolute", top:"-50%", right:"-20%", width:"80%", height:"200%",
                  background:"linear-gradient(135deg,transparent 30%,rgba(255,255,255,0.04) 50%,transparent 70%)",
                  transform:"rotate(-20deg)" }} />
                <div style={{ fontSize:12, fontWeight:600, letterSpacing:2, textTransform:"uppercase",
                  marginBottom:20, opacity:0.7, color:gc.color }}>{gc.label}</div>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:32, letterSpacing:1 }}>{gc.amount}</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:4 }}>{gc.rate}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
