const jwt = require('jsonwebtoken');

// Authentication Middleware
const auth = (req, res, next) => {
  try {
    // Check for the token in the cookies
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the user data to the request object for further use
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);

    // Return specific errors for debugging
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token has expired. Please log in again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Invalid token. Please log in again.' });
    }

    // Generic error response
    res.status(403).json({ error: 'Authentication failed.' });
  }
};

module.exports = auth;
