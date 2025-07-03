// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router(); // Cria um novo router Express
const Product = require('../models/Product'); // Importa o modelo de Produto

// @route   GET /api/products
// @desc    Obter todos os produtos
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos do DB:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar produtos.' });
  }
});

// @route   POST /api/products
// @desc    Adicionar um novo produto
// @access  Public (por enquanto, depois pode ser restrito a admin)
router.post('/', async (req, res) => {
  try {
    const { name, price, imageUrl, description } = req.body;

    // Validação básica
    if (!name || !price || !imageUrl) {
      return res.status(400).json({ message: 'Por favor, forneça nome, preço e URL da imagem.' });
    }

    const newProduct = new Product({
      name,
      price,
      imageUrl,
      description
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Erro ao adicionar produto ao DB:', error);
    res.status(400).json({ message: 'Erro ao adicionar produto', error: error.message });
  }
});

module.exports = router;