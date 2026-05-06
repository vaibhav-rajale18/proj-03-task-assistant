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

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed",
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status !== "completed",
  ).length;

  return (
    <div style={styles.container}>
      <div style={styles.dashboard}>
        {/* Welcome Section */}
        <div style={styles.welcomeSection}>
          <h1 style={styles.welcomeTitle}>Welcome back 👋</h1>

          <p style={styles.welcomeSubtitle}>Let’s get things done today.</p>
        </div>

        {/* Live Stats */}
        <div style={styles.summaryCards}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Total Tasks</h3>

            <p style={styles.cardValue}>{totalTasks}</p>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Pending Tasks</h3>

            <p style={styles.cardValue}>{pendingTasks}</p>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Completed Tasks</h3>

            <p style={styles.cardValue}>{completedTasks}</p>
          </div>
        </div>

        {/* Buttons */}
        <div style={styles.buttons}>
          <button onClick={handleTasks} style={styles.primaryButton}>
            Go To Tasks
          </button>

          <button onClick={handleCreateTask} style={styles.secondaryButton}>
            Create Task
          </button>

          <button onClick={handleLogout} style={styles.logoutButton}>
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
    backgroundColor: "#f5f5f5",
    padding: "30px",
  },

  dashboard: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  welcomeSection: {
    textAlign: "center",
    marginBottom: "40px",
  },

  welcomeTitle: {
    fontSize: "38px",
    marginBottom: "10px",
    color: "#222",
  },

  welcomeSubtitle: {
    fontSize: "18px",
    color: "#666",
  },

  summaryCards: {
    display: "flex",
    justifyContent: "center",
    gap: "25px",
    flexWrap: "wrap",
    marginBottom: "40px",
  },

  card: {
    backgroundColor: "white",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "25px",
    minWidth: "200px",
    textAlign: "center",
  },

  cardTitle: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "10px",
  },

  cardValue: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#222",
  },

  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  primaryButton: {
    padding: "12px 25px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  secondaryButton: {
    padding: "12px 25px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  logoutButton: {
    padding: "12px 25px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Home;
