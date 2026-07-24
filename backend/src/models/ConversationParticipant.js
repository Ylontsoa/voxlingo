const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ConversationParticipant = sequelize.define('ConversationParticipant', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  conversation_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  language: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: 'conversation_participants',
  timestamps: true,
  createdAt: 'joined_at',
  updatedAt: false,
});

module.exports = ConversationParticipant;