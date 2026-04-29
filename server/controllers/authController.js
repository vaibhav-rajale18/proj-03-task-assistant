import User from '../models/user.js';

export const registerUser = async (req, res) => {
  try {
    res.json({ message: 'Register route working' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
