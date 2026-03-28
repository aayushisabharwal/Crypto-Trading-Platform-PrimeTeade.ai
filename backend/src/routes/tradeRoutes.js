const express = require('express');
const { body } = require('express-validator');
const {
  getTrades,
  getTrade,
  createTrade,
  updateTrade,
  deleteTrade,
  getTradeStats
} = require('../controllers/tradeController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All routes require authentication

/**
 * @swagger
 * components:
 *   schemas:
 *     Trade:
 *       type: object
 *       required:
 *         - symbol
 *         - type
 *         - quantity
 *         - price
 *       properties:
 *         id:
 *           type: string
 *         user:
 *           type: string
 *         symbol:
 *           type: string
 *           enum: [BTCUSDT, ETHUSDT, BNBUSDT, ADAUSDT, SOLUSDT]
 *         type:
 *           type: string
 *           enum: [buy, sell]
 *         quantity:
 *           type: number
 *           minimum: 0.0001
 *         price:
 *           type: number
 *           minimum: 0
 *         status:
 *           type: string
 *           enum: [pending, completed, cancelled, failed]
 *           default: pending
 *         orderType:
 *           type: string
 *           enum: [market, limit, stop-loss]
 *           default: market
 *         stopPrice:
 *           type: number
 *         executedAt:
 *           type: string
 *           format: date-time
 *         notes:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /trades:
 *   get:
 *     summary: Get all trades for logged in user
 *     tags: [Trades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort field (prefix with - for descending)
 *       - in: query
 *         name: symbol
 *         schema:
 *           type: string
 *         description: Filter by symbol
 *     responses:
 *       200:
 *         description: List of trades
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 pagination:
 *                   type: object
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Trade'
 */
router.route('/')
  .get(getTrades)
  .post([
    body('symbol').isIn(['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT'])
      .withMessage('Invalid trading symbol'),
    body('type').isIn(['buy', 'sell']).withMessage('Trade type must be buy or sell'),
    body('quantity').isFloat({ min: 0.0001 }).withMessage('Quantity must be greater than 0'),
    body('price').isFloat({ min: 0 }).withMessage('Price cannot be negative'),
    body('orderType').optional().isIn(['market', 'limit', 'stop-loss'])
  ], createTrade);

router.route('/stats')
  .get(getTradeStats);

router.route('/:id')
  .get(getTrade)
  .put(updateTrade)
  .delete(deleteTrade);

module.exports = router;