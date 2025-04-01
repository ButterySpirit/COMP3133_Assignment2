const jwt = require('jsonwebtoken');

const authMiddleware = ({ req }) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return { user: null };

  const token = authHeader.split(' ')[1]; // Extract token after "Bearer"
  if (!token) return { user: null };

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { user: decoded };
  } catch (err) {
    return { user: null };
  }
};

module.exports = authMiddleware;
