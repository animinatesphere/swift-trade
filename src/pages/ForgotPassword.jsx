import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

const C = {
  green: "#0ECB81", amber: "#F5A623", red: "#F6465D",
  bg: "#080808", surface: "#0f0f0f", card: "#111111",
  border: "#1a1a1a", border2: "#222222",
  text: "#ffffff", muted: "#555555", muted2: "#333333",
};

const DEMO_OTP = "482916";
const OTP_DURATION = 300;

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html, body { height:100%; overflow:hidden; }
  body { background:#080808; color:#fff; font-family:'Outfit',sans-serif; }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-thumb { background:#222; border-radius:4px; }
  input:-webkit-autofill, input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 1000px #111 inset !important;
    -webkit-text-fill-color: #fff !important;
    caret-color: #fff;
  }

  @keyframes fadeUp    { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes slideIn   { from{opacity:0;transform:translateX(28px)} to{opacity:1;transform:translateX(0)} }
  @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
  @keyframes floatRock { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-10px) rotate(1.5deg)} }
  @keyframes pulse     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.7)} }
  @keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes shake     { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }
  @keyframes popIn     { 0%{transform:scale(0.55);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
  @keyframes successIn { 0%{transform:scale(0.5);opacity:0} 60%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
  @keyframes checkDraw { from{stroke-dashoffset:70} to{stroke-dashoffset:0} }
  @keyframes ripple    { 0%{transform:scale(1);opacity:0.7} 100%{transform:scale(3);opacity:0} }
  @keyframes orb       { 0%,100%{transform:scale(1) translateY(0)} 50%{transform:scale(1.06) translateY(-12px)} }
  @keyframes glowRing  { 0%,100%{box-shadow:0 0 0 0 rgba(14,203,129,0.3)} 50%{box-shadow:0 0 0 8px rgba(14,203,129,0.08)} }

  /* inputs */
  .st-input { transition: border-color 0.2s, box-shadow 0.2s; }
  .st-input:focus {
    border-color: rgba(14,203,129,0.55) !important;
    box-shadow: 0 0 0 3px rgba(14,203,129,0.08) !important;
    outline: none;
  }
  .st-input.err  { border-color: rgba(246,70,93,0.55) !important; box-shadow: 0 0 0 3px rgba(246,70,93,0.07) !important; }
  .st-input.ok   { border-color: rgba(14,203,129,0.4) !important; }

  /* otp boxes */
  .otp-box { transition: all 0.18s; }
  .otp-box:focus { border-color: rgba(14,203,129,0.7) !important; box-shadow: 0 0 0 3px rgba(14,203,129,0.1) !important; outline:none; transform:scale(1.06); }
  .otp-box.filled  { border-color: rgba(14,203,129,0.45) !important; background: rgba(14,203,129,0.06) !important; animation:popIn 0.18s ease; }
  .otp-box.bad     { border-color: rgba(246,70,93,0.55) !important; background: rgba(246,70,93,0.06) !important; }

  /* buttons */
  .pri-btn { transition: all 0.22s; }
  .pri-btn:hover:not(:disabled) { background:#0fdf8e !important; transform:translateY(-2px); box-shadow:0 12px 32px rgba(14,203,129,0.38) !important; }
  .pri-btn:disabled { opacity:0.38 !important; cursor:not-allowed !important; }
  .pri-btn:active:not(:disabled) { transform:translateY(0) !important; }

  .back-btn:hover  { color:#fff !important; }
  .eye-btn:hover   { color:#fff !important; }
  .resend-btn:not(:disabled):hover { color:#0ECB81 !important; }

  .step-panel { animation: slideIn 0.35s ease; }
  .do-shake   { animation: shake  0.42s ease; }

  @media (max-width: 1024px) {
    .left-panel-forgot { display: none !important; }
    .right-panel-forgot { padding: 40px 24px !important; }
    .otp-container { gap: 8px !important; }
    .otp-box-input { height: 48px !important; font-size: 18px !important; }
  }
`;

// ─── LOGO ─────────────────────────────────────────────────
function Mark({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ display:"block" }}>
      <defs>
        <filter id="gfpw"><feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="afpw"><feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <path d="M 32,52 C 26,40 16,24 8,8" stroke={C.green} strokeWidth="3.8" strokeLinecap="round" fill="none" filter="url(#gfpw)"/>
      <g transform="translate(8,8) rotate(-27)"><polygon points="0,-6 -3.5,3.5 3.5,3.5" fill={C.green} filter="url(#gfpw)"/></g>
      <path d="M 32,52 C 38,40 48,24 56,8" stroke={C.amber} strokeWidth="3.8" strokeLinecap="round" fill="none" filter="url(#afpw)"/>
      <g transform="translate(56,8) rotate(27)"><polygon points="0,-6 -3.5,3.5 3.5,3.5" fill={C.amber} filter="url(#afpw)"/></g>
      <circle cx="32" cy="52" r="3.5" fill="white"/>
    </svg>
  );
}

// ─── STEP INDICATOR ───────────────────────────────────────
function StepBar({ current }) {
  const steps = ["Email", "Verify OTP", "New Password"];
  return (
    <div style={{ display:"flex", alignItems:"center", marginBottom:32 }}>
      {steps.map((s, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <div key={s} style={{ display:"flex", alignItems:"center", flex: i < 2 ? 1 : "none" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
              <div style={{
                width:26, height:26, borderRadius:"50%",
                display:"flex", alignItems:"center", justifyContent:"center",
                background: done ? C.green : active ? "rgba(14,203,129,0.12)" : C.border2,
                border: active ? `1px solid ${C.green}55` : "none",
                boxShadow: active ? `0 0 0 4px rgba(14,203,129,0.07)` : "none",
                transition:"all 0.3s",
              }}>
                {done
                  ? <svg width={12} height={12} viewBox="0 0 12 12" fill="none"><path d="M2 6l2.8 3L10 3" stroke="#000" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : <span style={{ fontSize:11, fontWeight:700, color: active ? C.green : C.muted }}>{i+1}</span>}
              </div>
              <span style={{ fontSize:9, letterSpacing:"0.5px", textTransform:"uppercase",
                color: done ? C.green : active ? C.green : C.muted,
                whiteSpace:"nowrap" }}>{s}</span>
            </div>
            {i < 2 && (
              <div style={{ flex:1, height:1, margin:"0 10px 18px",
                background: i < current
                  ? `linear-gradient(90deg,${C.green},rgba(14,203,129,0.3))`
                  : C.border,
                transition:"background 0.4s" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── FIELD ────────────────────────────────────────────────
function Field({ label, type = "text", value, onChange, placeholder, error, valid, hint, right, autoFocus, onEnter }) {
  const [focus, setFocus] = useState(false);
  const cls = ["st-input", error ? "err" : valid && !error ? "ok" : ""].join(" ").trim();
  return (
    <div style={{ marginBottom: error ? 6 : 18 }}>
      {label && (
        <label style={{ display:"block", fontSize:11, letterSpacing:2,
          marginBottom:7, transition:"color 0.2s",
          color: focus ? C.green : error ? C.red : C.muted }}>
          {label}
        </label>
      )}
      <div style={{ position:"relative" }}>
        <input className={cls} type={type} value={value}
          autoFocus={autoFocus}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onKeyDown={e => e.key === "Enter" && onEnter?.()}
          style={{ width:"100%", background:C.card, border:`1px solid ${C.border2}`,
            borderRadius:11, padding: right ? "13px 46px 13px 16px" : "13px 16px",
            color:"#fff", fontSize:15 }} />
        {right && (
          <div style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)" }}>
            {right}
          </div>
        )}
      </div>
      {error && <div style={{ fontSize:11, color:C.red, marginTop:5, display:"flex", gap:5, alignItems:"center" }}>
        <svg width={11} height={11} viewBox="0 0 11 11"><circle cx="5.5" cy="5.5" r="5.5" fill={C.red}/><path d="M5.5 3v3M5.5 7.5h.01" stroke="#000" strokeWidth={1.1} strokeLinecap="round"/></svg>
        {error}
      </div>}
      {hint && !error && <div style={{ fontSize:11, color:C.muted2, marginTop:5 }}>{hint}</div>}
    </div>
  );
}

// ─── EYE BUTTON ───────────────────────────────────────────
function Eye({ show, toggle }) {
  return (
    <button type="button" className="eye-btn" onClick={toggle}
      style={{ background:"none", border:"none", padding:0, cursor:"pointer",
        color:C.muted, transition:"color 0.2s", display:"flex", alignItems:"center" }}>
      {show
        ? <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        : <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>}
    </button>
  );
}

// ─── PASSWORD STRENGTH ────────────────────────────────────
function Strength({ pw }) {
  const score = !pw ? 0 : [pw.length >= 8, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length;
  const cols  = ["","#F6465D","#F5A623","#F5A623","#0ECB81"];
  const labs  = ["","Weak","Fair","Good","Strong"];
  if (!pw) return null;
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ display:"flex", gap:4, marginBottom:5 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ flex:1, height:3, borderRadius:2,
            background: i <= score ? cols[score] : C.border,
            transition:"background 0.3s" }} />
        ))}
      </div>
      <span style={{ fontSize:10, color:cols[score], letterSpacing:1 }}>{labs[score]} password</span>
    </div>
  );
}

// ─── SUBMIT BUTTON ────────────────────────────────────────
function Btn({ children, onClick, disabled, loading, style: extra = {} }) {
  return (
    <button onClick={onClick} disabled={disabled || loading} className="pri-btn"
      style={{ width:"100%", background: disabled ? C.border : C.green,
        color: disabled ? C.muted : "#000",
        fontWeight:700, fontSize:15, padding:"15px", borderRadius:12,
        border:"none", display:"flex", alignItems:"center",
        justifyContent:"center", gap:10, ...extra }}>
      {loading
        ? <><div style={{ width:18, height:18, borderRadius:"50%",
            border:"2.5px solid rgba(0,0,0,0.25)", borderTopColor:"#000",
            animation:"spin 0.8s linear infinite" }} />Processing...</>
        : children}
    </button>
  );
}

// ─── BACK BUTTON ──────────────────────────────────────────
function BackBtn({ onClick, label = "Back" }) {
  return (
    <button className="back-btn" onClick={onClick}
      style={{ background:"none", border:"none", color:C.muted,
        fontSize:13, padding:0, cursor:"pointer", display:"flex",
        alignItems:"center", gap:6, marginBottom:32, transition:"color 0.2s" }}>
      <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        <path d="M19 12H5M12 5l-7 7 7 7"/>
      </svg>
      {label}
    </button>
  );
}

// ─── COUNTDOWN RING ───────────────────────────────────────
function Ring({ s, total }) {
  const r = 18, circ = 2 * Math.PI * r;
  const col = s > 30 ? C.green : s > 10 ? C.amber : C.red;
  return (
    <div style={{ position:"relative", width:48, height:48, flexShrink:0 }}>
      <svg width={48} height={48} viewBox="0 0 48 48" style={{ transform:"rotate(-90deg)", display:"block" }}>
        <circle cx={24} cy={24} r={r} fill="none" stroke={C.border2} strokeWidth={3}/>
        <circle cx={24} cy={24} r={r} fill="none" stroke={col} strokeWidth={3}
          strokeDasharray={circ} strokeDashoffset={circ*(1-s/total)}
          strokeLinecap="round" style={{ transition:"stroke-dashoffset 1s linear, stroke 0.5s" }}/>
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex",
        alignItems:"center", justifyContent:"center",
        fontFamily:"'DM Mono',monospace", fontSize:12, color:col,
        transition:"color 0.5s" }}>{s}</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// STEP 1 — EMAIL
// ══════════════════════════════════════════════════════════
function StepEmail({ onNext }) {
  const [email, setEmail]     = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const submit = () => {
    if (!email.trim()) return setError("Please enter your email address");
    if (!isValid)      return setError("Enter a valid email address");
    setLoading(true);
    setTimeout(() => { setLoading(false); onNext(email); }, 1200);
  };

  return (
    <div className="step-panel">
      <div style={{ marginBottom:32 }}>
        <div style={{ fontSize:11, color:C.muted, letterSpacing:3, marginBottom:10 }}>ACCOUNT RECOVERY</div>
        <h1 style={{ fontFamily:"'Bebas Neue',sans-serif",
          fontSize:"clamp(38px,4vw,58px)", lineHeight:0.88,
          letterSpacing:1, marginBottom:14 }}>
          FORGOT YOUR<br /><span style={{ color:C.green }}>PASSWORD?</span>
        </h1>
        <p style={{ color:C.muted, fontSize:14, lineHeight:1.7, fontWeight:300 }}>
          Enter the email linked to your Swift Trade account. We'll send a one-time code to verify it's you.
        </p>
      </div>

      <Field
        label="EMAIL ADDRESS"
        type="email"
        value={email}
        onChange={e => { setEmail(e.target.value); setError(""); }}
        placeholder="you@example.com"
        error={error}
        valid={isValid && !!email}
        autoFocus
        onEnter={submit}
        right={isValid && !error && (
          <svg width={15} height={15} viewBox="0 0 24 24" fill="none"
            stroke={C.green} strokeWidth={2.5} strokeLinecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )}
      />

      {/* Info note */}
      <div style={{ display:"flex", gap:10, alignItems:"flex-start",
        background:"rgba(14,203,129,0.04)", border:"1px solid rgba(14,203,129,0.12)",
        borderRadius:11, padding:"12px 14px", marginBottom:22 }}>
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
          stroke={C.green} strokeWidth={2} strokeLinecap="round" style={{ flexShrink:0, marginTop:1 }}>
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span style={{ fontSize:12, color:C.muted, lineHeight:1.6, fontWeight:300 }}>
          A 6-digit OTP will be sent to this email. It expires in <span style={{ color:"#bbb" }}>10 minutes</span>.
        </span>
      </div>

      <Btn onClick={submit} disabled={!isValid} loading={loading}>
        Send OTP Code
        <svg width={15} height={15} viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </Btn>

      <div style={{ display:"flex", alignItems:"center", gap:12, margin:"22px 0" }}>
        <div style={{ flex:1, height:1, background:C.border }} />
        <span style={{ fontSize:11, color:C.muted2, letterSpacing:1 }}>OR</span>
        <div style={{ flex:1, height:1, background:C.border }} />
      </div>

      <p style={{ textAlign:"center", fontSize:13, color:C.muted }}>
        Remember it?{" "}
        <Link to="/login" style={{ color:C.green, fontWeight:600, textDecoration:"none" }}>Log in →</Link>
      </p>

      <div style={{ display:"flex", justifyContent:"center", alignItems:"center",
        gap:6, marginTop:22 }}>
        <svg width={11} height={11} viewBox="0 0 24 24" fill="none"
          stroke={C.muted2} strokeWidth={2} strokeLinecap="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
        <span style={{ fontSize:11, color:C.muted2 }}>256-bit SSL encrypted</span>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// STEP 2 — OTP
// ══════════════════════════════════════════════════════════
function StepOTP({ email, onNext, onBack }) {
  const [digits, setDigits]       = useState(["","","","","",""]);
  const [timer, setTimer]         = useState(OTP_DURATION);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [badCode, setBadCode]     = useState(false);
  const [attempts, setAttempts]   = useState(0);
  const refs = useRef([]);
  const rowRef = useRef(null);

  useEffect(() => { refs.current[0]?.focus(); }, []);

  useEffect(() => {
    const iv = setInterval(() => setTimer(t => {
      if (t <= 1) { setCanResend(true); clearInterval(iv); return 0; }
      return t - 1;
    }), 1000);
    return () => clearInterval(iv);
  }, []);

  const setDigit = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits]; next[i] = val;
    setDigits(next); setBadCode(false);
    if (val && i < 5) refs.current[i+1]?.focus();
    if (!val && i > 0) refs.current[i-1]?.focus();
  };

  const onKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i-1]?.focus();
    if (e.key === "ArrowLeft"  && i > 0) refs.current[i-1]?.focus();
    if (e.key === "ArrowRight" && i < 5) refs.current[i+1]?.focus();
  };

  const onPaste = (e) => {
    const raw = e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);
    if (raw.length === 6) { setDigits(raw.split("")); refs.current[5]?.focus(); }
    e.preventDefault();
  };

  const submit = useCallback(() => {
    const code = digits.join("");
    if (code.length < 6) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (code === DEMO_OTP) {
        onNext(code);
      } else {
        setBadCode(true);
        setAttempts(a => a+1);
        setTimeout(() => {
          setBadCode(false);
          setDigits(["","","","","",""]);
          refs.current[0]?.focus();
        }, 900);
      }
    }, 1200);
  }, [digits, onNext]);

  const resend = () => {
    setTimer(OTP_DURATION); setCanResend(false);
    setDigits(["","","","","",""]); setBadCode(false);
    refs.current[0]?.focus();
  };

  const complete = digits.every(d => d !== "");
  const timerColor = timer > 30 ? C.green : timer > 10 ? C.amber : C.red;
  const masked = email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + "*".repeat(b.length) + c);

  return (
    <div className="step-panel">
      <BackBtn onClick={onBack} label="Change email" />

      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:11, color:C.muted, letterSpacing:3, marginBottom:10 }}>STEP 2 OF 3</div>
        <h1 style={{ fontFamily:"'Bebas Neue',sans-serif",
          fontSize:"clamp(36px,4vw,54px)", lineHeight:0.88,
          letterSpacing:1, marginBottom:14 }}>
          ENTER YOUR<br /><span style={{ color:C.green }}>OTP CODE</span>
        </h1>
        <p style={{ color:C.muted, fontSize:14, lineHeight:1.6, fontWeight:300 }}>
          We sent a 6-digit code to{" "}
          <span style={{ color:"#ccc", fontWeight:500 }}>{masked}</span>
        </p>
      </div>

      {/* OTP Boxes */}
      <div style={{ marginBottom:10 }}>
        <label style={{ display:"block", fontSize:11, color:C.muted,
          letterSpacing:2, marginBottom:12 }}>VERIFICATION CODE</label>
        <div ref={rowRef} onPaste={onPaste} className="otp-container"
          style={{ display:"flex", gap:10, justifyContent:"space-between" }}>
          {digits.map((d, i) => (
            <input key={i} ref={el => refs.current[i] = el}
              className={`otp-box otp-box-input ${d ? (badCode ? "bad" : "filled") : ""}`}
              maxLength={1} value={d} type="text" inputMode="numeric"
              onChange={e => setDigit(i, e.target.value)}
              onKeyDown={e => onKeyDown(i, e)}
              style={{
                flex:1, height:52, maxWidth:48,
                background: d
                  ? badCode ? "rgba(246,70,93,0.06)" : "rgba(14,203,129,0.05)"
                  : C.card,
                border:`1px solid ${
                  d ? badCode
                    ? "rgba(246,70,93,0.5)"
                    : "rgba(14,203,129,0.4)"
                  : C.border2
                }`,
                borderRadius:10, textAlign:"center",
                fontFamily:"'DM Mono',monospace",
                fontSize:22, fontWeight:600,
                color: badCode ? C.red : d ? C.green : "#fff",
                outline:"none"
              }} />
          ))}
        </div>
      </div>

      {/* Error / expired messages */}
      <div style={{ height:20, marginBottom:14 }}>
        {badCode && (
          <div style={{ fontSize:12, color:C.red, display:"flex", alignItems:"center", gap:5, animation:"fadeIn 0.2s ease" }}>
            <svg width={11} height={11} viewBox="0 0 11 11"><circle cx="5.5" cy="5.5" r="5.5" fill={C.red}/><path d="M5.5 3v3M5.5 7.5h.01" stroke="#000" strokeWidth={1.1} strokeLinecap="round"/></svg>
            Incorrect code. {Math.max(0, 3 - attempts)} attempt{Math.max(0, 3-attempts) !== 1 ? "s" : ""} remaining.
          </div>
        )}
        {!badCode && timer === 0 && (
          <div style={{ fontSize:12, color:C.amber, display:"flex", alignItems:"center", gap:5 }}>
            <span>⚠</span> Code expired — request a new one below.
          </div>
        )}
      </div>

      {/* Timer row */}
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:22,
        background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 16px" }}>
        <Ring s={timer} total={OTP_DURATION} />
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:500, marginBottom:3,
            color: canResend ? C.amber : "#ccc" }}>
            {canResend ? "Code expired" : "Code expires in"}
          </div>
          <div style={{ fontSize:12, color:C.muted, fontWeight:300 }}>
            {canResend
              ? "Request a new code below."
              : `${String(Math.floor(timer/60)).padStart(2,"0")}:${String(timer%60).padStart(2,"0")} remaining`}
          </div>
        </div>
        <button disabled={!canResend} onClick={resend} className="resend-btn"
          style={{ background:"none", border:"none", fontSize:12, fontWeight:600,
            color: canResend ? C.muted : C.muted2,
            cursor: canResend ? "pointer" : "not-allowed",
            transition:"color 0.2s", padding:0 }}>
          Resend →
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ height:2, background:C.border, borderRadius:1,
        marginBottom:22, overflow:"hidden" }}>
        <div style={{ height:"100%", borderRadius:1,
          width:`${(timer/OTP_DURATION)*100}%`,
          background:timerColor,
          transition:"width 1s linear, background 0.5s" }} />
      </div>

      <Btn onClick={submit}
        disabled={!complete || timer === 0}
        loading={loading}>
        Verify Code →
      </Btn>

      {/* Demo hint */}
      <div style={{ marginTop:18, textAlign:"center", padding:"10px 14px",
        background:"rgba(245,166,35,0.05)", border:"1px solid rgba(245,166,35,0.12)",
        borderRadius:10 }}>
        <span style={{ fontSize:11, color:C.amber, letterSpacing:1, marginRight:8 }}>DEMO</span>
        <span style={{ fontSize:12, color:C.muted }}>
          Use code{" "}
          <span style={{ fontFamily:"'DM Mono',monospace", color:C.amber, letterSpacing:2 }}>
            {DEMO_OTP}
          </span>
        </span>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// STEP 3 — NEW PASSWORD
// ══════════════════════════════════════════════════════════
function StepPassword({ onNext, onBack }) {
  const [pw, setPw]           = useState("");
  const [cpw, setCpw]         = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const match = pw && cpw && pw === cpw;

  const validate = () => {
    const e = {};
    if (pw.length < 8) e.pw = "Password must be at least 8 characters";
    if (!pw)           e.pw = "Enter a new password";
    if (!cpw)          e.cpw = "Please confirm your password";
    if (pw && cpw && pw !== cpw) e.cpw = "Passwords do not match";
    return e;
  };

  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onNext(); }, 1400);
  };

  return (
    <div className="step-panel">
      <BackBtn onClick={onBack} label="Back to OTP" />

      <div style={{ marginBottom:32 }}>
        <div style={{ fontSize:11, color:C.muted, letterSpacing:3, marginBottom:10 }}>STEP 3 OF 3</div>
        <h1 style={{ fontFamily:"'Bebas Neue',sans-serif",
          fontSize:"clamp(36px,4vw,54px)", lineHeight:0.88,
          letterSpacing:1, marginBottom:14 }}>
          SET A NEW<br /><span style={{ color:C.green }}>PASSWORD</span>
        </h1>
        <p style={{ color:C.muted, fontSize:14, lineHeight:1.6, fontWeight:300 }}>
          Choose a strong password you haven't used before.
        </p>
      </div>

      <Field
        label="NEW PASSWORD"
        type={showPw ? "text" : "password"}
        value={pw}
        onChange={e => { setPw(e.target.value); setErrors(v => ({ ...v, pw:"" })); }}
        placeholder="Minimum 8 characters"
        error={errors.pw}
        autoFocus
        onEnter={submit}
        right={<Eye show={showPw} toggle={() => setShowPw(s => !s)} />}
      />

      <Strength pw={pw} />

      <Field
        label="CONFIRM PASSWORD"
        type={showCpw ? "text" : "password"}
        value={cpw}
        onChange={e => { setCpw(e.target.value); setErrors(v => ({ ...v, cpw:"" })); }}
        placeholder="Repeat your password"
        error={errors.cpw}
        valid={match}
        onEnter={submit}
        right={
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            {match && (
              <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7l3 3 6-6" stroke={C.green} strokeWidth={1.5}
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            <Eye show={showCpw} toggle={() => setShowCpw(s => !s)} />
          </div>
        }
      />

      {/* Password rules */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:22 }}>
        {[
          { label:"8+ characters",    ok:pw.length >= 8 },
          { label:"Uppercase letter",  ok:/[A-Z]/.test(pw) },
          { label:"Number",            ok:/[0-9]/.test(pw) },
          { label:"Special character", ok:/[^A-Za-z0-9]/.test(pw) },
        ].map(r => (
          <div key={r.label} style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:14, height:14, borderRadius:"50%", flexShrink:0,
              background: r.ok ? "rgba(14,203,129,0.15)" : C.border2,
              border: `1px solid ${r.ok ? C.green : C.border}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              transition:"all 0.3s" }}>
              {r.ok && <svg width={7} height={7} viewBox="0 0 7 7" fill="none">
                <path d="M1 3.5l1.7 2L6 1" stroke={C.green} strokeWidth={1.2}
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>}
            </div>
            <span style={{ fontSize:11, color: r.ok ? "#bbb" : C.muted,
              transition:"color 0.3s" }}>{r.label}</span>
          </div>
        ))}
      </div>

      <Btn onClick={submit}
        disabled={!pw || !cpw}
        loading={loading}>
        Reset Password
        <svg width={15} height={15} viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
      </Btn>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// STEP 4 — SUCCESS
// ══════════════════════════════════════════════════════════
function StepSuccess() {
  return (
    <div style={{ textAlign:"center", padding:"20px 0", animation:"slideIn 0.4s ease" }}>
      {/* Ring */}
      <div style={{ position:"relative", width:100, height:100, margin:"0 auto 28px" }}>
        <div style={{ position:"absolute", inset:-6, borderRadius:"50%",
          border:`2px solid rgba(14,203,129,0.35)`, animation:"ripple 1s ease-out" }} />
        <div style={{ position:"absolute", inset:-6, borderRadius:"50%",
          border:`2px solid rgba(14,203,129,0.15)`, animation:"ripple 1s 0.2s ease-out" }} />
        <div style={{ width:100, height:100, borderRadius:"50%",
          background:"rgba(14,203,129,0.1)", border:`2px solid ${C.green}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          animation:"successIn 0.5s ease",
          boxShadow:`0 0 40px rgba(14,203,129,0.2)` }}>
          <svg width={44} height={44} viewBox="0 0 44 44" fill="none">
            <path d="M9 22l8 9L35 13" stroke={C.green} strokeWidth={3}
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={70}
              style={{ animation:"checkDraw 0.5s 0.3s ease forwards", strokeDashoffset:70 }}/>
          </svg>
        </div>
      </div>

      <div style={{ display:"inline-flex", alignItems:"center", gap:7,
        background:"rgba(14,203,129,0.08)", border:"1px solid rgba(14,203,129,0.2)",
        borderRadius:100, padding:"5px 14px", fontSize:10, color:C.green,
        letterSpacing:3, marginBottom:20 }}>
        PASSWORD UPDATED
      </div>

      <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:50,
        letterSpacing:1, lineHeight:0.9, marginBottom:14 }}>
        ALL DONE!<br /><span style={{ color:C.green }}>YOU'RE IN.</span>
      </h2>

      <p style={{ color:C.muted, fontSize:14, lineHeight:1.7,
        maxWidth:320, margin:"0 auto 32px" }}>
        Your password has been reset. You can now log in to your Swift Trade account with your new password.
      </p>

      <Link to="/login" className="pri-btn"
        style={{ background:C.green, color:"#000", fontWeight:700,
          fontSize:15, padding:"14px 40px", borderRadius:12, border:"none",
          margin:"0 auto", display:"flex", alignItems:"center", gap:8, textDecoration: "none" }}>
        Go to Login
        <svg width={15} height={15} viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </Link>

      <p style={{ fontSize:11, color:C.muted2, marginTop:18 }}>
        For security, all active sessions have been logged out.
      </p>
    </div>
  );
}

// ─── LEFT PANEL ───────────────────────────────────────────
const LEFT_COPY = [
  { title:"FORGOT\nYOUR\nPASSWORD?",    sub:"Enter your registered email and we'll send you a code to get back in.",   lockStep:0 },
  { title:"CHECK\nYOUR\nINBOX",         sub:"A 6-digit code is on its way. Enter it to verify your identity.",          lockStep:1 },
  { title:"ALMOST\nTHERE",              sub:"Set a strong new password. Make it something you haven't used before.",     lockStep:2 },
  { title:"ACCESS\nRESTORED",           sub:"You're all set. Welcome back to Swift Trade.",                              lockStep:3 },
];

function LeftPanel({ step }) {
  const info = LEFT_COPY[step] || LEFT_COPY[0];
  const unlocked = step >= 1;
  const done     = step >= 3;

  return (
    <div className="left-panel-forgot" style={{ width:"44%", minWidth:360, background:"#050505",
      borderRight:`1px solid ${C.border}`,
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      position:"sticky", top:0, height:"100vh",
      overflow:"hidden", padding:"48px", }}>

      {/* Orbs */}
      <div style={{ position:"absolute", top:-80, left:-80, width:400, height:400,
        borderRadius:"50%", background:`radial-gradient(circle,rgba(14,203,129,0.09),transparent 60%)`,
        filter:"blur(70px)", pointerEvents:"none", animation:"orb 9s ease-in-out infinite" }} />
      <div style={{ position:"absolute", bottom:-60, right:-60, width:320, height:320,
        borderRadius:"50%", background:`radial-gradient(circle,rgba(245,166,35,0.07),transparent 60%)`,
        filter:"blur(60px)", pointerEvents:"none" }} />
      {/* Grid */}
      <div style={{ position:"absolute", inset:0,
        backgroundImage:`linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`,
        backgroundSize:"48px 48px", opacity:0.15,
        WebkitMaskImage:"radial-gradient(ellipse 80% 80% at 50% 50%,black,transparent 80%)" }} />

      <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:320, textAlign:"center" }}>

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:12,
          justifyContent:"center", marginBottom:48 }}>
          <Mark size={40} />
          <div style={{ textAlign:"left" }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22,
              color:"#fff", letterSpacing:2, lineHeight:1 }}>SWIFT</div>
            <div style={{ fontSize:8, color:C.amber, letterSpacing:5, marginTop:2 }}>TRADE</div>
          </div>
        </div>

        {/* Lock illustration */}
        <div style={{ marginBottom:32, position:"relative", height:160,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          {/* Glow rings */}
          <div style={{ position:"absolute", inset:0,
            background:`radial-gradient(circle,rgba(14,203,129,${done?0.12:0.06}),transparent 65%)`,
            animation:"orb 7s ease-in-out infinite", transition:"all 0.5s" }} />
          <div style={{ position:"absolute", inset:16, borderRadius:"50%",
            border:`1px dashed rgba(14,203,129,0.1)`, animation:"spin 40s linear infinite" }} />

          {done && (<>
            <div style={{ position:"absolute", inset:24, borderRadius:"50%",
              border:`2px solid rgba(14,203,129,0.4)`, animation:"ripple 1s ease-out" }} />
            <div style={{ position:"absolute", inset:24, borderRadius:"50%",
              border:`2px solid rgba(14,203,129,0.2)`, animation:"ripple 1s 0.3s ease-out" }} />
          </>)}

          {/* Lock SVG */}
          <div style={{
            filter: unlocked ? `drop-shadow(0 0 20px ${C.green}55)` : "drop-shadow(0 8px 20px rgba(0,0,0,0.5))",
            animation: unlocked ? "none" : "floatRock 5s ease-in-out infinite",
            transition:"filter 0.5s",
          }}>
            <svg width={88} height={108} viewBox="0 0 88 108">
              <defs>
                <linearGradient id="lb2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={done?"#0ECB81":unlocked?"#0ECB81":"#1c1c1c"}/>
                  <stop offset="100%" stopColor={done?"#069f5f":unlocked?"#0a8050":"#101010"}/>
                </linearGradient>
              </defs>
              {/* Shackle */}
              <g style={{ transformOrigin:"22px 40px",
                transform: unlocked ? "rotate(-28deg) translateY(-5px)" : "none",
                transition:"transform 0.55s cubic-bezier(0.34,1.56,0.64,1)" }}>
                <path d="M22,40 L22,22 Q22,8 44,8 Q66,8 66,22 L66,40"
                  fill="none" stroke={unlocked ? C.green : "#2a2a2a"}
                  strokeWidth={8} strokeLinecap="round"
                  style={{ transition:"stroke 0.5s" }}/>
              </g>
              {/* Body */}
              <rect x={8} y={40} width={72} height={58} rx={10}
                fill="url(#lb2)"
                stroke={unlocked ? "rgba(14,203,129,0.3)" : "#252525"}
                strokeWidth={1}
                style={{ transition:"all 0.5s" }}/>
              <rect x={8} y={40} width={72} height={3} rx={1}
                fill={unlocked ? "rgba(14,203,129,0.6)" : "rgba(255,255,255,0.04)"}
                style={{ transition:"fill 0.5s" }}/>
              {/* Keyhole or check */}
              {!unlocked && <>
                <circle cx={44} cy={66} r={9} fill="#080808" stroke="#2a2a2a" strokeWidth={1}/>
                <rect x={40} y={70} width={8} height={13} rx={3} fill="#080808"/>
              </>}
              {unlocked && (
                <path d="M28 69L38 79L60 57" stroke="#000" strokeWidth={4.5}
                  strokeLinecap="round" strokeLinejoin="round" fill="none"
                  strokeDasharray={70}
                  style={{ animation:"checkDraw 0.4s 0.3s ease forwards", strokeDashoffset:70 }}/>
              )}
            </svg>
          </div>
        </div>

        {/* Dynamic copy */}
        <h3 key={step} style={{ fontFamily:"'Bebas Neue',sans-serif",
          fontSize:"clamp(28px,3vw,40px)", letterSpacing:1, lineHeight:1,
          marginBottom:12, whiteSpace:"pre-line",
          color: done ? C.green : "#fff",
          animation:"fadeUp 0.4s ease", transition:"color 0.5s" }}>
          {info.title}
        </h3>
        <p key={`sub-${step}`} style={{ color:C.muted, fontSize:13, lineHeight:1.7,
          fontWeight:300, maxWidth:260, margin:"0 auto",
          animation:"fadeUp 0.4s 0.1s ease both", opacity:0 }}>
          {info.sub}
        </p>
      </div>
    </div>
  );
}

// ─── FORGOT PASSWORD PAGE ──────────────────────────────────────────
export default function ForgotPassword() {
  const [step, setStep]   = useState(0);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={{ display:"flex", height:"100vh", background:C.bg, overflow:"hidden" }}>
      <LeftPanel step={step} />

      {/* Right panel */}
      <div className="right-panel-forgot" style={{ flex:1, display:"flex", alignItems:"center",
        justifyContent:"center", padding:"60px 56px",
        overflowY:"auto", background:C.bg }}>
        <div style={{ width:"100%", maxWidth:420 }}>

          {step < 3 && <StepBar current={step} />}

          {step === 0 && (
            <StepEmail onNext={e => { setEmail(e); setStep(1); }} />
          )}
          {step === 1 && (
            <StepOTP
              email={email}
              onNext={t => { setToken(t); setStep(2); }}
              onBack={() => setStep(0)}
            />
          )}
          {step === 2 && (
            <StepPassword
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && <StepSuccess />}
        </div>
      </div>
    </div>
  );
}
