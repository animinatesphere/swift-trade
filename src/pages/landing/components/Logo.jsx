import { C } from "../constants";

export function LogoMark({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ display: "block" }}>
      <defs>
        <filter id="lg"><feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="la"><feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <path d="M 32,52 C 26,40 16,24 8,8" stroke={C.green} strokeWidth="3.8" strokeLinecap="round" fill="none" filter="url(#lg)"/>
      <g transform="translate(8,8) rotate(-27)"><polygon points="0,-6 -3.5,3.5 3.5,3.5" fill={C.green} filter="url(#lg)"/></g>
      <path d="M 32,52 C 38,40 48,24 56,8" stroke={C.amber} strokeWidth="3.8" strokeLinecap="round" fill="none" filter="url(#la)"/>
      <g transform="translate(56,8) rotate(27)"><polygon points="0,-6 -3.5,3.5 3.5,3.5" fill={C.amber} filter="url(#la)"/></g>
      <circle cx="32" cy="52" r="3.5" fill="white"/>
    </svg>
  );
}

export function Logo({ size = 40 }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
      <LogoMark size={size} />
      <div style={{ display:"flex", flexDirection:"column" }}>
        <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, color:"#fff", letterSpacing:2, lineHeight:1 }}>SWIFT</span>
        <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:8, fontWeight:400, color:C.amber, letterSpacing:5, marginTop:2 }}>TRADE</span>
      </div>
    </div>
  );
}
