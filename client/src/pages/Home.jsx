import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setTasks(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Dashboard task fetch failed:", error);
    }
  };

  useEffect(() => {
    const loadTasks = async () => {
      await fetchTasks();
    };

    loadTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleTasks = () => {
    navigate("/tasks");
  };

  const handleCreateTask = () => {
    navigate("/tasks?create=true");
  };

  const handleCalendar = () => {
    navigate("/calendar");
  };

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status !== "completed"
  ).length;

  return (
    <div style={styles.container}>
      <div style={styles.dashboard}>

        {/* Hero */}
        <div style={styles.hero}>
          <p style={styles.badge}>🚀 Personal Productivity Hub</p>

          <h1 style={styles.welcomeTitle}>
            Welcome back 👋
          </h1>

          <p style={styles.welcomeSubtitle}>
            Organize your day. Focus on what matters.
          </p>
        </div>

        {/* Stats */}
        <div style={styles.summaryCards}>

          <div style={styles.card}>
            <p style={styles.cardEmoji}>📋</p>

            <h3 style={styles.cardTitle}>
              Total Tasks
            </h3>

            <p style={styles.cardValue}>
              {totalTasks}
            </p>
          </div>

          <div style={styles.card}>
            <p style={styles.cardEmoji}>⏳</p>

            <h3 style={styles.cardTitle}>
              Pending
            </h3>

            <p style={styles.cardValue}>
              {pendingTasks}
            </p>
          </div>

          <div style={styles.card}>
            <p style={styles.cardEmoji}>✅</p>

            <h3 style={styles.cardTitle}>
              Completed
            </h3>

            <p style={styles.cardValue}>
              {completedTasks}
            </p>
          </div>

        </div>

        {/* Actions */}
        <div style={styles.buttons}>

          <button
            onClick={handleTasks}
            style={styles.primaryButton}
          >
            📂 My Tasks
          </button>

          <button
            onClick={handleCreateTask}
            style={styles.secondaryButton}
          >
            ➕ Create Task
          </button>

          <button
            onClick={handleCalendar}
            style={styles.calendarButton}
          >
            📅 Calendar
          </button>

          <button
            onClick={handleLogout}
            style={styles.logoutButton}
          >
            Logout
          </button>

        </div>

      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    padding: "40px",
    background:
      "linear-gradient(135deg, #eef2ff 0%, #f8fafc 50%, #e0f2fe 100%)",
  },

  dashboard: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  hero: {
    textAlign: "center",
    marginBottom: "60px",
    animation: "fadeIn 0.8s ease-in-out",
  },

  badge: {
    display: "inline-block",
    padding: "10px 18px",
    background: "rgba(37, 99, 235, 0.1)",
    color: "#2563eb",
    borderRadius: "999px",
    fontWeight: "600",
    marginBottom: "20px",
    fontSize: "14px",
  },

  welcomeTitle: {
    fontSize: "52px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "15px",
    letterSpacing: "-1px",
  },

  welcomeSubtitle: {
    fontSize: "20px",
    color: "#475569",
  },

  summaryCards: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    flexWrap: "wrap",
    marginBottom: "50px",
  },

  card: {
    width: "240px",
    padding: "35px",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.8)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.4)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    textAlign: "center",
    cursor: "pointer",
  },

  cardEmoji: {
    fontSize: "28px",
    marginBottom: "12px",
  },

  cardTitle: {
    fontSize: "16px",
    color: "#64748b",
    marginBottom: "12px",
    fontWeight: "600",
  },

  cardValue: {
    fontSize: "40px",
    fontWeight: "800",
    color: "#0f172a",
  },

  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  primaryButton: {
    padding: "16px 30px",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    background: "#2563eb",
    color: "white",
    fontWeight: "700",
    fontSize: "15px",
  },

  secondaryButton: {
    padding: "16px 30px",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    background: "#10b981",
    color: "white",
    fontWeight: "700",
    fontSize: "15px",
  },

  calendarButton: {
    padding: "16px 30px",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    background: "#7c3aed",
    color: "white",
    fontWeight: "700",
    fontSize: "15px",
  },

  logoutButton: {
    padding: "16px 30px",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    background: "#0f172a",
    color: "white",
    fontWeight: "700",
    fontSize: "15px",
  },
};

export default Home;