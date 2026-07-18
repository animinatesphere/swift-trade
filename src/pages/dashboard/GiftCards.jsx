import React, { useState, useEffect, useRef } from "react";
import { useOutletContext, Link } from "react-router-dom";
import logoImg from "../../assets/logo.png";

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

const CSS = `
  @keyframes fadeUp    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes slideIn   { from{opacity:0;transform:translateX(22px)} to{opacity:1;transform:translateX(0)} }
  @keyframes slideBack { from{opacity:0;transform:translateX(-22px)} to{opacity:1;transform:translateX(0)} }
  @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes successIn { 0%{transform:scale(0.5);opacity:0} 65%{transform:scale(1.06)} 100%{transform:scale(1);opacity:1} }
  @keyframes checkDraw { from{stroke-dashoffset:70} to{stroke-dashoffset:0} }
  @keyframes ripple    { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(2.8);opacity:0} }
  @keyframes popIn     { 0%{transform:scale(0.6);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
  @keyframes shimmer   { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
  @keyframes bounce    { 0%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }

  .step-form       { animation:slideIn 0.32s cubic-bezier(.2,.8,.2,1); }
  .step-form.back  { animation:slideBack 0.32s cubic-bezier(.2,.8,.2,1); }
  .pri-btn         { transition:all 0.2s; cursor:pointer; }
  .pri-btn:hover:not(:disabled) { background:#0fdf8e !important; transform:translateY(-2px); box-shadow:0 10px 28px rgba(14,203,129,0.32) !important; }
  .pri-btn:disabled { opacity:0.35 !important; cursor:not-allowed !important; }
  .ghost-btn:hover { border-color:#555 !important; color:#ccc !important; }
  .ghost-btn       { transition:all 0.18s; }
  .back-btn:hover  { color:#fff !important; }
  .back-btn        { transition:color 0.15s; }
  .brand-card      { transition:all 0.2s; }
  .brand-card:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,0,0,0.4) !important; }
  .brand-card.sel  { transform:translateY(-3px); }
  .denom-btn       { transition:all 0.15s; }
  .denom-btn:hover { border-color:#555 !important; color:#ccc !important; }
  .denom-btn.sel   { background:rgba(14,203,129,0.1) !important; border-color:rgba(14,203,129,0.35) !important; color:#0ECB81 !important; }
  .country-card    { transition:all 0.18s; }
  .country-card:hover { border-color:#444 !important; transform:translateY(-2px); }
  .country-card.sel { background:rgba(14,203,129,0.08) !important; border-color:rgba(14,203,129,0.35) !important; }
  .type-btn        { transition:all 0.15s; }
  .type-btn.sel    { background:rgba(14,203,129,0.1) !important; border-color:rgba(14,203,129,0.35) !important; color:#0ECB81 !important; }
  .qty-btn         { transition:all 0.15s; cursor:pointer; }
  .qty-btn:hover:not(:disabled) { border-color:#555 !important; color:#fff !important; }
  .qty-btn:disabled { opacity:0.3; cursor:not-allowed; }
  .upload-zone     { transition:all 0.2s; }
  .upload-zone:hover { border-color:rgba(14,203,129,0.4) !important; background:rgba(14,203,129,0.03) !important; }
  .upload-zone.drag { border-color:#0ECB81 !important; background:rgba(14,203,129,0.06) !important; }
  .st-input        { transition:border-color 0.2s, box-shadow 0.2s; display:block; }
  .st-input:focus  { border-color:rgba(14,203,129,0.5) !important; box-shadow:0 0 0 3px rgba(14,203,129,0.07) !important; outline:none; }
  .search-input:focus { border-color:rgba(14,203,129,0.5) !important; box-shadow:0 0 0 3px rgba(14,203,129,0.07) !important; outline:none; }

  .giftcards-container {
    display: flex;
    flex: 1;
    min-height: 0;
  }

  .left-panel {
    width: 290px;
    background: #060606;
    border-right: 1px solid #1a1a1a;
    display: flex;
    flex-direction: column;
    height: 100%;
    flex-shrink: 0;
    padding: 28px 22px;
    position: relative;
    overflow-y: auto;
    box-sizing: border-box;
  }

  .form-area {
    flex: 1;
    overflow-y: auto;
    padding: 32px 48px 40px;
    box-sizing: border-box;
    min-width: 0;
  }

  .custom-amt-wrapper {
    position: relative;
    display: block;
  }

  .custom-amt-symbol {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-family: 'DM Mono', monospace;
    font-size: 16px;
    color: #888888;
    pointer-events: none;
    z-index: 1;
    line-height: 1;
  }

  .custom-amt-input {
    display: block;
    width: 100%;
    box-sizing: border-box;
    background: #141414;
    border: 1px solid #222222;
    border-radius: 10px;
    padding: 12px 14px 12px 30px;
    color: #ffffff;
    font-size: 16px;
    font-family: 'DM Mono', monospace;
    transition: border-color 0.2s, box-shadow 0.2s;
    -webkit-appearance: none;
    appearance: none;
    position: relative;
    z-index: 0;
  }

  .custom-amt-input:focus {
    border-color: rgba(14,203,129,0.5) !important;
    box-shadow: 0 0 0 3px rgba(14,203,129,0.07) !important;
    outline: none;
  }

  @media (max-width: 1024px) {
    .giftcards-container {
      flex-direction: column !important;
    }
    .left-panel {
      display: none !important;
    }
    .form-area {
      padding: 24px 20px 40px !important;
    }
    .giftcards-topbar {
      display: none !important;
    }
  }

  @media (max-width: 640px) {
    .form-area {
      padding: 20px 16px 40px !important;
    }
    h2 {
      font-size: 32px !important;
    }
    .brand-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }
`;

const BRANDS = [
  {
    id: "amazon",
    name: "Amazon",
    icon: "🛒",
    cardTypes: ["E-code", "Physical"],
    countries: [
      { code: "US", flag: "🇺🇸", name: "United States", currency: "USD", symbol: "$", rate: 1380, denoms: [25, 50, 100, 200] },
      { code: "UK", flag: "🇬🇧", name: "United Kingdom", currency: "GBP", symbol: "£", rate: 1640, denoms: [25, 50, 100] },
    ],
    color: "#FF9900",
    bg: "linear-gradient(135deg,#1a0800,#3d1f00)",
    textColor: "rgba(255,153,0,0.8)",
  },
  {
    id: "itunes",
    name: "iTunes",
    icon: "🎵",
    cardTypes: ["E-code"],
    countries: [
      { code: "US", flag: "🇺🇸", name: "United States", currency: "USD", symbol: "$", rate: 1350, denoms: [15, 25, 50, 100] },
      { code: "UK", flag: "🇬🇧", name: "United Kingdom", currency: "GBP", symbol: "£", rate: 1560, denoms: [15, 25, 50] },
    ],
    color: "#FC3C44",
    bg: "linear-gradient(135deg,#1a001a,#330020)",
    textColor: "rgba(252,60,68,0.8)",
  },
  {
    id: "steam",
    name: "Steam",
    icon: "🎮",
    cardTypes: ["E-code"],
    countries: [
      { code: "US", flag: "🇺🇸", name: "United States", currency: "USD", symbol: "$", rate: 1300, denoms: [10, 20, 50, 100] },
    ],
    color: "#66C0F4",
    bg: "linear-gradient(135deg,#00101a,#001f33)",
    textColor: "rgba(102,192,244,0.8)",
  },
  {
    id: "google",
    name: "Google Play",
    icon: "▶",
    cardTypes: ["E-code"],
    countries: [
      { code: "US", flag: "🇺🇸", name: "United States", currency: "USD", symbol: "$", rate: 1370, denoms: [10, 25, 50, 100] },
    ],
    color: "#0ECB81",
    bg: "linear-gradient(135deg,#001a08,#003318)",
    textColor: "rgba(14,203,129,0.8)",
  },
  {
    id: "netflix",
    name: "Netflix",
    icon: "🎬",
    cardTypes: ["E-code"],
    countries: [
      { code: "US", flag: "🇺🇸", name: "United States", currency: "USD", symbol: "$", rate: 1300, denoms: [15, 30, 60, 100] },
    ],
    color: "#E50914",
    bg: "linear-gradient(135deg,#1a0000,#330000)",
    textColor: "rgba(229,9,20,0.8)",
  },
  {
    id: "xbox",
    name: "Xbox",
    icon: "🕹",
    cardTypes: ["E-code"],
    countries: [
      { code: "US", flag: "🇺🇸", name: "United States", currency: "USD", symbol: "$", rate: 1280, denoms: [10, 25, 50, 100] },
    ],
    color: "#107C10",
    bg: "linear-gradient(135deg,#001a00,#003300)",
    textColor: "rgba(16,124,16,0.8)",
  },
  {
    id: "visa",
    name: "Visa",
    icon: "💳",
    cardTypes: ["E-code", "Physical"],
    countries: [
      { code: "US", flag: "🇺🇸", name: "United States", currency: "USD", symbol: "$", rate: 1260, denoms: [50, 100, 200, 500] },
    ],
    color: "#6B8AFE",
    bg: "linear-gradient(135deg,#000818,#001433)",
    textColor: "rgba(107,138,254,0.8)",
  },
  {
    id: "razergold",
    name: "Razer Gold",
    icon: "⚡",
    cardTypes: ["E-code"],
    countries: [
      { code: "US", flag: "🇺🇸", name: "United States", currency: "USD", symbol: "$", rate: 1250, denoms: [5, 10, 25, 50] },
    ],
    color: "#44D62C",
    bg: "linear-gradient(135deg,#001a00,#002800)",
    textColor: "rgba(68,214,44,0.8)",
  },
];

const STEP_ORDER = ["card", "variant", "details", "review", "upload", "done"];
const STEP_LABELS = {
  card: "Select Card",
  variant: "Select Country",
  details: "Card Details",
  review: "Review",
  upload: "Upload & Submit",
  done: "Done",
};

function Mark({ size = 32 }) {
  return (
    <img
      src={logoImg}
      alt="Swift Trade Logo"
      style={{ width: size, height: size, display: "block", objectFit: "contain" }}
    />
  );
}

// ─── STEP INDICATOR ─────────────────────────────────────────
function StepIndicator({ step }) {
  const idx = STEP_ORDER.indexOf(step);
  const totalSteps = STEP_ORDER.length; // 6, including the success screen
  const totalVisible = totalSteps - 1; // segments shown; success screen has its own celebration UI
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        {STEP_ORDER.slice(0, totalVisible).map((s, i) => (
          <div
            key={s}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 4,
              background: i <= idx ? C.amber : C.border2,
              transition: "background 0.4s",
            }}
          />
        ))}
      </div>
      <div
        style={{
          fontSize: 10,
          color: C.muted,
          letterSpacing: 2,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>
          STEP {idx + 1} OF {totalSteps}
        </span>
        <span style={{ color: C.amber }}>{STEP_LABELS[step]?.toUpperCase()}</span>
      </div>
    </div>
  );
}

function LeftPanel({ trade }) {
  const { brand, country, perValue, quantity, cardType, ngnOut } = trade;
  const showTicket = !!brand;
  return (
    <div className="left-panel">
      <div
        className="left-panel-ambient"
        style={{
          position: "absolute",
          top: -60,
          left: -60,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle,rgba(245,166,35,0.06),transparent 60%)`,
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />
      <div
        className="left-panel-logo"
        style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}
      >
        <Mark size={32} />
        <div>
          <div
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 19,
              letterSpacing: 2,
              lineHeight: 1,
            }}
          >
            SWIFT
          </div>
          <div style={{ fontSize: 7, color: C.amber, letterSpacing: 5, marginTop: 1 }}>
            TRADE
          </div>
        </div>
      </div>
      <div className="left-panel-title">
        <div style={{ fontSize: 10, color: C.muted, letterSpacing: 3, marginBottom: 12 }}>
          GIFT CARDS
        </div>
        <div
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: 30,
            letterSpacing: 1,
            lineHeight: 0.9,
            marginBottom: 28,
          }}
        >
          SELL YOUR
          <br />
          CARD FOR
          <br />
          <span style={{ color: C.amber }}>NAIRA</span>
        </div>
      </div>
      {brand && (
        <div
          style={{
            borderRadius: 14,
            background: brand.bg,
            border: `1px solid ${brand.color}22`,
            padding: "18px 20px",
            marginBottom: 18,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -20,
              top: -20,
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: `${brand.color}15`,
              filter: "blur(16px)",
            }}
          />
          <div style={{ fontSize: 22, marginBottom: 10 }}>{brand.icon}</div>
          <div
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 16,
              color: "rgba(255,255,255,0.85)",
              letterSpacing: 2,
              marginBottom: 4,
            }}
          >
            {brand.name.toUpperCase()}
          </div>
          {country && perValue > 0 ? (
            <>
              <div
                style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 22,
                  color: "#fff",
                  fontWeight: 500,
                  letterSpacing: 1,
                }}
              >
                {country.symbol}
                {perValue}
                {quantity > 1 ? ` × ${quantity}` : ""}
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 3, letterSpacing: 1 }}>
                {country.flag} {country.currency} · {cardType || "GIFT CARD"}
              </div>
            </>
          ) : (
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: 1 }}>
              {country ? `${country.flag} ${country.currency}` : "Select variant"}
            </div>
          )}
        </div>
      )}
      <div style={{ flex: 1 }}>
        {showTicket ? (
          <div
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "10px 14px",
                borderBottom: `1px solid ${C.border}`,
                fontSize: 10,
                color: C.muted,
                letterSpacing: 2,
              }}
            >
              TRADE SUMMARY
            </div>
            <div style={{ padding: "0 14px" }}>
              {[
                { label: "Card", val: brand?.name },
                { label: "Country", val: country ? `${country.flag} ${country.code}` : null },
                { label: "Value", val: country && perValue > 0 ? `${country.symbol}${perValue} × ${quantity}` : null },
                { label: "Rate", val: country ? `₦${country.rate.toLocaleString()}/${country.currency}` : null },
                { label: "You Get", val: ngnOut > 0 ? `₦${ngnOut.toLocaleString()}` : null, green: true },
              ].map((r) => (
                <div
                  key={r.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <span style={{ fontSize: 11, color: C.muted }}>{r.label}</span>
                  <span
                    style={{
                      fontFamily: "'DM Mono',monospace",
                      fontSize: 11,
                      color: r.val ? (r.green ? C.amber : "#ccc") : C.muted2,
                    }}
                  >
                    {r.val || "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            style={{
              border: `1px dashed ${C.muted2}`,
              borderRadius: 12,
              padding: "24px 16px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
              Select a gift card to see your payout
            </div>
          </div>
        )}
      </div>
      <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { color: C.amber, text: "5–15 min payout" },
          { color: C.muted, text: "Submit card image or code" },
          { color: C.green, text: "Best rates guaranteed" },
        ].map((t) => (
          <div key={t.text} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: t.color,
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 11, color: C.muted }}>{t.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── STEP 1: SELECT CARD ────────────────────────────────────
function StepCard({ selected, onSelect }) {
  const [search, setSearch] = useState("");
  const filtered = BRANDS.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="step-form">
      <h2
        style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 42,
          letterSpacing: 1,
          lineHeight: 0.9,
          marginBottom: 8,
        }}
      >
        WHICH GIFT
        <br />
        <span style={{ color: C.amber }}>CARD DO YOU</span>
        <br />
        HAVE?
      </h2>
      <p style={{ color: C.muted, fontSize: 14, fontWeight: 300, lineHeight: 1.6, marginBottom: 20 }}>
        Search or pick a brand to get started.
      </p>

      <div style={{ position: "relative", marginBottom: 22 }}>
        <svg
          width={15}
          height={15}
          viewBox="0 0 24 24"
          fill="none"
          stroke={C.muted}
          strokeWidth={2}
          strokeLinecap="round"
          style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search gift card brands..."
          style={{
            width: "100%",
            boxSizing: "border-box",
            background: C.card2,
            border: `1px solid ${C.border2}`,
            borderRadius: 12,
            padding: "13px 14px 13px 40px",
            color: "#fff",
            fontSize: 14,
            fontFamily: "'Outfit',sans-serif",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
        />
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: C.muted, fontSize: 13 }}>
          No brands match &ldquo;{search}&rdquo;
        </div>
      ) : (
        <div
          className="brand-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}
        >
          {filtered.map((b) => {
            const isSel = selected?.id === b.id;
            return (
              <button
                key={b.id}
                className={`brand-card${isSel ? " sel" : ""}`}
                onClick={() => onSelect(b)}
                style={{
                  background: b.bg,
                  border: `2px solid ${isSel ? b.color : b.color + "22"}`,
                  borderRadius: 14,
                  padding: "20px 12px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: isSel ? `0 8px 24px ${b.color}33` : "none",
                }}
              >
                <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "60%",
                      height: "100%",
                      background: `linear-gradient(105deg,transparent,${b.color}12,transparent)`,
                      animation: isSel ? "shimmer 2s ease-in-out infinite" : "none",
                    }}
                  />
                </div>
                {isSel && (
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: b.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      animation: "popIn 0.2s ease",
                    }}
                  >
                    <svg width={9} height={9} viewBox="0 0 9 9" fill="none">
                      <path d="M1.5 4.5l2 2.5L7.5 2" stroke="#000" strokeWidth={1.3} strokeLinecap="round" />
                    </svg>
                  </div>
                )}
                <span style={{ fontSize: 26 }}>{b.icon}</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.85)",
                    textAlign: "center",
                    lineHeight: 1.3,
                  }}
                >
                  {b.name}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── STEP 2: SELECT VARIANT ─────────────────────────────────
function StepVariant({ brand, selected, onSelect }) {
  return (
    <div className="step-form">
      <h2
        style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 42,
          letterSpacing: 1,
          lineHeight: 0.9,
          marginBottom: 8,
        }}
      >
        <span style={{ color: brand.color }}>{brand.name}</span>
        <br />
        WHICH COUNTRY?
      </h2>
      <p style={{ color: C.muted, fontSize: 14, fontWeight: 300, lineHeight: 1.6, marginBottom: 24 }}>
        Only supported card variants are shown below.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {brand.countries.map((ct) => {
          const isSel = selected?.code === ct.code;
          return (
            <button
              key={ct.code}
              className={`country-card${isSel ? " sel" : ""}`}
              onClick={() => onSelect(ct)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "16px 18px",
                borderRadius: 14,
                background: isSel ? "rgba(14,203,129,0.06)" : C.card,
                border: `1px solid ${isSel ? "rgba(14,203,129,0.35)" : C.border}`,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: 28 }}>{ct.flag}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{ct.name}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{ct.currency}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontFamily: "'DM Mono',monospace",
                    fontSize: 14,
                    color: isSel ? C.green : "#ccc",
                    fontWeight: 600,
                  }}
                >
                  ₦{ct.rate.toLocaleString()}
                </div>
                <div style={{ fontSize: 10, color: C.muted }}>per {ct.currency}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── STEP 3: CARD DETAILS ───────────────────────────────────
function StepDetails({
  brand,
  country,
  denom,
  setDenom,
  customAmt,
  setCustomAmt,
  quantity,
  setQuantity,
  cardType,
  setCardType,
  perValue,
  ngnOut,
}) {
  const handleAmtChange = (e) => {
    const v = e.target.value.replace(/[^0-9.]/g, "");
    setCustomAmt(v);
  };

  return (
    <div className="step-form">
      <h2
        style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 42,
          letterSpacing: 1,
          lineHeight: 0.9,
          marginBottom: 8,
        }}
      >
        CARD
        <br />
        <span style={{ color: C.amber }}>DETAILS</span>
      </h2>
      <p style={{ color: C.muted, fontSize: 14, fontWeight: 300, lineHeight: 1.6, marginBottom: 20 }}>
        Enter the value of your {brand.name} {country.code} card.
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(14,203,129,0.06)",
          border: "1px solid rgba(14,203,129,0.18)",
          borderRadius: 12,
          padding: "12px 16px",
          marginBottom: 24,
        }}
      >
        <span style={{ fontSize: 12, color: C.muted }}>Current rate</span>
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 14, color: C.green, fontWeight: 600 }}>
          ₦{country.rate.toLocaleString()} / {country.currency}
        </span>
      </div>

      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, marginBottom: 10 }}>
          CARD VALUE
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 16 }}>
          {country.denoms.map((d) => (
            <button
              key={d}
              className={`denom-btn${denom === d ? " sel" : ""}`}
              onClick={() => setDenom(d)}
              style={{
                padding: "14px 8px",
                borderRadius: 10,
                cursor: "pointer",
                background: denom === d ? "rgba(14,203,129,0.1)" : C.card2,
                border: `1px solid ${denom === d ? "rgba(14,203,129,0.35)" : C.border2}`,
                color: denom === d ? C.green : "#aaa",
                fontFamily: "'DM Mono',monospace",
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              {country.symbol}
              {d}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, marginBottom: 8 }}>
          OR ENTER CUSTOM AMOUNT
        </div>
        <div className="custom-amt-wrapper">
          <span className="custom-amt-symbol">{country.symbol}</span>
          <input
            className="custom-amt-input"
            type="text"
            inputMode="decimal"
            value={customAmt}
            onChange={handleAmtChange}
            placeholder="0"
          />
        </div>
      </div>

      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, marginBottom: 10 }}>
          QUANTITY
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            className="qty-btn"
            disabled={quantity <= 1}
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: C.card2,
              border: `1px solid ${C.border2}`,
              color: "#ccc",
              fontSize: 18,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            −
          </button>
          <div
            style={{
              minWidth: 48,
              textAlign: "center",
              fontFamily: "'DM Mono',monospace",
              fontSize: 20,
              fontWeight: 600,
              color: "#fff",
            }}
          >
            {quantity}
          </div>
          <button
            className="qty-btn"
            disabled={quantity >= 10}
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: C.card2,
              border: `1px solid ${C.border2}`,
              color: "#ccc",
              fontSize: 18,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            +
          </button>
          <span style={{ fontSize: 12, color: C.muted }}>
            {quantity > 1 ? `${quantity} cards of the same value` : "How many cards?"}
          </span>
        </div>
      </div>

      {brand.cardTypes.length > 1 && (
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, marginBottom: 10 }}>
            CARD TYPE
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {brand.cardTypes.map((ty) => (
              <button
                key={ty}
                className={`type-btn${cardType === ty ? " sel" : ""}`}
                onClick={() => setCardType(ty)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: 10,
                  background: cardType === ty ? "rgba(14,203,129,0.1)" : C.card2,
                  border: `1px solid ${cardType === ty ? "rgba(14,203,129,0.35)" : C.border2}`,
                  color: cardType === ty ? C.green : "#aaa",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "'Outfit',sans-serif",
                }}
              >
                {ty}
              </button>
            ))}
          </div>
        </div>
      )}

      {ngnOut > 0 && (
        <div
          style={{
            background: "rgba(245,166,35,0.06)",
            border: "1px solid rgba(245,166,35,0.15)",
            borderRadius: 12,
            padding: "14px 18px",
          }}
        >
          {[
            ["Rate", `₦${country.rate.toLocaleString()} / ${country.currency}`],
            ["Card Value", `${country.symbol}${perValue}${quantity > 1 ? ` × ${quantity}` : ""}`],
            ["Estimated Payout", `₦${ngnOut.toLocaleString()}`],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: C.muted }}>{k}</span>
              <span
                style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 13,
                  color: k === "Estimated Payout" ? C.amber : "#bbb",
                  fontWeight: k === "Estimated Payout" ? 600 : 400,
                }}
              >
                {v}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── STEP 4: REVIEW SUMMARY ──────────────────────────────────
function StepReview({ trade }) {
  const { brand, country, perValue, quantity, cardType, ngnOut, fee } = trade;
  const total = ngnOut - fee;
  return (
    <div className="step-form">
      <h2
        style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 42,
          letterSpacing: 1,
          lineHeight: 0.9,
          marginBottom: 24,
        }}
      >
        REVIEW
        <br />
        <span style={{ color: C.amber }}>YOUR TRADE</span>
      </h2>
      <div
        style={{
          background: brand.bg,
          border: `1px solid ${brand.color}22`,
          borderRadius: 14,
          padding: "18px 20px",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 16,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -20,
            top: -20,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: `${brand.color}15`,
            filter: "blur(16px)",
          }}
        />
        <span style={{ fontSize: 32, flexShrink: 0 }}>{brand.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: 1, marginBottom: 4 }}>
            {brand.name}
          </div>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 22, color: "#fff", fontWeight: 500 }}>
            {country.symbol}
            {perValue}
            {quantity > 1 ? ` × ${quantity}` : ""}
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
            {country.flag} {country.code} · {cardType}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 10, color: C.amber, letterSpacing: 2, marginBottom: 4 }}>
            YOU RECEIVE
          </div>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, color: C.amber, letterSpacing: 1 }}>
            ₦{total.toLocaleString()}
          </div>
        </div>
      </div>
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {[
          ["Brand", brand.name],
          ["Country / Currency", `${country.flag} ${country.name} · ${country.currency}`],
          ["Card Value", `${country.symbol}${perValue} × ${quantity}`],
          ["Card Type", cardType],
          ["Exchange Rate", `₦${country.rate.toLocaleString()} / ${country.currency}`],
          ["Processing Fee", fee > 0 ? `₦${fee.toLocaleString()}` : "Free"],
          ["Total You Receive", `₦${total.toLocaleString()}`],
        ].map(([k, v]) => (
          <div
            key={k}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "11px 16px",
              borderBottom: `1px solid ${C.border}`,
              background: k === "Total You Receive" ? "rgba(245,166,35,0.04)" : "transparent",
            }}
          >
            <span style={{ fontSize: 12, color: k === "Total You Receive" ? C.amber : C.muted }}>{k}</span>
            <span
              style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: 12,
                color: k === "Total You Receive" ? C.amber : "#ccc",
                fontWeight: k === "Total You Receive" ? 600 : 400,
              }}
            >
              {v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── STEP 5: UPLOAD & SUBMIT ─────────────────────────────────
function StepUpload({ image, setImage, cardCode, setCardCode, notes, setNotes, onSubmit, loading }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setImage({ file, preview: e.target.result, name: file.name });
    reader.readAsDataURL(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="step-form">
      <h2
        style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 42,
          letterSpacing: 1,
          lineHeight: 0.9,
          marginBottom: 8,
        }}
      >
        UPLOAD &
        <br />
        <span style={{ color: C.amber }}>SUBMIT</span>
      </h2>
      <p style={{ color: C.muted, fontSize: 14, fontWeight: 300, lineHeight: 1.6, marginBottom: 24 }}>
        Take a clear photo of the card showing the code and denomination, or type the code directly.
      </p>

      {!image ? (
        <div
          className={`upload-zone${drag ? " drag" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${drag ? "rgba(14,203,129,0.6)" : C.border2}`,
            borderRadius: 14,
            padding: "52px 24px",
            textAlign: "center",
            cursor: "pointer",
            marginBottom: 20,
            background: drag ? "rgba(14,203,129,0.04)" : "transparent",
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <div style={{ fontSize: 40, marginBottom: 14, animation: "bounce 2s ease-in-out infinite" }}>
            📸
          </div>
          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6, color: "#ccc" }}>
            {drag ? "Drop it here!" : "Tap to upload card image"}
          </div>
          <div style={{ fontSize: 12, color: C.muted }}>JPG, PNG or HEIC · Max 10MB</div>
        </div>
      ) : (
        <div
          style={{
            position: "relative",
            marginBottom: 20,
            borderRadius: 14,
            overflow: "hidden",
            border: `1px solid rgba(14,203,129,0.25)`,
          }}
        >
          <img
            src={image.preview}
            alt="Card"
            style={{ width: "100%", maxHeight: 220, objectFit: "cover", display: "block" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(transparent 60%,rgba(0,0,0,0.8))",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 12,
              left: 16,
              right: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#fff" }}>{image.name}</div>
              <div style={{ fontSize: 10, color: C.green, marginTop: 2 }}>✓ Image uploaded</div>
            </div>
            <button
              onClick={() => setImage(null)}
              style={{
                background: "rgba(246,70,93,0.15)",
                border: "1px solid rgba(246,70,93,0.3)",
                color: C.red,
                fontSize: 11,
                padding: "5px 12px",
                borderRadius: 8,
                cursor: "pointer",
                fontFamily: "'Outfit',sans-serif",
                fontWeight: 500,
              }}
            >
              Remove
            </button>
          </div>
        </div>
      )}

      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, marginBottom: 8 }}>
          CARD CODE {!image && <span style={{ color: C.amber }}>(REQUIRED IF NO IMAGE)</span>}
        </div>
        <input
          className="st-input"
          value={cardCode}
          onChange={(e) => setCardCode(e.target.value.toUpperCase())}
          placeholder="XXXX-XXXX-XXXX-XXXX"
          style={{
            width: "100%",
            boxSizing: "border-box",
            background: C.card2,
            border: `1px solid ${C.border2}`,
            borderRadius: 10,
            padding: "12px 14px",
            color: "#fff",
            fontFamily: "'DM Mono',monospace",
            fontSize: 15,
            letterSpacing: 2,
          }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, marginBottom: 8 }}>
          NOTES <span style={{ color: C.muted2 }}>(OPTIONAL)</span>
        </div>
        <textarea
          className="st-input"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything we should know about this card?"
          rows={3}
          style={{
            width: "100%",
            boxSizing: "border-box",
            background: C.card2,
            border: `1px solid ${C.border2}`,
            borderRadius: 10,
            padding: "12px 14px",
            color: "#fff",
            fontFamily: "'Outfit',sans-serif",
            fontSize: 13,
            resize: "vertical",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "flex-start",
          background: "rgba(245,166,35,0.05)",
          border: "1px solid rgba(245,166,35,0.12)",
          borderRadius: 10,
          padding: "11px 14px",
          marginBottom: 24,
        }}
      >
        <svg
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill="none"
          stroke={C.amber}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0, marginTop: 1 }}
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
          Make sure the card code and amount are clearly visible. Blurry images may delay verification.
        </span>
      </div>

      <button
        onClick={onSubmit}
        disabled={loading || (!image && !cardCode.trim())}
        className="pri-btn"
        style={{
          width: "100%",
          background: loading || (!image && !cardCode.trim()) ? C.border : C.amber,
          color: loading || (!image && !cardCode.trim()) ? C.muted : "#000",
          fontWeight: 700,
          fontSize: 15,
          padding: "15px",
          borderRadius: 12,
          border: "none",
          fontFamily: "'Outfit',sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        {loading ? (
          <>
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                border: "2.5px solid rgba(0,0,0,0.2)",
                borderTopColor: "#000",
                animation: "spin 0.8s linear infinite",
              }}
            />
            Submitting...
          </>
        ) : (
          "Submit Transaction ✓"
        )}
      </button>
    </div>
  );
}

// ─── STEP 6: SUCCESS ──────────────────────────────────────────
function StepDone({ trade, refId, onReset }) {
  const total = trade.ngnOut - trade.fee;
  return (
    <div className="step-form" style={{ textAlign: "center", padding: "16px 0" }}>
      <div style={{ position: "relative", width: 96, height: 96, margin: "0 auto 24px" }}>
        <div
          style={{
            position: "absolute",
            inset: -8,
            borderRadius: "50%",
            border: `2px solid rgba(245,166,35,0.4)`,
            animation: "ripple 0.8s ease-out",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: -8,
            borderRadius: "50%",
            border: `2px solid rgba(245,166,35,0.2)`,
            animation: "ripple 0.8s 0.25s ease-out",
          }}
        />
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "rgba(245,166,35,0.1)",
            border: `2px solid ${C.amber}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "successIn 0.5s ease",
            boxShadow: `0 0 40px rgba(245,166,35,0.2)`,
          }}
        >
          <svg width={40} height={40} viewBox="0 0 40 40" fill="none">
            <path
              d="M8 20l8 9L32 12"
              stroke={C.amber}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={70}
              style={{ animation: "checkDraw 0.5s 0.3s ease forwards", strokeDashoffset: 70 }}
            />
          </svg>
        </div>
      </div>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          background: "rgba(245,166,35,0.08)",
          border: "1px solid rgba(245,166,35,0.2)",
          borderRadius: 100,
          padding: "4px 14px",
          fontSize: 10,
          color: C.amber,
          letterSpacing: 3,
          marginBottom: 16,
        }}
      >
        PENDING VERIFICATION
      </div>
      <h2
        style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 44,
          letterSpacing: 1,
          lineHeight: 0.9,
          marginBottom: 12,
        }}
      >
        CARD RECEIVED.
        <br />
        <span style={{ color: C.amber }}>VERIFYING NOW.</span>
      </h2>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, maxWidth: 340, margin: "0 auto 24px" }}>
        Your {trade.brand.name} {trade.country.symbol}
        {trade.perValue}
        {trade.quantity > 1 ? ` × ${trade.quantity}` : ""} card is being verified. Once approved,{" "}
        <span style={{ color: C.amber, fontWeight: 600 }}>₦{total.toLocaleString()}</span> will be
        credited within 5–15 minutes.
      </p>
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: "16px 20px",
          marginBottom: 24,
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2, marginBottom: 8 }}>
              TRANSACTION ID
            </div>
            <div
              style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: 20,
                color: C.amber,
                fontWeight: 500,
                marginBottom: 4,
              }}
            >
              {refId}
            </div>
          </div>
          <div
            style={{
              fontSize: 9,
              color: C.amber,
              background: "rgba(245,166,35,0.1)",
              border: "1px solid rgba(245,166,35,0.25)",
              borderRadius: 100,
              padding: "4px 10px",
              letterSpacing: 1,
              whiteSpace: "nowrap",
              marginTop: 2,
            }}
          >
            PENDING
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 12,
            paddingTop: 12,
            borderTop: `1px solid ${C.border}`,
          }}
        >
          <span style={{ fontSize: 11, color: C.muted }}>Est. processing time</span>
          <span style={{ fontSize: 11, color: "#ccc", fontFamily: "'DM Mono',monospace" }}>
            5–15 minutes
          </span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <button
          onClick={onReset}
          style={{
            background: C.amber,
            color: "#000",
            fontWeight: 700,
            fontSize: 14,
            padding: "13px",
            borderRadius: 11,
            border: "none",
            fontFamily: "'Outfit',sans-serif",
            cursor: "pointer",
          }}
        >
          Sell Another
        </button>
        <Link
          to="/dashboard/txn"
          className="ghost-btn"
          style={{
            background: "transparent",
            border: `1px solid ${C.border2}`,
            color: C.muted,
            fontSize: 14,
            padding: "13px",
            borderRadius: 11,
            fontFamily: "'Outfit',sans-serif",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          Track Transaction
        </Link>
      </div>
      <Link
        to="/dashboard"
        style={{
          display: "block",
          textAlign: "center",
          color: C.muted,
          fontSize: 13,
          textDecoration: "none",
          padding: "8px",
        }}
      >
        ← Return to Dashboard
      </Link>
    </div>
  );
}

export default function GiftCardsDashboard() {
  const [step, setStep] = useState("card");
  const [dir, setDir] = useState("fwd");
  const [trade, setTrade] = useState({
    brand: null,
    country: null,
    denom: 0,
    customAmt: "",
    quantity: 1,
    cardType: "E-code",
    image: null,
    cardCode: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [refId, setRefId] = useState("");
  const { setIsMobileOpen } = useOutletContext() || {};

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  const upd = (patch) => setTrade((t) => ({ ...t, ...patch }));

  // Reset dependent fields only when the brand actually changes
  useEffect(() => {
    if (!trade.brand) return;
    const supportsCurrentType = trade.brand.cardTypes.includes(trade.cardType);
    upd({
      country: trade.brand.countries[0],
      denom: 0,
      customAmt: "",
      cardType: supportsCurrentType ? trade.cardType : trade.brand.cardTypes[0],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trade.brand?.id]);

  const perValue = trade.denom > 0 ? trade.denom : parseFloat(trade.customAmt) || 0;
  const totalValue = perValue * trade.quantity;
  const ngnOut = trade.country && totalValue > 0 ? totalValue * trade.country.rate : 0;
  const fee = 0;

  const ORDER = STEP_ORDER;

  const canNext = () => {
    if (step === "card") return !!trade.brand;
    if (step === "variant") return !!trade.country;
    if (step === "details") return perValue > 0 && trade.quantity >= 1;
    if (step === "review") return true;
    return false;
  };

  const goTo = (target, direction) => {
    setDir(direction);
    setStep(target);
  };

  const next = () => {
    const i = ORDER.indexOf(step);
    if (i < ORDER.length - 1) goTo(ORDER[i + 1], "fwd");
  };
  const back = () => {
    const i = ORDER.indexOf(step);
    if (i > 0) goTo(ORDER[i - 1], "back");
  };

  // Auto-advance for the single-tap selection steps
  const selectBrand = (b) => {
    upd({ brand: b });
    setTimeout(() => goTo("variant", "fwd"), 220);
  };
  const selectVariant = (ct) => {
    upd({ country: ct, denom: 0, customAmt: "" });
    setTimeout(() => goTo("details", "fwd"), 220);
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRefId("GC-" + Math.floor(100000 + Math.random() * 900000));
      goTo("done", "fwd");
    }, 1600);
  };

  const handleReset = () => {
    setStep("card");
    setTrade({
      brand: null,
      country: null,
      denom: 0,
      customAmt: "",
      quantity: 1,
      cardType: "E-code",
      image: null,
      cardCode: "",
      notes: "",
    });
    setRefId("");
  };

  return (
    <div className="giftcards-container">
      <LeftPanel trade={{ ...trade, perValue, ngnOut: ngnOut - fee }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, minWidth: 0 }}>
        <div
          className="giftcards-topbar"
          style={{
            height: 54,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
            borderBottom: `1px solid ${C.border}`,
            background: "rgba(8,8,8,0.95)",
            backdropFilter: "blur(12px)",
            flexShrink: 0,
          }}
        >
          <div>
            {step !== "card" && step !== "done" && (
              <button
                className="back-btn"
                onClick={back}
                style={{
                  background: "none",
                  border: "none",
                  color: C.muted,
                  fontSize: 12,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: 0,
                  fontFamily: "'Outfit',sans-serif",
                }}
              >
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                Back
              </button>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => setIsMobileOpen?.(true)}
              style={{ display: "none", background: "none", border: "none", color: "#fff", cursor: "pointer" }}
              className="mobile-toggle"
            >
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: C.amber,
                  animation: "pulse 2s infinite",
                  display: "inline-block",
                }}
              />
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: C.amber }}>
                BEST RATES
              </span>
            </div>
          </div>
        </div>

        <div className="form-area">
          <div style={{ maxWidth: 580, margin: "0 auto" }}>
            {step !== "done" && <StepIndicator step={step} />}

            <div key={step} className={`step-form${dir === "back" ? " back" : ""}`} style={{ animation: "none" }}>
              {step === "card" && <StepCard selected={trade.brand} onSelect={selectBrand} />}
              {step === "variant" && (
                <StepVariant brand={trade.brand} selected={trade.country} onSelect={selectVariant} />
              )}
              {step === "details" && (
                <StepDetails
                  brand={trade.brand}
                  country={trade.country}
                  denom={trade.denom}
                  setDenom={(d) => upd({ denom: d, customAmt: "" })}
                  customAmt={trade.customAmt}
                  setCustomAmt={(v) => upd({ customAmt: v, denom: 0 })}
                  quantity={trade.quantity}
                  setQuantity={(q) => upd({ quantity: q })}
                  cardType={trade.cardType}
                  setCardType={(t) => upd({ cardType: t })}
                  perValue={perValue}
                  ngnOut={ngnOut}
                />
              )}
              {step === "review" && <StepReview trade={{ ...trade, perValue, ngnOut, fee }} />}
              {step === "upload" && (
                <StepUpload
                  image={trade.image}
                  setImage={(img) => upd({ image: img })}
                  cardCode={trade.cardCode}
                  setCardCode={(v) => upd({ cardCode: v })}
                  notes={trade.notes}
                  setNotes={(v) => upd({ notes: v })}
                  onSubmit={handleSubmit}
                  loading={loading}
                />
              )}
              {step === "done" && (
                <StepDone trade={{ ...trade, perValue, ngnOut, fee }} refId={refId} onReset={handleReset} />
              )}
            </div>

            {(step === "details" || step === "review") && (
              <div style={{ marginTop: 24, display: "flex", gap: 10 }}>
                <button
                  onClick={back}
                  className="ghost-btn"
                  style={{
                    flex: "0 0 110px",
                    background: "transparent",
                    border: `1px solid ${C.border2}`,
                    color: C.muted,
                    fontWeight: 600,
                    fontSize: 14,
                    padding: "15px",
                    borderRadius: 12,
                    cursor: "pointer",
                    fontFamily: "'Outfit',sans-serif",
                  }}
                >
                  ← Back
                </button>
                <button
                  disabled={!canNext()}
                  onClick={next}
                  className="pri-btn"
                  style={{
                    flex: 1,
                    background: canNext() ? C.amber : C.border,
                    color: canNext() ? "#000" : C.muted,
                    fontWeight: 700,
                    fontSize: 15,
                    padding: "15px",
                    borderRadius: 12,
                    border: "none",
                    fontFamily: "'Outfit',sans-serif",
                  }}
                >
                  Continue →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
