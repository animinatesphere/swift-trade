import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import logoImg from "../../assets/logo.png";

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

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html, body { height:100%; overflow:hidden; }
  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:var(--c-border2); border-radius:4px; }

  @keyframes slideIn  { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:translateX(0)} }
  @keyframes pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.75)} }

  .nav-item           { transition:all 0.15s; border-left:2px solid transparent; text-decoration:none; display:flex; padding: clamp(10px, 2vw, 14px) 0; }
  .nav-item:hover     { background:var(--c-card2) !important; color:var(--c-text) !important; }
  .nav-item.act       { background:rgba(14,203,129,0.08) !important; color:#0ECB81 !important; border-left-color:#0ECB81 !important; }
  .soon               { opacity:0.38; pointer-events:none; }

  .mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    color: var(--c-text);
    font-size: 24px;
    cursor: pointer;
    min-height: 44px;
    min-width: 44px;
    padding: 8px;
    -webkit-tap-highlight-color: transparent;
  }

  @media (max-width: 1024px) {
    .sidebar-container {
      position: fixed !important;
      left: 0;
      top: 0;
      bottom: 0;
      z-index: 100;
      transform: translateX(-100%);
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 20px 0 50px rgba(0,0,0,0.5);
      width: 100% !important;
      max-width: 280px;
    }
    .sidebar-container.open {
      transform: translateX(0);
    }
    .mobile-menu-btn {
      display: block;
    }
    .mobile-header {
      display: flex !important;
    }
    .sidebar-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(4px);
      z-index: 90;
      animation: fadeIn 0.3s ease;
    }
    .sidebar-overlay.open {
      display: block;
    }
  }

  @media (max-width: 768px) {
    .sidebar-container { width: 100% !important; max-width: 75vw; }
    .nav-item { font-size: clamp(13px, 2.5vw, 14px); }
    .logo-text { font-size: clamp(16px, 3vw, 19px) !important; }
  }

  @media (max-width: 480px) {
    .sidebar-container { max-width: 85vw; }
    .nav-item { padding: 12px 0 !important; }
  }

  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
`;

// ─── LOGO ───────────────────────────────────────────────
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

const NAV = [
  {
    id: "dashboard",
    path: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg
        width={15}
        height={15}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "trade",
    path: "/dashboard/trade",
    label: "New Trade",
    icon: (
      <svg
        width={15}
        height={15}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
  {
    id: "withdraw",
    path: "/dashboard/withdraw",
    label: "Withdraw",
    icon: (
      <svg
        width={15}
        height={15}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      >
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
        <line x1="5" y1="19" x2="19" y2="19" />
      </svg>
    ),
  },
  {
    id: "txn",
    path: "/dashboard/txn",
    label: "Transaction History",
    icon: (
      <svg
        width={15}
        height={15}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      >
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    id: "giftcards",
    path: "/dashboard/giftcards",
    label: "Gift Cards",
    icon: (
      <svg
        width={15}
        height={15}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      >
        <polyline points="20 12 20 22 4 22 4 12" />
        <rect x="2" y="7" width="20" height="5" rx="1" />
        <line x1="12" y1="22" x2="12" y2="7" />
        <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
      </svg>
    ),
  },
  {
    id: "bills",
    path: "/dashboard/bills",
    label: "Bills Payment",
    soon: true,
    icon: (
      <svg
        width={15}
        height={15}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      >
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    id: "bank",
    path: "/dashboard/bank",
    label: "Bank Accounts",
    icon: (
      <svg
        width={15}
        height={15}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      >
        <line x1="3" y1="22" x2="21" y2="22" />
        <line x1="6" y1="18" x2="6" y2="11" />
        <line x1="10" y1="18" x2="10" y2="11" />
        <line x1="14" y1="18" x2="14" y2="11" />
        <line x1="18" y1="18" x2="18" y2="11" />
        <polygon points="12 2 20 7 4 7" />
      </svg>
    ),
  },
  {
    id: "kyc",
    path: "/dashboard/kyc",
    label: "KYC Verification",
    icon: (
      <svg
        width={15}
        height={15}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    id: "support",
    path: "/dashboard/support",
    label: "Support",
    icon: (
      <svg
        width={15}
        height={15}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
];

export default function DashboardLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    navigate("/");
  };

  const initials =
    user?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "U";

  // Fetch KYC status to show sidebar badge
  const [kycStatus, setKycStatus] = useState(null);
  useEffect(() => {
    api
      .get("/kyc/status")
      .then((r) => setKycStatus(r.data.status))
      .catch(() => {});
  }, []);

  // KYC badge color
  const kycBadgeColor =
    kycStatus === "verified"
      ? C.green
      : kycStatus === "submitted"
        ? C.amber
        : kycStatus === "rejected"
          ? C.red
          : C.muted;
  const showKycBadge = kycStatus && kycStatus !== "verified";

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const activeId =
    NAV.find((n) => location.pathname === n.path)?.id || "dashboard";

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: C.bg,
        overflow: "hidden",
      }}
    >
      {/* Mobile Sidebar Overlay */}
      <div
        className={`sidebar-overlay ${isMobileOpen ? "open" : ""}`}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`sidebar-container ${isMobileOpen ? "open" : ""}`}
        style={{
          width: 214,
          background: C.surface,
          borderRight: `1px solid ${C.border}`,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            padding: "20px 18px 16px",
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            alignItems: "center",
            gap: 10,
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
                color: C.text,
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
        <div style={{ padding: "14px 16px 6px" }}>
          <span
            style={{
              fontSize: 9,
              color: C.muted2,
              letterSpacing: 3,
              fontWeight: 600,
            }}
          >
            MENU
          </span>
        </div>
        <nav style={{ flex: 1, padding: "0 8px", overflowY: "auto" }}>
          {NAV.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-item${activeId === item.id ? " act" : ""}${item.soon ? " soon" : ""}`}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 10px",
                borderRadius: "0 8px 8px 0",
                marginBottom: 1,
                background: "transparent",
                border: "none",
                borderLeft: "2px solid transparent",
                color: activeId === item.id ? C.green : C.muted,
                fontSize: 13,
                fontFamily: "'Outfit',sans-serif",
                fontWeight: 500,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span style={{ flexShrink: 0, display: "flex" }}>
                {item.icon}
              </span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.id === "kyc" && showKycBadge && (
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: kycBadgeColor,
                    boxShadow: `0 0 6px ${kycBadgeColor}88`,
                  }}
                />
              )}
              {item.soon && (
                <span
                  style={{
                    fontSize: 8,
                    padding: "2px 6px",
                    borderRadius: 4,
                    background: C.muted2,
                    color: C.text,
                    letterSpacing: 1,
                  }}
                >
                  SOON
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div style={{ padding: "8px", borderTop: `1px solid ${C.border}` }}>
          <Link
            to="/dashboard/settings"
            className={`nav-item${location.pathname === "/dashboard/settings" ? " act" : ""}`}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 10px",
              borderRadius: "0 8px 8px 0",
              marginBottom: 1,
              background: "transparent",
              border: "none",
              borderLeft: "2px solid transparent",
              color:
                location.pathname === "/dashboard/settings" ? C.green : C.muted,
              fontSize: 13,
              fontFamily: "'Outfit',sans-serif",
              fontWeight: 500,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            Settings
          </Link>
          <a
            href="/"
            onClick={handleLogout}
            className="nav-item"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 10px",
              borderRadius: "0 8px 8px 0",
              marginBottom: 1,
              background: "transparent",
              border: "none",
              borderLeft: "2px solid transparent",
              color: C.muted,
              fontSize: 13,
              fontFamily: "'Outfit',sans-serif",
              fontWeight: 500,
              cursor: "pointer",
              textAlign: "left",
              textDecoration: "none",
            }}
          >
            Log Out
          </a>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 10px 4px",
              borderTop: `1px solid ${C.border}`,
              marginTop: 6,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                flexShrink: 0,
                background: `linear-gradient(135deg,${C.green},${C.amber})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 11,
                color: "#000",
              }}
            >
              {initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: C.text,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.full_name || "Loading..."}
              </div>
              <div
                style={{
                  fontSize: 9,
                  letterSpacing: 1,
                  color:
                    kycStatus === "verified"
                      ? C.green
                      : kycStatus === "submitted"
                        ? C.amber
                        : kycStatus === "rejected"
                          ? C.red
                          : kycStatus === "unverified"
                            ? C.red
                            : C.muted,
                }}
              >
                {kycStatus === "verified"
                  ? "✓ VERIFIED"
                  : kycStatus === "submitted"
                    ? "⏳ UNDER REVIEW"
                    : kycStatus === "rejected"
                      ? "✕ KYC REJECTED"
                      : kycStatus === "unverified"
                        ? "⚠ UNVERIFIED"
                        : "· · ·"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Mobile Header (only visible on mobile to toggle sidebar) */}
        <div
          className="mobile-header"
          style={{
            height: 56,
            display: "none",
            alignItems: "center",
            padding: "0 16px",
            borderBottom: `1px solid ${C.border}`,
            background: C.surface,
            flexShrink: 0,
          }}
        >
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileOpen(true)}
            style={{ marginRight: 12 }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <div
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 20,
              letterSpacing: 1,
              color: C.text,
            }}
          >
            SWIFT TRADE
          </div>
        </div>

        {/* The current dashboard page content */}
        <Outlet context={{ setIsMobileOpen }} />
      </div>
    </div>
  );
}
