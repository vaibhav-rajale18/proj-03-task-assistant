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

  return (
    <main>
      <TaskForm onTaskCreated={handleTaskCreated} />

      {loading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <p>{error}</p>
      ) : tasks.length === 0 ? (
        <p>No tasks yet. Create your first task.</p>
      ) : (
        <section>
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