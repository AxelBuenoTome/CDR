const express = require('express');
const app = express();
const port = 3000;

// Actualiza la base de datos con el nuevo UID y nombre
const baseDeDatos = {
  'A12B34C7': 'Axel Bueno', // Añadir el UID y el nombre a modo de prueba siguiendo este formato
  '8B3B2B96': 'Axel Bueno', // Agrega el nuevo UID y nombre
};

app.get('/obtenerNombre', (req, res) => {
  const uid = req.query.uid;
  if (baseDeDatos[uid]) {
    res.send(`UID de ${baseDeDatos[uid]}`);
  } else {
    res.send('UID no encontrado');
  }
});

app.listen(port, () => {
  console.log(`El servidor está en funcionamiento en el puerto ${port}`);
});


