const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./src/routes/auth');
const lessonRoutes = require('./src/routes/lessons');
const progressRoutes = require('./src/routes/progress');
const speechRoutes = require('./src/routes/speech');
const leaderboardRoutes = require('./src/routes/leaderboard');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'VoxLingo API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/speech', speechRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route non trouvée' });
});

app.use(errorHandler);

module.exports = app;