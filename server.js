const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); 
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes'); 
const path = require('path');

require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL 
    : '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

connectDB();

app.use(cors()); 
app.use(express.json()); 

app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

app.get('/', (req, res) => {
  res.send('Bem-vindo à API do nosso E-commerce Digital!');
});

app.use('/api/products', productRoutes); 
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Servidor backend rodando em http://localhost:${PORT}`);
});