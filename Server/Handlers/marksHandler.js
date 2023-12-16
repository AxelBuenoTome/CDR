const express = require("express");
const { get } = require("http");//No necesario en esta version
const { URLSearchParams } = require("url");
const router = express.Router();

console.log('En el handler de notas');

module.exports = function (pool) {
  router.get("/marks", async (req, res) => {
        try{
            let q = "SELECT * FROM marks WHERE";
            let values = [];
            let limit = "";

            //Parsing
            urlString = new URL(`http://localhost${req.url}`);
            const parsedUrl = new URL(urlString);
            const params = new URLSearchParams(parsedUrl.search);
            
            console.log(params);

            const operators = {
                gte: '>=',
                lte: '<=',
                eq: '=',
                gt: '>',
                lt: '<'
            };
            const regex = /^(.+)\[(\w+)\]$/;

            params.forEach((value, key) => {
                if(key == 'limit'){
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

            //Executem la query
            dbutils.queryDatabase(q, values, res,(results)=>{
                res.status(200).json(results);
            });

        }catch(error){
            console.log(error);
            console.log('Error al extraer información en marks');
            res.status(500).json({error: 'Internal server Error'});
        }
    });
  
  return router;
};
