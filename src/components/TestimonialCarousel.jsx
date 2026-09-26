import { useEffect, useState } from "react";

function TestimonialCarousel({ items }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 4500);
    return () => clearInterval(t);
  }, [items.length]);

  return (
    <div style={{ maxWidth: "560px", margin: "0 auto", textAlign: "center" }}>
      <p style={{ fontFamily: "'Fraunces', serif", fontSize: "26px", color: "var(--rose)", margin: 0 }}>&ldquo;</p>
      <p key={index} className="reveal in-view" style={{ fontSize: "16px", color: "var(--ink)", minHeight: "70px", lineHeight: 1.5 }}>
        {items[index].quote}
      </p>
      <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--ink-soft)" }}>— {items[index].name}</p>
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "12px" }}>
        {items.map((_, i) => (
          <span
            key={i}
            onClick={() => setIndex(i)}
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              cursor: "pointer",
              background: i === index ? "var(--rose-deep)" : "var(--rule)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default TestimonialCarousel;