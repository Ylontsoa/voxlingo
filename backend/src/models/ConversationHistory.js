const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ConversationHistory = sequelize.define('ConversationHistory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  language: { type: DataTypes.STRING, allowNull: false },
  messages: { type: DataTypes.TEXT, allowNull: false },
}, {
  tableName: 'conversation_history',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = ConversationHistory;