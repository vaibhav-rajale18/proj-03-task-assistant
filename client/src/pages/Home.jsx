import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
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

      if (response.ok) {
        setTasks(
          Array.isArray(data)
            ? data
            : []
        );
      }
    } catch (error) {
      console.error(
        "Dashboard task fetch failed:",
        error
      );
    }
  };

  useEffect(() => {
    const loadTasks = async () => {
      await fetchTasks();
    };

    loadTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleTasks = () => {
    navigate("/tasks");
  };

  const handleCreateTask = () => {
    navigate("/tasks?create=true");
  };

  const handleCalendar = () => {
    navigate("/calendar");
  };

  // 📊 Basic Stats
  const totalTasks = tasks.length;

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

  // 🔥 Productivity Analytics

  // Active streaks
  const activeStreaks =
    tasks.filter(
      (task) =>
        task.isRecurring &&
        task.streak?.current > 0
    ).length;

  // Longest streak
  const longestStreak =
    tasks.reduce(
      (max, task) => {
        const streak =
          task.streak?.longest || 0;

        return streak > max
          ? streak
          : max;
      },
      0
    );

  // Recurring habits
  const recurringHabits =
    tasks.filter(
      (task) =>
        task.isRecurring
    ).length;

  // Completed today
  const today =
    new Date().toDateString();

  const completedToday =
    tasks.filter((task) =>
      task.completionHistory?.some(
        (date) =>
          new Date(
            date
          ).toDateString() ===
          today
      )
    ).length;

  // Most consistent habit
  const mostConsistentTask =
    tasks.reduce(
      (best, task) => {
        const currentLongest =
          task.streak?.longest || 0;

        const bestLongest =
          best?.streak
            ?.longest || 0;

        return currentLongest >
          bestLongest
          ? task
          : best;
      },
      null
    );

  return (
    <div style={styles.container}>
      <div style={styles.dashboard}>

        {/* Hero */}
        <div style={styles.hero}>

          <p style={styles.badge}>
            🚀 Personal Productivity Hub
          </p>

          <h1 style={styles.welcomeTitle}>
            Welcome back 👋
          </h1>

          <p style={styles.welcomeSubtitle}>
            Organize your day. Focus on what matters.
          </p>

        </div>

        {/* Basic Stats */}
        <div style={styles.summaryCards}>

          <div style={styles.card}>
            <p style={styles.cardEmoji}>
              📋
            </p>

            <h3 style={styles.cardTitle}>
              Total Tasks
            </h3>

            <p style={styles.cardValue}>
              {totalTasks}
            </p>
          </div>

          <div style={styles.card}>
            <p style={styles.cardEmoji}>
              ⏳
            </p>

            <h3 style={styles.cardTitle}>
              Pending
            </h3>

            <p style={styles.cardValue}>
              {pendingTasks}
            </p>
          </div>

          <div style={styles.card}>
            <p style={styles.cardEmoji}>
              ✅
            </p>

            <h3 style={styles.cardTitle}>
              Completed
            </h3>

            <p style={styles.cardValue}>
              {completedTasks}
            </p>
          </div>

        </div>

        {/* 🔥 Productivity Analytics */}
        <div style={styles.analyticsSection}>

          <h2 style={styles.analyticsTitle}>
            🔥 Productivity Insights
          </h2>

          <div style={styles.analyticsCards}>

            <div style={styles.analyticsCard}>
              <p style={styles.analyticsEmoji}>
                🔥
              </p>

              <h3 style={styles.analyticsLabel}>
                Active Streaks
              </h3>

              <p style={styles.analyticsValue}>
                {activeStreaks}
              </p>
            </div>

            <div style={styles.analyticsCard}>
              <p style={styles.analyticsEmoji}>
                🏆
              </p>

              <h3 style={styles.analyticsLabel}>
                Best Streak
              </h3>

              <p style={styles.analyticsValue}>
                {longestStreak}
              </p>
            </div>

            <div style={styles.analyticsCard}>
              <p style={styles.analyticsEmoji}>
                📈
              </p>

              <h3 style={styles.analyticsLabel}>
                Completed Today
              </h3>

              <p style={styles.analyticsValue}>
                {completedToday}
              </p>
            </div>

            <div style={styles.analyticsCard}>
              <p style={styles.analyticsEmoji}>
                🔁
              </p>

              <h3 style={styles.analyticsLabel}>
                Active Habits
              </h3>

              <p style={styles.analyticsValue}>
                {recurringHabits}
              </p>
            </div>

          </div>

          {/* Smart Insight */}
          {mostConsistentTask && (
            <div style={styles.insightBox}>

              <h3 style={styles.insightTitle}>
                ⚡ Most Consistent Habit
              </h3>

              <p style={styles.insightText}>
                {mostConsistentTask.title}
              </p>

              <p style={styles.insightSubtext}>
                🔥 {
                  mostConsistentTask
                    .streak
                    ?.longest
                } day best streak
              </p>

            </div>
          )}

        </div>

        {/* Actions */}
        <div style={styles.buttons}>

          <button
            onClick={handleTasks}
            style={styles.primaryButton}
          >
            📂 My Tasks
          </button>

          <button
            onClick={handleCreateTask}
            style={styles.secondaryButton}
          >
            ➕ Create Task
          </button>

          <button
            onClick={handleCalendar}
            style={styles.calendarButton}
          >
            📅 Calendar
          </button>

          <button
            onClick={handleLogout}
            style={styles.logoutButton}
          >
            Logout
          </button>

        </div>

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
    maxWidth: "1200px",
    margin: "0 auto",
  },

  hero: {
    textAlign: "center",
    marginBottom: "60px",
  },

  badge: {
    display: "inline-block",
    padding: "10px 18px",
    background:
      "rgba(37, 99, 235, 0.1)",
    color: "#2563eb",
    borderRadius: "999px",
    fontWeight: "600",
    marginBottom: "20px",
    fontSize: "14px",
  },

  welcomeTitle: {
    fontSize: "52px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "15px",
    letterSpacing: "-1px",
  },

  welcomeSubtitle: {
    fontSize: "20px",
    color: "#475569",
  },

  summaryCards: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    flexWrap: "wrap",
    marginBottom: "50px",
  },

  card: {
    width: "240px",
    padding: "35px",
    borderRadius: "22px",
    background:
      "rgba(255,255,255,0.8)",
    backdropFilter: "blur(10px)",
    border:
      "1px solid rgba(255,255,255,0.4)",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
    textAlign: "center",
  },

  cardEmoji: {
    fontSize: "28px",
    marginBottom: "12px",
  },

  cardTitle: {
    fontSize: "16px",
    color: "#64748b",
    marginBottom: "12px",
    fontWeight: "600",
  },

  cardValue: {
    fontSize: "40px",
    fontWeight: "800",
    color: "#0f172a",
  },

  // 🔥 Analytics
  analyticsSection: {
    marginBottom: "60px",
  },

  analyticsTitle: {
    textAlign: "center",
    fontSize: "34px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "35px",
  },

  analyticsCards: {
    display: "flex",
    justifyContent: "center",
    gap: "25px",
    flexWrap: "wrap",
    marginBottom: "35px",
  },

  analyticsCard: {
    width: "220px",
    padding: "28px",
    borderRadius: "22px",
    background:
      "rgba(255,255,255,0.85)",
    border:
      "1px solid rgba(255,255,255,0.4)",
    boxShadow:
      "0 10px 25px rgba(0,0,0,0.08)",
    textAlign: "center",
  },

  analyticsEmoji: {
    fontSize: "30px",
    marginBottom: "12px",
  },

  analyticsLabel: {
    fontSize: "16px",
    color: "#64748b",
    marginBottom: "10px",
    fontWeight: "600",
  },

  analyticsValue: {
    fontSize: "38px",
    fontWeight: "800",
    color: "#ea580c",
  },

  // ⚡ Insight Box
  insightBox: {
    maxWidth: "700px",
    margin: "0 auto",
    padding: "30px",
    borderRadius: "24px",
    background:
      "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
    border:
      "1px solid rgba(251,146,60,0.25)",
    textAlign: "center",
    boxShadow:
      "0 10px 25px rgba(251,146,60,0.12)",
  },

  insightTitle: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#9a3412",
    marginBottom: "12px",
  },

  insightText: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#ea580c",
    marginBottom: "10px",
  },

  insightSubtext: {
    fontSize: "16px",
    color: "#9a3412",
    fontWeight: "600",
  },

  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  primaryButton: {
    padding: "16px 30px",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    background: "#2563eb",
    color: "white",
    fontWeight: "700",
    fontSize: "15px",
  },

  secondaryButton: {
    padding: "16px 30px",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    background: "#10b981",
    color: "white",
    fontWeight: "700",
    fontSize: "15px",
  },

  calendarButton: {
    padding: "16px 30px",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    background: "#7c3aed",
    color: "white",
    fontWeight: "700",
    fontSize: "15px",
  },

  logoutButton: {
    padding: "16px 30px",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    background: "#0f172a",
    color: "white",
    fontWeight: "700",
    fontSize: "15px",
  },
};

export default Home;