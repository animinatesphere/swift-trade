import { C } from "../constants";
import { Logo } from "./Logo";

const FOOTER_LINKS = {
  Products: ["Crypto Exchange","Crypto Conversion","Gift Cards","Live Rates"],
  Company:  ["About Us","Careers","Blog","Contact"],
  Legal:    ["Privacy Policy","Terms of Service","AML Policy","Cookie Policy"],
};

export function Footer() {
  return (
    <footer style={{ background:C.surface, borderTop:`1px solid ${C.border}`, padding:"72px 64px 40px" }}>
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:64, marginBottom:64 }}>
        <div>
          <Logo size={36} />
          <p style={{ color:C.muted, fontSize:14, lineHeight:1.7, fontWeight:300, marginTop:16, maxWidth:280 }}>
            Nigeria's fastest crypto exchange and gift card platform. Convert digital assets to naira, instantly.
          </p>
        </div>
        {Object.entries(FOOTER_LINKS).map(([col, links]) => (
          <div key={col}>
            <h5 style={{ fontSize:12, letterSpacing:3, color:C.muted, textTransform:"uppercase",
              marginBottom:20, fontWeight:500 }}>{col}</h5>
            <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:12 }}>
              {links.map(l => (
                <li key={l}>
                  <a href="#" className="footer-link-item"
                    style={{ color:"#444", fontSize:14, transition:"color 0.2s" }}>{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
        paddingTop:32, borderTop:`1px solid ${C.border}` }}>
        <p style={{ color:C.muted2, fontSize:12 }}>© 2025 Swift Trade. All rights reserved.</p>
        <div style={{ display:"flex", gap:24 }}>
          {["Twitter","Instagram","WhatsApp"].map(s => (
            <a key={s} href="#" className="footer-bottom-link"
              style={{ color:C.muted2, fontSize:12, transition:"color 0.2s" }}>{s}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
