function EmptyState({ message, sub }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "32px 20px",
        color: "var(--ink-soft)",
      }}
    >
      <svg width="40" height="40" viewBox="0 0 40 40" style={{ marginBottom: "10px", opacity: 0.6 }}>
        <circle cx="20" cy="20" r="18" fill="none" stroke="#D8A7B1" strokeWidth="1.5" strokeDasharray="4 4" />
        <circle cx="20" cy="20" r="4" fill="#C97B84" />
      </svg>
      <p style={{ margin: 0, fontFamily: "'Fraunces', serif", fontSize: "15px", color: "var(--ink)" }}>
        {message}
      </p>
      {sub && <p style={{ margin: "4px 0 0", fontSize: "13px" }}>{sub}</p>}
    </div>
  );
}

export default EmptyState;