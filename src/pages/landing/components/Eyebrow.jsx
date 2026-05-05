import { C } from "../constants";

export function Eyebrow({ children }) {
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:10,
      color:C.green, fontSize:11, letterSpacing:4, textTransform:"uppercase",
      fontWeight:500, marginBottom:20 }}>
      <span style={{ display:"block", width:24, height:1, background:C.green }} />
      {children}
    </div>
  );
}
