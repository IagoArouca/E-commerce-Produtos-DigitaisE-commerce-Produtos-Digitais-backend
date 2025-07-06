// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Importa o modelo de usuário

const protect = async (req, res, next) => {
  let token;

  // Verifica se o token está presente no cabeçalho Authorization (Bearer Token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extrai o token do cabeçalho (formato: "Bearer TOKEN")
      token = req.headers.authorization.split(' ')[1];

      // Verifica e decodifica o token usando a chave secreta
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Busca o usuário no banco de dados pelo ID do token (exclui a senha)
      // e anexa o usuário ao objeto de requisição (req.user)
      req.user = await User.findById(decoded.id).select('-password'); 

      next(); // Chama o próximo middleware/rota
    } catch (error) {
      console.error('Token JWT inválido ou expirado:', error);
      res.status(401).json({ message: 'Não autorizado, token falhou' });
    }
  }

  // Se não houver token, retorna erro de não autorizado
  if (!token) {
    res.status(401).json({ message: 'Não autorizado, nenhum token fornecido' });
  }
};

// Middleware para verificar se o usuário é administrador
const admin = (req, res, next) => {
  // Assume que o middleware 'protect' já foi executado e req.user está disponível
  if (req.user && req.user.isAdmin) {
    next(); // Se for admin, prossegue
  } else {
    res.status(403).json({ message: 'Não autorizado, apenas administradores podem acessar' }); // 403 Forbidden
  }
};

module.exports = { protect, admin };