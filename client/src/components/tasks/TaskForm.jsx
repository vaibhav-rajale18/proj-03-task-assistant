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
        setError(data.message || "Unable to create task.");
        return;
      }

      resetForm();

      if (typeof onTaskCreated === "function") {
        onTaskCreated(data);
      }

    } catch (error) {
      console.error(error);
      setError("Unable to create task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={styles.container}>
      
      <h2 style={styles.title}>
        Create New Task
      </h2>

      <p style={styles.subtitle}>
        Add your next focus item.
      </p>

      <form onSubmit={handleSubmit}>
        
        {/* Title */}
        <div style={styles.field}>
          <label style={styles.label}>
            Title *
          </label>

          <input
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            required
            style={styles.input}
          />
        </div>

        {/* Description */}
        <div style={styles.field}>
          <label style={styles.label}>
            Description
          </label>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            rows="4"
            style={styles.input}
          />
        </div>

        {/* Priority */}
        <div style={styles.field}>
          <label style={styles.label}>
            Priority
          </label>

          <select
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value)
            }
            style={styles.input}
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
            onChange={(event) =>
              setDueDate(event.target.value)
            }
            style={styles.input}
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

const styles = {
  container: {
    backgroundColor: "white",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "30px",
    maxWidth: "550px",
    margin: "0 auto",
  },

  title: {
    fontSize: "30px",
    color: "#222",
    marginBottom: "10px",
    textAlign: "center",
  },

  subtitle: {
    fontSize: "16px",
    color: "#666",
    textAlign: "center",
    marginBottom: "30px",
  },

  field: {
    marginBottom: "20px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#333",
  },

  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "15px",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
  },

  error: {
    marginTop: "15px",
    color: "red",
    textAlign: "center",
  },
};

export default TaskForm;