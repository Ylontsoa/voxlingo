const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, leaderboardController.getLeaderboard);

module.exports = router;