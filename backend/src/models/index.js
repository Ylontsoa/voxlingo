const sequelize = require('../config/database');

// Importer tous les modèles
const User = require('./User');
const Lesson = require('./Lesson');
const Phrase = require('./Phrase');
const Progress = require('./Progress');

// Définir les associations APRÈS avoir importé tous les modèles
User.hasMany(Progress, { foreignKey: 'user_id', sourceKey: 'id' });
Progress.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

Lesson.hasMany(Phrase, { foreignKey: 'lesson_id', sourceKey: 'id', as: 'phrases' });
Phrase.belongsTo(Lesson, { foreignKey: 'lesson_id', targetKey: 'id' });

Lesson.hasMany(Progress, { foreignKey: 'lesson_id', sourceKey: 'id' });
Progress.belongsTo(Lesson, { foreignKey: 'lesson_id', targetKey: 'id' });

Phrase.hasMany(Progress, { foreignKey: 'phrase_id', sourceKey: 'id' });
Progress.belongsTo(Phrase, { foreignKey: 'phrase_id', targetKey: 'id' });

module.exports = { User, Lesson, Phrase, Progress, sequelize };