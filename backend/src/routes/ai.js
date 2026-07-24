const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/auth');

router.post('/practice-phrase', authMiddleware, aiController.generatePracticePhrase);
router.post('/translate', authMiddleware, aiController.translateText);
router.post('/correct', authMiddleware, aiController.correctAlphabet);
router.post('/check-mistakes', authMiddleware, aiController.checkMistakes);
router.post('/chat', authMiddleware, aiController.chatWithAI);

module.exports = router;