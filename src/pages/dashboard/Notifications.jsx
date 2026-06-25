import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../../api/axios";

const C = {
  green: "#0ECB81", amber: "#F5A623", red: "#F6465D", blue: "#3B82F6",
  bg: "#080808", surface: "#0c0c0c", card: "#101010", card2: "#141414",
  border: "#1a1a1a", border2: "#222222",
  text: "#ffffff", muted: "#555555", muted2: "#2e2e2e",
};

const CSS = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.75)} }
  .notif-row { transition: background 0.15s; }
  .notif-row:hover { background: #161616 !important; }
  .notif-row.unread { border-left: 2px solid #0ECB81 !important; }
  .notif-row.read   { border-left: 2px solid transparent !important; }
  .mark-btn:hover   { color: #0ECB81 !important; }
  .mark-btn         { transition: color 0.15s; }

  @media (max-width: 1024px) {
    .topbar-notif { display: none !important; }
  }
  
  @media (max-width: 640px) {
    .notif-stats-icons { display: none !important; }
  }
`;

const NOTIF_TYPES = {
  trade:      { color: "#0ECB81", bg: "rgba(14,203,129,0.1)",  label: "Trade",      icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg> },
  withdrawal: { color: "#F6465D", bg: "rgba(246,70,93,0.1)",   label: "Withdrawal", icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg> },
  kyc:        { color: "#F5A623", bg: "rgba(245,166,35,0.1)",  label: "KYC",        icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  system:     { color: "#3B82F6", bg: "rgba(59,130,246,0.1)",  label: "System",     icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
  giftcard:   { color: "#F5A623", bg: "rgba(245,166,35,0.1)",  label: "Gift Card",  icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5" rx="1"/><line x1="12" y1="22" x2="12" y2="7"/></svg> },
};

// ── Server data will replace MOCK_NOTIFICATIONS ──

export default function Notifications() {
  const [notifs, setNotifs] = useState([]);
  const [filter, setFilter]   = useState("all");
  const [loading, setLoading] = useState(true);
  const { setIsMobileOpen }   = useOutletContext() || {};

  const fetchNotifs = async () => {
    try {
      const res = await api.get("/notifications/");
      setNotifs(res.data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    fetchNotifs();
    return () => document.head.removeChild(s);
  }, []);

  const unreadCount = notifs.filter(n => !n.read).length;

  const markAllRead = async () => {
    try {
      await api.post("/notifications/mark-all-read");
      setNotifs(n => n.map(x => ({ ...x, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const markRead = async (id) => {
    const target = notifs.find(n => n.id === id);
    if (target?.read) return; // Already read
    
    // Optimistic update
    setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));
    try {
      await api.patch(`/notifications/${id}/read`);
    } catch (err) {
      // Revert if failed
      setNotifs(n => n.map(x => x.id === id ? { ...x, read: false } : x));
      console.error(err);
    }
  };

  const deleteNotif = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifs(n => n.filter(x => x.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = filter === "all" ? notifs : filter === "unread" ? notifs.filter(n => !n.read) : notifs;

  const FILTERS = [
    { id: "all",    label: "All",    count: notifs.length },
    { id: "unread", label: "Unread", count: unreadCount },
  ];

  return (
    <>
      {/* ── Desktop Topbar ── */}
      <div className="topbar-notif" style={{ height: 56, display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 24px",
        borderBottom: `1px solid ${C.border}`, background: "rgba(6,6,6,0.95)",
        backdropFilter: "blur(12px)", flexShrink: 0 }}>
        <div>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, letterSpacing: 1, lineHeight: 1 }}>Notifications</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          </div>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead}
            style={{ background: "rgba(14,203,129,0.08)", border: "1px solid rgba(14,203,129,0.2)", borderRadius: 8,
              padding: "7px 14px", color: C.green, fontSize: 12, fontWeight: 600,
              fontFamily: "'Outfit',sans-serif", cursor: "pointer" }}>
            Mark all as read
          </button>
        )}
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>

        {/* ── Summary card ── */}
        <div style={{ animation: "fadeUp 0.4s ease both", background: "linear-gradient(135deg,rgba(14,203,129,0.08),rgba(14,203,129,0.03))",
          border: "1px solid rgba(14,203,129,0.18)", borderRadius: 14,
          padding: "18px 20px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, color: C.green, letterSpacing: 1, lineHeight: 1 }}>
              {unreadCount}
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Unread notifications</div>
          </div>
          <div className="notif-stats-icons" style={{ display: "flex", gap: 20 }}>
            {Object.entries(NOTIF_TYPES).map(([k, v]) => {
              const cnt = notifs.filter(n => n.type === k).length;
              if (!cnt) return null;
              return (
                <div key={k} style={{ textAlign: "center" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: v.bg, display: "flex",
                    alignItems: "center", justifyContent: "center", color: v.color, margin: "0 auto 4px" }}>
                    {v.icon}
                  </div>
                  <div style={{ fontSize: 10, color: C.muted }}>{cnt}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Filters ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              style={{ display: "flex", alignItems: "center", gap: 5,
                padding: "7px 14px", borderRadius: 100, fontSize: 12, fontWeight: 500,
                background: filter === f.id ? "rgba(14,203,129,0.1)" : "transparent",
                border: `1px solid ${filter === f.id ? "rgba(14,203,129,0.35)" : C.border2}`,
                color: filter === f.id ? C.green : C.muted,
                fontFamily: "'Outfit',sans-serif", cursor: "pointer", transition: "all 0.15s" }}>
              {f.label}
              <span style={{ background: filter === f.id ? "rgba(14,203,129,0.15)" : C.border2,
                color: filter === f.id ? C.green : C.muted,
                fontSize: 10, padding: "1px 6px", borderRadius: 100, fontFamily: "'DM Mono',monospace" }}>
                {f.count}
              </span>
            </button>
          ))}
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="mark-btn"
              style={{ marginLeft: "auto", background: "none", border: "none",
                fontSize: 12, color: C.muted, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
              Mark all read
            </button>
          )}
        </div>

        {/* ── Notification list ── */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
          {filtered.length === 0 && (
            <div style={{ padding: "60px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔔</div>
              <div style={{ fontSize: 14, color: C.muted }}>No notifications yet</div>
              <div style={{ fontSize: 12, color: C.muted2, marginTop: 4 }}>We'll notify you of trades, withdrawals and account activity</div>
            </div>
          )}
          {filtered.map((n, i) => {
            const meta = NOTIF_TYPES[n.type] || NOTIF_TYPES.system;
            return (
              <div key={n.id} className={`notif-row ${n.read ? "read" : "unread"}`}
                style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`,
                  background: n.read ? "transparent" : "rgba(14,203,129,0.02)",
                  animation: `fadeUp 0.35s ${i * 0.04}s ease both`,
                  display: "flex", gap: 14, alignItems: "flex-start", cursor: "pointer" }}
                onClick={() => markRead(n.id)}>
                {/* Icon */}
                <div style={{ width: 36, height: 36, borderRadius: 10, background: meta.bg, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center", color: meta.color, marginTop: 2 }}>
                  {meta.icon}
                </div>
                {/* Body */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <span style={{ fontSize: 13, fontWeight: n.read ? 500 : 700, color: n.read ? "#ccc" : C.text }}>{n.title}</span>
                      {!n.read && (
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green,
                          boxShadow: "0 0 6px rgba(14,203,129,0.6)", flexShrink: 0, display: "inline-block" }} />
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <span style={{ fontSize: 10, color: C.muted, whiteSpace: "nowrap" }}>{n.time}</span>
                      <button onClick={e => { e.stopPropagation(); deleteNotif(n.id); }}
                        style={{ background: "none", border: "none", color: C.muted2, cursor: "pointer",
                          fontSize: 14, padding: 0, lineHeight: 1 }}>×</button>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, margin: 0 }}>{n.body}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                    <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 100,
                      background: meta.bg, color: meta.color, letterSpacing: 1, fontWeight: 600 }}>
                      {meta.label.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length > 0 && (
          <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: C.muted }}>
            Showing {filtered.length} notification{filtered.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </>
  );
}
