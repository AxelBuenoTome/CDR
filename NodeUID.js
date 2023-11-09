const express = require('express');
const app = express();
const port = 3000;

// Simula una base de datos de UID a nombre
const baseDeDatos = {
  A12B34C7: 'Axel Bueno',
  // Agrega más UID y nombres según sea necesario
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

