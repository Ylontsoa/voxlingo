const express = require('express');
const cors = require('cors');
const path = require('path'); // ✅ Ajout
const authRoutes = require('./routes/auth');
const lessonRoutes = require('./routes/lessons');
const progressRoutes = require('./routes/progress');
const speechRoutes = require('./routes/speech');
const leaderboardRoutes = require('./routes/leaderboard');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Servir les fichiers uploadés (avatars)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'VoxLingo API is running' });
});

// Routes principales
app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/speech', speechRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route non trouvée' });
});

// Gestion centralisée des erreurs (doit être en dernier)
app.use(errorHandler);

module.exports = app;