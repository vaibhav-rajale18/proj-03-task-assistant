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
          body: JSON.stringify({ status: "completed" }),
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

  const getPriorityBadge = () => {
    if (priority === "high") return "High 🔴";
    if (priority === "medium") return "Medium 🟡";
    return "Low 🟢";
  };

  const getStatusBadge = () => {
    if (status === "completed") return "Completed ✅";
    return "Todo ⏳";
  };

  return (
    <article style={styles.card}>
      
      <h3 style={styles.title}>
        {task?.title || "Untitled Task"}
      </h3>

      {task?.description && (
        <p style={styles.description}>
          {task.description}
        </p>
      )}

      <p style={styles.info}>
        <strong>Priority:</strong> {getPriorityBadge()}
      </p>

      {dueDate && (
        <p style={styles.info}>
          <strong>Due:</strong> {dueDate}
        </p>
      )}

      <p style={styles.info}>
        <strong>Status:</strong> {getStatusBadge()}
      </p>

      <div style={styles.buttons}>
        
        <button
          onClick={handleComplete}
          disabled={loadingComplete || status === "completed"}
          style={styles.button}
        >
          {status === "completed"
            ? "Completed"
            : loadingComplete
            ? "Updating..."
            : "Complete Task"}
        </button>

        <button
          onClick={handleDelete}
          disabled={loadingDelete}
          style={styles.button}
        >
          {loadingDelete
            ? "Deleting..."
            : "Delete Task"}
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
    backgroundColor: "white",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "25px",
  },

  title: {
    fontSize: "24px",
    color: "#222",
    marginBottom: "15px",
  },

  description: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "15px",
  },

  info: {
    fontSize: "15px",
    color: "#444",
    marginBottom: "10px",
  },

  buttons: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "20px",
  },

  button: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  error: {
    marginTop: "15px",
    color: "red",
  },
};

export default TaskCard;