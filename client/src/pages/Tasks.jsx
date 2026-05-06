import { useEffect, useState } from "react";
import TaskForm from "../components/tasks/TaskForm";
import TaskCard from "../components/tasks/TaskCard";

const Tasks = () => {
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
  };

  useEffect(() => {
    const loadTasks = async () => {
      await fetchTasks();
    };

    loadTasks();
  }, []);

  // Task statistics
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status !== "completed"
  ).length;

  return (
    <main style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      
      {/* Page Header */}
      <section style={{ marginBottom: "25px" }}>
        <h1>My Tasks</h1>
        <p>Stay organized and keep moving.</p>
      </section>

      {/* Task Summary */}
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

      {/* Task Form */}
      <section style={{ marginBottom: "30px" }}>
        <TaskForm onTaskCreated={handleTaskCreated} />
      </section>

      {/* Task Content */}
      {loading ? (
        <p>Loading your tasks...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : tasks.length === 0 ? (
        <p>You have no tasks yet. Create your first task 🚀</p>
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
    </main>
  );
};

export default Tasks;