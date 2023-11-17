const express = require("express");
const mysql = require("mysql");

const app = express();
const port = 3000;
var uid;
var identificador;

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

app.get("*", (req, res) => {
  //let resultado = 'La vida es una lenteja, o la tomas o la dejas';
  let q;
  console.log("get function activated");
  console.log("req.url es: " + req.url);
  arrayUrl = req.url.split("?");
  paramUrl = new URLSearchParams(arrayUrl[1]);
  uid = paramUrl.get("uid");
  console.log("El parametro arrayUrl[0] es: " + arrayUrl[0]);


  switch (req.url) {
    //Ejemplo de url para uid /?uid=2E9D91B

    case "/?uid=" + uid:
      q = "SELECT nom FROM students WHERE id LIKE ?";
      values = uid;
      break;
    case "/timetable?" + arrayUrl[1]:
      q = "SELECT * FROM timetable ORDER BY dia";
      break;
    case "/tasks?" + arrayUrl[1]:
      q = "SELECT * FROM tasks ORDER BY fecha";
      break;
    case "/marks?" + arrayUrl[1]:
      q ="SELECT * FROM marks WHERE id LIKE '" + uid + "' ORDER BY assignatura";
      break;
    case "/students":
      q = "SELECT * FROM students";
      break;
    case "/":
      q = "SELECT * FROM students";
      break;
  }


  if (q == null) {
    console.error('Query was empty. The request was not known:' + req.url);
    return;
  }

  connection.query(q, values, (err, results, fields) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    resultado = results;
    res.status(200).json(resultado);
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
  console.log("Server is waiting for requests");
});