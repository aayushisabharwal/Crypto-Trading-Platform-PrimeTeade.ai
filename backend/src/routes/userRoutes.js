const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Admin only routes
router.use(protect);
router.use(authorize('admin'));

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
router.get('/', async (req, res) => {
  const users = await User.find().select('-password');
  
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private/Admin
router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: `User not found with id of ${req.params.id}`
    });
  }
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
router.put('/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).select('-password');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: `User not found with id of ${req.params.id}`
    });
  }
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: `User not found with id of ${req.params.id}`
    });
  }
  
  await user.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

module.exports = router;