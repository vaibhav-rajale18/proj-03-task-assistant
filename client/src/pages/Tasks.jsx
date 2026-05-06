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
      setError("No authorization token found. Please log in.");
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
        setError(data.error || data.message || "Unable to load tasks.");
        setTasks([]);
      } else {
        setTasks(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error(error);
      setError("Unable to load tasks. Please try again later.");
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
    if (!isCreateMode) {
      fetchTasks();
    }
  }, []);

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status !== "completed"
  ).length;

  return (
    <main style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>

      {/* Navigation */}
      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <button onClick={handleBackHome}>
          ← Back To Home
        </button>

        <button onClick={handleLogout}>
          Logout
        </button>
      </section>

      {/* CREATE MODE */}
      {isCreateMode ? (
        <section style={{ marginTop: "40px" }}>
          <TaskForm onTaskCreated={handleTaskCreated} />
        </section>
      ) : (
        <>
          {/* Header */}
          <section style={{ marginBottom: "25px" }}>
            <h1>My Tasks</h1>
            <p>Stay organized and keep moving.</p>
          </section>

          {/* Stats */}
          <section
            style={{
              display: "flex",
              gap: "15px",
              marginBottom: "25px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ padding: "15px", border: "1px solid #ccc" }}>
              <h3>Total</h3>
              <p>{totalTasks}</p>
            </div>

            <div style={{ padding: "15px", border: "1px solid #ccc" }}>
              <h3>Pending</h3>
              <p>{pendingTasks}</p>
            </div>

            <div style={{ padding: "15px", border: "1px solid #ccc" }}>
              <h3>Completed</h3>
              <p>{completedTasks}</p>
            </div>
          </section>

          {/* Task List */}
          {loading ? (
            <p>Loading your tasks...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : tasks.length === 0 ? (
            <p>No tasks yet 🚀</p>
          ) : (
            <section style={{ display: "grid", gap: "15px" }}>
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onTaskUpdated={fetchTasks}
                />
              ))}
            </section>
          )}
        </>
      )}
    </main>
  );
};

export default Tasks;