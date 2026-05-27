import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Calendar = () => {
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] =
    useState(new Date());

  const [tasks, setTasks] = useState([]);

  const [selectedDay, setSelectedDay] =
    useState(null);

  const year = currentDate.getFullYear();

  const month = currentDate.getMonth();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  const fetchTasks = async () => {
    const token =
      localStorage.getItem("token");

    if (!token) return;

   try {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/tasks`,
    {
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
        "Calendar task fetch failed:",
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

  const goToPreviousMonth = () => {
    setSelectedDay(null);

    setCurrentDate(
      new Date(year, month - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setSelectedDay(null);

    setCurrentDate(
      new Date(year, month + 1, 1)
    );
  };

  const goToToday = () => {
    setSelectedDay(null);

    setCurrentDate(new Date());
  };

  const firstDayOfMonth = new Date(
    year,
    month,
    1
  ).getDay();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const calendarCells = [];

  for (
    let i = 0;
    i < firstDayOfMonth;
    i++
  ) {
    calendarCells.push(null);
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    calendarCells.push(day);
  }

  const today = new Date();

  const weekDayNames = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  const isRecurringTaskForDate = (
    task,
    targetDate
  ) => {

    if (
      !task.isRecurring ||
      !task.recurrence
    ) {
      return false;
    }

    const createdDate = new Date(
      task.createdAt
    );

    if (targetDate < createdDate) {
      return false;
    }

    if (
      task.recurrence.type ===
      "daily"
    ) {
      return true;
    }

    if (
      task.recurrence.type ===
      "weekly"
    ) {
      return (
        targetDate.getDay() ===
        createdDate.getDay()
      );
    }

    if (
      task.recurrence.type ===
      "custom"
    ) {
      const currentWeekday =
        weekDayNames[
          targetDate.getDay()
        ];

      return (
        task.recurrence.weekdays?.includes(
          currentWeekday
        )
      );
    }

    return false;
  };

  const getTaskCountsForDay = (day) => {

    if (!day) {
      return {
        normal: 0,
        recurring: 0,
      };
    }

    const currentCellDate =
      new Date(year, month, day);

    let normalCount = 0;

    let recurringCount = 0;

    tasks.forEach((task) => {

      if (
        task.dueDate &&
        !task.isRecurring
      ) {
        const taskDate = new Date(
          task.dueDate
        );

        const sameDate =
          taskDate.getDate() === day &&
          taskDate.getMonth() ===
            month &&
          taskDate.getFullYear() ===
            year;

        if (sameDate) {
          normalCount++;
        }
      }

      if (
        isRecurringTaskForDate(
          task,
          currentCellDate
        )
      ) {
        recurringCount++;
      }

    });

    return {
      normal: normalCount,
      recurring: recurringCount,
    };
  };

  const selectedDayTasks =
    tasks.filter((task) => {

      if (!selectedDay) {
        return false;
      }

      const selectedDate =
        new Date(
          year,
          month,
          selectedDay
        );

      if (
        task.dueDate &&
        !task.isRecurring
      ) {
        const taskDate = new Date(
          task.dueDate
        );

        const sameDate =
          taskDate.getDate() ===
            selectedDay &&
          taskDate.getMonth() ===
            month &&
          taskDate.getFullYear() ===
            year;

        if (sameDate) {
          return true;
        }
      }

      return isRecurringTaskForDate(
        task,
        selectedDate
      );

    });

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>

        {/* Navigation */}
        <div style={styles.navigation}>

          <button
            onClick={() =>
              navigate("/")
            }
            style={styles.homeButton}
          >
            ← Home
          </button>

          <button
            onClick={() => {
              localStorage.removeItem(
                "token"
              );

              navigate("/login");
            }}
            style={styles.logoutButton}
          >
            Logout
          </button>

        </div>

        {/* Header */}
        <div style={styles.header}>

          <button
            onClick={goToPreviousMonth}
            style={styles.navButton}
          >
            ←
          </button>

          <div style={styles.titleSection}>
            <h1 style={styles.title}>
              📅 {monthNames[month]}{" "}
              {year}
            </h1>

            <button
              onClick={goToToday}
              style={styles.todayButton}
            >
              Today
            </button>
          </div>

          <button
            onClick={goToNextMonth}
            style={styles.navButton}
          >
            →
          </button>

        </div>

        {/* Week Names */}
        <div style={styles.weekHeader}>
          {weekDays.map((day) => (
            <div
              key={day}
              style={styles.weekDay}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div style={styles.grid}>

          {calendarCells.map(
            (day, index) => {

              const isToday =
                day &&
                day === today.getDate() &&
                month ===
                  today.getMonth() &&
                year ===
                  today.getFullYear();

              const isSelected =
                day === selectedDay;

              const taskCounts =
                getTaskCountsForDay(day);

              return (
                <div
                  key={index}
                  onClick={() =>
                    day &&
                    setSelectedDay(day)
                  }
                  style={{
                    ...styles.cell,
                    ...(isToday
                      ? styles.todayCell
                      : {}),
                    ...(isSelected
                      ? styles.selectedCell
                      : {}),
                    ...(day === null
                      ? styles.emptyCell
                      : {}),
                  }}
                >

                  {day && (
                    <>
                      <span>{day}</span>

                      <div
                        style={
                          styles.badgeContainer
                        }
                      >

                        {taskCounts.normal >
                          0 && (
                          <div
                            style={
                              styles.normalBadge
                            }
                          >
                            {
                              taskCounts.normal
                            }
                          </div>
                        )}

                        {taskCounts.recurring >
                          0 && (
                          <div
                            style={
                              styles.recurringBadge
                            }
                          >
                            {
                              taskCounts.recurring
                            }
                          </div>
                        )}

                      </div>
                    </>
                  )}

                </div>
              );
            }
          )}

        </div>

        {/* Selected Day Tasks */}
        {selectedDay && (
          <div style={styles.taskSection}>

            <h2
              style={
                styles.taskSectionTitle
              }
            >
              Tasks for{" "}
              {monthNames[month]}{" "}
              {selectedDay}
            </h2>

            {selectedDayTasks.length ===
            0 ? (
              <p style={styles.emptyText}>
                No tasks planned for
                this day 📅
              </p>
            ) : (
              selectedDayTasks.map(
                (task) => (
                  <div
                    key={task._id}
                    style={styles.taskCard}
                  >
                    <h3>
                      {task.title}
                    </h3>

                    <p>
                      {task.description ||
                        "No description"}
                    </p>

                    <small>
                      Priority:{" "}
                      {task.priority}
                    </small>

                    {task.isRecurring && (
                      <p
                        style={
                          styles.recurringText
                        }
                      >
                        🔁 Recurring Task
                      </p>
                    )}

                  </div>
                )
              )
            )}

          </div>
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

  wrapper: {
    maxWidth: "1300px",
    margin: "0 auto",
    animation: "fadeIn 0.5s ease",
  },

  navigation: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
    flexWrap: "wrap",
    gap: "15px",
  },

  homeButton: {
    padding: "14px 24px",
    border: "none",
    borderRadius: "16px",
    background:
      "linear-gradient(135deg, #7c3aed, #9333ea)",
    color: "white",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
    boxShadow:
      "0 10px 25px rgba(124,58,237,0.25)",
    transition: "all 0.25s ease",
  },

  logoutButton: {
    padding: "14px 24px",
    border: "none",
    borderRadius: "16px",
    background:
      "linear-gradient(135deg, #ef4444, #f43f5e)",
    color: "white",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
    boxShadow:
      "0 10px 25px rgba(239,68,68,0.22)",
    transition: "all 0.25s ease",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "45px",
    gap: "20px",
    flexWrap: "wrap",
  },

  titleSection: {
    textAlign: "center",
    flex: 1,
  },

  title: {
    fontSize: "52px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "14px",
    letterSpacing: "-1px",
  },

  navButton: {
    width: "65px",
    height: "65px",
    border: "none",
    borderRadius: "20px",
    background:
      "linear-gradient(135deg, #7c3aed, #9333ea)",
    color: "white",
    fontSize: "26px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow:
      "0 10px 25px rgba(124,58,237,0.22)",
    transition: "all 0.25s ease",
  },

  todayButton: {
    padding: "12px 24px",
    border: "none",
    borderRadius: "14px",
    background:
      "linear-gradient(135deg, #2563eb, #3b82f6)",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "15px",
    boxShadow:
      "0 10px 25px rgba(37,99,235,0.2)",
  },

  weekHeader: {
    display: "grid",
    gridTemplateColumns:
      "repeat(7, 1fr)",
    gap: "18px",
    marginBottom: "20px",
  },

  weekDay: {
    textAlign: "center",
    fontWeight: "800",
    color: "#475569",
    fontSize: "16px",
    padding: "12px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(7, 1fr)",
    gap: "18px",
  },

  cell: {
    minHeight: "120px",
    borderRadius: "28px",
    background:
      "rgba(255,255,255,0.72)",
    backdropFilter: "blur(12px)",
    border:
      "1px solid rgba(255,255,255,0.45)",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    fontSize: "24px",
    fontWeight: "800",
    color: "#0f172a",
    cursor: "pointer",
    transition: "all 0.25s ease",
    overflow: "hidden",
  },

  todayCell: {
    background:
      "linear-gradient(135deg, #2563eb, #7c3aed)",
    color: "white",
    transform: "scale(1.02)",
    boxShadow:
      "0 14px 35px rgba(37,99,235,0.25)",
  },

  selectedCell: {
    border:
      "2px solid rgba(124,58,237,0.6)",
    transform: "translateY(-3px)",
  },

  emptyCell: {
    background: "transparent",
    boxShadow: "none",
    border: "none",
    cursor: "default",
  },

  badgeContainer: {
    position: "absolute",
    top: "10px",
    right: "10px",
    display: "flex",
    gap: "8px",
  },

  normalBadge: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, #7c3aed, #9333ea)",
    color: "white",
    fontSize: "13px",
    fontWeight: "700",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow:
      "0 6px 18px rgba(124,58,237,0.25)",
  },

  recurringBadge: {
    width: "28px",
    height: "28px",
    borderRadius: "8px",
    background:
      "linear-gradient(135deg, #f59e0b, #f97316)",
    color: "white",
    fontSize: "13px",
    fontWeight: "700",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow:
      "0 6px 18px rgba(249,115,22,0.22)",
  },

  taskSection: {
    marginTop: "60px",
  },

  taskSectionTitle: {
    fontSize: "36px",
    fontWeight: "800",
    marginBottom: "30px",
    color: "#0f172a",
    textAlign: "center",
  },

  taskCard: {
    background:
      "rgba(255,255,255,0.78)",
    backdropFilter: "blur(12px)",
    padding: "28px",
    borderRadius: "28px",
    marginBottom: "22px",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
    border:
      "1px solid rgba(255,255,255,0.4)",
    transition: "all 0.25s ease",
  },

  recurringText: {
    marginTop: "14px",
    color: "#7c3aed",
    fontWeight: "700",
    background:
      "rgba(124,58,237,0.08)",
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "999px",
  },

  emptyText: {
    textAlign: "center",
    padding: "40px",
    borderRadius: "24px",
    background:
      "rgba(255,255,255,0.75)",
    color: "#64748b",
    fontSize: "18px",
    fontWeight: "600",
    boxShadow:
      "0 10px 25px rgba(0,0,0,0.06)",
  },
};

export default Calendar;