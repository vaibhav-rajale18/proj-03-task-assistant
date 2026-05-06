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
          <h1 style={styles.welcomeTitle}>
            Welcome back 👋
          </h1>

          <p style={styles.welcomeSubtitle}>
            Let's get things done today.
          </p>
        </div>

        <div style={styles.summaryCards}>
          <div style={styles.card}>
            <h3>Total Tasks</h3>
            <p>25</p>
          </div>

          <div style={styles.card}>
            <h3>Pending Tasks</h3>
            <p>10</p>
          </div>

          <div style={styles.card}>
            <h3>Completed Tasks</h3>
            <p>15</p>
          </div>
        </div>

        <div style={styles.buttons}>
          <button onClick={handleTasks}>
            Go To Tasks
          </button>

          <button onClick={handleCreateTask}>
            Create Task
          </button>

          <button onClick={handleLogout}>
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
    padding: "20px",
  },

  dashboard: {
    maxWidth: "1000px",
    margin: "0 auto",
  },

  welcomeSection: {
    textAlign: "center",
    marginBottom: "30px",
  },

  welcomeTitle: {
    fontSize: "32px",
  },

  welcomeSubtitle: {
    fontSize: "18px",
  },

  summaryCards: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: "30px",
  },

  card: {
    border: "1px solid #ccc",
    padding: "20px",
    minWidth: "180px",
    textAlign: "center",
  },

  buttons: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
};

export default Home;