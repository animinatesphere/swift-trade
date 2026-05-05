export const C = {
  green:   "#0ECB81",
  amber:   "#F5A623",
  red:     "#F6465D",
  bg:      "#080808",
  surface: "#0f0f0f",
  card:    "#111111",
  border:  "#1a1a1a",
  border2: "#222222",
  text:    "#ffffff",
  muted:   "#666666",
  muted2:  "#333333",
};

export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #080808; color: #fff; font-family: 'Outfit', sans-serif; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #080808; }
  ::-webkit-scrollbar-thumb { background: #222; border-radius: 4px; }
  a { text-decoration: none; }
  button { cursor: pointer; }

  @keyframes float {
    0%,100% { transform: translateY(0) scale(1); }
    50%      { transform: translateY(-30px) scale(1.05); }
  }
  @keyframes float2 {
    0%,100% { transform: translateY(0) scale(1); }
    50%      { transform: translateY(-30px) scale(1.05); }
  }
  @keyframes float3 {
    0%,100% { transform: translateX(-50%) translateY(0) scale(1); }
    50%      { transform: translateX(-50%) translateY(-30px) scale(1.05); }
  }
  @keyframes pulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:0.5; transform:scale(0.8); }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(24px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .hero-badge   { animation: fadeUp 0.8s 0s ease both; }
  .hero-title   { animation: fadeUp 0.8s 0.1s ease both; }
  .hero-sub     { animation: fadeUp 0.8s 0.2s ease both; }
  .hero-actions { animation: fadeUp 0.8s 0.3s ease both; }
  .ticker-wrap  { animation: fadeUp 0.8s 0.5s ease both; }

  .orb-1 { animation: float  8s 0s   ease-in-out infinite; }
  .orb-2 { animation: float2 8s -3s  ease-in-out infinite; }
  .orb-3 { animation: float3 8s -5s  ease-in-out infinite; }

  .ticker-track { animation: ticker 30s linear infinite; }

  .fade-in { opacity:0; transform:translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .fade-in.visible { opacity:1; transform:translateY(0); }

  .nav-link-item:hover { color: #fff !important; }
  .btn-primary:hover  { background:#0fdf8e !important; transform:translateY(-2px); box-shadow:0 12px 32px rgba(14,203,129,0.35); }
  .btn-secondary:hover { border-color:#444 !important; background:#111 !important; }
  .nav-cta:hover      { background:#0fdf8e !important; transform:translateY(-1px); box-shadow:0 8px 24px rgba(14,203,129,0.3); }
  .btn-lg-primary:hover  { background:#0fdf8e !important; transform:translateY(-2px); box-shadow:0 16px 40px rgba(14,203,129,0.3); }
  .btn-lg-outline:hover  { border-color:#444 !important; background:#0f0f0f !important; }
  .service-card:hover { background:#141414 !important; }
  .service-card:hover .svc-bottom-line { opacity:1 !important; }
  .service-card:hover .svc-link-arrow  { margin-left:12px !important; }
  .rate-card:hover    { background:#141414 !important; }
  .testi-card:hover   { border-color:#222 !important; transform:translateY(-4px); }
  .gc-card:hover      { transform:translateY(-4px); box-shadow:0 20px 40px rgba(0,0,0,0.4); }
  .stat-item:hover    { background:#0f0f0f !important; }
  .how-step:hover .step-num-box { color:#0ECB81 !important; border-color:rgba(14,203,129,0.3) !important; background:rgba(14,203,129,0.06) !important; }
  .footer-link-item:hover { color:#fff !important; }
  .footer-bottom-link:hover { color:#fff !important; }
`;
