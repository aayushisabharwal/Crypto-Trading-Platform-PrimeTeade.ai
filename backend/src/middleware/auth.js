const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User no longer exists'
      });
    }

    // Check if user is active
    if (!req.user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account is disabled. Please contact support.'
      });
    }

    // Check if password changed after JWT issued
    if (req.user.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        success: false,
        error: 'Password recently changed. Please log in again.'
      });
    }

    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };