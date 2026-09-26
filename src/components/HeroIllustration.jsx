function HeroIllustration() {
  return (
    <svg viewBox="0 0 300 220" width="100%" style={{ maxWidth: "280px" }}>
      <ellipse cx="150" cy="200" rx="120" ry="14" fill="#F3E3E8" />
      <g className="float-slow">
        <circle cx="150" cy="90" r="55" fill="#F7E3ED" />
        <circle cx="120" cy="70" r="16" fill="#D8A7B1" />
        <circle cx="150" cy="60" r="20" fill="#C97B84" />
        <circle cx="182" cy="72" r="14" fill="#B7A6C9" />
        <circle cx="150" cy="95" r="10" fill="#8FA07A" />
      </g>
      <rect x="60" y="150" width="180" height="10" rx="5" fill="#E7DAD6" />
      <rect x="90" y="130" width="16" height="26" rx="3" fill="#C97B84" />
      <rect x="140" y="120" width="16" height="36" rx="3" fill="#9A87AE" />
      <rect x="190" y="135" width="16" height="21" rx="3" fill="#8FA07A" />
    </svg>
  );
}

export default HeroIllustration;