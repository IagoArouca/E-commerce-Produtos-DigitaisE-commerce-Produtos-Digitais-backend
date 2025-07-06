// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router(); // Cria um novo router Express
const Product = require('../models/Product'); // Importa o modelo de Produto
const { protect, admin } = require('../middleware/authMiddleware');

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
router.post('/', protect, admin,  async (req, res) => {
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

// NOVO: Adicionar rotas para obter um produto por ID, atualizar e deletar
// @route   GET /api/products/:id
// @desc    Obter um produto específico por ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Produto não encontrado.' });
    }
  } catch (error) {
    console.error('Erro ao buscar produto por ID:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});


// @route   PUT /api/products/:id
// @desc    Atualizar um produto existente
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => { // Protegida por 'protect' e 'admin'
  try {
    const { name, price, imageUrl, description } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.imageUrl = imageUrl || product.imageUrl;
      product.description = description || product.description;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Produto não encontrado.' });
    }
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(400).json({ message: 'Erro ao atualizar produto', error: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Remover um produto
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => { // Protegida por 'protect' e 'admin'
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne(); // Use deleteOne() ou remove() dependendo da versão do Mongoose
      res.json({ message: 'Produto removido com sucesso.' });
    } else {
      res.status(404).json({ message: 'Produto não encontrado.' });
    }
  } catch (error) {
    console.error('Erro ao remover produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao remover produto.', error: error.message });
  }
});

module.exports = router;