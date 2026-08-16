// backend/src/routes/conversation.routes.js
const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const authMiddleware = require('../middleware/auth');

// ✅ Routes existantes
router.post('/', authMiddleware, conversationController.createConversation);
router.post('/join', authMiddleware, conversationController.joinConversation);
router.post('/start', authMiddleware, conversationController.startConversation);
router.get('/mine/list', authMiddleware, conversationController.getMyConversations);
router.get('/:code/messages', authMiddleware, conversationController.getMessages);

// ✅ NOUVELLE ROUTE : Message vocal en conversation
router.post('/:code/speak', authMiddleware, conversationController.speakMessage);

module.exports = router;