const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    // Read token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Not authorized" });
    }

    // Extract token after "Bearer "
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return res.status(401).json({ error: "Token missing" });
    }

    // Verify token using jsonwebtoken
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
    );

    // Attach decoded user to req.user
    req.user = decoded;

    // Call next() if valid
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
