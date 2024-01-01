const express = require('express');
const { messages } = require('../utils/messages');
const router = express.Router();

// Ruta para cerrar sesión
router.post('/auth/logout', (req, res) => {
  try {
    // Eliminar la cookie de autenticación
    res.clearCookie('auth_cookie', { path: '/' });

    return res.status(200).json({ message: messages.success.userLoggedOut });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: messages.error.logoutFailed, error: err });
  }
});

module.exports = router;