const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Phrase = sequelize.define('Phrase', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  lesson_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  text_target: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  text_translation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  order_index: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'phrases',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Phrase;