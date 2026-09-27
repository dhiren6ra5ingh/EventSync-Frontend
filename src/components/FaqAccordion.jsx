import { useState } from "react";
import { ChevronDown } from "lucide-react";

function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto" }}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            style={{
              borderBottom: "1px solid var(--rule)",
              padding: "16px 4px",
            }}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              style={{
                background: "none",
                color: "var(--ink)",
                border: "none",
                padding: 0,
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: 700,
                textAlign: "left",
              }}
            >
              {item.q}
              <ChevronDown
                size={18}
                color="#B15D68"
                style={{
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                  flexShrink: 0,
                  marginLeft: "12px",
                }}
              />
            </button>
            {isOpen && (
              <p
                className="reveal in-view"
                style={{ fontSize: "14px", color: "var(--ink-soft)", marginTop: "10px", lineHeight: 1.6 }}
              >
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default FaqAccordion;
