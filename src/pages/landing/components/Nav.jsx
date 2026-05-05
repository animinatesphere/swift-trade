import { useState, useEffect } from "react";
import { C } from "../constants";
import { Logo } from "./Logo";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navStyle = {
    position:"fixed", top:0, left:0, right:0, zIndex:100,
    display:"flex", alignItems:"center", justifyContent:"space-between",
    padding:"0 64px", height:72,
    borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
    background: scrolled ? "rgba(8,8,8,0.88)" : "transparent",
    backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
    transition:"all 0.4s",
  };

  return (
    <nav style={navStyle}>
      <Logo />
      <ul style={{ display:"flex", gap:36, listStyle:"none" }}>
        {["Exchange","Gift Cards","Rates","About"].map(l => (
          <li key={l}>
            <a href="#" className="nav-link-item"
              style={{ color:C.muted, fontSize:14, letterSpacing:"0.3px", transition:"color 0.2s" }}>
              {l}
            </a>
          </li>
        ))}
      </ul>
      <button className="nav-cta"
        style={{ background:C.green, color:"#000", fontFamily:"'Outfit',sans-serif", fontWeight:600,
          fontSize:13, padding:"10px 24px", borderRadius:8, border:"none", letterSpacing:"0.5px", transition:"all 0.2s" }}>
        Get Started
      </button>
    </nav>
  );
}
