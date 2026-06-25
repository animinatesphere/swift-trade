import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const C = {
  green: "#0ECB81",
  amber: "#F5A623",
  red: "#F6465D",
  blue: "#3B82F6",
  bg: "#080809",
  surface: "#0c0c0c",
  card: "#101010",
  card2: "#141414",
  border: "#1a1a1a",
  border2: "#222222",
  text: "#ffffff",
  muted: "#888888",
  muted2: "#2e2e2e",
};

// test
const CSS = `
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .toggle-track   { transition:background 0.2s; cursor:pointer; }
  .card-in        { animation:fadeUp 0.4s ease both; }
  .copy-btn:hover { color:#0ECB81 !important; }
  .copy-btn       { transition:color 0.15s; }
  .danger-btn:hover { background:rgba(246,70,93,0.15) !important; border-color:rgba(246,70,93,0.4) !important; }
  .danger-btn     { transition:all 0.2s; }

  @media (max-width: 1024px) {
    .topbar-container {
      display: none !important;
    }
  }

  @media (max-width: 768px) {
    .settings-content-wrapper {
      padding: 16px 14px !important;
    }
    .settings-card {
      padding: 18px 16px !important;
    }
    .profile-hero-content {
      flex-direction: column !important;
      align-items: center !important;
      text-align: center !important;
      gap: 18px !important;
    }
    .profile-hero-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .profile-hero-stats {
      width: 100% !important;
      justify-content: center !important;
      gap: 32px !important;
      margin-top: 14px !important;
      border-top: 1px solid #1a1a1a !important;
      padding-top: 18px !important;
    }
  }

  @media (max-width: 480px) {
    .profile-hero-stats {
      gap: 20px !important;
    }
    .field-row {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 6px !important;
    }
  }
`;

// ─── FIELD ROW ────────────────────────────────────────────
function FieldRow({ label, value, mono, tag }) {
  return (
    <div
      className="field-row"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 0",
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <span style={{ fontSize: 12, color: C.muted, minWidth: 140 }}>
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {tag && (
          <span
            style={{
              fontSize: 10,
              padding: "2px 8px",
              borderRadius: 100,
              background:
                tag.color === "green"
                  ? "rgba(14,203,129,0.1)"
                  : "rgba(245,166,35,0.1)",
              color: tag.color === "green" ? C.green : C.amber,
              fontWeight: 600,
              letterSpacing: 1,
            }}
          >
            {tag.label}
          </span>
        )}
        <span
          style={{
            fontFamily: mono ? "'DM Mono',monospace" : "'Outfit',sans-serif",
            fontSize: 13,
            color: "#ccc",
            letterSpacing: mono ? "0.5px" : "normal",
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

// ─── SECTION CARD ─────────────────────────────────────────
function Section({ title, icon, children, delay = "0s" }) {
  return (
    <div
      className="card-in"
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        overflow: "hidden",
        marginBottom: 16,
        animationDelay: delay,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "14px 20px",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <span style={{ color: C.muted }}>{icon}</span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 1,
            color: "#bbb",
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ padding: "0 20px" }}>{children}</div>
    </div>
  );
}

// ─── TOGGLE ───────────────────────────────────────────────
function Toggle({ on, onChange }) {
  return (
    <div
      className="toggle-track"
      onClick={() => onChange(!on)}
      style={{
        width: 40,
        height: 22,
        borderRadius: 11,
        background: on ? C.green : C.border2,
        position: "relative",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 3,
          left: on ? 21 : 3,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.2s",
          boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
        }}
      />
    </div>
  );
}

function ToggleRow({ label, sub, on, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 0",
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div>
        <div style={{ fontSize: 13, color: "#ccc", marginBottom: 2 }}>
          {label}
        </div>
        {sub && <div style={{ fontSize: 11, color: C.muted }}>{sub}</div>}
      </div>
      <Toggle on={on} onChange={onChange} />
    </div>
  );
}

// ─── CHANGE PASSWORD MODAL ────────────────────────────────
function ChangePasswordModal({ onClose }) {
  const [form, setForm] = useState({ old_password: "", new_password: "", confirm_password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.new_password !== form.confirm_password) {
      alert("New passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/change-password", form);
      alert("Password changed successfully!");
      onClose();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, backdropFilter: "blur(2px)" }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "90%", maxWidth: 400, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, zIndex: 101, overflow: "hidden", animation: "fadeUp 0.3s ease" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, letterSpacing: 1 }}>Change Password</div>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, color: C.muted, marginBottom: 8 }}>Current Password</label>
            <input type="password" required value={form.old_password} onChange={e => setForm({ ...form, old_password: e.target.value })} style={{ width: "100%", background: C.card, border: `1px solid ${C.border2}`, color: "#fff", padding: "10px 14px", borderRadius: 8 }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, color: C.muted, marginBottom: 8 }}>New Password</label>
            <input type="password" required value={form.new_password} onChange={e => setForm({ ...form, new_password: e.target.value })} style={{ width: "100%", background: C.card, border: `1px solid ${C.border2}`, color: "#fff", padding: "10px 14px", borderRadius: 8 }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 12, color: C.muted, marginBottom: 8 }}>Confirm New Password</label>
            <input type="password" required value={form.confirm_password} onChange={e => setForm({ ...form, confirm_password: e.target.value })} style={{ width: "100%", background: C.card, border: `1px solid ${C.border2}`, color: "#fff", padding: "10px 14px", borderRadius: 8 }} />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: "10px", background: "transparent", border: `1px solid ${C.border2}`, color: "#fff", borderRadius: 8, cursor: "pointer" }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: "10px", background: C.green, border: "none", color: "#000", fontWeight: 600, borderRadius: 8, cursor: loading ? "not-allowed" : "pointer" }}>{loading ? "Saving..." : "Save Password"}</button>
          </div>
        </form>
      </div>
    </>
  );
}

// ─── SET PIN MODAL ────────────────────────────────────────
function SetTransactionPinModal({ onClose, onSuccess, isUpdate }) {
  const [pin, setPin] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pin.length !== 4) {
      alert("PIN must be exactly 4 digits.");
      return;
    }
    if (isUpdate && otp.length !== 6) {
      alert("Access code must be exactly 6 digits.");
      return;
    }
    setLoading(true);
    try {
      const payload = { pin };
      if (isUpdate) payload.otp = otp;
      await api.post("/wallets/transaction-pin", payload);
      alert(isUpdate ? "Transaction PIN updated successfully!" : "Transaction PIN set successfully!");
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to set PIN.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, backdropFilter: "blur(2px)" }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "90%", maxWidth: 400, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, zIndex: 101, overflow: "hidden", animation: "fadeUp 0.3s ease" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, letterSpacing: 1 }}>{isUpdate ? "Update Transaction PIN" : "Set Transaction PIN"}</div>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          {isUpdate && (
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, color: C.muted, marginBottom: 8, textAlign: "center" }}>6-Digit Access Code (from email)</label>
              <input type="text" required maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} style={{ width: "100%", background: C.card, border: `1px solid ${C.border2}`, color: "#fff", padding: "14px", borderRadius: 8, letterSpacing: 10, fontFamily: "'DM Mono',monospace", fontSize: 20, textAlign: "center" }} placeholder="••••••" />
            </div>
          )}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 12, color: C.muted, marginBottom: 8, textAlign: "center" }}>{isUpdate ? "New 4-Digit PIN" : "4-Digit PIN"}</label>
            <input type="password" required maxLength={4} value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ''))} style={{ width: "100%", background: C.card, border: `1px solid ${C.border2}`, color: "#fff", padding: "14px", borderRadius: 8, letterSpacing: 16, fontFamily: "'DM Mono',monospace", fontSize: 24, textAlign: "center" }} placeholder="••••" />
            {!isUpdate && <div style={{ fontSize: 11, color: C.muted, marginTop: 12, textAlign: "center", lineHeight: 1.5 }}>This PIN will be required to authorize any NGN withdrawals from your wallet.</div>}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: "12px", background: "transparent", border: `1px solid ${C.border2}`, color: "#fff", borderRadius: 8, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>Cancel</button>
            <button type="submit" disabled={loading || pin.length !== 4 || (isUpdate && otp.length !== 6)} style={{ flex: 1, padding: "12px", background: C.green, border: "none", color: "#000", fontWeight: 700, borderRadius: 8, cursor: loading || pin.length !== 4 || (isUpdate && otp.length !== 6) ? "not-allowed" : "pointer", fontFamily: "'Outfit',sans-serif" }}>{loading ? "Saving..." : "Save PIN"}</button>
          </div>
        </form>
      </div>
    </>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────
export default function Settings() {
  const { user: contextUser, logout } = useAuth();
  const [userData, setUserData] = useState(contextUser);
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [kycData, setKycData] = useState(null);
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notifs, setNotifs] = useState({
    email: true,
    sms: true,
    tradeComplete: true,
    loginAlert: true,
  });

  // Fetch user and KYC data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userRes, kycRes, walletRes] = await Promise.all([
          api.get("/auth/me"),
          api.get("/kyc/status"),
          api.get("/wallets/balance").catch(() => ({ data: null }))
        ]);
        setUserData(userRes.data);
        setKycData(kycRes.data);
        if (walletRes.data) setWalletData(walletRes.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Fall back to context user
        setUserData(contextUser);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [contextUser]);

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  const handleDeactivate = async () => {
    if (!window.confirm("Are you sure you want to deactivate your account? This action cannot be undone.")) return;
    try {
      await api.delete("/auth/deactivate");
      alert("Account deactivated.");
      logout();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to deactivate account.");
    }
  };

  const handleUpdatePinClick = async () => {
    if (!walletData?.pin_is_set) {
      setShowPinModal(true);
      return;
    }
    try {
      setLoading(true);
      await api.post("/wallets/transaction-pin/request-update");
      alert("Access code sent to your email!");
      setShowPinModal(true);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to request PIN update.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showPwdModal && <ChangePasswordModal onClose={() => setShowPwdModal(false)} />}
      {showPinModal && <SetTransactionPinModal isUpdate={walletData?.pin_is_set} onClose={() => setShowPinModal(false)} onSuccess={() => { setShowPinModal(false); setWalletData(prev => ({ ...prev, pin_is_set: true })); }} />}
      {/* Topbar */}
      <div
        className="topbar-container"
        style={{
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          borderBottom: `1px solid ${C.border}`,
          background: "rgba(6,6,6,0.95)",
          backdropFilter: "blur(12px)",
          flexShrink: 0,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 20,
              letterSpacing: 1,
              lineHeight: 1,
            }}
          >
            Settings
          </div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
            Your account information and preferences
          </div>
        </div>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: `linear-gradient(135deg,${C.green},${C.amber})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: 12,
            color: "#000",
          }}
        >
          AO
        </div>
      </div>

      {/* Content */}
      <div className="settings-content-wrapper" style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {/* Profile hero */}
          <div
            className="card-in settings-card"
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              padding: "28px 24px",
              marginBottom: 16,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -40,
                right: -40,
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: `radial-gradient(circle,rgba(14,203,129,0.06),transparent 60%)`,
                filter: "blur(30px)",
                pointerEvents: "none",
              }}
            />

            <div
              className="profile-hero-content"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                position: "relative",
              }}
            >
              {/* Avatar */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg,${C.green},${C.amber})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Bebas Neue',sans-serif",
                    fontSize: 28,
                    color: "#000",
                    letterSpacing: 1,
                  }}
                >
                  AO
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: 2,
                    right: 2,
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: C.green,
                    border: "2px solid #101010",
                    animation: "pulse 3s infinite",
                  }}
                />
              </div>

              <div className="profile-hero-info" style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "'Bebas Neue',sans-serif",
                    fontSize: 26,
                    letterSpacing: 1,
                    lineHeight: 1,
                    marginBottom: 4,
                  }}
                >
                  {userData?.full_name || "User"}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Mono',monospace",
                    fontSize: 12,
                    color: C.muted,
                    marginBottom: 8,
                  }}
                >
                  {userData?.email || "email@example.com"}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    justifyContent: "inherit",
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      padding: "3px 10px",
                      borderRadius: 100,
                      background:
                        kycData?.status === "verified"
                          ? "rgba(14,203,129,0.1)"
                          : kycData?.status === "rejected"
                            ? "rgba(246,70,93,0.1)"
                            : kycData?.status === "submitted"
                              ? "rgba(59,130,246,0.1)"
                              : "rgba(245,166,35,0.1)",
                      border: `1px solid ${kycData?.status === "verified"
                          ? "rgba(14,203,129,0.2)"
                          : kycData?.status === "rejected"
                            ? "rgba(246,70,93,0.2)"
                            : kycData?.status === "submitted"
                              ? "rgba(59,130,246,0.2)"
                              : "rgba(245,166,35,0.2)"
                        }`,
                      color:
                        kycData?.status === "verified"
                          ? C.green
                          : kycData?.status === "rejected"
                            ? C.red
                            : kycData?.status === "submitted"
                              ? C.blue
                              : C.amber,
                      fontWeight: 600,
                      letterSpacing: 1,
                    }}
                  >
                    {kycData?.status === "verified"
                      ? "✓ VERIFIED"
                      : kycData?.status === "rejected"
                        ? "✗ REJECTED"
                        : kycData?.status === "submitted"
                          ? "⧗ PENDING"
                          : "UNVERIFIED"}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      padding: "3px 10px",
                      borderRadius: 100,
                      background: "rgba(255,255,255,0.04)",
                      border: `1px solid ${C.border2}`,
                      color: C.muted,
                      letterSpacing: 1,
                    }}
                  >
                    MEMBER SINCE {userData?.created_at ? new Date(userData.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase() : "..."}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Personal info */}
          <Section
            title="PERSONAL INFORMATION"
            icon={
              <svg
                width={14}
                height={14}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              >
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            }
            delay="0.06s"
          >
            <FieldRow label="Full Name" value={userData?.full_name || "N/A"} />
            <FieldRow
              label="Email Address"
              value={userData?.email || "N/A"}
              mono
            />
            <FieldRow
              label="Phone Number"
              value={userData?.phone_number || "N/A"}
              mono
            />
            <FieldRow label="Account ID" value={userData?.id || "N/A"} mono />
          </Section>

          {/* KYC */}
          <Section
            title="VERIFICATION & KYC"
            icon={
              <svg
                width={14}
                height={14}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            }
            delay="0.1s"
          >
            <FieldRow
              label="KYC Status"
              value={
                kycData?.status === "verified"
                  ? "Verified"
                  : kycData?.status === "rejected"
                    ? "Rejected"
                    : kycData?.status === "submitted"
                      ? "Pending Verification"
                      : "Unverified"
              }
              tag={
                kycData?.status === "verified"
                  ? { label: "VERIFIED", color: "green" }
                  : kycData?.status === "rejected"
                    ? { label: "REJECTED", color: "red" }
                    : kycData?.status === "submitted"
                      ? { label: "PENDING", color: "blue" }
                      : { label: "UNVERIFIED", color: "amber" }
              }
            />
            {kycData?.rejection_reason && (
              <FieldRow
                label="Rejection Reason"
                value={kycData.rejection_reason}
              />
            )}
            <FieldRow
              label="ID Type"
              value={kycData?.document_type || "Not provided"}
            />
          </Section>

          {/* Security */}
          <Section
            title="SECURITY"
            icon={
              <svg
                width={14}
                height={14}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            }
            delay="0.14s"
          >
            <FieldRow label="Password" value={userData?.updated_at ? `Last changed ${new Date(userData.updated_at).toLocaleDateString()}` : "Active"} />
            <FieldRow
              label="2FA"
              value="Coming soon"
              tag={{ label: "COMING SOON", color: "amber" }}
            />
            <FieldRow label="Last Login" value={userData?.last_login ? new Date(userData.last_login).toLocaleString() : "Not recorded"} />
            <div style={{ padding: "14px 0" }}>
              <button
                onClick={() => setShowPwdModal(true)}
                style={{
                  fontSize: 13,
                  color: C.amber,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  fontFamily: "'Outfit',sans-serif",
                  fontWeight: 500,
                }}
              >
                Change Password →
              </button>
            </div>
          </Section>

          {/* Transaction PIN */}
          <Section
            title="TRANSACTION PIN"
            icon={
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            }
            delay="0.16s"
          >
            <div style={{ padding: "16px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, color: "#fff" }}>
                  {walletData?.pin_is_set ? "PIN is active" : "PIN is not set"}
                </div>
                <div style={{ fontSize: 12, color: C.muted, maxWidth: 280, lineHeight: 1.4 }}>
                  {walletData?.pin_is_set
                    ? "Your withdrawals are currently secured by a 4-digit PIN."
                    : "You must create a 4-digit Transaction PIN before you can withdraw."}
                </div>
              </div>
              <button
                onClick={handleUpdatePinClick}
                className="pri-btn"
                style={{
                  background: walletData?.pin_is_set ? "transparent" : C.green,
                  color: walletData?.pin_is_set ? C.green : "#000",
                  border: walletData?.pin_is_set ? `1px solid ${C.green}` : "none",
                  padding: "10px 20px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'Outfit',sans-serif"
                }}
              >
                {walletData?.pin_is_set ? "Change PIN" : "Create PIN"}
              </button>
            </div>
          </Section>

          {/* Notifications */}
          <Section
            title="NOTIFICATIONS"
            icon={
              <svg
                width={14}
                height={14}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              >
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
              </svg>
            }
            delay="0.18s"
          >
            <ToggleRow
              label="Email Notifications"
              sub="Trade updates, withdrawals and security alerts"
              on={notifs.email}
              onChange={(v) => setNotifs((n) => ({ ...n, email: v }))}
            />
            <ToggleRow
              label="SMS Notifications"
              sub="OTP and critical account alerts"
              on={notifs.sms}
              onChange={(v) => setNotifs((n) => ({ ...n, sms: v }))}
            />
            <ToggleRow
              label="Trade Completion Alerts"
              sub="Get notified when your NGN payout is released"
              on={notifs.tradeComplete}
              onChange={(v) => setNotifs((n) => ({ ...n, tradeComplete: v }))}
            />
            <ToggleRow
              label="Login Alerts"
              sub="Be notified of new logins to your account"
              on={notifs.loginAlert}
              onChange={(v) => setNotifs((n) => ({ ...n, loginAlert: v }))}
            />
          </Section>

          {/* Danger zone */}
          <div
            className="card-in"
            style={{
              background: "rgba(246,70,93,0.03)",
              border: "1px solid rgba(246,70,93,0.15)",
              borderRadius: 14,
              padding: "20px 20px",
              animationDelay: "0.22s",
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: C.red,
                letterSpacing: 1,
                marginBottom: 14,
              }}
            >
              DANGER ZONE
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3 }}>
                  Deactivate Account
                </div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>
                  Permanently disable your Swift Trade account.
                </div>
              </div>
              <button
                className="danger-btn"
                onClick={handleDeactivate}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(246,70,93,0.25)",
                  color: C.red,
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "8px 16px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontFamily: "'Outfit',sans-serif",
                  flexShrink: 0,
                  marginLeft: 24,
                }}
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
