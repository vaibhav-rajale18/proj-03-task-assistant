import { useState } from "react";

const TaskCard = ({ task, onTaskUpdated }) => {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [error, setError] = useState("");

  const taskId = task?._id;

  const dueDate = task?.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : null;

  const status = task?.status || "todo";
  const priority = task?.priority || "low";

  const handleComplete = async () => {
    if (!taskId || status === "completed") {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authorization token not found. Please log in.");
      return;
    }

    setLoadingComplete(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "completed" }),
        }
      );

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
      setLoadingComplete(false);
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

    setLoadingDelete(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
      setLoadingDelete(false);
    }
  };

  const getPriorityBadge = () => {
    if (priority === "high") return "HIGH 🔴";
    if (priority === "medium") return "MEDIUM 🟡";
    return "LOW 🟢";
  };

  const getStatusBadge = () => {
    if (status === "completed") return "Completed ✅";
    if (status === "inProgress") return "In Progress 🔄";
    return "Todo ⏳";
  };

  return (
    <article
      style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "20px",
      }}
    >
      <h3 style={{ marginBottom: "10px" }}>
        {task?.title || "Untitled Task"}
      </h3>

      {task?.description && (
        <p style={{ marginBottom: "10px" }}>{task.description}</p>
      )}

      <p style={{ marginBottom: "8px" }}>
        <strong>Priority:</strong> {getPriorityBadge()}
      </p>

      {dueDate && (
        <p style={{ marginBottom: "8px" }}>
          <strong>Due:</strong> {dueDate}
        </p>
      )}

      <p style={{ marginBottom: "15px" }}>
        <strong>Status:</strong> {getStatusBadge()}
      </p>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={handleComplete}
          disabled={loadingComplete || status === "completed"}
        >
          {status === "completed"
            ? "Completed"
            : loadingComplete
            ? "Updating..."
            : "Complete Task"}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={loadingDelete}
        >
          {loadingDelete ? "Deleting..." : "Delete Task"}
        </button>
      </div>

      {error && (
        <p style={{ marginTop: "10px" }}>
          {error}
        </p>
      )}
    </article>
  );
};

export default TaskCard;