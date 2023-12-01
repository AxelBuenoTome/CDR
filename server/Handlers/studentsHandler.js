
const express = require('express');
const { URLSearchParams } = require('url');
const router = express.Router();

module.exports = function (pool){

    router.get('/students', async(req,res)=>{
        //Demanem la connexió a la base de dades
        try{
            let q = "";
            let values=[];
            const connection = await pool.getConnection();

            //Hacemos el parsing de los parametros que pueda haber en la url
            const url = new URL(`http://localhost${req.url}`);
            const params = new URLSearchParams(url.search);

            if(params.has("uid")){
                const uidValue = params.get("uid");
                q = "SELECT nom FROM students WHERE id LIKE ?";
                values = [uidValue];
            } else {
                q = "SELECT * FROM students";
            }

            const [rows] = await connection.query(q,values);
            connection.release();
            res.json(rows);
            
        }catch (error){
            console.error('Error al extraer información de los estudiantes de la base de datos:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
        
        
    });
    return router;
}