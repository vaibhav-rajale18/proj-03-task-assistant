import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TaskForm from "../components/tasks/TaskForm";
import TaskCard from "../components/tasks/TaskCard";

const Tasks = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isCreateMode =
    new URLSearchParams(location.search).get("create") === "true";

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No authorization token found.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to load tasks.");
        setTasks([]);
      } else {
        setTasks(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error(error);
      setError("Unable to load tasks.");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = () => {
    fetchTasks();
    navigate("/tasks");
  };

  const handleBackHome = () => {
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const loadTasks = async () => {
      await fetchTasks();
    };

    loadTasks();
  }, []);

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

        {/* Navigation */}
        <div style={styles.navigation}>
          <button
            onClick={handleBackHome}
            style={styles.button}
          >
            ← Back To Home
          </button>

          <button
            onClick={handleLogout}
            style={styles.button}
          >
            Logout
          </button>
        </div>

        {/* CREATE MODE */}
        {isCreateMode ? (
          <div style={{ marginTop: "40px" }}>
            <TaskForm onTaskCreated={handleTaskCreated} />
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={styles.header}>
              <h1 style={styles.title}>
                My Tasks
              </h1>

              <p style={styles.subtitle}>
                Stay organized and keep moving.
              </p>
            </div>

            {/* Stats */}
            <div style={styles.summaryCards}>
              
              <div style={styles.card}>
                <h3>Total Tasks</h3>
                <p style={styles.cardValue}>
                  {totalTasks}
                </p>
              </div>

              <div style={styles.card}>
                <h3>Pending Tasks</h3>
                <p style={styles.cardValue}>
                  {pendingTasks}
                </p>
              </div>

              <div style={styles.card}>
                <h3>Completed Tasks</h3>
                <p style={styles.cardValue}>
                  {completedTasks}
                </p>
              </div>

            </div>

            {/* Tasks */}
            {loading ? (
              <p style={styles.message}>
                Loading your tasks...
              </p>
            ) : error ? (
              <p style={styles.message}>
                {error}
              </p>
            ) : tasks.length === 0 ? (
              <p style={styles.message}>
                No tasks yet 🚀
              </p>
            ) : (
              <div style={styles.taskList}>
                {tasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onTaskUpdated={fetchTasks}
                  />
                ))}
              </div>
            )}
          </>
        )}

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

  navigation: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "30px",
  },

  header: {
    textAlign: "center",
    marginBottom: "40px",
  },

  title: {
    fontSize: "38px",
    color: "#222",
    marginBottom: "10px",
  },

  subtitle: {
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

  cardValue: {
    fontSize: "32px",
    fontWeight: "bold",
    marginTop: "10px",
  },

  button: {
    padding: "12px 25px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  taskList: {
    display: "grid",
    gap: "20px",
  },

  message: {
    textAlign: "center",
    fontSize: "18px",
    color: "#666",
  },
};

export default Tasks;