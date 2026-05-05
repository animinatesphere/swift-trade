import { C } from "../constants";
import { FadeIn } from "./FadeIn";
import { Eyebrow } from "./Eyebrow";
import { PhoneMockup } from "./PhoneMockup";

const STEPS = [
  { n:"01", title:"Create your account",     desc:"Sign up in under 2 minutes. Verify your identity and get your personal crypto wallet generated instantly." },
  { n:"02", title:"Deposit or send crypto",  desc:"Send crypto to your unique Swift Trade wallet address. We support BTC, ETH, USDT (TRC20 & ERC20) and more." },
  { n:"03", title:"Convert to Naira",        desc:"Lock in a live rate and convert your crypto to NGN balance. Rate expires in 60 seconds so you always get a fair price." },
  { n:"04", title:"Withdraw to your bank",   desc:"Send your naira balance to any Nigerian bank account. Most withdrawals land within minutes." },
];

export function HowItWorks() {
  return (
    <section style={{ padding:"120px 64px", background:C.surface }}>
      <Eyebrow>How It Works</Eyebrow>
      <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(40px,5vw,64px)",
        lineHeight:1, letterSpacing:1, marginBottom:0 }}>
        FROM CRYPTO<br />TO CASH IN MINUTES
      </h2>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center", marginTop:72 }}>
        <div>
          {STEPS.map((s, i) => (
            <FadeIn key={s.n} delay={i * 0.1}>
              <div className="how-step" style={{ display:"flex", gap:24, padding:"28px 0",
                borderBottom: i < STEPS.length-1 ? `1px solid ${C.border}` : "none" }}>
                <div className="step-num-box" style={{ width:40, height:40, minWidth:40,
                  borderRadius:10, border:`1px solid ${C.border2}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontFamily:"'DM Mono',monospace", fontSize:13, color:C.muted,
                  transition:"all 0.3s", marginTop:2 }}>
                  {s.n}
                </div>
                <div>
                  <h4 style={{ fontSize:17, fontWeight:600, marginBottom:8 }}>{s.title}</h4>
                  <p style={{ color:C.muted, fontSize:14, lineHeight:1.6, fontWeight:300 }}>{s.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={0.2}><PhoneMockup /></FadeIn>
      </div>
    </section>
  );
}
