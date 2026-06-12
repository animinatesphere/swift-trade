import { C } from "../constants";
import logoImg from "../../../assets/logo.png";

export function LogoMark({ size = 40 }) {
  return (
    <img src={logoImg} alt="Swift Trade Logo" style={{ width: size, height: size, display: "block", objectFit: "contain" }} />
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
