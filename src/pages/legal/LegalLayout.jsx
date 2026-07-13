import { useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const C = {
  green: "#0ECB81",
  amber: "#F5A623",
  bg: "#080808",
  surface: "#0c0c0c",
  card: "#101010",
  border: "#1a1a1a",
  text: "#ffffff",
  muted: "#888888",
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  body { background:#080808; color:#fff; font-family: 'Outfit', sans-serif; }

  @media (max-width: 768px) {
    .legal-hero { padding: 120px 20px 40px !important; }
    .legal-body { padding: 0 20px 80px !important; }
    .legal-hero h1 { font-size: clamp(32px, 8vw, 48px) !important; }
  }
`;

export default function LegalLayout({ eyebrow, title, updated, children }) {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh" }}>
      <Navbar />
      <div
        className="legal-hero"
        style={{
          padding: "160px 64px 48px",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            color: C.green,
            letterSpacing: 4,
            fontSize: 12,
            fontWeight: 600,
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          {eyebrow}
        </div>
        <h1
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: "clamp(40px,6vw,72px)",
            letterSpacing: 1,
            lineHeight: 1,
            marginBottom: 12,
          }}
        >
          {title}
        </h1>
        {updated && (
          <div style={{ color: C.muted, fontSize: 13 }}>
            Last updated: {updated}
          </div>
        )}
      </div>

      <div
        className="legal-body"
        style={{
          maxWidth: 820,
          margin: "0 auto",
          padding: "64px 64px 120px",
          lineHeight: 1.8,
          color: "#ccc",
          fontSize: 15,
        }}
      >
        {children}
      </div>

      <Footer />
    </div>
  );
}

export function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2
        style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 26,
          letterSpacing: 0.5,
          color: C.text,
          marginBottom: 14,
        }}
      >
        {title}
      </h2>
      <div style={{ color: C.muted, fontSize: 15, lineHeight: 1.85 }}>
        {children}
      </div>
    </section>
  );
}

export function List({ items }) {
  return (
    <ul style={{ margin: "12px 0 0", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item, i) => (
        <li key={i} style={{ color: C.muted, fontSize: 15, lineHeight: 1.7 }}>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function InfoBox({ children }) {
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderLeft: `3px solid ${C.amber}`,
        borderRadius: 10,
        padding: "16px 20px",
        margin: "20px 0",
        color: "#ddd",
        fontSize: 14,
        lineHeight: 1.7,
      }}
    >
      {children}
    </div>
  );
}
