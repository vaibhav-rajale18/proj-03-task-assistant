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
      setError("Authorization token not found.");
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
          body: JSON.stringify({
            status: "completed",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to complete task.");
        return;
      }

      onTaskUpdated(data);
    } catch (error) {
      console.error(error);
      setError("Unable to complete task.");
    } finally {
      setLoadingComplete(false);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authorization token not found.");
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
        setError("Unable to delete task.");
        return;
      }

      onTaskUpdated();
    } catch (error) {
      console.error(error);
      setError("Unable to delete task.");
    } finally {
      setLoadingDelete(false);
    }
  };

  const getPriorityStyle = () => {
    if (priority === "high") {
      return styles.highPriority;
    }

    if (priority === "medium") {
      return styles.mediumPriority;
    }

    return styles.lowPriority;
  };

  const getStatusStyle = () => {
    if (status === "completed") {
      return styles.completedStatus;
    }

    return styles.todoStatus;
  };

  return (
    <article style={styles.card}>
      
      <div style={styles.topSection}>
        <h3 style={styles.title}>
          {task?.title || "Untitled Task"}
        </h3>
      </div>

      {task?.description && (
        <p style={styles.description}>
          {task.description}
        </p>
      )}

      <div style={styles.badges}>
        
        <span
          style={{
            ...styles.badge,
            ...getPriorityStyle(),
          }}
        >
          {priority.toUpperCase()}
        </span>

        <span
          style={{
            ...styles.badge,
            ...getStatusStyle(),
          }}
        >
          {status === "completed"
            ? "DONE"
            : "TODO"}
        </span>

      </div>

      {dueDate && (
        <p style={styles.info}>
          📅 Due: {dueDate}
        </p>
      )}

      <div style={styles.buttons}>
        
        <button
          onClick={handleComplete}
          disabled={
            loadingComplete ||
            status === "completed"
          }
          style={styles.completeButton}
        >
          {status === "completed"
            ? "Completed"
            : loadingComplete
            ? "Updating..."
            : "Complete"}
        </button>

        <button
          onClick={handleDelete}
          disabled={loadingDelete}
          style={styles.deleteButton}
        >
          {loadingDelete
            ? "Deleting..."
            : "Delete"}
        </button>

      </div>

      {error && (
        <p style={styles.error}>
          {error}
        </p>
      )}

    </article>
  );
};

const styles = {
  card: {
    background: "rgba(255,255,255,0.85)",
    borderRadius: "20px",
    padding: "28px",
    border: "1px solid rgba(255,255,255,0.5)",
    boxShadow:
      "0 8px 25px rgba(0,0,0,0.08)",
    backdropFilter: "blur(8px)",
    transition: "all 0.3s ease",
  },

  topSection: {
    marginBottom: "15px",
  },

  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#0f172a",
  },

  description: {
    fontSize: "16px",
    color: "#64748b",
    marginBottom: "18px",
    lineHeight: "1.5",
  },

  badges: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "18px",
  },

  badge: {
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "700",
  },

  highPriority: {
    background: "#fee2e2",
    color: "#dc2626",
  },

  mediumPriority: {
    background: "#fef3c7",
    color: "#d97706",
  },

  lowPriority: {
    background: "#dcfce7",
    color: "#16a34a",
  },

  completedStatus: {
    background: "#dbeafe",
    color: "#2563eb",
  },

  todoStatus: {
    background: "#e2e8f0",
    color: "#475569",
  },

  info: {
    fontSize: "15px",
    color: "#475569",
    marginBottom: "20px",
    fontWeight: "500",
  },

  buttons: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  completeButton: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    background: "#2563eb",
    color: "white",
    fontWeight: "700",
    boxShadow:
      "0 6px 16px rgba(37,99,235,0.25)",
  },

  deleteButton: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    background: "#ef4444",
    color: "white",
    fontWeight: "700",
    boxShadow:
      "0 6px 16px rgba(239,68,68,0.25)",
  },

  error: {
    marginTop: "15px",
    color: "#dc2626",
    fontWeight: "500",
  },
};

export default TaskCard;