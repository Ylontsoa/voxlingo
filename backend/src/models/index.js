const sequelize = require('../config/database');

const User = require('./User');
const Lesson = require('./Lesson');
const Phrase = require('./Phrase');
const Progress = require('./Progress');
const ConversationHistory = require('./ConversationHistory');
const Conversation = require('./Conversation');
const ConversationParticipant = require('./ConversationParticipant');
const TranslationMessage = require('./TranslationMessage');

User.hasMany(Progress, { foreignKey: 'user_id', sourceKey: 'id' });
Progress.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

Lesson.hasMany(Phrase, { foreignKey: 'lesson_id', sourceKey: 'id', as: 'phrases' });
Phrase.belongsTo(Lesson, { foreignKey: 'lesson_id', targetKey: 'id' });

Lesson.hasMany(Progress, { foreignKey: 'lesson_id', sourceKey: 'id' });
Progress.belongsTo(Lesson, { foreignKey: 'lesson_id', targetKey: 'id' });

Phrase.hasMany(Progress, { foreignKey: 'phrase_id', sourceKey: 'id' });
Progress.belongsTo(Phrase, { foreignKey: 'phrase_id', targetKey: 'id' });

User.hasMany(ConversationHistory, { foreignKey: 'user_id', sourceKey: 'id' });
ConversationHistory.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

// ✅ Associations traducteur en direct
Conversation.hasMany(ConversationParticipant, { foreignKey: 'conversation_id', sourceKey: 'id' });
ConversationParticipant.belongsTo(Conversation, { foreignKey: 'conversation_id', targetKey: 'id' });

Conversation.hasMany(TranslationMessage, { foreignKey: 'conversation_id', sourceKey: 'id' });
TranslationMessage.belongsTo(Conversation, { foreignKey: 'conversation_id', targetKey: 'id' });

User.hasMany(ConversationParticipant, { foreignKey: 'user_id', sourceKey: 'id' });
ConversationParticipant.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

module.exports = {
  User, Lesson, Phrase, Progress, ConversationHistory,
  Conversation, ConversationParticipant, TranslationMessage,
  sequelize,
};