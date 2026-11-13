/**
 * LECASU — Entrypoint Principal do Servidor (cPanel / Node.js)
 * Inicia o servidor HTTP com suporte automático a Passenger (process.env.PORT) e MySQL.
 */
const serverApp = require('./backend/server-app.js');

const port = process.env.PORT || 5500;
serverApp.startServer(port);

