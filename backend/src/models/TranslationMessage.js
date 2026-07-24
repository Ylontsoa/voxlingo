const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TranslationMessage = sequelize.define('TranslationMessage', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  conversation_id: { type: DataTypes.INTEGER, allowNull: false },
  sender_id: { type: DataTypes.INTEGER, allowNull: false },
  original_text: { type: DataTypes.TEXT, allowNull: false },
  original_language: { type: DataTypes.STRING, allowNull: false },
  translated_text: { type: DataTypes.TEXT, allowNull: false },
  translated_language: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: 'translation_messages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = TranslationMessage;