// backend/src/controllers/lessonController.js
const { Lesson, Phrase, Progress } = require('../models');
const { Op, fn, col } = require('sequelize');
const { textToSpeechForLearning } = require('../services/elevenLabsService'); // ✅ AJOUT
const { User } = require('../models'); // ✅ AJOUT pour récupérer le niveau de l'utilisateur

// GET /api/lessons?language=anglais&level=débutant&theme=voyage
async function getLessons(req, res, next) {
  try {
    const { language, level, theme, search } = req.query;
    const userId = req.user.id;

    const where = {};
    if (language) where.language = language;
    if (level) where.level = level;
    if (theme) where.theme = theme;
    if (search) where.title = { [Op.iLike]: `%${search}%` }; // ✅ Op.like -> Op.iLike (compat Postgres)

    const lessons = await Lesson.findAll({
      where,
      order: [['order_index', 'ASC']],
    });

    if (lessons.length === 0) {
      return res.status(200).json({
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
      order: [['attempted_at', 'DESC']],
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

// GET /api/lessons/:id (MODIFIÉ avec option voix)
async function getLessonById(req, res, next) {
  try {
    const lesson = await Lesson.findByPk(req.params.id, {
      include: [{ model: Phrase, as: 'phrases', order: [['order_index', 'ASC']] }],
    });

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lecon introuvable' });
    }

    // 🎤 Ajout des voix pour les phrases (optionnel)
    const withVoice = req.query.withVoice === 'true';
    let phrasesWithVoice = lesson.phrases;

    if (withVoice) {
      try {
        // Récupérer le niveau de l'utilisateur
        const user = await User.findByPk(req.user.id);
        const level = user?.level || 1;
        const learningLevel = level < 5 ? 'beginner' : level < 15 ? 'intermediate' : 'advanced';

        // Générer les voix pour chaque phrase
        phrasesWithVoice = await Promise.all(
          lesson.phrases.map(async (phrase) => {
            try {
              // Audio de la phrase cible
              const phraseAudio = await textToSpeechForLearning(
                phrase.text_target,
                learningLevel
              );
              
              // Audio de la traduction
              const translationAudio = await textToSpeechForLearning(
                phrase.text_translation,
                learningLevel
              );

              return {
                ...phrase.toJSON(),
                phraseAudio: phraseAudio.toString('base64'),
                translationAudio: translationAudio.toString('base64'),
              };
            } catch (voiceError) {
              console.error('[Voice] Erreur pour phrase:', phrase.id, voiceError.message);
              return phrase.toJSON();
            }
          })
        );
      } catch (error) {
        console.error('[Voice] Erreur génération voix:', error.message);
        phrasesWithVoice = lesson.phrases;
      }
    }

    res.json({
      success: true,
      lesson: {
        ...lesson.toJSON(),
        phrases: phrasesWithVoice,
        voiceEnabled: withVoice,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ✅ NOUVELLE FONCTION : Prononciation des phrases
async function pronouncePhrase(req, res, next) {
  try {
    const { phrase, translation, level = 'beginner' } = req.body;

    if (!phrase) {
      return res.status(400).json({ success: false, message: 'Phrase requise' });
    }

    // 🎤 Générer l'audio de la phrase
    let phraseAudio = null;
    let translationAudio = null;

    try {
      // Audio de la phrase
      phraseAudio = await textToSpeechForLearning(phrase, level);
      
      // Audio de la traduction (si fournie)
      if (translation) {
        translationAudio = await textToSpeechForLearning(translation, level);
      }
    } catch (voiceError) {
      console.error('[Voice] Erreur génération audio:', voiceError.message);
      return res.status(500).json({ 
        success: false, 
        message: 'Erreur de synthèse vocale',
        details: voiceError.message 
      });
    }

    res.json({
      success: true,
      phraseAudio: phraseAudio.toString('base64'),
      translationAudio: translationAudio ? translationAudio.toString('base64') : null,
      phrase,
      translation,
      level,
    });
  } catch (error) {
    console.error('[Pronounce] Erreur:', error.message);
    next(error);
  }
}

module.exports = {
  getLessons,
  getContinueLesson,
  getLessonById,
  pronouncePhrase, // ✅ AJOUTER
};