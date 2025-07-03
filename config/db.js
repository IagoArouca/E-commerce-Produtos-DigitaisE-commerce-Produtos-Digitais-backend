// backend/config/db.js
const mongoose = require('mongoose');
require('dotenv').config(); // Garante que as variáveis de ambiente sejam carregadas aqui também

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB conectado com sucesso!');
  } catch (err) {
    console.error('Erro na conexão com MongoDB:', err.message);
    process.exit(1); // Sai do processo com falha
  }
};

module.exports = connectDB;