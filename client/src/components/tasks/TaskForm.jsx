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
  const isEditMode =
    !!existingTask;

  const [title, setTitle] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [priority, setPriority] =
    useState("low");

  const [dueDate, setDueDate] =
    useState("");

  const [isRecurring, setIsRecurring] =
    useState(false);

  const [
    recurrenceType,
    setRecurrenceType,
  ] = useState("daily");

  const [
    selectedWeekdays,
    setSelectedWeekdays,
  ] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const motivationQuotes = [
    "🔥 Progress begins with one focused task.",
    "🚀 Small wins create massive momentum.",
    "⚡ Focus on consistency, not perfection.",
    "🎯 Plan deeply. Execute daily.",
    "🏆 Organized days build successful lives.",
    "💡 Your future is shaped by today’s habits.",
  ];

  const [randomQuote] =
  useState(() => {
    return motivationQuotes[
      Math.floor(
        Math.random() *
          motivationQuotes.length
      )
    ];
  });

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
    if (
      selectedWeekdays.includes(day)
    ) {
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

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError(
        "Title is required."
      );
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

    setLoading(true);

    try {
      const payload = {
        title: title.trim(),
        description:
          description.trim() ||
          undefined,
        priority,
        dueDate:
          dueDate || undefined,
        isRecurring,
      };

      if (isRecurring) {
        payload.recurrence = {
          type: recurrenceType,
        };

        if (
          recurrenceType ===
          "custom"
        ) {
          payload.recurrence.weekdays =
            selectedWeekdays;
        }
      }

      const url = isEditMode
        ? `http://localhost:5000/api/tasks/${existingTask._id}`
        : "http://localhost:5000/api/tasks";

      const method =
        isEditMode
          ? "PUT"
          : "POST";

      const response =
        await fetch(url, {
          method,
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(
            payload
          ),
        });

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
    <section style={styles.page}>
      <div
        style={
          styles.backgroundGlow1
        }
      />

      <div
        style={
          styles.backgroundGlow2
        }
      />

      <section
        style={styles.container}
      >
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

          <p
            style={styles.subtitle}
          >
            {isEditMode
              ? "Update your task details."
              : "Design your next productive move."}
          </p>

          <div
            style={styles.quoteBox}
          >
            <p
              style={
                styles.quoteText
              }
            >
              {randomQuote}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
        >
          <div
            style={styles.field}
          >
            <label
              style={styles.label}
            >
              Task Title *
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
              placeholder="Enter task title"
              required
            />
          </div>

          <div
            style={styles.field}
          >
            <label
              style={styles.label}
            >
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
              style={
                styles.textarea
              }
              placeholder="Describe your task..."
            />
          </div>

          <div
            style={styles.field}
          >
            <label
              style={styles.label}
            >
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

          <div
            style={styles.field}
          >
            <label
              style={styles.label}
            >
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
              style={
                styles.dateInput
              }
            />
          </div>

          <div
            style={styles.recurringCard}
          >
            <label
              style={
                styles.checkboxRow
              }
            >
              <input
                type="checkbox"
                checked={
                  isRecurring
                }
                onChange={(e) =>
                  setIsRecurring(
                    e.target.checked
                  )
                }
              />

              <span>
                🔁 Make this a recurring habit
              </span>
            </label>

            {isRecurring && (
              <>
                <div
                  style={
                    styles.field
                  }
                >
                  <label
                    style={
                      styles.label
                    }
                  >
                    Recurrence Type
                  </label>

                  <select
                    value={
                      recurrenceType
                    }
                    onChange={(e) =>
                      setRecurrenceType(
                        e.target.value
                      )
                    }
                    style={
                      styles.select
                    }
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
                  <div
                    style={
                      styles.field
                    }
                  >
                    <label
                      style={
                        styles.label
                      }
                    >
                      Select Days
                    </label>

                    <div
                      style={
                        styles.weekdayContainer
                      }
                    >
                      {weekdaysList.map(
                        (
                          day
                        ) => (
                          <button
                            type="button"
                            key={day}
                            onClick={() =>
                              toggleWeekday(
                                day
                              )
                            }
                            style={{
                              ...styles.weekdayButton,
                              background:
                                selectedWeekdays.includes(
                                  day
                                )
                                  ? "linear-gradient(135deg, #2563eb, #7c3aed)"
                                  : "rgba(255,255,255,0.7)",
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
          </div>

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translateY(0px)";
            }}
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
    </section>
  );
};

const baseInput = {
  width: "100%",
  padding: "16px 18px",
  borderRadius: "16px",
  border:
    "1px solid rgba(203,213,225,0.7)",
  fontSize: "15px",
  boxSizing: "border-box",
  background:
    "rgba(255,255,255,0.85)",
  color: "#0f172a",
  outline: "none",
  transition:
    "all 0.25s ease",
  boxShadow:
    "0 4px 12px rgba(0,0,0,0.03)",
};

const styles = {
  page: {
    position: "relative",
    overflow: "hidden",
  },

  backgroundGlow1: {
    position: "absolute",
    width: "350px",
    height: "350px",
    background:
      "rgba(124,58,237,0.12)",
    borderRadius: "50%",
    filter: "blur(80px)",
    top: "-120px",
    left: "-120px",
  },

  backgroundGlow2: {
    position: "absolute",
    width: "320px",
    height: "320px",
    background:
      "rgba(37,99,235,0.1)",
    borderRadius: "50%",
    filter: "blur(80px)",
    bottom: "-120px",
    right: "-120px",
  },

  container: {
    position: "relative",
    zIndex: 2,
    background:
      "rgba(255,255,255,0.75)",
    backdropFilter:
      "blur(14px)",
    borderRadius: "32px",
    padding: "45px",
    maxWidth: "700px",
    margin: "0 auto",
    border:
      "1px solid rgba(255,255,255,0.45)",
    boxShadow:
      "0 15px 40px rgba(0,0,0,0.08)",
  },

  header: {
    textAlign: "center",
    marginBottom: "35px",
  },

  badge: {
    display: "inline-block",
    padding: "10px 18px",
    borderRadius: "999px",
    background:
      "rgba(37,99,235,0.08)",
    color: "#2563eb",
    fontWeight: "700",
    marginBottom: "18px",
    fontSize: "14px",
  },

  title: {
    fontSize: "48px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "12px",
    letterSpacing: "-1px",
  },

  subtitle: {
    color: "#64748b",
    fontSize: "17px",
    marginBottom: "24px",
  },

  quoteBox: {
    padding: "18px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(37,99,235,0.08))",
    border:
      "1px solid rgba(124,58,237,0.08)",
    boxShadow:
      "0 6px 18px rgba(124,58,237,0.06)",
  },

  quoteText: {
    textAlign: "center",
    fontSize: "15px",
    fontWeight: "700",
    color: "#4c1d95",
    lineHeight: "1.6",
  },

  field: {
    marginBottom: "24px",
  },

  label: {
    display: "block",
    marginBottom: "10px",
    fontWeight: "700",
    color: "#334155",
    fontSize: "15px",
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
    WebkitAppearance:
      "auto",
    colorScheme: "light",
  },

  recurringCard: {
    background:
      "rgba(255,255,255,0.55)",
    border:
      "1px solid rgba(255,255,255,0.45)",
    borderRadius: "24px",
    padding: "24px",
    marginBottom: "28px",
    boxShadow:
      "0 8px 25px rgba(0,0,0,0.05)",
  },

  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontWeight: "700",
    color: "#334155",
    marginBottom: "18px",
  },

  weekdayContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "12px",
  },

  weekdayButton: {
    border: "none",
    padding: "12px 16px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "700",
    transition:
      "all 0.25s ease",
    boxShadow:
      "0 4px 12px rgba(0,0,0,0.04)",
  },

  button: {
    width: "100%",
    padding: "17px",
    border: "none",
    borderRadius: "18px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "16px",
    background:
      "linear-gradient(135deg, #2563eb, #7c3aed)",
    color: "white",
    boxShadow:
      "0 10px 25px rgba(37,99,235,0.2)",
    transition:
      "all 0.25s ease",
  },

  error: {
    marginTop: "18px",
    color: "#dc2626",
    textAlign: "center",
    fontWeight: "700",
    background:
      "rgba(254,226,226,0.8)",
    padding: "12px",
    borderRadius: "14px",
  },
};

export default TaskForm;