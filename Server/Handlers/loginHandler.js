const express = require('express');
const { URLSearchParams } = require('url');
const router = express.Router();

module.exports = function (pool){
    router.get("/login", async(req,res)=>{
        try{
            let q = "";
            let values =[];

            const params = new URLSearchParams(req.url.split("?")[1]);
            const nombre = params.get("nombre");
            const uid = params.get("uid");

            if(!nombre || !uid){
                return res.status(400).json({ error: "Missing parameters" });
            }

            q = 'SELECT * FROM students WHERE nom = ? AND uid = ?';
            values = [nombre, uid];

            console.log(params);

        pool.getConnection((err, connection)=>{
            if(err){
                console.error('Error getting connection from pool: ', err);
                return;
            }
            //Executem la query
            connection.query(q, values, (err, results, fields) => {
                connection.release();
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: "Internal Server Error" });;
                }
                // Comprovem si hi ha match
                const isLoginSuccessful = results.length > 0;
                if(isLoginSuccessful){
                    res.status(200).json({ Success: isLoginSuccessful });
                }else{
                    res.status(200).json({error: "Las credenciales no concuerdan"});
                }
            });    
        });


        }catch(error){
            console.error('Error al extraer información de los estudiantes de la base de datos:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }

    });
    return router;
}