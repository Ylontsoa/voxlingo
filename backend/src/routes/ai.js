// backend/src/routes/ai.routes.js
const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/auth');

// ✅ Routes existantes (inchangées)
router.post('/practice-phrase', authMiddleware, aiController.generatePracticePhrase);
router.post('/translate', authMiddleware, aiController.translateText);
router.post('/correct', authMiddleware, aiController.correctAlphabet);
router.post('/check-mistakes', authMiddleware, aiController.checkMistakes);

// ✅ Route chat (supporte déjà withVoice via le body)
router.post('/chat', authMiddleware, aiController.chatWithAI);

module.exports = router;