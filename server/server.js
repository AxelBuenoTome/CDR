const express = require("express");
const mysql = require("mysql");
const app = express();
const port = 3000;
const cors = require('cors');

//Definición de los handlers
var usersHandler = require("./handlers/usersHandler");
var marksHandler = require("./handlers/marksHandler");
var tasksHandler = require("./handlers/tasksHandler");
var timetablesHandler = require("./handlers/timetablesHandler");


const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "pbetelematica",
  database: "atenea",
});

connection.connect((error) => {
  if (error) {
    console.error("Error connecting to the database: " + error.message);
  } else {
    console.log("Connection to the Server-Database established");
  }
});

//Rutas principales a los handlers de las 4 tablas
app.get("/students", usersHandler);
app.get("/marks", marksHandler);
app.get("/tasks", tasksHandler);
app.get("/timetables", timetablesHandler);

//Ruta por defecto si no hay coincidencia con ninguna de las anteriores
app.use((req, res) => {
    res.status(404).json({});
});



//Iniciamos el servidor
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
  console.log("Server is waiting for requests");
});