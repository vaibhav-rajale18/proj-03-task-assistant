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
      setError("Authorization token not found. Please log in.");
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

      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || "Unable to create task.");
        return;
      }

      resetForm();

      if (typeof onTaskCreated === "function") {
        onTaskCreated(data);
      }
    } catch (fetchError) {
      console.error(fetchError);
      setError("Unable to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "20px",
      }}
    >
      <h2 style={{ marginBottom: "5px" }}>Create New Task</h2>
      <p style={{ marginBottom: "20px" }}>
        Add your next focus item.
      </p>

      <form onSubmit={handleSubmit}>
        
        {/* Title */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="task-title">
            <strong>Title *</strong>
          </label>
          <br />
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            style={{
              width: "100%",
              marginTop: "5px",
              padding: "8px",
            }}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="task-description">
            <strong>Description</strong>
          </label>
          <br />
          <textarea
            id="task-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows="3"
            style={{
              width: "100%",
              marginTop: "5px",
              padding: "8px",
            }}
          />
        </div>

        {/* Priority */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="task-priority">
            <strong>Priority</strong>
          </label>
          <br />
          <select
            id="task-priority"
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
            style={{
              width: "100%",
              marginTop: "5px",
              padding: "8px",
            }}
          >
            <option value="low">Low 🟢</option>
            <option value="medium">Medium 🟡</option>
            <option value="high">High 🔴</option>
          </select>
        </div>

        {/* Due Date */}
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="task-due-date">
            <strong>Due Date</strong>
          </label>
          <br />
          <input
            id="task-due-date"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            style={{
              width: "100%",
              marginTop: "5px",
              padding: "8px",
            }}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 18px",
          }}
        >
          {loading ? "Creating..." : "Create Task"}
        </button>

        {/* Error */}
        {error && (
          <p style={{ marginTop: "15px" }}>
            {error}
          </p>
        )}
      </form>
    </section>
  );
};

export default TaskForm;