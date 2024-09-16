// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routerMiembros = require('./routes/routeMiembros');
const routerStock = require('./routes/routeStock');
const routerAsisNec = require('./routes/routeAsisNec');
const routerLogin = require('./routes/routeLogin');
const authenticateToken = require('./middleware/auth'); // Importa el middleware
const app = express();
const PORT = process.env.PORT || 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

// Rutas públicas (no requieren autenticación)
app.use('/api/login', routerLogin);

// Rutas protegidas (requieren autenticación)
app.use('/api/miembros', authenticateToken, routerMiembros);
app.use('/api/stock', authenticateToken, routerStock);
app.use('/api/asisnec', authenticateToken, routerAsisNec);

app.listen(PORT, () => {
  console.log('Server running on port 3000');
});






