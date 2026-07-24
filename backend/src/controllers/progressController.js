const { Progress, User, Phrase, Lesson } = require('../models');
const { fn, col, Op } = require('sequelize');

const XP_SUCCESS = 10;
const XP_FAIL = 2;
const XP_PER_LEVEL = 100;

async function saveProgress(req, res, next) {
  try {
    const { phrase_id, lesson_id, score, transcription } = req.body;
    const userId = req.user.id;

    const progress = await Progress.create({ user_id: userId, phrase_id, lesson_id, score, transcription });

    const user = await User.findByPk(userId);
    const earnedXp = score >= 80 ? XP_SUCCESS : XP_FAIL;
    user.xp += earnedXp;
    user.level = Math.floor(user.xp / XP_PER_LEVEL) + 1;
    await user.save();

    await updateStreak(userId);

    res.status(201).json({ success: true, progress, earnedXp, xp: user.xp, level: user.level });
  } catch (error) {
    next(error);
  }
}

async function getStats(req, res, next) {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    const overallAvg = await Progress.findOne({
      where: { user_id: userId },
      attributes: [[fn('AVG', col('score')), 'avgScore']],
      raw: true,
    });

    const totalPhrases = await Progress.count({ where: { user_id: userId } });
    const perfectCount = await Progress.count({ where: { user_id: userId, score: 100 } });
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayCount = await Progress.count({
      where: { user_id: userId, attempted_at: { [Op.gte]: todayStart } }
    });

    res.json({
      success: true,
      stats: {
        current_streak: user.current_streak,
        average_score: overallAvg?.avgScore ? Math.round(overallAvg.avgScore) : 0,
        xp: user.xp,
        level: user.level,
        xp_in_level: user.xp % XP_PER_LEVEL,
        xp_per_level: XP_PER_LEVEL,
        total_phrases: totalPhrases,
        perfect_count: perfectCount,
        today_count: todayCount,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getCalendar(req, res, next) {
  try {
    const userId = req.user.id;
    const since = new Date();
    since.setDate(since.getDate() - 90);

    const rows = await Progress.findAll({
      where: { user_id: userId, attempted_at: { [Op.gte]: since } },
      attributes: [[fn('DATE', col('attempted_at')), 'day']],
      group: [fn('DATE', col('attempted_at'))],
      raw: true,
    });

    const days = rows.map((r) => r.day);
    res.json({ success: true, days });
  } catch (error) {
    next(error);
  }
}

async function getReviewPhrases(req, res, next) {
  try {
    const userId = req.user.id;

    const latestAttempts = await Progress.findAll({
      where: { user_id: userId },
      order: [['attempted_at', 'DESC']],
      raw: true,
    });

    const lastByPhrase = new Map();
    for (const attempt of latestAttempts) {
      if (!lastByPhrase.has(attempt.phrase_id)) {
        lastByPhrase.set(attempt.phrase_id, attempt);
      }
    }

    const toReviewIds = Array.from(lastByPhrase.values())
      .filter((a) => a.score < 80)
      .sort((a, b) => new Date(a.attempted_at) - new Date(b.attempted_at))
      .slice(0, 20)
      .map((a) => a.phrase_id);

    if (toReviewIds.length === 0) {
      return res.json({ success: true, phrases: [] });
    }

    const phrases = await Phrase.findAll({
      where: { id: toReviewIds },
      include: [{ model: Lesson, attributes: ['id', 'language', 'title'] }],
    });

    const ordered = toReviewIds.map((id) => phrases.find((p) => p.id === id)).filter(Boolean);

    res.json({ success: true, phrases: ordered });
  } catch (error) {
    next(error);
  }
}

async function updateStreak(userId) {
  const user = await User.findByPk(userId);
  const now = new Date();
  const last = user.last_practice_date;

  if (!last) {
    user.current_streak = 1;
  } else {
    const diffHours = (now - new Date(last)) / (1000 * 60 * 60);
    const isSameDay = new Date(last).toDateString() === now.toDateString();

    if (isSameDay) {
      // déjà pratiqué aujourd'hui
    } else if (diffHours <= 48) {
      user.current_streak += 1;
    } else {
      user.current_streak = 1;
    }
  }

  user.last_practice_date = now;
  await user.save();
}

module.exports = { saveProgress, getStats, getCalendar, getReviewPhrases };