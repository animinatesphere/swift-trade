import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const C = {
  green: "#0ECB81",
  amber: "#F5A623",
  bg: "#080808",
  surface: "#0c0c0c",
  card: "#101010",
  border: "#1a1a1a",
  border2: "#222222",
  text: "#ffffff",
  muted: "#888888",
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  body { background:#080808; color:#fff; font-family: 'Outfit', sans-serif; }

  .contact-input { transition: border-color 0.2s; }
  .contact-input:focus { border-color: rgba(14,203,129,0.5) !important; outline: none; }
  .contact-submit:hover:not(:disabled) { background:#0fdf8e !important; }

  @media (max-width: 900px) {
    .contact-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
  }
  @media (max-width: 768px) {
    .contact-hero { padding: 120px 20px 40px !important; }
    .contact-body { padding: 0 20px 80px !important; }
  }
`;

const CHANNELS = [
  {
    title: "Email Support",
    value: "support@swifttrade.ng",
    desc: "For account, KYC, and transaction questions.",
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 6l-10 7L2 6" />
      </svg>
    ),
  },
  {
    title: "WhatsApp",
    value: "+234 800 000 0000",
    desc: "Chat with our support team in real time.",
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .92h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.59a16 16 0 006.5 6.5l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
  },
  {
    title: "Head Office",
    value: "Lagos, Nigeria",
    desc: "Our team is based in Lagos and works remote-first.",
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh" }}>
      <Navbar />

      <div
        className="contact-hero"
        style={{ padding: "160px 64px 48px", borderBottom: `1px solid ${C.border}` }}
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
          Contact
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
          GET IN TOUCH
        </h1>
        <p style={{ color: C.muted, fontSize: 15, maxWidth: 480 }}>
          Questions about a trade, your account, or a partnership? We'd love
          to hear from you.
        </p>
      </div>

      <div
        className="contact-body"
        style={{ maxWidth: 1080, margin: "0 auto", padding: "64px 64px 120px" }}
      >
        <div
          className="contact-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 64 }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {CHANNELS.map((c) => (
              <div
                key={c.title}
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 14,
                  padding: "22px 24px",
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "rgba(14,203,129,0.08)",
                    border: "1px solid rgba(14,203,129,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {c.icon}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                    {c.title}
                  </div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: C.green, marginBottom: 4 }}>
                    {c.value}
                  </div>
                  <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
                    {c.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              padding: 32,
            }}
          >
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "rgba(14,203,129,0.1)",
                    border: `2px solid ${C.green}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    fontSize: 28,
                    color: C.green,
                  }}
                >
                  ✓
                </div>
                <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 26, marginBottom: 8 }}>
                  MESSAGE SENT
                </h3>
                <p style={{ color: C.muted, fontSize: 14 }}>
                  Thanks for reaching out — our team will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: "block", fontSize: 11, color: C.muted, letterSpacing: 2, marginBottom: 8 }}>
                    NAME
                  </label>
                  <input
                    required
                    className="contact-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    style={{
                      width: "100%",
                      background: "#0a0a0a",
                      border: `1px solid ${C.border2}`,
                      borderRadius: 10,
                      padding: "12px 14px",
                      color: "#fff",
                      fontSize: 14,
                    }}
                  />
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: "block", fontSize: 11, color: C.muted, letterSpacing: 2, marginBottom: 8 }}>
                    EMAIL
                  </label>
                  <input
                    required
                    type="email"
                    className="contact-input"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    style={{
                      width: "100%",
                      background: "#0a0a0a",
                      border: `1px solid ${C.border2}`,
                      borderRadius: 10,
                      padding: "12px 14px",
                      color: "#fff",
                      fontSize: 14,
                    }}
                  />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontSize: 11, color: C.muted, letterSpacing: 2, marginBottom: 8 }}>
                    MESSAGE
                  </label>
                  <textarea
                    required
                    rows={5}
                    className="contact-input"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="How can we help?"
                    style={{
                      width: "100%",
                      background: "#0a0a0a",
                      border: `1px solid ${C.border2}`,
                      borderRadius: 10,
                      padding: "12px 14px",
                      color: "#fff",
                      fontSize: 14,
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="contact-submit"
                  style={{
                    width: "100%",
                    background: C.green,
                    color: "#000",
                    fontWeight: 700,
                    fontSize: 14,
                    padding: "14px",
                    borderRadius: 10,
                    border: "none",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                >
                  Send Message →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
