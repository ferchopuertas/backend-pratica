// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrae el token del header

  if (token == null) return res.status(401).json({ error: 'Token requerido' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });

    req.user = user; // Guarda la información del usuario en la request
    next(); // Pasa el control al siguiente middleware o ruta
  });
};

module.exports = authenticateToken;
