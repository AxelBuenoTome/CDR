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

  //Problema amb favicon, icona del buscador,
  //No aplicable si la request es fa desde la raspberry
  if (req.url == "/favicon.ico") {
    return;
  }

  //Console logs per debuggejar el codi
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
      values = [currentDate];
    } else {
      // Cas general, només es demana tasks
      q = "SELECT * FROM tasks ORDER BY fecha";
      values = [];
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
      
    } 
    
    else { //Cas general si no hi ha condició
      console.log('caca');
      q = `
      SELECT * FROM timetable
      ORDER BY
        CASE dia
          WHEN 'Mon' THEN 1
          WHEN 'Tue' THEN 2
          WHEN 'Wed' THEN 3
          WHEN 'Thu' THEN 4
          WHEN 'Fri' THEN 5
          WHEN 'Sat' THEN 6
          WHEN 'Sun' THEN 7
          ELSE 8  
        END, hora
    `;
    }console.log(q);

    // Handle limit
    if (params.has("limit")) {
      const limitValue = params.get("limit");
      q += ` LIMIT ${limitValue}`;
    }

    //Handler de notes
  } else if (req.url.startsWith("/marks")) {
    const params = new URLSearchParams(req.url.split("?")[1]);
    let uidValue = params.get("uid");
    //Hem de comprovar on esta la uid, si al primer split o al segon
    if (!uidValue) {
        uidValue = new URLSearchParams(req.url.split("?")[2]).get("uid");
    }

    if (uidValue) {
        q = "SELECT * FROM marks WHERE id LIKE ?";
        values = [uidValue];
        //Handler de les condicions de mark
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
    const params = new URLSearchParams(req.url.split("?")[1]);
    q = "SELECT * FROM students";
    values = []; //Values es queda buit
    if(params.has("uid")){
      uidValue = params.get("uid");
      q = "SELECT nom FROM students WHERE id LIKE ?";
      values = [uidValue];
    }
  } else {
    //Cas general
    q = "SELECT * FROM students";
    values = [];
  }

  //------------------------------------------------------------------------------------
  if (q == null) {
    console.error("Query was empty. The request was not known:" + req.url);
    return;
  }
//Executem la query
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
