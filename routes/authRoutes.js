// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Importe o modelo de Usuário
const jwt = require('jsonwebtoken');     // Importe o jsonwebtoken

// Função auxiliar para gerar JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h', // O token expira em 1 hora
  });
};

// @route   POST /api/auth/register
// @desc    Registrar um novo usuário
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Validação básica
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Por favor, insira todos os campos.' });
  }

  try {
    // Verificar se o usuário já existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Usuário com este email já existe.' });
    }

    // Criar novo usuário (a senha será criptografada automaticamente pelo hook 'pre-save' no modelo)
    const user = await User.create({
      name,
      email,
      password,
    });

    // Responder com os dados do usuário e um token JWT
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id), // Gera e envia o token
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Autenticar usuário e obter token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validação básica
  if (!email || !password) {
    return res.status(400).json({ message: 'Por favor, insira email e senha.' });
  }

  try {
    // Verificar se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas: Email não encontrado.' });
    }

    // Comparar a senha
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas: Senha incorreta.' });
    }

    // Se as credenciais forem válidas, responder com os dados do usuário e um token JWT
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
  }
});

module.exports = router;