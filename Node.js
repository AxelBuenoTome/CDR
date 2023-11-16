const express = require('express');
const app = express();
const port = 3000;

// Base de datos simulada con información de notas
const baseDeDatos = {
  'A12B34C7': {
    nombre: 'Axel Bueno',
    notas: [
      { subject: 'AST', name: 'Lab1', mark: 3.2 },
      { subject: 'PBE', name: 'puzzle1', mark: 2.5 },
      { subject: 'ICOM', name: 'parcial1', mark: 3.5 },
      { subject: 'PIE', name: 'parcial1', mark: 0.5 },
    ],
  },
  '8B3B2B96': {
    nombre: 'Axel Bueno',
    notas: [
      { subject: 'AST', name: 'Lab1', mark: 3.2 },
      { subject: 'PBE', name: 'puzzle1', mark: 2.5 },
      { subject: 'ICOM', name: 'parcial1', mark: 3.5 },
      { subject: 'PIE', name: 'parcial1', mark: 0.5 },
    ],
  },
  '2E9D91B': {
    nombre: 'Oliver Sykes',
    notas: [
      { subject: 'RP', name: 'Lab1', mark: 8.2 },
      { subject: 'TD', name: 'Lab8', mark: 7.5 },
      { subject: 'ICOM', name: 'parcial1', mark: 5.5 },
      { subject: 'PIE', name: 'parcial1', mark: 9.5 },
    ],
  },
};

// Ruta para obtener notas en formato JSON
app.get('/obtenerNotas', (req, res) => {
  const uid = req.query.uid;
  if (baseDeDatos[uid]) {
    // Si el UID se encuentra en la base de datos, responde con las notas en formato JSON
    res.json(baseDeDatos[uid].notas);
  } else {
    // Si el UID no se encuentra en la base de datos, responde con un mensaje de error
    res.status(404).json({ error: 'UID no encontrado' });
  }
});

// Ruta existente para obtener el nombre
app.get('/obtenerNombre', (req, res) => {
  const uid = req.query.uid;
  if (baseDeDatos[uid]) {
    res.send(`${baseDeDatos[uid].nombre}`);
  } else {
    res.status(404).send('UID no encontrado');
  }
});

app.listen(port, () => {
  console.log(`El servidor está en funcionamiento en el puerto ${port}`);
});
