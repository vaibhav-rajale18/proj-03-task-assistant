import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleTasks = () => {
    navigate("/tasks");
  };

  const handleCreateTask = () => {
    navigate("/tasks");
  };

  return (
    <div style={styles.container}>
      <div style={styles.dashboard}>
        <div style={styles.welcomeSection}>
          <h1 style={styles.welcomeTitle}>Welcome back 👋</h1>
          <p style={styles.welcomeSubtitle}>Let's get things done today.</p>
        </div>

        <div style={styles.summaryCards}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Total Tasks</h3>
            <p style={styles.cardValue}>25</p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Pending Tasks</h3>
            <p style={styles.cardValue}>10</p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Completed Tasks</h3>
            <p style={styles.cardValue}>15</p>
          </div>
        </div>

        <div style={styles.actionButtons}>
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
    padding: "20px",
  },

  dashboard: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  welcomeSection: {
    textAlign: "center",
    marginBottom: "40px",
  },

  welcomeTitle: {
    fontSize: "36px",
    color: "#333",
    marginBottom: "10px",
  },

  welcomeSubtitle: {
    fontSize: "18px",
    color: "#666",
  },

  summaryCards: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "40px",
    flexWrap: "wrap",
  },

  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    width: "200px",
    margin: "10px",
  },

  cardTitle: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "10px",
  },

  cardValue: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#333",
  },

  actionButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  primaryButton: {
    padding: "12px 30px",
    fontSize: "16px",
    fontWeight: "600",
    color: "white",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },

  secondaryButton: {
    padding: "12px 30px",
    fontSize: "16px",
    fontWeight: "600",
    color: "white",
    backgroundColor: "#28a745",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },

  logoutButton: {
    padding: "12px 30px",
    fontSize: "16px",
    fontWeight: "600",
    color: "white",
    backgroundColor: "#dc3545",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Home;
