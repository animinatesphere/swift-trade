import { useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ceoPhoto from "../assets/Gemini_Generated_Image_76mm6576mm6576mm.png";

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

  @keyframes float {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes pulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:0.4; transform:scale(0.8); }
  }

  .fade-in       { opacity:0; transform:translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .fade-in-left  { opacity:0; transform:translateX(-24px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .fade-in-right { opacity:0; transform:translateX(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .fade-in.visible, .fade-in-left.visible, .fade-in-right.visible { opacity:1; transform:translate(0); }

  .nav-link-item:hover { color: #fff !important; }
  .nav-cta:hover { background: #0fdf8e !important; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(14,203,129,0.3); }

  .value-card:hover { border-color: rgba(14,203,129,0.25) !important; background: #141414 !important; transform: translateY(-4px); }
  .team-card:hover { border-color: rgba(14,203,129,0.2) !important; }
  .marquee-track { animation: marquee 28s linear infinite; }
  .marquee-track:hover { animation-play-state: paused; }

  @media (max-width: 1024px) {
    .hero-container { flex-direction: column !important; padding: clamp(80px, 10vw, 120px) clamp(16px, 2vw, 20px) clamp(40px, 6vw, 60px) !important; text-align: center !important; }
    .hero-content { align-items: center !important; max-width: 100% !important; }
    .hero-stats { justify-content: center !important; }
    .hero-editorial { display: none !important; }
    
    .grid-2 { grid-template-columns: 1fr !important; gap: clamp(30px, 4vw, 40px) !important; }
    .grid-3 { grid-template-columns: 1fr !important; gap: clamp(12px, 2vw, 20px) !important; }
    .grid-stats { grid-template-columns: 1fr 1fr !important; gap: clamp(16px, 3vw, 24px) !important; }
    
    .section-padding { padding: clamp(60px, 8vw, 80px) clamp(16px, 2vw, 20px) !important; }
    
    .timeline-spine { left: clamp(16px, 3vw, 20px) !important; }
    .timeline-item { grid-template-columns: 40px 1fr !important; gap: clamp(12px, 2vw, 20px) !important; }
    .timeline-year { text-align: left !important; padding-right: 0 !important; font-size: clamp(8px, 1.5vw, 10px) !important; }
    .tl-dot { left: -7px !important; right: auto !important; }
  }

  @media (max-width: 768px) {
    .hero-container { padding: clamp(60px, 8vw, 100px) clamp(12px, 2vw, 16px) clamp(30px, 4vw, 50px) !important; }
    .section-padding { padding: clamp(40px, 6vw, 60px) clamp(12px, 2vw, 16px) !important; }
    .grid-2 { gap: clamp(20px, 3vw, 30px) !important; }
  }

  @media (max-width: 640px) {
    .hero-container h1 { font-size: clamp(32px, 6vw, 48px) !important; }
    .hero-stats { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: clamp(12px, 2vw, 20px) !important; width: 100% !important; }
    .grid-stats { grid-template-columns: 1fr !important; }
    .footer-grid { grid-template-columns: 1fr !important; gap: clamp(30px, 4vw, 40px) !important; }
  }

  @media (max-width: 480px) {
    .hero-container { padding: clamp(40px, 5vw, 60px) clamp(12px, 2vw, 14px) !important; }
    .hero-stats { grid-template-columns: 1fr !important; }
    .section-padding { padding: clamp(30px, 4vw, 40px) clamp(12px, 2vw, 14px) !important; }
  }
`;

// ─── HELPERS ──────────────────────────────────────────────
function useFadeIn(direction = "up") {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cls =
      direction === "left"
        ? "fade-in-left"
        : direction === "right"
          ? "fade-in-right"
          : "fade-in";
    el.classList.add(cls);
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("visible");
          obs.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [direction]);
  return ref;
}

function FadeIn({ children, direction = "up", delay = 0, style = {} }) {
  const ref = useFadeIn(direction);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}s`, ...style }}>
      {children}
    </div>
  );
}

function Eyebrow({ children, color = C.green }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        color,
        fontSize: 11,
        letterSpacing: 4,
        textTransform: "uppercase",
        fontWeight: 500,
        marginBottom: 16,
      }}
    >
      <span
        style={{ display: "block", width: 24, height: 1, background: color }}
      />
      {children}
    </div>
  );
}

// ─── SECTIONS ─────────────────────────────────────────────

function Hero() {
  return (
    <section
      className="hero-container"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "140px 64px 100px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`,
          backgroundSize: "60px 60px",
          opacity: 0.25,
          WebkitMaskImage:
            "radial-gradient(ellipse 100% 100% at 20% 50%,black 20%,transparent 80%)",
        }}
      />
      <div
        className="hero-content"
        style={{ flex: 1, position: "relative", maxWidth: 620 }}
      >
        <FadeIn>
          <Eyebrow>OUR STORY</Eyebrow>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: "clamp(60px,7vw,108px)",
              lineHeight: 0.88,
              letterSpacing: 2,
              marginBottom: 28,
            }}
          >
            BUILT FOR <span style={{ color: C.green }}>NIGERIANS,</span> BY
            NIGERIANS.
          </h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p
            style={{
              color: C.muted,
              fontSize: 18,
              lineHeight: 1.8,
              fontWeight: 300,
              marginBottom: 40,
            }}
          >
            Swift Trade started with one simple question: why does converting
            crypto to naira have to be so slow, opaque, and painful? We built
            the answer.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div className="hero-stats" style={{ display: "flex", gap: 32 }}>
            {[
              { val: "2023", label: "Founded" },
              { val: "5K+", label: "Users" },
              { val: "Lagos", label: "HQ" },
            ].map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontFamily: "'Bebas Neue',sans-serif",
                    fontSize: 36,
                    color: C.green,
                    letterSpacing: 1,
                  }}
                >
                  {s.val}
                </div>
                <div style={{ fontSize: 12, color: C.muted, letterSpacing: 2 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
      <div
        className="hero-editorial"
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: "clamp(100px,14vw,200px)",
            lineHeight: 0.85,
            letterSpacing: 4,
            color: "transparent",
            WebkitTextStroke: `1px ${C.border2}`,
            textAlign: "right",
            animation: "float 10s ease-in-out infinite",
          }}
        >
          SWIFT
          <br />
          TRADE
        </div>
      </div>
    </section>
  );
}

const MARQUEE_ITEMS = [
  "Crypto Exchange",
  "Gift Cards",
  "Fast Payouts",
  "Zero Hidden Fees",
  "NGN Wallet",
  "24/7 Trading",
  "BTC · ETH · USDT",
  "Made in Nigeria",
];
function MarqueeBand() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div
      style={{
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        padding: "18px 0",
        overflow: "hidden",
        background: C.surface,
      }}
    >
      <div
        className="marquee-track"
        style={{ display: "flex", gap: 0, width: "max-content" }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "0 32px",
              borderRight: `1px solid ${C.border}`,
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background:
                  i % 3 === 0 ? C.green : i % 3 === 1 ? C.amber : C.muted2,
              }}
            />
            <span
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 15,
                letterSpacing: 3,
                color: i % 4 === 0 ? C.green : "#aaa",
              }}
            >
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Mission() {
  return (
    <section
      className="section-padding"
      style={{ padding: "120px 64px", background: C.bg }}
    >
      <div
        className="grid-2"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 100,
          alignItems: "center",
        }}
      >
        <FadeIn direction="left">
          <div>
            <Eyebrow>Our Mission</Eyebrow>
            <h2
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(40px,5vw,72px)",
                lineHeight: 0.9,
                marginBottom: 28,
              }}
            >
              MAKING DIGITAL FINANCE{" "}
              <span style={{ color: C.green }}>ACCESSIBLE</span> FOR EVERYONE
            </h2>
            <p
              style={{
                color: C.muted,
                fontSize: 16,
                lineHeight: 1.8,
                fontWeight: 300,
                marginBottom: 24,
              }}
            >
              Millions of Nigerians hold crypto assets but struggle to convert
              them to spendable naira. The process is slow, rates are hidden,
              and trust is low.
            </p>
            <p
              style={{
                color: C.muted,
                fontSize: 16,
                lineHeight: 1.8,
                fontWeight: 300,
              }}
            >
              Swift Trade exists to fix that. We provide a transparent, fast,
              and reliable bridge between the crypto economy and everyday
              Nigerian life.
            </p>
          </div>
        </FadeIn>
        <FadeIn direction="right" delay={0.1}>
          <blockquote
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderLeft: `3px solid ${C.green}`,
              borderRadius: 16,
              padding: 40,
            }}
          >
            <p
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(28px,3vw,40px)",
                lineHeight: 1.15,
                color: "#fff",
                marginBottom: 28,
              }}
            >
              "Fast money shouldn't be complicated money."
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg,${C.green},${C.amber})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  color: "#000",
                }}
              >
                OF
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  Olalekan Samuel Famakinwa
                </div>
                <div style={{ fontSize: 12, color: C.muted }}>
                  CEO & Founder
                </div>
              </div>
            </div>
          </blockquote>
        </FadeIn>
      </div>
    </section>
  );
}

function CEOFounder() {
  return (
    <section
      className="section-padding"
      style={{ padding: "0 64px 120px", background: C.bg }}
    >
      <FadeIn>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Eyebrow>Leadership</Eyebrow>
          </div>
          <h2
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: "clamp(36px,5vw,60px)",
              lineHeight: 1,
            }}
          >
            OUR CEO <span style={{ color: C.green }}>&</span> FOUNDER
          </h2>
        </div>
      </FadeIn>
      <FadeIn delay={0.1}>
        <div style={{ maxWidth: 420, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              width: 200,
              height: 200,
              borderRadius: "50%",
              overflow: "hidden",
              margin: "0 auto 28px",
              border: `2px solid ${C.green}`,
              boxShadow: "0 0 50px rgba(14,203,129,0.15)",
            }}
          >
            <img
              src={ceoPhoto}
              alt="Olalekan Samuel Famakinwa, CEO & Founder of Swift Trade"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
          <p
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: "clamp(22px,3vw,28px)",
              lineHeight: 1.2,
              color: "#fff",
              marginBottom: 16,
            }}
          >
            "We built Swift Trade so every Nigerian can move between crypto
            and naira without friction."
          </p>
          <div style={{ fontSize: 15, fontWeight: 600 }}>
            Olalekan Samuel Famakinwa
          </div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>
            CEO & Founder, Swift Trade
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

function Stats() {
  const stats = [
    { val: "5K+", label: "Active users", sub: "And growing daily" },
    { val: "99.9%", label: "Platform uptime", sub: "Since launch" },
    { val: "< 5min", label: "Avg. payout time", sub: "For NGN withdrawals" },
    { val: "20+", label: "Supported assets", sub: "Crypto & gift cards" },
    { val: "0", label: "Hidden fees", sub: "No surprises" },
  ];
  return (
    <section
      className="section-padding"
      style={{ padding: "100px 64px", background: C.surface }}
    >
      <FadeIn>
        <Eyebrow>By The Numbers</Eyebrow>
        <h2
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: "clamp(40px,5vw,64px)",
            lineHeight: 1,
            marginBottom: 64,
          }}
        >
          SWIFT TRADE IN NUMBERS
        </h2>
      </FadeIn>
      <div
        className="grid-stats"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 1,
          background: C.border,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        {stats.map((s, i) => (
          <FadeIn key={s.label} delay={i * 0.08}>
            <div
              style={{
                background: C.card,
                padding: "48px 40px",
                transition: "0.3s",
                height: "100%",
              }}
            >
              <div
                style={{
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: 52,
                  color: C.green,
                  lineHeight: 1,
                  marginBottom: 10,
                }}
              >
                {s.val}
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 13, color: C.muted, fontWeight: 300 }}>
                {s.sub}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function Timeline() {
  const timeline = [
    {
      year: "2022",
      title: "The Idea",
      desc: "Built for Nigerians who needed a faster way to trade crypto.",
    },
    {
      year: "2023",
      title: "Launch",
      desc: "Started with USDT-to-NGN conversion and grew rapidly.",
    },
    {
      year: "2024",
      title: "Platform Upgrade",
      desc: "Rebuilt with automated NGN payouts and mobile app.",
    },
    {
      year: "2026",
      title: "Scale",
      desc: "Growing steadily and reinvesting in reliability and support.",
    },
  ];
  return (
    <section
      className="section-padding"
      style={{ padding: "120px 64px", background: C.bg }}
    >
      <FadeIn>
        <Eyebrow>Our History</Eyebrow>
        <h2
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: "clamp(40px,5vw,64px)",
            lineHeight: 1,
            marginBottom: 80,
          }}
        >
          HOW WE GOT HERE
        </h2>
      </FadeIn>
      <div style={{ position: "relative" }}>
        <div
          className="timeline-spine"
          style={{
            position: "absolute",
            left: 159,
            top: 0,
            bottom: 0,
            width: 1,
            background: C.border,
          }}
        />
        {timeline.map((t, i) => (
          <FadeIn key={t.year} delay={i * 0.08}>
            <div
              className="timeline-item"
              style={{
                display: "grid",
                gridTemplateColumns: "160px 1fr",
                gap: 48,
                paddingBottom: 48,
              }}
            >
              <div
                className="timeline-year"
                style={{
                  textAlign: "right",
                  paddingRight: 32,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Mono',monospace",
                    fontSize: 12,
                    color: C.muted,
                  }}
                >
                  {t.year}
                </div>
                <div
                  className="tl-dot"
                  style={{
                    position: "absolute",
                    right: -8,
                    top: 6,
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: C.border2,
                  }}
                />
              </div>
              <div
                style={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 14,
                  padding: "28px 32px",
                  borderLeft: `3px solid ${C.green}`,
                }}
              >
                <h4
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    marginBottom: 10,
                    color: C.green,
                  }}
                >
                  {t.title}
                </h4>
                <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7 }}>
                  {t.desc}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function Values() {
  const values = [
    {
      icon: "⚡",
      title: "Speed First",
      desc: "Every decision is made to make things faster for our users.",
    },
    {
      icon: "🔍",
      title: "Transparency",
      desc: "No hidden fees. What you see is what you get.",
    },
    {
      icon: "🔒",
      title: "Security",
      desc: "Your funds are protected by industry-standard encryption.",
    },
    {
      icon: "🇳🇬",
      title: "Nigeria-First",
      desc: "Designed specifically for how Nigerians move money.",
    },
    {
      icon: "📞",
      title: "Real Support",
      desc: "Talk to a human, not a bot, based in Lagos.",
    },
    {
      icon: "🌱",
      title: "Built to Last",
      desc: "Building the financial infrastructure Nigeria deserves.",
    },
  ];
  return (
    <section
      className="section-padding"
      style={{ padding: "120px 64px", background: C.surface }}
    >
      <FadeIn>
        <Eyebrow>Values</Eyebrow>
        <h2
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: "clamp(40px,5vw,64px)",
            lineHeight: 1,
            marginBottom: 64,
          }}
        >
          WHAT WE BELIEVE
        </h2>
      </FadeIn>
      <div
        className="grid-3"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 16,
        }}
      >
        {values.map((v, i) => (
          <FadeIn key={v.title} delay={i * 0.08}>
            <div
              className="value-card"
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                padding: 32,
                height: "100%",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: C.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 24,
                  fontSize: 20,
                }}
              >
                {v.icon}
              </div>
              <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
                {v.title}
              </h4>
              <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7 }}>
                {v.desc}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

export default function AboutPage() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={{ background: C.bg, color: C.text }}>
      <Navbar />
      <Hero />
      <MarqueeBand />
      <Mission />
      <CEOFounder />
      <Stats />
      <Timeline />
      <Values />
      <Footer />
    </div>
  );
}
