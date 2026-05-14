import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

// ─── TOKENS ───────────────────────────────────────────────
const C = {
  green: "#0ECB81", amber: "#F5A623", red: "#F6465D",
  bg: "#080808", surface: "#0f0f0f", card: "#111111",
  border: "#1a1a1a", border2: "#222222",
  text: "#ffffff", muted: "#555555", muted2: "#333333",
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html { scroll-behavior:smooth; }
  body { background:#080808; color:#fff; font-family:'Outfit',sans-serif; overflow-x:hidden; }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:#080808; }
  ::-webkit-scrollbar-thumb { background:#222; border-radius:4px; }
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus {
    -webkit-box-shadow:0 0 0 1000px #111 inset !important;
    -webkit-text-fill-color:#fff !important;
    caret-color:#fff;
  }

  @keyframes fadeUp    { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes slideLeft { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:translateX(0)} }
  @keyframes pulse     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }
  @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
  @keyframes ticker    { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes shake     { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
  @keyframes popIn     { 0%{transform:scale(0.6);opacity:0} 70%{transform:scale(1.12)} 100%{transform:scale(1);opacity:1} }
  @keyframes checkPop  { 0%{transform:scale(0);opacity:0} 70%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }
  @keyframes successBounce { 0%{transform:scale(0.5);opacity:0} 60%{transform:scale(1.1)} 80%{transform:scale(0.95)} 100%{transform:scale(1);opacity:1} }
  @keyframes checkDraw { from{stroke-dashoffset:60} to{stroke-dashoffset:0} }
  @keyframes glowPulse { 0%,100%{box-shadow:0 0 20px rgba(14,203,129,0.2)} 50%{box-shadow:0 0 40px rgba(14,203,129,0.5)} }
  @keyframes slideUp   { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ripple    { 0%{transform:scale(0.8);opacity:0.8} 100%{transform:scale(2.4);opacity:0} }
  @keyframes codeFloat { 0%{transform:translateY(0) scale(1);opacity:1} 100%{transform:translateY(-60px) scale(0.8);opacity:0} }

  .ticker-track  { animation:ticker 28s linear infinite; }
  .auth-form     { animation:slideLeft 0.4s ease; }

  .input-field         { transition:border-color 0.2s, box-shadow 0.2s; }
  .input-field:focus   { border-color:rgba(14,203,129,0.5) !important; box-shadow:0 0 0 3px rgba(14,203,129,0.08) !important; outline:none; }
  .input-field.error   { border-color:rgba(246,70,93,0.5) !important; box-shadow:0 0 0 3px rgba(246,70,93,0.06) !important; }
  .input-field.success { border-color:rgba(14,203,129,0.4) !important; }

  .submit-btn:hover:not(:disabled) { background:#0fdf8e !important; transform:translateY(-2px); box-shadow:0 12px 32px rgba(14,203,129,0.35) !important; }
  .submit-btn:disabled              { opacity:0.45 !important; cursor:not-allowed !important; }
  .submit-btn                       { transition:all 0.2s; }

  .otp-box { transition: border-color 0.2s, background 0.2s, box-shadow 0.2s, transform 0.15s; }
  .otp-box:focus { border-color: rgba(14,203,129,0.7) !important; box-shadow: 0 0 0 3px rgba(14,203,129,0.12), 0 0 20px rgba(14,203,129,0.1) !important; outline: none; transform: scale(1.04); }
  .otp-box.filled { border-color: rgba(14,203,129,0.45) !important; background: rgba(14,203,129,0.06) !important; animation: popIn 0.2s ease; }
  .otp-box.error { border-color: rgba(246,70,93,0.6) !important; background: rgba(246,70,93,0.06) !important; box-shadow: 0 0 0 3px rgba(246,70,93,0.1) !important; }

  .eye-btn:hover       { color:#fff !important; }
  .toggle-link:hover   { color:#0ECB81 !important; }
  .checkbox-box:hover  { border-color:rgba(14,203,129,0.4) !important; }
  .shake               { animation:shake 0.4s ease; }
  .resend-btn:not(:disabled):hover { color:#0ECB81 !important; }
  .rate-pill:hover     { transform:translateY(-2px); }

  @media (max-width: 1024px) {
    .auth-left-panel { display: none !important; }
  }
`;

const TICKERS = [
  { sym:"BTC/NGN",  price:"₦98,240,000", change:"+2.4%", up:true  },
  { sym:"ETH/NGN",  price:"₦3,420,000",  change:"+1.8%", up:true  },
  { sym:"USDT/NGN", price:"₦1,592",      change:"-0.3%", up:false },
  { sym:"BNB/NGN",  price:"₦920,000",    change:"+3.1%", up:true  },
  { sym:"SOL/NGN",  price:"₦218,400",    change:"-1.2%", up:false },
];

const MINI_RATES = [
  { sym:"BTC",  icon:"₿", color:"#F7931A", bg:"rgba(247,147,26,0.12)", rate:"₦98.2M",  ch:"+2.4%" },
  { sym:"USDT", icon:"₮", color:"#26A17B", bg:"rgba(38,161,123,0.12)", rate:"₦1,592",   ch:"-0.3%" },
  { sym:"ETH",  icon:"Ξ", color:"#627EEA", bg:"rgba(98,126,234,0.12)", rate:"₦3.42M",   ch:"+1.8%" },
];

// ─── LOGO ─────────────────────────────────────────────────
function LogoMark({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ display:"block" }}>
      <defs>
        <filter id="lgReg"><feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="laReg"><feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <path d="M 32,52 C 26,40 16,24 8,8" stroke={C.green} strokeWidth="3.8" strokeLinecap="round" fill="none" filter="url(#lgReg)"/>
      <g transform="translate(8,8) rotate(-27)"><polygon points="0,-6 -3.5,3.5 3.5,3.5" fill={C.green} filter="url(#lgReg)"/></g>
      <path d="M 32,52 C 38,40 48,24 56,8" stroke={C.amber} strokeWidth="3.8" strokeLinecap="round" fill="none" filter="url(#laReg)"/>
      <g transform="translate(56,8) rotate(27)"><polygon points="0,-6 -3.5,3.5 3.5,3.5" fill={C.amber} filter="url(#laReg)"/></g>
      <circle cx="32" cy="52" r="3.5" fill="white"/>
    </svg>
  );
}

// ─── ENVELOPE ILLUSTRATION ────────────────────────────────
function EnvelopeIllustration({ sent }) {
  return (
    <div style={{ position:"relative", width:180, height:180, margin:"0 auto" }}>
      <div style={{ position:"absolute", inset:-10, borderRadius:"50%", background:`radial-gradient(circle,rgba(14,203,129,0.08),transparent 70%)`, animation:"float 6s ease-in-out infinite" }} />
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:100, height:74, animation:"float 5s ease-in-out infinite" }}>
        <svg width={100} height={74} viewBox="0 0 120 88">
          <rect x={4} y={16} width={112} height={68} rx={8} fill="#111" stroke="#2a2a2a" strokeWidth={1}/>
          <path d="M4,16 L60,48 L116,16 Z" fill="#141414" stroke="#2a2a2a" strokeWidth={1} style={{ transformOrigin:"60px 16px", transform: sent ? "rotateX(180deg)" : "rotateX(0deg)", transition:"transform 0.6s ease" }}/>
        </svg>
      </div>
      <div style={{ position:"absolute", top:10, left:"50%", transform:"translateX(-50%)", background:C.card, border:`1px solid rgba(14,203,129,0.3)`, borderRadius:10, padding:"6px 12px", boxShadow:`0 8px 24px rgba(0,0,0,0.5)`, animation: sent ? "codeFloat 0.6s 0.3s ease forwards" : "float 3s 1s ease-in-out infinite", opacity: sent ? 1 : 0.9 }}>
        <div style={{ display:"flex", gap:4, alignItems:"center" }}>
          {[1,2,3,4,5,6].map(i => <div key={i} style={{ width:6, height:10, borderRadius:2, background:C.green, opacity:0.6 }} />)}
        </div>
      </div>
    </div>
  );
}

// ─── COUNTDOWN RING ───────────────────────────────────────
function CountdownRing({ seconds, total }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const progress = seconds / total;
  const color = seconds > 30 ? C.green : seconds > 10 ? C.amber : C.red;
  return (
    <div style={{ position:"relative", width:100, height:100 }}>
      <svg width={100} height={100} viewBox="0 0 112 112" style={{ transform:"rotate(-90deg)", display:"block" }}>
        <circle cx={56} cy={56} r={r} fill="none" stroke={C.border2} strokeWidth={6}/>
        <circle cx={56} cy={56} r={r} fill="none" stroke={color} strokeWidth={6} strokeDasharray={circ} strokeDashoffset={circ * (1 - progress)} strokeLinecap="round" style={{ transition:"stroke-dashoffset 1s linear, stroke 0.5s" }}/>
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:24, fontWeight:500, color, lineHeight:1 }}>{String(seconds).padStart(2,"0")}</div>
        <div style={{ fontSize:9, color:C.muted, letterSpacing:2, marginTop:2 }}>SEC</div>
      </div>
    </div>
  );
}

// ─── LEFT PANEL ───────────────────────────────────────────
function LeftPanel({ page }) {
  const doubled = [...TICKERS, ...TICKERS];
  return (
    <div className="auth-left-panel" style={{
      width:"44%", minWidth:400, background:"#050505",
      borderRight:`1px solid ${C.border}`,
      display:"flex", flexDirection:"column",
      position:"sticky", top:0, height:"100vh",
      overflow:"hidden",
    }}>
      <div style={{ position:"absolute", top:-100, left:-80, width:440, height:440, borderRadius:"50%", background:`radial-gradient(circle,rgba(14,203,129,0.11),transparent 60%)`, filter:"blur(70px)", pointerEvents:"none", animation:"float 9s ease-in-out infinite" }} />
      <div style={{ position:"absolute", bottom:-80, right:-60, width:360, height:360, borderRadius:"50%", background:`radial-gradient(circle,rgba(245,166,35,0.08),transparent 60%)`, filter:"blur(60px)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`, backgroundSize:"48px 48px", opacity:0.18, WebkitMaskImage:"radial-gradient(ellipse 80% 100% at 30% 50%,black,transparent 80%)" }} />

      <div style={{ position:"relative", zIndex:1, padding:"48px 48px 32px", flex:1, display:"flex", flexDirection:"column" }}>
        <Link to="/" style={{ textDecoration:"none", display:"flex", alignItems:"center", gap:12, marginBottom:56 }}>
          <LogoMark size={42} />
          <div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:23, color:"#fff", letterSpacing:2, lineHeight:1 }}>SWIFT</div>
            <div style={{ fontSize:8, color:C.amber, letterSpacing:5, marginTop:2 }}>TRADE</div>
          </div>
        </Link>

        <div style={{ flex:1 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(14,203,129,0.08)", border:"1px solid rgba(14,203,129,0.2)", borderRadius:100, padding:"5px 14px", fontSize:11, color:C.green, letterSpacing:2, marginBottom:22 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:C.green, animation:"pulse 2s infinite", display:"inline-block" }} />
            {page === "register" ? "JOIN 50,000+ TRADERS" : "WELCOME BACK"}
          </div>

          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(42px,4.5vw,68px)", lineHeight:0.88, letterSpacing:2, marginBottom:18 }}>
            {page === "register" ? <>TRADE SMARTER.<br /><span style={{ color:C.green }}>START TODAY.</span></> : <>GOOD TO<br /><span style={{ color:C.green }}>SEE YOU.</span></>}
          </h2>

          <p style={{ color:C.muted, fontSize:15, lineHeight:1.75, fontWeight:300, maxWidth:320, marginBottom:36 }}>
            {page === "register" ? "Join thousands of Nigerians converting crypto and gift cards to naira — fast, safe, and completely transparent." : "Your portfolio is waiting. Log in to see your balances, trade, and withdraw to your bank."}
          </p>

          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:40 }}>
            {MINI_RATES.map(r => (
              <div key={r.sym} className="rate-pill" style={{ display:"flex", alignItems:"center", gap:12, background:"rgba(255,255,255,0.03)", border:`1px solid ${C.border}`, borderRadius:12, padding:"12px 16px", transition:"transform 0.2s" }}>
                <div style={{ width:34, height:34, borderRadius:"50%", background:r.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:r.color, flexShrink:0 }}>{r.icon}</div>
                <div style={{ flex:1 }}><div style={{ fontSize:12, fontWeight:500 }}>{r.sym}/NGN</div></div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:13, color:"#ccc" }}>{r.rate}</div>
                <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:100, color: r.ch.startsWith("+") ? C.green : C.red, background: r.ch.startsWith("+") ? "rgba(14,203,129,0.08)" : "rgba(246,70,93,0.08)" }}>{r.ch}</span>
              </div>
            ))}
          </div>

          <div style={{ display:"flex", gap:28 }}>
            {[{ val:"50K+", label:"Active users" },{ val:"₦12B+", label:"Total traded" },{ val:"5min", label:"Avg. payout" }].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:24, color:C.green, letterSpacing:1, lineHeight:1 }}>{s.val}</div>
                <div style={{ fontSize:10, color:C.muted, letterSpacing:1, marginTop:3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ overflow:"hidden", borderTop:`1px solid ${C.border}`, paddingTop:16, marginTop:32 }}>
          <div className="ticker-track" style={{ display:"flex", width:"max-content" }}>
            {doubled.map((t, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"0 20px", borderRight:`1px solid ${C.border}`, whiteSpace:"nowrap" }}>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"#666" }}>{t.sym}</span>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"#444" }}>{t.price}</span>
                <span style={{ fontSize:10, fontWeight:500, color:t.up?C.green:C.red }}>{t.change}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SHARED COMPONENTS ────────────────────────────────────
function Field({ label, type="text", value, onChange, placeholder, error, success, hint, rightEl, autoFocus, small }) {
  const [focused, setFocused] = useState(false);
  const cls = ["input-field", error?"error":"", success&&!error?"success":""].filter(Boolean).join(" ");
  
  const verticalPadding = small ? "10px" : "13px";
  const horizontalPadding = "16px";
  const fontSize = small ? "14px" : "15px";

  return (
    <div style={{ marginBottom: error ? 6 : 18 }}>
      <label style={{ display:"block", fontSize:11, color: focused ? C.green : error ? C.red : C.muted, letterSpacing:2, marginBottom:7, transition:"color 0.2s", userSelect:"none" }}>{label}</label>
      <div style={{ position:"relative" }}>
        <input className={cls} type={type} value={value} onChange={onChange} placeholder={placeholder} autoFocus={autoFocus} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={{ width:"100%", background:C.card, border:`1px solid ${C.border2}`, borderRadius:10, padding: rightEl ? `${verticalPadding} 46px ${verticalPadding} ${horizontalPadding}` : `${verticalPadding} ${horizontalPadding}`, color:"#fff", fontSize, outline:"none" }} />
        {rightEl && <div style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)" }}>{rightEl}</div>}
      </div>
      {error && <div style={{ fontSize:11, color:C.red, marginTop:5, letterSpacing:"0.3px" }}>⚠ {error}</div>}
      {hint && !error && <div style={{ fontSize:11, color:C.muted2, marginTop:5 }}>{hint}</div>}
    </div>
  );
}

function EyeToggle({ show, onToggle }) {
  return (
    <button type="button" className="eye-btn" onClick={onToggle} style={{ background:"none", border:"none", color:C.muted, fontSize:15, padding:0, cursor:"pointer", transition:"color 0.2s", display:"flex", alignItems:"center" }}>
      {show ? "👁" : "🙈"}
    </button>
  );
}

function PasswordStrength({ password }) {
  const score = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();
  const colors = ["", C.red, C.amber, C.amber, C.green];
  if (!password) return null;
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ display:"flex", gap:4, marginBottom:5 }}>
        {[1,2,3,4].map(i => <div key={i} style={{ flex:1, height:3, borderRadius:2, transition:"background 0.35s", background: i <= score ? colors[score] : C.border2 }} />)}
      </div>
    </div>
  );
}

function Checkbox({ checked, onChange, children }) {
  return (
    <label style={{ display:"flex", gap:12, alignItems:"flex-start", cursor:"pointer" }}>
      <div className="checkbox-box" onClick={() => onChange(!checked)} style={{ width:18, height:18, minWidth:18, borderRadius:5, marginTop:1, border:`1px solid ${checked ? C.green : C.border2}`, background: checked ? "rgba(14,203,129,0.12)" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s", cursor:"pointer" }}>
        {checked && <svg width={10} height={10} viewBox="0 0 10 10"><path d="M1.5 5L4 7.5L8.5 2.5" stroke={C.green} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
      </div>
      <span style={{ fontSize:13, color:C.muted, lineHeight:1.6 }}>{children}</span>
    </label>
  );
}

function Steps() {
  const steps = [{ label:"Account", done:true, active:false },{ label:"Verify", done:false, active:true },{ label:"Done", done:false, active:false }];
  return (
    <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:36 }}>
      {steps.map((s, i) => (
        <div key={s.label} style={{ display:"flex", alignItems:"center" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", background: s.done ? C.green : s.active ? "rgba(14,203,129,0.12)" : C.border2, border: s.active ? `1px solid rgba(14,203,129,0.4)` : "none", transition:"all 0.3s" }}>
              {s.done ? <svg width={12} height={12} viewBox="0 0 12 12" fill="none"><path d="M2 6l2.8 3L10 3" stroke="#000" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/></svg> : <span style={{ fontSize:11, fontWeight:700, color: s.active ? C.green : C.muted }}>{i+1}</span>}
            </div>
            <span style={{ fontSize:9, letterSpacing:1, textTransform:"uppercase", color: s.done ? C.green : s.active ? C.green : C.muted }}>{s.label}</span>
          </div>
          {i < steps.length-1 && <div style={{ width:64, height:1, margin:"0 8px", marginBottom:20, background: steps[i+1].done || steps[i+1].active ? C.green : C.border, transition:"background 0.5s" }} />}
        </div>
      ))}
    </div>
  );
}

// ─── OTP SCREEN ───────────────────────────────────────────
function OTPScreen({ email, onSuccess, onBack }) {
  const [digits, setDigits] = useState(["","","","","",""]);
  const [timer, setTimer]   = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const refs = useRef([]);

  useEffect(() => {
    const iv = setInterval(() => setTimer(t => {
      if (t <= 1) { setCanResend(true); clearInterval(iv); return 0; }
      return t - 1;
    }), 1000);
    return () => clearInterval(iv);
  }, []);

  const handleDigit = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits]; next[i] = val;
    setDigits(next); setError("");
    if (val && i < 5) refs.current[i+1]?.focus();
    if (!val && i > 0) refs.current[i-1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i-1]?.focus();
  };

  const handleVerify = () => {
    const code = digits.join("");
    if (code.length < 6) { setError("Please enter the complete 6-digit code"); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess(); }, 1400);
  };

  const complete = digits.every(d => d !== "");

  return (
    <div style={{ animation:"slideLeft 0.4s ease" }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:C.muted, fontSize:13, padding:0, cursor:"pointer", display:"flex", alignItems:"center", gap:6, marginBottom:32 }}>
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Back to registration
      </button>

      <Steps />

      <div style={{ marginBottom:32 }}>
        <div style={{ fontSize:11, color:C.muted, letterSpacing:3, marginBottom:10 }}>STEP 2 OF 3</div>
        <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:42, letterSpacing:1, lineHeight:1, marginBottom:14 }}>CHECK YOUR<br />EMAIL</h2>
        <p style={{ color:C.muted, fontSize:14, lineHeight:1.7, fontWeight:300 }}>
          We sent a 6-digit verification code to <span style={{ color:"#ccc", fontWeight:500 }}>{email}</span>.
        </p>
      </div>

      <div style={{ display:"flex", gap:6, marginBottom:12 }}>
        {digits.map((d, i) => (
          <input key={i} ref={el => refs.current[i] = el} className={`otp-box${d?" filled":""}`} maxLength={1} value={d} type="text" inputMode="numeric" onChange={e => handleDigit(i, e.target.value)} onKeyDown={e => handleKeyDown(i, e)} style={{ flex:1, height:50, maxWidth:46, background: d ? "rgba(14,203,129,0.04)" : C.card, border:`1px solid ${d?"rgba(14,203,129,0.35)":C.border2}`, borderRadius:12, textAlign:"center", fontFamily:"'DM Mono',monospace", fontSize:20, fontWeight:500, color:C.green, outline:"none", transition:"all 0.2s" }} />
        ))}
      </div>

      {error && <div style={{ fontSize:12, color:C.red, marginBottom:16 }}>⚠ {error}</div>}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
        <span style={{ fontSize:12, color:C.muted }}>Expires in <span style={{ color: timer > 10 ? C.green : C.red, fontFamily:"'DM Mono',monospace" }}>{String(Math.floor(timer/60)).padStart(2,"0")}:{String(timer%60).padStart(2,"0")}</span></span>
        <button disabled={!canResend} className="resend-btn" onClick={() => { setTimer(60); setCanResend(false); setDigits(["","","","","",""]); }} style={{ background:"none", border:"none", fontSize:12, cursor:canResend?"pointer":"not-allowed", color:canResend ? C.muted : C.muted2, transition:"color 0.2s", padding:0 }}>Resend code</button>
      </div>

      <button onClick={handleVerify} disabled={!complete || loading} className="submit-btn" style={{ width:"100%", background: complete ? C.green : C.border, color: complete ? "#000" : C.muted, fontWeight:700, fontSize:15, padding:"15px", borderRadius:12, border:"none", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
        {loading ? <><div style={{ width:18, height:18, borderRadius:"50%", border:"2px solid rgba(0,0,0,0.25)", borderTopColor:"#000", animation:"spin 0.8s linear infinite" }} /> Verifying...</> : "Verify & Continue →"}
      </button>
    </div>
  );
}

// ─── SUCCESS SCREEN ───────────────────────────────────────
function SuccessView() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate("/dashboard"), 2500);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div style={{ textAlign:"center", padding:"32px 0", animation:"fadeUp 0.5s ease" }}>
      <div style={{ width:100, height:100, borderRadius:"50%", background:"rgba(14,203,129,0.1)", border:`2px solid ${C.green}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 28px", animation:"successBounce 0.6s ease" }}>
        <svg width={40} height={40} viewBox="0 0 40 40" fill="none"><path d="M9 20L16.5 27.5L31 12" stroke={C.green} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:42, letterSpacing:1, marginBottom:12 }}>YOU'RE ALL SET!</h2>
      <p style={{ color:C.muted, fontSize:14, lineHeight:1.7, marginBottom:36 }}>Welcome to Swift Trade. Your account is ready.<br />Redirecting to your dashboard...</p>
      <div style={{ display:"flex", justifyContent:"center" }}>
        <div style={{ width:36, height:36, borderRadius:"50%", border:`3px solid ${C.border}`, borderTopColor:C.green, animation:"spin 0.8s linear infinite" }} />
      </div>
    </div>
  );
}

// ─── LOGIN FORM ───────────────────────────────────────────
function LoginForm({ onSwitch }) {
  const [form, setForm] = useState({ email:"", password:"" });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const formRef = useRef(null);

  const handleSubmit = () => {
    if (!form.email || !form.password) {
      setErrors({ email: !form.email ? "Email is required" : "", password: !form.password ? "Password is required" : "" });
      formRef.current?.classList.add("shake");
      setTimeout(() => formRef.current?.classList.remove("shake"), 400);
      return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1500);
  };

  if (success) return <SuccessView />;

  return (
    <div ref={formRef} className="auth-form">
      <div style={{ marginBottom:36 }}>
        <div style={{ fontSize:11, color:C.muted, letterSpacing:3, marginBottom:10 }}>WELCOME BACK</div>
        <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:44, letterSpacing:1, lineHeight:1, marginBottom:10 }}>LOG IN TO<br />SWIFT TRADE</h1>
        <p style={{ color:C.muted, fontSize:14, fontWeight:300 }}>Access your wallet, rates and withdrawal tools.</p>
      </div>

      <Field label="EMAIL ADDRESS" type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="you@example.com" error={errors.email} autoFocus />
      <Field label="PASSWORD" type={showPass?"text":"password"} value={form.password} onChange={e => setForm({...form, password:e.target.value})} placeholder="Enter your password" error={errors.password} rightEl={<EyeToggle show={showPass} onToggle={() => setShowPass(!showPass)} />} />
      
      <div style={{ textAlign:"right", marginBottom:24, marginTop:-8 }}>
        <Link to="/forgot-password" style={{ color:C.amber, fontSize:13, textDecoration:"none", fontWeight:500, transition:"opacity 0.2s" }} onMouseOver={e => e.target.style.opacity = 0.8} onMouseOut={e => e.target.style.opacity = 1}>Forgot password?</Link>
      </div>

      <button onClick={handleSubmit} disabled={loading} className="submit-btn" style={{ width:"100%", background:C.green, color:"#000", fontWeight:700, fontSize:15, padding:"15px", borderRadius:12, border:"none", marginBottom:24, display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
        {loading ? <><div style={{ width:18, height:18, borderRadius:"50%", border:"2px solid rgba(0,0,0,0.3)", borderTopColor:"#000", animation:"spin 0.8s linear infinite" }} />Logging in...</> : "Log In →"}
      </button>

      <div style={{ background:"rgba(245,166,35,0.05)", border:"1px solid rgba(245,166,35,0.15)", borderRadius:12, padding:"16px 20px", textAlign:"center" }}>
        <p style={{ fontSize:13, color:C.muted, marginBottom:6 }}>New to Swift Trade?</p>
        <button onClick={onSwitch} style={{ background:"none", border:"none", color:C.amber, fontSize:14, fontWeight:600, cursor:"pointer" }}>Create a free account →</button>
      </div>
    </div>
  );
}

// ─── REGISTER FORM ────────────────────────────────────────
function RegisterForm({ onSwitch }) {
  const [form, setForm] = useState({ fullName:"", email:"", phone:"", password:"", confirm:"" });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("form");
  const formRef = useRef(null);

  const handleSubmit = () => {
    if (!form.fullName || !form.email || !form.password || form.password !== form.confirm || !agreed) {
      setErrors({ fullName: !form.fullName ? "Name is required" : "", email: !form.email ? "Email is required" : "", password: !form.password ? "Password is required" : "", confirm: form.password !== form.confirm ? "Passwords do not match" : "", terms: !agreed ? "Agree to terms" : "" });
      formRef.current?.classList.add("shake");
      setTimeout(() => formRef.current?.classList.remove("shake"), 400);
      return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("otp"); }, 1000);
  };

  if (step === "otp") return <OTPScreen email={form.email} onSuccess={() => setStep("success")} onBack={() => setStep("form")} />;
  if (step === "success") return <SuccessView />;

  return (
    <div ref={formRef} className="auth-form">
      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:11, color:C.muted, letterSpacing:3, marginBottom:10 }}>GET STARTED FREE</div>
        <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:46, letterSpacing:1, lineHeight:0.92, marginBottom:12 }}>CREATE YOUR<br />ACCOUNT</h1>
        <p style={{ color:C.muted, fontSize:14, fontWeight:300 }}>Takes under 2 minutes. No hidden fees, ever.</p>
      </div>

      <Field small label="FULL NAME" value={form.fullName} onChange={e => setForm({...form, fullName:e.target.value})} placeholder="Adewale Obi" error={errors.fullName} autoFocus />
      <Field small label="EMAIL ADDRESS" type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="you@example.com" error={errors.email} />
      <Field small label="PHONE NUMBER" type="tel" value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} placeholder="08012345678" error={errors.phone} />
      <Field small label="PASSWORD" type={showPass?"text":"password"} value={form.password} onChange={e => setForm({...form, password:e.target.value})} placeholder="Min. 8 characters" error={errors.password} rightEl={<EyeToggle show={showPass} onToggle={() => setShowPass(!showPass)} />} />
      <PasswordStrength password={form.password} />
      <Field small label="CONFIRM PASSWORD" type={showConfirm?"text":"password"} value={form.confirm} onChange={e => setForm({...form, confirm:e.target.value})} placeholder="Repeat your password" error={errors.confirm} success={form.confirm && form.confirm === form.password} rightEl={<EyeToggle show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />} />

      <div style={{ marginBottom: 22 }}><Checkbox checked={agreed} onChange={setAgreed}>I agree to Swift Trade's Terms and Privacy Policy.</Checkbox></div>
      <button onClick={handleSubmit} disabled={loading} className="submit-btn" style={{ width:"100%", background:C.green, color:"#000", fontWeight:700, fontSize:15, padding:"15px", borderRadius:12, border:"none", marginBottom:20, display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
        {loading ? <><div style={{ width:18, height:18, borderRadius:"50%", border:"2px solid rgba(0,0,0,0.25)", borderTopColor:"#000", animation:"spin 0.8s linear infinite" }} />Creating account...</> : "Create Account →"}
      </button>

      <div style={{ background:"rgba(14,203,129,0.04)", border:`1px solid ${C.border}`, borderRadius:12, padding:"16px 20px", textAlign:"center" }}>
        <p style={{ fontSize:13, color:C.muted, marginBottom:6 }}>Already have an account?</p>
        <button onClick={onSwitch} style={{ background:"none", border:"none", color:C.green, fontSize:14, fontWeight:600, cursor:"pointer" }}>Log in here →</button>
      </div>
    </div>
  );
}

// ─── AUTH PAGE ────────────────────────────────────────────
export default function AuthPage({ initialPage = "login" }) {
  const [page, setPage] = useState(initialPage);
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg }}>
      <LeftPanel page={page} />
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"80px 56px", overflowY:"auto" }}>
        <div style={{ width:"100%", maxWidth:420 }}>
          {page === "login" ? <LoginForm onSwitch={() => setPage("register")} /> : <RegisterForm onSwitch={() => setPage("login")} />}
        </div>
      </div>
    </div>
  );
}
