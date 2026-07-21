const { User } = require('../models');

async function getLeaderboard(req, res, next) {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'xp', 'level', 'profile_image_url'],
      order: [['xp', 'DESC']],
      limit: 50,
      raw: true,
    });

    const leaderboard = users.map((u, i) => ({
      rank: i + 1,
      name: u.username || u.email?.split('@')[0] || 'Anonyme',
      xp: u.xp,
      level: u.level,
      // ✅ Si c'est un fichier local (file://), utiliser un avatar généré
      avatar: (u.profile_image_url && !u.profile_image_url.startsWith('file://')) 
        ? u.profile_image_url 
        : null,
    }));

    res.json({ success: true, leaderboard });
  } catch (error) {
    next(error);
  }
}

module.exports = { getLeaderboard };