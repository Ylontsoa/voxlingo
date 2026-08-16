// backend/src/controllers/authController.js
const { User } = require('../models');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const { generateToken } = require('../utils/generateToken');
const { sendVerificationEmail } = require('../services/emailService');
const { speakWelcome } = require('../services/elevenLabsService');

const verificationCodes = new Map();

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { email, password, username } = req.body;

    const existingUser = await User.findOne({ where: { email } });

    // ✅ Si un compte existe déjà ET est vérifié → vrai conflit
    if (existingUser && existingUser.is_verified) {
      return res.status(409).json({ success: false, message: 'Cet email est déjà utilisé' });
    }

    const password_hash = await hashPassword(password);
    let user;

    if (existingUser && !existingUser.is_verified) {
      // ✅ Compte "fantôme" jamais vérifié : on le met à jour au lieu d'en créer un nouveau
      existingUser.password_hash = password_hash;
      existingUser.username = username;
      await existingUser.save();
      user = existingUser;
    } else {
      // Aucun compte existant : création normale, non vérifié par défaut
      user = await User.create({ email, password_hash, username, is_verified: false });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes.set(email, { code, expiresAt: Date.now() + 10 * 60 * 1000 });

    const sent = await sendVerificationEmail(email, code);
    if (!sent) {
      console.log(`📧 Code pour ${email} : ${code}`);
    }

    const token = generateToken(user.id);

    // 🎤 Message de bienvenue vocal
    let welcomeAudio = null;
    try {
      welcomeAudio = await speakWelcome(username || 'utilisateur', 0);
    } catch (voiceError) {
      console.error('[Voice] Erreur bienvenue:', voiceError.message);
    }

    res.status(201).json({
      success: true,
      token,
      user: { id: user.id, email: user.email, username: user.username },
      message: 'Code de vérification envoyé par email',
      welcomeAudio: welcomeAudio ? welcomeAudio.toString('base64') : null,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
    }

    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
    }

    // ✅ Bloque la connexion tant que l'email n'est pas vérifié
    if (!user.is_verified) {
      return res.status(403).json({ success: false, message: 'Merci de vérifier ton email avant de te connecter' });
    }

    const token = generateToken(user.id);

    // 🎤 Message de bienvenue vocal avec streak
    let welcomeAudio = null;
    try {
      welcomeAudio = await speakWelcome(user.username || 'utilisateur', user.current_streak || 0);
    } catch (voiceError) {
      console.error('[Voice] Erreur bienvenue:', voiceError.message);
    }

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        target_language: user.target_language,
        profile_image_url: user.profile_image_url,
      },
      welcomeAudio: welcomeAudio ? welcomeAudio.toString('base64') : null,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/select-language
async function selectLanguage(req, res, next) {
  try {
    const { language } = req.body;
    const user = req.user;
    user.target_language = language;
    await user.save();
    res.json({ success: true, target_language: user.target_language });
  } catch (error) {
    next(error);
  }
}

// GET /api/auth/me
async function getMe(req, res, next) {
  try {
    const user = req.user;
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        target_language: user.target_language,
        profile_image_url: user.profile_image_url,
        current_streak: user.current_streak,
      },
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/auth/avatar
async function updateAvatar(req, res, next) {
  try {
    const { avatar_url } = req.body;
    const user = req.user;
    user.profile_image_url = avatar_url;
    await user.save();
    res.json({ success: true, profile_image_url: user.profile_image_url });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/auth/update-profile
async function updateProfile(req, res, next) {
  try {
    const { username } = req.body;
    const user = req.user;
    user.username = username;
    await user.save();
    res.json({ success: true, username: user.username });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/upload-avatar
async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Aucun fichier reçu' });
    }

    const user = req.user;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/avatars/${req.file.filename}`;

    user.profile_image_url = fileUrl;
    await user.save();

    res.json({ success: true, profile_image_url: fileUrl });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/send-code
async function sendVerificationCode(req, res, next) {
  try {
    const { email } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes.set(email, { code, expiresAt: Date.now() + 10 * 60 * 1000 });

    const sent = await sendVerificationEmail(email, code);
    if (!sent) {
      console.log(`📧 Code pour ${email} : ${code}`);
    }

    res.json({ success: true, message: 'Code envoyé' });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/verify-code
async function verifyCode(req, res, next) {
  try {
    const { email, code } = req.body;
    const stored = verificationCodes.get(email);

    if (!stored) {
      return res.status(400).json({ success: false, message: 'Aucun code demandé' });
    }
    if (Date.now() > stored.expiresAt) {
      verificationCodes.delete(email);
      return res.status(400).json({ success: false, message: 'Code expiré' });
    }
    if (stored.code !== code) {
      return res.status(400).json({ success: false, message: 'Code incorrect' });
    }

    // ✅ Marque enfin le compte comme vérifié
    const user = await User.findOne({ where: { email } });
    if (user) {
      user.is_verified = true;
      await user.save();
    }

    verificationCodes.delete(email);
    res.json({ success: true, message: 'Code vérifié' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  selectLanguage,
  getMe,
  updateAvatar,
  updateProfile,
  uploadAvatar,
  sendVerificationCode,
  verifyCode,
};