const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

// Ruta POST para el inicio de sesión de los usuarios.
router.post('/login', (req, res) => {
  // Extraer el nombre de usuario y la contraseña del cuerpo de la solicitud.
  const { username, password } = req.body;

  // Consulta SQL para buscar al usuario en la base de datos por su nombre de usuario.
  const sql = 'SELECT * FROM users WHERE username = ?';
  db.get(sql, [username], (err, user) => {
    if (err) {
      // Si hay un error al buscar al usuario, se devuelve un error de servidor.
      console.error(err);
      return res.status(500).send('Error en el servidor');
    }

    if (!user) {
      // Si no se encuentra al usuario, se devuelve un error de autenticación.
      return res.status(401).send('Usuario no encontrado');
    }

    // Comparar la contraseña proporcionada con la almacenada en la base de datos.
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        // Si las contraseñas coinciden, se genera un token JWT.
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Se devuelve el token al cliente.
        res.json({ token });
      } else {
        // Si las contraseñas no coinciden, se devuelve un error de autenticación.
        res.status(401).send('Contraseña incorrecta');
      }
    });
  });
});

module.exports = router;