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

  // 📈 Productivity Score
  const productivityPercentage =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks /
            totalTasks) *
            100
        );

  // 💬 Productivity Message
  let productivityMessage =
    "🚀 Small steps still matter.";

  if (
    productivityPercentage >= 80
  ) {
    productivityMessage =
      "🔥 Amazing productivity today!";
  } else if (
    productivityPercentage >= 50
  ) {
    productivityMessage =
      "⚡ You're making solid progress!";
  }

  // 🔥 Productivity Analytics
  const activeStreaks =
    tasks.filter(
      (task) =>
        task.isRecurring &&
        task.streak?.current > 0
    ).length;

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

  const recurringHabits =
    tasks.filter(
      (task) =>
        task.isRecurring
    ).length;

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

  // 🏆 Achievement System
  const achievements = [];

  if (longestStreak >= 7) {
    achievements.push(
      "🔥 7 Day Streak"
    );
  }

  if (completedTasks >= 10) {
    achievements.push(
      "✅ Completed 10 Tasks"
    );
  }

  if (
    productivityPercentage >= 80
  ) {
    achievements.push(
      "🎯 Productivity Master"
    );
  }

  // 🚨 Overdue Tasks
  const overdueTasks =
    tasks.filter((task) => {
      if (
        !task.dueDate ||
        task.status ===
          "completed"
      ) {
        return false;
      }

      return (
        new Date(task.dueDate) <
        new Date()
      );
    });

  // ⏰ Due Today
  const dueTodayTasks =
    tasks.filter((task) => {
      if (
        !task.dueDate ||
        task.status ===
          "completed"
      ) {
        return false;
      }

      return (
        new Date(
          task.dueDate
        ).toDateString() === today
      );
    });

  // 🔥 Streaks At Risk
  const streakRiskTasks =
    tasks.filter((task) => {
      if (
        !task.isRecurring ||
        task.status ===
          "completed"
      ) {
        return false;
      }

      const completedToday =
        task.completionHistory?.some(
          (date) =>
            new Date(
              date
            ).toDateString() ===
            today
        );

      return !completedToday;
    });

  // 🚀 Dynamic Insight Engine
  let dynamicInsight =
    "🚀 Start completing habits to build streaks";

  if (activeStreaks > 0) {
    dynamicInsight =
      `🔥 You're maintaining ${activeStreaks} active streaks`;
  }

  if (completedToday > 0) {
    dynamicInsight =
      `🎯 You completed ${completedToday} task${
        completedToday > 1
          ? "s"
          : ""
      } today`;
  }

  if (longestStreak >= 5) {
    dynamicInsight =
      `🏆 Your consistency is improving with a ${longestStreak} day streak`;
  }

  // ⚡ Productivity Feed
  const productivityFeed = [];

  if (overdueTasks.length > 0) {
    productivityFeed.push(
      `🚨 You have ${overdueTasks.length} overdue task${
        overdueTasks.length > 1
          ? "s"
          : ""
      }. Clear them to stay on track.`
    );
  }

  if (dueTodayTasks.length > 0) {
    productivityFeed.push(
      `⏰ ${dueTodayTasks.length} task${
        dueTodayTasks.length > 1
          ? "s are"
          : " is"
      } due today.`
    );
  }

  if (activeStreaks > 0) {
    productivityFeed.push(
      `🔥 You're maintaining ${activeStreaks} active streak${
        activeStreaks > 1
          ? "s"
          : ""
      }. Keep the momentum going.`
    );
  }

  if (completedToday > 0) {
    productivityFeed.push(
      `🎯 Great work! You've completed ${completedToday} task${
        completedToday > 1
          ? "s"
          : ""
      } today.`
    );
  }

  if (productivityFeed.length === 0) {
    productivityFeed.push(
      "🚀 Start completing tasks to build productivity momentum."
    );
  }

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

        {/* 🔔 Reminder Section */}
        <div style={styles.reminderSection}>

          <h2 style={styles.reminderTitle}>
            🔔 Today's Reminders
          </h2>

          <div style={styles.reminderCards}>

            <div style={styles.overdueCard}>
              <p style={styles.reminderEmoji}>
                🚨
              </p>

              <h3 style={styles.reminderLabel}>
                Overdue Tasks
              </h3>

              <p style={styles.reminderValue}>
                {overdueTasks.length}
              </p>
            </div>

            <div style={styles.dueTodayCard}>
              <p style={styles.reminderEmoji}>
                ⏰
              </p>

              <h3 style={styles.reminderLabel}>
                Due Today
              </h3>

              <p style={styles.reminderValue}>
                {dueTodayTasks.length}
              </p>
            </div>

            <div style={styles.streakRiskCard}>
              <p style={styles.reminderEmoji}>
                🔥
              </p>

              <h3 style={styles.reminderLabel}>
                Streaks At Risk
              </h3>

              <p style={styles.reminderValue}>
                {streakRiskTasks.length}
              </p>
            </div>

          </div>

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

        {/* 📈 Productivity Score */}
        <div style={styles.progressSection}>

          <h2 style={styles.progressTitle}>
            📈 Productivity Score
          </h2>

          <div style={styles.progressCard}>

            <div style={styles.progressBarBackground}>
              <div
                style={{
                  ...styles.progressBarFill,
                  width: `${productivityPercentage}%`,
                }}
              />
            </div>

            <p style={styles.progressText}>
              {productivityPercentage}% completed
            </p>

            <p style={styles.progressMessage}>
              {productivityMessage}
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

              <p style={styles.dynamicInsight}>
                {dynamicInsight}
              </p>

            </div>
          )}

          {/* ⚡ Productivity Feed */}
          <div style={styles.feedSection}>

            <h2 style={styles.feedTitle}>
              ⚡ Productivity Feed
            </h2>

            <div style={styles.feedContainer}>

              {productivityFeed.map(
                (message, index) => (
                  <div
                    key={index}
                    style={styles.feedItem}
                  >
                    {message}
                  </div>
                )
              )}

            </div>

          </div>

          {/* 🏆 Achievements */}
          <div style={styles.achievementSection}>

            <h2 style={styles.achievementTitle}>
              🏆 Achievements
            </h2>

            <div style={styles.achievementContainer}>

              {achievements.length ===
              0 ? (
                <div style={styles.emptyAchievement}>
                  🚀 Complete more tasks to unlock achievements.
                </div>
              ) : (
                achievements.map(
                  (
                    achievement,
                    index
                  ) => (
                    <div
                      key={index}
                      style={styles.achievementBadge}
                    >
                      {achievement}
                    </div>
                  )
                )
              )}

            </div>

          </div>

        </div>

        {/* ⚡ Quick Actions */}
        <div style={styles.quickActionsSection}>

          <h2 style={styles.quickActionsTitle}>
            ⚡ Quick Actions
          </h2>

          <div style={styles.quickActionsGrid}>

            <div
              style={styles.quickActionCard}
              onClick={handleCreateTask}
            >
              ➕ Create New Task
            </div>

            <div
              style={styles.quickActionCard}
              onClick={handleTasks}
            >
              📂 Open My Tasks
            </div>

            <div
              style={styles.quickActionCard}
              onClick={handleCalendar}
            >
              📅 Open Calendar
            </div>

            <div
              style={styles.quickActionCard}
              onClick={handleLogout}
            >
              🚪 Logout
            </div>

          </div>

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

  reminderSection: {
    marginBottom: "50px",
  },

  reminderTitle: {
    textAlign: "center",
    fontSize: "34px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "30px",
  },

  reminderCards: {
    display: "flex",
    justifyContent: "center",
    gap: "25px",
    flexWrap: "wrap",
  },

  overdueCard: {
    width: "240px",
    padding: "28px",
    borderRadius: "22px",
    background:
      "rgba(254,226,226,0.8)",
    border:
      "1px solid rgba(220,38,38,0.2)",
    textAlign: "center",
    boxShadow:
      "0 10px 25px rgba(220,38,38,0.08)",
  },

  dueTodayCard: {
    width: "240px",
    padding: "28px",
    borderRadius: "22px",
    background:
      "rgba(254,243,199,0.8)",
    border:
      "1px solid rgba(217,119,6,0.2)",
    textAlign: "center",
    boxShadow:
      "0 10px 25px rgba(217,119,6,0.08)",
  },

  streakRiskCard: {
    width: "240px",
    padding: "28px",
    borderRadius: "22px",
    background:
      "rgba(255,237,213,0.85)",
    border:
      "1px solid rgba(234,88,12,0.2)",
    textAlign: "center",
    boxShadow:
      "0 10px 25px rgba(234,88,12,0.08)",
  },

  reminderEmoji: {
    fontSize: "30px",
    marginBottom: "12px",
  },

  reminderLabel: {
    fontSize: "16px",
    color: "#475569",
    marginBottom: "10px",
    fontWeight: "700",
  },

  reminderValue: {
    fontSize: "42px",
    fontWeight: "800",
    color: "#0f172a",
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

  progressSection: {
    marginBottom: "55px",
  },

  progressTitle: {
    textAlign: "center",
    fontSize: "34px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "25px",
  },

  progressCard: {
    maxWidth: "750px",
    margin: "0 auto",
    padding: "30px",
    borderRadius: "24px",
    background:
      "rgba(255,255,255,0.85)",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
  },

  progressBarBackground: {
    width: "100%",
    height: "18px",
    borderRadius: "999px",
    background: "#e2e8f0",
    overflow: "hidden",
    marginBottom: "18px",
  },

  progressBarFill: {
    height: "100%",
    borderRadius: "999px",
    background:
      "linear-gradient(90deg, #2563eb, #7c3aed)",
    transition: "all 0.4s ease",
  },

  progressText: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "10px",
  },

  progressMessage: {
    textAlign: "center",
    color: "#475569",
    fontWeight: "600",
    fontSize: "16px",
  },

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

  dynamicInsight: {
    marginTop: "18px",
    fontSize: "17px",
    color: "#7c2d12",
    fontWeight: "600",
    lineHeight: "1.6",
  },

  feedSection: {
    marginTop: "45px",
  },

  feedTitle: {
    textAlign: "center",
    fontSize: "30px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "25px",
  },

  feedContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    maxWidth: "850px",
    margin: "0 auto",
  },

  feedItem: {
    padding: "20px",
    borderRadius: "18px",
    background:
      "rgba(255,255,255,0.85)",
    border:
      "1px solid rgba(255,255,255,0.4)",
    boxShadow:
      "0 8px 20px rgba(0,0,0,0.06)",
    fontSize: "16px",
    fontWeight: "600",
    color: "#334155",
    lineHeight: "1.6",
  },

  achievementSection: {
    marginTop: "45px",
  },

  achievementTitle: {
    textAlign: "center",
    fontSize: "30px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "20px",
  },

  achievementContainer: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "16px",
  },

  achievementBadge: {
    padding: "14px 20px",
    borderRadius: "999px",
    background:
      "linear-gradient(135deg, #f59e0b, #f97316)",
    color: "white",
    fontWeight: "700",
    boxShadow:
      "0 8px 20px rgba(249,115,22,0.25)",
  },

  emptyAchievement: {
    color: "#64748b",
    fontWeight: "600",
  },

  quickActionsSection: {
    marginBottom: "55px",
  },

  quickActionsTitle: {
    textAlign: "center",
    fontSize: "32px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "25px",
  },

  quickActionsGrid: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  quickActionCard: {
    width: "240px",
    padding: "28px",
    borderRadius: "22px",
    background:
      "rgba(255,255,255,0.85)",
    textAlign: "center",
    fontWeight: "700",
    fontSize: "18px",
    color: "#0f172a",
    cursor: "pointer",
    boxShadow:
      "0 10px 25px rgba(0,0,0,0.08)",
    transition: "all 0.25s ease",
  },
};

export default Home;