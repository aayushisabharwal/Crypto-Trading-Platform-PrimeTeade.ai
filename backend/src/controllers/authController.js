const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { name, email, password, role } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      success: false,
      error: 'User already exists'
    });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user'
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }

  // Check password
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }

  // Update last login
  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  
  res.status(200).json({
    success: true,
    data: user
  });
};

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'No user with that email'
    });
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // In production, send email here
  logger.info(`Password reset token: ${resetToken}`);

  res.status(200).json({
    success: true,
    message: 'Password reset email sent',
    resetToken // In production, this would be sent via email
  });
};

// @desc    Reset password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: resetPasswordToken,
    passwordResetExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }

  // Set new password
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  user.passwordChangedAt = Date.now();
  await user.save();

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    token,
    message: 'Password reset successful'
  });
};

// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return res.status(401).json({
      success: false,
      error: 'Current password is incorrect'
    });
  }

  user.password = req.body.newPassword;
  user.passwordChangedAt = Date.now();
  await user.save();

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    token,
    message: 'Password updated successfully'
  });
};