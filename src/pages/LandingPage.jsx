import { useState, useEffect, useRef } from "react";
import { useTheme } from "../hooks/useTheme";
import { colors, fonts } from "../theme/tokens";

// ─── DATA ──────────────────────────────────────────────────
const TICKER_ITEMS = [
  { sym: "BTC/NGN", price: "₦98,240,000", change: "+2.4%", up: true },
  { sym: "ETH/NGN", price: "₦3,420,000", change: "+1.8%", up: true },
  { sym: "USDT/NGN", price: "₦1,592", change: "-0.3%", up: false },
  { sym: "USDC/NGN", price: "₦1,590", change: "+0.1%", up: true },
  { sym: "BNB/NGN", price: "₦920,000", change: "+3.1%", up: true },
  { sym: "SOL/NGN", price: "₦218,400", change: "-1.2%", up: false },
];

const STATS = [
  { num: "₦12B+", label: "Total volume traded" },
  { num: "50K+", label: "Active users" },
  { num: "99.9%", label: "Uptime guaranteed" },
  { num: "2min", label: "Avg. withdrawal time" },
];

const SERVICES = [
  { 
    icon: "₿", iconClass: "green", title: "Crypto Exchange", 
    desc: "Buy and sell Bitcoin, USDT, Ethereum, and 15+ other cryptocurrencies at the best market rates with zero hidden fees.",
    link: "Start trading" 
  },
  { 
    icon: "⇄", iconClass: "amber", title: "Crypto Conversion", 
    desc: "Convert any crypto asset directly to Nigerian Naira and receive funds in your bank account within minutes.",
    link: "Convert now" 
  },
  { 
    icon: "🎁", iconClass: "red", title: "Gift Card Exchange", 
    desc: "Trade Amazon, iTunes, Steam, Google Play and more gift cards for naira. Instant quotes, fast payouts.",
    link: "Sell gift cards" 
  },
];

const STEPS = [
  { n: "01", title: "Create your account", desc: "Sign up in under 2 minutes. Verify your identity and get your personal crypto wallet generated instantly." },
  { n: "02", title: "Deposit or send crypto", desc: "Send crypto to your unique Swift Trade wallet address. We support BTC, ETH, USDT and more." },
  { n: "03", title: "Convert to Naira", desc: "Lock in a live rate and convert your crypto to NGN balance. Rate expires in 60 seconds." },
  { n: "04", title: "Withdraw to your bank", desc: "Send your naira balance to any Nigerian bank account. Most withdrawals land within minutes." },
];

const RATES = [
  { icon: "₿", color: "#F7931A", bg: "rgba(247,147,26,0.15)", name: "Bitcoin", ticker: "BTC/NGN", price: "₦98,240,000", change: "+2.4%", up: true },
  { icon: "Ξ", color: "#627EEA", bg: "rgba(98,126,234,0.15)", name: "Ethereum", ticker: "ETH/NGN", price: "₦3,420,000", change: "+1.8%", up: true },
  { icon: "₮", color: "#26A17B", bg: "rgba(38,161,123,0.15)", name: "Tether", ticker: "USDT/NGN", price: "₦1,592", change: "-0.3%", up: false },
  { icon: "◎", color: "#0072FF", bg: "rgba(0,114,255,0.15)", name: "USD Coin", ticker: "USDC/NGN", price: "₦1,590", change: "+0.1%", up: true },
];

const GC_CARDS = [
  { label: "Amazon", color: "#FF9900", bg: "linear-gradient(135deg,#1a0a00,#2d1500)", amount: "$100", rate: "₦140,000" },
  { label: "Steam", color: "#66C0F4", bg: "linear-gradient(135deg,#001a2d,#00264d)", amount: "$50", rate: "₦66,500" },
  { label: "iTunes", color: "#FC3C44", bg: "linear-gradient(135deg,#1a001a,#2d002d)", amount: "$25", rate: "₦33,750" },
  { label: "Google Play", color: "#0ECB81", bg: "linear-gradient(135deg,#001a00,#002d00)", amount: "$50", rate: "₦68,500" },
];

const TESTIMONIALS = [
  { initials: "AO", name: "Adebayo Okafor", loc: "Lagos", text: `"I sold 200 USDT and had the naira in my account in under 10 minutes. Fastest platform ever."`, stars: 5 },
  { initials: "CN", name: "Chioma Nwosu", loc: "Abuja", text: `"The gift card rates are the best. My Amazon card was processed instantly. Very impressed."`, stars: 5 },
  { initials: "EI", name: "Emeka Ike", loc: "Port Harcourt", text: `"Very transparent rates. No surprises. Finally an honest platform for Nigerians."`, stars: 5 },
];

const FOOTER_LINKS = {
  Products: ["Crypto Exchange", "Crypto Conversion", "Gift Cards", "Live Rates"],
  Company: ["About Us", "Careers", "Blog", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "AML Policy", "Cookie Policy"],
};

// ─── STYLES ────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  
  body { margin: 0; padding: 0; background: ${colors.bg}; color: ${colors.text}; font-family: ${fonts.body}; overflow-x: hidden; }
  * { box-sizing: border-box; }

  @keyframes ticker {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(0.8); opacity: 0.5; }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .fade-in { opacity: 0; transform: translateY(24px); transition: all 0.6s ease-out; }
  .fade-in.visible { opacity: 1; transform: translateY(0); }
  
  .ticker-track { animation: ticker 25s linear infinite; }
  .orb-1 { animation: float 8s ease-in-out infinite; }
  .orb-2 { animation: float 10s ease-in-out infinite reverse; }
  .pulse-dot { animation: pulse 2s infinite; }
  
  .nav-link:hover { color: #fff !important; }
  .btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
  .card:hover { transform: translateY(-4px); }
`;

// ─── COMPONENTS ─────────────────────────────────────────────

function FadeIn({ children, delay = 0 }) {
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { e.target.classList.add("visible"); obs.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className="fade-in" style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

function Logo() {
  const { colors, fonts } = useTheme();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <svg width="32" height="32" viewBox="0 0 64 64">
        <path d="M32 52C26 40 16 24 8 8" stroke={colors.green} strokeWidth="4" fill="none" />
        <path d="M32 52C38 40 48 24 56 8" stroke={colors.amber} strokeWidth="4" fill="none" />
        <circle cx="32" cy="52" r="4" fill="white" />
      </svg>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontFamily: fonts.display, fontSize: 20, lineHeight: 1, letterSpacing: 1 }}>SWIFT</span>
        <span style={{ color: colors.amber, fontSize: 8, letterSpacing: 4, fontWeight: 600 }}>TRADE</span>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────

export default function LandingPage() {
  const theme = useTheme();
  const { colors, fonts, radius, shadows } = theme;
  const [scrolled, setScrolled] = useState(false);
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const isMobile = width < 768;
  const isTablet = width < 1024;

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleResize = () => setWidth(window.innerWidth);
    
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    
    return () => {
      document.head.removeChild(style);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div style={{ background: colors.bg }}>
      {/* 1. Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        height: isMobile ? 64 : 72, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isMobile ? "0 20px" : "0 64px", transition: "all 0.3s",
        background: scrolled || menuOpen ? "rgba(8, 8, 8, 0.95)" : "transparent",
        backdropFilter: scrolled || menuOpen ? "blur(12px)" : "none",
        borderBottom: (scrolled || menuOpen) ? `1px solid ${colors.border}` : "none"
      }}>
        <Logo />
        
        {isMobile ? (
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ 
            background: "none", border: "none", color: "#fff", fontSize: 24, cursor: "pointer" 
          }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        ) : (
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {["Exchange", "Gift Cards", "Rates", "About"].map(item => (
              <a key={item} href="#" className="nav-link" style={{ 
                color: colors.muted, textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "0.2s" 
              }}>{item}</a>
            ))}
            <button className="btn" style={{
              background: colors.green, color: "#000", border: "none", padding: "10px 24px",
              borderRadius: radius.md, fontWeight: 600, cursor: "pointer", transition: "0.2s"
            }}>Get Started</button>
          </div>
        )}

        {/* Mobile Menu Overlay */}
        {isMobile && menuOpen && (
          <div style={{
            position: "absolute", top: 64, left: 0, right: 0, height: "100vh",
            background: colors.bg, display: "flex", flexDirection: "column", padding: 40, gap: 24
          }}>
            {["Exchange", "Gift Cards", "Rates", "About"].map(item => (
              <a key={item} href="#" onClick={() => setMenuOpen(false)} style={{ 
                color: colors.text, textDecoration: "none", fontSize: 24, fontWeight: 600, fontFamily: fonts.display 
              }}>{item.toUpperCase()}</a>
            ))}
            <button className="btn" style={{
              background: colors.green, color: "#000", border: "none", padding: "16px",
              borderRadius: radius.md, fontWeight: 600, fontSize: 18, marginTop: 20
            }}>Get Started</button>
          </div>
        )}
      </nav>

      {/* 2. Hero */}
      <section style={{ 
        minHeight: "100vh", position: "relative", display: "flex", flexDirection: "column", 
        justifyContent: "center", alignItems: "center", padding: isMobile ? "100px 20px 40px" : "120px 24px 0", 
        textAlign: "center", overflow: "hidden" 
      }}>
        <div style={{ 
          position: "absolute", inset: 0, opacity: 0.15, pointerEvents: "none",
          backgroundImage: "radial-gradient(#222 1px, transparent 1px)", backgroundSize: isMobile ? "20px 20px" : "40px 40px" 
        }} />
        
        <div className="orb-1" style={{ 
          position: "absolute", top: "10%", left: isMobile ? "-20%" : "10%", width: isMobile ? 300 : 400, height: isMobile ? 300 : 400, 
          background: `radial-gradient(circle, ${colors.green}15, transparent 70%)`, filter: "blur(60px)" 
        }} />
        <div className="orb-2" style={{ 
          position: "absolute", top: "5%", right: isMobile ? "-20%" : "10%", width: isMobile ? 250 : 350, height: isMobile ? 250 : 350, 
          background: `radial-gradient(circle, ${colors.amber}10, transparent 70%)`, filter: "blur(60px)" 
        }} />

        <FadeIn>
          <div style={{ 
            background: "rgba(14, 203, 129, 0.1)", border: `1px solid ${colors.green}30`, 
            padding: "6px 16px", borderRadius: radius.full, display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24 
          }}>
            <div className="pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: colors.green }} />
            <span style={{ color: colors.green, fontSize: isMobile ? 10 : 12, fontWeight: 600, letterSpacing: 0.5 }}>Trusted by 50,000+ Nigerians</span>
          </div>

          <h1 style={{ 
            fontFamily: fonts.display, fontSize: isMobile ? "44px" : "clamp(48px, 8vw, 96px)", lineHeight: isMobile ? 1.1 : 0.95, 
            letterSpacing: 1, maxWidth: 900, marginBottom: 24 
          }}>
            TRADE CRYPTO <span style={{ color: colors.green }}>FAST.</span><br />
            GET <span style={{ color: colors.amber }}>NAIRA.</span> INSTANTLY.
          </h1>
          
          <p style={{ color: colors.muted, fontSize: isMobile ? 15 : 18, maxWidth: 540, lineHeight: 1.6, marginBottom: 40, margin: "0 auto 40px" }}>
            Buy, sell and convert digital assets directly to your bank account at the best market rates.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: isMobile ? 60 : 80 }}>
            <button className="btn" style={{ 
              background: colors.green, color: "#000", border: "none", padding: isMobile ? "14px 24px" : "16px 32px", 
              borderRadius: radius.lg, fontWeight: 600, fontSize: isMobile ? 14 : 16, width: isMobile ? "100%" : "auto"
            }}>Start Trading →</button>
            <button className="btn" style={{ 
              background: "transparent", color: "#fff", border: `1px solid ${colors.border2}`, padding: isMobile ? "14px 24px" : "16px 32px", 
              borderRadius: radius.lg, fontWeight: 600, fontSize: isMobile ? 14 : 16, width: isMobile ? "100%" : "auto"
            }}>View Live Rates</button>
          </div>
        </FadeIn>

        {/* Ticker */}
        <div style={{ width: "100%", overflow: "hidden", borderTop: `1px solid ${colors.border}`, padding: "16px 0" }}>
          <div className="ticker-track" style={{ display: "flex", width: "max-content" }}>
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: isMobile ? "0 24px" : "0 40px", borderRight: `1px solid ${colors.border}` }}>
                <span style={{ fontFamily: fonts.mono, fontSize: isMobile ? 12 : 14 }}>{item.sym}</span>
                <span style={{ color: colors.muted, fontSize: isMobile ? 12 : 14 }}>{item.price}</span>
                <span style={{ color: item.up ? colors.green : colors.red, fontSize: isMobile ? 12 : 14, fontWeight: 600 }}>{item.change}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Stats */}
      <section style={{ 
        display: "grid", 
        gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", 
        background: colors.border, gap: 1 
      }}>
        {STATS.map((stat, i) => (
          <FadeIn key={i} delay={i * 100}>
            <div style={{ background: colors.bg, padding: isMobile ? "40px 20px" : "64px 24px", textAlign: "center" }}>
              <div style={{ fontFamily: fonts.display, fontSize: isMobile ? 32 : 48, color: colors.green, marginBottom: 8 }}>{stat.num}</div>
              <div style={{ color: colors.muted, fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>{stat.label}</div>
            </div>
          </FadeIn>
        ))}
      </section>

      {/* 4. Services */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 64px" }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? 40 : 64 }}>
          <div style={{ color: colors.green, letterSpacing: 4, fontSize: 12, fontWeight: 600, textTransform: "uppercase", marginBottom: 16 }}>Services</div>
          <h2 style={{ fontFamily: fonts.display, fontSize: isMobile ? 36 : 56, lineHeight: 1.1 }}>Everything you need to trade</h2>
        </div>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: (isMobile || isTablet) ? "1fr" : "repeat(3, 1fr)", 
          gap: 24 
        }}>
          {SERVICES.map((svc, i) => (
            <FadeIn key={i} delay={i * 150}>
              <div className="card" style={{ 
                background: colors.card, padding: isMobile ? 32 : 48, borderRadius: radius.xl, border: `1px solid ${colors.border}`,
                position: "relative", transition: "0.3s"
              }}>
                <div style={{ 
                  width: 56, height: 56, borderRadius: radius.lg, background: `${colors.green}15`, 
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 32,
                  border: `1px solid ${colors.green}20`
                }}>{svc.icon}</div>
                <h3 style={{ fontSize: 20, marginBottom: 16 }}>{svc.title}</h3>
                <p style={{ color: colors.muted, lineHeight: 1.6, marginBottom: 32, fontSize: 14 }}>{svc.desc}</p>
                <a href="#" style={{ color: colors.green, textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                  {svc.link} <span>→</span>
                </a>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 5. How It Works */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 64px", background: colors.surface }}>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: (isMobile || isTablet) ? "1fr" : "1.2fr 0.8fr", 
          gap: isMobile ? 60 : 80, alignItems: "center" 
        }}>
          <div>
            <div style={{ color: colors.green, letterSpacing: 4, fontSize: 12, fontWeight: 600, textTransform: "uppercase", marginBottom: 16 }}>How It Works</div>
            <h2 style={{ fontFamily: fonts.display, fontSize: isMobile ? 36 : 56, marginBottom: isMobile ? 32 : 48, lineHeight: 1.1 }}>From Crypto to Cash<br />in 4 simple steps</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {STEPS.map((step, i) => (
                <FadeIn key={i} delay={i * 100}>
                  <div style={{ display: "flex", gap: isMobile ? 16 : 24 }}>
                    <div style={{ 
                      width: 40, height: 40, borderRadius: radius.md, border: `1px solid ${colors.border2}`,
                      display: "flex", alignItems: "center", justifyContent: "center", 
                      fontFamily: fonts.mono, color: colors.muted, flexShrink: 0, fontSize: 13
                    }}>{step.n}</div>
                    <div>
                      <h4 style={{ fontSize: 17, marginBottom: 8 }}>{step.title}</h4>
                      <p style={{ color: colors.muted, lineHeight: 1.5, fontSize: 13 }}>{step.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
          
          {/* Phone Mockup */}
          <FadeIn>
            <div style={{ 
              background: colors.card, border: `1px solid ${colors.border2}`, borderRadius: 40, 
              padding: isMobile ? 16 : 24, maxWidth: 320, margin: "0 auto",
              boxShadow: "0 40px 80px rgba(0,0,0,0.5)" 
            }}>
              <div style={{ width: 80, height: 20, background: colors.bg, borderRadius: 10, margin: "0 auto 24px" }} />
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ fontSize: 9, color: colors.muted, letterSpacing: 1, marginBottom: 6 }}>TOTAL BALANCE</div>
                <div style={{ fontFamily: fonts.display, fontSize: 32 }}>₦482,900.00</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {RATES.slice(0, 3).map(asset => (
                  <div key={asset.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: colors.bg, borderRadius: radius.lg }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: asset.bg, color: asset.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>{asset.icon}</div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 500 }}>{asset.name}</div>
                        <div style={{ fontSize: 9, color: colors.muted }}>{asset.ticker}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 12 }}>0.0042 BTC</div>
                      <div style={{ fontSize: 9, color: colors.muted }}>₦280,440</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 24 }}>
                {["Deposit", "Convert", "Withdraw"].map(action => (
                  <div key={action} style={{ 
                    padding: "10px 2px", background: colors.border, borderRadius: radius.md, 
                    textAlign: "center", fontSize: 9, color: action === "Convert" ? colors.green : colors.muted 
                  }}>
                    <div style={{ fontSize: 14, marginBottom: 2 }}>{action === "Deposit" ? "↓" : action === "Convert" ? "⇄" : "↑"}</div>
                    {action}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 6. Live Rates */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 64px" }}>
        <div style={{ 
          display: "flex", flexDirection: isMobile ? "column" : "row", 
          justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "flex-end", 
          marginBottom: isMobile ? 40 : 64, gap: 20 
        }}>
          <div>
            <div style={{ color: colors.green, letterSpacing: 4, fontSize: 12, fontWeight: 600, textTransform: "uppercase", marginBottom: 16 }}>Live Market</div>
            <h2 style={{ fontFamily: fonts.display, fontSize: isMobile ? 36 : 56, lineHeight: 1.1 }}>Today's exchange rates</h2>
          </div>
          <p style={{ color: colors.muted, maxWidth: isMobile ? "100%" : 300, textAlign: isMobile ? "left" : "right", fontSize: 14 }}>
            Rates update every 60 seconds to ensure you get the most accurate price.
          </p>
        </div>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(4, 1fr)", 
          gap: 1, background: colors.border, borderRadius: radius.xl, overflow: "hidden", border: `1px solid ${colors.border}` 
        }}>
          {RATES.map((rate, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className="card" style={{ background: colors.bg, padding: isMobile ? 24 : 32, transition: "0.3s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: rate.bg, color: rate.color, display: "flex", alignItems: "center", justifyContent: "center" }}>{rate.icon}</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>{rate.name}</div>
                      <div style={{ fontSize: 11, color: colors.muted }}>{rate.ticker}</div>
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: 9, padding: "4px 8px", borderRadius: radius.full, 
                    background: rate.up ? `${colors.green}15` : `${colors.red}15`, 
                    color: rate.up ? colors.green : colors.red, fontWeight: 600 
                  }}>{rate.change}</div>
                </div>
                <div style={{ fontFamily: fonts.mono, fontSize: 18 }}>{rate.price}</div>
                <div style={{ fontSize: 11, color: colors.muted, marginTop: 6 }}>Per 1 unit</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 7. Gift Cards */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 64px", background: colors.surface }}>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: (isMobile || isTablet) ? "1fr" : "1fr 1fr", 
          gap: isMobile ? 60 : 80, alignItems: "center" 
        }}>
          <div>
            <div style={{ color: colors.green, letterSpacing: 4, fontSize: 12, fontWeight: 600, textTransform: "uppercase", marginBottom: 16 }}>Gift Cards</div>
            <h2 style={{ fontFamily: fonts.display, fontSize: isMobile ? 36 : 56, marginBottom: 24, lineHeight: 1.1 }}>Sell your gift cards<br /><span style={{ color: colors.amber }}>for instant Naira</span></h2>
            <p style={{ color: colors.muted, fontSize: isMobile ? 15 : 18, lineHeight: 1.6, marginBottom: 40, maxWidth: 460 }}>
              Got unused cards from Amazon, Steam, or iTunes? Convert them to cash instantly at the highest rates in Nigeria.
            </p>
            <button className="btn" style={{ 
              background: colors.green, color: "#000", border: "none", padding: "16px 32px", 
              borderRadius: radius.lg, fontWeight: 600, width: isMobile ? "100%" : "auto"
            }}>Check Gift Card Rates →</button>
          </div>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", 
            gap: 16 
          }}>
            {GC_CARDS.map((card, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="card" style={{ 
                  background: card.bg, padding: 24, borderRadius: radius.xl, 
                  border: `1px solid ${colors.border2}`, transition: "0.3s" 
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: card.color, letterSpacing: 1.5, marginBottom: 20 }}>{card.label.toUpperCase()}</div>
                  <div style={{ fontFamily: fonts.display, fontSize: 28 }}>{card.amount}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>≈ {card.rate}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Testimonials */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 64px" }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? 40 : 64 }}>
          <div style={{ color: colors.green, letterSpacing: 4, fontSize: 12, fontWeight: 600, textTransform: "uppercase", marginBottom: 16 }}>Testimonials</div>
          <h2 style={{ fontFamily: fonts.display, fontSize: isMobile ? 36 : 56, lineHeight: 1.1 }}>Loved by Nigerians</h2>
        </div>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: (isMobile || isTablet) ? "1fr" : "repeat(3, 1fr)", 
          gap: 24 
        }}>
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div style={{ background: colors.card, padding: 28, borderRadius: radius.xl, border: `1px solid ${colors.border}` }}>
                <div style={{ color: colors.amber, marginBottom: 16, fontSize: 12 }}>{"★".repeat(t.stars)}</div>
                <p style={{ color: colors.text, lineHeight: 1.6, marginBottom: 28, fontSize: 14 }}>{t.text}</p>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: colors.border2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: colors.muted }}>{t.initials}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: colors.muted }}>{t.loc}</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 9. CTA Banner */}
      <section style={{ padding: isMobile ? "80px 20px" : "120px 24px", position: "relative", textAlign: "center", overflow: "hidden" }}>
        <div style={{ 
          position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", 
          width: isMobile ? "100%" : "60%", height: "80%", background: `radial-gradient(circle, ${colors.green}10, transparent 70%)`, filter: "blur(60px)" 
        }} />
        <FadeIn>
          <h2 style={{ fontFamily: fonts.display, fontSize: isMobile ? 36 : "clamp(48px, 6vw, 80px)", lineHeight: 1.1, marginBottom: 24 }}>READY TO TRADE FASTER?</h2>
          <p style={{ color: colors.muted, fontSize: isMobile ? 15 : 18, maxWidth: 500, margin: "0 auto 40px", lineHeight: 1.6 }}>
            Join 50,000+ Nigerians already using Swift Trade for crypto exchange and gift cards.
          </p>
          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 16, justifyContent: "center" }}>
            <button className="btn" style={{ 
              background: colors.green, color: "#000", border: "none", padding: "16px 32px", 
              borderRadius: radius.lg, fontWeight: 600 
            }}>Create Free Account</button>
            <button className="btn" style={{ 
              background: "transparent", color: "#fff", border: `1px solid ${colors.border2}`, padding: "16px 32px", 
              borderRadius: radius.lg, fontWeight: 600 
            }}>Download App</button>
          </div>
        </FadeIn>
      </section>

      {/* 10. Footer */}
      <footer style={{ padding: isMobile ? "60px 20px 40px" : "80px 64px 40px", background: colors.surface, borderTop: `1px solid ${colors.border}` }}>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "2fr 1fr 1fr 1fr", 
          gap: 48, marginBottom: isMobile ? 48 : 80 
        }}>
          <div>
            <Logo />
            <p style={{ color: colors.muted, marginTop: 20, maxWidth: 280, fontSize: 13, lineHeight: 1.6 }}>
              Nigeria's fastest crypto exchange and gift card platform. Convert digital assets to naira instantly.
            </p>
          </div>
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h5 style={{ color: colors.text, fontSize: 14, fontWeight: 600, marginBottom: 20 }}>{title}</h5>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {links.map(link => (
                  <a key={link} href="#" style={{ color: colors.muted, fontSize: 13, textDecoration: "none" }}>{link}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ 
          paddingTop: 32, borderTop: `1px solid ${colors.border}`, display: "flex", 
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center",
          gap: 20
        }}>
          <div style={{ color: colors.muted2, fontSize: 11 }}>© 2025 Swift Trade. All rights reserved.</div>
          <div style={{ display: "flex", gap: 24 }}>
            {["Twitter", "Instagram", "WhatsApp"].map(social => (
              <a key={social} href="#" style={{ color: colors.muted2, fontSize: 11, textDecoration: "none" }}>{social}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
