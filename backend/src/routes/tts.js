// backend/src/routes/tts.js
const express = require('express');
const router = express.Router();
const ttsController = require('../controllers/ttsController');
const authMiddleware = require('../middleware/auth');

// 🗣️ Synthèse vocale simple
router.post('/speak', authMiddleware, ttsController.speak);

// 🎤 Message de bienvenue
router.post('/welcome', authMiddleware, ttsController.welcome);

// 📊 Feedback vocal
router.post('/feedback', authMiddleware, ttsController.feedback);

// 📋 Liste des voix
router.get('/voices', authMiddleware, ttsController.getVoices);

module.exports = router;