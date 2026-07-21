const express = require('express');
const router = express.Router();

const lessonController = require('../controllers/lessonController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, lessonController.getLessons);
router.get('/continue', authMiddleware, lessonController.getContinueLesson); // ✅ AVANT /:id
router.get('/:id', authMiddleware, lessonController.getLessonById);

module.exports = router;