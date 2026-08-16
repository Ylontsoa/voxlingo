// backend/src/routes/lesson.routes.js
const express = require('express');
const router = express.Router();

const lessonController = require('../controllers/lessonController');
const authMiddleware = require('../middleware/auth');

// ✅ Routes existantes
router.get('/', authMiddleware, lessonController.getLessons);
router.get('/continue', authMiddleware, lessonController.getContinueLesson);
router.get('/:id', authMiddleware, lessonController.getLessonById);

// ✅ NOUVELLE ROUTE : Prononciation des phrases
router.post('/pronounce', authMiddleware, lessonController.pronouncePhrase);

module.exports = router;