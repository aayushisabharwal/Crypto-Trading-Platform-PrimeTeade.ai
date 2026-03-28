const Trade = require('../models/Trade');
const { validationResult } = require('express-validator');

// @desc    Get all trades for logged in user
// @route   GET /api/v1/trades
// @access  Private
exports.getTrades = async (req, res) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };
  
  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = Trade.find(JSON.parse(queryStr)).where({ user: req.user.id });

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Trade.countDocuments({ user: req.user.id });

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const trades = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: trades.length,
    pagination,
    data: trades
  });
};

// @desc    Get single trade
// @route   GET /api/v1/trades/:id
// @access  Private
exports.getTrade = async (req, res) => {
  const trade = await Trade.findById(req.params.id);

  if (!trade) {
    return res.status(404).json({
      success: false,
      error: `Trade not found with id of ${req.params.id}`
    });
  }

  // Make sure user owns trade or is admin
  if (trade.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({
      success: false,
      error: `User ${req.user.id} is not authorized to access this trade`
    });
  }

  res.status(200).json({
    success: true,
    data: trade
  });
};

// @desc    Create new trade
// @route   POST /api/v1/trades
// @access  Private
exports.createTrade = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  // Add user to req.body
  req.body.user = req.user.id;

  const trade = await Trade.create(req.body);

  res.status(201).json({
    success: true,
    data: trade
  });
};

// @desc    Update trade
// @route   PUT /api/v1/trades/:id
// @access  Private
exports.updateTrade = async (req, res) => {
  let trade = await Trade.findById(req.params.id);

  if (!trade) {
    return res.status(404).json({
      success: false,
      error: `Trade not found with id of ${req.params.id}`
    });
  }

  // Make sure user owns trade or is admin
  if (trade.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({
      success: false,
      error: `User ${req.user.id} is not authorized to update this trade`
    });
  }

  trade = await Trade.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: trade
  });
};

// @desc    Delete trade
// @route   DELETE /api/v1/trades/:id
// @access  Private
exports.deleteTrade = async (req, res) => {
  const trade = await Trade.findById(req.params.id);

  if (!trade) {
    return res.status(404).json({
      success: false,
      error: `Trade not found with id of ${req.params.id}`
    });
  }

  // Make sure user owns trade or is admin
  if (trade.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({
      success: false,
      error: `User ${req.user.id} is not authorized to delete this trade`
    });
  }

  await trade.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
};

// @desc    Get trade statistics
// @route   GET /api/v1/trades/stats
// @access  Private
exports.getTradeStats = async (req, res) => {
  const stats = await Trade.aggregate([
    { $match: { user: req.user._id } },
    {
      $group: {
        _id: null,
        totalTrades: { $sum: 1 },
        totalVolume: { $sum: { $multiply: ['$quantity', '$price'] } },
        avgPrice: { $avg: '$price' },
        buyCount: {
          $sum: { $cond: [{ $eq: ['$type', 'buy'] }, 1, 0] }
        },
        sellCount: {
          $sum: { $cond: [{ $eq: ['$type', 'sell'] }, 1, 0] }
        }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: stats[0] || {
      totalTrades: 0,
      totalVolume: 0,
      avgPrice: 0,
      buyCount: 0,
      sellCount: 0
    }
  });
};