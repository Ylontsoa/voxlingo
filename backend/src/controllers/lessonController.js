const { Lesson, Phrase, Progress } = require('../models');
const { Op, fn, col } = require('sequelize');

// GET /api/lessons?language=anglais&level=débutant&theme=voyage
async function getLessons(req, res, next) {
  try {
    const { language, level, theme, search } = req.query;
    const userId = req.user.id;

    const where = {};
    if (language) where.language = language;
    if (level) where.level = level;
    if (theme) where.theme = theme;
    if (search) where.title = { [Op.like]: `%${search}%` }; // ✅ Corrigé : like au lieu de iLike (MySQL)

    const lessons = await Lesson.findAll({
      where,
      order: [['order_index', 'ASC']],
    });

    if (lessons.length === 0) {
      return res.status(200).json({ // ✅ Corrigé : 200 au lieu de 404
        success: true,
        lessons: [],
        message: 'Aucune lecon disponible pour cette langue',
      });
    }

    const lessonsWithProgress = await Promise.all(
      lessons.map(async (lesson) => {
        const avgResult = await Progress.findOne({
          where: { user_id: userId, lesson_id: lesson.id },
          attributes: [[fn('AVG', col('score')), 'avgScore']],
          raw: true,
        });

        const totalPhrases = await Phrase.count({ where: { lesson_id: lesson.id } });
        const completedPhrases = await Progress.count({
          where: { user_id: userId, lesson_id: lesson.id },
          distinct: true,
          col: 'phrase_id',
        });

        const completionPercent = totalPhrases > 0
          ? Math.round((completedPhrases / totalPhrases) * 100)
          : 0;

        let status = 'not_started';
        if (completionPercent >= 100) status = 'completed';
        else if (completionPercent > 0) status = 'in_progress';

        return {
          ...lesson.toJSON(),
          average_score: avgResult?.avgScore ? Math.round(avgResult.avgScore) : null,
          completion_percent: completionPercent,
          status,
          total_phrases: totalPhrases,
          completed_phrases: completedPhrases,
        };
      })
    );

    res.json({ success: true, lessons: lessonsWithProgress });
  } catch (error) {
    next(error);
  }
}

// GET /api/lessons/continue
async function getContinueLesson(req, res, next) {
  try {
    const userId = req.user.id;

    const lastProgress = await Progress.findOne({
      where: { user_id: userId },
      order: [['attempted_at', 'DESC']], // ✅ Corrigé : attempted_at
      raw: true,
    });

    if (!lastProgress) {
      return res.json({ success: true, lesson: null });
    }

    const lesson = await Lesson.findByPk(lastProgress.lesson_id);
    if (!lesson) {
      return res.json({ success: true, lesson: null });
    }

    const totalPhrases = await Phrase.count({ where: { lesson_id: lesson.id } });
    const completedPhrases = await Progress.count({
      where: { user_id: userId, lesson_id: lesson.id },
      distinct: true,
      col: 'phrase_id',
    });
    const completionPercent = totalPhrases > 0
      ? Math.round((completedPhrases / totalPhrases) * 100)
      : 0;

    if (completionPercent >= 100) {
      return res.json({ success: true, lesson: null });
    }

    res.json({
      success: true,
      lesson: {
        ...lesson.toJSON(),
        completion_percent: completionPercent,
        status: 'in_progress',
        total_phrases: totalPhrases,
        completed_phrases: completedPhrases,
      },
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/lessons/:id
async function getLessonById(req, res, next) {
  try {
    const lesson = await Lesson.findByPk(req.params.id, {
      include: [{ model: Phrase, as: 'phrases', order: [['order_index', 'ASC']] }],
    });

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lecon introuvable' });
    }

    res.json({ success: true, lesson });
  } catch (error) {
    next(error);
  }
}

module.exports = { getLessons, getContinueLesson, getLessonById };