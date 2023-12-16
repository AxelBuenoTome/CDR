const express = require("express");
const mysql = require("mysql");
const app = express();
const port = 3000;
const cors = require('cors');


// Creem la connexió pool que permet més de una connexió
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'pbetelematica',
    database: 'atenea',
    waitForConnections: true,
    connectionLimit: 10, 
    queueLimit: 0
});


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Definición de los handlers
//Por ahora solo esta hecho students handler
const studentsHandler = require("./Handlers/studentsHandler")(pool);
const marksHandler = require("./Handlers/marksHandler")(pool);
const tasksHandler = require("./Handlers/tasksHandler")(pool);
const timetablesHandler = require("./Handlers/timetablesHandler")(pool);
const loginHandler = require("./Handlers/loginHandler")(pool);


//Rutas principales a los handlers de las 4 tablas
app.get("/students", studentsHandler);
app.get("/marks", marksHandler);
app.get("/tasks", tasksHandler);
app.get("/timetable", timetablesHandler);
app.get("/login", loginHandler);

console.log("Pasado handlers");

//Ruta por defecto si no hay coincidencia con ninguna de las anteriores
app.use((req, res) => {
    res.status(404).json({error: "Ruta no encontrada"});
});



//Iniciamos el servidor
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
  console.log("Server is waiting for requests");
});