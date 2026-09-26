function FloatingPetals({ count = 10 }) {
  const colors = ["#C97B84", "#D8A7B1", "#9A87AE", "#8FA07A"];
  const petals = Array.from({ length: count });

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {petals.map((_, i) => {
        const left = Math.random() * 100;
        const size = 8 + Math.random() * 10;
        const duration = 8 + Math.random() * 8;
        const delay = Math.random() * 8;
        const color = colors[i % colors.length];
        return (
          <div
            key={i}
            className="petal"
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              background: color,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}

export default FloatingPetals;