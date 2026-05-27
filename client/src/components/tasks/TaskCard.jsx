import { useState } from "react";
import TaskForm from "./TaskForm";

const TaskCard = ({ task, onTaskUpdated }) => {
  const [loadingComplete, setLoadingComplete] =
    useState(false);

  const [loadingDelete, setLoadingDelete] =
    useState(false);

  const [isEditing, setIsEditing] =
    useState(false);

  const [error, setError] =
    useState("");

  const taskId = task?._id;

  const dueDate = task?.dueDate
    ? new Date(
        task.dueDate
      ).toLocaleDateString()
    : null;

  const status =
    task?.status || "todo";

  const priority =
    task?.priority || "low";

  const isRecurring =
    task?.isRecurring;

  const recurrence =
    task?.recurrence;

  const currentStreak =
    task?.streak?.current || 0;

  const longestStreak =
    task?.streak?.longest || 0;

  const isCompleted =
    status === "completed";

  const isOverdue = (() => {
    if (
      !task?.dueDate ||
      isCompleted
    ) {
      return false;
    }

    const now = new Date();

    const due = new Date(
      task.dueDate
    );

    return (
      due.getTime() < now.getTime()
    );
  })();

  const isDueSoon = (() => {
    if (
      !task?.dueDate ||
      isCompleted ||
      isOverdue
    ) {
      return false;
    }

    const now = new Date();

    const due = new Date(
      task.dueDate
    );

    const difference =
      due.getTime() -
      now.getTime();

    const hoursRemaining =
      difference /
      (1000 * 60 * 60);

    return (
      hoursRemaining > 0 &&
      hoursRemaining <= 24
    );
  })();

  const getCardStyle = () => {
    if (isCompleted) {
      return styles.completedCard;
    }

    if (isOverdue) {
      return styles.overdueCard;
    }

    if (isDueSoon) {
      return styles.dueSoonCard;
    }

    return {};
  };

  const handleComplete =
    async () => {
      if (
        !taskId ||
        isCompleted
      ) {
        return;
      }

      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {
        setError(
          "Authorization token not found."
        );

        return;
      }

      setLoadingComplete(true);
      setError("");

     try {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/tasks/${taskId}`,
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
        const data =
          await response.json();

        if (!response.ok) {
          setError(
            data.message ||
              "Unable to complete task."
          );

          return;
        }

        onTaskUpdated(data);

      } catch (error) {
        console.error(error);

        setError(
          "Unable to complete task."
        );

      } finally {
        setLoadingComplete(false);
      }
    };

  const handleDelete =
    async () => {
      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {
        setError(
          "Authorization token not found."
        );

        return;
      }

      setLoadingDelete(true);
      setError("");

      try {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/tasks/${taskId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

        if (!response.ok) {
          setError(
            "Unable to delete task."
          );

          return;
        }

        onTaskUpdated();

      } catch (error) {
        console.error(error);

        setError(
          "Unable to delete task."
        );

      } finally {
        setLoadingDelete(false);
      }
    };

  const handleTaskEdit =
    () => {
      setIsEditing(false);

      onTaskUpdated();
    };

  const getPriorityStyle =
    () => {
      if (priority === "high") {
        return styles.highPriority;
      }

      if (
        priority === "medium"
      ) {
        return styles.mediumPriority;
      }

      return styles.lowPriority;
    };

  const getStatusStyle =
    () => {
      if (
        isCompleted
      ) {
        return styles.completedStatus;
      }

      return styles.todoStatus;
    };

  const getRecurringLabel =
    () => {
      if (
        !isRecurring ||
        !recurrence
      ) {
        return null;
      }

      if (
        recurrence.type ===
        "daily"
      ) {
        return "🔁 Daily";
      }

      if (
        recurrence.type ===
        "weekly"
      ) {
        return "🔁 Weekly";
      }

      if (
        recurrence.type ===
          "custom" &&
        recurrence.weekdays
          ?.length
      ) {
        return `🔁 ${recurrence.weekdays.join(
          " • "
        )}`;
      }

      return "🔁 Recurring";
    };

  if (isEditing) {
    return (
      <TaskForm
        existingTask={task}
        onTaskUpdated={
          handleTaskEdit
        }
      />
    );
  }

  return (
    <article
      style={{
        ...styles.card,
        ...getCardStyle(),
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform =
          "translateY(-6px)";

        e.currentTarget.style.boxShadow =
          "0 18px 40px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "translateY(0px)";

        e.currentTarget.style.boxShadow =
          "0 10px 30px rgba(0,0,0,0.08)";
      }}
    >
      <div style={styles.topSection}>
        <h3 style={styles.title}>
          {task?.title ||
            "Untitled Task"}
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
          {isCompleted
            ? "DONE"
            : "TODO"}
        </span>

        {isRecurring && (
          <span
            style={{
              ...styles.badge,
              ...styles.recurringBadge,
            }}
          >
            {getRecurringLabel()}
          </span>
        )}

        {isOverdue && (
          <span
            style={{
              ...styles.badge,
              ...styles.overdueBadge,
            }}
          >
            🚨 Overdue
          </span>
        )}

        {!isOverdue &&
          isDueSoon && (
            <span
              style={{
                ...styles.badge,
                ...styles.dueSoonBadge,
              }}
            >
              ⏰ Due Soon
            </span>
          )}
      </div>

      {isRecurring && (
        <div
          style={
            styles.streakContainer
          }
        >
          <p
            style={
              styles.streakText
            }
          >
            🔥 {currentStreak} day
            streak
          </p>

          <p
            style={
              styles.bestStreakText
            }
          >
            🏆 Best:{" "}
            {longestStreak}
          </p>
        </div>
      )}

      {dueDate && (
        <p style={styles.info}>
          📅 Due: {dueDate}
        </p>
      )}

      <div style={styles.buttons}>
        <button
          onClick={
            handleComplete
          }
          disabled={
            loadingComplete ||
            isCompleted
          }
          style={
            styles.completeButton
          }
        >
          {isCompleted
            ? "Completed"
            : loadingComplete
            ? "Updating..."
            : "Complete"}
        </button>

        <button
          onClick={() =>
            setIsEditing(true)
          }
          style={styles.editButton}
        >
          ✏️ Edit
        </button>

        <button
          onClick={handleDelete}
          disabled={
            loadingDelete
          }
          style={
            styles.deleteButton
          }
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
    background:
      "rgba(255,255,255,0.88)",
    borderRadius: "22px",
    padding: "28px",
    border:
      "1px solid rgba(255,255,255,0.55)",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
    backdropFilter:
      "blur(10px)",
    transition:
      "transform 0.25s ease, box-shadow 0.25s ease",
  },

  completedCard: {
    opacity: 0.72,
    border:
      "2px solid #bfdbfe",
  },

  overdueCard: {
    border:
      "2px solid #ef4444",
    boxShadow:
      "0 12px 30px rgba(239,68,68,0.18)",
  },

  dueSoonCard: {
    border:
      "2px solid #f59e0b",
    boxShadow:
      "0 12px 30px rgba(245,158,11,0.18)",
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

  recurringBadge: {
    background: "#ede9fe",
    color: "#7c3aed",
  },

  overdueBadge: {
    background: "#fee2e2",
    color: "#dc2626",
  },

  dueSoonBadge: {
    background: "#fef3c7",
    color: "#d97706",
  },

  streakContainer: {
    marginBottom: "18px",
    padding: "14px",
    borderRadius: "14px",
    background:
      "rgba(249,115,22,0.12)",
    border:
      "1px solid rgba(249,115,22,0.25)",
  },

  streakText: {
    margin: 0,
    color: "#ea580c",
    fontWeight: "700",
    fontSize: "15px",
  },

  bestStreakText: {
    margin: "6px 0 0 0",
    color: "#9a3412",
    fontWeight: "600",
    fontSize: "14px",
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
    background:
      "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "white",
    fontWeight: "700",
    transition: "0.2s ease",
    boxShadow:
      "0 6px 16px rgba(37,99,235,0.25)",
  },

  editButton: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    background:
      "linear-gradient(135deg, #f59e0b, #d97706)",
    color: "white",
    fontWeight: "700",
    transition: "0.2s ease",
    boxShadow:
      "0 6px 16px rgba(245,158,11,0.25)",
  },

  deleteButton: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    background:
      "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "white",
    fontWeight: "700",
    transition: "0.2s ease",
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