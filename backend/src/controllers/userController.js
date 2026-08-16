const { Op } = require('sequelize');
const { User } = require('../models');

async function searchUsers(req, res, next) {
  try {
    const { q } = req.query;
    const currentUserId = req.user.id;
    console.log('[USER_SEARCH] user:', currentUserId, '- recherche:', q); // ✅ log

    if (!q || q.trim().length < 2) {
      return res.json({ success: true, users: [] });
    }

    const term = q.trim();
    const users = await User.findAll({
      where: {
        id: { [Op.ne]: currentUserId },
        [Op.or]: [
          { username: { [Op.iLike]: `%${term}%` } }, // ✅ Op.like -> Op.iLike (compat Postgres)
          { email: { [Op.iLike]: `%${term}%` } },     // ✅ Op.like -> Op.iLike (compat Postgres)
        ],
      },
      attributes: ['id', 'username', 'email', 'profile_image_url', 'target_language'],
      limit: 20,
    });

    console.log('[USER_SEARCH]', users.length, 'resultats trouves'); // ✅ log
    res.json({ success: true, users });
  } catch (error) {
    console.error('[USER_SEARCH] Erreur:', error.message); // ✅ log
    next(error);
  }
}

module.exports = { searchUsers };