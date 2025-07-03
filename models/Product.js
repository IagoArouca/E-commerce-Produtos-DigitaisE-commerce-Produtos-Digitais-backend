// backend/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String, required: false },
  // Poderíamos adicionar outras propriedades como categoria, estoque, etc.
}, { timestamps: true }); // Adiciona campos createdAt e updatedAt automaticamente

const Product = mongoose.model('Product', productSchema);

module.exports = Product;