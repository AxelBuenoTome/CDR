const mysql = require('mysql');

//establecemos la conexion con la base de datos
const connection = mysql.createConnection(
    {host: '172.20.10.9', user: 'root', password: 'pbetelematica', database: 'atenea'}
);

connection.connect((error) => {
    if (error){
        console.error('Error al conectar a la base de datos: ' + error.message);
    } else {
        console.log('Conexión establecida');
    }
});

//Implementamos las query

connection.query('select * from estudiants where id = ?',[/*id tarjeta como parametro*/ ], (err, results, fields) => {
    if(err){
        return console.log(err);
    }
    return console.log(result);
});


//Si queremos añadir más parametros a la query sencillamente los ponemos separados pro ,