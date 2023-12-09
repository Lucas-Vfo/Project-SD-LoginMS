const sqlite3 = require('sqlite3').verbose();

// Establecer conexión con la base de datos SQLite.
// Aquí estamos usando un archivo físico 'mydatabase.sqlite' para almacenamiento persistente.
// Esto permite que el servicio de autenticación acceda a la misma base de datos que el servicio de registro.
const db = new sqlite3.Database('./SDAuth.sqlite', (err) => {
  if (err) {
    // Si hay un error al conectar a la base de datos, se muestra en consola.
    console.error(err.message);
    throw err;
  }

  console.log('Conectado a la base de datos SQLite para el servicio de autenticación.');
});

module.exports = db;