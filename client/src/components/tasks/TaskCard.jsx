import { useState } from "react";

const TaskCard = ({ task, onTaskUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const taskId = task?._id;
  const dueDate = task?.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : null;
const status = task?.status || "todo";

  const handleComplete = async () => {
    if (!taskId || status === "completed") {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authorization token not found. Please log in.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "completed" }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || data.message || "Unable to complete task.");
        return;
      }

      if (typeof onTaskUpdated === "function") {
        onTaskUpdated(data);
      }
    } catch (submitError) {
      console.error(submitError);
      setError("Unable to complete task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!taskId) {
      setError("Task ID is missing.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authorization token not found. Please log in.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || data.message || "Unable to delete task.");
        return;
      }

      if (typeof onTaskUpdated === "function") {
        onTaskUpdated({ _id: taskId, deleted: true });
      }
    } catch (deleteError) {
      console.error(deleteError);
      setError("Unable to delete task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article>
      <h3>{task?.title || "Untitled task"}</h3>
      {task?.description && <p>{task.description}</p>}
      {task?.priority && <p>Priority: {task.priority}</p>}
      {dueDate && <p>Due date: {dueDate}</p>}
      <p>Status: {status}</p>

      <div>
        <button
          type="button"
          onClick={handleComplete}
          disabled={loading || status === "completed"}
        >
          {status === "completed" ? "Completed" : "Complete Task"}
        </button>
        <button type="button" onClick={handleDelete} disabled={loading}>
          Delete Task
        </button>
      </div>

      {error && <p>{error}</p>}
    </article>
  );
};

export default TaskCard;
