import { useState, useEffect } from "react";

const weekdaysList = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

const TaskForm = ({
  onTaskCreated,
  existingTask,
  onTaskUpdated,
}) => {
  const isEditMode = !!existingTask;

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [priority, setPriority] =
    useState("low");
  const [dueDate, setDueDate] =
    useState("");

  const [isRecurring, setIsRecurring] =
    useState(false);

  const [recurrenceType, setRecurrenceType] =
    useState("daily");

  const [
    selectedWeekdays,
    setSelectedWeekdays,
  ] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ✅ Prefill edit data
  // eslint-disable-next-line react-hooks/set-state-in-effect
  /* eslint-disable react-hooks/set-state-in-effect */
useEffect(() => {
  if (!existingTask) return;

  const {
    title = "",
    description = "",
    priority = "low",
    dueDate = "",
    isRecurring = false,
    recurrence = {},
  } = existingTask;

  setTitle(title);

  setDescription(description);

  setPriority(priority);

  setDueDate(
    dueDate
      ? dueDate.split("T")[0]
      : ""
  );

  setIsRecurring(isRecurring);

  setRecurrenceType(
    recurrence.type || "daily"
  );

  setSelectedWeekdays(
    recurrence.weekdays || []
  );

}, [existingTask]);
/* eslint-enable react-hooks/set-state-in-effect */

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("low");
    setDueDate("");

    setIsRecurring(false);
    setRecurrenceType("daily");
    setSelectedWeekdays([]);

    setError("");
  };

  const toggleWeekday = (day) => {
    if (selectedWeekdays.includes(day)) {
      setSelectedWeekdays(
        selectedWeekdays.filter(
          (item) => item !== day
        )
      );
    } else {
      setSelectedWeekdays([
        ...selectedWeekdays,
        day,
      ]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      setError(
        "Authorization token not found."
      );

      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: title.trim(),
        description:
          description.trim() || undefined,
        priority,
        dueDate: dueDate || undefined,
        isRecurring,
      };

      if (isRecurring) {
        payload.recurrence = {
          type: recurrenceType,
        };

        if (
          recurrenceType === "custom"
        ) {
          payload.recurrence.weekdays =
            selectedWeekdays;
        }
      }

      const url = isEditMode
        ? `http://localhost:5000/api/tasks/${existingTask._id}`
        : "http://localhost:5000/api/tasks";

      const method = isEditMode
        ? "PUT"
        : "POST";

      const response = await fetch(
        url,
        {
          method,
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            `Unable to ${
              isEditMode
                ? "update"
                : "create"
            } task.`
        );

        return;
      }

      if (isEditMode) {
        if (
          typeof onTaskUpdated ===
          "function"
        ) {
          onTaskUpdated(data);
        }
      } else {
        resetForm();

        if (
          typeof onTaskCreated ===
          "function"
        ) {
          onTaskCreated(data);
        }
      }

    } catch (error) {
      console.error(error);

      setError(
        `Unable to ${
          isEditMode
            ? "update"
            : "create"
        } task.`
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={styles.container}>
      <div style={styles.header}>
        <p style={styles.badge}>
          {isEditMode
            ? "✏️ Edit Task"
            : "✨ Create Something New"}
        </p>

        <h2 style={styles.title}>
          {isEditMode
            ? "Edit Task"
            : "Create New Task"}
        </h2>

        <p style={styles.subtitle}>
          {isEditMode
            ? "Update your task details."
            : "Add your next focus item."}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={styles.field}>
          <label style={styles.label}>
            Title *
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            style={styles.input}
            required
          />
        </div>

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

        <div style={styles.field}>
          <label style={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) =>
                setIsRecurring(
                  e.target.checked
                )
              }
            />

            <span>
              🔁 Repeat Task
            </span>
          </label>
        </div>

        {isRecurring && (
          <>
            <div style={styles.field}>
              <label style={styles.label}>
                Recurrence Type
              </label>

              <select
                value={recurrenceType}
                onChange={(e) =>
                  setRecurrenceType(
                    e.target.value
                  )
                }
                style={styles.select}
              >
                <option value="daily">
                  Daily
                </option>

                <option value="weekly">
                  Weekly
                </option>

                <option value="custom">
                  Custom Weekdays
                </option>
              </select>
            </div>

            {recurrenceType ===
              "custom" && (
              <div style={styles.field}>
                <label
                  style={styles.label}
                >
                  Select Days
                </label>

                <div
                  style={
                    styles.weekdayContainer
                  }
                >
                  {weekdaysList.map(
                    (day) => (
                      <button
                        type="button"
                        key={day}
                        onClick={() =>
                          toggleWeekday(day)
                        }
                        style={{
                          ...styles.weekdayButton,
                          background:
                            selectedWeekdays.includes(
                              day
                            )
                              ? "#2563eb"
                              : "#e2e8f0",
                          color:
                            selectedWeekdays.includes(
                              day
                            )
                              ? "#fff"
                              : "#0f172a",
                        }}
                      >
                        {day}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          style={styles.button}
        >
          {loading
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : isEditMode
            ? "Update Task"
            : "Create Task"}
        </button>

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

  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "700",
    color: "#334155",
  },

  weekdayContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "10px",
  },

  weekdayButton: {
    border: "none",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
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