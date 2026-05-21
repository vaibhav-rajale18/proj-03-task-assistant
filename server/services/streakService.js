const calculateStreak = (task) => {
  const today = new Date();

  // Normalize today's date
  today.setHours(0, 0, 0, 0);

  const lastCompleted =
    task.streak?.lastCompletedDate
      ? new Date(task.streak.lastCompletedDate)
      : null;

  if (lastCompleted) {
    lastCompleted.setHours(0, 0, 0, 0);
  }

  // First ever completion
  if (!lastCompleted) {
    return {
      current: 1,
      longest: 1,
      lastCompletedDate: today,
    };
  }

  // Difference in days
  const diffTime =
    today.getTime() -
    lastCompleted.getTime();

  const diffDays =
    diffTime /
    (1000 * 60 * 60 * 24);

  let currentStreak =
    task.streak.current || 0;

  let longestStreak =
    task.streak.longest || 0;

  // Already completed today
  if (diffDays === 0) {
    return {
      current: currentStreak,
      longest: longestStreak,
      lastCompletedDate: lastCompleted,
    };
  }

  // Consecutive day
  if (diffDays === 1) {
    currentStreak += 1;
  }

  // Streak broken
  else {
    currentStreak = 1;
  }

  // Update longest streak
  if (
    currentStreak >
    longestStreak
  ) {
    longestStreak =
      currentStreak;
  }

  return {
    current: currentStreak,
    longest: longestStreak,
    lastCompletedDate: today,
  };
};

module.exports = calculateStreak;