const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const handleValidation = require('../middleware/validation');
const upload = require('../middleware/upload'); // ✅ Ajout

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Format email invalide'),
    body('password').isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caracteres'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) throw new Error('Les mots de passe ne correspondent pas');
      return true;
    }),
  ],
  handleValidation,
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Format email invalide'),
    body('password').notEmpty().withMessage('Mot de passe requis'),
  ],
  handleValidation,
  authController.login
);

router.get('/me', authMiddleware, authController.getMe);
router.post('/select-language', authMiddleware, authController.selectLanguage);
router.patch('/avatar', authMiddleware, authController.updateAvatar);
router.patch('/update-profile', authMiddleware, authController.updateProfile);

// ✅ Upload avatar
router.post('/upload-avatar', authMiddleware, upload.single('avatar'), authController.uploadAvatar);

router.post('/send-code', authController.sendVerificationCode);
router.post('/verify-code', authController.verifyCode);

module.exports = router;