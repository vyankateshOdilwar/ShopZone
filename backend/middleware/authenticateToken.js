const jwt = require('jsonwebtoken');

// Middleware function to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT Verification Error:');
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.user = user;
    next();
  });
};


module.exports = authenticateToken;
