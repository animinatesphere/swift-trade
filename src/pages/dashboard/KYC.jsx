import { useState, useEffect, useRef } from "react";
import api from "../../api/axios";
import {
  compressImageForKYC,
  validateImageFile,
} from "../../utils/imageCompression";

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

// ── Cloudinary config ─────────────────────────────────────
// Unsigned upload preset for KYC documents (no API secret exposed)
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dbhelafgg";
const UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "swiftrade-app";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing:border-box; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.7)} }
  @keyframes shimmer  { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  @keyframes ripple   { from{transform:scale(1);opacity:0.6} to{transform:scale(1.8);opacity:0} }
  @keyframes checkDraw { to{stroke-dashoffset:0} }

  .kyc-card { animation:fadeUp 0.4s ease both; }

  .doc-btn { transition:all 0.18s; border:1px solid #1a1a1a; cursor:pointer; padding:12px 8px; }
  .doc-btn:hover { border-color:#333 !important; background:#181818 !important; }
  .doc-btn:active { transform: scale(0.98); }
  .doc-btn.selected { border-color:rgba(14,203,129,0.4) !important; background:rgba(14,203,129,0.07) !important; }

  .kyc-input { transition:border-color 0.2s; -webkit-appearance:none; appearance:none; font-size:16px; }
  .kyc-input:focus { outline:none; border-color:rgba(14,203,129,0.5) !important; }
  .kyc-input::placeholder { color:#333; }

  .drop-zone { transition:all 0.2s; min-height:120px; }
  .drop-zone.drag-over { border-color:rgba(14,203,129,0.5) !important; background:rgba(14,203,129,0.04) !important; }

  .submit-btn { transition:all 0.2s; min-height:50px; font-size:16px; -webkit-appearance:none; }
  .submit-btn:active:not(:disabled) { transform:scale(0.98); }
  .submit-btn:hover:not(:disabled) { background:#0fdf8e !important; transform:translateY(-1px); box-shadow:0 10px 28px rgba(14,203,129,0.3) !important; }
  .submit-btn:disabled { opacity:0.38; cursor:not-allowed; }

  .status-shimmer {
    background: linear-gradient(90deg, #141414 25%, #1a1a1a 50%, #141414 75%);
    background-size: 400px 100%;
    animation: shimmer 1.2s infinite;
    border-radius: 8px;
  }

  /* ── Mobile Responsiveness ── */
  @media (max-width: 768px) {
    .kyc-card { margin-left: -8px; margin-right: -8px; }
    
    /* Adjust padding for mobile */
    body { padding: 0; }
    
    /* Better touch targets for mobile */
    .doc-btn { padding: 14px 10px; min-height: 48px; display: flex; justify-content: center; align-items: center; }
    .submit-btn { min-height: 48px; padding: 14px !important; font-size: 15px; }
    
    /* Better spacing on mobile */
    .drop-zone { padding: 20px 16px !important; min-height: 140px; }
    
    /* Responsive grid for document types */
    .doc-type-grid { grid-template-columns: repeat(auto-fit, minmax(90px, 1fr)) !important; gap: 12px !important; }
  }

  @media (max-width: 480px) {
    /* Extra small screens */
    .kyc-card { max-width: 100% !important; margin: 0 !important; }
    
    /* Larger text for readability */
    .kyc-input { font-size: 16px; padding: 14px 12px !important; }
    .submit-btn { font-size: 14px; padding: 12px !important; }
    
    /* Stack layout vertically */
    .doc-btn { padding: 12px 8px; font-size: 10px; }
    
    /* Better touch spacing */
    .drop-zone { padding: 16px 12px !important; min-height: 130px; }
    
    /* Responsive SVG sizes */
    svg { max-width: 100%; height: auto; }
    
    /* Text sizes */
    h1 { font-size: 24px !important; }
    h2 { font-size: 20px !important; }
    
    /* Better info boxes on mobile */
    .info-box { padding: 12px 10px !important; gap: 8px !important; margin-bottom: 12px !important; }
  }

  @media (max-width: 360px) {
    /* Ultra small screens (iPhone SE, etc) */
    .kyc-input { font-size: 16px; padding: 12px 10px !important; }
    .submit-btn { font-size: 13px; }
    .doc-btn { padding: 10px 6px; font-size: 9px; gap: 4px !important; }
  }
`;

// ── Status badge config ────────────────────────────────────
const STATUS_CONFIG = {
  unverified: {
    color: C.muted,
    bg: "rgba(85,85,85,0.1)",
    border: "rgba(85,85,85,0.25)",
    label: "Unverified",
    icon: null,
  },
  submitted: {
    color: C.amber,
    bg: "rgba(245,166,35,0.08)",
    border: "rgba(245,166,35,0.25)",
    label: "Under Review",
    icon: null,
  },
  rejected: {
    color: C.red,
    bg: "rgba(246,70,93,0.08)",
    border: "rgba(246,70,93,0.25)",
    label: "Rejected",
    icon: null,
  },
  verified: {
    color: C.green,
    bg: "rgba(14,203,129,0.08)",
    border: "rgba(14,203,129,0.25)",
    label: "Verified",
    icon: null,
  },
};

const DOC_TYPES = [
  {
    value: "nin",
    label: "NIN",
    desc: "National ID Number",
    icon: (
      <svg
        width={18}
        height={18}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
      >
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    value: "bvn",
    label: "BVN",
    desc: "Bank Verification No.",
    icon: (
      <svg
        width={18}
        height={18}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
      >
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8" cy="10" r="2" />
        <line x1="13" y1="9" x2="18" y2="9" />
        <line x1="13" y1="12" x2="18" y2="12" />
        <line x1="5" y1="16" x2="19" y2="16" />
      </svg>
    ),
  },
  {
    value: "drivers_license",
    label: "Driver's License",
    desc: "Valid driver's license",
    icon: (
      <svg
        width={18}
        height={18}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <circle cx="9" cy="12" r="2" />
        <line x1="13" y1="10" x2="18" y2="10" />
        <line x1="13" y1="14" x2="16" y2="14" />
      </svg>
    ),
  },
];

// ── Spinner ────────────────────────────────────────────────
function Spinner({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      style={{ animation: "spin 0.8s linear infinite" }}
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

// ── Verified shield ────────────────────────────────────────
function VerifiedShield() {
  return (
    <div
      style={{
        position: "relative",
        width: 90,
        height: 90,
        margin: "0 auto 24px",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -10,
          borderRadius: "50%",
          border: "2px solid rgba(14,203,129,0.2)",
          animation: "ripple 2s ease-out infinite",
        }}
      />
      <div
        style={{
          width: 90,
          height: 90,
          background:
            "linear-gradient(135deg,rgba(14,203,129,0.15),rgba(14,203,129,0.05))",
          border: "1px solid rgba(14,203,129,0.35)",
          borderRadius: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 40px rgba(14,203,129,0.15)",
        }}
      >
        <svg
          width={40}
          height={40}
          viewBox="0 0 24 24"
          fill="none"
          stroke={C.green}
          strokeWidth={1.5}
          strokeLinecap="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline
            points="9 12 11 14 15 10"
            strokeDasharray={20}
            style={{
              animation: "checkDraw 0.6s 0.2s ease forwards",
              strokeDashoffset: 20,
            }}
          />
        </svg>
      </div>
    </div>
  );
}

// ── Pending illustration ───────────────────────────────────
function PendingClock() {
  return (
    <div
      style={{
        position: "relative",
        width: 90,
        height: 90,
        margin: "0 auto 24px",
      }}
    >
      <div
        style={{
          width: 90,
          height: 90,
          background:
            "linear-gradient(135deg,rgba(245,166,35,0.12),rgba(245,166,35,0.04))",
          border: "1px solid rgba(245,166,35,0.3)",
          borderRadius: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 40px rgba(245,166,35,0.1)",
        }}
      >
        <svg
          width={40}
          height={40}
          viewBox="0 0 24 24"
          fill="none"
          stroke={C.amber}
          strokeWidth={1.5}
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
    </div>
  );
}

// ── Rejected icon ──────────────────────────────────────────
function RejectedIcon() {
  return (
    <div
      style={{
        width: 90,
        height: 90,
        margin: "0 auto 24px",
        background:
          "linear-gradient(135deg,rgba(246,70,93,0.12),rgba(246,70,93,0.04))",
        border: "1px solid rgba(246,70,93,0.3)",
        borderRadius: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 40px rgba(246,70,93,0.1)",
      }}
    >
      <svg
        width={40}
        height={40}
        viewBox="0 0 24 24"
        fill="none"
        stroke={C.red}
        strokeWidth={1.5}
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    </div>
  );
}

// ── File drop zone ─────────────────────────────────────────
function DropZone({
  file,
  onChange,
  capture,
  primaryText = "Drag & drop your document image here",
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) onChange(f);
  };

  return (
    <div
      className={`drop-zone${dragging ? " drag-over" : ""}`}
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      style={{
        border: `2px dashed ${file ? "rgba(14,203,129,0.4)" : C.border2}`,
        borderRadius: 12,
        padding: "clamp(16px, 4vw, 24px) clamp(14px, 3vw, 20px)",
        textAlign: "center",
        cursor: "pointer",
        background: file ? "rgba(14,203,129,0.03)" : "#090909",
        transition: "all 0.2s",
        minHeight: "clamp(100px, 30vw, 200px)",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture={capture}
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files[0]) onChange(e.target.files[0]);
        }}
      />

      {file ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            justifyContent: "center",
          }}
        >
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            style={{
              width: 56,
              height: 56,
              borderRadius: capture ? "50%" : 8,
              objectFit: "cover",
              border: `1px solid rgba(14,203,129,0.3)`,
            }}
          />
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>
              {file.name}
            </div>
            <div style={{ fontSize: 11, color: C.green, marginTop: 2 }}>
              {(file.size / 1024).toFixed(1)} KB · Click to change
            </div>
          </div>
        </div>
      ) : (
        <>
          <div
            style={{
              marginBottom: 10,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <svg
              width={32}
              height={32}
              viewBox="0 0 24 24"
              fill="none"
              stroke={C.muted}
              strokeWidth={1.5}
              strokeLinecap="round"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>
            {primaryText}
          </div>
          <div style={{ fontSize: 11, color: C.muted }}>
            or click to browse · JPG, PNG, WEBP
          </div>
        </>
      )}
    </div>
  );
}

// ── Step 1: ID verification form ───────────────────────────
function IdVerificationForm({ defaultDocType, onVerified }) {
  const [docType, setDocType] = useState(defaultDocType || "nin");
  const [docNumber, setDocNumber] = useState("");
  const [dob, setDob] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    const trimmedNum = docNumber.trim();
    if (docType === "nin" || docType === "bvn") {
      if (trimmedNum.length !== 11 || !/^\d+$/.test(trimmedNum)) {
        return setError(`Please enter a valid 11-digit ${docType.toUpperCase()}.`);
      }
    } else if (!trimmedNum || trimmedNum.length < 5) {
      return setError("Please enter a valid ID number (at least 5 characters).");
    }
    if (docType === "drivers_license") {
      if (!dob) return setError("Please enter your date of birth.");
      if (!firstName.trim() || !lastName.trim())
        return setError("Please enter your first and last name.");
    }

    setLoading(true);
    try {
      const payload = {
        document_type: docType,
        document_number: docNumber.trim(),
      };
      if (docType === "drivers_license") {
        payload.date_of_birth = dob;
        payload.first_name = firstName.trim();
        payload.last_name = lastName.trim();
      }
      const { data } = await api.post("/kyc/verify-id", payload);
      onVerified({
        docType,
        docNumber: docNumber.trim(),
        verifiedName: data.verified_name,
      });
    } catch (submitErr) {
      const msg =
        submitErr.response?.data?.detail ||
        submitErr.response?.data?.message ||
        "ID verification failed. Please check your details and try again.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      {/* Document type */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontSize: "clamp(9px, 2vw, 10px)",
            color: C.muted,
            letterSpacing: 2,
            marginBottom: 10,
          }}
        >
          ID TYPE
        </div>
        <div
          className="doc-type-grid"
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(clamp(90px, 25%, 120px), 1fr))",
            gap: "clamp(8px, 2vw, 8px)",
          }}
        >
          {DOC_TYPES.map((d) => (
            <button
              key={d.value}
              className={`doc-btn${docType === d.value ? " selected" : ""}`}
              onClick={() => {
                setDocType(d.value);
                setError("");
              }}
              style={{
                background:
                  docType === d.value ? "rgba(14,203,129,0.07)" : C.card2,
                borderRadius: 10,
                padding: "12px 8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                color: docType === d.value ? C.green : C.muted,
              }}
            >
              {d.icon}
              <span
                style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.5 }}
              >
                {d.label}
              </span>
              <span
                style={{
                  fontSize: 9,
                  color:
                    docType === d.value ? "rgba(14,203,129,0.7)" : C.muted2,
                  letterSpacing: 0.5,
                }}
              >
                {d.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Document number */}
      <div style={{ marginBottom: 16 }}>
        <label
          style={{
            display: "block",
            fontSize: 10,
            color: C.muted,
            letterSpacing: 2,
            marginBottom: 8,
          }}
        >
          {docType === "bvn" ? "BVN" : docType === "nin" ? "NIN" : "LICENSE NUMBER"}
        </label>
        <input
          className="kyc-input"
          value={docNumber}
          onChange={(e) => {
            setDocNumber(e.target.value);
            setError("");
          }}
          placeholder={
            docType === "nin"
              ? "e.g. 12345678901"
              : docType === "bvn"
                ? "e.g. 22345678901"
                : "e.g. ABC123456"
          }
          style={{
            width: "100%",
            background: "#0a0a0a",
            border: `1px solid ${C.border2}`,
            borderRadius: 10,
            padding: "clamp(12px, 3vw, 12px) clamp(12px, 3vw, 14px)",
            color: C.text,
            fontSize: 16,
            fontFamily: "'DM Mono',monospace",
          }}
        />
      </div>

      {/* Driver's license extra fields */}
      {docType === "drivers_license" && (
        <div style={{ marginBottom: 16, animation: "fadeIn 0.2s ease" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 10,
                  color: C.muted,
                  letterSpacing: 2,
                  marginBottom: 8,
                }}
              >
                FIRST NAME
              </label>
              <input
                className="kyc-input"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setError("");
                }}
                placeholder="John"
                style={{
                  width: "100%",
                  background: "#0a0a0a",
                  border: `1px solid ${C.border2}`,
                  borderRadius: 10,
                  padding: "12px 14px",
                  color: C.text,
                  fontSize: 14,
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 10,
                  color: C.muted,
                  letterSpacing: 2,
                  marginBottom: 8,
                }}
              >
                LAST NAME
              </label>
              <input
                className="kyc-input"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setError("");
                }}
                placeholder="Doe"
                style={{
                  width: "100%",
                  background: "#0a0a0a",
                  border: `1px solid ${C.border2}`,
                  borderRadius: 10,
                  padding: "12px 14px",
                  color: C.text,
                  fontSize: 14,
                }}
              />
            </div>
          </div>
          <label
            style={{
              display: "block",
              fontSize: 10,
              color: C.muted,
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            DATE OF BIRTH
          </label>
          <input
            className="kyc-input"
            type="date"
            value={dob}
            onChange={(e) => {
              setDob(e.target.value);
              setError("");
            }}
            style={{
              width: "100%",
              background: "#0a0a0a",
              border: `1px solid ${C.border2}`,
              borderRadius: 10,
              padding: "12px 14px",
              color: C.text,
              fontSize: 14,
              fontFamily: "'DM Mono',monospace",
            }}
          />
        </div>
      )}

      {/* Info note */}
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
          background: "rgba(59,130,246,0.04)",
          border: "1px solid rgba(59,130,246,0.12)",
          borderRadius: 10,
          padding: "11px 13px",
          marginBottom: 18,
        }}
      >
        <svg
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill="none"
          stroke={C.blue}
          strokeWidth={2}
          strokeLinecap="round"
          style={{ flexShrink: 0, marginTop: 1 }}
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span style={{ fontSize: 11, color: "#666", lineHeight: 1.6 }}>
          We'll verify your ID number instantly. No document photos required —
          just a selfie in the next step.
        </span>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
            background: "rgba(246,70,93,0.06)",
            border: "1px solid rgba(246,70,93,0.2)",
            borderRadius: 10,
            padding: "10px 13px",
            marginBottom: 16,
            animation: "fadeIn 0.2s ease",
          }}
        >
          <svg
            width={14}
            height={14}
            viewBox="0 0 24 24"
            fill="none"
            stroke={C.red}
            strokeWidth={2}
            strokeLinecap="round"
            style={{ flexShrink: 0, marginTop: 1 }}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span style={{ fontSize: 12, color: C.red, lineHeight: 1.5 }}>
            {error}
          </span>
        </div>
      )}

      {/* Submit */}
      <button
        className="submit-btn"
        disabled={loading}
        onClick={handleSubmit}
        style={{
          width: "100%",
          background: C.green,
          color: "#000",
          fontWeight: 700,
          fontSize: "clamp(14px, 3vw, 14px)",
          padding: "clamp(12px, 3vw, 14px)",
          borderRadius: 10,
          border: "none",
          fontFamily: "'Outfit',sans-serif",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          minHeight: 48,
        }}
      >
        {loading ? (
          <>
            <Spinner size={15} /> Verifying ID...
          </>
        ) : (
          "Verify ID →"
        )}
      </button>
    </div>
  );
}

// ── Intermediary: confirm verified name ────────────────────
function ConfirmNameStep({ verifiedName, onConfirm, onReject }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "12px 0",
        animation: "fadeUp 0.4s ease",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          margin: "0 auto 20px",
          background:
            "linear-gradient(135deg,rgba(14,203,129,0.12),rgba(14,203,129,0.04))",
          border: "1px solid rgba(14,203,129,0.3)",
          borderRadius: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width={32}
          height={32}
          viewBox="0 0 24 24"
          fill="none"
          stroke={C.green}
          strokeWidth={1.6}
          strokeLinecap="round"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21v-1a6 6 0 016-6h4a6 6 0 016 6v1" />
        </svg>
      </div>
      <div
        style={{
          fontSize: 11,
          color: C.muted,
          letterSpacing: 2,
          marginBottom: 8,
        }}
      >
        ID VERIFIED — IS THIS YOU?
      </div>
      <h2
        style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: "clamp(24px, 6vw, 30px)",
          letterSpacing: 1,
          color: C.text,
          marginBottom: 24,
          wordBreak: "break-word",
        }}
      >
        {verifiedName || "Unknown"}
      </h2>
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={onReject}
          style={{
            flex: 1,
            background: "transparent",
            border: `1px solid ${C.border2}`,
            color: C.muted,
            fontWeight: 600,
            fontSize: 13,
            padding: "13px",
            borderRadius: 10,
            cursor: "pointer",
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          No, edit details
        </button>
        <button
          className="submit-btn"
          onClick={onConfirm}
          style={{
            flex: 1,
            background: C.green,
            color: "#000",
            fontWeight: 700,
            fontSize: 13,
            padding: "13px",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          Yes, continue →
        </button>
      </div>
    </div>
  );
}

// ── Step 2: Selfie & liveness check ────────────────────────
function SelfieStep({ onApproved, onPendingReview }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [remainingAttempts, setRemainingAttempts] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!file) return setError("Please take or upload a selfie.");

    const validation = validateImageFile(file);
    if (!validation.valid) return setError(validation.error);

    setLoading(true);

    // Step 0: Compress image (client-side)
    let compressedFile = file;
    try {
      setUploading(true);
      setUploadProgress(5);
      compressedFile = await compressImageForKYC(file);
      setUploadProgress(15);
    } catch (_err) {
      setUploading(false);
      setLoading(false);
      return setError(
        "Image compression failed. Please try a different image.",
      );
    }

    // Step 1: Upload compressed selfie to Cloudinary
    let selfieUrl = "";
    try {
      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("upload_preset", UPLOAD_PRESET);

      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      );

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const uploadPercent = Math.round((e.loaded / e.total) * 75);
          setUploadProgress(15 + uploadPercent);
        }
      };

      const cloudRes = await new Promise((resolve, reject) => {
        xhr.onload = () => resolve(JSON.parse(xhr.responseText));
        xhr.onerror = () => reject(new Error("Upload to Cloudinary failed"));
        xhr.send(formData);
      });

      if (!cloudRes.secure_url)
        throw new Error("Failed to get secure URL from Cloudinary.");
      selfieUrl = cloudRes.secure_url;
      setUploadProgress(95);
    } catch (err) {
      setUploading(false);
      setLoading(false);
      return setError(
        `Selfie upload failed: ${err.message}. Please try again.`,
      );
    }

    // Step 2: Submit selfie to backend for liveness + face match
    try {
      setUploadProgress(98);
      const { data } = await api.post("/kyc/verify-selfie", {
        selfie_url: selfieUrl,
      });
      setUploadProgress(100);

      if (data.status === "verified") {
        onApproved();
        return;
      }

      // Face match / liveness failed
      const attemptsLeft = data.remaining_attempts ?? 0;
      setRemainingAttempts(attemptsLeft);
      if (attemptsLeft <= 0) {
        onPendingReview();
        return;
      }
      setFile(null);
      setError(
        data.message ||
          "Face match failed. Please take a clearer selfie in good lighting.",
      );
    } catch (submitErr) {
      const respData = submitErr.response?.data;
      if (respData?.remaining_attempts !== undefined) {
        const attemptsLeft = respData.remaining_attempts;
        setRemainingAttempts(attemptsLeft);
        if (attemptsLeft <= 0) {
          onPendingReview();
          return;
        }
        setFile(null);
      }
      const msg =
        respData?.message ||
        respData?.detail ||
        "Face match failed. Please take a clearer selfie in good lighting.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setUploading(false);
      setLoading(false);
    }
  };

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div style={{ marginBottom: 20 }}>
        <label
          style={{
            display: "block",
            fontSize: 10,
            color: C.muted,
            letterSpacing: 2,
            marginBottom: 8,
          }}
        >
          TAKE A SELFIE
        </label>
        <DropZone
          file={file}
          onChange={(f) => {
            setFile(f);
            setError("");
          }}
          capture="user"
          primaryText="Tap to take a selfie or upload a photo"
        />

        {uploading && (
          <div style={{ marginTop: 10 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 11, color: C.amber }}>
                Verifying selfie...
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: C.amber,
                  fontFamily: "'DM Mono',monospace",
                }}
              >
                {uploadProgress}%
              </span>
            </div>
            <div style={{ height: 3, background: C.border, borderRadius: 2 }}>
              <div
                style={{
                  height: "100%",
                  width: `${uploadProgress}%`,
                  borderRadius: 2,
                  background: `linear-gradient(90deg,${C.amber},${C.green})`,
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Info note */}
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
          background: "rgba(59,130,246,0.04)",
          border: "1px solid rgba(59,130,246,0.12)",
          borderRadius: 10,
          padding: "11px 13px",
          marginBottom: 18,
        }}
      >
        <svg
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill="none"
          stroke={C.blue}
          strokeWidth={2}
          strokeLinecap="round"
          style={{ flexShrink: 0, marginTop: 1 }}
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span style={{ fontSize: 11, color: "#666", lineHeight: 1.6 }}>
          Face the camera directly in good lighting, with no glasses or mask.
          We'll match this against your ID instantly.
        </span>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
            background: "rgba(246,70,93,0.06)",
            border: "1px solid rgba(246,70,93,0.2)",
            borderRadius: 10,
            padding: "10px 13px",
            marginBottom: 16,
            animation: "fadeIn 0.2s ease",
          }}
        >
          <svg
            width={14}
            height={14}
            viewBox="0 0 24 24"
            fill="none"
            stroke={C.red}
            strokeWidth={2}
            strokeLinecap="round"
            style={{ flexShrink: 0, marginTop: 1 }}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <div style={{ fontSize: 12, color: C.red, lineHeight: 1.5 }}>
              {error}
            </div>
            {remainingAttempts !== null && remainingAttempts > 0 && (
              <div style={{ fontSize: 11, color: C.amber, marginTop: 4 }}>
                {remainingAttempts} attempt
                {remainingAttempts === 1 ? "" : "s"} remaining
              </div>
            )}
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        className="submit-btn"
        disabled={loading}
        onClick={handleSubmit}
        style={{
          width: "100%",
          background: C.green,
          color: "#000",
          fontWeight: 700,
          fontSize: "clamp(14px, 3vw, 14px)",
          padding: "clamp(12px, 3vw, 14px)",
          borderRadius: 10,
          border: "none",
          fontFamily: "'Outfit',sans-serif",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          minHeight: 48,
        }}
      >
        {loading ? (
          <>
            <Spinner size={15} />{" "}
            {uploading ? "Verifying..." : "Submitting..."}
          </>
        ) : (
          "Verify Selfie →"
        )}
      </button>
    </div>
  );
}

// ── KYC Form: orchestrates ID verification → selfie ────────
function KYCForm({ defaultDocType, onSuccess, onPendingReview, onPhaseChange }) {
  const [phase, setPhase] = useState("id"); // 'id' | 'confirm' | 'selfie'
  const [idResult, setIdResult] = useState(null);

  useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);

  return (
    <>
      {phase === "id" && (
        <IdVerificationForm
          defaultDocType={defaultDocType}
          onVerified={(result) => {
            setIdResult(result);
            setPhase("confirm");
          }}
        />
      )}
      {phase === "confirm" && idResult && (
        <ConfirmNameStep
          verifiedName={idResult.verifiedName}
          onConfirm={() => setPhase("selfie")}
          onReject={() => setPhase("id")}
        />
      )}
      {phase === "selfie" && (
        <SelfieStep onApproved={onSuccess} onPendingReview={onPendingReview} />
      )}
    </>
  );
}

// ── Verified state ─────────────────────────────────────────
function VerifiedState({ kyc }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px 0",
        animation: "fadeUp 0.4s ease",
      }}
    >
      <VerifiedShield />
      <h2
        style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 32,
          letterSpacing: 1,
          color: C.green,
          marginBottom: 8,
        }}
      >
        KYC VERIFIED
      </h2>
      <p
        style={{
          fontSize: 13,
          color: C.muted,
          lineHeight: 1.7,
          maxWidth: 320,
          margin: "0 auto 28px",
        }}
      >
        Your identity has been successfully verified. You now have full access
        to all platform features including withdrawals.
      </p>
      <div
        style={{
          background: "rgba(14,203,129,0.05)",
          border: "1px solid rgba(14,203,129,0.15)",
          borderRadius: 12,
          padding: "16px 20px",
          textAlign: "left",
        }}
      >
        <div
          style={{
            fontSize: 9,
            color: C.green,
            letterSpacing: 2,
            marginBottom: 12,
          }}
        >
          VERIFIED DOCUMENT
        </div>
        {[
          [
            "Document Type",
            DOC_TYPES.find((d) => d.value === kyc.document_type)?.label ||
              kyc.document_type,
          ],
          ["Document Number", kyc.document_number],
          [
            "Submitted",
            new Date(kyc.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
          ],
        ].map(([k, v]) => (
          <div
            key={k}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 12, color: C.muted }}>{k}</span>
            <span
              style={{
                fontSize: 12,
                fontFamily: "'DM Mono',monospace",
                color: "#ccc",
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

// ── Submitted / pending state ──────────────────────────────
function SubmittedState({ kyc }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px 0",
        animation: "fadeUp 0.4s ease",
      }}
    >
      <PendingClock />
      <h2
        style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 32,
          letterSpacing: 1,
          color: C.amber,
          marginBottom: 8,
        }}
      >
        UNDER REVIEW
      </h2>
      <p
        style={{
          fontSize: 13,
          color: C.muted,
          lineHeight: 1.7,
          maxWidth: 320,
          margin: "0 auto 28px",
        }}
      >
        Your documents are being reviewed by our compliance team. This typically
        takes 1–3 business days.
      </p>
      <div
        style={{
          background: "rgba(245,166,35,0.05)",
          border: "1px solid rgba(245,166,35,0.15)",
          borderRadius: 12,
          padding: "16px 20px",
          textAlign: "left",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontSize: 9,
            color: C.amber,
            letterSpacing: 2,
            marginBottom: 12,
          }}
        >
          SUBMITTED DOCUMENT
        </div>
        {[
          [
            "Document Type",
            DOC_TYPES.find((d) => d.value === kyc.document_type)?.label ||
              kyc.document_type,
          ],
          ["Document Number", kyc.document_number],
          [
            "Submitted",
            new Date(kyc.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
          ],
          ["Status", "Awaiting Admin Review"],
        ].map(([k, v]) => (
          <div
            key={k}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 12, color: C.muted }}>{k}</span>
            <span
              style={{
                fontSize: 12,
                fontFamily: "'DM Mono',monospace",
                color: k === "Status" ? C.amber : "#ccc",
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
          alignItems: "center",
          gap: 6,
          justifyContent: "center",
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: C.amber,
            animation: "pulse 2s infinite",
            display: "inline-block",
          }}
        />
        <span style={{ fontSize: 11, color: C.muted }}>
          We'll notify you when review is complete
        </span>
      </div>
    </div>
  );
}

// ── Rejected state ─────────────────────────────────────────
function RejectedState({ kyc, onResubmit }) {
  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <RejectedIcon />
        <h2
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: 32,
            letterSpacing: 1,
            color: C.red,
            marginBottom: 8,
          }}
        >
          VERIFICATION REJECTED
        </h2>
        <p
          style={{
            fontSize: 13,
            color: C.muted,
            lineHeight: 1.7,
            maxWidth: 320,
            margin: "0 auto",
          }}
        >
          Your KYC submission was not approved. Please review the reason below
          and resubmit with corrected documents.
        </p>
      </div>

      <div
        style={{
          background: "rgba(246,70,93,0.06)",
          border: "1px solid rgba(246,70,93,0.2)",
          borderRadius: 12,
          padding: "16px 20px",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontSize: 9,
            color: C.red,
            letterSpacing: 2,
            marginBottom: 10,
          }}
        >
          REJECTION REASON
        </div>
        <p style={{ fontSize: 13, color: "#ddd", lineHeight: 1.6, margin: 0 }}>
          {kyc.rejection_reason || "No specific reason was provided."}
        </p>
      </div>

      <button
        className="submit-btn"
        onClick={onResubmit}
        style={{
          width: "100%",
          background: C.green,
          color: "#000",
          fontWeight: 700,
          fontSize: 14,
          padding: "14px",
          borderRadius: 10,
          border: "none",
          fontFamily: "'Outfit',sans-serif",
          cursor: "pointer",
        }}
      >
        Resubmit Documents →
      </button>
    </div>
  );
}

// ── Unverified / form prompt ───────────────────────────────
function UnverifiedPrompt({ onBegin }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px 0",
        animation: "fadeUp 0.4s ease",
      }}
    >
      <div
        style={{
          width: 90,
          height: 90,
          margin: "0 auto 24px",
          background:
            "linear-gradient(135deg,rgba(14,203,129,0.1),rgba(14,203,129,0.04))",
          border: "1px solid rgba(14,203,129,0.2)",
          borderRadius: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 40px rgba(14,203,129,0.08)",
        }}
      >
        <svg
          width={40}
          height={40}
          viewBox="0 0 24 24"
          fill="none"
          stroke={C.green}
          strokeWidth={1.4}
          strokeLinecap="round"
        >
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
          <path d="M16 11l2 2 4-4" stroke={C.green} strokeWidth={1.8} />
        </svg>
      </div>
      <h2
        style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 32,
          letterSpacing: 1,
          color: C.text,
          marginBottom: 8,
        }}
      >
        VERIFY YOUR IDENTITY
      </h2>
      <p
        style={{
          fontSize: 13,
          color: C.muted,
          lineHeight: 1.7,
          maxWidth: 340,
          margin: "0 auto 28px",
        }}
      >
        Complete KYC to unlock withdrawals and access all platform features. The
        process takes less than 2 minutes.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 10,
          marginBottom: 28,
        }}
      >
        {[
          {
            icon: (
              <svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke={C.green}
                strokeWidth={1.8}
                strokeLinecap="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            ),
            label: "Secure",
            sub: "256-bit encrypted",
          },
          {
            icon: (
              <svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke={C.amber}
                strokeWidth={1.8}
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            ),
            label: "Instant",
            sub: "Approved in seconds",
          },
          {
            icon: (
              <svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke={C.blue}
                strokeWidth={1.8}
                strokeLinecap="round"
              >
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .92h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.59a16 16 0 006.5 6.5l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
            ),
            label: "Support",
            sub: "Dedicated help",
          },
        ].map((f) => (
          <div
            key={f.label}
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: "14px 10px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                marginBottom: 6,
                display: "flex",
                justifyContent: "center",
              }}
            >
              {f.icon}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.text }}>
              {f.label}
            </div>
            <div style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>
              {f.sub}
            </div>
          </div>
        ))}
      </div>

      <button
        className="submit-btn"
        onClick={onBegin}
        style={{
          width: "100%",
          background: C.green,
          color: "#000",
          fontWeight: 700,
          fontSize: 14,
          padding: "14px",
          borderRadius: 10,
          border: "none",
          fontFamily: "'Outfit',sans-serif",
          cursor: "pointer",
        }}
      >
        Begin KYC Verification →
      </button>
    </div>
  );
}

// ── Progress steps bar ─────────────────────────────────────
function StepsBar({ step }) {
  const steps = ["ID Number", "Selfie", "Review"];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        marginBottom: 28,
      }}
    >
      {steps.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                flexShrink: 0,
                background: i <= step ? C.green : C.border2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 700,
                color: i <= step ? "#000" : C.muted,
                transition: "all 0.3s",
              }}
            >
              {i < step ? "✓" : i + 1}
            </div>
            <span
              style={{
                fontSize: 10,
                color: i <= step ? C.green : C.muted,
                letterSpacing: 0.5,
                whiteSpace: "nowrap",
                transition: "color 0.3s",
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
                background: i < step ? C.green : C.border,
                margin: "0 8px",
                transition: "background 0.3s",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main KYC Page ──────────────────────────────────────────
export default function KYC() {
  const [kycStatus, setKycStatus] = useState(null); // null = loading
  const [kyc, setKyc] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [formPhase, setFormPhase] = useState("id");

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  const fetchStatus = async () => {
    try {
      const { data } = await api.get("/kyc/status");
      setKyc(data);
      setKycStatus(data.status);
    } catch (_err) {
      setError("Failed to load KYC status. Please refresh.");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchStatus();
  }, []);

  const handleSuccess = () => {
    setSubmitted(true);
    setShowForm(false);
    fetchStatus();
  };

  const handlePendingReview = () => {
    setSubmitted(true);
    setShowForm(false);
    fetchStatus();
  };

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "clamp(16px, 5vw, 24px)",
        background: C.bg,
        minHeight: 0,
      }}
    >
      {/* Page header */}
      <div
        className="kyc-card"
        style={{ marginBottom: "clamp(16px, 4vw, 24px)" }}
      >
        <div
          style={{
            fontSize: "clamp(8px, 2vw, 9px)",
            color: C.muted,
            letterSpacing: 3,
            marginBottom: 6,
          }}
        >
          ACCOUNT / IDENTITY VERIFICATION
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(8px, 3vw, 14px)",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <h1
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: "clamp(20px, 6vw, 38px)",
              letterSpacing: 1,
              margin: 0,
            }}
          >
            KYC Verification
          </h1>
          {kycStatus && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: STATUS_CONFIG[kycStatus]?.bg,
                border: `1px solid ${STATUS_CONFIG[kycStatus]?.border}`,
                borderRadius: 100,
                padding: "5px clamp(8px, 2vw, 12px)",
                minWidth: "fit-content",
              }}
            >
              {kycStatus === "verified" && (
                <svg
                  width={11}
                  height={11}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={C.green}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
              {kycStatus === "submitted" && (
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: C.amber,
                    animation: "pulse 2s infinite",
                    display: "inline-block",
                  }}
                />
              )}
              {kycStatus === "rejected" && (
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: C.red,
                    display: "inline-block",
                  }}
                />
              )}
              {kycStatus === "unverified" && (
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: C.muted,
                    display: "inline-block",
                  }}
                />
              )}
              <span
                style={{
                  fontSize: "clamp(9px, 2vw, 11px)",
                  fontWeight: 600,
                  color: STATUS_CONFIG[kycStatus]?.color,
                  letterSpacing: 1,
                  fontFamily: "'DM Mono',monospace",
                }}
              >
                {STATUS_CONFIG[kycStatus]?.label?.toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main card */}
      <div
        className="kyc-card"
        style={{
          maxWidth: "min(560px, 100%)",
          margin: "0 auto",
          animationDelay: "0.08s",
        }}
      >
        <div
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            padding: "clamp(20px, 5vw, 28px)",
            minHeight: 360,
          }}
        >
          {/* Loading skeleton */}
          {kycStatus === null && !error && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[80, 220, 48].map((h, i) => (
                <div key={i} className="status-shimmer" style={{ height: h }} />
              ))}
            </div>
          )}

          {error && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <p style={{ color: C.red, fontSize: 13 }}>{error}</p>
              <button
                onClick={fetchStatus}
                style={{
                  marginTop: 12,
                  background: "none",
                  border: `1px solid ${C.border}`,
                  color: C.muted,
                  padding: "8px 18px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 12,
                  fontFamily: "'Outfit',sans-serif",
                }}
              >
                Retry
              </button>
            </div>
          )}

          {kycStatus === "verified" && <VerifiedState kyc={kyc} />}

          {kycStatus === "submitted" && !submitted && (
            <SubmittedState kyc={kyc} />
          )}
          {kycStatus === "submitted" && submitted && (
            <SubmittedState kyc={kyc} />
          )}

          {kycStatus === "rejected" && !showForm && (
            <RejectedState kyc={kyc} onResubmit={() => setShowForm(true)} />
          )}

          {kycStatus === "unverified" && !showForm && (
            <UnverifiedPrompt onBegin={() => setShowForm(true)} />
          )}

          {(kycStatus === "unverified" || kycStatus === "rejected") &&
            showForm && (
              <div>
                <StepsBar
                  step={
                    { id: 0, confirm: 0, selfie: 1 }[formPhase] ?? 0
                  }
                />
                <KYCForm
                  defaultDocType={kyc?.document_type || "nin"}
                  onSuccess={handleSuccess}
                  onPendingReview={handlePendingReview}
                  onPhaseChange={setFormPhase}
                />
              </div>
            )}
        </div>
      </div>

      {/* Info banner at bottom */}
      {kycStatus && kycStatus !== "verified" && (
        <div
          className="kyc-card"
          style={{
            maxWidth: "min(560px, 100%)",
            margin: "clamp(12px, 3vw, 14px) auto 0",
            animationDelay: "0.14s",
          }}
        >
          <div
            className="info-box"
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "clamp(12px, 3vw, 14px) clamp(14px, 3vw, 18px)",
              display: "flex",
              alignItems: "flex-start",
              gap: "clamp(8px, 2vw, 12px)",
            }}
          >
            <svg
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke={C.amber}
              strokeWidth={1.8}
              strokeLinecap="round"
              style={{ flexShrink: 0, marginTop: 4 }}
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span
              style={{
                fontSize: "clamp(11px, 2vw, 12px)",
                color: C.muted,
                lineHeight: 1.5,
              }}
            >
              Withdrawals are <span style={{ color: C.amber }}>locked</span>{" "}
              until KYC is approved. Complete verification to unlock all
              features.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
