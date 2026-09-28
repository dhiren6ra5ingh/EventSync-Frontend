import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import Navbar from "../../components/Navbar";
import DayTimeline from "../../components/DayTimeline";
import { useToast } from "../../context/ToastContext";
import SkeletonList from "../../components/SkeletonList";
import EmptyState from "../../components/EmptyState";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "events", label: "Events" },
  { key: "tasks", label: "Tasks" },
  { key: "budgets", label: "Budgets" },
  { key: "vendors", label: "Vendors & Accounts" },
  { key: "packages", label: "Packages" },
  { key: "requests", label: "Requests" },
  { key: "bookings", label: "Bookings" },
];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [events, setEvents] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskData, setTaskData] = useState({
    event_id: "",
    vendor_id: "",
    description: "",
    venue: "",
    start_time: "",
    end_time: "",
  });
  const [taskError, setTaskError] = useState("");
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [budgetData, setBudgetData] = useState({
    event_id: "",
    total_allocated: "",
    spent: "",
  });
  const [budgetMsg, setBudgetMsg] = useState("");
  const [showUserForm, setShowUserForm] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    role: "vendor",
  });
  const [userMsg, setUserMsg] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingEventId, setEditingEventId] = useState(null);
  const [editEventData, setEditEventData] = useState({});
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskData, setEditTaskData] = useState({});
  const [bookings, setBookings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [confirmingEventId, setConfirmingEventId] = useState(null);
  const [confirmData, setConfirmData] = useState({ vendor_id: "" });
  const [confirmError, setConfirmError] = useState("");
  const [packages, setPackages] = useState([]);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [packageData, setPackageData] = useState({
    title: "",
    description: "",
    price: "",
    audience: "client",
    category: "Wedding",
    featured: false,
    inclusions: "",
    image_url: "",
  });
  const [packageMsg, setPackageMsg] = useState("");
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [editPackageData, setEditPackageData] = useState({});
  const [timelineItems, setTimelineItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [eventSearch, setEventSearch] = useState("");
  const [taskSearch, setTaskSearch] = useState("");
  const [eventSort, setEventSort] = useState("date-asc");

  useEffect(() => {
    Promise.all([
      fetchEvents(),
      fetchVendors(),
      fetchRequests(),
      fetchTasks(),
      fetchBookings(),
      fetchAnalytics(),
      fetchPendingEvents(),
      fetchPackages(),
    ]).finally(() => setLoading(false));
  }, []);
  const { showToast } = useToast();

  const fetchEvents = async () => {
    try {
      const res = await api.get("/api/events");
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchVendors = async () => {
    try {
      const res = await api.get("/api/vendors");
      setVendors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await api.get("/api/requests");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get("/api/analytics/summary");
      setTasks(res.data.tasks);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await api.get("/api/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/api/analytics/summary");
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPendingEvents = async () => {
    try {
      const res = await api.get("/api/admin/pending-events");
      setPendingEvents(res.data);
    } catch (err) {
      console.error(err);
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

  const fetchVendorSchedule = async (vendorId, date) => {
    if (!vendorId || !date) {
      setTimelineItems([]);
      return;
    }
    try {
      const res = await api.get(`/api/admin/vendor-schedule?vendor_id=${vendorId}&date=${date}`);
      setTimelineItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePackage = async (e) => {
    e.preventDefault();
    setPackageMsg("");
    try {
      await api.post("/api/packages", {
        ...packageData,
        price: packageData.price ? parseFloat(packageData.price) : null,
        inclusions: packageData.inclusions.split("\n").map((i) => i.trim()).filter(Boolean),
      });
      setPackageMsg("Package created!");
      setPackageData({ title: "", description: "", price: "", audience: "client", category: "Wedding", featured: false, inclusions: "", image_url: "" });
      fetchPackages();
    } catch (err) {
      setPackageMsg(err.response?.data?.error || "Failed to create package");
    }
  };

  const startEditPackage = (p) => {
    setEditingPackageId(p._id);
    setEditPackageData({
      title: p.title,
      description: p.description,
      price: p.price,
      audience: p.audience,
      category: p.category || "Other",
      featured: p.featured || false,
      inclusions: (p.inclusions || []).join("\n"),
      image_url: p.image_url || "",
    });
  };

  const saveEditPackage = async (packageId) => {
    try {
      await api.put(`/api/packages/${packageId}`, {
        ...editPackageData,
        inclusions: editPackageData.inclusions.split("\n").map((i) => i.trim()).filter(Boolean),
      });
      setEditingPackageId(null);
      fetchPackages();
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to update package", "error");
    }
  };

  const deletePackage = async (packageId) => {
    if (!window.confirm("Delete this package?")) return;
    try {
      await api.delete(`/api/packages/${packageId}`);
      fetchPackages();
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to delete package", "error");
    }
  };

  const resolveRequest = async (requestId) => {
    try {
      await api.put(`/api/requests/${requestId}/resolve`);
      fetchRequests();
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to resolve request", "error");
    }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    setTaskError("");
    setAssigning(true);
    try {
      await api.post("/api/tasks", taskData);
      setTaskData({ event_id: "", vendor_id: "", description: "", venue: "", start_time: "", end_time: "" });
      setShowTaskForm(false);
      fetchTasks();
      showToast("Task assigned successfully!");
    } catch (err) {
      setTaskError(err.response?.data?.error || "Failed to assign task");
    } finally {
      setAssigning(false);
    }
  };

  const handleSetBudget = async (e) => {
    e.preventDefault();
    setBudgetMsg("");
    try {
      await api.post("/api/budgets", {
        event_id: budgetData.event_id,
        total_allocated: parseFloat(budgetData.total_allocated),
        spent: parseFloat(budgetData.spent || 0),
      });
      setBudgetMsg("Budget saved successfully!");
      setBudgetData({ event_id: "", total_allocated: "", spent: "" });
    } catch (err) {
      setBudgetMsg(err.response?.data?.error || "Failed to save budget");
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setUserMsg("");
    try {
      await api.post("/api/admin/users", userData);
      setUserMsg(`${userData.role} account created successfully!`);
      setUserData({ username: "", email: "", password: "", role: "vendor" });
      fetchVendors();
    } catch (err) {
      setUserMsg(err.response?.data?.error || "Failed to create account");
    }
  };

  const startConfirmEvent = (ev) => {
    setConfirmingEventId(ev._id);
    setConfirmData({ vendor_id: "" });
    setConfirmError("");
  };

  const submitConfirmEvent = async (eventId) => {
    setConfirmError("");
    try {
      await api.put(`/api/admin/confirm-event/${eventId}`, confirmData);
      setConfirmingEventId(null);
      fetchPendingEvents();
      fetchEvents();
    } catch (err) {
      setConfirmError(err.response?.data?.error || "Failed to confirm event");
    }
  };

  const startEditEvent = (ev) => {
    setEditingEventId(ev._id);
    setEditEventData({
      title: ev.title,
      event_date: ev.event_date,
      start_time: ev.start_time,
      end_time: ev.end_time,
      vendor_id: ev.vendor_id,
    });
  };

  const cancelEditEvent = () => {
    setEditingEventId(null);
    setEditEventData({});
  };

  const saveEditEvent = async (eventId) => {
    try {
      await api.put(`/api/events/${eventId}`, editEventData);
      setEditingEventId(null);
      fetchEvents();
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to update event", "error");
    }
  };

  const startEditTask = (t) => {
    setEditingTaskId(t._id);
    setEditTaskData({
      description: t.description,
      venue: t.venue,
      start_time: t.start_time,
      end_time: t.end_time,
    });
  };

  const cancelEditTask = () => {
    setEditingTaskId(null);
    setEditTaskData({});
  };

  const saveEditTask = async (taskId) => {
    try {
      await api.put(`/api/tasks/${taskId}`, editTaskData);
      setEditingTaskId(null);
      fetchTasks();
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to update task", "error");
    }
  };

  const deleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/api/events/${eventId}`);
      fetchEvents();
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to delete event", "error");
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/api/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to delete task", "error");
    }
  };
  const handleDeleteUser = async (userId) => {
  // Add a safety check so you don't accidentally delete someone
    if (!window.confirm("Are you sure you want to delete this account?")) return;

    try {
      // Make sure this URL matches exactly how your backend registers the admin blueprint
      await axios.delete(`https://eventsync-api-o0i7.onrender.com/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // or however you store your JWT
        }
      });

      // Update the screen instantly by filtering out the deleted user
      // Inside handleDeleteUser:
      setVendors(prevVendors => prevVendors.filter(vendor => vendor._id !== userId));
      alert("Account deleted successfully!");

    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete account.");
    }
  };
  const filteredEvents = events
    .filter((ev) => ev.title.toLowerCase().includes(eventSearch.toLowerCase()))
    .sort((a, b) => {
      if (eventSort === "date-asc") return (a.event_date || "").localeCompare(b.event_date || "");
      if (eventSort === "date-desc") return (b.event_date || "").localeCompare(a.event_date || "");
      if (eventSort === "title") return a.title.localeCompare(b.title);
      return 0;
    });

  const filteredTasks = tasks.filter(
    (t) =>
      t.description.toLowerCase().includes(taskSearch.toLowerCase()) ||
      t.venue.toLowerCase().includes(taskSearch.toLowerCase())
  );

  const pendingCount = pendingEvents.length;
  const unresolvedCount = requests.filter((r) => r.status !== "resolved").length;

  return (
    <div>
      <Navbar
        title="Admin Dashboard"
        notifications={[
          { label: "pending event requests", count: pendingCount },
          { label: "unresolved client requests", count: unresolvedCount },
        ]}
      />

      {loading ? (
        <div style={{ padding: "0 28px" }}>
          <SkeletonList rows={4} />
        </div>
      ) : (
        <div style={{ padding: "0 28px 40px" }}>

          {/* Tab bar */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "28px", flexWrap: "wrap" }}>
            {TABS.map((tab) => {
              const badgeCount =
                tab.key === "overview" ? pendingCount + unresolvedCount :
                tab.key === "events" ? pendingCount : 0;
              return (
                <button
                  key={tab.key}
                  className={activeTab === tab.key ? "" : "secondary"}
                  onClick={() => setActiveTab(tab.key)}
                  style={{ fontSize: "13px", padding: "8px 16px" }}
                >
                  {tab.label}
                  {badgeCount > 0 && (
                    <span
                      style={{
                        marginLeft: "6px",
                        background: activeTab === tab.key ? "rgba(255,249,245,0.3)" : "#D8A7B1",
                        color: activeTab === tab.key ? "#FFF9F5" : "#3A2E35",
                        borderRadius: "999px",
                        padding: "1px 7px",
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      {badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ============ OVERVIEW TAB ============ */}
          {activeTab === "overview" && (
            <div>
              {analytics && (
                <div style={{ display: "flex", gap: "16px", marginBottom: "8px" }}>
                  <div className="stat-card">
                    <h3>{analytics.total_events}</h3>
                    <p>Total events</p>
                  </div>
                  <div className="stat-card">
                    <h3>{analytics.total_tasks}</h3>
                    <p>Total tasks</p>
                  </div>
                  <div className="stat-card">
                    <h3>{analytics.total_budgets_tracked}</h3>
                    <p>Budgets tracked</p>
                  </div>
                </div>
              )}

              <div className="section-title">Pending event requests</div>
              {pendingEvents.length === 0 ? (
                <EmptyState message="No requests waiting" sub="New event requests from clients will show up here." />
              ) : (
                <ul>
                  {pendingEvents.map((ev) =>
                    confirmingEventId === ev._id ? (
                      <li key={ev._id} className="panel">
                        <p style={{ marginTop: 0 }}>
                          <strong>{ev.title}</strong><br />
                          {ev.preferred_date} · {ev.preferred_start_time} to {ev.preferred_end_time}
                          <br />
                          {ev.description && <span>{ev.description}</span>}
                        </p>
                        <select
                          value={confirmData.vendor_id}
                          onChange={(e) => setConfirmData({ vendor_id: e.target.value })}
                          required
                        >
                          <option value="">-- Select vendor --</option>
                          {vendors.map((v) => (
                            <option key={v._id} value={v._id}>{v.username} ({v.email})</option>
                          ))}
                        </select>
                        <button onClick={() => submitConfirmEvent(ev._id)}>Confirm event</button>{" "}
                        <button className="secondary" onClick={() => setConfirmingEventId(null)}>Cancel</button>
                        {confirmError && <p className="error-msg">{confirmError}</p>}
                      </li>
                    ) : (
                      <li key={ev._id} className="ticket-row">
                        <div className="ticket-info">
                          <span className="ticket-title">{ev.title}</span>
                          <span className="ticket-meta">
                            Preferred: {ev.preferred_date}
                            {ev.description && <> · {ev.description}</>}
                            {ev.package_id && (
                              <> · Package: {packages.find((p) => p._id === ev.package_id)?.title || "Unknown"}</>
                            )}
                          </span>
                        </div>
                        <div className="ticket-actions">
                          <button onClick={() => startConfirmEvent(ev)}>Review &amp; confirm</button>
                        </div>
                      </li>
                    )
                  )}
                </ul>
              )}

              <div className="section-title">Recent client requests</div>
              {requests.length === 0 ? (
                <EmptyState message="All quiet here" sub="Client requests will show up as they come in." />
              ) : (
                <ul>
                  {requests.slice(0, 3).map((r) => (
                    <li key={r._id} className="ticket-row">
                      <div className="ticket-info">
                        <span className="ticket-title">{r.request_text}</span>
                        <span className={`status-dot ${r.status === "resolved" ? "status-done" : "status-pending"}`}>
                          {r.status}
                        </span>
                      </div>
                      {r.status !== "resolved" && (
                        <div className="ticket-actions">
                          <button className="success" onClick={() => resolveRequest(r._id)}>Mark resolved</button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {requests.length > 3 && (
                <button className="secondary" onClick={() => setActiveTab("requests")}>
                  See all requests
                </button>
              )}
            </div>
          )}

          {/* ============ EVENTS TAB ============ */}
          {activeTab === "events" && (
            <div>
              <div className="section-title">Events</div>
              <div style={{ display: "flex", gap: "10px", marginBottom: "12px", flexWrap: "wrap" }}>
                <input
                  placeholder="Search events by title..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  style={{ maxWidth: "240px" }}
                />
                <select value={eventSort} onChange={(e) => setEventSort(e.target.value)} style={{ maxWidth: "180px" }}>
                  <option value="date-asc">Date: earliest first</option>
                  <option value="date-desc">Date: latest first</option>
                  <option value="title">Title: A–Z</option>
                </select>
              </div>
              {filteredEvents.length === 0 ? (
                <EmptyState message="No matching events" sub="Try a different search term." />
              ) : (
                <ul>
                  {filteredEvents.map((ev) =>
                    editingEventId === ev._id ? (
                      <li key={ev._id} className="panel">
                        <input
                          value={editEventData.title}
                          onChange={(e) => setEditEventData({ ...editEventData, title: e.target.value })}
                        />
                        <select
                          value={editEventData.vendor_id}
                          onChange={(e) => setEditEventData({ ...editEventData, vendor_id: e.target.value })}
                        >
                          {vendors.map((v) => (
                            <option key={v._id} value={v._id}>{v.username}</option>
                          ))}
                        </select>
                        <input
                          type="date"
                          value={editEventData.event_date}
                          onChange={(e) => setEditEventData({ ...editEventData, event_date: e.target.value })}
                        />
                        <input
                          type="time"
                          value={editEventData.start_time}
                          onChange={(e) => setEditEventData({ ...editEventData, start_time: e.target.value })}
                        />
                        <input
                          type="time"
                          value={editEventData.end_time}
                          onChange={(e) => setEditEventData({ ...editEventData, end_time: e.target.value })}
                        />
                        <button onClick={() => saveEditEvent(ev._id)}>Save</button>{" "}
                        <button className="secondary" onClick={cancelEditEvent}>Cancel</button>
                      </li>
                    ) : (
                      <li key={ev._id} className="ticket-row">
                        <div className="ticket-info">
                          <span className="ticket-title">{ev.title}</span>
                          <span className="ticket-meta">{ev.event_date} · {ev.start_time} to {ev.end_time}</span>
                        </div>
                        <div className="ticket-actions">
                          <button className="secondary" onClick={() => startEditEvent(ev)}>Edit</button>
                          <button className="danger" onClick={() => deleteEvent(ev._id)}>Delete</button>
                        </div>
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          )}

          {/* ============ TASKS TAB ============ */}
          {activeTab === "tasks" && (
            <div>
              <div className="section-title">Assign task</div>
              <button onClick={() => setShowTaskForm(!showTaskForm)}>
                {showTaskForm ? "Cancel" : "+ Assign task"}
              </button>

              {showTaskForm && (
                <form onSubmit={handleAssignTask} className="panel" style={{ marginTop: "12px" }}>
                  <select
                    value={taskData.event_id}
                    onChange={(e) => {
                      const eventId = e.target.value;
                      setTaskData({ ...taskData, event_id: eventId });
                      const selectedEvent = events.find((ev) => ev._id === eventId);
                      fetchVendorSchedule(taskData.vendor_id, selectedEvent?.event_date);
                    }}
                    required
                  >
                    <option value="">-- Select event --</option>
                    {events.map((ev) => (
                      <option key={ev._id} value={ev._id}>{ev.title} ({ev.event_date})</option>
                    ))}
                  </select>
                  <select
                    value={taskData.vendor_id}
                    onChange={(e) => {
                      const vendorId = e.target.value;
                      setTaskData({ ...taskData, vendor_id: vendorId });
                      const selectedEvent = events.find((ev) => ev._id === taskData.event_id);
                      fetchVendorSchedule(vendorId, selectedEvent?.event_date);
                    }}
                    required
                  >
                    <option value="">-- Select vendor --</option>
                    {vendors.map((v) => (
                      <option key={v._id} value={v._id}>{v.username} ({v.email})</option>
                    ))}
                  </select>
                  {timelineItems.length >= 0 && taskData.vendor_id && (
                    <div className="panel" style={{ marginBottom: "16px" }}>
                      <strong style={{ fontSize: "13px" }}>Vendor's schedule for this date</strong>
                      <DayTimeline items={timelineItems} />
                    </div>
                  )}
                  <input
                    placeholder="Task description (e.g. Catering setup)"
                    value={taskData.description}
                    onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                    required
                  />
                  <input
                    placeholder="Venue (e.g. Main Hall)"
                    value={taskData.venue}
                    onChange={(e) => setTaskData({ ...taskData, venue: e.target.value })}
                    required
                  />
                  <input
                    type="time"
                    value={taskData.start_time}
                    onChange={(e) => setTaskData({ ...taskData, start_time: e.target.value })}
                    required
                  />
                  <input
                    type="time"
                    value={taskData.end_time}
                    onChange={(e) => setTaskData({ ...taskData, end_time: e.target.value })}
                    required
                  />
                  <button type="submit" disabled={assigning}>
                    {assigning ? <span className="spinner" /> : "Assign"}
                  </button>
                  {taskError && <p className="error-msg">{taskError}</p>}
                </form>
              )}

              <div className="section-title">All tasks</div>
              <input
                placeholder="Search tasks by description or venue..."
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
                style={{ maxWidth: "280px", marginBottom: "12px" }}
              />
              {filteredTasks.length === 0 ? (
                <EmptyState message="No matching tasks" sub="Try a different search term." />
              ) : (
                <ul>
                  {filteredTasks.map((t) =>
                    editingTaskId === t._id ? (
                      <li key={t._id} className="panel">
                        <input
                          value={editTaskData.description}
                          onChange={(e) => setEditTaskData({ ...editTaskData, description: e.target.value })}
                        />
                        <input
                          value={editTaskData.venue}
                          onChange={(e) => setEditTaskData({ ...editTaskData, venue: e.target.value })}
                        />
                        <input
                          type="time"
                          value={editTaskData.start_time}
                          onChange={(e) => setEditTaskData({ ...editTaskData, start_time: e.target.value })}
                        />
                        <input
                          type="time"
                          value={editTaskData.end_time}
                          onChange={(e) => setEditTaskData({ ...editTaskData, end_time: e.target.value })}
                        />
                        <button onClick={() => saveEditTask(t._id)}>Save</button>{" "}
                        <button className="secondary" onClick={cancelEditTask}>Cancel</button>
                      </li>
                    ) : (
                      <li key={t._id} className="ticket-row">
                        <div className="ticket-info">
                          <span className="ticket-title">{t.description} — {t.venue}</span>
                          <span className="ticket-meta">{t.start_time} to {t.end_time}</span>
                          <span className={`status-dot ${
                            t.status === "Completed" ? "status-done" :
                            t.status === "In Progress" ? "status-progress" : "status-pending"
                          }`}>
                            {t.status}
                          </span>
                        </div>
                        <div className="ticket-actions">
                          <button className="secondary" onClick={() => startEditTask(t)}>Edit</button>
                          <button className="danger" onClick={() => deleteTask(t._id)}>Delete</button>
                        </div>
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          )}

          {/* ============ BUDGETS TAB ============ */}
          {activeTab === "budgets" && (
            <div>
              <div className="section-title">Set event budget</div>
              <button onClick={() => setShowBudgetForm(!showBudgetForm)}>
                {showBudgetForm ? "Cancel" : "+ Set budget"}
              </button>

              {showBudgetForm && (
                <form onSubmit={handleSetBudget} className="panel" style={{ marginTop: "12px" }}>
                  <select
                    value={budgetData.event_id}
                    onChange={(e) => setBudgetData({ ...budgetData, event_id: e.target.value })}
                    required
                  >
                    <option value="">-- Select event --</option>
                    {events.map((ev) => (
                      <option key={ev._id} value={ev._id}>{ev.title} ({ev.event_date})</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Total allocated (₹)"
                    value={budgetData.total_allocated}
                    onChange={(e) => setBudgetData({ ...budgetData, total_allocated: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Already spent (₹) — optional"
                    value={budgetData.spent}
                    onChange={(e) => setBudgetData({ ...budgetData, spent: e.target.value })}
                  />
                  <button type="submit">Save budget</button>
                  {budgetMsg && <p className="panel-msg">{budgetMsg}</p>}
                </form>
              )}
            </div>
          )}

          {/* ============ VENDORS & ACCOUNTS TAB ============ */}
          {activeTab === "vendors" && (
            <div>
              <div className="section-title">Create vendor / admin account</div>
              <button onClick={() => setShowUserForm(!showUserForm)}>
                {showUserForm ? "Cancel" : "+ Create account"}
              </button>

              {showUserForm && (
                <form onSubmit={handleCreateUser} className="panel" style={{ marginTop: "12px" }}>
                  <input
                    placeholder="Username"
                    value={userData.username}
                    onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={userData.password}
                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                    required
                  />
                  <select
                    value={userData.role}
                    onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                  >
                    <option value="vendor">Vendor</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button type="submit">Create account</button>
                  {userMsg && <p className="panel-msg">{userMsg}</p>}
                </form>
              )}

              <div className="section-title">Vendors</div>
              {vendors.length === 0 ? (
                <EmptyState message="No vendors added yet" sub="Create vendor accounts to start assigning tasks." />
              ) : (
                <ul>
                  {vendors.map((v) => (
                    <li key={v._id} className="ticket-row">
                      <div className="ticket-info">
                        <span className="ticket-title">{v.username}</span>
                        <span className="ticket-meta">{v.email}</span>
                      </div>
  
                      
                      <button 
                        onClick={() => handleDeleteUser(v._id)}
                        style={{ backgroundColor: '#C97B84', color: 'white', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', marginLeft: 'auto' }}
                      >
                        Delete
                      </button>
                      
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* ============ PACKAGES TAB ============ */}
          {activeTab === "packages" && (
            <div>
              <div className="section-title">Packages / combo offers</div>
              <button onClick={() => setShowPackageForm(!showPackageForm)}>
                {showPackageForm ? "Cancel" : "+ Create package"}
              </button>

              {showPackageForm && (
                <form onSubmit={handleCreatePackage} className="panel" style={{ marginTop: "12px" }}>
                  <input
                    placeholder="Package title"
                    value={packageData.title}
                    onChange={(e) => setPackageData({ ...packageData, title: e.target.value })}
                    required
                  />
                  <select
                    value={packageData.category}
                    onChange={(e) => setPackageData({ ...packageData, category: e.target.value })}
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Party">Party</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    placeholder="Short description"
                    value={packageData.description}
                    onChange={(e) => setPackageData({ ...packageData, description: e.target.value })}
                  />
                  <textarea
                    placeholder={"Inclusions, one per line\ne.g. Catering for 100 guests\nBasic stage decor\n4-hour DJ set"}
                    value={packageData.inclusions}
                    onChange={(e) => setPackageData({ ...packageData, inclusions: e.target.value })}
                    rows={4}
                    style={{ width: "100%", maxWidth: "360px", fontFamily: "inherit", borderRadius: "10px", border: "1.5px solid var(--rule)", padding: "9px 12px", marginBottom: "10px" }}
                  />
                  <input
                    type="number"
                    placeholder="Price (₹) — optional"
                    value={packageData.price}
                    onChange={(e) => setPackageData({ ...packageData, price: e.target.value })}
                  />
                  <input
                    placeholder="Image URL — optional"
                    value={packageData.image_url}
                    onChange={(e) => setPackageData({ ...packageData, image_url: e.target.value })}
                  />
                  <select
                    value={packageData.audience}
                    onChange={(e) => setPackageData({ ...packageData, audience: e.target.value })}
                  >
                    <option value="client">Client only</option>
                    <option value="vendor">Vendor only</option>
                    <option value="both">Both</option>
                  </select>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", margin: "6px 0 12px" }}>
                    <input
                      type="checkbox"
                      style={{ width: "auto" }}
                      checked={packageData.featured}
                      onChange={(e) => setPackageData({ ...packageData, featured: e.target.checked })}
                    />
                    Mark as featured
                  </label>
                  <br />
                  <button type="submit">Save package</button>
                  {packageMsg && <p className="panel-msg">{packageMsg}</p>}
                </form>
              )}

              {packages.length === 0 ? (
                <EmptyState message="No packages yet" sub="Create a package to offer clients a ready-made starting point." />
              ) : (
                <ul>
                  {packages.map((p) =>
                    editingPackageId === p._id ? (
                      <li key={p._id} className="panel">
                        <input
                          value={editPackageData.title}
                          onChange={(e) => setEditPackageData({ ...editPackageData, title: e.target.value })}
                        />
                        <select
                          value={editPackageData.category}
                          onChange={(e) => setEditPackageData({ ...editPackageData, category: e.target.value })}
                        >
                          <option value="Wedding">Wedding</option>
                          <option value="Corporate">Corporate</option>
                          <option value="Birthday">Birthday</option>
                          <option value="Party">Party</option>
                          <option value="Other">Other</option>
                        </select>
                        <input
                          value={editPackageData.description}
                          onChange={(e) => setEditPackageData({ ...editPackageData, description: e.target.value })}
                        />
                        <textarea
                          value={editPackageData.inclusions}
                          onChange={(e) => setEditPackageData({ ...editPackageData, inclusions: e.target.value })}
                          rows={4}
                          style={{ width: "100%", maxWidth: "360px", fontFamily: "inherit", borderRadius: "10px", border: "1.5px solid var(--rule)", padding: "9px 12px", marginBottom: "10px" }}
                        />
                        <input
                          type="number"
                          value={editPackageData.price || ""}
                          onChange={(e) => setEditPackageData({ ...editPackageData, price: parseFloat(e.target.value) })}
                        />
                        <input
                          placeholder="Image URL"
                          value={editPackageData.image_url}
                          onChange={(e) => setEditPackageData({ ...editPackageData, image_url: e.target.value })}
                        />
                        <select
                          value={editPackageData.audience}
                          onChange={(e) => setEditPackageData({ ...editPackageData, audience: e.target.value })}
                        >
                          <option value="client">Client only</option>
                          <option value="vendor">Vendor only</option>
                          <option value="both">Both</option>
                        </select>
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", margin: "6px 0 12px" }}>
                          <input
                            type="checkbox"
                            style={{ width: "auto" }}
                            checked={editPackageData.featured}
                            onChange={(e) => setEditPackageData({ ...editPackageData, featured: e.target.checked })}
                          />
                          Mark as featured
                        </label>
                        <br />
                        <button onClick={() => saveEditPackage(p._id)}>Save</button>{" "}
                        <button className="secondary" onClick={() => setEditingPackageId(null)}>Cancel</button>
                      </li>
                    ) : (
                      <li key={p._id} className="ticket-row">
                        <div className="ticket-info">
                          <span className="ticket-title">
                            {p.featured && "★ "}{p.title} {p.price ? `— ₹${p.price}` : ""}
                          </span>
                          <span className="ticket-meta">
                            {p.category} · For: {p.audience} · Used in {p.usage_count ?? 0} event{p.usage_count === 1 ? "" : "s"}
                          </span>
                          {p.inclusions?.length > 0 && (
                            <span className="ticket-meta">{p.inclusions.join(" · ")}</span>
                          )}
                        </div>
                        <div className="ticket-actions">
                          <button className="secondary" onClick={() => startEditPackage(p)}>Edit</button>
                          <button className="danger" onClick={() => deletePackage(p._id)}>Delete</button>
                        </div>
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          )}

          {/* ============ REQUESTS TAB ============ */}
          {activeTab === "requests" && (
            <div>
              <div className="section-title">Client requests</div>
              {requests.length === 0 ? (
                <EmptyState message="All quiet here" sub="Client requests will show up as they come in." />
              ) : (
                <ul>
                  {requests.map((r) => (
                    <li key={r._id} className="ticket-row">
                      <div className="ticket-info">
                        <span className="ticket-title">{r.request_text}</span>
                        <span className={`status-dot ${r.status === "resolved" ? "status-done" : "status-pending"}`}>
                          {r.status}
                        </span>
                      </div>
                      {r.status !== "resolved" && (
                        <div className="ticket-actions">
                          <button className="success" onClick={() => resolveRequest(r._id)}>Mark resolved</button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* ============ BOOKINGS TAB ============ */}
          {activeTab === "bookings" && (
            <div>
              <div className="section-title">Bookings</div>
              {bookings.length === 0 ? (
                <EmptyState message="No bookings yet" sub="Bookings will appear once clients confirm their events." />
              ) : (
                <ul>
                  {bookings.map((b) => (
                    <li key={b._id} className="ticket-row">
                      <div className="ticket-info">
                        <span className="ticket-title">Booking</span>
                        <span className="ticket-meta">Event: {b.event_id} · Client: {b.client_id} · {b.status}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default AdminDashboard;