import React, { useState, useEffect, useRef } from "react";
import { useOutletContext, Link } from "react-router-dom";
import logoImg from "../../assets/logo.png";
import api from "../../api/axios";

// ── Cloudinary config (same as KYC) ─────────────────────────────────────────
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dbhelafgg";
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "swiftrade-app";

// ── Upload image to Cloudinary, returns secure_url ───────────────────────────
function uploadToCloudinary(file, onProgress) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", "giftcards");
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      try {
        const res = JSON.parse(xhr.responseText);
        if (res.secure_url) resolve(res.secure_url);
        else reject(new Error("Failed to get URL from Cloudinary."));
      } catch {
        reject(new Error("Failed to parse Cloudinary response."));
      }
    };
    xhr.onerror = () => reject(new Error("Upload to Cloudinary failed."));
    xhr.send(formData);
  });
}

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
  @keyframes popIn     { 0%{transform:scale(0.6);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
  @keyframes shimmer   { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
  @keyframes bounce    { 0%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }

  .step-form       { animation:slideIn 0.3s ease; }
  .pri-btn         { transition:all 0.2s; cursor:pointer; }
  .pri-btn:hover:not(:disabled) { background:#0fdf8e !important; transform:translateY(-2px); box-shadow:0 10px 28px rgba(14,203,129,0.32) !important; }
  .pri-btn:disabled { opacity:0.35 !important; cursor:not-allowed !important; }
  .ghost-btn:hover { border-color:#555 !important; color:#ccc !important; }
  .ghost-btn       { transition:all 0.18s; }
  .back-btn:hover  { color:#fff !important; }
  .back-btn        { transition:color 0.15s; }
  .brand-card      { transition:all 0.2s; }
  .brand-card:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,0,0,0.4) !important; }
  .brand-card.sel  { transform:translateY(-3px); }
  .denom-btn       { transition:all 0.15s; }
  .denom-btn:hover { border-color:#555 !important; color:#ccc !important; }
  .denom-btn.sel   { background:rgba(14,203,129,0.1) !important; border-color:rgba(14,203,129,0.35) !important; color:#0ECB81 !important; }
  .country-btn     { transition:all 0.15s; }
  .country-btn:hover { border-color:#444 !important; }
  .country-btn.sel { background:rgba(14,203,129,0.08) !important; border-color:rgba(14,203,129,0.3) !important; color:#0ECB81 !important; }
  .upload-zone     { transition:all 0.2s; }
  .upload-zone:hover { border-color:rgba(14,203,129,0.4) !important; background:rgba(14,203,129,0.03) !important; }
  .upload-zone.drag { border-color:#0ECB81 !important; background:rgba(14,203,129,0.06) !important; }
  .st-input        { transition:border-color 0.2s, box-shadow 0.2s; display:block; }
  .st-input:focus  { border-color:rgba(14,203,129,0.5) !important; box-shadow:0 0 0 3px rgba(14,203,129,0.07) !important; outline:none; }

  .giftcards-container {
    display: flex;
    flex: 1;
    min-height: 0;
  }

  .left-panel {
    width: 290px;
    background: #060606;
    border-right: 1px solid #1a1a1a;
    display: flex;
    flex-direction: column;
    height: 100%;
    flex-shrink: 0;
    padding: 28px 22px;
    position: relative;
    overflow-y: auto;
    box-sizing: border-box;
  }

  .form-area {
    flex: 1;
    overflow-y: auto;
    padding: 32px 48px 40px;
    box-sizing: border-box;
    min-width: 0;
  }

  .custom-amt-wrapper {
    position: relative;
    display: block;
  }

  .custom-amt-symbol {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-family: 'DM Mono', monospace;
    font-size: 16px;
    color: #888888;
    pointer-events: none;
    z-index: 1;
    line-height: 1;
  }

  .custom-amt-input {
    display: block;
    width: 100%;
    box-sizing: border-box;
    background: #141414;
    border: 1px solid #222222;
    border-radius: 10px;
    padding: 12px 14px 12px 30px;
    color: #ffffff;
    font-size: 16px;
    font-family: 'DM Mono', monospace;
    transition: border-color 0.2s, box-shadow 0.2s;
    -webkit-appearance: none;
    appearance: none;
    position: relative;
    z-index: 0;
  }

  .custom-amt-input:focus {
    border-color: rgba(14,203,129,0.5) !important;
    box-shadow: 0 0 0 3px rgba(14,203,129,0.07) !important;
    outline: none;
  }

  @media (max-width: 1024px) {
    .giftcards-container {
      flex-direction: column !important;
    }
    .left-panel {
      display: none !important;
    }
    .form-area {
      padding: 24px 20px 40px !important;
    }
    .giftcards-topbar {
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
    .brand-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }
`;

// ── BRAND METADATA MAPPINGS ─────────────────────────────────────────────────
const BRAND_METADATA = {
  amazon: { icon: "🛒", bg: "linear-gradient(135deg,#1a0800,#3d1f00)", color: "#FF9900", textColor: "rgba(255,153,0,0.8)" },
  itunes: { icon: "🎵", bg: "linear-gradient(135deg,#1a001a,#330020)", color: "#FC3C44", textColor: "rgba(252,60,68,0.8)" },
  steam: { icon: "🎮", bg: "linear-gradient(135deg,#00101a,#001f33)", color: "#66C0F4", textColor: "rgba(102,192,244,0.8)" },
  google: { icon: "▶", bg: "linear-gradient(135deg,#001a08,#003318)", color: "#0ECB81", textColor: "rgba(14,203,129,0.8)" },
  googleplay: { icon: "▶", bg: "linear-gradient(135deg,#001a08,#003318)", color: "#0ECB81", textColor: "rgba(14,203,129,0.8)" },
  netflix: { icon: "🎬", bg: "linear-gradient(135deg,#1a0000,#330000)", color: "#E50914", textColor: "rgba(229,9,20,0.8)" },
  xbox: { icon: "🕹", bg: "linear-gradient(135deg,#001a00,#003300)", color: "#107C10", textColor: "rgba(16,124,16,0.8)" },
  visa: { icon: "💳", bg: "linear-gradient(135deg,#000818,#001433)", color: "#6B8AFE", textColor: "rgba(107,138,254,0.8)" },
  razergold: { icon: "⚡", bg: "linear-gradient(135deg,#001a00,#002800)", color: "#44D62C", textColor: "rgba(68,214,44,0.8)" },
};

const COUNTRY_FLAGS = {
  US: "🇺🇸",
  USA: "🇺🇸",
  UK: "🇬🇧",
  GB: "🇬🇧",
  CA: "🇨🇦",
  CAN: "🇨🇦",
  EU: "🇪🇺",
  EUR: "🇪🇺",
};

const CURRENCY_SYMBOLS = {
  USD: "$",
  GBP: "£",
  CAD: "C$",
  EUR: "€",
};

function groupGiftCards(flatCards) {
  const brandsMap = {};
  flatCards.forEach((c) => {
    const brandLower = c.brand.toLowerCase().replace(/\s+/g, "");
    const meta = BRAND_METADATA[brandLower] || {
      icon: "💳",
      bg: c.bg || "linear-gradient(135deg, #1a1a1a, #000000)",
      color: c.color || "#FFFFFF",
      textColor: "rgba(255,255,255,0.8)",
    };

    if (!brandsMap[c.brand]) {
      brandsMap[c.brand] = {
        id: brandLower,
        name: c.brand,
        icon: meta.icon,
        color: meta.color,
        bg: meta.bg,
        textColor: meta.textColor,
        countries: [],
      };
    }

    const countryCode = c.country.toUpperCase();
    const flag = COUNTRY_FLAGS[countryCode] || "🌐";
    // Deduce currency from country code
    let currency = "USD";
    if (["UK", "GB"].includes(countryCode)) currency = "GBP";
    else if (["EU", "EUR"].includes(countryCode)) currency = "EUR";
    else if (["CA", "CAN"].includes(countryCode)) currency = "CAD";

    const symbol = CURRENCY_SYMBOLS[currency] || "$";
    const denoms = Array.isArray(c.denominations)
      ? c.denominations
          .map((d) => Number(String(d).replace(/[^0-9.]/g, "")))
          .filter((d) => !isNaN(d) && d > 0)
          .sort((a, b) => a - b)
      : [25, 50, 100, 200];

    brandsMap[c.brand].countries.push({
      code: countryCode,
      flag,
      currency,
      symbol,
      rate: Number(c.rate_per_dollar) || 0,
      denoms: denoms.length > 0 ? denoms : [25, 50, 100, 200],
    });
  });
  return Object.values(brandsMap);
}

function Mark({ size = 32 }) {
  return (
    <img
      src={logoImg}
      alt="Swift Trade Logo"
      style={{
        width: size,
        height: size,
        display: "block",
        objectFit: "contain",
      }}
    />
  );
}

function ProgressBar({ step }) {
  const steps = ["Select Card", "Details", "Upload", "Confirm"];
  const MAP = { brand: 0, details: 1, upload: 2, review: 3 };
  const cur = MAP[step] ?? 0;
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

function LeftPanel({ trade }) {
  const { brand, country, denom, ngnOut } = trade;
  const showTicket = !!brand;
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
          background: `radial-gradient(circle,rgba(245,166,35,0.06),transparent 60%)`,
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />
      <div
        className="left-panel-logo"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 32,
        }}
      >
        <Mark size={32} />
        <div>
          <div
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 19,
              letterSpacing: 2,
              lineHeight: 1,
            }}
          >
            SWIFT
          </div>
          <div
            style={{
              fontSize: 7,
              color: C.amber,
              letterSpacing: 5,
              marginTop: 1,
            }}
          >
            TRADE
          </div>
        </div>
      </div>
      <div className="left-panel-title">
        <div
          style={{
            fontSize: 10,
            color: C.muted,
            letterSpacing: 3,
            marginBottom: 12,
          }}
        >
          GIFT CARDS
        </div>
        <div
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: 30,
            letterSpacing: 1,
            lineHeight: 0.9,
            marginBottom: 28,
          }}
        >
          SELL YOUR
          <br />
          CARD FOR
          <br />
          <span style={{ color: C.amber }}>NAIRA</span>
        </div>
      </div>
      {brand && (
        <div
          style={{
            borderRadius: 14,
            background: brand.bg,
            border: `1px solid ${brand.color}22`,
            padding: "18px 20px",
            marginBottom: 18,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -20,
              top: -20,
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: `${brand.color}15`,
              filter: "blur(16px)",
            }}
          />
          <div style={{ fontSize: 22, marginBottom: 10 }}>{brand.icon}</div>
          <div
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 16,
              color: "rgba(255,255,255,0.85)",
              letterSpacing: 2,
              marginBottom: 4,
            }}
          >
            {brand.name.toUpperCase()}
          </div>
          {country && denom ? (
            <>
              <div
                style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 22,
                  color: "#fff",
                  fontWeight: 500,
                  letterSpacing: 1,
                }}
              >
                {country.symbol}
                {denom}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.4)",
                  marginTop: 3,
                  letterSpacing: 1,
                }}
              >
                {country.flag} {country.currency} · GIFT CARD
              </div>
            </>
          ) : (
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.35)",
                letterSpacing: 1,
              }}
            >
              {country
                ? `${country.flag} ${country.currency}`
                : "Select denomination"}
            </div>
          )}
        </div>
      )}
      <div style={{ flex: 1 }}>
        {showTicket ? (
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
              TRADE SUMMARY
            </div>
            <div style={{ padding: "0 14px" }}>
              {[
                { label: "Card", val: brand?.name },
                {
                  label: "Country",
                  val: country ? `${country.flag} ${country.code}` : null,
                },
                {
                  label: "Amount",
                  val: country && denom ? `${country.symbol}${denom}` : null,
                },
                {
                  label: "Rate",
                  val: country
                    ? `₦${country.rate.toLocaleString()}/${country.currency}`
                    : null,
                },
                {
                  label: "You Get",
                  val: ngnOut > 0 ? `₦${ngnOut.toLocaleString()}` : null,
                  green: true,
                },
              ].map((r) => (
                <div
                  key={r.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <span style={{ fontSize: 11, color: C.muted }}>
                    {r.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "'DM Mono',monospace",
                      fontSize: 11,
                      color: r.val ? (r.green ? C.amber : "#ccc") : C.muted2,
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
              padding: "24px 16px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
              Select a gift card to see your payout
            </div>
          </div>
        )}
      </div>
      <div
        style={{
          marginTop: 20,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {[
          { color: C.amber, text: "5–15 min payout" },
          { color: C.muted, text: "Submit card image" },
          { color: C.green, text: "Best rates guaranteed" },
        ].map((t) => (
          <div
            key={t.text}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: t.color,
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 11, color: C.muted }}>{t.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepBrand({ selected, onSelect, brands }) {
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
          marginBottom: 8,
        }}
      >
        WHICH GIFT
        <br />
        <span style={{ color: C.amber }}>CARD DO YOU</span>
        <br />
        HAVE?
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
        Select the brand of your gift card.
      </p>
      <div
        className="brand-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 10,
        }}
      >
        {brands.map((b) => {
          const isSel = selected?.id === b.id;
          return (
            <button
              key={b.id}
              className={`brand-card${isSel ? " sel" : ""}`}
              onClick={() => onSelect(b)}
              style={{
                background: b.bg,
                border: `2px solid ${isSel ? b.color : b.color + "22"}`,
                borderRadius: 14,
                padding: "18px 12px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                position: "relative",
                overflow: "hidden",
                boxShadow: isSel ? `0 8px 24px ${b.color}33` : "none",
              }}
            >
              <div
                style={{ position: "absolute", inset: 0, overflow: "hidden" }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    width: "60%",
                    height: "100%",
                    background: `linear-gradient(105deg,transparent,${b.color}12,transparent)`,
                    animation: isSel
                      ? "shimmer 2s ease-in-out infinite"
                      : "none",
                  }}
                />
              </div>
              {isSel && (
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: b.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "popIn 0.2s ease",
                  }}
                >
                  <svg width={9} height={9} viewBox="0 0 9 9" fill="none">
                    <path
                      d="M1.5 4.5l2 2.5L7.5 2"
                      stroke="#000"
                      strokeWidth={1.3}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              )}
              <span style={{ fontSize: 26 }}>{b.icon}</span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.85)",
                  textAlign: "center",
                  lineHeight: 1.3,
                }}
              >
                {b.name}
              </span>
              <span
                style={{
                  fontSize: 9,
                  color: b.textColor,
                  fontFamily: "'DM Mono',monospace",
                }}
              >
                ₦{b.countries[0].rate.toLocaleString()}/$
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
function StepDetails({
  brand,
  country,
  setCountry,
  denom,
  setDenom,
  customAmt,
  setCustomAmt,
}) {
  const numAmt = parseFloat(customAmt) || 0;
  const ngnOut =
    denom > 0 && country
      ? denom * country.rate
      : numAmt > 0 && country
        ? numAmt * country.rate
        : 0;

  const handleAmtChange = (e) => {
    const v = e.target.value.replace(/[^0-9.]/g, "");
    setCustomAmt(v);
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
        STEP 2
      </div>
      <h2
        style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 42,
          letterSpacing: 1,
          lineHeight: 0.9,
          marginBottom: 8,
        }}
      >
        <span style={{ color: brand.color }}>{brand.name}</span>
        <br />
        CARD DETAILS
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
        Select the country and denomination of your card.
      </p>

      {brand.countries.length > 1 && (
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 10,
              color: C.muted,
              letterSpacing: 2,
              marginBottom: 10,
            }}
          >
            COUNTRY
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {brand.countries.map((ct) => (
              <button
                key={ct.code}
                className={`country-btn${country?.code === ct.code ? " sel" : ""}`}
                onClick={() => {
                  setCountry(ct);
                  setDenom(0);
                  setCustomAmt("");
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 16px",
                  borderRadius: 10,
                  background:
                    country?.code === ct.code
                      ? "rgba(14,203,129,0.08)"
                      : C.card2,
                  border: `1px solid ${country?.code === ct.code ? "rgba(14,203,129,0.3)" : C.border2}`,
                  color: country?.code === ct.code ? C.green : "#aaa",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "'Outfit',sans-serif",
                }}
              >
                <span style={{ fontSize: 16 }}>{ct.flag}</span>
                <span>
                  {ct.code} · {ct.currency}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {country && (
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 10,
              color: C.muted,
              letterSpacing: 2,
              marginBottom: 10,
            }}
          >
            DENOMINATION
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 8,
              marginBottom: 16,
            }}
          >
            {country.denoms.map((d) => (
              <button
                key={d}
                className={`denom-btn${denom === d ? " sel" : ""}`}
                onClick={() => {
                  setDenom(d);
                }}
                style={{
                  padding: "14px 8px",
                  borderRadius: 10,
                  cursor: "pointer",
                  background: denom === d ? "rgba(14,203,129,0.1)" : C.card2,
                  border: `1px solid ${denom === d ? "rgba(14,203,129,0.35)" : C.border2}`,
                  color: denom === d ? C.green : "#aaa",
                  fontFamily: "'DM Mono',monospace",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 500 }}>
                  {country.symbol}
                  {d}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: denom === d ? C.green : C.muted,
                  }}
                >
                  ₦{(d * country.rate).toLocaleString()}
                </span>
              </button>
            ))}
          </div>

          <div
            style={{
              fontSize: 10,
              color: C.muted,
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            OR ENTER CUSTOM AMOUNT
          </div>
          <div className="custom-amt-wrapper">
            <span className="custom-amt-symbol">{country.symbol}</span>
            <input
              className="custom-amt-input"
              type="text"
              inputMode="decimal"
              value={customAmt}
              onChange={handleAmtChange}
              placeholder="0"
            />
          </div>
        </div>
      )}

      {ngnOut > 0 && (
        <div
          style={{
            background: "rgba(245,166,35,0.06)",
            border: "1px solid rgba(245,166,35,0.15)",
            borderRadius: 12,
            padding: "14px 18px",
            marginBottom: 20,
          }}
        >
          {[
            ["Rate", `₦${country.rate.toLocaleString()} / ${country.currency}`],
            ["Card Value", `${country.symbol}${denom || customAmt}`],
            ["You Receive", `₦${ngnOut.toLocaleString()}`],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 12, color: C.muted }}>{k}</span>
              <span
                style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 13,
                  color: k === "You Receive" ? C.amber : "#bbb",
                  fontWeight: k === "You Receive" ? 600 : 400,
                }}
              >
                {v}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StepUpload({ image, setImage, cardCode, setCardCode }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) =>
      setImage({ file, preview: e.target.result, name: file.name });
    reader.readAsDataURL(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  };
  // me sjjsj
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
          marginBottom: 8,
        }}
      >
        UPLOAD YOUR
        <br />
        <span style={{ color: C.amber }}>CARD IMAGE</span>
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
        Take a clear photo of the card showing the code and denomination.
      </p>

      {!image ? (
        <div
          className={`upload-zone${drag ? " drag" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${drag ? "rgba(14,203,129,0.6)" : C.border2}`,
            borderRadius: 14,
            padding: "52px 24px",
            textAlign: "center",
            cursor: "pointer",
            marginBottom: 20,
            background: drag ? "rgba(14,203,129,0.04)" : "transparent",
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <div
            style={{
              fontSize: 40,
              marginBottom: 14,
              animation: "bounce 2s ease-in-out infinite",
            }}
          >
            📸
          </div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 500,
              marginBottom: 6,
              color: "#ccc",
            }}
          >
            {drag ? "Drop it here!" : "Tap to upload card image"}
          </div>
          <div style={{ fontSize: 12, color: C.muted }}>
            JPG, PNG or HEIC · Max 10MB
          </div>
        </div>
      ) : (
        <div
          style={{
            position: "relative",
            marginBottom: 20,
            borderRadius: 14,
            overflow: "hidden",
            border: `1px solid rgba(14,203,129,0.25)`,
          }}
        >
          <img
            src={image.preview}
            alt="Card"
            style={{
              width: "100%",
              maxHeight: 220,
              objectFit: "cover",
              display: "block",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(transparent 60%,rgba(0,0,0,0.8))",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 12,
              left: 16,
              right: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#fff" }}>
                {image.name}
              </div>
              <div style={{ fontSize: 10, color: C.green, marginTop: 2 }}>
                ✓ Image uploaded
              </div>
            </div>
            <button
              onClick={() => setImage(null)}
              style={{
                background: "rgba(246,70,93,0.15)",
                border: "1px solid rgba(246,70,93,0.3)",
                color: C.red,
                fontSize: 11,
                padding: "5px 12px",
                borderRadius: 8,
                cursor: "pointer",
                fontFamily: "'Outfit',sans-serif",
                fontWeight: 500,
              }}
            >
              Remove
            </button>
          </div>
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontSize: 10,
            color: C.muted,
            letterSpacing: 2,
            marginBottom: 8,
          }}
        >
          CARD CODE <span style={{ color: C.muted2 }}>(OPTIONAL)</span>
        </div>
        <input
          className="st-input"
          value={cardCode}
          onChange={(e) => setCardCode(e.target.value.toUpperCase())}
          placeholder="XXXX-XXXX-XXXX-XXXX"
          style={{
            width: "100%",
            boxSizing: "border-box",
            background: C.card2,
            border: `1px solid ${C.border2}`,
            borderRadius: 10,
            padding: "12px 14px",
            color: "#fff",
            fontFamily: "'DM Mono',monospace",
            fontSize: 15,
            letterSpacing: 2,
          }}
        />
        <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>
          Including the code speeds up verification.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "flex-start",
          background: "rgba(245,166,35,0.05)",
          border: "1px solid rgba(245,166,35,0.12)",
          borderRadius: 10,
          padding: "11px 14px",
        }}
      >
        <svg
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill="none"
          stroke={C.amber}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0, marginTop: 1 }}
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
          Make sure the card code and amount are clearly visible. Blurry images
          may delay verification.
        </span>
      </div>
    </div>
  );
}

function StepReview({ trade, onSubmit, loading, uploadProgress, submitError }) {
  const { brand, country, denom, customAmt, ngnOut, image, cardCode } = trade;
  const val = denom || customAmt;
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
        STEP 4
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
        CONFIRM &<br />
        <span style={{ color: C.amber }}>SUBMIT</span>
      </h2>
      <div
        style={{
          background: brand.bg,
          border: `1px solid ${brand.color}22`,
          borderRadius: 14,
          padding: "18px 20px",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 16,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -20,
            top: -20,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: `${brand.color}15`,
            filter: "blur(16px)",
          }}
        />
        <span style={{ fontSize: 32, flexShrink: 0 }}>{brand.icon}</span>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 18,
              letterSpacing: 1,
              marginBottom: 4,
            }}
          >
            {brand.name}
          </div>
          <div
            style={{
              fontFamily: "'DM Mono',monospace",
              fontSize: 22,
              color: "#fff",
              fontWeight: 500,
            }}
          >
            {country.symbol}
            {val}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.4)",
              marginTop: 2,
            }}
          >
            {country.flag} {country.code} Gift Card
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: 10,
              color: C.amber,
              letterSpacing: 2,
              marginBottom: 4,
            }}
          >
            YOU RECEIVE
          </div>
          <div
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 28,
              color: C.amber,
              letterSpacing: 1,
            }}
          >
            ₦{ngnOut.toLocaleString()}
          </div>
        </div>
      </div>
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 16,
        }}
      >
        {[
          ["Brand", brand.name],
          ["Country", `${country.flag} ${country.code}`],
          ["Amount", `${country.symbol}${val}`],
          ["Rate", `₦${country.rate.toLocaleString()} / ${country.currency}`],
          ["You Receive", `₦${ngnOut.toLocaleString()}`],
          ["Card Code", cardCode || "Not provided"],
          ["Image", image ? `✓ ${image.name}` : "Not uploaded"],
        ].map(([k, v]) => (
          <div
            key={k}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "11px 16px",
              borderBottom: `1px solid ${C.border}`,
              background:
                k === "You Receive" ? "rgba(245,166,35,0.04)" : "transparent",
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: k === "You Receive" ? C.amber : C.muted,
              }}
            >
              {k}
            </span>
            <span
              style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: 12,
                color:
                  k === "You Receive"
                    ? C.amber
                    : k === "Image" && image
                      ? C.green
                      : "#ccc",
                fontWeight: k === "You Receive" ? 600 : 400,
              }}
            >
              {v}
            </span>
          </div>
        ))}
      </div>
      {submitError && (
        <div
          style={{
            background: "rgba(246,70,93,0.1)",
            border: "1px solid rgba(246,70,93,0.3)",
            borderRadius: 10,
            padding: "11px 14px",
            marginBottom: 12,
            fontSize: 13,
            color: C.red,
          }}
        >
          ⚠ {submitError}
        </div>
      )}
      <button
        onClick={onSubmit}
        disabled={loading}
        className="pri-btn"
        style={{
          width: "100%",
          background: C.amber,
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
          position: "relative",
          overflow: "hidden",
        }}
      >
        {loading && uploadProgress > 0 && uploadProgress < 100 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${uploadProgress}%`,
              background: "rgba(0,0,0,0.15)",
              transition: "width 0.3s ease",
            }}
          />
        )}
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
            {uploadProgress > 0 && uploadProgress < 75
              ? `Uploading… ${uploadProgress}%`
              : uploadProgress >= 75
                ? "Submitting…"
                : "Processing…"}
          </>
        ) : (
          "Submit Gift Card ✓"
        )}
      </button>
    </div>
  );
}

function StepDone({ trade, refId, onReset }) {
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
            border: `2px solid rgba(245,166,35,0.4)`,
            animation: "ripple 0.8s ease-out",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: -8,
            borderRadius: "50%",
            border: `2px solid rgba(245,166,35,0.2)`,
            animation: "ripple 0.8s 0.25s ease-out",
          }}
        />
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "rgba(245,166,35,0.1)",
            border: `2px solid ${C.amber}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "successIn 0.5s ease",
            boxShadow: `0 0 40px rgba(245,166,35,0.2)`,
          }}
        >
          <svg width={40} height={40} viewBox="0 0 40 40" fill="none">
            <path
              d="M8 20l8 9L32 12"
              stroke={C.amber}
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
          marginBottom: 16,
        }}
      >
        CARD SUBMITTED
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
        CARD RECEIVED.
        <br />
        <span style={{ color: C.amber }}>VERIFYING NOW.</span>
      </h2>
      <p
        style={{
          color: C.muted,
          fontSize: 14,
          lineHeight: 1.7,
          maxWidth: 340,
          margin: "0 auto 24px",
        }}
      >
        Your {trade.brand.name} {trade.country.symbol}
        {trade.denom || trade.customAmt} card is being verified. Once approved,{" "}
        <span style={{ color: C.amber, fontWeight: 600 }}>
          ₦{trade.ngnOut.toLocaleString()}
        </span>{" "}
        will be credited within 5–15 minutes.
      </p>
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: "16px 20px",
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
            fontSize: 20,
            color: C.amber,
            fontWeight: 500,
            marginBottom: 4,
          }}
        >
          {refId}
        </div>
        <div style={{ fontSize: 11, color: C.muted }}>
          Use this to follow up with support if needed
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <button
          onClick={onReset}
          style={{
            background: C.amber,
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
          Sell Another
        </button>
        <Link
          to="/dashboard"
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          Dashboard →
        </Link>
      </div>
    </div>
  );
}

export default function GiftCardsDashboard() {
  const [step, setStep] = useState("brand");
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [trade, setTrade] = useState({
    brand: null,
    country: null,
    denom: 0,
    customAmt: "",
    image: null,
    cardCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitError, setSubmitError] = useState("");
  const [refId, setRefId] = useState("");
  const { setIsMobileOpen } = useOutletContext() || {};

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  // Fetch gift card rates from backend
  useEffect(() => {
    const fetchGiftCards = async () => {
      try {
        const res = await api.get("/rates/giftcards");
        const grouped = groupGiftCards(res.data);
        setBrands(grouped);
      } catch (err) {
        console.error("Error loading gift cards:", err);
      } finally {
        setLoadingBrands(false);
      }
    };
    fetchGiftCards();
  }, []);

  const upd = (patch) => setTrade((t) => ({ ...t, ...patch }));

  useEffect(() => {
    if (trade.brand)
      upd({ country: trade.brand.countries[0], denom: 0, customAmt: "" });
  }, [trade.brand?.id]);

  const val = trade.denom > 0 ? trade.denom : parseFloat(trade.customAmt) || 0;
  const ngnOut = trade.country && val > 0 ? val * trade.country.rate : 0;
  const ORDER = ["brand", "details", "upload", "review", "done"];

  const canNext = () => {
    if (step === "brand") return !!trade.brand;
    if (step === "details")
      return (
        !!trade.country && (trade.denom > 0 || parseFloat(trade.customAmt) > 0)
      );
    if (step === "upload") return !!trade.image;
    if (step === "review") return true;
    return false;
  };

  const next = () => {
    const i = ORDER.indexOf(step);
    if (i < ORDER.length - 1) setStep(ORDER[i + 1]);
  };
  const back = () => {
    const i = ORDER.indexOf(step);
    if (i > 0) setStep(ORDER[i - 1]);
  };

  const handleSubmit = async () => {
    setSubmitError("");
    setLoading(true);
    setUploadProgress(0);
    try {
      // 1. Upload image to Cloudinary
      setUploadProgress(5);
      const imageUrl = await uploadToCloudinary(trade.image.file, (pct) =>
        setUploadProgress(Math.round(pct * 0.7)) // 0–70%
      );
      setUploadProgress(75);

      // 2. Submit to backend
      const res = await api.post("/rates/sell/", {
        brand: trade.brand.name,
        country_code: trade.country.code,
        currency_symbol: trade.country.symbol,
        denomination: val,
        rate_applied: trade.country.rate,
        ngn_payout: ngnOut,
        image_url: imageUrl,
        card_code: trade.cardCode,
      });
      setUploadProgress(100);
      setRefId(res.data.reference || "GC-" + Math.floor(1000 + Math.random() * 9000));
      setStep("done");
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || "Something went wrong. Please try again.";
      setSubmitError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("brand");
    setTrade({
      brand: null,
      country: null,
      denom: 0,
      customAmt: "",
      image: null,
      cardCode: "",
    });
    setRefId("");
  };

  return (
    <div className="giftcards-container">
      <LeftPanel trade={{ ...trade, ngnOut }} />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          minWidth: 0,
        }}
      >
        <div
          className="giftcards-topbar"
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
          <div>
            {step !== "brand" && step !== "done" && (
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
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => setIsMobileOpen?.(true)}
              style={{
                display: "none",
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
              }}
              className="mobile-toggle"
            >
              <svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: C.amber,
                  animation: "pulse 2s infinite",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 9,
                  color: C.amber,
                }}
              >
                BEST RATES
              </span>
            </div>
          </div>
        </div>

        <div className="form-area">
          <div style={{ maxWidth: 580, margin: "0 auto" }}>
            {step !== "done" && <ProgressBar step={step} />}

            {loadingBrands ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    border: "2.5px solid rgba(245,166,35,0.2)",
                    borderTopColor: C.amber,
                    animation: "spin 0.8s linear infinite",
                  }}
                />
              </div>
            ) : step === "brand" ? (
              <StepBrand
                brands={brands}
                selected={trade.brand}
                onSelect={(b) => upd({ brand: b })}
              />
            ) : null}
            {step === "details" && (
              <StepDetails
                brand={trade.brand}
                country={trade.country}
                setCountry={(ct) =>
                  upd({ country: ct, denom: 0, customAmt: "" })
                }
                denom={trade.denom}
                setDenom={(d) => upd({ denom: d, customAmt: "" })}
                customAmt={trade.customAmt}
                setCustomAmt={(v) => upd({ customAmt: v, denom: 0 })}
              />
            )}
            {step === "upload" && (
              <StepUpload
                image={trade.image}
                setImage={(img) => upd({ image: img })}
                cardCode={trade.cardCode}
                setCardCode={(v) => upd({ cardCode: v })}
              />
            )}
            {step === "review" && (
              <StepReview
                trade={{ ...trade, ngnOut }}
                onSubmit={handleSubmit}
                loading={loading}
                uploadProgress={uploadProgress}
                submitError={submitError}
              />
            )}
            {step === "done" && (
              <StepDone
                trade={{ ...trade, ngnOut }}
                refId={refId}
                onReset={handleReset}
              />
            )}

            {step !== "review" && step !== "done" && (
              <div style={{ marginTop: 24 }}>
                <button
                  disabled={!canNext()}
                  onClick={next}
                  className="pri-btn"
                  style={{
                    width: "100%",
                    background: canNext() ? C.amber : C.border,
                    color: canNext() ? "#000" : C.muted,
                    fontWeight: 700,
                    fontSize: 15,
                    padding: "15px",
                    borderRadius: 12,
                    border: "none",
                    fontFamily: "'Outfit',sans-serif",
                  }}
                >
                  Continue →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
