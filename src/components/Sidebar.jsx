function Sidebar({ activeTab, setActiveTab }) {
  const tabs = ["Overview", "Events", "Tasks", "Vendors", "Requests", "Bookings"];

  return (
    <div
      style={{
        width: "200px",
        backgroundColor: "#1e293b",
        color: "white",
        minHeight: "100vh",
        padding: "20px 0",
      }}
    >
      {tabs.map((tab) => (
        <div
          key={tab}
          onClick={() => setActiveTab(tab)}
          style={{
            padding: "12px 24px",
            cursor: "pointer",
            backgroundColor: activeTab === tab ? "#2563eb" : "transparent",
          }}
        >
          {tab}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;