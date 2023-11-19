const express = require("express");
const mysql = require("mysql");

const app = express();
const port = 3000;
var uid;

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

  //Problema amb favicon
  if (req.url == "/favicon.ico") {
    return;
  }

  let q;
  let values;
  console.log("get function activated");
  console.log("req.url es: " + req.url);
  arrayUrl = req.url.split("?");
  paramUrl = new URLSearchParams(arrayUrl[1]);
  uid = paramUrl.get("uid");
  console.log("El parametro arrayUrl[0] es: " + arrayUrl[0]);

  //---------------------------------------------------------------------------------------

  //Requests de tasks casos
  if (req.url.startsWith("/tasks")) {
    const params = new URLSearchParams(req.url.split("?")[1]);
    if (params.has("date")) {
      dateValue = params.get("date");
      if (dateValue == "now") {
        //Si es now, solo mostrara en pantalla las tareas de HOY!
        dateValue = new Date().toISOString().split("T")[0];
      }
      q = `SELECT * FROM tasks WHERE fecha = ? ORDER BY fecha`;
      values = [dateValue];
    } else if (params.has("date[gte]")) {
      currentDate = params.get("date[gte]");
      if (currentDate == "now") {
        currentDate = new Date().toISOString().split("T")[0];
      }
      q = `SELECT * FROM tasks WHERE fecha >= ? ORDER BY fecha`;
      values = [currentDate];
    } else if (params.has("date[lte]")) {
      currentDate = params.get("date[lte]");
      if (currentDate == "now") {
        currentDate = new Date().toISOString().split("T")[0];
      }
      q = `SELECT * FROM tasks WHERE fecha <= ? ORDER BY fecha`;
      values = [currentDate]; // Set values for the query
    } else {
      // Handle other /tasks cases if needed
      q = "SELECT * FROM tasks ORDER BY fecha";
      values = []; // Set values for the query
    }
    //Comprovem si hi ha limit
    if (params.has("limit")) {
      const limitValue = params.get("limit");
      q += ` LIMIT ${limitValue}`;
    }

    //Requests de timetables casos-----------------------------------------------
  } else if (req.url.startsWith("/timetable")) {
    let currentDay;

    const params = new URLSearchParams(req.url.split("?")[1]);
    if (params.has("day")) {
      currentDay = params.get("day");
      q = `SELECT * FROM timetable WHERE dia = ${connection.escape(currentDay)}`;
      //Handler de les hores.
      if (params.has("hour[gte]")) {
        const hourGte = params.get("hour[gte]");
        q += ` AND hora >= ${connection.escape(hourGte)}`;
      } else if (params.has("hour[gt]")) {
        const hourGt = params.get("hour[gt]");
        q += ` AND hora > ${connection.escape(hourGt)}`;
      } else if (params.has("hour[lte]")) {
        const hourLte = params.get("hour[lte]");
        q += ` AND hora <= ${connection.escape(hourLte)}`;
      } else if (params.has("hour[lt]")) {
        const hourLt = params.get("hour[lt]");
        q += ` AND hora < ${connection.escape(hourLt)}`;
      }

      q += " ORDER BY hora";
      console.log("caca");
    } else {
      // Handle other /timetables cases if needed
      q = "SELECT * FROM timetable ORDER BY hora"; // Order by hora
    }

    // Handle limit
    if (params.has("limit")) {
      const limitValue = params.get("limit");
      q += ` LIMIT ${limitValue}`;
    }

    //Handler de notes
  } else if (req.url.startsWith("/marks")) {
    const params = new URLSearchParams(req.url.split("?")[1]);
    let uidValue = params.get("uid");

    if (!uidValue) {
        // Check split[2] if uid is not in split[1]
        uidValue = new URLSearchParams(req.url.split("?")[2]).get("uid");
    }

    if (uidValue) {
        q = "SELECT * FROM marks WHERE id LIKE ?";
        values = [uidValue];

        // Handle mark conditions
        if (params.has("mark[lte]")) {
            markValue = params.get("mark[lte]");
            q += " AND nota <= ?";
            values.push(markValue);
        } else if (params.has("mark[gte]")) {
            markValue = params.get("mark[gte]");
            q += " AND nota >= ?";
            values.push(markValue);
        } else if (params.has("mark[lt]")) {
            markValue = params.get("mark[lt]");
            q += " AND nota < ?";
            values.push(markValue);
        } else if (params.has("mark[gt]")) {
            markValue = params.get("mark[gt]");
            q += " AND nota > ?";
            values.push(markValue);
        }
    } else if(!uidValue){
        console.log("Falta la uid!");
        return;
    } else {
      q = "SELECT * FROM marks";
      values = [];
    }

    q += ` ORDER BY assignatura`;
    console.log(q);
    //Comprovem si hi ha limit
    if (params.has("limit")) {
      const limitValue = params.get("limit");
      q += ` LIMIT ${limitValue}`;
    }

    //Requests de estudiants-------------------------------------------------------------
  } else if (req.url.startsWith("/students") || req.url === "/") {
    q = "SELECT * FROM students";
    values = []; // Set values for the query
  } else if (req.url.startsWith("/?uid=")) {
    const uidValue = req.url.split("=")[1];
    q = "SELECT nom FROM students WHERE id LIKE ?";
    values = [uidValue]; // Set values for the query
  } else {
    // Handle default case or unknown URL
    q = "SELECT * FROM students";
    values = []; // Set values for the query
  }

  //------------------------------------------------------------------------------------
  if (q == null) {
    console.error("Query was empty. The request was not known:" + req.url);
    return;
  }

  connection.query(q, values, (err, results, fields) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Continue handling the results as needed
  });

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
