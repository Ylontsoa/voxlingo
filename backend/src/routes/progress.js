const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const progressController = require('../controllers/progressController');
const authMiddleware = require('../middleware/auth');
const handleValidation = require('../middleware/validation');

router.post(
  '/',
  authMiddleware,
  [
    body('phrase_id').isInt(),
    body('lesson_id').isInt(),
    body('score').isFloat({ min: 0, max: 100 }),
  ],
  handleValidation,
  progressController.saveProgress
);

router.get('/stats', authMiddleware, progressController.getStats);
router.get('/calendar', authMiddleware, progressController.getCalendar);
router.get('/review', authMiddleware, progressController.getReviewPhrases);

module.exports = router;