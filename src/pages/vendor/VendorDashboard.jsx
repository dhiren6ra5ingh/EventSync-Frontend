import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import Navbar from "../../components/Navbar";

function VendorDashboard() {
  const [tasks, setTasks] = useState([]);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetchTasks();
    fetchPackages();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/api/tasks/my-tasks");
      setTasks(res.data);
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

  const updateStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/api/tasks/${taskId}/status`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update status");
    }
  };

  return (
    <div>
      <Navbar
  title="Vendor Dashboard"
  notifications={[
    { label: "tasks still pending", count: tasks.filter((t) => t.status !== "Completed").length },
  ]}
/>
      <div style={{ padding: "0 28px 40px" }}>

        <div className="section-title">Company offers / packages</div>
{packages.length === 0 ? (
  <p style={{ color: "var(--ink-soft)" }}>No packages available right now.</p>
) : (
  <ul>
    {packages.map((p) => (
      <li key={p._id} className="ticket-row">
        {p.image_url && (
          <img
            src={p.image_url}
            alt={p.title}
            style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "10px", marginRight: "12px" }}
          />
        )}
        <div className="ticket-info">
          <span className="ticket-title">{p.featured && "★ "}{p.title} {p.price ? `— ₹${p.price}` : ""}</span>
          <span className="ticket-meta">{p.category}</span>
        </div>
      </li>
    ))}
  </ul>
)}

        <div className="section-title">My tasks</div>
        {tasks.length === 0 ? (
          <p style={{ color: "var(--ink-soft)" }}>No tasks assigned yet.</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task._id} className="ticket-row">
                <div className="ticket-info">
                  <span className="ticket-title">{task.description} — {task.venue}</span>
                  <span className="ticket-meta">{task.start_time} to {task.end_time}</span>
                  <span className={`status-dot ${
                    task.status === "Completed" ? "status-done" :
                    task.status === "In Progress" ? "status-progress" : "status-pending"
                  }`}>
                    {task.status}
                  </span>
                </div>
                {task.status !== "Completed" && (
                  <div className="ticket-actions">
                    <button className="secondary" onClick={() => updateStatus(task._id, "In Progress")}>In progress</button>
                    <button className="success" onClick={() => updateStatus(task._id, "Completed")}>Completed</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

      </div>
    </div>
  );
}

export default VendorDashboard;