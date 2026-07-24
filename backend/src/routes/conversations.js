const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, conversationController.createConversation);
router.post('/join', authMiddleware, conversationController.joinConversation);
router.post('/start', authMiddleware, conversationController.startConversation); // ✅ Ajout
router.get('/mine/list', authMiddleware, conversationController.getMyConversations); // ✅ Ajout
router.get('/:code/messages', authMiddleware, conversationController.getMessages);

module.exports = router;