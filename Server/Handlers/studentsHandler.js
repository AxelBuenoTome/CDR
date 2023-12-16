
const express = require('express');
const { URLSearchParams } = require('url');
const router = express.Router();
const dbutils = require('../utils');

module.exports = function (){

    router.get('/students', async(req,res)=>{
        //Demanem la connexió a la base de dades
        try{
            let q = "";
            let values=[];

            //Hacemos el parsing de los parametros que pueda haber en la url
            const url = new URL(`http://localhost${req.url}`);
            const params = new URLSearchParams(url.search);

            if(params.has("uid")){
                const uidValue = params.get("uid");
                q = `SELECT nom FROM students WHERE uid = ?`;
                values = [uidValue];
            } else {
                q = "SELECT * FROM students";
            }

            //Ejecutamos la query
            dbutils.queryDatabase(q, values, res,(results)=>{
                res.status(200).json(results);
            });
            
        }catch (error){
            console.error('Error al extraer información de los estudiantes de la base de datos:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });
    return router;
}
