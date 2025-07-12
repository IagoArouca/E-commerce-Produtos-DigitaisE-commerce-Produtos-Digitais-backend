const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); 
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes'); 
const path = require('path');

require('dotenv').config(); 

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('Bem-vindo à API do nosso E-commerce Digital!');
});

app.use('/api/products', productRoutes); 
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Servidor backend rodando em http://localhost:${PORT}`);
});