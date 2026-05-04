import { useEffect, useState } from "react";

const TaskForm = () => {
  return (
    <section>
      <h2>Create a new task</h2>
      <p>Task creation UI will appear here.</p>
    </section>
  );
};

const TaskCard = ({ task }) => {
  const dueDate = task?.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : null;

  return (
    <article>
      <h3>{task?.title || "Untitled task"}</h3>
      {task?.description && <p>{task.description}</p>}
      {task?.priority && <p>Priority: {task.priority}</p>}
      {dueDate && <p>Due date: {dueDate}</p>}
    </article>
  );
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authorization token found. Please log in.");
        setLoading(false);
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

    fetchTasks();
  }, []);

  return (
    <main>
      <TaskForm />

      {loading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <p>{error}</p>
      ) : tasks.length === 0 ? (
        <p>No tasks yet. Create your first task.</p>
      ) : (
        <section>
          {tasks.map((task) => (
            <TaskCard key={task._id || task.id || task.title} task={task} />
          ))}
        </section>
      )}
    </main>
  );
};

export default Tasks;
