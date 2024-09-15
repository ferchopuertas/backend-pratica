const express = require('express');
const Login = require('../controllers/controllerLogin');
const routerLogin = express.Router();

routerLogin.post('/', Login.verificar);
routerLogin.post('/register', Login.registrar);
routerLogin.get('/request-admin-code', Login.solicitarCodigo);

module.exports = routerLogin;

