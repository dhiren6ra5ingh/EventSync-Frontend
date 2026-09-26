function timeToMinutes(t) {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function DayTimeline({ items }) {
  const dayStart = 8 * 60;   // 8:00 AM
  const dayEnd = 22 * 60;    // 10:00 PM
  const totalMinutes = dayEnd - dayStart;

  const colors = {
    event: "#C97B84",
    task: "#9A87AE",
  };

  // detect overlaps for visual warning
  const withOverlap = items.map((item, i) => {
    const startA = timeToMinutes(item.start_time);
    const endA = timeToMinutes(item.end_time);
    const overlaps = items.some((other, j) => {
      if (i === j) return false;
      const startB = timeToMinutes(other.start_time);
      const endB = timeToMinutes(other.end_time);
      return startA < endB && startB < endA;
    });
    return { ...item, overlaps };
  });

  return (
    <div style={{ marginTop: "12px" }}>
      <div
        style={{
          position: "relative",
          height: "40px",
          background: "#F3ECE7",
          borderRadius: "8px",
          marginBottom: "8px",
        }}
      >
        {/* hour markers */}
        {Array.from({ length: 8 }).map((_, i) => {
          const hour = 8 + i * 2;
          const leftPct = ((hour * 60 - dayStart) / totalMinutes) * 100;
          return (
            <div
              key={hour}
              style={{
                position: "absolute",
                left: `${leftPct}%`,
                top: "-18px",
                fontSize: "11px",
                color: "var(--ink-soft)",
              }}
            >
              {hour}:00
            </div>
          );
        })}
      </div>

      {withOverlap.length === 0 ? (
        <p style={{ color: "var(--ink-soft)", fontSize: "13px" }}>No bookings for this date.</p>
      ) : (
        withOverlap.map((item, i) => {
          const startPct = ((timeToMinutes(item.start_time) - dayStart) / totalMinutes) * 100;
          const widthPct = ((timeToMinutes(item.end_time) - timeToMinutes(item.start_time)) / totalMinutes) * 100;
          return (
            <div key={i} style={{ position: "relative", height: "36px", marginBottom: "6px" }}>
              <div
                title={`${item.label}: ${item.start_time} - ${item.end_time}`}
                style={{
                  position: "absolute",
                  left: `${Math.max(startPct, 0)}%`,
                  width: `${Math.max(widthPct, 2)}%`,
                  height: "100%",
                  background: item.overlaps ? "#B15D68" : colors[item.type],
                  border: item.overlaps ? "2px solid #7A2F38" : "none",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 8px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.overlaps ? "⚠ " : ""}{item.label}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default DayTimeline;