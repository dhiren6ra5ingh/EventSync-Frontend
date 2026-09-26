import { useState } from "react";
import { Bell, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar({ title, notifications = [] }) {
  const { logout, role } = useAuth();
  const [open, setOpen] = useState(false);

  const totalCount = notifications.reduce((sum, n) => sum + n.count, 0);

  return (
    <div
      style={{
        position: "relative",
        background: "#C97B84",
        color: "#FFF9F5",
        padding: "20px 28px 28px",
        marginBottom: "40px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: "22px", fontWeight: 600 }}>
            EventSync
          </span>
          <span style={{ marginLeft: "14px", color: "#F3DDE1", fontSize: "14px" }}>
            {title}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setOpen(!open)}
              style={{
                background: "rgba(255, 249, 245, 0.18)",
                color: "#FFF9F5",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 12px",
                borderRadius: "999px",
              }}
            >
              <Bell size={16} />
              {totalCount > 0 && <span style={{ fontSize: "13px", fontWeight: 700 }}>{totalCount}</span>}
            </button>

            {open && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 10px)",
                  right: 0,
                  background: "#FFFDF9",
                  color: "#3A2E35",
                  borderRadius: "12px",
                  boxShadow: "0 6px 20px rgba(58, 46, 53, 0.18)",
                  width: "260px",
                  padding: "10px",
                  zIndex: 10,
                }}
              >
                {notifications.length === 0 || totalCount === 0 ? (
                  <p style={{ margin: "6px 8px", fontSize: "13px", color: "#7C6B72" }}>
                    Nothing needs your attention right now.
                  </p>
                ) : (
                  notifications
                    .filter((n) => n.count > 0)
                    .map((n, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "10px 8px",
                          borderBottom: i < notifications.length - 1 ? "1px solid #E7DAD6" : "none",
                          fontSize: "13px",
                        }}
                      >
                        <strong>{n.count}</strong> {n.label}
                      </div>
                    ))
                )}
              </div>
            )}
          </div>

          <span style={{ textTransform: "capitalize", fontSize: "14px" }}>{role}</span>

          <button
            onClick={logout}
            style={{
              backgroundColor: "#FFF9F5",
              color: "#B15D68",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "-10px",
          height: "20px",
          background:
            "radial-gradient(circle at 10px 0, transparent 11px, #C97B84 12px) 0 -10px / 20px 20px repeat-x",
        }}
      />
    </div>
  );
}

export default Navbar;