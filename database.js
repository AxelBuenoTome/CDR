var mysql = require('mysql');
var id;
var input;
var query = "";


//establecemos la conexion con la base de datos
connection = mysql.createConnection(
    {host: 'localhost', user: 'root', password: 'pbetelematica', database: 'atenea'}
);

connection.connect((error) => {
    if (error){
        console.error('Error al conectar a la base de datos: ' + error.message);
    } else {
        console.log('Conexión establecida');
    }
});

//Implementamos las query


switch(input){
    case "timetable":
        query = "select * from timetable order by ";
        break;
    case "tasks":
        query = "select * from tasks order by date";
        break;
    case "marks":   //like es un comparador, mejor para cuando se usan varchar para evitar confusion
        query = "select * from marks WHERE id like '" + id + "' order by assignatura";
        break;
}


//dentro de query(query) para usar el switch case
connection.query('select * from students' , (err, results, fields) => {
    if(err){
        return console.log(err);
    }

    return console.log(results);
});


//Si queremos añadir más parametros a la query sencillamente los ponemos separados pro ,