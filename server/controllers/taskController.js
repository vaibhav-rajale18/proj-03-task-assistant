const Task = require("../models/Task");
const calculateStreak = require("../services/streakService");

const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      isRecurring,
      recurrence,
    } = req.body;

    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      user: req.user.userId,

      // 🔁 Recurring task fields
      isRecurring: isRecurring || false,
      recurrence: isRecurring ? recurrence : undefined,
    });

    await task.save();

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.userId,
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    // 🔒 Ownership check
    if (task.user.toString() !== req.user.userId) {
      return res.status(403).json({
        error: "Access denied",
      });
    }

    // Store old status before update
    const previousStatus = task.status;

    // Update task fields
    Object.assign(task, req.body);

    // 🔥 Streak logic
    if (
      task.isRecurring &&
      previousStatus !== "completed" &&
      task.status === "completed"
    ) {
      // Add completion date
      task.completionHistory.push(
        new Date()
      );

      // Calculate updated streak
      const updatedStreak =
        calculateStreak(task);

      // Update streak object
      task.streak = updatedStreak;
    }

    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    // 🔒 Ownership check
    if (task.user.toString() !== req.user.userId) {
      return res.status(403).json({
        error: "Access denied",
      });
    }

    await task.deleteOne();

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};