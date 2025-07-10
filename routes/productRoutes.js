const express = require('express');
const router = express.Router(); 
const Product = require('../models/Product'); 
const { protect, admin } = require('../middleware/authMiddleware');
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos do DB:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar produtos.' });
  }
});

router.post('/', protect, admin,  async (req, res) => {
  try {
    const { name, price, imageUrl, description } = req.body;
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

router.put('/:id', protect, admin, async (req, res) => { 
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

router.delete('/:id', protect, admin, async (req, res) => { 
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
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