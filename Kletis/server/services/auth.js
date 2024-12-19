const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // console.log('Cookies received:', req.cookies); // Debug cookies
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('Decoded Token:', decoded); // Log decoded token
    req.user = decoded; // Attach the user data to req.user
    next();
  } catch (error) {
    // console.error('Auth Middleware Error:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token has expired. Please log in again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Invalid token. Please log in again.' });
    }

    res.status(403).json({ error: 'Authentication failed.' });
  }
};

module.exports = auth;
