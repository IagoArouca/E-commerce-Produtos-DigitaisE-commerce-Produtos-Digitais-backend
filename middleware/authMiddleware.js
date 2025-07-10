const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password'); 

      next(); 
    } catch (error) {
      console.error('Token JWT inválido ou expirado:', error);
      res.status(401).json({ message: 'Não autorizado, token falhou' });
    }
  }
  if (!token) {
    res.status(401).json({ message: 'Não autorizado, nenhum token fornecido' });
  }
};
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); 
  } else {
    res.status(403).json({ message: 'Não autorizado, apenas administradores podem acessar' }); 
  }
};

module.exports = { protect, admin };