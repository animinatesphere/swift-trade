import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import {
  ArrowLeft,
  ChevronRight,
  Wallet,
  CreditCard,
  Landmark,
  ShieldCheck,
  Info,
  CheckCircle2,
  Lock,
} from "lucide-react";

// ─── TOKENS ───────────────────────────────────────────────
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
  html { scroll-behavior: smooth; }
  body { background:#080808; color:#fff; font-family: 'Outfit', sans-serif; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background:#080808; }
  ::-webkit-scrollbar-thumb { background: #222; border-radius: 4px; }
  a { text-decoration: none; color: inherit; }
  button { cursor: pointer; font-family: 'Outfit', sans-serif; }
  input { font-family: 'Outfit', sans-serif; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes slideUp  { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }
  @keyframes successPop { 0%{transform:scale(0.7);opacity:0} 70%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
  @keyframes checkDraw { from{stroke-dashoffset:100} to{stroke-dashoffset:0} }

  .nav-link-item:hover  { color: #fff !important; }
  .nav-cta:hover        { background: #0fdf8e !important; transform: translateY(-1px); }
  .asset-opt:hover      { background: #161616 !important; }
  .asset-opt.selected   { background: rgba(14,203,129,0.06) !important; border-color: rgba(14,203,129,0.3) !important; }
  .recent-row:hover     { background: #141414 !important; }
  .confirm-btn:hover    { background: #0fdf8e !important; transform: translateY(-2px); box-shadow: 0 12px 32px rgba(14,203,129,0.35) !important; }
  .confirm-btn:disabled { background: #1a1a1a !important; color: #444 !important; transform: none !important; box-shadow: none !important; }
  .tab-btn:hover        { color: #fff !important; }
  .network-pill:hover   { border-color: #444 !important; color: #aaa !important; }
  .network-pill.active  { background: rgba(14,203,129,0.1) !important; border-color: rgba(14,203,129,0.3) !important; color: #0ECB81 !important; }

  @media (max-width: 1024px) {
    .exchange-grid { flex-direction: column !important; gap: clamp(30px, 4vw, 40px) !important; }
    .side-panel { width: 100% !important; order: 2 !important; }
    .widget-container { width: 100% !important; order: 1 !important; margin-bottom: clamp(16px, 3vw, 20px) !important; }
    .hero-flex { flex-direction: column !important; align-items: flex-start !important; gap: clamp(16px, 3vw, 24px) !important; }
    .stat-chips { justify-content: flex-start !important; width: 100% !important; }
    .main-wrapper { padding: clamp(30px, 4vw, 40px) clamp(16px, 2vw, 20px) !important; }
    .hero-padding { padding: clamp(30px, 4vw, 44px) clamp(16px, 2vw, 20px) 0 !important; }
  }

  @media (max-width: 768px) {
    .hero-flex h1 { fontSize: clamp(24px, 5vw, 40px) !important; }
    .stat-chips { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: clamp(8px, 2vw, 12px) !important; }
    .stat-chips > div { padding: clamp(8px, 2vw, 10px) clamp(10px, 2vw, 12px) !important; }
    .main-wrapper { padding: clamp(20px, 3vw, 24px) clamp(14px, 2vw, 16px) !important; }
    .widget-container { max-width: 100% !important; }
    .side-panel-desktop { display: none !important; }
  }

  @media (max-width: 480px) {
    .exchange-grid { gap: clamp(20px, 3vw, 30px) !important; }
    .main-wrapper { padding: clamp(16px, 2vw, 20px) !important; }
    .hero-flex h1 { font-size: clamp(20px, 4vw, 32px) !important; }
    .stat-chips { grid-template-columns: 1fr !important; }
    .confirm-btn { min-height: 48px !important; padding: clamp(12px, 2vw, 14px) !important; }
  }
`;

// ─── ASSETS DATA ──────────────────────────────────────────
const ASSETS = [
  {
    id: "BTC",
    name: "Bitcoin",
    symbol: "BTC",
    icon: "₿",
    color: "#F7931A",
    bg: "rgba(247,147,26,0.15)",
    rateNGN: 98240000,
    change: +2.4,
    networks: ["Bitcoin"],
  },
  {
    id: "ETH",
    name: "Ethereum",
    symbol: "ETH",
    icon: "Ξ",
    color: "#627EEA",
    bg: "rgba(98,126,234,0.15)",
    rateNGN: 3420000,
    change: +1.8,
    networks: ["ERC20"],
  },
  {
    id: "USDT",
    name: "Tether",
    symbol: "USDT",
    icon: "₮",
    color: "#26A17B",
    bg: "rgba(38,161,123,0.15)",
    rateNGN: 1592,
    change: -0.3,
    networks: ["ERC20", "BEP20"],
  },
  {
    id: "USDC",
    name: "USD Coin",
    symbol: "USDC",
    icon: "◎",
    color: "#0072FF",
    bg: "rgba(0,114,255,0.15)",
    rateNGN: 1590,
    change: +0.1,
    networks: ["ERC20"],
  },
  {
    id: "BNB",
    name: "BNB",
    symbol: "BNB",
    icon: "⬡",
    color: "#F3BA2F",
    bg: "rgba(243,186,47,0.15)",
    rateNGN: 920000,
    change: +3.1,
    networks: ["BEP20"],
  },
  {
    id: "XRP",
    name: "XRP",
    symbol: "XRP",
    icon: "✕",
    color: "#00AAE4",
    bg: "rgba(0,170,228,0.15)",
    rateNGN: 860,
    change: +0.8,
    networks: ["XRP"],
  },
  {
    id: "DOGE",
    name: "Dogecoin",
    symbol: "DOGE",
    icon: "Ð",
    color: "#C2A633",
    bg: "rgba(194,166,51,0.15)",
    rateNGN: 262,
    change: +5.2,
    networks: ["DOGE"],
  },
];

const QUOTE_DURATION = 60;

const RECENT_TRADES = [
  {
    type: "sell",
    asset: "USDT",
    amount: "500",
    ngn: "795,840",
    time: "2m ago",
    status: "completed",
  },
  {
    type: "buy",
    asset: "BTC",
    amount: "0.002",
    ngn: "197,856",
    time: "18m ago",
    status: "completed",
  },
  {
    type: "sell",
    asset: "ETH",
    amount: "0.5",
    ngn: "1,704,600",
    time: "1h ago",
    status: "completed",
  },
  {
    type: "sell",
    asset: "USDC",
    amount: "200",
    ngn: "316,440",
    time: "3h ago",
    status: "completed",
  },
];

// ─── COMPONENTS ───────────────────────────────────────────

function AssetDropdown({ assets, selected, onSelect, onClose }) {
  const [search, setSearch] = useState("");
  const filtered = assets.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.symbol.toLowerCase().includes(search.toLowerCase()),
  );
  const ref = useRef(null);
  useEffect(() => {
    const fn = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        left: 0,
        right: 0,
        zIndex: 50,
        background: C.card,
        border: `1px solid ${C.border2}`,
        borderRadius: 14,
        boxShadow: "0 24px 48px rgba(0,0,0,0.6)",
        animation: "slideUp 0.2s ease",
        overflow: "hidden",
      }}
    >
      <div
        style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}` }}
      >
        <input
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search asset..."
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: 14,
            outline: "none",
          }}
        />
      </div>
      <div style={{ maxHeight: 260, overflowY: "auto" }}>
        {filtered.map((a) => (
          <div
            key={a.id}
            className={`asset-opt${selected.id === a.id ? " selected" : ""}`}
            onClick={() => {
              onSelect(a);
              onClose();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 14px",
              cursor: "pointer",
              background:
                selected.id === a.id ? "rgba(14,203,129,0.06)" : "transparent",
              borderLeft:
                selected.id === a.id
                  ? `2px solid ${C.green}`
                  : "2px solid transparent",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: a.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: a.color,
              }}
            >
              {a.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{a.name}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{a.symbol}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 12,
                  color: "#ccc",
                }}
              >
                ₦{a.rateNGN.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CountdownRing({ seconds, total }) {
  const r = 18,
    circ = 2 * Math.PI * r;
  const progress = seconds / total;
  const color = seconds > 20 ? C.green : seconds > 10 ? C.amber : C.red;
  return (
    <svg
      width={48}
      height={48}
      viewBox="0 0 48 48"
      style={{ transform: "rotate(-90deg)" }}
    >
      <circle
        cx={24}
        cy={24}
        r={r}
        fill="none"
        stroke={C.border2}
        strokeWidth={3}
      />
      <circle
        cx={24}
        cy={24}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - progress)}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }}
      />
      <text
        x={24}
        y={28}
        textAnchor="middle"
        fill={color}
        fontSize={13}
        fontFamily="'DM Mono',monospace"
        fontWeight={500}
        style={{ transform: "rotate(90deg) translate(0px,-48px)" }}
      >
        {seconds}
      </text>
    </svg>
  );
}

function ExchangeWidget() {
  const [side, setSide] = useState("sell");
  const [assets, setAssets] = useState(ASSETS);
  const [asset, setAsset] = useState(ASSETS[2]);
  const [network, setNetwork] = useState(ASSETS[2].networks[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [ngnAmount, setNgnAmount] = useState("");
  const [editingField, setEditingField] = useState("crypto");
  const [step, setStep] = useState("form");
  const [quoteTimer, setQuoteTimer] = useState(QUOTE_DURATION);
  const [quoteId] = useState(
    () => "QT-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
  );
  const timerRef = useRef(null);

  // Fetch rates from API
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await api.get("/rates/");
        const ratesData = Array.isArray(res.data) ? res.data : [res.data];

        const updatedAssets = ASSETS.map((a) => {
          const rateInfo = ratesData.find(
            (r) => r.asset?.toUpperCase() === a.id,
          );
          if (rateInfo) {
            return {
              ...a,
              rateNGN:
                rateInfo.user_ngn_usd_rate ||
                rateInfo.market_ngn_usd_rate ||
                a.rateNGN,
            };
          }
          return a;
        });

        setAssets(updatedAssets);
        if (asset && updatedAssets.length > 0) {
          const updatedAsset = updatedAssets.find((a) => a.id === asset.id);
          if (updatedAsset) setAsset(updatedAsset);
        }
      } catch (e) {
        console.error("Failed to fetch rates:", e);
      }
    };

    fetchRates();
    const iv = setInterval(fetchRates, 30000); // Refresh every 30 seconds
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    setNetwork(asset.networks[0]);
  }, [asset]);

  const effectiveRate = asset.rateNGN;

  const handleCryptoChange = (val) => {
    setCryptoAmount(val);
    setEditingField("crypto");
    const n = parseFloat(val);
    if (!isNaN(n) && n > 0) setNgnAmount((n * effectiveRate).toFixed(2));
    else setNgnAmount("");
  };

  const handleNGNChange = (val) => {
    setNgnAmount(val);
    setEditingField("ngn");
    const n = parseFloat(val);
    if (!isNaN(n) && n > 0) setCryptoAmount((n / effectiveRate).toFixed(8));
    else setCryptoAmount("");
  };

  const startTimer = useCallback(() => {
    setQuoteTimer(QUOTE_DURATION);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setQuoteTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setStep("form");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const handleGetQuote = () => {
    setStep("quote");
    startTimer();
  };
  const handleConfirm = () => {
    clearInterval(timerRef.current);
    setStep("payment_method");
  };
  const handleReset = () => {
    setStep("form");
    setCryptoAmount("");
    setNgnAmount("");
    setQuoteTimer(QUOTE_DURATION);
  };

  const isValid = parseFloat(cryptoAmount) > 0 && parseFloat(ngnAmount) > 0;

  return (
    <div className="widget-container" style={{ width: "100%", maxWidth: 480 }}>
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 32px 64px rgba(0,0,0,0.5)",
          animation: "slideUp 0.4s ease",
        }}
      >
        <div style={{ padding: "24px 28px 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                background: C.surface,
                borderRadius: 10,
                border: `1px solid ${C.border}`,
                padding: 3,
                gap: 2,
              }}
            >
              {["sell", "buy"].map((s) => (
                <button
                  key={s}
                  className="tab-btn"
                  onClick={() => {
                    setSide(s);
                    handleReset();
                  }}
                  style={{
                    padding: "7px 20px",
                    borderRadius: 8,
                    border: "none",
                    fontSize: 13,
                    fontWeight: 600,
                    background:
                      side === s
                        ? s === "sell"
                          ? C.green
                          : C.amber
                        : "transparent",
                    color: side === s ? "#000" : C.muted,
                  }}
                >
                  {s === "sell" ? "Sell Crypto" : "Buy Crypto"}
                </button>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(14,203,129,0.06)",
                border: "1px solid rgba(14,203,129,0.15)",
                borderRadius: 100,
                padding: "4px 10px",
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: C.green,
                  animation: "pulse 2s infinite",
                }}
              />
              <span
                style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 10,
                  color: C.green,
                }}
              >
                LIVE
              </span>
            </div>
          </div>
        </div>

        {step === "form" && (
          <div
            style={{ padding: "0 28px 28px", animation: "fadeUp 0.3s ease" }}
          >
            <div style={{ marginBottom: 8 }}>
              <label
                style={{
                  fontSize: 11,
                  color: C.muted,
                  letterSpacing: 2,
                  display: "block",
                  marginBottom: 8,
                }}
              >
                {side === "sell" ? "YOU SEND" : "YOU PAY"}
              </label>
              <div
                style={{
                  background: C.surface,
                  border: `1px solid ${editingField === "crypto" ? C.border2 : C.border}`,
                  borderRadius: 12,
                  padding: "14px 16px",
                  position: "relative",
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  {side === "sell" ? (
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          background: C.card,
                          border: `1px solid ${C.border2}`,
                          borderRadius: 10,
                          padding: "8px 12px",
                          color: "#fff",
                        }}
                      >
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            background: asset.bg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 700,
                            color: asset.color,
                          }}
                        >
                          {asset.icon}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>
                          {asset.symbol}
                        </span>
                        <span style={{ color: C.muted, fontSize: 12 }}>▾</span>
                      </button>
                      {showDropdown && (
                        <AssetDropdown
                          assets={ASSETS}
                          selected={asset}
                          onSelect={(a) => {
                            setAsset(a);
                            setCryptoAmount("");
                            setNgnAmount("");
                          }}
                          onClose={() => setShowDropdown(false)}
                        />
                      )}
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexShrink: 0,
                        background: C.card,
                        border: `1px solid ${C.border2}`,
                        borderRadius: 10,
                        padding: "8px 12px",
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: "rgba(14,203,129,0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          color: C.green,
                        }}
                      >
                        ₦
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>NGN</span>
                    </div>
                  )}
                  <input
                    value={side === "sell" ? cryptoAmount : ngnAmount}
                    onChange={(e) =>
                      side === "sell"
                        ? handleCryptoChange(e.target.value)
                        : handleNGNChange(e.target.value)
                    }
                    onFocus={() =>
                      setEditingField(side === "sell" ? "crypto" : "ngn")
                    }
                    placeholder="0.00"
                    type="number"
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: "none",
                      color: "#fff",
                      fontSize: 22,
                      fontFamily: "'DM Mono',monospace",
                      fontWeight: 500,
                      outline: "none",
                      textAlign: "right",
                      minWidth: 0,
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "4px 0",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: C.surface,
                  border: `1px solid ${C.border2}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  color: C.muted,
                }}
              >
                ⇅
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  fontSize: 11,
                  color: C.muted,
                  letterSpacing: 2,
                  display: "block",
                  marginBottom: 8,
                }}
              >
                YOU RECEIVE
              </label>
              <div
                style={{
                  background: C.surface,
                  border: `1px solid ${editingField === "ngn" && side === "sell" ? C.border2 : C.border}`,
                  borderRadius: 12,
                  padding: "14px 16px",
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  {side === "sell" ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexShrink: 0,
                        background: C.card,
                        border: `1px solid ${C.border2}`,
                        borderRadius: 10,
                        padding: "8px 12px",
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: "rgba(14,203,129,0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          color: C.green,
                        }}
                      >
                        ₦
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>NGN</span>
                    </div>
                  ) : (
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          background: C.card,
                          border: `1px solid ${C.border2}`,
                          borderRadius: 10,
                          padding: "8px 12px",
                          color: "#fff",
                        }}
                      >
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            background: asset.bg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 700,
                            color: asset.color,
                          }}
                        >
                          {asset.icon}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>
                          {asset.symbol}
                        </span>
                        <span style={{ color: C.muted, fontSize: 12 }}>▾</span>
                      </button>
                      {showDropdown && (
                        <AssetDropdown
                          assets={ASSETS}
                          selected={asset}
                          onSelect={(a) => {
                            setAsset(a);
                            setCryptoAmount("");
                            setNgnAmount("");
                          }}
                          onClose={() => setShowDropdown(false)}
                        />
                      )}
                    </div>
                  )}
                  <input
                    readOnly
                    value={
                      side === "sell"
                        ? ngnAmount
                          ? parseFloat(ngnAmount).toLocaleString("en-NG", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : ""
                        : cryptoAmount
                    }
                    placeholder="0.00"
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: "none",
                      color: isValid ? C.green : "#555",
                      fontSize: 22,
                      fontFamily: "'DM Mono',monospace",
                      fontWeight: 500,
                      outline: "none",
                      textAlign: "right",
                      cursor: "default",
                      minWidth: 0,
                    }}
                  />
                </div>
              </div>
            </div>

            {asset.networks.length > 1 && (
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    fontSize: 11,
                    color: C.muted,
                    letterSpacing: 2,
                    marginBottom: 8,
                  }}
                >
                  NETWORK
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {asset.networks.map((n) => (
                    <button
                      key={n}
                      className={`network-pill${network === n ? " active" : ""}`}
                      onClick={() => setNetwork(n)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 100,
                        fontSize: 12,
                        fontWeight: 500,
                        background:
                          network === n
                            ? "rgba(14,203,129,0.1)"
                            : "transparent",
                        border:
                          network === n
                            ? "1px solid rgba(14,203,129,0.3)"
                            : `1px solid ${C.border2}`,
                        color: network === n ? C.green : C.muted,
                        transition: "all 0.2s",
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              disabled={!isValid}
              onClick={handleGetQuote}
              className="confirm-btn"
              style={{
                width: "100%",
                background: isValid ? C.green : C.border,
                color: isValid ? "#000" : C.muted,
                fontWeight: 700,
                fontSize: 15,
                padding: "15px",
                borderRadius: 12,
                border: "none",
              }}
            >
              {isValid ? `Get Quote →` : "Enter an amount"}
            </button>
          </div>
        )}

        {step === "quote" && (
          <div
            style={{ padding: "0 28px 28px", animation: "fadeUp 0.3s ease" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12,
                    color: C.muted,
                    letterSpacing: 2,
                    marginBottom: 4,
                  }}
                >
                  RATE LOCKED
                </div>
                <div
                  style={{
                    fontFamily: "'DM Mono',monospace",
                    fontSize: 13,
                    color:
                      quoteTimer > 20
                        ? C.green
                        : quoteTimer > 10
                          ? C.amber
                          : C.red,
                  }}
                >
                  Quote expires in {quoteTimer}s
                </div>
              </div>
              <CountdownRing seconds={quoteTimer} total={QUOTE_DURATION} />
            </div>
            <div
              style={{
                height: 3,
                background: C.border,
                borderRadius: 2,
                marginBottom: 24,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 2,
                  width: `${(quoteTimer / QUOTE_DURATION) * 100}%`,
                  background:
                    quoteTimer > 20
                      ? C.green
                      : quoteTimer > 10
                        ? C.amber
                        : C.red,
                  transition: "width 1s linear, background 0.5s",
                }}
              />
            </div>
            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                overflow: "hidden",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  padding: "20px 20px 16px",
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: C.muted,
                    letterSpacing: 2,
                    marginBottom: 10,
                  }}
                >
                  {side === "sell" ? "YOU SEND" : "YOU PAY"}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {side === "sell" ? (
                    <>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background: asset.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 16,
                          fontWeight: 700,
                          color: asset.color,
                        }}
                      >
                        {asset.icon}
                      </div>
                      <div>
                        <div
                          style={{
                            fontFamily: "'DM Mono',monospace",
                            fontSize: 22,
                            fontWeight: 500,
                          }}
                        >
                          {cryptoAmount} {asset.symbol}
                        </div>
                        <div style={{ fontSize: 11, color: C.muted }}>
                          {network} Network
                        </div>
                      </div>
                    </>
                  ) : (
                    <div
                      style={{
                        fontFamily: "'DM Mono',monospace",
                        fontSize: 22,
                        fontWeight: 500,
                      }}
                    >
                      ₦
                      {parseFloat(ngnAmount).toLocaleString("en-NG", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  )}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "10px 0",
                  color: C.muted,
                  fontSize: 18,
                }}
              >
                ↓
              </div>
              <div style={{ padding: "16px 20px 20px" }}>
                <div
                  style={{
                    fontSize: 10,
                    color: C.muted,
                    letterSpacing: 2,
                    marginBottom: 10,
                  }}
                >
                  YOU RECEIVE
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {side === "sell" ? (
                    <div
                      style={{
                        fontFamily: "'DM Mono',monospace",
                        fontSize: 26,
                        color: C.green,
                        fontWeight: 500,
                      }}
                    >
                      ₦
                      {parseFloat(ngnAmount).toLocaleString("en-NG", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background: asset.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 16,
                          fontWeight: 700,
                          color: asset.color,
                        }}
                      >
                        {asset.icon}
                      </div>
                      <div
                        style={{
                          fontFamily: "'DM Mono',monospace",
                          fontSize: 22,
                          color: C.green,
                          fontWeight: 500,
                        }}
                      >
                        {cryptoAmount} {asset.symbol}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleReset}
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
                onClick={handleConfirm}
                className="confirm-btn"
                style={{
                  flex: 2,
                  background: C.green,
                  color: "#000",
                  fontWeight: 700,
                  fontSize: 14,
                  padding: "13px",
                  borderRadius: 10,
                }}
              >
                Confirm Trade ✓
              </button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div
            style={{
              padding: "20px 28px 36px",
              textAlign: "center",
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
                margin: "12px auto 24px",
                animation: "successPop 0.5s ease",
              }}
            >
              ✓
            </div>
            <h3
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 32,
                letterSpacing: 1,
                marginBottom: 10,
              }}
            >
              TRADE SUBMITTED
            </h3>
            <p
              style={{
                color: C.muted,
                fontSize: 14,
                lineHeight: 1.7,
                marginBottom: 28,
              }}
            >
              Your trade is being processed. funds will be sent to your account
              within 2–5 minutes.
            </p>
            <button
              onClick={handleReset}
              style={{
                width: "100%",
                background: C.green,
                color: "#000",
                fontWeight: 700,
                fontSize: 14,
                padding: "14px",
                borderRadius: 10,
              }}
            >
              Make Another Trade
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function MarketSidebar() {
  const [prices, setPrices] = useState(
    ASSETS.map((a) => ({
      ...a,
      spark: Array.from(
        { length: 12 },
        (_, i) => 50 + Math.sin(i * 0.8) * 20 + Math.random() * 10,
      ),
    })),
  );

  useEffect(() => {
    const fetchAndUpdatePrices = async () => {
      try {
        const res = await api.get("/rates/");
        const ratesData = Array.isArray(res.data) ? res.data : [res.data];

        setPrices((prev) =>
          prev.map((a) => {
            const rateInfo = ratesData.find(
              (r) => r.asset?.toUpperCase() === a.id,
            );
            if (rateInfo) {
              return {
                ...a,
                rateNGN:
                  rateInfo.user_ngn_usd_rate ||
                  rateInfo.market_ngn_usd_rate ||
                  a.rateNGN,
                spark: [
                  ...a.spark.slice(1),
                  rateInfo.user_ngn_usd_rate ||
                    rateInfo.market_ngn_usd_rate ||
                    a.rateNGN,
                ],
              };
            }
            return a;
          }),
        );
      } catch (e) {
        console.error("Failed to fetch market prices:", e);
      }
    };

    fetchAndUpdatePrices();
    const iv = setInterval(fetchAndUpdatePrices, 30000); // Refresh every 30 seconds
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="side-panel" style={{ width: 280, flexShrink: 0 }}>
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "18px 20px",
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>
            MARKET
          </span>
          <span
            style={{
              fontFamily: "'DM Mono',monospace",
              fontSize: 10,
              color: C.green,
            }}
          >
            LIVE
          </span>
        </div>
        {prices.map((a) => (
          <div
            key={a.id}
            className="recent-row"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 20px",
              borderBottom: `1px solid ${C.border}`,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: a.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: a.color,
              }}
            >
              {a.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{a.symbol}</div>
              <div
                style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 10,
                  color: C.muted,
                }}
              >
                ₦
                {a.rateNGN.toLocaleString("en-NG", {
                  maximumFractionDigits: 0,
                })}
              </div>
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: a.change >= 0 ? C.green : C.red,
              }}
            >
              {a.change >= 0 ? "+" : ""}
              {a.change}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentTrades() {
  return (
    <div
      className="side-panel"
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        overflow: "hidden",
        marginTop: 20,
      }}
    >
      <div
        style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}` }}
      >
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>
          RECENT TRADES
        </span>
      </div>
      {RECENT_TRADES.map((t, i) => (
        <div
          key={i}
          className="recent-row"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "13px 20px",
            borderBottom: `1px solid ${C.border}`,
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                fontSize: 10,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  t.type === "sell"
                    ? "rgba(14,203,129,0.1)"
                    : "rgba(245,166,35,0.1)",
                color: t.type === "sell" ? C.green : C.amber,
              }}
            >
              {t.type === "sell" ? "↑" : "↓"}
            </div>
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  textTransform: "capitalize",
                }}
              >
                {t.type} {t.asset}
              </div>
              <div style={{ fontSize: 10, color: C.muted }}>{t.time}</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12 }}>
              {t.amount} {t.asset}
            </div>
            <div style={{ fontSize: 11, color: C.green }}>₦{t.ngn}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ExchangePage() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
      <Navbar />
      <div
        style={{
          paddingTop: 68,
          background: C.surface,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 48px 0" }}
        >
          <div
            className="hero-flex"
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 28,
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(14,203,129,0.08)",
                  border: "1px solid rgba(14,203,129,0.2)",
                  borderRadius: 100,
                  padding: "5px 12px",
                  fontSize: 11,
                  color: C.green,
                  letterSpacing: 2,
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: C.green,
                    animation: "pulse 2s infinite",
                  }}
                />
                LIVE EXCHANGE
              </div>
              <h1
                style={{
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: "clamp(40px,5vw,64px)",
                  lineHeight: 0.92,
                  letterSpacing: 2,
                  marginBottom: 10,
                }}
              >
                BUY & SELL CRYPTO
                <br />
                <span style={{ color: C.green }}>FOR NAIRA</span>
              </h1>
              <p
                style={{
                  color: C.muted,
                  fontSize: 15,
                  fontWeight: 300,
                  lineHeight: 1.6,
                }}
              >
                Best rates · Locked quotes · NGN paid within minutes
              </p>
            </div>
            <div
              className="stat-chips"
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                justifyContent: "flex-end",
              }}
            >
              {[
                { label: "BTC/NGN", val: "₦98.2M", up: true },
                { label: "USDT/NGN", val: "₦1,592", up: false },
                { label: "ETH/NGN", val: "₦3.42M", up: true },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    padding: "10px 16px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: C.muted,
                      letterSpacing: 2,
                      marginBottom: 4,
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Mono',monospace",
                      fontSize: 15,
                      color: s.up ? C.green : C.red,
                    }}
                  >
                    {s.val}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div
        className="main-wrapper"
        style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 48px" }}
      >
        <div
          className="exchange-grid"
          style={{ display: "flex", gap: 28, alignItems: "flex-start" }}
        >
          <MarketSidebar />
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <ExchangeWidget />
          </div>
          <div
            className="side-panel side-panel-desktop"
            style={{ width: 280, flexShrink: 0 }}
          >
            <div
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                padding: "20px",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: 1,
                  marginBottom: 16,
                }}
              >
                WHY SWIFT TRADE
              </div>
              {[
                {
                  icon: (
                    <svg
                      width={15}
                      height={15}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={C.amber}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  ),
                  title: "Instant Quotes",
                  sub: "Rate locked for 60 seconds",
                },
                {
                  icon: (
                    <svg
                      width={15}
                      height={15}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={C.green}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  ),
                  title: "Secure Platform",
                  sub: "2FA + encrypted wallets",
                },
                {
                  icon: (
                    <svg
                      width={15}
                      height={15}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={C.green}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                    </svg>
                  ),
                  title: "Best Rates",
                  sub: "4% spread, zero hidden fees",
                },
                {
                  icon: (
                    <svg
                      width={15}
                      height={15}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={C.amber}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  ),
                  title: "Fast Payouts",
                  sub: "NGN in 2–5 minutes",
                },
              ].map((b) => (
                <div
                  key={b.title}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    marginBottom: 14,
                  }}
                >
                  <span style={{ flexShrink: 0, marginTop: 1 }}>{b.icon}</span>
                  <div>
                    <div
                      style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}
                    >
                      {b.title}
                    </div>
                    <div
                      style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}
                    >
                      {b.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <RecentTrades />
          </div>
        </div>
      </div>
    </div>
  );
}
