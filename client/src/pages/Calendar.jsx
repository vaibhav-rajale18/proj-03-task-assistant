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
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <h1 className="text-3xl font-bold mb-8">
          📅 {monthNames[month]} {year}
        </h1>

        {/* Week Header */}
        <div className="grid grid-cols-7 gap-3 mb-4">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-slate-400"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-3">
          {calendarCells.map((day, index) => {
            const isToday =
              day &&
              day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();

            return (
              <div
                key={index}
                className={`
                  h-20 rounded-xl border flex items-center justify-center text-lg font-medium
                  ${
                    day
                      ? "border-slate-700 bg-slate-900"
                      : "border-transparent"
                  }
                  ${isToday ? "border-blue-500 bg-blue-950" : ""}
                `}
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

export default Calendar;