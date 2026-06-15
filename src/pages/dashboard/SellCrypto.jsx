import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/axios";

// ─── TOKENS ───────────────────────────────────────────────
const C = {
  green: "#0ECB81",
  amber: "#F5A623",
  red: "#F6465D",
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

const RATES_REFRESH = 30;
const PAY_TTL = 1800; // 30 min

const CSS = `
  @keyframes fadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes slideIn  { from{opacity:0;transform:translateX(22px)} to{opacity:1;transform:translateX(0)} }
  @keyframes pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.75)} }
  @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes popIn    { 0%{transform:scale(0.7);opacity:0} 70%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
  @keyframes successIn{ 0%{transform:scale(0.5);opacity:0} 65%{transform:scale(1.06)} 100%{transform:scale(1);opacity:1} }
  @keyframes checkDraw{ from{stroke-dashoffset:70} to{stroke-dashoffset:0} }
  @keyframes ripple   { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(2.8);opacity:0} }
  @keyframes ticketLine { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }

  .step-form   { animation:slideIn 0.32s ease; }
  .pri-btn     { transition:all 0.2s; }
  .pri-btn:hover:not(:disabled) { background:#0fdf8e !important; transform:translateY(-2px); box-shadow:0 10px 28px rgba(14,203,129,0.32) !important; }
  .pri-btn:disabled { opacity:0.35 !important; cursor:not-allowed !important; }
  .ghost-btn   { transition:all 0.18s; }
  .ghost-btn:hover:not(:disabled) { border-color:#444 !important; color:#ccc !important; }
  .coin-card   { transition:all 0.18s; }
  .coin-card:hover  { border-color:rgba(14,203,129,0.3) !important; background:#181818 !important; transform:translateY(-2px); }
  .coin-card.sel    { border-color:rgba(14,203,129,0.5) !important; background:rgba(14,203,129,0.06) !important; }
  .net-btn     { transition:all 0.18s; }
  .net-btn:hover    { border-color:#555 !important; }
  .net-btn.sel      { background:rgba(14,203,129,0.08) !important; border-color:rgba(14,203,129,0.4) !important; color:#0ECB81 !important; }
  .bank-card   { transition:all 0.18s; }
  .bank-card:hover  { border-color:#444 !important; background:#181818 !important; }
  .bank-card.sel    { border-color:rgba(14,203,129,0.4) !important; background:rgba(14,203,129,0.05) !important; }
  .copy-btn:hover   { color:#0ECB81 !important; }
  .copy-btn    { transition:color 0.15s; }
  .back-btn:hover   { color:#fff !important; }
  .back-btn    { transition:color 0.15s; }
  .amt-toggle:hover { background:rgba(255,255,255,0.06) !important; }
  .amt-toggle  { transition:background 0.15s; }
  .st-input:focus   { border-color:rgba(14,203,129,0.5) !important; box-shadow:0 0 0 3px rgba(14,203,129,0.07) !important; outline:none; }
  .st-input    { transition:border-color 0.2s, box-shadow 0.2s; }

  .sell-crypto-container {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .left-panel {
    width: 320px;
    background: #060606;
    border-right: 1px solid #1a1a1a;
    display: flex;
    flex-direction: column;
    height: 100%;
    flex-shrink: 0;
    padding: 28px 24px;
    position: relative;
    overflow-y: auto;
  }

  .form-area {
    flex: 1;
    overflow-y: auto;
    padding: 32px 48px 40px;
  }
  
  .coins-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  @media (max-width: 1024px) {
    .sell-crypto-container {
      flex-direction: column;
    }
    .left-panel {
      width: 100%;
      height: auto;
      border-right: none;
      border-bottom: 1px solid #1a1a1a;
      padding: 20px;
    }
    .left-panel-ambient, .left-panel-logo, .left-panel-title {
      display: none !important;
    }
    .form-area {
      padding: 24px 20px 40px;
    }
    .top-bar {
      display: none !important;
    }
    .coins-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .coins-grid {
      grid-template-columns: 1fr;
    }
    .form-area {
      padding: 20px 16px 40px;
    }
    h2 {
      font-size: 32px !important;
    }
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
    networks: ["TRC20", "ERC20"],
  },
  {
    id: "BTC",
    name: "Bitcoin",
    icon: "₿",
    color: "#F7931A",
    bg: "rgba(247,147,26,0.15)",
    networks: ["Bitcoin"],
  },
  {
    id: "ETH",
    name: "Ethereum",
    icon: "Ξ",
    color: "#627EEA",
    bg: "rgba(98,126,234,0.15)",
    networks: ["ERC20"],
  },
  {
    id: "USDC",
    name: "USD Coin",
    icon: "◎",
    color: "#0072FF",
    bg: "rgba(0,114,255,0.15)",
    networks: ["ERC20", "SOL"],
  },
  {
    id: "BNB",
    name: "BNB",
    icon: "⬡",
    color: "#F3BA2F",
    bg: "rgba(243,186,47,0.15)",
    networks: ["BEP20"],
  },
  {
    id: "SOL",
    name: "Solana",
    icon: "◎",
    color: "#9945FF",
    bg: "rgba(153,69,255,0.15)",
    networks: ["SOL"],
  },
];

function parseRate(r) {
  return parseFloat(r.user_ngn_usd_rate || r.user_rate || 0);
}

function normNet(s) {
  return (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function normalizeAddressList(addrs) {
  if (!Array.isArray(addrs)) return [];
  return addrs
    .map((a) => ({
      network: a.network || a.chain || a.blockchain || "",
      address: a.address || a.deposit_address || a.wallet_address || "",
    }))
    .filter((a) => a.network);
}

function normalizeDepositAddresses(data) {
  if (!data) return {};

  const payload = data.data ?? data.addresses ?? data.deposit_addresses ?? data;

  if (Array.isArray(payload)) {
    const out = {};
    payload.forEach((item) => {
      const asset = (
        item.asset ||
        item.currency ||
        item.coin ||
        item.symbol ||
        ""
      ).toLowerCase();
      if (!asset) return;
      if (!out[asset]) out[asset] = [];
      out[asset].push({
        network: item.network || item.chain || item.blockchain || "",
        address:
          item.address || item.deposit_address || item.wallet_address || "",
      });
    });
    return out;
  }

  if (typeof payload === "object") {
    const out = {};
    Object.entries(payload).forEach(([asset, val]) => {
      const key = asset.toLowerCase();
      if (Array.isArray(val)) {
        out[key] = normalizeAddressList(val);
      } else if (val && typeof val === "object") {
        out[key] = Object.entries(val)
          .map(([network, entry]) => ({
            network,
            address:
              typeof entry === "string"
                ? entry
                : entry?.address ||
                  entry?.deposit_address ||
                  entry?.wallet_address ||
                  "",
          }))
          .filter((a) => a.address);
      }
    });
    return out;
  }

  return {};
}

function findDepositEntry(coinId, network, depositAddresses) {
  const addrs = depositAddresses[coinId?.toLowerCase()] || [];
  if (!network) return addrs.find((a) => a.address) || null;
  const target = normNet(network);
  return (
    addrs.find((a) => normNet(a.network) === target) ||
    addrs.find(
      (a) =>
        normNet(a.network).includes(target) ||
        target.includes(normNet(a.network)),
    ) ||
    null
  );
}

function buildLiveCoins(liveRates) {
  return COINS.map((c) => ({
    ...c,
    rate: liveRates[c.id] || 0,
  }));
}

// Removed genTradeId as transactions are driven by backend webhook.

// ─── COPY BUTTON ──────────────────────────────────────────
function Copy({ text }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setOk(true);
        setTimeout(() => setOk(false), 2000);
      }}
      className="copy-btn"
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        fontSize: 11,
        fontFamily: "'Outfit',sans-serif",
        fontWeight: 500,
        color: ok ? C.green : C.muted,
        display: "flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {ok ? (
        <>
          <svg width={11} height={11} viewBox="0 0 11 11" fill="none">
            <path
              d="M1.5 5.5l2.5 3L9.5 2"
              stroke={C.green}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg
            width={11}
            height={11}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

// ─── PROGRESS BAR ─────────────────────────────────────────
function ProgressBar({ step, hasNetwork }) {
  const visibleSteps = hasNetwork
    ? ["coin", "network", "amount", "review", "send"]
    : ["coin", "amount", "review", "send"];

  const labels = {
    coin: "Coin",
    network: "Network",
    amount: "Amount",
    review: "Review",
    send: "Send",
  };

  const current = visibleSteps.indexOf(step);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 0,
        marginBottom: 32,
        overflowX: "auto",
        paddingBottom: 10,
      }}
    >
      {visibleSteps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div
            key={s}
            style={{
              display: "flex",
              alignItems: "center",
              flex: i < visibleSteps.length - 1 ? 1 : "none",
              minWidth: 60,
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
                  background: done
                    ? C.green
                    : active
                      ? "rgba(14,203,129,0.12)"
                      : C.border2,
                  border: active ? `1px solid ${C.green}55` : "none",
                  boxShadow: active
                    ? `0 0 0 4px rgba(14,203,129,0.06)`
                    : "none",
                  transition: "all 0.3s",
                }}
              >
                {done ? (
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
                      color: active ? C.green : C.muted,
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
                  color: done ? C.green : active ? C.green : C.muted,
                  whiteSpace: "nowrap",
                }}
              >
                {labels[s]}
              </span>
            </div>
            {i < visibleSteps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 1,
                  margin: "0 8px 16px",
                  minWidth: 20,
                  background:
                    i < current
                      ? `linear-gradient(90deg,${C.green},rgba(14,203,129,0.3))`
                      : C.border,
                  transition: "background 0.4s",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── LEFT PANEL ───────────────────────────────────────────
function LeftPanel({ trade }) {
  const fmtNGN = (n) =>
    n > 0 ? "₦" + n.toLocaleString("en-NG", { maximumFractionDigits: 0 }) : "—";
  const showTicket = trade.coin !== null;

  const rows = [
    {
      label: "Coin",
      val: trade.coin ? `${trade.coin.id} — ${trade.coin.name}` : null,
    },
    { label: "Network", val: trade.network ? trade.network : null },
    {
      label: "You Send",
      val: trade.amount ? `${trade.amount} ${trade.coin?.id}` : null,
    },
    {
      label: "Rate",
      val: trade.liveRate
        ? `₦${trade.liveRate.toLocaleString("en-NG", { maximumFractionDigits: 0 })} / ${trade.coin?.id}`
        : null,
    },
    {
      label: "You Receive",
      val: trade.ngnAmount > 0 ? fmtNGN(trade.ngnAmount) : null,
      green: true,
    },
  ];

  return (
    <div className="left-panel">
      {/* Ambient */}
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
          marginBottom: 18,
        }}
      >
        NEW TRADE
      </div>
      <div
        className="left-panel-title"
        style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 34,
          letterSpacing: 1,
          lineHeight: 0.9,
          marginBottom: 28,
          color: "#fff",
        }}
      >
        CRYPTO <span style={{ color: C.green }}>TO</span>
        <br />
        NAIRA
      </div>

      {/* Trade ticket */}
      <div style={{ flex: 1 }}>
        {showTicket ? (
          <div
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "12px 16px",
                borderBottom: `1px solid ${C.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 10, color: C.muted, letterSpacing: 2 }}>
                TRADE SUMMARY
              </span>
            </div>
            <div style={{ padding: "14px 16px" }}>
              {rows.map((r, i) =>
                r.val ? (
                  <div
                    key={r.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "7px 0",
                      borderBottom: `1px solid ${C.border}`,
                      animation: `ticketLine 0.3s ${i * 0.06}s ease both`,
                    }}
                  >
                    <span style={{ fontSize: 11, color: C.muted }}>
                      {r.label}
                    </span>
                    <span
                      style={{
                        fontFamily: "'DM Mono',monospace",
                        fontSize: 12,
                        color: r.green ? C.green : "#ccc",
                        fontWeight: r.green ? 600 : 400,
                      }}
                    >
                      {r.val}
                    </span>
                  </div>
                ) : (
                  <div
                    key={r.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "7px 0",
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    <span style={{ fontSize: 11, color: C.muted2 }}>
                      {r.label}
                    </span>
                    <span style={{ fontSize: 11, color: C.muted2 }}>—</span>
                  </div>
                ),
              )}
            </div>
          </div>
        ) : (
          <div
            style={{
              borderRadius: 14,
              border: `1px dashed ${C.muted2}`,
              padding: "28px 20px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 10 }}>🔄</div>
            <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
              Select a coin to start building your trade
            </div>
          </div>
        )}
      </div>

      {/* Bottom trust */}
      <div
        className="left-panel-title"
        style={{
          marginTop: 24,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {[
          { icon: "⚡", text: "NGN paid within minutes" },
          { icon: "🔒", text: "Secure crypto deposits" },
          { icon: "💯", text: "Live rates from server" },
        ].map((t) => (
          <div
            key={t.text}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <span style={{ fontSize: 13 }}>{t.icon}</span>
            <span style={{ fontSize: 11, color: C.muted }}>{t.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── STEPS ──────────────────────────────────────────────
function StepCoin({ selected, coins, onSelect, ratesLoading }) {
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
          fontSize: 40,
          letterSpacing: 1,
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        WHICH COIN ARE
        <br />
        YOU TRADING?
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
        Select the cryptocurrency you want to convert to naira.
      </p>

      {ratesLoading && (
        <div
          style={{
            fontSize: 12,
            color: C.muted,
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: C.green,
              animation: "pulse 2s infinite",
            }}
          />
          Getting live rates…
        </div>
      )}

      <div className="coins-grid">
        {(coins || COINS).map((c) => (
          <button
            key={c.id}
            className={`coin-card${selected?.id === c.id ? " sel" : ""}`}
            onClick={() => onSelect(c)}
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              padding: "18px 14px",
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: c.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 700,
                  color: c.color,
                }}
              >
                {c.icon}
              </div>
              {selected?.id === c.id && (
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: C.green,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "popIn 0.2s ease",
                  }}
                >
                  <svg width={8} height={8} viewBox="0 0 8 8" fill="none">
                    <path
                      d="M1 4l2 2.5L7 1.5"
                      stroke="#000"
                      strokeWidth={1.2}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>
                {c.id}
              </div>
              <div style={{ fontSize: 11, color: C.muted }}>{c.name}</div>
            </div>
            {c.rate > 0 && (
              <div
                style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 11,
                  color: C.green,
                }}
              >
                ₦{c.rate.toLocaleString("en-NG", { maximumFractionDigits: 0 })}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepNetwork({ coin, selected, onSelect }) {
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
          fontSize: 40,
          letterSpacing: 1,
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        WHICH NETWORK?
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
        Select the network you'll use to send{" "}
        <span style={{ color: coin.color }}>{coin.id}</span>. Make sure it
        matches your exchange or wallet.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {coin.networks.map((n) => (
          <button
            key={n}
            className={`net-btn${selected === n ? " sel" : ""}`}
            onClick={() => onSelect(n)}
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "16px 20px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: selected === n ? C.green : "#ccc",
              fontFamily: "'Outfit',sans-serif",
              fontWeight: 600,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: coin.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  color: coin.color,
                }}
              >
                {coin.icon}
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>
                  {coin.id} · {n}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: C.muted,
                    fontWeight: 400,
                    marginTop: 2,
                  }}
                >
                  {n === "TRC20"
                    ? "Tron network · Low fees"
                    : n === "ERC20"
                      ? "Ethereum network · Higher fees"
                      : n === "BEP20"
                        ? "BNB Smart Chain · Low fees"
                        : n === "SOL"
                          ? "Solana network · Very low fees"
                          : n === "Bitcoin"
                            ? "Bitcoin mainnet"
                            : ""}
                </div>
              </div>
            </div>
            {selected === n ? (
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: C.green,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width={9} height={9} viewBox="0 0 9 9" fill="none">
                  <path
                    d="M1.5 4.5l2 2.5L7.5 2"
                    stroke="#000"
                    strokeWidth={1.2}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            ) : (
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: `1px solid ${C.border2}`,
                }}
              />
            )}
          </button>
        ))}
      </div>

      <div
        style={{
          marginTop: 20,
          display: "flex",
          gap: 8,
          alignItems: "flex-start",
          background: "rgba(245,166,35,0.06)",
          border: "1px solid rgba(245,166,35,0.15)",
          borderRadius: 10,
          padding: "12px 14px",
        }}
      >
        <span style={{ flexShrink: 0, fontSize: 13 }}>⚠</span>
        <span style={{ fontSize: 12, color: C.amber, lineHeight: 1.6 }}>
          Sending on the wrong network will result in permanent loss of funds.
          Double-check with your exchange before proceeding.
        </span>
      </div>
    </div>
  );
}

function StepAmount({
  coin,
  network,
  amount,
  setAmount,
  ngnAmount,
  setNgnAmount,
  onRateUpdate,
  ratesRefreshIn,
}) {
  const [mode, setMode] = useState("crypto");
  const liveRate = coin.rate || 0;

  useEffect(() => {
    onRateUpdate?.(liveRate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveRate]);

  useEffect(() => {
    if (!amount) return;
    const n = parseFloat(amount);
    if (!isNaN(n) && n > 0) setNgnAmount(n * liveRate);
  }, [liveRate]);

  const handleCrypto = (v) => {
    setAmount(v);
    const n = parseFloat(v);
    setNgnAmount(!isNaN(n) && n > 0 ? n * liveRate : 0);
  };

  const handleNGN = (v) => {
    setNgnAmount(parseFloat(v) || 0);
    const n = parseFloat(v);
    setAmount(
      !isNaN(n) && n > 0 && liveRate > 0 ? (n / liveRate).toFixed(8) : "",
    );
  };

  const timerColor =
    ratesRefreshIn > 20 ? C.green : ratesRefreshIn > 10 ? C.amber : C.red;
  const pct = (ratesRefreshIn / RATES_REFRESH) * 100;
  const minNGN = 5000;
  const tooLow = ngnAmount > 0 && ngnAmount < minNGN;

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
        STEP {coin.networks.length > 1 ? "3" : "2"}
      </div>
      <h2
        style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 40,
          letterSpacing: 1,
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        HOW MUCH ARE
        <br />
        YOU SENDING?
      </h2>
      <p
        style={{
          color: C.muted,
          fontSize: 14,
          fontWeight: 300,
          lineHeight: 1.6,
          marginBottom: 24,
        }}
      >
        Enter the amount of{" "}
        <span style={{ color: coin.color, fontWeight: 500 }}>{coin.id}</span>
        {network ? (
          <span style={{ color: C.muted }}> ({network})</span>
        ) : (
          ""
        )}{" "}
        you want to trade.
      </p>

      <div
        style={{
          display: "flex",
          background: C.card2,
          border: `1px solid ${C.border}`,
          borderRadius: 10,
          padding: 3,
          gap: 3,
          marginBottom: 16,
          width: "fit-content",
        }}
      >
        {[
          { v: "crypto", l: `Enter ${coin.id}` },
          { v: "ngn", l: "Enter NGN" },
        ].map((m) => (
          <button
            key={m.v}
            className="amt-toggle"
            onClick={() => setMode(m.v)}
            style={{
              padding: "6px 16px",
              borderRadius: 8,
              border: "none",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              background: mode === m.v ? C.card : "transparent",
              color: mode === m.v ? "#fff" : C.muted,
              boxShadow: mode === m.v ? "0 1px 4px rgba(0,0,0,0.3)" : "none",
              fontFamily: "'Outfit',sans-serif",
            }}
          >
            {m.l}
          </button>
        ))}
      </div>

      {mode === "crypto" ? (
        <div style={{ position: "relative", marginBottom: 12 }}>
          <input
            className="st-input"
            type="number"
            value={amount}
            onChange={(e) => handleCrypto(e.target.value)}
            autoFocus
            placeholder="0.00"
            style={{
              width: "100%",
              background: "#0a0a0a",
              border: `1px solid ${C.border2}`,
              borderRadius: 12,
              padding: "16px 72px 16px 16px",
              color: "#fff",
              fontSize: 24,
              fontFamily: "'DM Mono',monospace",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: coin.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                color: coin.color,
              }}
            >
              {coin.icon}
            </div>
            <span
              style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: 14,
                color: coin.color,
                fontWeight: 500,
              }}
            >
              {coin.id}
            </span>
          </div>
        </div>
      ) : (
        <div style={{ position: "relative", marginBottom: 12 }}>
          <input
            className="st-input"
            type="number"
            value={ngnAmount || ""}
            onChange={(e) => handleNGN(e.target.value)}
            autoFocus
            placeholder="0"
            style={{
              width: "100%",
              background: "#0a0a0a",
              border: `1px solid ${C.border2}`,
              borderRadius: 12,
              padding: "16px 60px 16px 16px",
              color: "#fff",
              fontSize: 24,
              fontFamily: "'DM Mono',monospace",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              fontFamily: "'DM Mono',monospace",
              fontSize: 14,
              color: "#888",
              fontWeight: 500,
            }}
          >
            NGN
          </div>
        </div>
      )}

      {ngnAmount > 0 && mode === "crypto" && (
        <div
          style={{
            background: "rgba(14,203,129,0.05)",
            border: "1px solid rgba(14,203,129,0.15)",
            borderRadius: 10,
            padding: "10px 14px",
            marginBottom: 12,
            animation: "fadeIn 0.2s ease",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: C.muted }}>You receive</span>
            <span
              style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: 16,
                color: C.green,
                fontWeight: 600,
              }}
            >
              ₦{ngnAmount.toLocaleString("en-NG", { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      )}
      {amount && mode === "ngn" && (
        <div
          style={{
            background: "rgba(14,203,129,0.05)",
            border: "1px solid rgba(14,203,129,0.15)",
            borderRadius: 10,
            padding: "10px 14px",
            marginBottom: 12,
            animation: "fadeIn 0.2s ease",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: C.muted }}>You send</span>
            <span
              style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: 15,
                color: coin.color,
                fontWeight: 500,
              }}
            >
              {parseFloat(amount).toFixed(coin.id === "BTC" ? 6 : 2)} {coin.id}
            </span>
          </div>
        </div>
      )}

      {tooLow && (
        <div
          style={{
            display: "flex",
            gap: 6,
            alignItems: "center",
            marginBottom: 12,
            fontSize: 12,
            color: C.red,
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
          Minimum trade is ₦5,000
        </div>
      )}

      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: "14px 16px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <span style={{ fontSize: 11, color: C.muted }}>Live Rate</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 40,
                height: 2,
                background: C.border,
                borderRadius: 1,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${pct}%`,
                  borderRadius: 1,
                  background: timerColor,
                  transition: "width 1s linear, background 0.5s",
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: 10,
                color: timerColor,
              }}
            >
              {ratesRefreshIn}s
            </span>
          </div>
        </div>
        {[
          [
            "Rate",
            liveRate > 0
              ? `₦${liveRate.toLocaleString("en-NG", { maximumFractionDigits: 0 })} / ${coin.id}`
              : "Loading...",
          ],
          ["Payout", "To your NGN wallet"],
        ].map(([k, v]) => (
          <div
            key={k}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "5px 0",
              borderTop: `1px solid ${C.border}`,
            }}
          >
            <span style={{ fontSize: 11, color: C.muted }}>{k}</span>
            <span
              style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: 11,
                color: "#aaa",
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

function StepReview({ trade }) {
  const rows = [
    ["Coin", `${trade.coin.name} (${trade.coin.id})`],
    ["Network", trade.network || trade.coin.networks[0]],
    ["You Send", `${trade.amount} ${trade.coin.id}`],
    [
      "Exchange Rate",
      `₦${(trade.liveRate || trade.coin.rate || 0).toLocaleString("en-NG", { maximumFractionDigits: 0 })} / ${trade.coin.id}`,
    ],
    [
      "You Receive",
      `₦${trade.ngnAmount.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`,
    ],
  ];
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
        STEP {trade.coin?.networks?.length > 1 ? "4" : "3"}
      </div>
      <h2
        style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 40,
          letterSpacing: 1,
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        REVIEW YOUR
        <br />
        TRADE
      </h2>
      <p
        style={{
          color: C.muted,
          fontSize: 14,
          fontWeight: 300,
          lineHeight: 1.6,
          marginBottom: 24,
        }}
      >
        Check everything looks right before continuing to payment.
      </p>

      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          overflow: "hidden",
          marginBottom: 20,
        }}
      >
        {rows.map(([k, v], i) => (
          <div
            key={k}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "13px 18px",
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
                  k === "You Receive"
                    ? C.green
                    : k === "You Send"
                      ? trade.coin.color
                      : "#ccc",
                fontWeight: k === "You Receive" ? 600 : 400,
              }}
            >
              {v}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "flex-start",
          background: "rgba(14,203,129,0.04)",
          border: "1px solid rgba(14,203,129,0.12)",
          borderRadius: 10,
          padding: "12px 14px",
        }}
      >
        <svg
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill="none"
          stroke={C.green}
          strokeWidth={2}
          strokeLinecap="round"
          style={{ flexShrink: 0, marginTop: 1 }}
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
          On the next step we'll load your deposit address for this trade.
          You'll have <span style={{ color: "#ccc" }}>30 minutes</span> to send
          your {trade.coin.id} once an address is available. Final payout
          depends on the live rate when your deposit confirms.
        </span>
      </div>
    </div>
  );
}

function StepSend({ trade, onLoadAddress, onPaid }) {
  const [timer, setTimer] = useState(PAY_TTL);
  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState(true);
  const [addressError, setAddressError] = useState(null);
  const net = trade.network || trade.coin.networks[0];
  const wallet = trade.depositEntry?.address || "";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setResolving(true);
      setAddressError(null);
      const result = await onLoadAddress?.(trade.coin.id, net);
      if (cancelled) return;
      setResolving(false);
      if (!result?.address) {
        setAddressError(
          result?.message ||
            `No deposit address is configured for ${trade.coin.id} on ${net}.`,
        );
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setTimer((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(iv);
  }, []);

  const fmt = (s) => {
    const m = Math.floor(s / 60),
      sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const pct = (timer / PAY_TTL) * 100;
  const tcol = timer > 600 ? C.green : timer > 120 ? C.amber : C.red;
  const r = 20,
    circ = 2 * Math.PI * r;

  const handlePaid = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onPaid();
    }, 1400);
  };

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
        STEP {trade.coin?.networks?.length > 1 ? "5" : "4"}
      </div>
      <h2
        style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 40,
          letterSpacing: 1,
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        SEND YOUR
        <br />
        <span style={{ color: trade.coin.color }}>{trade.coin.id}</span>
      </h2>
      <p
        style={{
          color: C.muted,
          fontSize: 14,
          fontWeight: 300,
          lineHeight: 1.6,
          marginBottom: 22,
        }}
      >
        Send exactly the amount below to the wallet address. Then click "I've
        Paid".
      </p>

      <div
        style={{
          background: `${trade.coin.bg}`,
          border: `1px solid ${trade.coin.color}33`,
          borderRadius: 12,
          padding: "16px 20px",
          marginBottom: 14,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              color: trade.coin.color,
              letterSpacing: 2,
              marginBottom: 4,
            }}
          >
            SEND EXACTLY
          </div>
          <div
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 32,
              color: "#fff",
              letterSpacing: 1,
            }}
          >
            {trade.amount} {trade.coin.id}
          </div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
            via {net} network
          </div>
        </div>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: `rgba(0,0,0,0.3)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 700,
            color: trade.coin.color,
          }}
        >
          {trade.coin.icon}
        </div>
      </div>

      <div
        style={{
          background: "#0a0a0a",
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: "14px 16px",
          marginBottom: 14,
        }}
      >
        {resolving ? (
          <div
            style={{
              fontSize: 12,
              color: C.muted,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: C.green,
                animation: "pulse 2s infinite",
              }}
            />
            Loading deposit address…
          </div>
        ) : wallet ? (
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div
              style={{
                background: "#fff",
                padding: 4,
                borderRadius: 6,
                flexShrink: 0,
              }}
            >
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${wallet}`}
                alt="QR"
                width={68}
                height={68}
                style={{ display: "block" }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 9, color: C.muted, letterSpacing: 2 }}>
                  {trade.coin.id} DEPOSIT ADDRESS · {net}
                </span>
                <Copy text={wallet} />
              </div>
              <div
                style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 12,
                  color: C.green,
                  wordBreak: "break-all",
                  lineHeight: 1.6,
                }}
              >
                {wallet}
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "flex-start",
              background: "rgba(245,166,35,0.06)",
              border: "1px solid rgba(245,166,35,0.2)",
              borderRadius: 10,
              padding: "12px 14px",
            }}
          >
            <span style={{ flexShrink: 0, fontSize: 13, color: C.amber }}>
              ⚠
            </span>
            <span style={{ fontSize: 12, color: C.amber, lineHeight: 1.6 }}>
              {addressError}
            </span>
          </div>
        )}
      </div>

      {wallet && (
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
            background: "rgba(246,70,93,0.05)",
            border: "1px solid rgba(246,70,93,0.2)",
            borderRadius: 10,
            padding: "11px 14px",
            marginBottom: 14,
          }}
        >
          <span style={{ flexShrink: 0, fontSize: 13 }}>⚠</span>
          <span style={{ fontSize: 12, color: "#e88", lineHeight: 1.6 }}>
            Only send <strong style={{ color: "#fff" }}>{trade.coin.id}</strong>{" "}
            on the <strong style={{ color: "#fff" }}>{net}</strong> network.
            Sending the wrong coin or wrong network = permanent loss.
          </span>
        </div>
      )}

      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: "14px 16px",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 2 }}>
              Time remaining to pay
            </div>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 300 }}>
              {timer === 0
                ? "Trade expired — please start again"
                : `This trade expires in ${fmt(timer)}`}
            </div>
          </div>
          <div style={{ position: "relative", width: 52, height: 52 }}>
            <svg
              width={52}
              height={52}
              viewBox="0 0 52 52"
              style={{ transform: "rotate(-90deg)", display: "block" }}
            >
              <circle
                cx={26}
                cy={26}
                r={r}
                fill="none"
                stroke={C.border2}
                strokeWidth={4}
              />
              <circle
                cx={26}
                cy={26}
                r={r}
                fill="none"
                stroke={tcol}
                strokeWidth={4}
                strokeDasharray={circ}
                strokeDashoffset={circ * (1 - timer / PAY_TTL)}
                strokeLinecap="round"
                style={{
                  transition: "stroke-dashoffset 1s linear, stroke 0.5s",
                }}
              />
            </svg>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 9,
                  color: tcol,
                  lineHeight: 1,
                }}
              >
                {String(Math.floor(timer / 60)).padStart(2, "0")}
              </span>
              <span style={{ fontSize: 8, color: C.muted, lineHeight: 1 }}>
                min
              </span>
            </div>
          </div>
        </div>
        <div
          style={{
            height: 2,
            background: C.border,
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              borderRadius: 1,
              background: tcol,
              transition: "width 1s linear, background 0.5s",
            }}
          />
        </div>
      </div>

      <button
        onClick={handlePaid}
        disabled={loading || timer === 0 || !wallet || resolving}
        className="pri-btn"
        style={{
          width: "100%",
          background: timer === 0 ? C.border : C.green,
          color: timer === 0 ? C.muted : "#000",
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
          "I've Sent the Payment ✓"
        )}
      </button>

      <p
        style={{
          textAlign: "center",
          fontSize: 11,
          color: C.muted2,
          marginTop: 12,
          letterSpacing: "0.3px",
        }}
      >
        Waiting for network confirmation...
      </p>
    </div>
  );
}

function StepDone({ trade }) {
  const navigate = useNavigate();

  return (
    <div
      className="step-form"
      style={{ textAlign: "center", padding: "20px 0" }}
    >
      <div
        style={{
          position: "relative",
          width: 96,
          height: 96,
          margin: "0 auto 28px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -8,
            borderRadius: "50%",
            border: `2px solid rgba(14,203,129,0.4)`,
            animation: "ripple 1s ease-out",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: -8,
            borderRadius: "50%",
            border: `2px solid rgba(14,203,129,0.2)`,
            animation: "ripple 1s 0.25s ease-out",
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
          background: "rgba(245,166,35,0.08)",
          border: "1px solid rgba(245,166,35,0.2)",
          borderRadius: 100,
          padding: "4px 14px",
          fontSize: 10,
          color: C.amber,
          letterSpacing: 3,
          marginBottom: 18,
        }}
      >
        MONITORING BLOCKCHAIN
      </div>

      <h2
        style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 46,
          letterSpacing: 1,
          lineHeight: 0.9,
          marginBottom: 12,
        }}
      >
        AWAITING NETWORK
        <br />
        <span style={{ color: C.green }}>CONFIRMATION.</span>
      </h2>

      <p
        style={{
          color: C.muted,
          fontSize: 14,
          lineHeight: 1.7,
          maxWidth: 360,
          margin: "0 auto 28px",
        }}
      >
        Your deposit is being tracked. Once the blockchain confirms the transfer,{" "}
        <span style={{ color: C.green, fontWeight: 500 }}>
          ₦
          {trade.ngnAmount.toLocaleString("en-NG", {
            maximumFractionDigits: 0,
          })}
        </span>{" "}
        will be instantly credited to your NGN balance. You can safely leave this page.
      </p>

      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: "18px 20px",
          marginBottom: 24,
          textAlign: "left",
        }}
      >
        <div
          style={{
            fontSize: 9,
            color: C.muted,
            letterSpacing: 2,
            marginBottom: 12,
          }}
        >
          DEPOSIT SUMMARY
        </div>

        {[
          ["You Sent", `${trade.amount} ${trade.coin.id}`],
          ["Network", trade.network || trade.coin.networks[0]],
          [
            "Expected Payout",
            `₦${trade.ngnAmount.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`,
          ],
          ["Est. Time", "5–15 minutes"],
        ].map(([k, v]) => (
          <div
            key={k}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "6px 0",
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <span style={{ fontSize: 12, color: C.muted }}>{k}</span>
            <span
              style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: 12,
                color: k === "Expected Payout" ? C.green : "#ccc",
              }}
            >
              {v}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
        <button
          onClick={() => navigate("/dashboard")}
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
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────
export default function SellCrypto() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState("coin");
  const [trade, setTrade] = useState({
    coin: null,
    network: null,
    depositEntry: null,
    amount: "",
    ngnAmount: 0,
    liveRate: 0,
  });
  const [liveRates, setLiveRates] = useState({});
  const [ratesLoading, setRatesLoading] = useState(true);
  const [ratesRefreshIn, setRatesRefreshIn] = useState(RATES_REFRESH);
  const [prefilledCoin, setPrefilledCoin] = useState(false);

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  const loadDepositAddress = useCallback(async (coinId, network) => {
    try {
      const addrRes = await api.get("/wallets/deposit-addresses");
      const normalized = normalizeDepositAddresses(addrRes.data);
      const entry = findDepositEntry(coinId, network, normalized);
      
      if (entry?.address) {
        setTrade((t) => ({ ...t, depositEntry: entry }));
        return { address: entry.address };
      }
      return {
        message: `No deposit address is configured for ${coinId} on ${network} yet. Wallet setup is still in progress — please contact support.`,
      };
    } catch (e) {
      console.error("Failed to fetch deposit address:", e);
      if (e.response?.status === 401) {
        return {
          message:
            "Your session expired. Please log in again to load your deposit address.",
        };
      }
      return {
        message:
          "Unable to load deposit address. Please try again or contact support.",
      };
    }
  }, []);

  const fetchRates = useCallback(async () => {
    try {
      const ratesRes = await api.get("/rates/");
      const map = {};
      (Array.isArray(ratesRes.data) ? ratesRes.data : [ratesRes.data]).forEach(
        (r) => {
          if (r?.asset) map[r.asset.toUpperCase()] = parseRate(r);
        },
      );
      setLiveRates(map);
    } catch (e) {
      console.error("Failed to fetch rates:", e);
    } finally {
      setRatesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
    const iv = setInterval(() => {
      setRatesRefreshIn((t) => {
        if (t <= 1) {
          fetchRates();
          return RATES_REFRESH;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [fetchRates]);

  const liveCoins = useMemo(() => buildLiveCoins(liveRates), [liveRates]);

  useEffect(() => {
    if (!trade.coin) return;
    const fresh = liveCoins.find((c) => c.id === trade.coin.id);
    if (!fresh || fresh.rate === trade.coin.rate) return;
    setTrade((t) => ({ ...t, coin: fresh }));
  }, [liveCoins, trade.coin?.id, trade.coin?.rate]);

  const hasNetwork = trade.coin?.networks.length > 1;

  const update = (patch) => setTrade((t) => ({ ...t, ...patch }));

  const next = () => {
    const order = hasNetwork
      ? ["coin", "network", "amount", "review", "send", "done"]
      : ["coin", "amount", "review", "send", "done"];
    const i = order.indexOf(step);
    if (i < order.length - 1) setStep(order[i + 1]);
  };

  const back = () => {
    const order = hasNetwork
      ? ["coin", "network", "amount", "review", "send", "done"]
      : ["coin", "amount", "review", "send", "done"];
    const i = order.indexOf(step);
    if (i > 0) setStep(order[i - 1]);
  };

  const canNext = () => {
    if (step === "coin") return !!trade.coin;
    if (step === "network") return !!trade.network;
    if (step === "amount")
      return (
        !!trade.amount &&
        parseFloat(trade.amount) > 0 &&
        trade.ngnAmount >= 5000 &&
        trade.liveRate > 0
      );
    if (step === "review") return true;
    return false;
  };

  const nextLabel = () => {
    if (step === "review") return "Continue to Payment →";
    if (step === "send") return null;
    if (step === "done") return null;
    return "Continue →";
  };

  const handleNextClick = () => {
    if (step === "review") {
      update({ depositEntry: null });
    }
    next();
  };

  const handleCoinSelect = (c) => {
    update({
      coin: c,
      network: c.networks.length === 1 ? c.networks[0] : null,
      depositEntry: null,
    });
  };

  useEffect(() => {
    if (prefilledCoin) return;
    const coinId = searchParams.get("coin");
    if (!coinId || !liveCoins.length) return;
    const match = liveCoins.find(
      (c) => c.id.toLowerCase() === coinId.toLowerCase(),
    );
    if (!match) return;
    setTrade((t) => ({
      ...t,
      coin: match,
      network: match.networks.length === 1 ? match.networks[0] : null,
      depositEntry: null,
    }));
    setPrefilledCoin(true);
  }, [liveCoins, searchParams, prefilledCoin]);

  return (
    <div className="sell-crypto-container">
      <LeftPanel trade={trade} step={step} />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          className="top-bar"
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
            {step !== "coin" && step !== "done" && (
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
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
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
              LIVE RATES
            </span>
          </div>
        </div>

        <div className="form-area">
          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            {/* Mobile back button inside form area */}
            <div
              className="mobile-only-back"
              style={{ display: "none", marginBottom: 20 }}
            >
              {step !== "coin" && step !== "done" && (
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

            <style>{`
              @media (max-width: 1024px) {
                .mobile-only-back { display: block !important; }
              }
            `}</style>

            {step !== "done" && (
              <ProgressBar step={step} hasNetwork={hasNetwork} />
            )}

            {step === "coin" && (
              <StepCoin
                selected={trade.coin}
                coins={liveCoins}
                onSelect={handleCoinSelect}
                ratesLoading={ratesLoading}
              />
            )}
            {step === "network" && (
              <StepNetwork
                coin={trade.coin}
                selected={trade.network}
                onSelect={(n) => update({ network: n, depositEntry: null })}
              />
            )}
            {step === "amount" && (
              <StepAmount
                coin={trade.coin}
                network={trade.network}
                amount={trade.amount}
                setAmount={(v) => update({ amount: v })}
                ngnAmount={trade.ngnAmount}
                setNgnAmount={(v) => update({ ngnAmount: v })}
                onRateUpdate={(r) => update({ liveRate: r })}
                ratesRefreshIn={ratesRefreshIn}
              />
            )}
            {step === "review" && <StepReview trade={trade} />}
            {step === "send" && (
              <StepSend
                trade={trade}
                onLoadAddress={loadDepositAddress}
                onPaid={next}
              />
            )}
            {step === "done" && <StepDone trade={trade} />}

            {nextLabel() && (
              <div style={{ marginTop: 24 }}>
                <button
                  disabled={!canNext()}
                  onClick={handleNextClick}
                  className="pri-btn"
                  style={{
                    width: "100%",
                    background: canNext() ? C.green : C.border,
                    color: canNext() ? "#000" : C.muted,
                    fontWeight: 700,
                    fontSize: 15,
                    padding: "15px",
                    borderRadius: 12,
                    border: "none",
                    fontFamily: "'Outfit',sans-serif",
                  }}
                >
                  {nextLabel()}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
