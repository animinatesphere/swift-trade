import { C } from "../constants";
import { FadeIn } from "./FadeIn";

const STATS = [
  { num:"₦12B+",  label:"Total volume traded"    },
  { num:"50K+",   label:"Active users"            },
  { num:"99.9%",  label:"Uptime guaranteed"       },
  { num:"2min",   label:"Avg. withdrawal time"    },
];

export function Stats() {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1,
      background:C.border, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
      {STATS.map((s, i) => (
        <FadeIn key={s.label} delay={i * 0.1}>
          <div className="stat-item" style={{ background:C.bg, padding:"64px 40px", transition:"background 0.3s" }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:52, color:C.green,
              letterSpacing:1, lineHeight:1, marginBottom:8 }}>
              {s.num}
            </div>
            <div style={{ color:C.muted, fontSize:14 }}>{s.label}</div>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}
