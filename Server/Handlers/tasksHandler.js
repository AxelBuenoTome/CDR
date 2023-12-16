const express = require('express');
const { URLSearchParams } = require('url');
const router = express.Router();
const dbutils = require('../utils');

module.exports = function (){
    router.get("/tasks", async(req,res)=>{
        try{
            let q = "";
            let values = [];
            let limit = "";
            //console.log(req.url);
            //Captura de parametros
            //const params = new URLSearchParams(req.url);
            //const url = new URL(`http://localhost${req.url}`);
            const params = new URLSearchParams(req.url.split("?")[1]);
            console.log(params);
            q = "SELECT * FROM tasks WHERE";

            const operators = {
                gte: '>=',
                lte: '<=',
                eq: '=',
                gt: '>',
                lt: '<'
            };
            //old regex /^(.+)\[(\w+)\]$/ O TAMBIEN SIN OP /^(\w+)(?:\[\w+\])?$/
            const regex = /^(.+)\[(\w+)\]$/;
            
            params.forEach((value, key) => {
                //Skipejem uid
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

            if(q.endsWith(" AND")){
                q = q.slice(0, -4);
            }
            if(q.endsWith(" WHERE")){
                q = q.slice(0, -6);
            }
            q += limit;
            
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
