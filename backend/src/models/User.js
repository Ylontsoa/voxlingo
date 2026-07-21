const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  username: { type: DataTypes.STRING, allowNull: true },
  target_language: { type: DataTypes.STRING, allowNull: true },
  profile_image_url: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  current_streak: { type: DataTypes.INTEGER, defaultValue: 0 },
  last_practice_date: { type: DataTypes.DATE, allowNull: true },
  xp: { type: DataTypes.INTEGER, defaultValue: 0 },
  level: { type: DataTypes.INTEGER, defaultValue: 1 },
  email_verified: { type: DataTypes.BOOLEAN, defaultValue: false }, // ✅ Ajouté
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = User;