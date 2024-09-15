const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

const Login = {};

// Variable global para almacenar el código admin temporalmente
let codigoAdminTemporal = null;

// Transportador de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Función para generar un código
const generarCodigo = () => crypto.randomBytes(3).toString('hex');

// Controlador para enviar el código de administrador
Login.solicitarCodigo = async (req, res) => {
  try {
    const codigoAdmin = generarCodigo();
    codigoAdminTemporal = codigoAdmin; // Almacenar el código admin generado temporalmente

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Enviar el código a tu correo
      subject: 'Código de registro para nuevo administrador',
      text: `El código para registrar un nuevo administrador es: ${codigoAdmin}`,
    };

    // Enviar el código por correo
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: 'Error al enviar el código.' });
      } else {
        return res.status(200).json({ message: 'Código de administrador enviado exitosamente.' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor.' });
  }
};

// Registro de nuevos usuarios (miembros o administradores)
Login.registrar = async (req, res) => {
  const { usuario, contraseña, confirmarContraseña, adminCode } = req.body;

  // Validar los datos
  if (!usuario || !contraseña || !confirmarContraseña) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }

  if (contraseña !== confirmarContraseña) {
    return res.status(400).json({ error: 'Las contraseñas no coinciden.' });
  }

  try {
    // Verificar si el usuario ya existe
    const query = 'SELECT * FROM login WHERE Usuario = ?';
    db.query(query, [usuario], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error en la base de datos.' });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: 'El usuario ya existe.' });
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(contraseña, 10);

      // Verificar si se está registrando como admin o como miembro
      let rol = 'miembro'; // Rol por defecto

      if (adminCode) {
        if (adminCode === codigoAdminTemporal) {
          rol = 'admin';
        } else {
          return res.status(401).json({ error: 'Código de administrador incorrecto.' });
        }
      }

      // Insertar nuevo usuario con el rol adecuado
      const insertQuery = 'INSERT INTO login (Usuario, Contraseña, rol) VALUES (?, ?, ?)';
      db.query(insertQuery, [usuario, hashedPassword, rol], (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Error al registrar el usuario.' });
        }

        res.status(201).json({ message: `${rol.charAt(0).toUpperCase() + rol.slice(1)} registrado exitosamente.` });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor.' });
  }
};

// Verificación de login
Login.verificar = async (req, res) => {
  const { usuario, contraseña } = req.body;

  if (!usuario || !contraseña) {
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos.' });
  }

  try {
    const query = 'SELECT * FROM login WHERE Usuario = ?';
    db.query(query, [usuario], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error en la base de datos.' });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: 'Usuario no encontrado.' });
      }

      const user = results[0];
      const contraseñaValida = await bcrypt.compare(contraseña, user.Contraseña);

      if (!contraseñaValida) {
        return res.status(401).json({ error: 'Contraseña incorrecta.' });
      }

      // Generar JWT
      const token = jwt.sign({ usuario: user.Usuario, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({
        message: 'Autenticación exitosa',
        token,
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor.' });
  }
};

module.exports = Login;






