// routes/routeMiembros.js
const express = require('express');
const Miembros = require('../controllers/controllerMiembros');
const routerMiembros = express.Router();

// Mostrar miembros
routerMiembros.get('/', Miembros.mostrar);

// Agregar miembros
routerMiembros.post('/', Miembros.crear);

// Actualizar miembro
routerMiembros.put('/:id', Miembros.actualizar);

// Eliminar miembro
routerMiembros.delete('/:id', Miembros.eliminar);

//Calcular Cobros
routerMiembros.get('/calcular-cobros', Miembros.calcularCobros)

//Cobro Pagado
routerMiembros.get('/pago-cobros/:id', Miembros.Cobrar)

routerMiembros.post('/miembro-existe', Miembros.verificar)

routerMiembros.post('/update-asistencias', Miembros.sumarAsis)

module.exports = routerMiembros;



