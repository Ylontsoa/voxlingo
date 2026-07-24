const express = require('express');
const multer = require('multer');
const router = express.Router();

const speechController = require('../controllers/speechController');
const authMiddleware = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'audio-' + uniqueSuffix + '.m4a');
  },
});

const upload = multer({ storage });

router.post('/transcribe', authMiddleware, upload.single('audio'), speechController.transcribeAudio);

module.exports = router;