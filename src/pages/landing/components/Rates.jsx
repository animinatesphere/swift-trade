import { C } from "../constants";
import { FadeIn } from "./FadeIn";
import { Eyebrow } from "./Eyebrow";

const RATES = [
  { icon:"₿", bg:"rgba(247,147,26,0.15)", color:"#F7931A", name:"Bitcoin",  ticker:"BTC/NGN",  price:"₦98,240,000", sub:"Per 1 BTC",  change:"+2.4%", up:true  },
  { icon:"Ξ", bg:"rgba(98,126,234,0.15)",  color:"#627EEA", name:"Ethereum", ticker:"ETH/NGN",  price:"₦3,420,000",  sub:"Per 1 ETH",  change:"+1.8%", up:true  },
  { icon:"₮", bg:"rgba(38,161,123,0.15)",  color:"#26A17B", name:"Tether",   ticker:"USDT/NGN", price:"₦1,592",      sub:"Per 1 USDT", change:"-0.3%", up:false },
  { icon:"◎", bg:"rgba(0,114,255,0.15)",   color:"#0072FF", name:"USD Coin", ticker:"USDC/NGN", price:"₦1,590",      sub:"Per 1 USDC", change:"+0.1%", up:true  },
];

export function Rates() {
  return (
    <section style={{ padding:"120px 64px", background:C.bg }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:48 }}>
        <div>
          <Eyebrow>Live Rates</Eyebrow>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(40px,5vw,64px)", lineHeight:1, letterSpacing:1 }}>
            TODAY'S<br />EXCHANGE RATES
          </h2>
        </div>
        <p style={{ color:C.muted, fontSize:16, fontWeight:300, lineHeight:1.7, maxWidth:320, textAlign:"right" }}>
          Rates update every 60 seconds. Lock in your rate before it expires.
        </p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1,
        background:C.border, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
        {RATES.map((r, i) => (
          <FadeIn key={r.ticker} delay={i * 0.1}>
            <div className="rate-card" style={{ background:C.card, padding:"32px 28px", transition:"background 0.2s", height:"100%" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:12, fontWeight:700, background:r.bg, color:r.color }}>
                    {r.icon}
                  </div>
                  <div>
                    <div style={{ fontSize:15, fontWeight:600 }}>{r.name}</div>
                    <div style={{ fontSize:11, color:C.muted }}>{r.ticker}</div>
                  </div>
                </div>
                <span style={{ fontSize:10, padding:"4px 8px", borderRadius:100, fontWeight:500,
                  background: r.up ? "rgba(14,203,129,0.1)" : "rgba(246,70,93,0.1)",
                  color: r.up ? C.green : C.red }}>
                  {r.change}
                </span>
              </div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:22, marginBottom:6 }}>{r.price}</div>
              <div style={{ fontSize:12, color:C.muted }}>{r.sub}</div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
