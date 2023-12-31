const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('@prisma/client');
const { isValidEmail } = require('../utils/isValidEmail');
const { messages } = require('../utils/messages.js');

const prismaDB = new prisma.PrismaClient();
const router = express.Router();

// Ruta para iniciar sesión
router.post('/auth/login', async (req, res) => {
  try {
    // Obtener email y password del cuerpo de la solicitud
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: messages.error.needProps });
      return;
    }

    // Verificar si el email existe en la base de datos
    const user = await prismaDB.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      res.status(404).json({ message: messages.error.userNotFound });
      return;
    }

    // Verificar si la contraseña es correcta
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ message: messages.error.wrongPassword });
      return;
    }

    // Crear un token JWT con una duración de 24 horas
    const token = jwt.sign({ userId: user.id }, 'secreto', { expiresIn: '24h' });

    res.cookie('auth_cookie', token, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400,
      path: '/',
    });

    res.status(200).json({ token, messages: messages.success.userLoggedIn});
  } catch (err) {
    // Manejo de errores generales
    console.error(err);
    res.status(500).json({ message: messages.error.default, error: err });
  }
});

module.exports = router;