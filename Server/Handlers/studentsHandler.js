
const express = require('express');
const { URLSearchParams } = require('url');
const router = express.Router();

module.exports = function (pool){

    router.get('/students', async(req,res)=>{
        //Demanem la connexió a la base de dades
        try{
            let q = "";
            let values=[];

            //Hacemos el parsing de los parametros que pueda haber en la url
            const url = new URL(`http://localhost${req.url}`);
            const params = new URLSearchParams(url.search);
            
            /*
            params.forEach((value, key) => {
                q = ``
                console.log(value, key);
            });*/

            if(params.has("uid")){
                const uidValue = params.get("uid");
                q = `SELECT nom FROM students WHERE uid = ?`;
                values = [uidValue];
            } else {
                q = "SELECT * FROM students";
            }

            //console.log('in students handler');
            //console.log(q);
            //Un cop tenim la query preparada fem la pregunta a la base de dades
            //Conexió
            
            pool.getConnection((err, connection)=>{
                if(err){
                    console.error('Error getting connection from pool: ', err);
                    return;
                }
                //Executem la query
                connection.query(q, values, (err, results, fields) => {
                    if (err) {
                    console.error(err);
                    res.status(500).json({ error: "Internal Server Error" });
                    return;
                    }
                    //Retornem els valors en forma de json
                    res.status(200).json(results);
                });  
                //Deixem anar la connexió  
                connection.release();
            });
            
        }catch (error){
            console.error('Error al extraer información de los estudiantes de la base de datos:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });
    return router;
}