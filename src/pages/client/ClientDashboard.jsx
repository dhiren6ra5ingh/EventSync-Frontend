import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import Navbar from "../../components/Navbar";
import DayTimeline from "../../components/DayTimeline";

function ClientDashboard() {
  const [myEvents, setMyEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [statusData, setStatusData] = useState(null);
  const [requestText, setRequestText] = useState("");
  const [requestMsg, setRequestMsg] = useState("");
  const [requestForm, setRequestForm] = useState({
  title: "",
  preferred_date: "",
  preferred_start_time: "",
  preferred_end_time: "",
  description: "",
  package_id: "",
  guest_count: "",
});
  const [requestFormMsg, setRequestFormMsg] = useState("");
  const [packages, setPackages] = useState([]);
  const [eventTasks, setEventTasks] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [compareIds, setCompareIds] = useState([]);

  useEffect(() => {
    fetchMyEvents();
    fetchPackages();
  }, []);

  const submitEventRequest = async (e) => {
  e.preventDefault();
  setRequestFormMsg("");
  try {
    await api.post("/api/client/request-event", {
      ...requestForm,
      guest_count: requestForm.guest_count ? parseInt(requestForm.guest_count) : null,
    });
    setRequestFormMsg("Event request submitted! Admin will review it shortly.");
    setRequestForm({ title: "", preferred_date: "", preferred_start_time: "", preferred_end_time: "", description: "", package_id: "", guest_count: "" });
    fetchMyEvents();
  } catch (err) {
    setRequestFormMsg(err.response?.data?.error || "Failed to submit request");
  }
};


  const fetchPackages = async () => {
    try {
      const res = await api.get("/api/packages");
      setPackages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyEvents = async () => {
    try {
      const res = await api.get("/api/client/my-events");
      setMyEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStatus = async (eventId) => {
  setSelectedEventId(eventId);
  try {
    const res = await api.get(`/api/client/event-status/${eventId}`);
    setStatusData(res.data);
    const taskRes = await api.get(`/api/client/event-tasks/${eventId}`);
    setEventTasks(taskRes.data.map(t => ({
      type: "task",
      label: `${t.description} (${t.venue})`,
      start_time: t.start_time,
      end_time: t.end_time,
    })));
  } catch (err) {
    console.error(err);
  }
};

const toggleCompare = (id) => {
  setCompareIds((prev) =>
    prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
  );
};

  const submitRequest = async (e) => {
    e.preventDefault();
    setRequestMsg("");
    try {
      await api.post("/api/requests", {
        event_id: selectedEventId,
        request_text: requestText,
      });
      setRequestMsg("Request submitted successfully!");
      setRequestText("");
    } catch (err) {
      setRequestMsg(err.response?.data?.error || "Failed to submit request");
    }
  };

  return (
    <div>
      <Navbar
  title="Client Dashboard"
  notifications={[
    { label: "confirmed events ready to track", count: myEvents.filter((ev) => ev.status === "confirmed").length },
  ]}
/>
      <div style={{ padding: "0 28px 40px" }}>

        <div className="section-title">Available packages</div>

<div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
  {["All", "Wedding", "Corporate", "Birthday", "Party", "Other"].map((cat) => (
    <button
      key={cat}
      className={activeCategory === cat ? "" : "secondary"}
      onClick={() => setActiveCategory(cat)}
      style={{ fontSize: "13px", padding: "6px 14px" }}
    >
      {cat}
    </button>
  ))}
</div>

{packages.filter((p) => activeCategory === "All" || p.category === activeCategory).length === 0 ? (
  <p style={{ color: "var(--ink-soft)" }}>No packages in this category right now.</p>
) : (
  <ul>
    {packages
      .filter((p) => activeCategory === "All" || p.category === activeCategory)
      .map((p) => (
        <li key={p._id} className="ticket-row">
          {p.image_url && (
            <img
              src={p.image_url}
              alt={p.title}
              style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "10px", marginRight: "12px" }}
            />
          )}
          <div className="ticket-info">
            <span className="ticket-title">{p.featured && "★ "}{p.title} {p.price ? `— ₹${p.price}` : ""}</span>
            <span className="ticket-meta">{p.category}</span>
            {p.inclusions?.length > 0 && (
              <span className="ticket-meta">{p.inclusions.join(" · ")}</span>
            )}
          </div>
          <div className="ticket-actions">
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
              <input
                type="checkbox"
                style={{ width: "auto" }}
                checked={compareIds.includes(p._id)}
                onChange={() => toggleCompare(p._id)}
              />
              Compare
            </label>
          </div>
        </li>
      ))}
  </ul>
)}

{compareIds.length >= 2 && (
  <div className="panel" style={{ overflowX: "auto" }}>
    <h3 style={{ marginTop: 0 }}>Comparing {compareIds.length} packages</h3>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
      <thead>
        <tr>
          <th style={{ textAlign: "left", padding: "8px" }}></th>
          {compareIds.map((id) => {
            const p = packages.find((pkg) => pkg._id === id);
            return <th key={id} style={{ textAlign: "left", padding: "8px" }}>{p?.title}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ padding: "8px", fontWeight: 700 }}>Price</td>
          {compareIds.map((id) => {
            const p = packages.find((pkg) => pkg._id === id);
            return <td key={id} style={{ padding: "8px" }}>{p?.price ? `₹${p.price}` : "—"}</td>;
          })}
        </tr>
        <tr>
          <td style={{ padding: "8px", fontWeight: 700 }}>Category</td>
          {compareIds.map((id) => {
            const p = packages.find((pkg) => pkg._id === id);
            return <td key={id} style={{ padding: "8px" }}>{p?.category}</td>;
          })}
        </tr>
        <tr>
          <td style={{ padding: "8px", fontWeight: 700 }}>Inclusions</td>
          {compareIds.map((id) => {
            const p = packages.find((pkg) => pkg._id === id);
            return (
              <td key={id} style={{ padding: "8px" }}>
                {p?.inclusions?.length > 0 ? p.inclusions.join(", ") : "—"}
              </td>
            );
          })}
        </tr>
      </tbody>
    </table>
    <button className="secondary" style={{ marginTop: "12px" }} onClick={() => setCompareIds([])}>
      Clear comparison
    </button>
  </div>
)}

        <div className="section-title">Request a new event</div>
        <form onSubmit={submitEventRequest} className="panel">
          <input
            placeholder="Event title (e.g. My Wedding)"
            value={requestForm.title}
            onChange={(e) => setRequestForm({ ...requestForm, title: e.target.value })}
            required
          />
          <select
            value={requestForm.package_id}
            onChange={(e) => setRequestForm({ ...requestForm, package_id: e.target.value })}
          >
            <option value="">-- No package (custom event) --</option>
            {packages.map((p) => (
              <option key={p._id} value={p._id}>{p.title} {p.price && `— ₹${p.price}`}</option>
            ))}
          </select>
          <input
            type="date"
            value={requestForm.preferred_date}
            onChange={(e) => setRequestForm({ ...requestForm, preferred_date: e.target.value })}
            required
          />
          <input
  type="time"
  placeholder="Start time"
  value={requestForm.preferred_start_time}
  onChange={(e) => setRequestForm({ ...requestForm, preferred_start_time: e.target.value })}
  required
/>
<input
  type="time"
  placeholder="End time"
  value={requestForm.preferred_end_time}
  onChange={(e) => setRequestForm({ ...requestForm, preferred_end_time: e.target.value })}
  required
/>
          <input
            placeholder="Description (e.g. outdoor venue, etc)"
            value={requestForm.description}
            onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })}
          />
          <input
  type="number"
  placeholder="Expected guest count"
  value={requestForm.guest_count}
  onChange={(e) => setRequestForm({ ...requestForm, guest_count: e.target.value })}
/>
          <button type="submit">Submit request</button>
          {requestFormMsg && <p className="panel-msg">{requestFormMsg}</p>}
        </form>

        <div className="section-title">My events</div>
        {myEvents.length === 0 ? (
          <p style={{ color: "var(--ink-soft)" }}>You haven't requested any events yet.</p>
        ) : (
          <ul>
            {myEvents.map((ev) => (
              <li key={ev._id} className="ticket-row">
                <div className="ticket-info">
                  <span className="ticket-title">{ev.title}</span>
                  <span className={`status-dot ${ev.status === "confirmed" ? "status-done" : "status-pending"}`}>
                    {ev.status}
                  </span>
                </div>
                {ev.status === "confirmed" && (
                  <div className="ticket-actions">
                    <button className="secondary" onClick={() => fetchStatus(ev._id)}>View status</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {statusData && (
          <div className="panel" style={{ marginTop: "8px" }}>
            <h2 style={{ marginTop: 0 }}>{statusData.event_title}</h2>
            <p style={{ margin: "4px 0" }}>Date: {statusData.date}</p>
            <p style={{ margin: "4px 0" }}>Progress: {statusData.task_progress} ({statusData.tasks_completed})</p>

            <h3>Day timeline</h3>
<DayTimeline items={eventTasks} />  
            <h3>Budget</h3>
            <p style={{ margin: "4px 0" }}>Total allocated: ₹{statusData.budget_overview.total_allocated}</p>
            <p style={{ margin: "4px 0" }}>Spent: ₹{statusData.budget_overview.spent}</p>
            <p style={{ margin: "4px 0" }}>Remaining: ₹{statusData.budget_overview.remaining}</p>

            {statusData.guest_count > 0 && (
  <p style={{ fontWeight: 600, color: "var(--rose-deep)" }}>
    ₹{Math.round(statusData.budget_overview.total_allocated / statusData.guest_count)} per guest
    <span style={{ fontWeight: 400, color: "var(--ink-soft)" }}> ({statusData.guest_count} guests)</span>
  </p>
)}
            <h3>Raise a request</h3>
            <form onSubmit={submitRequest}>
              <input
                placeholder="e.g. Add 20 more chairs"
                value={requestText}
                onChange={(e) => setRequestText(e.target.value)}
                required
              />
              <button type="submit">Submit</button>
            </form>
            {requestMsg && <p className="panel-msg">{requestMsg}</p>}
          </div>
        )}

      </div>
    </div>
  );
}

export default ClientDashboard;