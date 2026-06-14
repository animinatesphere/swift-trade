import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";

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
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html { scroll-behavior:smooth; }
  body { background:#080808; color:#fff; font-family:'Outfit',sans-serif; overflow-x:hidden; }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:#080808; }
  ::-webkit-scrollbar-thumb { background:#222; border-radius:4px; }
  a { text-decoration:none; color:inherit; }
  button { cursor:pointer; font-family:'Outfit',sans-serif; }
  input  { font-family:'Outfit',sans-serif; }

  @keyframes pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }
  @keyframes ticker   { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes flash    { 0%{background:rgba(14,203,129,0.15)} 100%{background:transparent} }
  @keyframes flashRed { 0%{background:rgba(246,70,93,0.15)}  100%{background:transparent} }

  .fade-in { opacity:0; transform:translateY(20px); transition:opacity 0.6s ease,transform 0.6s ease; }
  .fade-in.visible { opacity:1; transform:translateY(0); }

  .nav-link-item:hover { color:#fff !important; }
  .nav-cta:hover { background:#0fdf8e !important; transform:translateY(-1px); }
  .asset-row:hover { background:#141414 !important; }
  .asset-row.flashing-up   { animation:flash    0.6s ease; }
  .asset-row.flashing-down { animation:flashRed 0.6s ease; }
  .tab-pill:hover { color:#fff !important; border-color:#333 !important; }
  .tab-pill.active { background:rgba(14,203,129,0.1) !important; border-color:rgba(14,203,129,0.3) !important; color:#0ECB81 !important; }
  .ticker-track { animation:ticker 32s linear infinite; }
  .ticker-track:hover { animation-play-state:paused; }

  @media (max-width: 1024px) {
    .rates-header { flex-direction: column !important; align-items: flex-start !important; gap: 24px !important; }
    .rates-layout { grid-template-columns: 1fr !important; }
    .rates-table-container { overflow-x: auto !important; margin: 0 -20px !important; padding: 0 20px !important; }
    .rates-table { min-width: 800px !important; }
    .calc-panel { position: static !important; width: 100% !important; margin-top: 40px !important; }
    .main-wrapper { padding: 40px 20px !important; }
    .hero-padding { padding: 44px 20px 0 !important; }
    .info-grid { grid-template-columns: 1fr 1fr !important; }
  }

  @media (max-width: 640px) {
    .rates-header h1 { font-size: 32px !important; }
    .info-grid { grid-template-columns: 1fr !important; }
    .tab-pill { padding: 8px 16px !important; fontSize: 12px !important; }
    .footer-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
  }
`;

// ─── DATA ─────────────────────────────────────────────────
const SPREAD = 0.04;

const BASE_ASSETS = [
  {
    id: "BTC",
    name: "Bitcoin",
    symbol: "BTC",
    icon: "₿",
    color: "#F7931A",
    bg: "rgba(247,147,26,0.15)",
    baseRate: 98240000,
    change24h: +2.4,
    vol: "₦4.2B",
    mcap: "Large Cap",
    networks: ["BTC"],
  },
  {
    id: "ETH",
    name: "Ethereum",
    symbol: "ETH",
    icon: "Ξ",
    color: "#627EEA",
    bg: "rgba(98,126,234,0.15)",
    baseRate: 3420000,
    change24h: +1.8,
    vol: "₦1.8B",
    mcap: "Large Cap",
    networks: ["ERC20"],
  },
  {
    id: "USDT",
    name: "Tether",
    symbol: "USDT",
    icon: "₮",
    color: "#26A17B",
    bg: "rgba(38,161,123,0.15)",
    baseRate: 1592,
    change24h: -0.3,
    vol: "₦9.1B",
    mcap: "Stablecoin",
    networks: ["TRC20", "ERC20"],
  },
  {
    id: "USDC",
    name: "USD Coin",
    symbol: "USDC",
    icon: "◎",
    color: "#0072FF",
    bg: "rgba(0,114,255,0.15)",
    baseRate: 1590,
    change24h: +0.1,
    vol: "₦2.3B",
    mcap: "Stablecoin",
    networks: ["ERC20", "SOL"],
  },
  {
    id: "BNB",
    name: "BNB",
    symbol: "BNB",
    icon: "⬡",
    color: "#F3BA2F",
    bg: "rgba(243,186,47,0.15)",
    baseRate: 920000,
    change24h: +3.1,
    vol: "₦820M",
    mcap: "Large Cap",
    networks: ["BEP20"],
  },
  {
    id: "SOL",
    name: "Solana",
    symbol: "SOL",
    icon: "◎",
    color: "#9945FF",
    bg: "rgba(153,69,255,0.15)",
    baseRate: 218400,
    change24h: -1.2,
    vol: "₦610M",
    mcap: "Large Cap",
    networks: ["SOL"],
  },
  {
    id: "XRP",
    name: "XRP",
    symbol: "XRP",
    icon: "✕",
    color: "#00AAE4",
    bg: "rgba(0,170,228,0.15)",
    baseRate: 860,
    change24h: +0.8,
    vol: "₦290M",
    mcap: "Large Cap",
    networks: ["XRP"],
  },
  {
    id: "DOGE",
    name: "Dogecoin",
    symbol: "DOGE",
    icon: "Ð",
    color: "#C2A633",
    bg: "rgba(194,166,51,0.15)",
    baseRate: 262,
    change24h: +5.2,
    vol: "₦145M",
    mcap: "Mid Cap",
    networks: ["DOGE"],
  },
  {
    id: "MATIC",
    name: "Polygon",
    symbol: "MATIC",
    icon: "⬡",
    color: "#8247E5",
    bg: "rgba(130,71,229,0.15)",
    baseRate: 950,
    change24h: -2.1,
    vol: "₦98M",
    mcap: "Mid Cap",
    networks: ["ERC20", "MATIC"],
  },
  {
    id: "ADA",
    name: "Cardano",
    symbol: "ADA",
    icon: "₳",
    color: "#0D3FC4",
    bg: "rgba(13,63,196,0.15)",
    baseRate: 720,
    change24h: +1.4,
    vol: "₦76M",
    mcap: "Mid Cap",
    networks: ["ADA"],
  },
];

const GC_RATES = [
  {
    brand: "Amazon",
    country: "USA",
    icon: "🛒",
    color: "#FF9900",
    bg: "rgba(255,153,0,0.08)",
    rate: 1380,
    denoms: ["$25", "$50", "$100", "$200"],
    trend: +0.5,
  },
  {
    brand: "Amazon",
    country: "UK",
    icon: "🛒",
    color: "#FF9900",
    bg: "rgba(255,153,0,0.08)",
    rate: 1640,
    denoms: ["£25", "£50", "£100"],
    trend: +0.3,
  },
  {
    brand: "iTunes",
    country: "USA",
    icon: "🎵",
    color: "#FC3C44",
    bg: "rgba(252,60,68,0.08)",
    rate: 1350,
    denoms: ["$15", "$25", "$50", "$100"],
    trend: -0.2,
  },
  {
    brand: "Steam",
    country: "USA",
    icon: "🎮",
    color: "#66C0F4",
    bg: "rgba(102,192,244,0.08)",
    rate: 1300,
    denoms: ["$10", "$20", "$50", "$100"],
    trend: 0,
  },
  {
    brand: "Google Play",
    country: "USA",
    icon: "▶",
    color: "#0ECB81",
    bg: "rgba(14,203,129,0.08)",
    rate: 1370,
    denoms: ["$10", "$25", "$50", "$100"],
    trend: +0.1,
  },
  {
    brand: "Netflix",
    country: "USA",
    icon: "🎬",
    color: "#E50914",
    bg: "rgba(229,9,20,0.08)",
    rate: 1300,
    denoms: ["$15", "$30", "$60", "$100"],
    trend: -0.8,
  },
  {
    brand: "Xbox",
    country: "USA",
    icon: "🎮",
    color: "#107C10",
    bg: "rgba(16,124,16,0.08)",
    rate: 1280,
    denoms: ["$10", "$25", "$50", "$100"],
    trend: 0,
  },
  {
    brand: "Visa",
    country: "USA",
    icon: "💳",
    color: "#1A1F71",
    bg: "rgba(26,31,113,0.08)",
    rate: 1260,
    denoms: ["$50", "$100", "$200", "$500"],
    trend: -0.3,
  },
];

function genSpark(base, len = 24) {
  let v = base;
  const out = [];
  for (let i = 0; i < len; i++) {
    v *= 1 + (Math.random() - 0.5) * 0.015;
    out.push(v);
  }
  return out;
}

// ─── SPARKLINE ────────────────────────────────────────────
function Sparkline({ data, color, width = 80, height = 32 }) {
  if (!data || data.length < 2) return null;
  const mn = Math.min(...data),
    mx = Math.max(...data);
  const toX = (i) => (i / (data.length - 1)) * width;
  const toY = (v) => height - ((v - mn) / (mx - mn || 1)) * (height - 4) - 2;
  const path = data
    .map(
      (v, i) =>
        `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`,
    )
    .join(" ");
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RefreshBar({ seconds, total }) {
  const pct = (seconds / total) * 100;
  const color = seconds > 30 ? C.green : seconds > 15 ? C.amber : C.red;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          flex: 1,
          height: 3,
          background: C.border,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 2,
            width: `${pct}%`,
            background: color,
            transition: "width 1s linear, background 0.5s",
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "'DM Mono',monospace",
          fontSize: 10,
          color,
          minWidth: 32,
        }}
      >
        {seconds}s
      </span>
    </div>
  );
}

function FadeIn({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("fade-in");
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
    <div ref={ref} style={{ transitionDelay: `${delay}s`, ...style }}>
      {children}
    </div>
  );
}

export default function RatesPage() {
  const REFRESH_TOTAL = 60;
  const [activeTab, setActiveTab] = useState("crypto");
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [sortBy, setSortBy] = useState("vol");
  const [sortDir, setSortDir] = useState(-1);
  const [filter, setFilter] = useState("");
  const [timer, setTimer] = useState(REFRESH_TOTAL);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const [calcAmount, setCalcAmount] = useState("");
  const [calcMode, setCalcMode] = useState("sell");

  // Fetch rates from API
  const fetchRates = useCallback(async () => {
    try {
      const res = await api.get("/rates/");
      const ratesData = Array.isArray(res.data) ? res.data : [res.data];

      const mappedAssets = ratesData.map((rate) => {
        const asset = rate.asset?.toUpperCase() || "";
        const userRate = rate.user_rate || rate.market_rate || 0;
        const userNgnRate =
          rate.user_ngn_usd_rate || rate.market_ngn_usd_rate || 1500;

        // Find display info from BASE_ASSETS if available
        const baseAsset = BASE_ASSETS.find((a) => a.id === asset);

        return {
          id: asset,
          name: baseAsset?.name || asset,
          symbol: asset,
          icon: baseAsset?.icon || "◎",
          color: baseAsset?.color || "#888",
          bg: baseAsset?.bg || "rgba(136,136,136,0.15)",
          baseRate: userRate / userNgnRate,
          sellRate: (userRate / userNgnRate) * (1 - SPREAD),
          buyRate: (userRate / userNgnRate) * (1 + SPREAD),
          history: genSpark(userRate / userNgnRate),
          change24h: baseAsset?.change24h || 0,
          vol: baseAsset?.vol || "—",
          mcap: baseAsset?.mcap || "—",
          flashClass: "",
          updated_at: rate.updated_at,
          margin_percentage: rate.margin_percentage || 2.5,
        };
      });

      setAssets(mappedAssets);
      if (mappedAssets.length > 0 && !selectedAsset) {
        setSelectedAsset(mappedAssets[0]);
      }
    } catch (e) {
      console.error("Failed to fetch rates:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const tickAssets = useCallback(() => {
    // Refresh rates from API instead of simulating
    fetchRates();
  }, [fetchRates]);

  useEffect(() => {
    fetchRates();
    const iv = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          tickAssets();
          return REFRESH_TOTAL;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [tickAssets, fetchRates]);

  const displayed = [...assets]
    .filter(
      (a) =>
        a.name.toLowerCase().includes(filter.toLowerCase()) ||
        a.symbol.toLowerCase().includes(filter.toLowerCase()),
    )
    .sort((a, b) => {
      const valA =
        typeof a[sortBy] === "string"
          ? parseFloat(a[sortBy].replace(/[₦,BMK]/g, ""))
          : a[sortBy];
      const valB =
        typeof b[sortBy] === "string"
          ? parseFloat(b[sortBy].replace(/[₦,BMK]/g, ""))
          : b[sortBy];
      return (valA - valB) * sortDir;
    });

  const selected = selectedAsset || displayed[0];

  const calcResult = (() => {
    if (!calcAmount || !selected) return null;
    const n = parseFloat(calcAmount);
    if (isNaN(n) || n <= 0) return null;
    if (calcMode === "sell")
      return {
        ngn: n * selected.sellRate,
        label: `${n} ${selected.symbol} → NGN`,
      };
    return {
      crypto: n / selected.buyRate,
      label: `₦${n.toLocaleString()} → ${selected.symbol}`,
    };
  })();

  const fmtNGN = (n) =>
    "₦" +
    n.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const fmtRate = (n) =>
    n >= 1e6
      ? `₦${(n / 1e6).toFixed(3)}M`
      : `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <Navbar />

      <div
        style={{
          paddingTop: 68,
          background: C.surface,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div
          className="hero-padding"
          style={{ maxWidth: 1280, margin: "0 auto", padding: "44px 48px 0" }}
        >
          <div
            className="rates-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 32,
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
                  marginBottom: 16,
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
                LIVE MARKET RATES
              </div>
              <h1
                style={{
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: "clamp(40px,5vw,72px)",
                  lineHeight: 0.9,
                  letterSpacing: 2,
                  marginBottom: 10,
                }}
              >
                EXCHANGE RATES
                <br />
                <span style={{ color: C.green }}>UPDATED EVERY 60s</span>
              </h1>
              <p
                style={{
                  color: C.muted,
                  fontSize: 15,
                  fontWeight: 300,
                  maxWidth: 480,
                  lineHeight: 1.6,
                }}
              >
                See our live buy and sell rates for all supported crypto assets
                and gift cards.
              </p>
            </div>
            <div
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                padding: "20px 24px",
                minWidth: 240,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: C.muted,
                  letterSpacing: 2,
                  marginBottom: 10,
                }}
              >
                NEXT REFRESH
              </div>
              <RefreshBar seconds={timer} total={REFRESH_TOTAL} />
            </div>
          </div>
          <div
            style={{
              overflow: "hidden",
              borderTop: `1px solid ${C.border}`,
              padding: "12px 0",
            }}
          >
            <div
              className="ticker-track"
              style={{ display: "flex", width: "max-content" }}
            >
              {[...assets, ...assets].map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "0 24px",
                    borderRight: `1px solid ${C.border}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Mono',monospace",
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    {a.symbol}/NGN
                  </span>
                  <span
                    style={{
                      fontFamily: "'DM Mono',monospace",
                      fontSize: 12,
                      color: C.muted,
                    }}
                  >
                    {fmtRate(a.sellRate)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className="main-wrapper"
        style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 48px" }}
      >
        <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
          {[
            { id: "crypto", label: "Crypto Rates" },
            { id: "giftcard", label: "Gift Card Rates" },
          ].map((t) => (
            <button
              key={t.id}
              className={`tab-pill${activeTab === t.id ? " active" : ""}`}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: "9px 24px",
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 600,
                background:
                  activeTab === t.id ? "rgba(14,203,129,0.1)" : "transparent",
                border:
                  activeTab === t.id
                    ? "1px solid rgba(14,203,129,0.3)"
                    : `1px solid ${C.border2}`,
                color: activeTab === t.id ? C.green : C.muted,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "crypto" && (
          <div
            className="rates-layout"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 360px",
              gap: 24,
              alignItems: "start",
            }}
          >
            <div className="rates-table-container">
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginBottom: 16,
                  alignItems: "center",
                }}
              >
                <input
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Search asset..."
                  style={{
                    flex: 1,
                    background: C.card,
                    border: `1px solid ${C.border2}`,
                    borderRadius: 10,
                    padding: "9px 14px",
                    color: "#fff",
                    fontSize: 14,
                  }}
                />
              </div>
              <div
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 16,
                  overflow: "hidden",
                }}
              >
                <div
                  className="rates-table"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1.4fr 1.4fr 0.8fr 1fr 80px",
                    padding: "12px 20px",
                    borderBottom: `1px solid ${C.border}`,
                    background: C.surface,
                  }}
                >
                  {[
                    "Asset",
                    "Sell Rate",
                    "Buy Rate",
                    "24h",
                    "Vol",
                    "Chart",
                  ].map((h) => (
                    <div
                      key={h}
                      style={{
                        fontSize: 10,
                        color: C.muted,
                        letterSpacing: 2,
                        textTransform: "uppercase",
                      }}
                    >
                      {h}
                    </div>
                  ))}
                </div>
                {displayed.map((a, i) => (
                  <FadeIn key={a.id} delay={i * 0.03}>
                    <div
                      className={`asset-row rates-table ${a.flashClass}`}
                      onClick={() => setSelectedAsset(a)}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1.4fr 1.4fr 0.8fr 1fr 80px",
                        padding: "14px 20px",
                        borderBottom: `1px solid ${C.border}`,
                        cursor: "pointer",
                        transition: "0.15s",
                        background:
                          selectedAsset?.id === a.id
                            ? "rgba(14,203,129,0.04)"
                            : "transparent",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            background: a.bg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 14,
                            fontWeight: 700,
                            color: a.color,
                          }}
                        >
                          {a.icon}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>
                            {a.name}
                          </div>
                          <div style={{ fontSize: 11, color: C.muted }}>
                            {a.symbol}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          fontFamily: "'DM Mono',monospace",
                          fontSize: 13,
                          color: C.green,
                        }}
                      >
                        {fmtRate(a.sellRate)}
                      </div>
                      <div
                        style={{
                          fontFamily: "'DM Mono',monospace",
                          fontSize: 13,
                          color: C.amber,
                        }}
                      >
                        {fmtRate(a.buyRate)}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: a.change24h >= 0 ? C.green : C.red,
                        }}
                      >
                        {a.change24h >= 0 ? "+" : ""}
                        {a.change24h}%
                      </div>
                      <div
                        style={{
                          fontFamily: "'DM Mono',monospace",
                          fontSize: 12,
                          color: C.muted,
                        }}
                      >
                        {a.vol}
                      </div>
                      <Sparkline
                        data={a.history}
                        color={a.change24h >= 0 ? C.green : C.red}
                        width={70}
                        height={28}
                      />
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>

            <div className="calc-panel" style={{ position: "sticky", top: 84 }}>
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
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: selected.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      fontWeight: 700,
                      color: selected.color,
                    }}
                  >
                    {selected.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>
                      {selected.name}
                    </div>
                    <div style={{ fontSize: 12, color: C.muted }}>
                      {selected.symbol}
                    </div>
                  </div>
                </div>
                {[
                  ["Sell Rate", fmtRate(selected.sellRate), C.green],
                  ["Buy Rate", fmtRate(selected.buyRate), C.amber],
                  ["Spread", "4.00%", C.muted],
                ].map(([k, v, c]) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "9px 0",
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    <span style={{ color: C.muted, fontSize: 13 }}>{k}</span>
                    <span
                      style={{
                        fontFamily: "'DM Mono',monospace",
                        fontSize: 13,
                        color: c,
                      }}
                    >
                      {v}
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 16,
                  padding: "20px",
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
                  RATE CALCULATOR
                </div>
                <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                  {[
                    { v: "sell", l: "Sell" },
                    { v: "buy", l: "Buy" },
                  ].map((m) => (
                    <button
                      key={m.v}
                      onClick={() => setCalcMode(m.v)}
                      style={{
                        flex: 1,
                        padding: "7px",
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                        background:
                          calcMode === m.v
                            ? m.v === "sell"
                              ? C.green
                              : C.amber
                            : C.surface,
                        color: calcMode === m.v ? "#000" : C.muted,
                        border: `1px solid ${C.border}`,
                      }}
                    >
                      {m.l}
                    </button>
                  ))}
                </div>
                <input
                  value={calcAmount}
                  type="number"
                  onChange={(e) => setCalcAmount(e.target.value)}
                  placeholder="0.00"
                  style={{
                    width: "100%",
                    background: C.surface,
                    border: `1px solid ${C.border2}`,
                    borderRadius: 10,
                    padding: "11px 14px",
                    color: "#fff",
                    fontFamily: "'DM Mono',monospace",
                    fontSize: 14,
                    outline: "none",
                    marginBottom: 12,
                  }}
                />
                {calcResult && (
                  <div
                    style={{
                      background: "rgba(14,203,129,0.06)",
                      border: "1px solid rgba(14,203,129,0.15)",
                      borderRadius: 10,
                      padding: "14px",
                    }}
                  >
                    <div
                      style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}
                    >
                      {calcResult.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "'DM Mono',monospace",
                        fontSize: 20,
                        color: calcResult.ngn ? C.green : C.amber,
                        fontWeight: 500,
                      }}
                    >
                      {calcResult.ngn
                        ? fmtNGN(calcResult.ngn)
                        : `${calcResult.crypto.toFixed(8)} ${selected.symbol}`}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "giftcard" && (
          <div>
            <div
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              <div
                className="rates-table"
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1.2fr 1fr 1.4fr",
                  padding: "12px 24px",
                  borderBottom: `1px solid ${C.border}`,
                  background: C.surface,
                }}
              >
                {["Brand", "Rate / USD", "Best Denom", "Trend", "Denoms"].map(
                  (h) => (
                    <div
                      key={h}
                      style={{
                        fontSize: 10,
                        color: C.muted,
                        letterSpacing: 2,
                        textTransform: "uppercase",
                      }}
                    >
                      {h}
                    </div>
                  ),
                )}
              </div>
              {GC_RATES.map((gc, i) => (
                <FadeIn key={i} delay={i * 0.04}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr 1.2fr 1fr 1.4fr",
                      padding: "16px 24px",
                      borderBottom: `1px solid ${C.border}`,
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          background: gc.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 18,
                        }}
                      >
                        {gc.icon}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: gc.color,
                          }}
                        >
                          {gc.brand}
                        </div>
                        <div style={{ fontSize: 11, color: C.muted }}>
                          {gc.country}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: "'DM Mono',monospace",
                        fontSize: 15,
                        color: C.green,
                      }}
                    >
                      ₦{gc.rate.toLocaleString()}
                    </div>
                    <div
                      style={{
                        fontFamily: "'DM Mono',monospace",
                        fontSize: 13,
                      }}
                    >
                      {gc.denoms[gc.denoms.length - 1]}
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: gc.trend >= 0 ? C.green : C.red,
                        }}
                      >
                        {gc.trend >= 0 ? "+" : ""}
                        {gc.trend}%
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {gc.denoms.map((d) => (
                        <span
                          key={d}
                          style={{
                            fontSize: 10,
                            padding: "3px 8px",
                            background: C.border,
                            color: C.muted,
                            borderRadius: 6,
                          }}
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
            <div
              className="info-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 12,
                marginTop: 20,
              }}
            >
              {[
                {
                  icon: (
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={C.amber}
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  ),
                  title: "Fast payout",
                },
                {
                  icon: (
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={C.green}
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  ),
                  title: "No hidden fees",
                },
                {
                  icon: (
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={C.muted}
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  ),
                  title: "Photo upload",
                },
                {
                  icon: (
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={C.green}
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="23 4 23 10 17 10" />
                      <polyline points="1 20 1 14 7 14" />
                      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                    </svg>
                  ),
                  title: "Daily updates",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  style={{
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderRadius: 14,
                    padding: "20px",
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
                    {c.icon}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{c.title}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer
      style={{
        padding: "80px 64px 40px",
        background: C.surface,
        borderTop: `1px solid ${C.border}`,
        marginTop: 80,
      }}
    >
      <div
        className="footer-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          gap: 64,
          marginBottom: 64,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: C.green,
              }}
            />
            <span
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 20,
                letterSpacing: 1,
              }}
            >
              SWIFT TRADE
            </span>
          </div>
          <p
            style={{
              color: C.muted,
              fontSize: 14,
              maxWidth: 280,
              lineHeight: 1.6,
            }}
          >
            Nigeria's fastest crypto exchange and gift card platform. Convert
            digital assets to naira instantly.
          </p>
        </div>
        <div>
          <h5
            style={{
              fontSize: 12,
              letterSpacing: 2,
              color: C.muted,
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            Links
          </h5>
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {["Exchange", "Gift Cards", "Rates", "About"].map((l) => (
              <li key={l}>
                <Link
                  to={l === "About" ? "/about" : "#"}
                  style={{ color: C.muted, fontSize: 14 }}
                >
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div
        style={{
          paddingTop: 32,
          borderTop: `1px solid ${C.border}`,
          textAlign: "center",
          fontSize: 12,
          color: C.muted2,
        }}
      >
        © 2025 Swift Trade. All rights reserved.
      </div>
    </footer>
  );
}
