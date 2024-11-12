const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Acceso denegado' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verified.userId; // Almacena el ID del usuario en req.userId
    next();
  } catch (err) {
    res.status(400).json({ message: 'Token no válido' });
  }
};