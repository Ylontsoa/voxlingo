require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./src/app');
const sequelize = require('./src/config/database');
require('./src/models');
const initSocket = require('./src/socket');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*' },
});

initSocket(io);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion PostgreSQL réussie');

    // Force: false pour ne pas perdre les données
    // Alter: true pour synchroniser les modifications
    await sequelize.sync({ alter: true });
    console.log('✅ Modèles synchronisés avec la base de données');

    server.listen(PORT, '0.0.0.0', () => {
      console.log('🚀 Serveur VoxLingo (+ Socket.io) démarré sur le port ' + PORT);
      console.log('📡 Accessible via http://localhost:' + PORT);
      console.log('🗄️  Base de données: PostgreSQL');
    });
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error.message);
    process.exit(1);
  }
}

startServer();