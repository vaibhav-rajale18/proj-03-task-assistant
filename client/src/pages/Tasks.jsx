import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TaskForm from "../components/tasks/TaskForm";
import TaskCard from "../components/tasks/TaskCard";

const Tasks = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isCreateMode =
    new URLSearchParams(location.search).get("create") === "true";

  const [tasks, setTasks] = useState([]);

  // 🔍 Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortOption, setSortOption] = useState("smart");
  const [showRecurringOnly, setShowRecurringOnly] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No authorization token found.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/tasks",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to load tasks."
        );

        setTasks([]);
      } else {
        setTasks(
          Array.isArray(data)
            ? data
            : []
        );
      }

    } catch (error) {
      console.error(error);

      setError(
        "Unable to load tasks."
      );

      setTasks([]);

    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = () => {
    fetchTasks();

    navigate("/tasks");
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setSortOption("smart");
    setShowRecurringOnly(false);
  };

  useEffect(() => {
    const loadTasks = async () => {
      await fetchTasks();
    };

    loadTasks();
  }, []);

  // 🚀 Smart Priority Score
  const getTaskPriorityScore = (task) => {
    let score = 0;

    const now = new Date();

    // 🚨 Overdue tasks
    if (
      task.dueDate &&
      task.status !== "completed" &&
      new Date(task.dueDate) < now
    ) {
      score += 100;
    }

    // ⏰ Due within 24 hours
    if (
      task.dueDate &&
      task.status !== "completed"
    ) {
      const dueDate =
        new Date(task.dueDate);

      const difference =
        dueDate.getTime() -
        now.getTime();

      const hoursRemaining =
        difference /
        (1000 * 60 * 60);

      if (
        hoursRemaining > 0 &&
        hoursRemaining <= 24
      ) {
        score += 70;
      }
    }

    // 🔥 High priority
    if (task.priority === "high") {
      score += 50;
    }

    if (
      task.priority === "medium"
    ) {
      score += 30;
    }

    // 🔁 Recurring habits
    if (
      task.isRecurring &&
      task.status !== "completed"
    ) {
      score += 20;
    }

    return score;
  };

  // 🚀 Smart Filter + Search + Sort Engine
  const filteredTasks = [...tasks]
    .filter((task) => {
      const query =
        searchQuery.toLowerCase();

      return (
        task.title
          ?.toLowerCase()
          .includes(query) ||
        task.description
          ?.toLowerCase()
          .includes(query)
      );
    })

    .filter((task) =>
      statusFilter === "all"
        ? true
        : task.status ===
          statusFilter
    )

    .filter((task) =>
      priorityFilter === "all"
        ? true
        : task.priority ===
          priorityFilter
    )

    .filter((task) =>
      showRecurringOnly
        ? task.isRecurring
        : true
    )

    .sort((a, b) => {

      // 🚀 Smart Prioritization
      if (
        sortOption === "smart"
      ) {
        return (
          getTaskPriorityScore(
            b
          ) -
          getTaskPriorityScore(
            a
          )
        );
      }

      if (
        sortOption === "latest"
      ) {
        return (
          new Date(
            b.createdAt
          ) -
          new Date(
            a.createdAt
          )
        );
      }

      if (
        sortOption === "oldest"
      ) {
        return (
          new Date(
            a.createdAt
          ) -
          new Date(
            b.createdAt
          )
        );
      }

      if (
        sortOption === "dueDate"
      ) {
        return (
          new Date(
            a.dueDate || 0
          ) -
          new Date(
            b.dueDate || 0
          )
        );
      }

      if (
        sortOption === "priority"
      ) {
        const order = {
          high: 3,
          medium: 2,
          low: 1,
        };

        return (
          order[
            b.priority
          ] -
          order[
            a.priority
          ]
        );
      }

      return 0;
    });

  const totalTasks =
    tasks.length;

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status ===
        "completed"
    ).length;

  const pendingTasks =
    tasks.filter(
      (task) =>
        task.status !==
        "completed"
    ).length;

  const recurringTasks =
    tasks.filter(
      (task) =>
        task.isRecurring
    ).length;

  return (
    <div style={styles.container}>
      <div style={styles.dashboard}>

        {/* Top Nav */}
        <div style={styles.navigation}>

          <button
            onClick={() =>
              navigate("/")
            }
            style={
              styles.navButton
            }
          >
            ← Home
          </button>

          <button
            onClick={() => {
              localStorage.removeItem(
                "token"
              );

              navigate(
                "/login"
              );
            }}
            style={
              styles.logoutButton
            }
          >
            Logout
          </button>

        </div>

        {/* Create Mode */}
        {isCreateMode ? (
          <TaskForm
            onTaskCreated={
              handleTaskCreated
            }
          />
        ) : (
          <>
            {/* Header */}
            <div style={styles.header}>
              <h1 style={styles.title}>
                My Tasks
              </h1>

              <p style={styles.subtitle}>
                Stay focused and execute.
              </p>
            </div>

            {/* Stats */}
            <div style={styles.summaryCards}>

              <div style={styles.card}>
                📋
                <h3>
                  {totalTasks}
                </h3>
                <p>Total</p>
              </div>

              <div style={styles.card}>
                ⏳
                <h3>
                  {pendingTasks}
                </h3>
                <p>Pending</p>
              </div>

              <div style={styles.card}>
                ✅
                <h3>
                  {completedTasks}
                </h3>
                <p>Done</p>
              </div>

              <div style={styles.card}>
                🔁
                <h3>
                  {recurringTasks}
                </h3>
                <p>Recurring</p>
              </div>

            </div>

            {/* Filters */}
            <div style={styles.toolbar}>

              <input
                type="text"
                placeholder="Search tasks..."
                value={
                  searchQuery
                }
                onChange={(
                  e
                ) =>
                  setSearchQuery(
                    e.target
                      .value
                  )
                }
                style={
                  styles.searchInput
                }
              />

              <select
                value={
                  statusFilter
                }
                onChange={(
                  e
                ) =>
                  setStatusFilter(
                    e.target
                      .value
                  )
                }
                style={
                  styles.select
                }
              >
                <option value="all">
                  All Status
                </option>

                <option value="todo">
                  Todo
                </option>

                <option value="completed">
                  Completed
                </option>
              </select>

              <select
                value={
                  priorityFilter
                }
                onChange={(
                  e
                ) =>
                  setPriorityFilter(
                    e.target
                      .value
                  )
                }
                style={
                  styles.select
                }
              >
                <option value="all">
                  All Priority
                </option>

                <option value="high">
                  High
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="low">
                  Low
                </option>
              </select>

              <select
                value={
                  sortOption
                }
                onChange={(
                  e
                ) =>
                  setSortOption(
                    e.target
                      .value
                  )
                }
                style={
                  styles.select
                }
              >
                <option value="smart">
                  Smart Priority
                </option>

                <option value="latest">
                  Latest
                </option>

                <option value="oldest">
                  Oldest
                </option>

                <option value="dueDate">
                  Due Date
                </option>

                <option value="priority">
                  Priority
                </option>
              </select>

              {/* 🔁 Recurring Toggle */}
              <button
                onClick={() =>
                  setShowRecurringOnly(
                    !showRecurringOnly
                  )
                }
                style={{
                  ...styles.recurringButton,
                  background:
                    showRecurringOnly
                      ? "#7c3aed"
                      : "#e2e8f0",
                  color:
                    showRecurringOnly
                      ? "white"
                      : "#0f172a",
                }}
              >
                🔁 Recurring Only
              </button>

              <button
                onClick={
                  handleClearFilters
                }
                style={
                  styles.clearButton
                }
              >
                Reset
              </button>

            </div>

            {/* Results */}
            <p style={styles.resultsText}>
              Showing{" "}
              {
                filteredTasks.length
              }{" "}
              task
              {filteredTasks.length !==
              1
                ? "s"
                : ""}
            </p>

            {/* Tasks */}
            {loading ? (
              <p style={styles.message}>
                Loading...
              </p>
            ) : error ? (
              <p style={styles.message}>
                {error}
              </p>
            ) : filteredTasks.length ===
              0 ? (
              <p style={styles.message}>
                No tasks found.
              </p>
            ) : (
              <div style={styles.taskList}>
                {filteredTasks.map(
                  (task) => (
                    <TaskCard
                      key={
                        task._id
                      }
                      task={
                        task
                      }
                      onTaskUpdated={
                        fetchTasks
                      }
                    />
                  )
                )}
              </div>
            )}

          </>
        )}

      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    padding: "40px",
    background:
      "linear-gradient(135deg, #eef2ff 0%, #f8fafc 50%, #e0f2fe 100%)",
  },

  dashboard: {
    maxWidth: "1300px",
    margin: "0 auto",
  },

  navigation: {
    display: "flex",
    justifyContent:
      "space-between",
    marginBottom: "40px",
  },

  navButton: {
    padding: "14px 24px",
    border: "none",
    borderRadius: "12px",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontWeight: "700",
  },

  logoutButton: {
    padding: "14px 24px",
    border: "none",
    borderRadius: "12px",
    background: "#0f172a",
    color: "white",
    cursor: "pointer",
    fontWeight: "700",
  },

  header: {
    textAlign: "center",
    marginBottom: "40px",
  },

  title: {
    fontSize: "48px",
    fontWeight: "800",
    color: "#0f172a",
  },

  subtitle: {
    color: "#64748b",
    fontSize: "18px",
  },

  summaryCards: {
    display: "flex",
    justifyContent:
      "center",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "35px",
  },

  card: {
    width: "180px",
    padding: "25px",
    borderRadius: "20px",
    background:
      "rgba(255,255,255,0.85)",
    textAlign: "center",
    boxShadow:
      "0 8px 20px rgba(0,0,0,0.08)",
    fontSize: "24px",
    fontWeight: "700",
  },

  toolbar: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
    justifyContent:
      "center",
    marginBottom: "25px",
  },

  searchInput: {
    padding: "14px",
    borderRadius: "12px",
    border:
      "1px solid #cbd5e1",
    minWidth: "260px",
    fontSize: "15px",
  },

  select: {
    padding: "14px",
    borderRadius: "12px",
    border:
      "1px solid #cbd5e1",
    fontSize: "15px",
  },

  recurringButton: {
    padding: "14px 18px",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
    transition: "0.2s ease",
  },

  clearButton: {
    padding: "14px 20px",
    border: "none",
    borderRadius: "12px",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
    fontWeight: "700",
  },

  resultsText: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#475569",
    fontWeight: "600",
    fontSize: "16px",
  },

  taskList: {
    display: "grid",
    gap: "20px",
  },

  message: {
    textAlign: "center",
    fontSize: "18px",
    color: "#64748b",
  },
};

export default Tasks;