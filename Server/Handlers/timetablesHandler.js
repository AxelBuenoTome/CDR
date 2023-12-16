const express = require('express');
const { URLSearchParams } = require('url');
const dbutils = require("../utils");
const router = express.Router();


module.exports = function (){
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

            //Logica para ordenar por dias y horas

            //Aixo ens retorna el dia de la setmana en format curt i en angles
            const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'short' });

            //Fem un vector que partirem per el dia actual, i reenganxem amb els dies
            //que van despres del dia actual. 
            //Despres de aixo enganxa els dies que tenia abans al final,
            // mantenint l'orde natural dels dies
            
            const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const orderedDays = [...daysOfWeek.slice(daysOfWeek.indexOf(currentDay)), ...daysOfWeek.slice(0, daysOfWeek.indexOf(currentDay))];
            
            q += ` ORDER BY FIELD(day, '${currentDay}', '${orderedDays.join("','")}') , hour ASC` + limit;
            console.log("Esta es la q: " + q);

            //Executem query
            dbutils.queryDatabase(q, values, res,(results)=>{
                res.status(200).json(results);
            });
            
        }catch(error){
            console.error('Error al extraer información de los estudiantes de la base de datos:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });
    return router;
}
