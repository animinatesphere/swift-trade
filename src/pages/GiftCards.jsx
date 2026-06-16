import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar, { Logo } from "../components/Navbar";
import heroTrader from "../assets/hero_trader.png";
import lifestyleGiftcard from "../assets/lifestyle_giftcard.png";

// ─── TOKENS ──────────────────────────────────────────────
const C = {
  green: "#0ECB81",
  amber: "#F5A623",
  red: "#F6465D",
  blue: "#3B82F6",
  bg: "#080808",
  surface: "#0c0c0c",
  card: "#101010",
  card2: "#141414",
  border: "#1a1a1a",
  border2: "#222222",
  text: "#ffffff",
  muted: "#888888",
  muted2: "#2e2e2e",
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background:#080808; color:#fff; font-family: 'Outfit', sans-serif; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background:#080808; }
  ::-webkit-scrollbar-thumb { background: #222; border-radius: 4px; }
  a { text-decoration: none; color: inherit; }
  button { cursor: pointer; font-family: 'Outfit', sans-serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:0.5; transform:scale(0.8); }
  }
  @keyframes shimmer {
    0%   { transform: translateX(-100%) rotate(-20deg); }
    100% { transform: translateX(200%) rotate(-20deg); }
  }
  @keyframes slideIn {
    from { opacity:0; transform: translateX(40px); }
    to   { opacity:1; transform: translateX(0); }
  }
  @keyframes scaleIn {
    from { opacity:0; transform: scale(0.95); }
    to   { opacity:1; transform: scale(1); }
  }
  @keyframes float {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-10px); }
  }

  .fade-in { opacity:0; transform:translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .fade-in.visible { opacity:1; transform:translateY(0); }

  .gc-sell-card:hover { border-color: #0ECB8144 !important; transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.5); }
  .gc-sell-card:hover .gc-shine { animation: shimmer 0.7s ease; }
  .gc-sell-card:hover .sell-btn-inner { background: #0fdf8e !important; }

  .category-pill:hover { border-color: #444 !important; color: #fff !important; }
  .nav-link-item:hover { color: #fff !important; }
  .nav-cta:hover { background: #0fdf8e !important; transform: translateY(-1px); }

  .step-card:hover { background: #141414 !important; border-color: rgba(14,203,129,0.2) !important; }
  .step-card:hover .step-icon-box { border-color: rgba(14,203,129,0.4) !important; background: rgba(14,203,129,0.1) !important; }

  .drawer-overlay { animation: scaleIn 0.2s ease; }
  .sell-drawer    { animation: slideIn 0.3s ease; }

  @media (max-width: 1024px) {
    .hero-grid { grid-template-columns: 1fr !important; gap: clamp(30px, 4vw, 40px) !important; }
    .hero-text { text-align: center !important; }
    .hero-text p { margin-left: auto !important; margin-right: auto !important; }
    .hero-stats { justify-content: center !important; gap: clamp(24px, 3vw, 32px) !important; }
    .hero-image { order: -1 !important; max-width: 500px !important; margin: 0 auto !important; }
    .how-it-works-grid { grid-template-columns: 1fr !important; gap: clamp(40px, 5vw, 60px) !important; }
    .footer-grid { grid-template-columns: 1fr 1fr !important; gap: clamp(30px, 4vw, 40px) !important; }
  }

  @media (max-width: 768px) {
    .section-padding { padding: clamp(40px, 6vw, 60px) clamp(16px, 3vw, 24px) !important; }
    .hero-padding { padding: clamp(60px, 8vw, 120px) clamp(16px, 3vw, 24px) clamp(40px, 6vw, 60px) !important; }
    .filters-bar { padding: clamp(12px, 2vw, 16px) clamp(14px, 2vw, 20px) !important; flex-direction: column !important; gap: clamp(12px, 2vw, 16px) !important; align-items: flex-start !important; top: 60px !important; }
    .filters-scroll { width: 100% !important; overflow-x: auto !important; padding-bottom: 8px !important; }
    .search-input { width: 100% !important; padding: clamp(10px, 2vw, 12px) clamp(12px, 2vw, 14px) !important; font-size: 16px !important; }
    .sell-drawer { width: 100% !important; padding: clamp(20px, 3vw, 24px) clamp(16px, 2vw, 20px) clamp(30px, 4vw, 40px) !important; }
    .footer-grid { grid-template-columns: 1fr !important; gap: clamp(30px, 4vw, 40px) !important; }
    .footer-bottom { flex-direction: column !important; align-items: flex-start !important; gap: clamp(16px, 2vw, 24px) !important; }
    .hero-stats { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: clamp(12px, 2vw, 20px) !important; width: 100% !important; }
    .hero-stats > div { text-align: center !important; }
  }

  @media (max-width: 480px) {
    .section-padding { padding: clamp(30px, 4vw, 40px) clamp(12px, 2vw, 16px) !important; }
    .hero-padding { padding: clamp(40px, 6vw, 60px) clamp(12px, 2vw, 16px) clamp(30px, 4vw, 40px) !important; }
    .hero-grid { gap: clamp(20px, 3vw, 30px) !important; }
    .filters-bar { padding: clamp(10px, 2vw, 14px) clamp(12px, 2vw, 14px) !important; }
    .sell-drawer { padding: clamp(16px, 2vw, 20px) !important; }
  }
`;

// ─── GIFT CARD DATA ───────────────────────────────────────
const CATEGORIES = [
  "All",
  "Amazon",
  "Steam",
  "iTunes",
  "Google Play",
  "Netflix",
  "Visa",
  "Xbox",
];

const GIFT_CARDS = [
  {
    id: 1,
    brand: "Amazon",
    category: "Amazon",
    color: "#FF9900",
    bg: "linear-gradient(135deg,#1a0800,#3d1f00)",
    denominations: ["$25", "$50", "$100", "$200"],
    rates: { $25: 34500, $50: 68000, $100: 137000, $200: 270000 },
    ratePerDollar: 1380,
    country: "USA",
    popular: true,
  },
  {
    id: 2,
    brand: "Amazon",
    category: "Amazon",
    color: "#FF9900",
    bg: "linear-gradient(135deg,#0d1a00,#1a3300)",
    denominations: ["£25", "£50", "£100"],
    rates: { "£25": 41000, "£50": 81000, "£100": 160000 },
    ratePerDollar: 1640,
    country: "UK",
    popular: false,
  },
  {
    id: 3,
    brand: "Steam",
    category: "Steam",
    color: "#66C0F4",
    bg: "linear-gradient(135deg,#00101a,#001f33)",
    denominations: ["$10", "$20", "$50", "$100"],
    rates: { $10: 13000, $20: 25500, $50: 63000, $100: 125000 },
    ratePerDollar: 1300,
    country: "USA",
    popular: true,
  },
  {
    id: 4,
    brand: "iTunes",
    category: "iTunes",
    color: "#FC3C44",
    bg: "linear-gradient(135deg,#1a0010,#330020)",
    denominations: ["$15", "$25", "$50", "$100"],
    rates: { $15: 20000, $25: 33750, $50: 67000, $100: 135000 },
    ratePerDollar: 1350,
    country: "USA",
    popular: true,
  },
  {
    id: 5,
    brand: "iTunes",
    category: "iTunes",
    color: "#FC3C44",
    bg: "linear-gradient(135deg,#100010,#200020)",
    denominations: ["£15", "£25", "£50"],
    rates: { "£15": 24000, "£25": 39000, "£50": 78000 },
    ratePerDollar: 1560,
    country: "UK",
    popular: false,
  },
  {
    id: 6,
    brand: "Google Play",
    category: "Google Play",
    color: "#0ECB81",
    bg: "linear-gradient(135deg,#001a08,#003318)",
    denominations: ["$10", "$25", "$50", "$100"],
    rates: { $10: 13700, $25: 34250, $50: 68500, $100: 137000 },
    ratePerDollar: 1370,
    country: "USA",
    popular: false,
  },
  {
    id: 7,
    brand: "Netflix",
    category: "Netflix",
    color: "#E50914",
    bg: "linear-gradient(135deg,#1a0000,#330000)",
    denominations: ["$15", "$30", "$60", "$100"],
    rates: { $15: 19500, $30: 39000, $60: 78000, $100: 130000 },
    ratePerDollar: 1300,
    country: "USA",
    popular: true,
  },
  {
    id: 8,
    brand: "Visa",
    category: "Visa",
    color: "#1A1F71",
    bg: "linear-gradient(135deg,#000818,#00102d)",
    denominations: ["$50", "$100", "$200", "$500"],
    rates: { $50: 63000, $100: 125000, $200: 248000, $500: 615000 },
    ratePerDollar: 1260,
    country: "USA",
    popular: false,
  },
  {
    id: 9,
    brand: "Xbox",
    category: "Xbox",
    color: "#107C10",
    bg: "linear-gradient(135deg,#001a00,#003300)",
    denominations: ["$10", "$25", "$50", "$100"],
    rates: { $10: 12800, $25: 31500, $50: 62500, $100: 124000 },
    ratePerDollar: 1280,
    country: "USA",
    popular: false,
  },
];

// ─── FADE IN ──────────────────────────────────────────────
function FadeIn({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("visible");
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className="fade-in"
      style={{ transitionDelay: `${delay}s`, ...style }}
    >
      {children}
    </div>
  );
}

// ─── SELL DRAWER ──────────────────────────────────────────
function SellDrawer({ card, onClose }) {
  const [step, setStep] = useState(1); // 1=select denom, 2=enter code, 3=confirm, 4=success
  const [selectedDenom, setSelectedDenom] = useState(null);
  const [code, setCode] = useState("");
  const [agreed, setAgreed] = useState(false);

  const payout = selectedDenom ? card.rates[selectedDenom] : 0;
  const fmt = (n) => "₦" + n.toLocaleString();

  return (
    <>
      <div
        className="drawer-overlay"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(4px)",
          zIndex: 200,
        }}
      />

      <div
        className="sell-drawer"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 440,
          background: C.surface,
          borderLeft: `1px solid ${C.border}`,
          zIndex: 201,
          overflowY: "auto",
          padding: "32px 32px 48px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: C.muted,
                letterSpacing: 3,
                marginBottom: 4,
              }}
            >
              SELL GIFT CARD
            </div>
            <div
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 28,
                letterSpacing: 1,
              }}
            >
              {card.brand} · {card.country}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: `1px solid ${C.border2}`,
              color: C.muted,
              width: 36,
              height: 36,
              borderRadius: 8,
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* DEMO NOTE */}
        <div
          style={{
            background: "rgba(245, 166, 35, 0.1)",
            border: `1px solid ${C.amber}33`,
            borderRadius: 12,
            padding: "16px",
            marginBottom: 32,
            fontSize: 13,
            lineHeight: 1.5,
            color: C.amber,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              marginBottom: 4,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>⚠️</span> DEMO MODE
          </div>
          This is a demonstration of the trading flow. To perform actual trades,
          you must{" "}
          <Link
            to="/login"
            style={{
              color: C.amber,
              fontWeight: 700,
              textDecoration: "underline",
            }}
          >
            sign in
          </Link>{" "}
          to your Swift Trade account.
        </div>

        {/* Steps indicator */}
        <div style={{ display: "flex", gap: 6, marginBottom: 36 }}>
          {["Amount", "Card Code", "Confirm"].map((s, i) => (
            <div key={s} style={{ flex: 1 }}>
              <div
                style={{
                  height: 3,
                  borderRadius: 2,
                  marginBottom: 6,
                  background:
                    step > i + 1
                      ? C.green
                      : step === i + 1
                        ? C.green
                        : C.border,
                  opacity: step === i + 1 ? 1 : step > i + 1 ? 0.7 : 0.3,
                }}
              />
              <div
                style={{
                  fontSize: 10,
                  color: step >= i + 1 ? C.green : C.muted,
                  letterSpacing: 1,
                }}
              >
                {s}
              </div>
            </div>
          ))}
        </div>

        {/* Step 1 — Select denomination */}
        {step === 1 && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            <div
              style={{
                fontSize: 14,
                color: C.muted,
                marginBottom: 20,
                lineHeight: 1.6,
              }}
            >
              Select the denomination of your {card.brand} gift card.
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 32,
              }}
            >
              {card.denominations.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDenom(d)}
                  style={{
                    background:
                      selectedDenom === d ? "rgba(14,203,129,0.08)" : C.card,
                    border:
                      selectedDenom === d
                        ? `1px solid ${C.green}`
                        : `1px solid ${C.border2}`,
                    borderRadius: 10,
                    padding: "16px 12px",
                    textAlign: "center",
                    color: selectedDenom === d ? C.green : "#fff",
                    transition: "all 0.2s",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Bebas Neue',sans-serif",
                      fontSize: 26,
                      letterSpacing: 1,
                    }}
                  >
                    {d}
                  </div>
                  {card.rates[d] && (
                    <div
                      style={{
                        fontSize: 11,
                        color: selectedDenom === d ? C.green : C.muted,
                        marginTop: 4,
                      }}
                    >
                      ≈ {fmt(card.rates[d])}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {selectedDenom && (
              <div
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  padding: "16px 20px",
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <span style={{ color: C.muted, fontSize: 13 }}>
                    Rate per USD
                  </span>
                  <span
                    style={{
                      fontFamily: "'DM Mono',monospace",
                      fontSize: 13,
                      color: C.green,
                    }}
                  >
                    ₦{card.ratePerDollar.toLocaleString()}
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: C.muted, fontSize: 13 }}>
                    You receive
                  </span>
                  <span
                    style={{
                      fontFamily: "'DM Mono',monospace",
                      fontSize: 15,
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  >
                    {fmt(payout)}
                  </span>
                </div>
              </div>
            )}

            <button
              disabled={!selectedDenom}
              onClick={() => setStep(2)}
              style={{
                width: "100%",
                background: selectedDenom ? C.green : C.border,
                color: selectedDenom ? "#000" : C.muted,
                fontWeight: 600,
                fontSize: 15,
                padding: "14px",
                borderRadius: 10,
                border: "none",
                transition: "all 0.2s",
              }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2 — Enter card code */}
        {step === 2 && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            <div
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: "16px 20px",
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span style={{ color: C.muted, fontSize: 12 }}>Selected</span>
                <span style={{ color: "#fff", fontSize: 12, fontWeight: 500 }}>
                  {card.brand} {selectedDenom} · {card.country}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: C.muted, fontSize: 12 }}>
                  You receive
                </span>
                <span
                  style={{
                    fontFamily: "'DM Mono',monospace",
                    fontSize: 14,
                    color: C.green,
                  }}
                >
                  {fmt(payout)}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  color: C.muted,
                  letterSpacing: 2,
                  marginBottom: 10,
                }}
              >
                GIFT CARD CODE
              </label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="XXXX-XXXX-XXXX-XXXX"
                style={{
                  width: "100%",
                  background: C.card,
                  border: `1px solid ${code.length > 10 ? C.green : C.border2}`,
                  borderRadius: 10,
                  padding: "14px 16px",
                  color: "#fff",
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 15,
                  letterSpacing: 2,
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
              />
              <div
                style={{
                  fontSize: 11,
                  color: C.muted,
                  marginTop: 8,
                  letterSpacing: 0.5,
                }}
              >
                Enter the code exactly as shown on your card. Do not include
                spaces.
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  color: C.muted,
                  letterSpacing: 2,
                  marginBottom: 10,
                }}
              >
                CARD IMAGE (optional)
              </label>
              <div
                style={{
                  border: `1px dashed ${C.border2}`,
                  borderRadius: 10,
                  padding: "24px",
                  textAlign: "center",
                  color: C.muted,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                📎 &nbsp; Tap to upload card image
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: `1px solid ${C.border2}`,
                  color: C.muted,
                  fontWeight: 500,
                  fontSize: 14,
                  padding: "13px",
                  borderRadius: 10,
                  transition: "all 0.2s",
                }}
              >
                ← Back
              </button>
              <button
                disabled={code.length < 10}
                onClick={() => setStep(3)}
                style={{
                  flex: 2,
                  background: code.length >= 10 ? C.green : C.border,
                  color: code.length >= 10 ? "#000" : C.muted,
                  fontWeight: 600,
                  fontSize: 14,
                  padding: "13px",
                  borderRadius: 10,
                  border: "none",
                  transition: "all 0.2s",
                }}
              >
                Review Trade →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Confirm */}
        {step === 3 && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            <div
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                padding: "24px",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: C.muted,
                  letterSpacing: 2,
                  marginBottom: 16,
                }}
              >
                TRADE SUMMARY
              </div>
              {[
                ["Card", `${card.brand} (${card.country})`],
                ["Amount", selectedDenom],
                ["Rate", `₦${card.ratePerDollar.toLocaleString()}/USD`],
                ["Card Code", code.slice(0, 4) + "****" + code.slice(-4)],
                ["You Receive", fmt(payout)],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <span style={{ color: C.muted, fontSize: 13 }}>{k}</span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: k === "You Receive" ? 600 : 400,
                      color: k === "You Receive" ? C.green : "#fff",
                      fontFamily:
                        k === "You Receive" || k === "Rate"
                          ? "'DM Mono',monospace"
                          : "inherit",
                    }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>

            <label
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                cursor: "pointer",
                marginBottom: 28,
                padding: 16,
                background: "rgba(14,203,129,0.04)",
                border: `1px solid ${C.border}`,
                borderRadius: 10,
              }}
            >
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                style={{
                  marginTop: 2,
                  accentColor: C.green,
                  width: 16,
                  height: 16,
                }}
              />
              <span style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
                I confirm this gift card has not been used, and I agree to Swift
                Trade's <span style={{ color: C.green }}>Terms of Service</span>
                .
              </span>
            </label>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setStep(2)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: `1px solid ${C.border2}`,
                  color: C.muted,
                  fontWeight: 500,
                  fontSize: 14,
                  padding: "13px",
                  borderRadius: 10,
                }}
              >
                ← Back
              </button>
              <button
                disabled={!agreed}
                onClick={() => setStep(4)}
                style={{
                  flex: 2,
                  background: agreed ? C.green : C.border,
                  color: agreed ? "#000" : C.muted,
                  fontWeight: 700,
                  fontSize: 14,
                  padding: "13px",
                  borderRadius: 10,
                  border: "none",
                  transition: "all 0.2s",
                }}
              >
                Confirm Trade ✓
              </button>
            </div>
          </div>
        )}

        {/* Step 4 — Success */}
        {step === 4 && (
          <div
            style={{
              textAlign: "center",
              padding: "32px 0",
              animation: "fadeUp 0.4s ease",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "rgba(14,203,129,0.1)",
                border: `2px solid ${C.green}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                fontSize: 36,
              }}
            >
              ✓
            </div>
            <h3
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 32,
                letterSpacing: 1,
                marginBottom: 12,
              }}
            >
              TRADE SUBMITTED
            </h3>
            <p
              style={{
                color: C.muted,
                fontSize: 14,
                lineHeight: 1.7,
                marginBottom: 8,
              }}
            >
              Your {card.brand} {selectedDenom} card is being verified.
            </p>
            <p
              style={{
                color: C.muted,
                fontSize: 14,
                lineHeight: 1.7,
                marginBottom: 32,
              }}
            >
              You'll receive{" "}
              <span style={{ color: C.green, fontWeight: 600 }}>
                {fmt(payout)}
              </span>{" "}
              in your Swift Trade NGN wallet within 5–15 minutes.
            </p>
            <div
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: "16px 20px",
                marginBottom: 32,
                textAlign: "left",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: C.muted,
                  letterSpacing: 2,
                  marginBottom: 12,
                }}
              >
                TRANSACTION ID
              </div>
              <div
                style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 13,
                  color: C.green,
                  wordBreak: "break-all",
                }}
              >
                ST-{Date.now().toString(36).toUpperCase()}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: "100%",
                background: C.green,
                color: "#000",
                fontWeight: 700,
                fontSize: 15,
                padding: "14px",
                borderRadius: 10,
                border: "none",
              }}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ─── GIFT CARD CARD ───────────────────────────────────────
function GiftCardItem({ card, onSell, delay = 0 }) {
  return (
    <FadeIn delay={delay}>
      <div
        className="gc-sell-card"
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          overflow: "hidden",
          transition: "all 0.3s",
          cursor: "pointer",
          position: "relative",
        }}
      >
        <div
          style={{
            background: card.bg,
            padding: "28px 24px 24px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            className="gc-shine"
            style={{
              position: "absolute",
              top: "-60%",
              left: "-30%",
              width: "40%",
              height: "200%",
              background:
                "linear-gradient(105deg,transparent,rgba(255,255,255,0.06),transparent)",
            }}
          />
          {card.popular && (
            <span
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                background: "rgba(14,203,129,0.15)",
                border: `1px solid rgba(14,203,129,0.3)`,
                color: C.green,
                fontSize: 9,
                letterSpacing: 2,
                padding: "4px 8px",
                borderRadius: 100,
                fontWeight: 600,
              }}
            >
              HOT
            </span>
          )}
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 3,
              color: card.color,
              opacity: 0.8,
              marginBottom: 16,
              textTransform: "uppercase",
            }}
          >
            {card.brand}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 8,
              marginBottom: 6,
            }}
          >
            <span
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 36,
                letterSpacing: 1,
                lineHeight: 1,
              }}
            >
              {card.denominations[0]}
            </span>
            <span style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>
              – {card.denominations[card.denominations.length - 1]}
            </span>
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
            {card.country} · Gift Card
          </div>
        </div>

        <div style={{ padding: "20px 24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: C.muted,
                  letterSpacing: 1,
                  marginBottom: 4,
                }}
              >
                RATE / USD
              </div>
              <div
                style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 18,
                  color: C.green,
                  fontWeight: 500,
                }}
              >
                ₦{card.ratePerDollar.toLocaleString()}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: 11,
                  color: C.muted,
                  letterSpacing: 1,
                  marginBottom: 4,
                }}
              >
                DENOMINATIONS
              </div>
              <div style={{ fontSize: 12, color: "#aaa" }}>
                {card.denominations.join(", ")}
              </div>
            </div>
          </div>

          <button
            className="sell-btn-inner"
            onClick={() => onSell(card)}
            style={{
              width: "100%",
              background: C.green,
              color: "#000",
              fontWeight: 700,
              fontSize: 14,
              padding: "12px",
              borderRadius: 10,
              border: "none",
              letterSpacing: "0.3px",
              transition: "background 0.2s",
            }}
          >
            Sell This Card →
          </button>
        </div>
      </div>
    </FadeIn>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────
export default function GiftCardsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sellingCard, setSellingCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const filtered = GIFT_CARDS.filter((c) => {
    const matchCat = activeCategory === "All" || c.category === activeCategory;
    const matchSearch = c.brand
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div
      style={{
        background: C.bg,
        minHeight: "100vh",
        color: C.text,
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <Navbar />

      {/* Page hero */}
      <div
        className="hero-padding"
        style={{
          padding: "140px 64px 80px",
          position: "relative",
          overflow: "hidden",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            background: `radial-gradient(circle,rgba(245,166,35,0.08),transparent 60%)`,
            borderRadius: "50%",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 50,
            left: 200,
            width: 400,
            height: 400,
            background: `radial-gradient(circle,rgba(14,203,129,0.06),transparent 60%)`,
            borderRadius: "50%",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <div
          className="hero-grid"
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: 60,
            alignItems: "center",
          }}
        >
          <div className="hero-text">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(245,166,35,0.08)",
                border: "1px solid rgba(245,166,35,0.2)",
                borderRadius: 100,
                padding: "6px 14px",
                fontSize: 11,
                color: C.amber,
                letterSpacing: 2,
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: C.amber,
                  animation: "pulse 2s infinite",
                  display: "inline-block",
                }}
              />
              BEST RATES IN NIGERIA
            </div>
            <h1
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(52px,7vw,96px)",
                lineHeight: 0.9,
                letterSpacing: 2,
                marginBottom: 24,
              }}
            >
              SELL YOUR
              <br />
              <span style={{ color: C.amber }}>GIFT CARDS</span>
              <br />
              FOR NAIRA
            </h1>
            <p
              style={{
                color: C.muted,
                fontSize: 17,
                lineHeight: 1.7,
                fontWeight: 300,
                maxWidth: 500,
                marginBottom: 40,
              }}
            >
              Trade Amazon, Steam, iTunes, Netflix and more — get instant NGN in
              your wallet. No stress, no waiting.
            </p>

            {/* Quick stats */}
            <div className="hero-stats" style={{ display: "flex", gap: 48 }}>
              {[
                { val: "₦1,380+", label: "Best USD rate" },
                { val: "5 min", label: "Avg. payout" },
                { val: "20+", label: "Card brands" },
                { val: "24/7", label: "Processing" },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    style={{
                      fontFamily: "'Bebas Neue',sans-serif",
                      fontSize: 28,
                      color: C.green,
                      letterSpacing: 1,
                    }}
                  >
                    {s.val}
                  </div>
                  <div
                    style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div
            className="hero-image"
            style={{ position: "relative", animation: "fadeUp 1s ease" }}
          >
            <div
              style={{
                position: "absolute",
                inset: -20,
                background: `linear-gradient(45deg, ${C.green}20, ${C.amber}20)`,
                filter: "blur(40px)",
                borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
              }}
            />
            <img
              src={heroTrader}
              alt="Professional Trader"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: 24,
                border: `1px solid ${C.border2}`,
                boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
                position: "relative",
                zIndex: 1,
                objectFit: "cover",
                aspectRatio: "4/5",
              }}
            />
          </div>
        </div>
      </div>

      {/* Sign-in Notice */}
      <div
        className="section-padding"
        style={{
          padding: "16px 64px",
          background: "rgba(14, 203, 129, 0.05)",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: 14,
          color: C.muted,
        }}
      >
        <svg
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke={C.green}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0 }}
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span>
          Note: To securely trade or purchase gift cards, you are required to{" "}
          <Link
            to="/login"
            style={{
              color: C.green,
              fontWeight: 600,
              textDecoration: "underline",
            }}
          >
            sign in
          </Link>{" "}
          to your Swift Trade account. The trading flow below is for
          demonstration purposes.
        </span>
      </div>

      {/* Filters + search */}
      <div
        className="filters-bar"
        style={{
          padding: "28px 64px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 72,
          zIndex: 50,
          background: "rgba(8,8,8,0.95)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div
          className="filters-scroll"
          style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className="category-pill"
              onClick={() => setActiveCategory(cat)}
              style={{
                background:
                  activeCategory === cat
                    ? "rgba(14,203,129,0.1)"
                    : "transparent",
                border:
                  activeCategory === cat
                    ? `1px solid ${C.green}`
                    : `1px solid ${C.border2}`,
                color: activeCategory === cat ? C.green : C.muted,
                fontSize: 13,
                padding: "7px 16px",
                borderRadius: 100,
                fontFamily: "'Outfit',sans-serif",
                fontWeight: 500,
                transition: "all 0.2s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: C.muted,
              display: "flex",
            }}
          >
            <svg
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cards..."
            style={{
              background: C.card,
              border: `1px solid ${C.border2}`,
              borderRadius: 10,
              padding: "9px 16px 9px 38px",
              color: "#fff",
              fontSize: 14,
              fontFamily: "'Outfit',sans-serif",
              outline: "none",
              width: 200,
            }}
          />
        </div>
      </div>

      {/* Cards grid */}
      <div className="section-padding" style={{ padding: "48px 64px" }}>
        {filtered.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "80px 0", color: C.muted }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <svg
                width={48}
                height={48}
                viewBox="0 0 24 24"
                fill="none"
                stroke={C.muted2}
                strokeWidth={1}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 12 20 22 4 22 4 12" />
                <rect x="2" y="7" width="20" height="5" rx="1" />
                <line x1="12" y1="22" x2="12" y2="7" />
                <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
                <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
              </svg>
            </div>
            <div style={{ fontSize: 16 }}>No gift cards found</div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
              gap: 20,
            }}
          >
            {filtered.map((card, i) => (
              <GiftCardItem
                key={card.id}
                card={card}
                onSell={setSellingCard}
                delay={i * 0.05}
              />
            ))}
          </div>
        )}
      </div>

      {/* How it works */}
      <div
        className="section-padding"
        style={{
          padding: "100px 64px",
          borderTop: `1px solid ${C.border}`,
          background: C.surface,
        }}
      >
        <div
          className="how-it-works-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          {/* Lifestyle Image */}
          <FadeIn>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  inset: -10,
                  border: `1px solid ${C.green}33`,
                  borderRadius: 24,
                  transform: "rotate(-3deg)",
                  zIndex: 0,
                }}
              />
              <img
                src={lifestyleGiftcard}
                alt="Gift card trading"
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 20,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                  position: "relative",
                  zIndex: 1,
                }}
              />
              {/* Floating badge */}
              <div
                style={{
                  position: "absolute",
                  bottom: 30,
                  right: -20,
                  background: C.green,
                  color: "#000",
                  padding: "12px 24px",
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 13,
                  zIndex: 2,
                  boxShadow: "0 10px 30px rgba(14,203,129,0.3)",
                }}
              >
                100% SECURE ESCROW
              </div>
            </div>
          </FadeIn>

          <div>
            <div style={{ marginBottom: 48 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  color: C.green,
                  fontSize: 11,
                  letterSpacing: 4,
                  textTransform: "uppercase",
                  fontWeight: 500,
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    display: "block",
                    width: 24,
                    height: 1,
                    background: C.green,
                  }}
                />
                How It Works
              </div>
              <h2
                style={{
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: 48,
                  letterSpacing: 1,
                  lineHeight: 1,
                }}
              >
                SELL IN 3 SIMPLE STEPS
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                {
                  n: "01",
                  icon: (
                    <svg
                      width={22}
                      height={22}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={C.green}
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  ),
                  title: "Pick Your Card",
                  desc: "Choose the brand and denomination of your gift card from our supported list.",
                },
                {
                  n: "02",
                  icon: (
                    <svg
                      width={22}
                      height={22}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={C.green}
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                    </svg>
                  ),
                  title: "Enter the Code",
                  desc: "Type in your gift card code. You can also upload a photo of the card for faster verification.",
                },
                {
                  n: "03",
                  icon: (
                    <svg
                      width={22}
                      height={22}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={C.green}
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                  ),
                  title: "Receive Naira",
                  desc: "Once verified, your NGN equivalent lands in your Swift Trade wallet within minutes.",
                },
              ].map((s, i) => (
                <FadeIn key={s.n} delay={i * 0.1}>
                  <div
                    className="step-card"
                    style={{
                      background: C.card,
                      border: `1px solid ${C.border}`,
                      borderRadius: 16,
                      padding: "24px 28px",
                      transition: "all 0.3s",
                      display: "flex",
                      alignItems: "center",
                      gap: 20,
                    }}
                  >
                    <div
                      className="step-icon-box"
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        fontSize: 22,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(14,203,129,0.06)",
                        border: `1px solid ${C.border2}`,
                        transition: "all 0.3s",
                        flexShrink: 0,
                      }}
                    >
                      {s.icon}
                    </div>
                    <div>
                      <h4
                        style={{
                          fontSize: 18,
                          fontWeight: 600,
                          marginBottom: 4,
                        }}
                      >
                        {s.title}
                      </h4>
                      <p
                        style={{
                          color: C.muted,
                          fontSize: 14,
                          lineHeight: 1.6,
                          fontWeight: 300,
                        }}
                      >
                        {s.desc}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sell drawer */}
      {sellingCard && (
        <SellDrawer card={sellingCard} onClose={() => setSellingCard(null)} />
      )}

      <Footer />
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────
function Footer() {
  const cols = {
    Products: [
      "Crypto Exchange",
      "Crypto Conversion",
      "Gift Cards",
      "Live Rates",
    ],
    Company: ["About Us", "Our Story", "Careers", "Press"],
    Legal: [
      "Privacy Policy",
      "Terms of Service",
      "AML Policy",
      "Cookie Policy",
    ],
  };
  return (
    <footer
      className="section-padding"
      style={{
        padding: "100px 64px 40px",
        background: C.surface,
        borderTop: `1px solid ${C.border}`,
      }}
    >
      <div
        className="footer-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 48,
          marginBottom: 80,
        }}
      >
        <div>
          <Logo />
          <p
            style={{
              color: C.muted,
              marginTop: 24,
              maxWidth: 280,
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            Nigeria's fastest crypto exchange and gift card platform. Convert
            digital assets to naira instantly.
          </p>
        </div>
        {Object.entries(cols).map(([title, links]) => (
          <div key={title}>
            <h5
              style={{
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 24,
              }}
            >
              {title}
            </h5>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {links.map((l) => (
                <li key={l}>
                  <Link
                    key={l}
                    to={
                      l === "About Us"
                        ? "/about"
                        : l === "Gift Cards"
                          ? "/gift-cards"
                          : l === "Crypto Exchange"
                            ? "/exchange"
                            : l === "Live Rates"
                              ? "/rates"
                              : "#"
                    }
                    style={{
                      color: "#444",
                      fontSize: 14,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#fff")}
                    onMouseLeave={(e) => (e.target.style.color = "#444")}
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div
        className="footer-bottom"
        style={{
          paddingTop: 32,
          borderTop: `1px solid ${C.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ color: C.muted2, fontSize: 12 }}>
          © 2025 Swift Trade. All rights reserved.
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Twitter", "Instagram", "LinkedIn"].map((s) => (
            <a
              key={s}
              href="#"
              style={{
                color: C.muted2,
                fontSize: 12,
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#fff")}
              onMouseLeave={(e) => (e.target.style.color = C.muted2)}
            >
              {s}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
