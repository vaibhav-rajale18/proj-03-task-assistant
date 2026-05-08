import { useState } from "react";

const TaskForm = ({ onTaskCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("low");
    setDueDate("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authorization token not found.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate || undefined,
      };

      const response = await fetch(
        "http://localhost:5000/api/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
          "Unable to create task."
        );
        return;
      }

      resetForm();

      if (
        typeof onTaskCreated ===
        "function"
      ) {
        onTaskCreated(data);
      }

    } catch (error) {
      console.error(error);

      setError(
        "Unable to create task."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={styles.container}>
      
      <div style={styles.header}>
        <p style={styles.badge}>
          ✨ Create Something New
        </p>

        <h2 style={styles.title}>
          Create New Task
        </h2>

        <p style={styles.subtitle}>
          Add your next focus item.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        
        {/* Title */}
        <div style={styles.field}>
          <label style={styles.label}>
            Title *
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            style={styles.input}
            required
          />
        </div>

        {/* Description */}
        <div style={styles.field}>
          <label style={styles.label}>
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            rows={4}
            style={styles.textarea}
          />
        </div>

        {/* Priority */}
        <div style={styles.field}>
          <label style={styles.label}>
            Priority
          </label>

          <select
            value={priority}
            onChange={(e) =>
              setPriority(
                e.target.value
              )
            }
            style={styles.select}
          >
            <option value="low">
              Low 🟢
            </option>

            <option value="medium">
              Medium 🟡
            </option>

            <option value="high">
              High 🔴
            </option>
          </select>
        </div>

        {/* Due Date */}
        <div style={styles.field}>
          <label style={styles.label}>
            Due Date
          </label>

          <input
            type="date"
            value={dueDate}
            onChange={(e) =>
              setDueDate(
                e.target.value
              )
            }
            style={styles.dateInput}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={styles.button}
        >
          {loading
            ? "Creating..."
            : "Create Task"}
        </button>

        {/* Error */}
        {error && (
          <p style={styles.error}>
            {error}
          </p>
        )}

      </form>

    </section>
  );
};

const baseInput = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  fontSize: "15px",
  boxSizing: "border-box",
  background: "#ffffff",
  color: "#0f172a",
};

const styles = {
  container: {
    background:
      "rgba(255,255,255,0.88)",
    borderRadius: "24px",
    padding: "40px",
    maxWidth: "650px",
    margin: "0 auto",
    boxShadow:
      "0 12px 35px rgba(0,0,0,0.08)",
  },

  header: {
    textAlign: "center",
    marginBottom: "35px",
  },

  badge: {
    display: "inline-block",
    padding: "8px 16px",
    borderRadius: "999px",
    background:
      "rgba(37,99,235,0.08)",
    color: "#2563eb",
    fontWeight: "600",
    marginBottom: "15px",
  },

  title: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "10px",
  },

  subtitle: {
    color: "#64748b",
    fontSize: "16px",
  },

  field: {
    marginBottom: "22px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "700",
    color: "#334155",
  },

  input: baseInput,

  textarea: {
    ...baseInput,
    resize: "vertical",
  },

  select: {
    ...baseInput,
    cursor: "pointer",
  },

  dateInput: {
    ...baseInput,
    cursor: "pointer",
    appearance: "auto",
    WebkitAppearance: "auto",
    colorScheme: "light",
  },

  button: {
    width: "100%",
    padding: "15px",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "16px",
    background:
      "linear-gradient(135deg, #2563eb, #7c3aed)",
    color: "white",
  },

  error: {
    marginTop: "18px",
    color: "#dc2626",
    textAlign: "center",
    fontWeight: "600",
  },
};

export default TaskForm;