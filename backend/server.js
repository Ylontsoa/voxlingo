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
    console.log('Connexion MySQL reussie');

    await sequelize.sync({ alter: true });
    console.log('Modeles synchronises avec la base de donnees');

    server.listen(PORT, '0.0.0.0', () => {
      console.log('Serveur VoxLingo (+ Socket.io) demarre sur le port ' + PORT);
      console.log('Accessible via http://localhost:' + PORT);
    });
  } catch (error) {
    console.error('Erreur de connexion a la base de donnees:', error);
    process.exit(1);
  }
}

startServer();