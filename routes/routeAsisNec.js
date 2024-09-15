const express = require('express');
const AsisNec = require('../controllers/controllerAsisNec');
const routerAsisNec = express.Router();

// Mostrar stock
routerAsisNec.get('/', AsisNec.mostrar);

//Actuzalizar Asistencias Necesarias
routerAsisNec.put('/:id', AsisNec.actualizar)



module.exports = routerAsisNec;