const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/auth');

router.post('/history', authMiddleware, chatController.saveHistory);
router.get('/history', authMiddleware, chatController.getHistory);
router.delete('/history', authMiddleware, chatController.deleteHistory);

module.exports = router;