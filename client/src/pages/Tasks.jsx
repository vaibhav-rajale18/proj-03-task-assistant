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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortOption, setSortOption] = useState("latest");

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

      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to load tasks.");
        setTasks([]);
      } else {
        setTasks(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error(error);
      setError("Unable to load tasks.");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = () => {
    fetchTasks();
    navigate("/tasks");
  };

  const handleBackHome = () => {
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setSortOption("latest");
  };

  useEffect(() => {
    const loadTasks = async () => {
      await fetchTasks();
    };

    loadTasks();
  }, []);

  const filteredTasks = [...tasks]
    .filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((task) =>
      statusFilter === "all"
        ? true
        : task.status === statusFilter
    )
    .filter((task) =>
      priorityFilter === "all"
        ? true
        : task.priority === priorityFilter
    )
    .sort((a, b) => {
      if (sortOption === "latest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      if (sortOption === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }

      if (sortOption === "dueDate") {
        return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
      }

      if (sortOption === "priority") {
        const priorityOrder = {
          high: 3,
          medium: 2,
          low: 1,
        };

        return (
          priorityOrder[b.priority] -
          priorityOrder[a.priority]
        );
      }

      return 0;
    });

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status !== "completed"
  ).length;

  return (
    <div style={styles.container}>
      <div style={styles.dashboard}>
        
        {/* Navigation */}
        <div style={styles.navigation}>
          <button
            onClick={handleBackHome}
            style={styles.button}
          >
            ← Back To Home
          </button>

          <button
            onClick={handleLogout}
            style={styles.button}
          >
            Logout
          </button>
        </div>

        {/* Create Mode */}
        {isCreateMode ? (
          <div style={{ marginTop: "40px" }}>
            <TaskForm onTaskCreated={handleTaskCreated} />
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={styles.header}>
              <h1 style={styles.title}>
                My Tasks
              </h1>

              <p style={styles.subtitle}>
                Stay organized and keep moving.
              </p>
            </div>

            {/* Summary */}
            <div style={styles.summaryCards}>
              <div style={styles.card}>
                <h3>Total Tasks</h3>
                <p style={styles.cardValue}>
                  {totalTasks}
                </p>
              </div>

              <div style={styles.card}>
                <h3>Pending Tasks</h3>
                <p style={styles.cardValue}>
                  {pendingTasks}
                </p>
              </div>

              <div style={styles.card}>
                <h3>Completed Tasks</h3>
                <p style={styles.cardValue}>
                  {completedTasks}
                </p>
              </div>
            </div>

            {/* Search */}
            <div style={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            {/* Status Filter */}
            <div style={styles.filterContainer}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="all">All Tasks</option>
                <option value="todo">Todo</option>
                <option value="inProgress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div style={styles.filterContainer}>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            {/* Sort */}
            <div style={styles.filterContainer}>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="latest">Latest Created</option>
                <option value="oldest">Oldest Created</option>
                <option value="dueDate">Due Date</option>
                <option value="priority">High Priority First</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div style={styles.filterContainer}>
              <button
                onClick={handleClearFilters}
                style={styles.clearButton}
              >
                Clear Filters
              </button>
            </div>

            {/* Tasks */}
            {loading ? (
              <p style={styles.message}>
                Loading your tasks...
              </p>
            ) : error ? (
              <p style={styles.message}>
                {error}
              </p>
            ) : filteredTasks.length === 0 ? (
              <p style={styles.message}>
                No tasks match your filters 🔍
                <br />
                Try adjusting or clearing filters.
              </p>
            ) : (
              <div style={styles.taskList}>
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onTaskUpdated={fetchTasks}
                  />
                ))}
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
    backgroundColor: "#f5f5f5",
    padding: "30px",
  },

  dashboard: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  navigation: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "30px",
  },

  header: {
    textAlign: "center",
    marginBottom: "40px",
  },

  title: {
    fontSize: "38px",
    color: "#222",
    marginBottom: "10px",
  },

  subtitle: {
    fontSize: "18px",
    color: "#666",
  },

  summaryCards: {
    display: "flex",
    justifyContent: "center",
    gap: "25px",
    flexWrap: "wrap",
    marginBottom: "40px",
  },

  card: {
    backgroundColor: "white",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "25px",
    minWidth: "200px",
    textAlign: "center",
  },

  cardValue: {
    fontSize: "32px",
    fontWeight: "bold",
    marginTop: "10px",
  },

  searchContainer: {
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center",
  },

  searchInput: {
    width: "100%",
    maxWidth: "500px",
    padding: "14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },

  filterContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },

  filterSelect: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    minWidth: "220px",
  },

  button: {
    padding: "12px 25px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  clearButton: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "#222",
    color: "white",
    fontSize: "15px",
  },

  taskList: {
    display: "grid",
    gap: "20px",
  },

  message: {
    textAlign: "center",
    fontSize: "18px",
    color: "#666",
  },
};

export default Tasks;