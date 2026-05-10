import { useState } from "react";

const Calendar = () => {
  const [currentDate] = useState(new Date());

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

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarCells = [];

  // Empty cells before month starts
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(null);
  }

  // Actual days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(day);
  }

  const today = new Date();

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        
        {/* Header */}
        <h1 style={styles.title}>
          📅 {monthNames[month]} {year}
        </h1>

        {/* Week Names */}
        <div style={styles.weekHeader}>
          {weekDays.map((day) => (
            <div key={day} style={styles.weekDay}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div style={styles.grid}>
          {calendarCells.map((day, index) => {
            const isToday =
              day &&
              day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();

            return (
              <div
                key={index}
                style={{
                  ...styles.cell,
                  ...(isToday ? styles.todayCell : {}),
                  ...(day === null ? styles.emptyCell : {}),
                }}
              >
                {day}
              </div>
            );
          })}
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

  wrapper: {
    maxWidth: "1000px",
    margin: "0 auto",
  },

  title: {
    textAlign: "center",
    fontSize: "42px",
    fontWeight: "800",
    marginBottom: "40px",
    color: "#0f172a",
  },

  weekHeader: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "15px",
    marginBottom: "20px",
  },

  weekDay: {
    textAlign: "center",
    fontWeight: "700",
    color: "#475569",
    fontSize: "16px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "15px",
  },

  cell: {
    height: "90px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.8)",
    border: "1px solid rgba(255,255,255,0.5)",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "20px",
    fontWeight: "700",
    color: "#0f172a",
  },

  todayCell: {
    background: "#2563eb",
    color: "white",
  },

  emptyCell: {
    background: "transparent",
    boxShadow: "none",
    border: "none",
  },
};

export default Calendar;