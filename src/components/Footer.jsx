import { Link } from "react-router-dom";
import { Logo } from "./Navbar";

const C = {
  green: "#0ECB81",
  bg: "#080808",
  surface: "#0c0c0c",
  border: "#1a1a1a",
  muted: "#888888",
  muted2: "#444444",
};

const FOOTER_LINKS = {
  Products: [
    { label: "Crypto Exchange", to: "/exchange" },
    { label: "Gift Cards", to: "/gift-cards" },
  ],
  Company: [
    { label: "About Us", to: "/about" },
    { label: "Contact", to: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", to: "/privacy-policy" },
    { label: "Terms of Service", to: "/terms-of-service" },
    { label: "AML Policy", to: "/aml-policy" },
    { label: "Cookie Policy", to: "/cookie-policy" },
  ],
};

export default function Footer() {
  return (
    <footer
      className="site-footer"
      style={{
        padding: "80px 64px 40px",
        background: C.surface,
        borderTop: `1px solid ${C.border}`,
      }}
    >
      <div
        className="site-footer-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 48,
          marginBottom: 64,
        }}
      >
        <div>
          <Logo />
          <p
            style={{
              color: C.muted,
              marginTop: 20,
              maxWidth: 280,
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            Nigeria's fastest crypto exchange and gift card platform. Convert
            digital assets to naira instantly.
          </p>
        </div>
        {Object.entries(FOOTER_LINKS).map(([title, links]) => (
          <div key={title}>
            <h5
              style={{
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 20,
              }}
            >
              {title}
            </h5>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {links.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  style={{
                    color: C.muted,
                    fontSize: 13,
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#fff")}
                  onMouseLeave={(e) => (e.target.style.color = C.muted)}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div
        className="site-footer-bottom"
        style={{
          paddingTop: 32,
          borderTop: `1px solid ${C.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <div style={{ color: C.muted2, fontSize: 11 }}>
          © 2026 Swift Trade. All rights reserved.
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Twitter", "Instagram", "WhatsApp"].map((social) => (
            <a
              key={social}
              href="#"
              style={{
                color: C.muted2,
                fontSize: 11,
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#fff")}
              onMouseLeave={(e) => (e.target.style.color = C.muted2)}
            >
              {social}
            </a>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 1024px) {
          .site-footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .site-footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .site-footer-bottom { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>
    </footer>
  );
}
