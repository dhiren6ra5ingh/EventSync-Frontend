function SkeletonList({ rows = 3 }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-row">
          <div className="skeleton-line" style={{ width: "45%" }} />
          <div className="skeleton-line" style={{ width: "70%", marginBottom: 0 }} />
        </div>
      ))}
    </div>
  );
}

export default SkeletonList;