require('dotenv').config();
const app = require('./app');
const sequelize = require('./src/config/database');
require('./src/models');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Connexion MySQL reussie');

    await sequelize.sync({ alter: false });
    console.log('Modeles synchronises avec la base de donnees');

    app.listen(PORT, '0.0.0.0', () => {
      console.log('Serveur VoxLingo demarre sur le port ' + PORT);
      console.log('Accessible via http://localhost:' + PORT);
    });
  } catch (error) {
    console.error('Erreur de connexion a la base de donnees:', error);
    process.exit(1);
  }
}

startServer();