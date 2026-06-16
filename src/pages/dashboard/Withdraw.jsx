import React, { useState, useEffect } from "react";
import api from "../../api/axios";

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
  @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes successIn { 0%{transform:scale(0.5);opacity:0} 65%{transform:scale(1.06)} 100%{transform:scale(1);opacity:1} }
  @keyframes checkDraw { from{stroke-dashoffset:70} to{stroke-dashoffset:0} }
  @keyframes ripple    { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(2.8);opacity:0} }
  @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes popIn     { 0%{transform:scale(0.6);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }

  .step-form       { animation:slideIn 0.3s ease; }
  .pri-btn         { transition:all 0.2s; }
  .pri-btn:hover:not(:disabled) { background:#0fdf8e !important; transform:translateY(-2px); box-shadow:0 10px 28px rgba(14,203,129,0.32) !important; }
  .pri-btn:disabled { opacity:0.35 !important; cursor:not-allowed !important; }
  .ghost-btn       { transition:all 0.18s; }
  .ghost-btn:hover { border-color:#555 !important; color:#ccc !important; }
  .bank-card       { transition:all 0.18s; }
  .bank-card:hover { border-color:#444 !important; background:#181818 !important; }
  .bank-card.sel   { border-color:rgba(14,203,129,0.4) !important; background:rgba(14,203,129,0.05) !important; }
  .amt-btn:hover   { background:rgba(255,255,255,0.07) !important; color:#fff !important; }
  .amt-btn         { transition:all 0.15s; }
  .st-input:focus  { border-color:rgba(14,203,129,0.5) !important; box-shadow:0 0 0 3px rgba(14,203,129,0.08) !important; outline:none; }
  .st-input        { transition:border-color 0.2s, box-shadow 0.2s; }
  .back-btn:hover  { color:#fff !important; }
  .back-btn        { transition:color 0.15s; }

  .withdraw-container {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .left-panel {
    width: 300px;
    background: #060606;
    border-right: 1px solid #1a1a1a;
    display: flex;
    flex-direction: column;
    height: 100%;
    flex-shrink: 0;
    padding: clamp(20px, 4vw, 28px) clamp(20px, 3vw, 24px);
    position: relative;
    overflow-y: auto;
  }

  .form-area {
    flex: 1;
    overflow-y: auto;
    padding: clamp(24px, 4vw, 32px) clamp(20px, 5vw, 48px) clamp(30px, 4vw, 40px);
  }

  @media (max-width: 1024px) {
    .withdraw-container {
      flex-direction: column !important;
    }
    .left-panel {
      width: 100% !important;
      height: auto !important;
      border-right: none !important;
      border-bottom: 1px solid #1a1a1a !important;
      padding: clamp(16px, 3vw, 20px) !important;
    }
    .left-panel-ambient, .left-panel-logo, .left-panel-title {
      display: none !important;
    }
    .form-area {
      padding: clamp(20px, 3vw, 24px) clamp(16px, 3vw, 20px) clamp(30px, 4vw, 40px) !important;
    }
  }

  @media (max-width: 768px) {
    .form-area { padding: clamp(16px, 2vw, 20px) clamp(14px, 2vw, 18px) !important; }
    .left-panel { padding: clamp(12px, 2vw, 16px) !important; }
  }

  @media (max-width: 480px) {
    .form-area { padding: clamp(14px, 2vw, 16px) !important; }
    .pri-btn { min-height: 48px; padding: clamp(12px, 2vw, 14px) !important; }
  }
    .withdraw-topbar {
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
  }
`;

// ─── DATA ─────────────────────────────────────────────────
const MIN_WITHDRAWAL = 1000;
const MAX_WITHDRAWAL = 500000;

const BANK_COLORS = {
  GTBank: { color: "#E8460A", bg: "linear-gradient(135deg,#1a0800,#3d1200)" },
  "Access Bank": {
    color: "#D91921",
    bg: "linear-gradient(135deg,#1a0000,#3d0000)",
  },
  "Zenith Bank": {
    color: "#E00000",
    bg: "linear-gradient(135deg,#1a0000,#2d0000)",
  },
  "First Bank": {
    color: "#005CA8",
    bg: "linear-gradient(135deg,#000a1a,#001a3d)",
  },
  UBA: { color: "#E20A16", bg: "linear-gradient(135deg,#1a0000,#3d0005)" },
  "Fidelity Bank": {
    color: "#5DAB00",
    bg: "linear-gradient(135deg,#0a1a00,#1a3d00)",
  },
  FCMB: { color: "#009900", bg: "linear-gradient(135deg,#001a00,#003d00)" },
  "Kuda Bank": {
    color: "#4000BF",
    bg: "linear-gradient(135deg,#0a001a,#1a003d)",
  },
  OPay: { color: "#00B140", bg: "linear-gradient(135deg,#001a0a,#003d1a)" },
  Moniepoint: {
    color: "#006CFF",
    bg: "linear-gradient(135deg,#000a1a,#001a3d)",
  },
};
const bankMeta = (name) =>
  BANK_COLORS[name] || {
    color: "#888",
    bg: "linear-gradient(135deg,#111,#1a1a1a)",
  };

// ─── PROGRESS BAR ─────────────────────────────────────────
function ProgressBar({ step }) {
  const steps = ["Amount", "Bank", "Confirm"];
  const cur = ["amount", "bank", "review"].indexOf(step);
  return (
    <div
      style={{ display: "flex", alignItems: "flex-start", marginBottom: 32 }}
    >
      {steps.map((s, i) => (
        <div
          key={s}
          style={{
            display: "flex",
            alignItems: "center",
            flex: i < steps.length - 1 ? 1 : "none",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 5,
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  i < cur
                    ? C.green
                    : i === cur
                      ? "rgba(14,203,129,0.12)"
                      : C.border2,
                border: i === cur ? `1px solid ${C.green}55` : "none",
                boxShadow:
                  i === cur ? "0 0 0 4px rgba(14,203,129,0.06)" : "none",
                transition: "all 0.3s",
              }}
            >
              {i < cur ? (
                <svg width={11} height={11} viewBox="0 0 11 11" fill="none">
                  <path
                    d="M1.5 5.5l2.5 3L9.5 2"
                    stroke="#000"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: i === cur ? C.green : C.muted,
                  }}
                >
                  {i + 1}
                </span>
              )}
            </div>
            <span
              style={{
                fontSize: 9,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                color: i <= cur ? C.green : C.muted,
                whiteSpace: "nowrap",
              }}
            >
              {s}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              style={{
                flex: 1,
                height: 1,
                margin: "0 10px 16px",
                background:
                  i < cur
                    ? `linear-gradient(90deg,${C.green},rgba(14,203,129,0.3))`
                    : C.border,
                transition: "background 0.4s",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── LEFT PANEL ───────────────────────────────────────────
function LeftPanel({ amount, bank, step, ngnBalance }) {
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
          background: `radial-gradient(circle,rgba(14,203,129,0.07),transparent 60%)`,
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      <div
        className="left-panel-title"
        style={{
          fontSize: 10,
          color: C.muted,
          letterSpacing: 3,
          marginBottom: 12,
        }}
      >
        WITHDRAWAL
      </div>
      <div
        className="left-panel-title"
        style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 32,
          letterSpacing: 1,
          lineHeight: 0.9,
          marginBottom: 28,
        }}
      >
        NGN TO
        <br />
        <span style={{ color: C.green }}>YOUR BANK</span>
      </div>

      {/* Balance card */}
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: "16px 18px",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: C.muted,
            letterSpacing: 2,
            marginBottom: 8,
          }}
        >
          AVAILABLE BALANCE
        </div>
        <div
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: 30,
            color: C.green,
            letterSpacing: 1,
            lineHeight: 1,
          }}
        >
          ₦{ngnBalance.toLocaleString()}
        </div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>
          Swift Trade wallet
        </div>
      </div>

      {/* Summary ticket */}
      <div style={{ flex: 1 }}>
        {amount || bank ? (
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
              SUMMARY
            </div>
            <div style={{ padding: "4px 14px" }}>
              {[
                {
                  label: "You Send",
                  val:
                    amount > 0 ? `₦${Number(amount).toLocaleString()}` : null,
                  green: true,
                },
                { label: "Bank", val: bank ? `${bank.name}` : null },
                { label: "Account", val: bank ? `••${bank.number}` : null },
                { label: "Est. Time", val: amount > 0 ? "5–15 minutes" : null },
              ].map((r) => (
                <div
                  key={r.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "9px 0",
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <span style={{ fontSize: 11, color: C.muted, flexShrink: 0 }}>
                    {r.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "'DM Mono',monospace",
                      fontSize: 12,
                      color: r.val ? (r.green ? C.green : "#ccc") : C.muted2,
                      textAlign: "right",
                      wordBreak: "break-word",
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
              padding: "28px 20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <svg
                width={28}
                height={28}
                viewBox="0 0 24 24"
                fill="none"
                stroke={C.muted2}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              </svg>
            </div>
            <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
              Enter an amount to start your withdrawal
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div
        className="left-panel-title"
        style={{
          marginTop: 20,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {[
          {
            icon: (
              <svg
                width={13}
                height={13}
                viewBox="0 0 24 24"
                fill="none"
                stroke={C.green}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            ),
            text: "Arrives in 5–15 minutes",
          },
          {
            icon: (
              <svg
                width={13}
                height={13}
                viewBox="0 0 24 24"
                fill="none"
                stroke={C.muted}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="10" width="18" height="11" rx="2" />
                <path d="M7 10V7a5 5 0 0110 0v3" />
              </svg>
            ),
            text: "All Nigerian banks supported",
          },
          {
            icon: (
              <svg
                width={13}
                height={13}
                viewBox="0 0 24 24"
                fill="none"
                stroke={C.green}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            ),
            text: "No withdrawal fees",
          },
        ].map((t) => (
          <div
            key={t.text}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <span style={{ display: "flex", alignItems: "center" }}>
              {t.icon}
            </span>
            <span style={{ fontSize: 11, color: C.muted }}>{t.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── STEP 1: AMOUNT ───────────────────────────────────────
function StepAmount({ amount, setAmount, onNext, ngnBalance }) {
  const QUICK = [5000, 10000, 50000, 100000, 200000];
  const n = parseFloat(amount) || 0;
  const tooLow = n > 0 && n < MIN_WITHDRAWAL;
  const tooHigh = n > MAX_WITHDRAWAL;
  const overBal = n > ngnBalance;
  const error = tooLow
    ? `Minimum withdrawal is ₦${MIN_WITHDRAWAL.toLocaleString()}`
    : tooHigh
      ? `Maximum withdrawal is ₦${MAX_WITHDRAWAL.toLocaleString()}`
      : overBal
        ? "Amount exceeds your available balance"
        : "";
  const isValid = n >= MIN_WITHDRAWAL && n <= MAX_WITHDRAWAL && n <= ngnBalance;

  return (
    <div className="step-form">
      <div
        style={{
          fontSize: 10,
          color: C.muted,
          letterSpacing: 3,
          marginBottom: 10,
        }}
      >
        STEP 1
      </div>
      <h2
        style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 42,
          letterSpacing: 1,
          lineHeight: 0.9,
          marginBottom: 6,
        }}
      >
        HOW MUCH DO
        <br />
        YOU WANT TO
        <br />
        <span style={{ color: C.green }}>WITHDRAW?</span>
      </h2>
      <p
        style={{
          color: C.muted,
          fontSize: 14,
          fontWeight: 300,
          lineHeight: 1.6,
          marginBottom: 28,
        }}
      >
        Available:{" "}
        <span style={{ color: C.green, fontWeight: 600 }}>
          ₦{ngnBalance.toLocaleString()}
        </span>
      </p>

      {/* Input */}
      <div style={{ position: "relative", marginBottom: error ? 8 : 16 }}>
        <div
          style={{
            position: "absolute",
            left: 16,
            top: "50%",
            transform: "translateY(-50%)",
            fontFamily: "'DM Mono',monospace",
            fontSize: 22,
            color: C.muted,
            pointerEvents: "none",
          }}
        >
          ₦
        </div>
        <input
          className="st-input"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          autoFocus
          placeholder="0"
          style={{
            width: "100%",
            background: C.card2,
            border: `1px solid ${error ? "rgba(246,70,93,0.5)" : C.border2}`,
            borderRadius: 12,
            padding: "16px 16px 16px 40px",
            color: "#fff",
            fontSize: 24,
            fontFamily: "'DM Mono',monospace",
          }}
        />
        {isValid && (
          <div
            style={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              animation: "popIn 0.2s ease",
            }}
          >
            <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
              <circle cx={10} cy={10} r={10} fill={C.green} />
              <path
                d="M5 10l3.5 4L15 7"
                stroke="#000"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      {error && (
        <div
          style={{
            display: "flex",
            gap: 5,
            alignItems: "center",
            fontSize: 12,
            color: C.red,
            marginBottom: 14,
            animation: "fadeIn 0.2s ease",
          }}
        >
          <svg width={12} height={12} viewBox="0 0 12 12">
            <circle cx={6} cy={6} r={6} fill={C.red} />
            <path
              d="M6 3.5v3M6 7.5h.01"
              stroke="#000"
              strokeWidth={1.1}
              strokeLinecap="round"
            />
          </svg>
          {error}
        </div>
      )}

      {/* Quick amounts */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 10,
            color: C.muted,
            letterSpacing: 2,
            marginBottom: 10,
          }}
        >
          QUICK AMOUNTS
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {QUICK.map((q) => (
            <button
              key={q}
              className="amt-btn"
              onClick={() => setAmount(String(q))}
              style={{
                padding: "7px 14px",
                borderRadius: 100,
                background:
                  parseFloat(amount) === q ? "rgba(14,203,129,0.1)" : C.card2,
                border: `1px solid ${parseFloat(amount) === q ? "rgba(14,203,129,0.3)" : C.border2}`,
                color: parseFloat(amount) === q ? C.green : C.muted,
                fontSize: 12,
                fontFamily: "'DM Mono',monospace",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              ₦{q.toLocaleString()}
            </button>
          ))}
          <button
            className="amt-btn"
            onClick={() => setAmount(String(ngnBalance))}
            style={{
              padding: "7px 14px",
              borderRadius: 100,
              background:
                parseFloat(amount) === ngnBalance
                  ? "rgba(14,203,129,0.1)"
                  : C.card2,
              border: `1px solid ${parseFloat(amount) === ngnBalance ? "rgba(14,203,129,0.3)" : C.border2}`,
              color: parseFloat(amount) === ngnBalance ? C.green : C.muted,
              fontSize: 12,
              fontFamily: "'DM Mono',monospace",
              cursor: "pointer",
            }}
          >
            Max
          </button>
        </div>
      </div>

      {/* Fee note */}
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          background: "rgba(14,203,129,0.04)",
          border: "1px solid rgba(14,203,129,0.1)",
          borderRadius: 10,
          padding: "11px 14px",
          marginBottom: 24,
        }}
      >
        <svg
          width={13}
          height={13}
          viewBox="0 0 24 24"
          fill="none"
          stroke={C.green}
          strokeWidth={2}
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span style={{ fontSize: 12, color: C.muted }}>
          Zero withdrawal fees. What you enter is exactly what you receive.
        </span>
      </div>

      <button
        disabled={!isValid}
        onClick={onNext}
        className="pri-btn"
        style={{
          width: "100%",
          background: isValid ? C.green : C.border,
          color: isValid ? "#000" : C.muted,
          fontWeight: 700,
          fontSize: 15,
          padding: "15px",
          borderRadius: 12,
          border: "none",
          fontFamily: "'Outfit',sans-serif",
          cursor: "pointer",
        }}
      >
        Continue →
      </button>
    </div>
  );
}

// ─── STEP 2: BANK ─────────────────────────────────────────
function StepBank({ selected, onSelect, onNext, banks }) {
  return (
    <div className="step-form">
      <div
        style={{
          fontSize: 10,
          color: C.muted,
          letterSpacing: 3,
          marginBottom: 10,
        }}
      >
        STEP 2
      </div>
      <h2
        style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 42,
          letterSpacing: 1,
          lineHeight: 0.9,
          marginBottom: 6,
        }}
      >
        SEND TO
        <br />
        <span style={{ color: C.green }}>WHICH ACCOUNT?</span>
      </h2>
      <p
        style={{
          color: C.muted,
          fontSize: 14,
          fontWeight: 300,
          lineHeight: 1.6,
          marginBottom: 28,
        }}
      >
        Select where you want to receive your naira.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginBottom: 20,
        }}
      >
        {banks.length === 0 ? (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: C.muted,
              border: `1px dashed ${C.border}`,
              borderRadius: 12,
            }}
          >
            No bank accounts linked. Please link a bank account in Settings.
          </div>
        ) : (
          banks.map((b) => {
            const meta = bankMeta(b.name);
            const isSel = selected?.id === b.id;
            return (
              <button
                key={b.id}
                className={`bank-card${isSel ? " sel" : ""}`}
                onClick={() => onSelect(b)}
                style={{
                  width: "100%",
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  padding: "16px 18px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  fontFamily: "'Outfit',sans-serif",
                  textAlign: "left",
                }}
              >
                {/* Bank logo */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    flexShrink: 0,
                    background: meta.bg,
                    border: `1px solid ${meta.color}22`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Bebas Neue',sans-serif",
                      fontSize: 14,
                      color: meta.color,
                      letterSpacing: 1,
                    }}
                  >
                    {b.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 3,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: isSel ? C.green : "#ddd",
                      }}
                    >
                      {b.name}
                    </span>
                    {b.isDefault && (
                      <span
                        style={{
                          fontSize: 9,
                          padding: "2px 7px",
                          borderRadius: 100,
                          background: "rgba(14,203,129,0.08)",
                          color: C.green,
                          border: "1px solid rgba(14,203,129,0.2)",
                          letterSpacing: 1,
                          fontWeight: 600,
                        }}
                      >
                        DEFAULT
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <span
                      style={{
                        fontFamily: "'DM Mono',monospace",
                        fontSize: 12,
                        color: C.muted,
                      }}
                    >
                      ••••{b.number}
                    </span>
                    <span style={{ fontSize: 11, color: C.muted2 }}>
                      {b.type}
                    </span>
                  </div>
                </div>

                {isSel ? (
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: C.green,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      animation: "popIn 0.2s ease",
                    }}
                  >
                    <svg width={10} height={10} viewBox="0 0 10 10" fill="none">
                      <path
                        d="M1.5 5l2.5 3L8.5 2"
                        stroke="#000"
                        strokeWidth={1.2}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                ) : (
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      border: `1px solid ${C.border2}`,
                      flexShrink: 0,
                    }}
                  />
                )}
              </button>
            );
          })
        )}
      </div>

      <button
        disabled={!selected}
        onClick={onNext}
        className="pri-btn"
        style={{
          width: "100%",
          background: selected ? C.green : C.border,
          color: selected ? "#000" : C.muted,
          fontWeight: 700,
          fontSize: 15,
          padding: "15px",
          borderRadius: 12,
          border: "none",
          fontFamily: "'Outfit',sans-serif",
          cursor: "pointer",
        }}
      >
        Continue →
      </button>
    </div>
  );
}

// ─── STEP 3: REVIEW ───────────────────────────────────────
function StepReview({ amount, bank, onConfirm, loading, pin, setPin, error }) {
  const meta = bankMeta(bank.name);
  return (
    <div className="step-form">
      <div
        style={{
          fontSize: 10,
          color: C.muted,
          letterSpacing: 3,
          marginBottom: 10,
        }}
      >
        STEP 3
      </div>
      <h2
        style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 42,
          letterSpacing: 1,
          lineHeight: 0.9,
          marginBottom: 24,
        }}
      >
        CONFIRM YOUR
        <br />
        <span style={{ color: C.green }}>WITHDRAWAL</span>
      </h2>

      {/* Amount hero */}
      <div
        style={{
          background: "rgba(14,203,129,0.05)",
          border: "1px solid rgba(14,203,129,0.15)",
          borderRadius: 14,
          padding: "20px 22px",
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              color: C.green,
              letterSpacing: 2,
              marginBottom: 6,
            }}
          >
            YOU RECEIVE
          </div>
          <div
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 40,
              color: "#fff",
              letterSpacing: 1,
              lineHeight: 1,
            }}
          >
            ₦{Number(amount).toLocaleString()}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(14,203,129,0.08)",
            border: "1px solid rgba(14,203,129,0.15)",
          }}
        >
          <svg
            width={22}
            height={22}
            viewBox="0 0 24 24"
            fill="none"
            stroke={C.green}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
          </svg>
        </div>
      </div>

      {/* Bank preview */}
      <div
        style={{
          background: meta.bg,
          border: `1px solid ${meta.color}22`,
          borderRadius: 12,
          padding: "16px 18px",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 9,
            flexShrink: 0,
            background: "rgba(0,0,0,0.3)",
            border: `1px solid ${meta.color}22`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 13,
              color: meta.color,
              letterSpacing: 1,
            }}
          >
            {bank.name.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>
            {bank.name}
          </div>
          <div
            style={{
              fontFamily: "'DM Mono',monospace",
              fontSize: 12,
              color: "rgba(255,255,255,0.6)",
            }}
          >
            ••••{bank.number} · {bank.type}
          </div>
        </div>
      </div>

      {/* Details */}
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 20,
        }}
      >
        {[
          ["Amount", `₦${Number(amount).toLocaleString()}`],
          ["Fee", "₦0.00 — Free"],
          ["You Receive", `₦${Number(amount).toLocaleString()}`],
          ["Est. Time", "5–15 minutes"],
        ].map(([k, v]) => (
          <div
            key={k}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              borderBottom: `1px solid ${C.border}`,
              background:
                k === "You Receive" ? "rgba(14,203,129,0.04)" : "transparent",
            }}
          >
            <span
              style={{
                fontSize: 13,
                color: k === "You Receive" ? C.green : C.muted,
              }}
            >
              {k}
            </span>
            <span
              style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: 13,
                color:
                  k === "You Receive" ? C.green : k === "Fee" ? "#888" : "#ccc",
                fontWeight: k === "You Receive" ? 600 : 400,
              }}
            >
              {v}
            </span>
          </div>
        ))}
      </div>

      {/* PIN Input */}
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <div
          style={{
            fontSize: 10,
            color: C.muted,
            letterSpacing: 2,
            marginBottom: 10,
          }}
        >
          TRANSACTION PIN
        </div>
        <input
          type="password"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          style={{
            width: 140,
            background: C.card2,
            border: `1px solid ${C.border2}`,
            color: "#fff",
            padding: "14px",
            borderRadius: 8,
            letterSpacing: 16,
            fontFamily: "'DM Mono',monospace",
            fontSize: 24,
            textAlign: "center",
          }}
          placeholder="••••"
        />
        {error && (
          <div
            style={{
              color: C.red,
              fontSize: 12,
              marginTop: 10,
              animation: "fadeIn 0.2s ease",
            }}
          >
            {error}
          </div>
        )}
      </div>

      <button
        onClick={onConfirm}
        disabled={loading || pin.length !== 4}
        className="pri-btn"
        style={{
          width: "100%",
          background: C.green,
          color: "#000",
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
          cursor: loading || pin.length !== 4 ? "not-allowed" : "pointer",
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
            Processing...
          </>
        ) : (
          "Confirm Withdrawal ✓"
        )}
      </button>

      <p
        style={{
          textAlign: "center",
          fontSize: 11,
          color: C.muted2,
          marginTop: 12,
        }}
      >
        By confirming you agree to Swift Trade's withdrawal terms
      </p>
    </div>
  );
}

// ─── STEP 4: SUCCESS ──────────────────────────────────────
function StepDone({ amount, bank, refId, onReset }) {
  return (
    <div
      className="step-form"
      style={{ textAlign: "center", padding: "16px 0" }}
    >
      <div
        style={{
          position: "relative",
          width: 96,
          height: 96,
          margin: "0 auto 24px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -8,
            borderRadius: "50%",
            border: `2px solid rgba(14,203,129,0.4)`,
            animation: "ripple 0.8s ease-out",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: -8,
            borderRadius: "50%",
            border: `2px solid rgba(14,203,129,0.2)`,
            animation: "ripple 0.8s 0.25s ease-out",
          }}
        />
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "rgba(14,203,129,0.1)",
            border: `2px solid ${C.green}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "successIn 0.5s ease",
            boxShadow: `0 0 40px rgba(14,203,129,0.2)`,
          }}
        >
          <svg width={40} height={40} viewBox="0 0 40 40" fill="none">
            <path
              d="M8 20l8 9L32 12"
              stroke={C.green}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={70}
              style={{
                animation: "checkDraw 0.5s 0.3s ease forwards",
                strokeDashoffset: 70,
              }}
            />
          </svg>
        </div>
      </div>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          background: "rgba(14,203,129,0.08)",
          border: "1px solid rgba(14,203,129,0.2)",
          borderRadius: 100,
          padding: "4px 14px",
          fontSize: 10,
          color: C.green,
          letterSpacing: 3,
          marginBottom: 16,
        }}
      >
        WITHDRAWAL SUBMITTED
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
        ON ITS
        <br />
        <span style={{ color: C.green }}>WAY TO YOU!</span>
      </h2>

      <p
        style={{
          color: C.muted,
          fontSize: 14,
          lineHeight: 1.7,
          maxWidth: 320,
          margin: "0 auto 24px",
        }}
      >
        <span style={{ color: C.green, fontWeight: 600 }}>
          ₦{Number(amount).toLocaleString()}
        </span>{" "}
        is being sent to your {bank.name} account ending in ••{bank.number}.
        Expected within 5–15 minutes.
      </p>

      {/* Ref */}
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: "16px 18px",
          marginBottom: 24,
          textAlign: "left",
        }}
      >
        <div
          style={{
            fontSize: 9,
            color: C.muted,
            letterSpacing: 2,
            marginBottom: 8,
          }}
        >
          REFERENCE ID
        </div>
        <div
          style={{
            fontFamily: "'DM Mono',monospace",
            fontSize: 18,
            color: C.green,
            fontWeight: 500,
            marginBottom: 4,
          }}
        >
          {refId}
        </div>
        <div style={{ fontSize: 11, color: C.muted }}>
          Save this to track your withdrawal
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <button
          onClick={onReset}
          className="pri-btn"
          style={{
            background: C.green,
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
          New Withdrawal
        </button>
        <button
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
          }}
        >
          Dashboard →
        </button>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────
export default function Withdraw() {
  const [step, setStep] = useState("amount");
  const [amount, setAmount] = useState("");
  const [bank, setBank] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refId, setRefId] = useState("");
  const [ngnBalance, setNgnBalance] = useState(0);
  const [banks, setBanks] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [pinIsSet, setPinIsSet] = useState(null);
  const [pin, setPin] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        setFetchError("");
        const [balRes, banksRes] = await Promise.all([
          api.get("/wallets/balance"),
          api.get("/wallets/bank-accounts"),
        ]);
        setNgnBalance(Number(balRes.data.balance) || 0);
        setPinIsSet(balRes.data.pin_is_set);
        const bankData = Array.isArray(banksRes.data) ? banksRes.data : [];
        const formattedBanks = bankData.map((b) => ({
          id: b.id,
          name: b.bank_name,
          number: b.account_number.slice(-4),
          account: b.account_number,
          type: "Savings",
          isDefault: b.is_default,
        }));
        setBanks(formattedBanks);
        const defaultBank =
          formattedBanks.find((b) => b.isDefault) || formattedBanks[0] || null;
        setBank(defaultBank);
      } catch (err) {
        console.error("Failed to fetch withdrawal data:", err);
        setFetchError("Could not load wallet data. Please try again.");
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const handleConfirm = async () => {
    setLoading(true);
    setSubmitError("");
    try {
      const res = await api.post("/transactions/withdraw", {
        amount: parseFloat(amount),
        bank_account_id: bank.id,
        pin: pin,
      });
      setRefId(res.data.reference || "WD-SUCCESS");
      setStep("done");
    } catch (err) {
      console.error(err);
      setSubmitError(
        err.response?.data?.detail || "Withdrawal failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("amount");
    setAmount("");
    setRefId("");
    setPin("");
    setSubmitError("");
    setBank(banks.find((b) => b.isDefault) || banks[0] || null);
  };

  const next = () => {
    if (step === "amount") setStep("bank");
    else if (step === "bank") setStep("review");
  };

  const back = () => {
    if (step === "bank") setStep("amount");
    if (step === "review") setStep("bank");
  };

  return (
    <div className="withdraw-container">
      {isLoadingData ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.muted,
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              border: "2px solid rgba(14,203,129,0.2)",
              borderTopColor: C.green,
              animation: "spin 0.8s linear infinite",
            }}
          />
        </div>
      ) : fetchError ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            color: C.muted,
            padding: 32,
          }}
        >
          <svg
            width={32}
            height={32}
            viewBox="0 0 24 24"
            fill="none"
            stroke={C.red}
            strokeWidth={1.5}
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div style={{ fontSize: 14, textAlign: "center" }}>{fetchError}</div>
          <button
            onClick={() => window.location.reload()}
            className="pri-btn"
            style={{
              background: C.green,
              color: "#000",
              fontWeight: 700,
              fontSize: 13,
              padding: "10px 24px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              fontFamily: "'Outfit',sans-serif",
            }}
          >
            Retry
          </button>
        </div>
      ) : pinIsSet === false ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: 32,
            background: C.bg,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "rgba(245,166,35,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 8,
            }}
          >
            <svg
              width={36}
              height={36}
              viewBox="0 0 24 24"
              fill="none"
              stroke={C.amber}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <h2
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 32,
              letterSpacing: 1,
              margin: 0,
              textAlign: "center",
            }}
          >
            SECURITY PIN REQUIRED
          </h2>
          <p
            style={{
              color: C.muted,
              fontSize: 14,
              textAlign: "center",
              maxWidth: 340,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            You must create a 4-digit Transaction PIN to secure your NGN
            withdrawals.
          </p>
          <button
            onClick={() => (window.location.href = "/dashboard/settings")}
            className="pri-btn"
            style={{
              background: C.green,
              color: "#000",
              fontWeight: 700,
              fontSize: 14,
              padding: "12px 28px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              fontFamily: "'Outfit',sans-serif",
              marginTop: 8,
            }}
          >
            Go to Settings →
          </button>
        </div>
      ) : (
        <>
          <LeftPanel
            amount={parseFloat(amount) || 0}
            bank={bank}
            step={step}
            ngnBalance={ngnBalance}
          />

          {/* Right */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Topbar */}
            <div
              className="withdraw-topbar"
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
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {step !== "amount" && step !== "done" && (
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
                    <svg
                      width={14}
                      height={14}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                    >
                      <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                    Back
                  </button>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: C.green,
                    animation: "pulse 2s infinite",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontFamily: "'DM Mono',monospace",
                    fontSize: 9,
                    color: C.green,
                  }}
                >
                  INSTANT TRANSFER
                </span>
              </div>
            </div>

            {/* Scrollable form */}
            <div className="form-area">
              <div style={{ maxWidth: 520, margin: "0 auto" }}>
                {step !== "done" && <ProgressBar step={step} />}

                {step === "amount" && (
                  <StepAmount
                    amount={amount}
                    setAmount={setAmount}
                    onNext={next}
                    ngnBalance={ngnBalance}
                  />
                )}

                {step === "bank" && (
                  <StepBank
                    selected={bank}
                    onSelect={setBank}
                    onNext={next}
                    banks={banks}
                  />
                )}

                {step === "review" && (
                  <StepReview
                    amount={amount}
                    bank={bank}
                    onConfirm={handleConfirm}
                    loading={loading}
                    pin={pin}
                    setPin={setPin}
                    error={submitError}
                  />
                )}

                {step === "done" && (
                  <StepDone
                    amount={amount}
                    bank={bank}
                    refId={refId}
                    onReset={handleReset}
                  />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
