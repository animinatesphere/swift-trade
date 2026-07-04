import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
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
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes ticker  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.7)} }
  @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes slideR  { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }

  .ticker-wrap { animation:ticker 34s linear infinite; }
  .ticker-wrap:hover { animation-play-state:paused; }

  .rate-row:hover { background:#181818 !important; }
  .rate-row { transition:background 0.15s; }

  .trade-btn:hover:not(:disabled) { background:#0fdf8e !important; transform:translateY(-1px); box-shadow:0 10px 28px rgba(14,203,129,0.3) !important; }
  .trade-btn:disabled { opacity:0.35 !important; cursor:not-allowed !important; }
  .trade-btn { transition:all 0.2s; }

  .ghost-btn:hover { border-color:#444 !important; color:#ccc !important; }
  .ghost-btn { transition:all 0.18s; }

  .txn-row:hover { background:#181818 !important; }
  .txn-row { transition:background 0.15s; }

  .copy-btn:hover { color:#0ECB81 !important; }
  .copy-btn { transition:color 0.15s; }

  .icon-btn:hover { background:rgba(255,255,255,0.06) !important; }
  .icon-btn { transition:background 0.15s; }

  .coin-btn:hover { background:#1c1c1c !important; }
  .coin-btn.sel   { background:rgba(14,203,129,0.07) !important; border-color:rgba(14,203,129,0.3) !important; }
  .coin-btn { transition:all 0.15s; }

  .card-in { animation:fadeUp 0.4s ease both; }
  .pending-in { animation:slideR 0.35s ease both; }
  .soon { opacity:0.38; cursor:not-allowed !important; pointer-events:none; }

  .kyc-banner:hover { border-color:rgba(245,166,35,0.4) !important; }
  .kyc-banner-rejected:hover { border-color:rgba(246,70,93,0.4) !important; }
  .kyc-banner-submitted:hover { border-color:rgba(245,166,35,0.4) !important; }
  .kyc-banner-unverified:hover { border-color:rgba(245,166,35,0.4) !important; }
  .kyc-banner { transition:border-color 0.2s; }

  @media (max-width: 1024px) {
    .dashboard-topbar { padding: clamp(12px, 3vw, 16px) !important; }
    .topbar-greet { font-size: clamp(10px, 2vw, 12px) !important; display: inline !important; }
    .topbar-email { font-size: clamp(9px, 1.8vw, 11px) !important; display: inline-block !important; max-width: 90px !important; }
    .trade-btn { display: none !important; }
    .topbar-status { margin-left: 0 !important; font-size: clamp(10px, 2vw, 12px) !important; }
    .stats-grid { grid-template-columns: 1fr !important; gap: clamp(12px, 3vw, 20px) !important; }
    .content-row { flex-direction: column !important; align-items: stretch !important; gap: clamp(12px, 3vw, 20px) !important; }
    .rates-panel { width: 100% !important; }
    .user-pill { padding: 4px !important; }
  }

  @media (max-width: 768px) {
    .padded-card { padding: clamp(16px, 3vw, 20px) !important; }
    .dashboard-content { padding: clamp(14px, 3vw, 18px) clamp(14px, 3vw, 20px) !important; gap: clamp(10px, 2vw, 14px) !important; }
    .dashboard-topbar { gap: clamp(8px, 2vw, 12px) !important; }
    .topbar-status span { font-size: clamp(10px, 2vw, 12px) !important; }
    .rates-panel { display: none !important; }
  }

  @media (max-width: 640px) {
    .topbar-status span:last-child { display: none !important; }
    .padded-card { padding: clamp(14px, 2vw, 18px) !important; }
    /* Mobile txn history: hide the desktop scrollable table wrapper */
    .txn-desktop { display: none !important; }
    /* Show mobile card list instead */
    .txn-mobile { display: block !important; }
    /* Fix dashboard content overflow */
    .dashboard-content { overflow-x: hidden !important; }
  }

  @media (max-width: 480px) {
    .stats-grid { grid-template-columns: 1fr !important; gap: clamp(12px, 3vw, 16px) !important; }
    .padded-card { padding: clamp(12px, 2vw, 16px) !important; }
    .dashboard-content { padding: clamp(10px, 3vw, 14px) !important; gap: clamp(8px, 2vw, 10px) !important; }
    .ticker-wrap { font-size: clamp(11px, 2vw, 13px) !important; }
    .icon-btn { width: 38px !important; height: 38px !important; }
  }
`;

// ─── DATA ─────────────────────────────────────────────────
const COINS = [
  {
    id: "USDT",
    name: "Tether",
    icon: "₮",
    color: "#26A17B",
    bg: "rgba(38,161,123,0.15)",
    rate: 1592,
    network: "TRC20",
  },
  {
    id: "BTC",
    name: "Bitcoin",
    icon: "₿",
    color: "#F7931A",
    bg: "rgba(247,147,26,0.15)",
    rate: 98240000,
    network: "BTC",
  },
  {
    id: "ETH",
    name: "Ethereum",
    icon: "Ξ",
    color: "#627EEA",
    bg: "rgba(98,126,234,0.15)",
    rate: 3420000,
    network: "ERC20",
  },
  {
    id: "USDC",
    name: "USD Coin",
    icon: "◎",
    color: "#0072FF",
    bg: "rgba(0,114,255,0.15)",
    rate: 1590,
    network: "ERC20",
  },
  {
    id: "BNB",
    name: "BNB",
    icon: "⬡",
    color: "#F3BA2F",
    bg: "rgba(243,186,47,0.15)",
    rate: 920000,
    network: "BEP20",
  },
  {
    id: "SOL",
    name: "Solana",
    icon: "◎",
    color: "#9945FF",
    bg: "rgba(153,69,255,0.15)",
    rate: 218400,
    network: "SOL",
  },
];

const TICKERS = [
  { s: "USDT/NGN", p: "₦1,592", c: "-0.3%", up: false },
  { s: "BTC/NGN", p: "₦98,240,000", c: "+2.4%", up: true },
  { s: "ETH/NGN", p: "₦3,420,000", c: "+1.8%", up: true },
  { s: "USDC/NGN", p: "₦1,590", c: "+0.1%", up: true },
  { s: "BNB/NGN", p: "₦920,000", c: "+3.1%", up: true },
  { s: "SOL/NGN", p: "₦218,400", c: "-1.2%", up: false },
];

// ─── KYC BANNER ───────────────────────────────────────────
function KYCBanner({ status, rejectionReason }) {
  if (!status || status === "verified") return null;

  const cfg = {
    unverified: {
      color: C.amber,
      bg: "rgba(245,166,35,0.06)",
      border: "rgba(245,166,35,0.2)",
      cls: "kyc-banner-unverified",
      icon: (
        <svg
          width={15}
          height={15}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#F5A623"
          strokeWidth={2}
          strokeLinecap="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: "Identity Verification Required",
      message: "Complete KYC to unlock withdrawals and full platform access.",
      cta: "Verify Now →",
    },
    submitted: {
      color: C.amber,
      bg: "rgba(245,166,35,0.05)",
      border: "rgba(245,166,35,0.15)",
      cls: "kyc-banner-submitted",
      icon: (
        <svg
          width={15}
          height={15}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#F5A623"
          strokeWidth={2}
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      title: "KYC Pending Review",
      message:
        "Your documents are being reviewed. This takes 1–3 business days.",
      cta: "View Status →",
    },
    resubmission: {
      color: C.red,
      bg: "rgba(246,70,93,0.06)",
      border: "rgba(246,70,93,0.2)",
      cls: "kyc-banner-rejected",
      icon: (
        <svg
          width={15}
          height={15}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#F6465D"
          strokeWidth={2}
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      ),
      title: "KYC Resubmission Needed",
      message: rejectionReason
        ? `Reason: ${rejectionReason}`
        : "Your submission needs changes. Please resubmit with correct documents.",
      cta: "Resubmit →",
    },
  }[status];

  if (!cfg) return null;

  return (
    <Link to="/dashboard/kyc" style={{ textDecoration: "none", display: "block", marginBottom: 4 }}>
      <div
        className={`card-in padded-card kyc-banner ${cfg.cls}`}
        style={{
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
          borderRadius: 12,
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          animationDelay: "0s",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            flexShrink: 0,
            background: `${cfg.color}18`,
            border: `1px solid ${cfg.color}33`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {cfg.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: cfg.color,
              marginBottom: 2,
            }}
          >
            {cfg.title}
          </div>
          <div
            style={{
              fontSize: 11,
              color: C.muted,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {cfg.message}
          </div>
        </div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: cfg.color,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {cfg.cta}
        </div>
      </div>
    </Link>
  );
}

// ─── TICKER ───────────────────────────────────────────────
function Ticker() {
  const d = [...TICKERS, ...TICKERS];
  return (
    <div
      style={{
        background: "#060606",
        borderBottom: `1px solid ${C.border}`,
        overflow: "hidden",
        padding: "8px 0",
        flexShrink: 0,
      }}
    >
      <div
        className="ticker-wrap"
        style={{ display: "flex", width: "max-content" }}
      >
        {d.map((t, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "0 20px",
              borderRight: `1px solid ${C.border}`,
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: 11,
                color: "#777",
              }}
            >
              {t.s}
            </span>
            <span
              style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: 11,
                color: "#555",
              }}
            >
              {t.p}
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: t.up ? C.green : C.red,
              }}
            >
              {t.c}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── STATS ────────────────────────────────────────────────
function Stats({ balance, stats, loading }) {
  const navigate = useNavigate();
  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });

  const items = [
    {
      label: "NGN Balance",
      val: `₦${Number(balance || 0).toLocaleString("en-NG", { maximumFractionDigits: 2 })}`,
      sub: "Available to withdraw",
      col: C.green,
      icon: (
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke={C.green}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="10" width="18" height="11" rx="2" />
          <path d="M7 10V7a5 5 0 0110 0v3" />
        </svg>
      ),
      highlight: true,
    },
    {
      label: "Trades Completed",
      val: String(stats?.completedTrades || 0),
      sub: "Successfully",
      col: "#aaa",
      icon: (
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#aaa"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      ),
    },
    {
      label: "This Month",
      val: `₦${Number(stats?.volumeThisMonth || 0).toLocaleString("en-NG", { maximumFractionDigits: 2 })}`,
      sub: currentMonth,
      col: C.amber,
      icon: (
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke={C.amber}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
  ];
  return (
    <div
      className="stats-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 12,
      }}
    >
      {items.map((s, i) => (
        <div
          key={s.label}
          className="card-in padded-card"
          style={{
            background: s.highlight
              ? "linear-gradient(135deg,rgba(14,203,129,0.1),rgba(14,203,129,0.04))"
              : C.card,
            border: `1px solid ${s.highlight ? "rgba(14,203,129,0.25)" : C.border}`,
            borderRadius: 12,
            padding: "14px 16px",
            animationDelay: `${i * 0.06}s`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {s.highlight && (
            <div
              style={{
                position: "absolute",
                top: -20,
                right: -20,
                width: 80,
                height: 80,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle,rgba(14,203,129,0.12),transparent 70%)",
                pointerEvents: "none",
              }}
            />
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: s.highlight ? C.green : C.muted,
                letterSpacing: 1,
              }}
            >
              {s.label.toUpperCase()}
            </span>
            <span style={{ fontSize: 16 }}>{s.icon}</span>
          </div>
          <div
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: "clamp(20px, 5vw, 24px)",
              color: s.col,
              letterSpacing: 1,
              lineHeight: 1,
            }}
          >
            {s.val}
          </div>
          <div
            style={{
              fontSize: 11,
              color: s.highlight ? C.green : C.muted,
              marginTop: 4,
            }}
          >
            {s.sub}
          </div>
          {s.highlight && loading && (
            <div style={{ position:"absolute", inset:0, background:"rgba(6,6,6,0.55)", backdropFilter:"blur(2px)", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:12, zIndex:5 }}>
              <div style={{ width:20, height:20, borderRadius:"50%", border:"2px solid rgba(14,203,129,0.2)", borderTopColor:C.green, animation:"spin 0.8s linear infinite" }}/>
            </div>
          )}
          {s.highlight && (
            <button
              onClick={() => navigate("/dashboard/withdraw")}
              style={{
                marginTop: 12,
                background: "rgba(14,203,129,0.12)",
                border: "1px solid rgba(14,203,129,0.25)",
                borderRadius: 7,
                padding: "5px 12px",
                color: C.green,
                fontSize: 11,
                fontWeight: 600,
                fontFamily: "'Outfit',sans-serif",
                cursor: "pointer",
              }}
            >
              Withdraw →
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── STATUS META ──────────────────────────────────────────
function statusMeta(status) {
  if (status === "completed" || status === "success" || status === "converted") {
    return { label: "Completed", color: C.green, bg: "rgba(14,203,129,0.08)" };
  }
  if (status === "failed" || status === "reversed") {
    return { label: "Failed", color: C.red, bg: "rgba(246,70,93,0.08)" };
  }
  return { label: "Pending", color: C.amber, bg: "rgba(245,166,35,0.08)" };
}

// ─── HISTORY TABLE ────────────────────────────────────────
function History({ transactions, loading }) {
  const navigate = useNavigate();
  const isEmpty = !transactions || transactions.length === 0;

  const EmptyState = () => (
    <div style={{ padding: "30px", textAlign: "center", color: C.muted, fontSize: 12 }}>
      No recent transactions
    </div>
  );

  return (
    <div
      className="card-in"
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        overflow: "hidden",
        animationDelay: "0.15s",
        flex: 1,
        minWidth: 0,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderBottom: `1px solid ${C.border}` }}>
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>TRANSACTION HISTORY</span>
        <span style={{ fontSize: 11, color: C.green, cursor: "pointer" }} onClick={() => navigate("/dashboard/txn")}>View all →</span>
      </div>

      <div style={{ position: "relative", minHeight: 200, flex: 1 }}>
        {loading && (
          <div style={{ position:"absolute", inset:0, background:"rgba(16,16,16,0.6)", backdropFilter:"blur(2px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:10 }}>
            <div style={{ width:24, height:24, borderRadius:"50%", border:"2px solid rgba(14,203,129,0.2)", borderTopColor:C.green, animation:"spin 0.8s linear infinite" }}/>
          </div>
        )}

      {/* ─── DESKTOP TABLE (hidden on mobile via CSS) ─── */}
      <div className="txn-desktop" style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <div style={{ minWidth: 500 }}>
          {/* header row */}
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1.2fr", padding: "8px 18px", borderBottom: `1px solid ${C.border}` }}>
            {["Transaction", "You Sent", "You Received", "Date"].map((h) => (
              <span key={h} style={{ fontSize: 9, color: C.muted, letterSpacing: 2, textTransform: "uppercase" }}>{h}</span>
            ))}
          </div>
          {isEmpty && <EmptyState />}
          {(transactions || []).slice(0, 5).map((t, i) => {
            const isWD = t.type === "withdrawal";
            const cDef = COINS.find((c) => c.id.toLowerCase() === t.coin?.toLowerCase()) || COINS[0];
            const st = statusMeta(t.status);
            return (
              <div key={t.id} className="txn-row"
                style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1.2fr", padding: "12px 18px", borderBottom: `1px solid ${C.border}`, alignItems: "center", cursor: "pointer", animationDelay: `${i * 0.04}s` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: isWD ? "rgba(246,70,93,0.1)" : cDef.bg, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: isWD ? C.red : cDef.color }}>{isWD ? "↑" : cDef.icon}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{isWD ? "Bank Withdrawal" : `${cDef.id}/NGN`}</div>
                    <div style={{ fontSize: 10, color: C.muted }}>{t.ref}</div>
                  </div>
                </div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "#bbb" }}>
                  {isWD ? "—" : `${Number(t.cryptoAmt).toLocaleString(undefined, { maximumFractionDigits: 6 })} ${cDef.id}`}
                </div>
                <div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: isWD ? C.red : C.green }}>
                    {isWD ? "-" : ""}₦{Number(t.ngnAmt).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                  {!isWD && t.rate && (
                    <div style={{ fontSize: 10, color: C.muted }}>Rate: ₦{Number(t.rate).toLocaleString()} / $</div>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 11, color: C.muted }}>{new Date(t.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}</div>
                  <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 100, background: st.bg, color: st.color, letterSpacing: 1, textTransform: "uppercase" }}>{st.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── MOBILE CARDS (shown only on mobile via CSS) ─── */}
      <div className="txn-mobile">
        {isEmpty && <EmptyState />}
        {(transactions || []).slice(0, 5).map((t, i) => {
          const isWD = t.type === "withdrawal";
          const cDef = COINS.find((c) => c.id.toLowerCase() === t.coin?.toLowerCase()) || COINS[0];
          const st = statusMeta(t.status);
          return (
            <div key={t.id} className="txn-row"
              style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}>
              {/* Row 1: coin info + status badge */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: isWD ? "rgba(246,70,93,0.1)" : cDef.bg, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: isWD ? C.red : cDef.color }}>{isWD ? "↑" : cDef.icon}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{isWD ? "Bank Withdrawal" : `${cDef.id}/NGN`}</div>
                    <div style={{ fontSize: 10, color: C.muted, fontFamily: "'DM Mono',monospace" }}>{t.ref}</div>
                  </div>
                </div>
                <span style={{ fontSize: 9, padding: "3px 8px", borderRadius: 100, background: st.bg, color: st.color, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600 }}>{st.label}</span>
              </div>
              {/* Row 2: amounts */}
              {isWD ? (
                <div>
                  <div style={{ fontSize: 9, color: C.muted, letterSpacing: 1, marginBottom: 2 }}>AMOUNT WITHDRAWN</div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: C.red, fontWeight: 600 }}>
                    -₦{Number(t.ngnAmt).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div>
                    <div style={{ fontSize: 9, color: C.muted, letterSpacing: 1, marginBottom: 2 }}>YOU SENT</div>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "#bbb" }}>
                      {Number(t.cryptoAmt).toLocaleString(undefined, { maximumFractionDigits: 6 })} {cDef.id}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 9, color: C.muted, letterSpacing: 1, marginBottom: 2 }}>YOU RECEIVED</div>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: C.green, fontWeight: 600 }}>₦{Number(t.ngnAmt).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  </div>
                </div>
              )}
              {/* Row 3: date + rate */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <div style={{ fontSize: 10, color: C.muted }}>{new Date(t.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
                {!isWD && t.rate && (
                  <div style={{ fontSize: 10, color: C.muted }}>Rate: ₦{Number(t.rate).toLocaleString()} / $</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}

// ─── RATES PANEL ──────────────────────────────────────────
function RatesPanel({ onTrade, liveCoins, loading }) {
  const rates = liveCoins || COINS;
  return (
    <div
      className="card-in"
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        overflow: "hidden",
        animationDelay: "0.2s",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 16px",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>
          LIVE RATES
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {loading ? (
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                border: "1.5px solid rgba(14,203,129,0.2)",
                borderTopColor: C.green,
                animation: "spin 0.8s linear infinite",
              }}
            />
          ) : (
            <>
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
                LIVE
              </span>
            </>
          )}
        </div>
      </div>
      <div style={{ position: "relative" }}>
        {loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(16,16,16,0.6)",
              backdropFilter: "blur(2px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
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
        )}
        {rates.map((c) => (
          <div
            key={c.id}
            className="rate-row"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "11px 16px",
              borderBottom: `1px solid ${C.border}`,
              cursor: "pointer",
            }}
            onClick={() => onTrade(c)}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: c.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: c.color,
                flexShrink: 0,
              }}
            >
              {c.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{c.id}/NGN</div>
              <div style={{ fontSize: 10, color: C.muted }}>{c.network}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 12,
                  color: "#ccc",
                }}
              >
                ₦{c.rate.toLocaleString("en-NG", { maximumFractionDigits: 0 })}
              </div>
              <div style={{ fontSize: 10, color: C.green }}>Trade →</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TOPBAR ───────────────────────────────────────────────
function Topbar({ user, onNewTrade }) {
  const navigate = useNavigate();
  const h = new Date().getHours();
  const greet =
    h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.full_name?.split(" ")[0] || "User";
  const initials =
    user?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "U";

  return (
    <div
      className="dashboard-topbar"
      style={{
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 22px",
        borderBottom: `1px solid ${C.border}`,
        flexShrink: 0,
        background: "rgba(6,6,6,0.95)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <span
          className="topbar-greet"
          style={{ fontSize: 13, color: C.muted, whiteSpace: "nowrap" }}
        >
          {greet},{" "}
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>
          {firstName}
        </span>
        <span
          className="topbar-status"
          style={{
            marginLeft: 6,
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: "rgba(14,203,129,0.06)",
            border: "1px solid rgba(14,203,129,0.15)",
            borderRadius: 100,
            padding: "3px 8px",
          }}
        >
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
              letterSpacing: 1,
            }}
          >
            LIVE
          </span>
        </span>
      </div>
      <div
        style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}
      >
        <button
          onClick={onNewTrade}
          className="trade-btn"
          style={{
            background: C.green,
            color: "#000",
            fontWeight: 700,
            fontSize: 12,
            padding: "7px 16px",
            borderRadius: 8,
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontFamily: "'Outfit',sans-serif",
            cursor: "pointer",
          }}
        >
          <svg
            width={12}
            height={12}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="trade-btn-text">New Trade</span>
        </button>
        <button
          className="icon-btn"
          onClick={() => navigate("/dashboard/notifications")}
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: C.card,
            border: `1px solid ${C.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: C.muted,
            position: "relative",
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
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <span
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: C.red,
              border: "1.5px solid #060606",
            }}
          />
        </button>
        <div
          className="user-pill"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            background: C.card,
            border: `1px solid ${C.border2}`,
            borderRadius: 100,
            padding: "4px 12px 4px 4px",
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: `linear-gradient(135deg,${C.green},${C.amber})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 10,
              color: "#000",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <span
            className="topbar-email"
            style={{
              fontFamily: "'DM Mono',monospace",
              fontSize: 11,
              color: "#aaa",
              maxWidth: 160,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user?.email || "Loading..."}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────
export default function DashboardOverview() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [kycStatus, setKycStatus] = useState(null);
  const [kycRejectionReason, setKycReason] = useState(null);

  const [ngnBalance, setNgnBalance] = useState(0);
  const [dashboardStats, setDashboardStats] = useState({
    totalWithdrawn: 0,
    completedTrades: 0,
    volumeThisMonth: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [liveCoins, setLiveCoins] = useState(COINS);
  const [isLoadingRates, setIsLoadingRates] = useState(true);

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  const fetchData = async () => {
    try {
      api
        .get("/kyc/status")
        .then((r) => {
          setKycStatus(r.data.status);
          setKycReason(r.data.rejection_reason);
        })
        .catch(() => {});

      const [balRes, txRes, ratesRes, statsRes] = await Promise.all([
        api.get("/wallets/balance").catch(() => ({ data: { balance: 0 } })),
        api.get("/transactions/").catch(() => ({ data: [] })),
        api.get("/rates/").catch(() => ({ data: [] })),
        api.get("/dashboard/stats").catch(() => ({
          data: { totalWithdrawn: 0, completedTrades: 0, volumeThisMonth: 0 },
        })),
      ]);

      setNgnBalance(balRes.data.balance || 0);
      setDashboardStats(
        statsRes.data || {
          totalWithdrawn: 0,
          completedTrades: 0,
          volumeThisMonth: 0,
        },
      );
      // Unified transaction feed (trades + withdrawals), same shape as the full history page
      const rawTx = txRes.data?.items || txRes.data || [];
      const mappedTx = (Array.isArray(rawTx) ? rawTx : [])
        .map((t) => ({
          id: t.id,
          type: t.type,
          date: t.created_at,
          ref: t.ref || t.reference || String(t.id),
          ngnAmt: Number(t.amount ?? t.ngn_amount) || 0,
          status: (t.status || "pending").toLowerCase(),
          coin: t.coin || t.asset || null,
          cryptoAmt: t.crypto_amount ? Number(t.crypto_amount) : null,
          rate: t.rate ?? t.rate_applied ? Number(t.rate ?? t.rate_applied) : null,
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(mappedTx);

      const ratesData = Array.isArray(ratesRes.data) ? ratesRes.data : [];
      setLiveCoins(
        COINS.map((c) => {
          const r = ratesData.find(
            (x) => x.asset.toLowerCase() === c.id.toLowerCase(),
          );
          return {
            ...c,
            rate: r
              ? parseFloat(r.user_ngn_usd_rate || r.user_rate || 0)
              : c.rate,
          };
        }),
      );
      setIsLoadingRates(false);
    } catch (e) {
      console.error("Dashboard fetch error:", e);
      setIsLoadingRates(false);
    }
  };

  useEffect(() => {
    fetchData();
    const iv = setInterval(fetchData, 15000);
    return () => clearInterval(iv);
  }, []);

  const goToTrade = (coin = null) => {
    navigate(coin ? `/dashboard/trade?coin=${coin.id}` : "/dashboard/trade");
  };

  return (
    <div
      style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0 }}
    >
      <Topbar user={user} onNewTrade={() => goToTrade()} />
      <Ticker />

      <div
        className="dashboard-content"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "18px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {/* KYC Status Banner */}
        <KYCBanner status={kycStatus} rejectionReason={kycRejectionReason} />

        {/* Stats row */}
        <Stats balance={ngnBalance} stats={dashboardStats} loading={isLoadingRates} />

        {/* History + Rates */}
        <div
          className="content-row"
          style={{ display: "flex", gap: 14, alignItems: "flex-start" }}
        >
          <History transactions={transactions} loading={isLoadingRates} />
          <div className="rates-panel" style={{ width: 268, flexShrink: 0 }}>
            <RatesPanel
              liveCoins={liveCoins}
              onTrade={goToTrade}
              loading={isLoadingRates}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
