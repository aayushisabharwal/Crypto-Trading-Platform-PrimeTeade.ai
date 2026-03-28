const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symbol: {
    type: String,
    required: [true, 'Please provide a trading symbol'],
    uppercase: true,
    trim: true,
    enum: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT']
  },
  type: {
    type: String,
    required: [true, 'Please provide trade type'],
    enum: ['buy', 'sell']
  },
  quantity: {
    type: Number,
    required: [true, 'Please provide quantity'],
    min: [0.0001, 'Quantity must be greater than 0']
  },
  price: {
    type: Number,
    required: [true, 'Please provide price'],
    min: [0, 'Price cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled', 'failed'],
    default: 'pending'
  },
  orderType: {
    type: String,
    enum: ['market', 'limit', 'stop-loss'],
    default: 'market'
  },
  stopPrice: {
    type: Number,
    min: 0
  },
  executedAt: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Calculate total value before saving
tradeSchema.pre('save', function(next) {
  if (this.isModified('quantity') || this.isModified('price')) {
    this.totalValue = this.quantity * this.price;
  }
  next();
});

// Index for efficient queries
tradeSchema.index({ user: 1, createdAt: -1 });
tradeSchema.index({ symbol: 1, status: 1 });

module.exports = mongoose.model('Trade', tradeSchema);