import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const C = {
  green: "#0ECB81",
  amber: "#F5A623",
  bg: "#080808",
  border: "#1a1a1a",
  muted: "#666666",
  text: "#ffffff",
};

const LogoMark = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={{ display: "block" }}>
    <path d="M 32,52 C 26,40 16,24 8,8" stroke={C.green} strokeWidth="3.8" strokeLinecap="round" fill="none" />
    <path d="M 32,52 C 38,40 48,24 56,8" stroke={C.amber} strokeWidth="3.8" strokeLinecap="round" fill="none" />
    <circle cx="32" cy="52" r="3.5" fill="white" />
  </svg>
);

export const Logo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <LogoMark size={36} />
    <div>
      <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: "#fff", letterSpacing: 2, lineHeight: 1 }}>SWIFT</div>
      <div style={{ fontSize: 7, color: C.amber, letterSpacing: 5, marginTop: 1 }}>TRADE</div>
    </div>
  </div>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const location = useLocation();

  const isMobile = width < 1024;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navLinks = [
    { label: "Exchange", path: "/exchange" },
    { label: "Gift Cards", path: "/gift-cards" },
    { label: "Rates", path: "/rates" },
    { label: "About", path: "/about" },
  ];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isMobile ? "0 20px" : "0 48px", height: 68,
        background: scrolled || menuOpen ? "rgba(8,8,8,0.95)" : "transparent",
        borderBottom: (scrolled || menuOpen) ? `1px solid ${C.border}` : "1px solid transparent",
        backdropFilter: scrolled || menuOpen ? "blur(20px)" : "none",
        transition: "all 0.3s",
      }}>
        <Link to="/" onClick={() => setMenuOpen(false)}><Logo /></Link>

        {isMobile ? (
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            background: "none", border: "none", color: "#fff", fontSize: 24, cursor: "pointer"
          }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <ul style={{ display: "flex", gap: 32, listStyle: "none" }}>
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} style={{
                    color: location.pathname === link.path ? C.green : C.muted,
                    fontSize: 13, letterSpacing: "0.3px", transition: "color 0.2s",
                    borderBottom: location.pathname === link.path ? `1px solid ${C.green}` : "none",
                    paddingBottom: location.pathname === link.path ? 2 : 0,
                    textDecoration: "none"
                  }}>{link.label}</Link>
                </li>
              ))}
            </ul>
            <Link to="/login" className="nav-cta" style={{
              background: C.green, color: "#000", fontWeight: 600, fontSize: 13,
              padding: "9px 22px", borderRadius: 8, border: "none", transition: "all 0.2s",
              textDecoration: "none"
            }}>Get Started</Link>
          </div>
        )}

        {/* Mobile Menu Overlay */}
        {isMobile && menuOpen && (
          <div style={{
            position: "absolute", top: 68, left: 0, right: 0, height: "100vh",
            background: "#080808", display: "flex", flexDirection: "column", padding: 40, gap: 24,
            animation: "fadeIn 0.3s ease"
          }}>
            {navLinks.map((link) => (
              <Link key={link.label} to={link.path} onClick={() => setMenuOpen(false)} style={{
                color: location.pathname === link.path ? C.green : "#fff",
                textDecoration: "none", fontSize: 24, fontWeight: 600, fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: 2
              }}>{link.label.toUpperCase()}</Link>
            ))}
            <Link to="/login" onClick={() => setMenuOpen(false)} style={{
              background: C.green, color: "#000", border: "none", padding: "16px",
              borderRadius: 8, fontWeight: 600, fontSize: 18, marginTop: 20,
              textDecoration: "none", textAlign: "center"
            }}>GET STARTED</Link>
          </div>
        )}
      </nav>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  );
}
