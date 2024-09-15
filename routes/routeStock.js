const express = require('express');
const Stock = require('../controllers/controllerStock');
const routerStock = express.Router();

// Mostrar stock
routerStock.get('/', Stock.mostrar);

// Actualizar stock
routerStock.put('/:id', Stock.actualizar);

module.exports = routerStock;


