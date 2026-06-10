const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'pigfit_secret_key_2024';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'Admin') {
    return res.status(403).json({ error: 'Acceso denegado. Solo administradores.' });
  }
  next();
};

const coachMiddleware = (req, res, next) => {
  if (!req.user || (req.user.role !== 'Coach' && req.user.role !== 'Admin')) {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol Coach o Admin.' });
  }
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  coachMiddleware,
  JWT_SECRET
};
