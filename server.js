// backend/server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Importa a função de conexão com o DB
const productRoutes = require('./routes/productRoutes'); // Importa as rotas de produto
const authRoutes = require('./routes/authRoutes'); 
const path = require('path');

require('dotenv').config(); // Carrega as variáveis de ambiente

const app = express();
const PORT = process.env.PORT || 3000;

// Conecta ao Banco de Dados
connectDB();

// Middlewares
app.use(cors()); // Habilita o CORS para todas as requisições
app.use(express.json()); // Permite que o Express parseie requisições com JSON no corpo

app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Rota de Teste Simples
app.get('/', (req, res) => {
  res.send('Bem-vindo à API do nosso E-commerce Digital!');
});

// Usar as Rotas de Produto
app.use('/api/products', productRoutes); // Todas as rotas definidas em productRoutes agora estarão prefixadas com /api/products
app.use('/api/auth', authRoutes);

// Inicia o Servidor
app.listen(PORT, () => {
  console.log(`Servidor backend rodando em http://localhost:${PORT}`);
});