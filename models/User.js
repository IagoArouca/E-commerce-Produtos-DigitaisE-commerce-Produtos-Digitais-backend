// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Importe o bcryptjs

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Garante que o email seja único
  },
  password: {
    type: String,
    required: true,
  },
  // Pode adicionar outros campos como isAdmin, address, phone, etc.
}, { timestamps: true });

// Pré-save hook para criptografar a senha antes de salvar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) { // Só criptografa se a senha foi modificada (ou é nova)
    next();
  }
  const salt = await bcrypt.genSalt(10); // Gera um "sal" aleatório
  this.password = await bcrypt.hash(this.password, salt); // Criptografa a senha
  next();
});

// Método para comparar senhas (para o login)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // Compara a senha digitada com a criptografada
};

const User = mongoose.model('User', userSchema);

module.exports = User;