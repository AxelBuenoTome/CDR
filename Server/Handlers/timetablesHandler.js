const express = require('express');
const { URLSearchParams } = require('url');
const router = express.Router();

module.exports = function (pool){
    router.get("/timetable", async(req, res)=>{
        try{
            let q ="";
            let values =[];
            let limit = "";

            const params = new URLSearchParams(req.url.split("?")[1]);
            q = "SELECT * FROM timetable WHERE";

            const operators = {
                gte: '>=',
                lte: '<=',
                eq: '=',
                gt: '>',
                lt: '<'
            };

            const regex = /^(.+)\[(\w+)\]$/;
            //Skipejem uid
            params.forEach((value, key) => {
                if(key=="uid"){}

                else if(key == 'limit'){
                    limit = ` LIMIT ${parseInt(value, 10) || 1}`;

                }else{
                    const match = key.match(regex);
                    if (match) {
                        const [, field, op] = match;
                        var campo = field.split("[")[0];
                        if (operators[op]) {
                            q += ` ${campo} ${operators[op]} '${value}' AND`;
                        }
                    } else {
                        q += ` ${key} = '${value}' AND`;
                    } 
                }
            });

            //Acabem de polir la query
            if(q.endsWith(" AND")){
                q = q.slice(0, -4);
            }
            if(q.endsWith(" WHERE")){
                q = q.slice(0, -6);
            }

            //Aixo ens retorna el dia de la setmana en format curt i en angles
            const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'short' });

            //Fem un vector que partirem per el dia actual, i reenganxem amb els dies
            //que van despres del dia actual. 
            //Despres de aixo enganxa els dies que tenia abans al final,
            // mantenint l'orde natural dels dies
            
            const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const orderedDays = [...daysOfWeek.slice(daysOfWeek.indexOf(currentDay)), ...daysOfWeek.slice(0, daysOfWeek.indexOf(currentDay))];
            
            q += ` ORDER BY FIELD(day, '${currentDay}', '${orderedDays.join("','")}') , hour ASC` + limit;

            //Lógica para ordenar por dias y horas


            console.log("Esta es la q: " + q);

            //Executem la query
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
            

        }catch(error){
            console.error('Error al extraer información de los estudiantes de la base de datos:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });
    return router;
}